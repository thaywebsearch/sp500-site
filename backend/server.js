import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSectorIntelligence } from './sector-intelligence.mjs';

const app = express();

// Configurar __dirname para módulos ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5001;

// Setores válidos (allowlist explícita). Tem de espelhar
// frontend/dashboard/src/config.js. É a ÚNICA lista aceite por
// /api/setor/:setor: o parâmetro nunca é usado para construir caminhos sem
// passar primeiro por esta verificação.
const SETORES_VALIDOS = new Set([
  'communication-services',
  'consumer-discretionary',
  'consumer-staples',
  'energy',
  'financials',
  'health-care',
  'industrials',
  'information-technology',
  'materials',
  'real-estate',
  'utilities',
]);

// Formato aceite de um id de setor: minúsculas, dígitos e hífen.
const SETOR_RE = /^[a-z][a-z0-9-]{0,40}$/;

// A API corre atrás de um proxy (Render/Railway) -> confiar no 1º salto para que
// req.ip (usado pelo rate limiting) seja o IP real do cliente.
app.set('trust proxy', 1);

// Versão da API, lida do arquivo VERSION (fallback se ausente)
function lerVersao() {
  try {
    return fs.readFileSync(path.join(__dirname, 'VERSION'), 'utf-8').trim();
  } catch {
    return 'desconhecida';
  }
}
const VERSION = lerVersao();

// ============ CACHE EM MEMÓRIA ============
// Evita ler e parsear os JSONs do disco a cada request. A invalidação é feita
// por data de modificação (mtimeMs) e tamanho do ficheiro: enquanto o ficheiro
// não muda, devolve o valor já parseado; quando muda, relê e reparseia.
const ficheirosCache = new Map(); // caminho -> { chave, value }
const diretoriosCache = new Map(); // caminho -> { mtimeMs, files }
let empresasCache = { assinatura: null, value: [] };

/** Assinatura de invalidação de um ficheiro: mtime + tamanho. */
function assinaturaFicheiro(caminho) {
  const info = fs.statSync(caminho);
  return `${info.mtimeMs}:${info.size}`;
}

/** Lê e parseia um JSON, reutilizando o resultado em cache se o ficheiro não mudou. */
function lerJsonComCache(caminho) {
  const chave = assinaturaFicheiro(caminho);
  const emCache = ficheirosCache.get(caminho);
  if (emCache && emCache.chave === chave) {
    return emCache.value;
  }
  const value = JSON.parse(fs.readFileSync(caminho, 'utf-8'));
  ficheirosCache.set(caminho, { chave, value });
  return value;
}

/** Lista o conteúdo de um diretório, reutilizando o resultado se o mtime não mudou. */
function lerDiretorioComCache(caminho) {
  const { mtimeMs } = fs.statSync(caminho);
  const emCache = diretoriosCache.get(caminho);
  if (emCache && emCache.mtimeMs === mtimeMs) {
    return emCache.files;
  }
  const files = fs.readdirSync(caminho);
  diretoriosCache.set(caminho, { mtimeMs, files });
  return files;
}

// ============ CACHE HTTP ============
// Os dados servidos são públicos e mudam no máximo a cada ~48 h (ou 1×/dia no
// resumo). max-age curto mantém a informação fresca; stale-while-revalidate
// deixa o browser/CDN servir a cópia enquanto revalida em segundo plano.
const CACHE_MAX_AGE_PADRAO = 300; // 5 min
const CACHE_SWR_PADRAO = 86400; // 24 h

/** Permite cache partilhado (browser + CDN) com revalidação em background. */
function cachePublico(res, maxAge = CACHE_MAX_AGE_PADRAO, swr = CACHE_SWR_PADRAO) {
  res.set('Cache-Control', `public, max-age=${maxAge}, stale-while-revalidate=${swr}`);
}

/** Impede qualquer cache (erros, health check, dados sabidamente obsoletos). */
function semCache(res) {
  res.set('Cache-Control', 'no-store');
}

// Data de referência da "Curiosidade do Dia": neste dia a lista começa
// pela 1ª empresa em ordem alfabética e avança 1 posição por dia.
const DATA_INICIO_CURIOSIDADE = new Date('2026-10-08T00:00:00');
const MS_POR_DIA = 24 * 60 * 60 * 1000;

// ============ MIDDLEWARE ==========

// Cabeçalhos de segurança. CSP desativada (API JSON, sem HTML) e CORP
// cross-origin porque o frontend (GitHub Pages) consome a API noutra origem.
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Limites de pedidos para travar abuso (a API é pública e /api/historico faz
// pedidos outbound ao Yahoo): um limite global + um mais apertado no histórico.
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { sucesso: false, erro: 'Demasiados pedidos. Tente novamente mais tarde.' },
});

const historicoLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { sucesso: false, erro: 'Demasiados pedidos. Tente novamente mais tarde.' },
});

/** Normaliza uma origem: remove espaços e barras finais (o browser nunca as envia). */
function normalizarOrigem(origem) {
  return origem.trim().replace(/\/+$/, '');
}

// CORS: origens permitidas via env CORS_ORIGINS (plural, separadas por vírgula).
// RESTRITIVO por omissão: sem CORS_ORIGINS nenhuma origem externa é aceite
// (apenas pedidos sem Origin: curl, health checks, same-origin). Em dev local
// define-se, por exemplo, CORS_ORIGINS=http://localhost:5173.
const CORS_ORIGINS = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map(normalizarOrigem)
  .filter(Boolean);

if (CORS_ORIGINS.length === 0) {
  console.warn(
    '[WARN] CORS_ORIGINS não definido ou vazio: CORS restritivo — nenhuma origem externa é permitida.\n' +
      '       Defina a variável CORS_ORIGINS (plural) com uma lista separada por vírgulas.\n' +
      '       Ex.: CORS_ORIGINS=https://a-tua-app.netlify.app,https://thaywebsearch.github.io\n' +
      '       Produção (Render): Dashboard -> serviço -> Environment -> CORS_ORIGINS.\n' +
      '       Local: backend/.env (ver backend/.env.example).'
  );

  // Erro de configuração comum: a variável no singular é ignorada pelo código.
  if (process.env.CORS_ORIGIN) {
    console.warn(
      '[WARN] Detetada a variável CORS_ORIGIN (singular), que NÃO é usada pela aplicação. ' +
        'Renomeie-a para CORS_ORIGINS (plural).'
    );
  }
} else {
  console.log(`[CORS] ${CORS_ORIGINS.length} origem(ns) permitida(s): ${CORS_ORIGINS.join(', ')}`);
}

app.use(
  cors({
    origin(origin, callback) {
      // Sem Origin (curl, health checks, same-origin) -> aceita sempre.
      if (!origin) return callback(null, true);
      return callback(null, CORS_ORIGINS.includes(origin));
    },
    methods: ['GET', 'HEAD'],
  })
);

app.use('/api', apiLimiter);
// Nota: a API é somente-leitura (GET/HEAD), pelo que não há body parsing.

// ============ CHAMADAS EXTERNAS (Yahoo Finance) ============
// Timeout explícito + retry limitado com backoff. Sem isto, um hang do Yahoo
// prendia a request até ao limite da plataforma.
const YAHOO_BASE = (process.env.YAHOO_BASE_URL || 'https://query1.finance.yahoo.com').replace(
  /\/+$/,
  ''
);
const YAHOO_TIMEOUT_MS = Number(process.env.YAHOO_TIMEOUT_MS) || 8000;
const YAHOO_TENTATIVAS = 2;

/** Erro tipado da fonte externa: distingue timeout, falha e ausência de dados. */
class ErroFonte extends Error {
  constructor(tipo, mensagem, status = 502) {
    super(mensagem);
    this.name = 'ErroFonte';
    this.tipo = tipo; // 'timeout' | 'fonte' | 'sem-dados' | 'rede'
    this.status = status;
  }
}

/** fetch com AbortController; lança ErroFonte('timeout') em vez de pendurar. */
async function fetchComTimeout(url, { timeoutMs = YAHOO_TIMEOUT_MS } = {}) {
  const controller = new AbortController();
  const temporizador = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      signal: controller.signal,
    });
  } catch (erro) {
    if (erro.name === 'AbortError') {
      throw new ErroFonte('timeout', `Tempo esgotado (${timeoutMs} ms)`);
    }
    throw new ErroFonte('rede', erro.message);
  } finally {
    clearTimeout(temporizador);
  }
}

/** GET ao Yahoo com 1 retry em falhas transitórias (timeout, rede, 5xx). */
async function pedirYahoo(url) {
  let ultimoErro;

  for (let tentativa = 0; tentativa < YAHOO_TENTATIVAS; tentativa++) {
    try {
      const resposta = await fetchComTimeout(url);

      if (resposta.status === 404) {
        throw new ErroFonte('sem-dados', 'Símbolo sem dados na fonte', 404);
      }
      if (resposta.status >= 500) {
        throw new ErroFonte('fonte', `Fonte indisponível (HTTP ${resposta.status})`);
      }
      if (!resposta.ok) {
        // 4xx (exceto 404) não melhora com retry.
        throw new ErroFonte('fonte', `Pedido rejeitado (HTTP ${resposta.status})`, 502);
      }

      return resposta;
    } catch (erro) {
      ultimoErro = erro;
      const transitorio = erro.tipo === 'timeout' || erro.tipo === 'rede' || erro.tipo === 'fonte';
      const podeRepetir = transitorio && tentativa < YAHOO_TENTATIVAS - 1;

      if (!podeRepetir) break;
      await new Promise((resolver) => setTimeout(resolver, 300 * 2 ** tentativa));
    }
  }

  throw ultimoErro;
}

// Último resultado válido por símbolo: permite degradação graciosa quando a
// fonte falha, em vez de devolver um erro ao utilizador.
const ultimosDados = new Map(); // chave -> { dados, ts }
const MAX_ULTIMOS_DADOS = 60;

function guardarUltimoBom(chave, dados) {
  ultimosDados.delete(chave);
  ultimosDados.set(chave, { dados, ts: Date.now() });

  while (ultimosDados.size > MAX_ULTIMOS_DADOS) {
    const maisAntigo = ultimosDados.keys().next().value;
    ultimosDados.delete(maisAntigo);
  }
}

function obterUltimoBom(chave, validadeMs) {
  const entrada = ultimosDados.get(chave);
  if (!entrada) return null;
  if (Date.now() - entrada.ts > validadeMs) return null;
  return entrada.dados;
}

/** Limita a concorrência de pedidos outbound (evita rajadas ao Yahoo). */
async function mapComLimite(itens, limite, fn) {
  const resultados = new Array(itens.length);
  let proximo = 0;

  async function trabalhador() {
    while (proximo < itens.length) {
      const indice = proximo++;
      resultados[indice] = await fn(itens[indice], indice);
    }
  }

  await Promise.all(Array.from({ length: Math.min(limite, itens.length) }, trabalhador));
  return resultados;
}

// ============ FUNÇÕES UTILITÁRIAS ==========

/**
 * Carrega dados JSON de um arquivo de setor
 * @param {string} setor - ID do setor (ex: 'energy', 'technology')
 * @returns {object} Dados do setor parseados
 */
function carregarDados(setor) {
  const caminhoJson = path.join(__dirname, 'data', `${setor}.json`);

  if (!fs.existsSync(caminhoJson)) {
    throw new Error(`Dados não encontrados para: ${setor}`);
  }

  return lerJsonComCache(caminhoJson);
}

/**
 * Encontra o arquivo curiosidades.json em vários locais possíveis
 * @returns {string|null} Caminho do arquivo ou null se não encontrado
 */
function encontrarCuriosidades() {
  const caminhos = [
    path.join(__dirname, '..', 'frontend', 'src', 'data', 'curiosidades.json'),
    path.join(__dirname, '..', 'frontend', 'dashboard', 'src', 'data', 'curiosidades.json'),
    path.join(__dirname, 'data', 'curiosidades.json'),
    path.join(__dirname, 'frontend', 'src', 'data', 'curiosidades.json'),
    path.join(__dirname, 'src', 'data', 'curiosidades.json')
  ];
  
  for (const caminho of caminhos) {
    if (fs.existsSync(caminho)) {
      return caminho;
    }
  }
  
  return null;
}

/**
 * Lista os IDs dos arquivos de setor no diretório data/
 * @returns {string[]} IDs de setores disponíveis
 */
function listarArquivosDeSetores() {
  const dataDir = path.join(__dirname, 'data');
  return lerDiretorioComCache(dataDir)
    .filter(file => 
      file.endsWith('.json')
      && file !== 'package.json'
      && file !== 'package-lock.json'
      && file !== 'daily-summary.json'
      && file !== 'curiosidades.json'
    )
    .map(file => file.replace('.json', ''))
    // Só setores da allowlist: mantém /api/setores e /api/setor/:setor coerentes.
    .filter(id => SETORES_VALIDOS.has(id));
}

/**
 * Carrega todas as empresas do S&P 500 a partir dos arquivos de setor
 * @returns {Array} Lista com todas as empresas, cada uma com setorId
 */
function carregarTodasEmpresas() {
  const setores = listarArquivosDeSetores();
  const caminhos = setores.map((setorId) => path.join(__dirname, 'data', `${setorId}.json`));

  // Assinatura do conjunto: reutiliza a lista agregada enquanto nenhum setor mudar.
  const assinatura = caminhos
    .map((caminho) => (fs.existsSync(caminho) ? assinaturaFicheiro(caminho) : 'ausente'))
    .join('|');

  if (empresasCache.assinatura === assinatura) {
    return empresasCache.value;
  }

  const empresas = [];

  setores.forEach((setorId, i) => {
    if (!fs.existsSync(caminhos[i])) return;

    const lista = lerJsonComCache(caminhos[i]).companies || [];

    lista.forEach(empresa => {
      empresas.push({
        ...empresa,
        setorId,
        setor: empresa.sector || setorId
      });
    });
  });

  empresasCache = { assinatura, value: empresas };
  return empresas;
}

/**
 * Formata um valor numérico de market cap em $XB / $XT
 * @param {number|string} valor - Market cap em dólares
 * @returns {string} Valor formatado
 */
function formatarMarketCap(valor) {
  if (valor === undefined || valor === null || valor === '') return 'N/D';
  const num = Number(valor);
  if (Number.isNaN(num) || num <= 0) return 'N/D';
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
  return `$${Math.round(num).toLocaleString('en-US')}`;
}

/**
 * Gera a curiosidade completa de uma empresa com contexto ampliado
 * (o que faz, segmento, sede, fundação e dados financeiros)
 * @param {object} empresa - Registro da empresa
 * @param {number} posicao - Posição alfabética (1-based)
 * @param {number} total - Total de empresas do índice
 * @returns {object} Curiosidade formatada
 */
function montarCuriosidade(empresa, posicao, total) {
  const setor = empresa.setor || 'N/D';
  const segmento = empresa.subIndustry || 'N/D';
  const sede = empresa.headquarters || 'N/D';
  const fundacao = empresa.founded || 'N/D';
  const marketCap = formatarMarketCap(empresa.marketCap);
  const dividendYield = empresa.dividendYield !== undefined && empresa.dividendYield !== null
    ? `${Number(empresa.dividendYield).toFixed(2)}%`
    : 'N/D';
  const pagaDividendos = String(empresa.hasDividend).toLowerCase() === 'sim';

  const nome = empresa.name || empresa.symbol || 'Empresa';
  const dataAdicao = new Date().toISOString().slice(0, 10);

  const descricao = `${nome} é uma empresa listada no S&P 500, índice que reúne as maiores companhias dos Estados Unidos, pertencente ao setor de ${setor}. A companhia desenvolve, produz e comercializa produtos e serviços voltados ao segmento de ${segmento}. Com sede em ${sede} e fundada em ${fundacao}, a empresa se destaca no mercado de capitais, somando hoje um valor de mercado de ${marketCap}${pagaDividendos ? ` e distribuindo um dividend yield de ${dividendYield}` : ''}.`;

  const fatos = [
    `Setor: ${setor}`,
    `Segmento de atuação: ${segmento}`,
    `Sede: ${sede}`,
    `Fundação: ${fundacao}`,
    `Market Cap: ${marketCap}`,
    pagaDividendos ? `Dividend Yield: ${dividendYield}` : 'Dividendos: empresa atualmente não paga dividendos',
    `Posição no ranking alfabético do S&P 500: ${posicao}ª de ${total}`
  ];

  const insight = pagaDividendos
    ? `${nome} distribui dividendos aos acionistas, o que tende a atrair investidores em busca de renda periódica e estabilidade no longo prazo.`
    : `${nome} tende a reinvestir seus lucros no negócio em vez de distribuir dividendos, podendo interessar a quem busca valorização de capital no longo prazo.`;

  const simboloCodificado = encodeURIComponent(nome);

  return {
    id: posicao,
    posicao: String(posicao),
    simbolo: empresa.symbol || 'N/D',
    empresa: nome,
    setor,
    dataAdicao,
    titulo: 'Perfil da Empresa no S&P 500',
    descricao,
    fatos,
    dividendYield: pagaDividendos ? dividendYield : 'N/D',
    marketCap,
    insight,
    link: `https://www.google.com/search?q=${simboloCodificado}+stock+SP500`,
    imagem: null
  };
}

// ============ ROTAS DA API ===========

/**
 * Listar todos os setores disponíveis
 * GET /api/setores
 */
app.get('/api/setores', (req, res) => {
  try {
    const setores = listarArquivosDeSetores().sort();

    cachePublico(res);
    res.json({ 
      sucesso: true,
      total: setores.length,
      setores 
    });
  } catch (erro) {
    console.error('Erro ao listar setores:', erro);
    semCache(res);
    res.status(500).json({ 
      sucesso: false, 
      erro: 'Não foi possível listar os setores'
    });
  }
});

/**
 * Obter dados detalhados de um setor específico
 * GET /api/setor/:setor
 *
 * O parâmetro é validado por allowlist (SETORES_VALIDOS) antes de ser usado
 * em qualquer caminho de ficheiro. Valores malformados -> 400; ids válidos mas
 * inexistentes -> 404. Nunca devolve caminhos internos.
 */
app.get('/api/setor/:setor', (req, res) => {
  const { setor } = req.params;

  if (!SETOR_RE.test(setor)) {
    semCache(res);
    return res.status(400).json({
      sucesso: false,
      codigo: 'SETOR_INVALIDO',
      erro: 'Identificador de setor inválido'
    });
  }

  if (!SETORES_VALIDOS.has(setor)) {
    semCache(res);
    return res.status(404).json({
      sucesso: false,
      codigo: 'SETOR_NAO_ENCONTRADO',
      erro: 'Setor não encontrado'
    });
  }

  try {
    const dados = carregarDados(setor);

    cachePublico(res);
    res.json({
      sucesso: true,
      setor,
      dados
    });
  } catch (erro) {
    console.error(`Erro ao carregar setor ${setor}:`, erro);
    semCache(res);
    res.status(500).json({
      sucesso: false,
      erro: 'Não foi possível carregar os dados do setor'
    });
  }
});

/**
 * Obter métricas agregadas de inteligência setorial (GICS)
 * GET /api/inteligencia-setorial
 */
app.get('/api/inteligencia-setorial', (req, res) => {
  try {
    const setores = listarArquivosDeSetores().sort();

    const datasets = setores.map((id) => {
      const dados = carregarDados(id);
      return {
        id,
        name: dados.sector || id,
        companies: dados.companies || [],
        generatedAt: dados.generatedAt || null
      };
    });

    const dados = buildSectorIntelligence(datasets);

    cachePublico(res);
    res.json({
      sucesso: true,
      dados
    });
  } catch (erro) {
    console.error('Erro ao calcular inteligência setorial:', erro);
    semCache(res);
    res.status(500).json({
      sucesso: false,
      erro: 'Não foi possível calcular a inteligência setorial'
    });
  }
});

/**
 * Obter curiosidades do dia
 * GET /api/curiosidades
 */
app.get('/api/curiosidades', (req, res) => {
  try {
    // Rotação diária em ordem alfabética pela lista completa do S&P 500
    const empresas = carregarTodasEmpresas();

    if (empresas.length > 0) {
      const ordenadas = [...empresas].sort((a, b) => a.name.localeCompare(b.name, 'en'));

      // Índice determinístico: avança 1 posição por dia a partir da data de referência
      const agora = new Date();
      const inicioDoDia = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
      const diasDesdeInicio = Math.round((inicioDoDia.getTime() - DATA_INICIO_CURIOSIDADE.getTime()) / MS_POR_DIA);
      const indice = ((diasDesdeInicio % ordenadas.length) + ordenadas.length) % ordenadas.length;

      const empresa = ordenadas[indice];
      const proximaEmpresa = ordenadas[(indice + 1) % ordenadas.length];

      const curiosidade = montarCuriosidade(empresa, indice + 1, ordenadas.length);

      cachePublico(res);
      return res.json({
        sucesso: true,
        dados: {
          curiosidades: [curiosidade],
          total: ordenadas.length,
          indice,
          ordem: 'alfabética',
          proximaEmpresa: proximaEmpresa.name || proximaEmpresa.symbol,
          dataGeracao: agora.toISOString()
        }
      });
    }

    // Fallback: usuário ainda não tem dados de setores → serve arquivo estático
    const caminhoJson = encontrarCuriosidades();
    
    if (!caminhoJson) {
      semCache(res);
      return res.status(404).json({
        sucesso: false,
        erro: 'Nenhum dado de empresas encontrado e arquivo de curiosidades não disponível'
      });
    }
    
    const dados = lerJsonComCache(caminhoJson);

    cachePublico(res);
    res.json({
      sucesso: true,
      dados
    });
  } catch (erro) {
    console.error('Erro ao carregar curiosidades:', erro);
    semCache(res);

    if (erro instanceof SyntaxError) {
      res.status(400).json({
        sucesso: false,
        erro: 'Não foi possível interpretar os dados de curiosidades'
      });
    } else {
      res.status(500).json({
        sucesso: false,
        erro: 'Não foi possível carregar as curiosidades'
      });
    }
  }
});

/**
 * Histórico de preços de uma ação (últimos 2 anos via Yahoo Finance)
 * GET /api/historico/:symbol
 */
// Formato aceite de símbolo: letra inicial + letras/dígitos/ponto/hífen
// (ex.: AAPL, BRK.B). Rejeita input arbitrário antes de construir a URL.
const SIMBOLO_RE = /^[A-Za-z][A-Za-z0-9.\-]{0,9}$/;

const MAX_SIMBOLOS_COTACAO = 25;
const COTACAO_CACHE_MS = 60 * 1000; // preços mudam durante o pregão
const COTACAO_STALE_MS = 24 * 60 * 60 * 1000;
const HISTORICO_STALE_MS = 24 * 60 * 60 * 1000;

const cotacoesCache = new Map(); // símbolo -> { preco, data, moeda, ts }
const MAX_COTACOES_CACHE = 600;

/** Extrai a série diária do payload do Yahoo; null quando não há dados. */
function lerSerieDiaria(json) {
  const resultado = json?.chart?.result?.[0];
  const quote = resultado?.indicators?.quote?.[0];
  const timestamps = resultado?.timestamp || [];

  if (!quote || timestamps.length === 0) return null;

  const registros = timestamps
    .map((ts, i) => {
      const d = new Date(ts * 1000);
      const data =
        `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;

      return {
        data,
        open: quote.open?.[i] ?? null,
        high: quote.high?.[i] ?? null,
        low: quote.low?.[i] ?? null,
        close: quote.close?.[i] ?? null,
        volume: quote.volume?.[i] ?? null,
      };
    })
    .filter(r => r.close !== null && r.close !== undefined && !Number.isNaN(r.close));

  return registros.length > 0 ? registros : null;
}

function urlChart(ticker, range, interval) {
  return `${YAHOO_BASE}/v8/finance/chart/${encodeURIComponent(ticker)}?range=${range}&interval=${interval}`;
}

/** Mensagem segura: distingue timeout, falha externa e ausência de dados. */
function mensagemSegura(erro) {
  if (erro.tipo === 'timeout') return 'A fonte de dados demorou demasiado a responder';
  if (erro.tipo === 'sem-dados') return 'Sem dados de preço para o símbolo';
  return 'Não foi possível obter dados da fonte externa';
}

app.get('/api/historico/:symbol', historicoLimiter, async (req, res) => {
  const { symbol } = req.params;

  if (!SIMBOLO_RE.test(symbol)) {
    semCache(res);
    return res.status(400).json({ sucesso: false, erro: 'Símbolo inválido' });
  }

  const chave = symbol.toUpperCase();

  try {
    const ticker = chave.replace(/\./g, '-');
    const resposta = await pedirYahoo(urlChart(ticker, '2y', '1d'));
    const json = await resposta.json();
    const registros = lerSerieDiaria(json);

    if (!registros) {
      throw new ErroFonte('sem-dados', 'Sem dados de preço para o símbolo', 404);
    }

    guardarUltimoBom(`hist:${chave}`, registros);

    // Série diária: 2 min é suficiente para o gráfico e alivia o Render.
    cachePublico(res, 120, 600);
    res.json({
      sucesso: true,
      symbol,
      total: registros.length,
      registros
    });
  } catch (erro) {
    const ultimoBom = obterUltimoBom(`hist:${chave}`, HISTORICO_STALE_MS);

    // Degradação graciosa: devolve o último resultado válido em vez de erro.
    if (ultimoBom) {
      console.warn(`Histórico de ${chave} servido do cache local após falha: ${erro.message}`);
      semCache(res);
      res.set('Warning', '110 - Resposta em cache local');
      return res.json({
        sucesso: true,
        symbol,
        total: ultimoBom.length,
        registros: ultimoBom,
        aviso: 'dados em cache local'
      });
    }

    console.error(`Erro ao buscar histórico de ${chave}:`, erro);
    semCache(res);
    res.status(erro.status || 502).json({
      sucesso: false,
      codigo:
        erro.tipo === 'timeout'
          ? 'UPSTREAM_TIMEOUT'
          : erro.tipo === 'sem-dados'
            ? 'SEM_DADOS'
            : 'UPSTREAM_ERROR',
      erro: mensagemSegura(erro)
    });
  }
});

/**
 * Cotações atuais em lote (uma chamada para vários símbolos).
 * GET /api/cotacoes?symbols=AAPL,MSFT
 *
 * Usado pelos alertas de preço no browser: substitui N pedidos de 2 anos de
 * histórico por 1 pedido de cotações. Cada símbolo é cacheado 60 s e a
 * concorrência com o Yahoo é limitada a 4.
 */
app.get('/api/cotacoes', historicoLimiter, async (req, res) => {
  const bruto = String(req.query.symbols || '');
  const pedidos = bruto
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  if (pedidos.length === 0) {
    semCache(res);
    return res.status(400).json({
      sucesso: false,
      codigo: 'SIMBOLOS_OBRIGATORIOS',
      erro: 'Indique pelo menos um símbolo em ?symbols='
    });
  }

  if (pedidos.length > MAX_SIMBOLOS_COTACAO) {
    semCache(res);
    return res.status(400).json({
      sucesso: false,
      codigo: 'DEMASIADOS_SIMBOLOS',
      erro: `Máximo de ${MAX_SIMBOLOS_COTACAO} símbolos por pedido`
    });
  }

  if (pedidos.some(s => !SIMBOLO_RE.test(s))) {
    semCache(res);
    return res.status(400).json({
      sucesso: false,
      codigo: 'SIMBOLO_INVALIDO',
      erro: 'Um ou mais símbolos são inválidos'
    });
  }

  const simbolos = [...new Set(pedidos.map(s => s.toUpperCase()))];

  async function obterCotacao(simbolo) {
    const emCache = cotacoesCache.get(simbolo);
    if (emCache && Date.now() - emCache.ts < COTACAO_CACHE_MS) {
      return { preco: emCache.preco, data: emCache.data, moeda: emCache.moeda, stale: false };
    }

    try {
      const ticker = simbolo.replace(/\./g, '-');
      const resposta = await pedirYahoo(urlChart(ticker, '5d', '1d'));
      const json = await resposta.json();
      const registros = lerSerieDiaria(json);

      if (!registros) {
        throw new ErroFonte('sem-dados', 'Sem dados de preço para o símbolo', 404);
      }

      const ultimo = registros[registros.length - 1];
      const cotacao = {
        preco: Number(ultimo.close),
        data: ultimo.data,
        moeda: json?.chart?.result?.[0]?.meta?.currency || 'USD',
      };

      cotacoesCache.delete(simbolo);
      cotacoesCache.set(simbolo, { ...cotacao, ts: Date.now() });

      while (cotacoesCache.size > MAX_COTACOES_CACHE) {
        cotacoesCache.delete(cotacoesCache.keys().next().value);
      }

      return { ...cotacao, stale: false };
    } catch (erro) {
      const antiga = cotacoesCache.get(simbolo);
      if (antiga && Date.now() - antiga.ts < COTACAO_STALE_MS) {
        return { preco: antiga.preco, data: antiga.data, moeda: antiga.moeda, stale: true };
      }

      console.warn(`Cotação de ${simbolo} indisponível: ${erro.message}`);
      return { erro: 'indisponivel' };
    }
  }

  try {
    const resultados = await mapComLimite(simbolos, 4, obterCotacao);
    const cotacoes = {};
    simbolos.forEach((simbolo, i) => {
      cotacoes[simbolo] = resultados[i];
    });

    // Curto: as cotações mudam durante o pregão.
    cachePublico(res, 60, 300);
    res.json({ sucesso: true, total: simbolos.length, cotacoes });
  } catch (erro) {
    console.error('Erro ao obter cotações:', erro);
    semCache(res);
    res.status(502).json({
      sucesso: false,
      codigo: 'UPSTREAM_ERROR',
      erro: 'Não foi possível obter as cotações'
    });
  }
});

/**
 * Resumo do dia (maiores altas/baixas e desempenho por setor)
 * GET /api/resumo-dia
 */
app.get('/api/resumo-dia', (req, res) => {
  try {
    const caminhoJson = path.join(__dirname, 'data', 'daily-summary.json');

    if (!fs.existsSync(caminhoJson)) {
      semCache(res);
      return res.status(404).json({
        sucesso: false,
        erro: 'Resumo do dia ainda não gerado'
      });
    }

    const dados = lerJsonComCache(caminhoJson);

    cachePublico(res);
    res.json({ 
      sucesso: true, 
      dados 
    });
  } catch (erro) {
    console.error('Erro ao carregar resumo do dia:', erro);
    semCache(res);
    res.status(500).json({ 
      sucesso: false, 
      erro: 'Não foi possível carregar o resumo do dia'
    });
  }
});

/**
 * Health check - verifica se o servidor está rodando
 * GET /api/health
 */
app.get('/api/health', (req, res) => {
  semCache(res);
  res.json({ 
    status: '✅ Backend rodando!',
    versao: VERSION,
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

/**
 * Rota raiz - documentação da API
 * GET /
 */
app.get('/', (req, res) => {
  res.json({ 
    mensagem: 'API SP500 Dashboard',
    versao: VERSION,
    endpoints: [
      {
        metodo: 'GET',
        rota: '/api/health',
        descricao: 'Verifica se o servidor está rodando'
      },
      {
        metodo: 'GET',
        rota: '/api/setores',
        descricao: 'Lista todos os setores disponíveis'
      },
      {
        metodo: 'GET',
        rota: '/api/setor/:setor',
        descricao: 'Obtém dados detalhados de um setor específico'
      },
      {
        metodo: 'GET',
        rota: '/api/inteligencia-setorial',
        descricao: 'Obtém métricas agregadas de inteligência setorial (GICS)'
      },
      {
        metodo: 'GET',
        rota: '/api/curiosidades',
        descricao: 'Obtém curiosidades do dia sobre empresas S&P 500'
      },
      {
        metodo: 'GET',
        rota: '/api/historico/:symbol',
        descricao: 'Obtém histórico de preços de uma ação (últimos 2 anos)'
      },
      {
        metodo: 'GET',
        rota: '/api/cotacoes?symbols=AAPL,MSFT',
        descricao: 'Obtém cotações atuais em lote (máx. 25 símbolos)'
      },
      {
        metodo: 'GET',
        rota: '/api/resumo-dia',
        descricao: 'Obtém resumo do dia com maiores altas e baixas'
      }
    ]
  });
});

/**
 * Middleware para erros 404
 */
app.use((req, res) => {
  semCache(res);
  res.status(404).json({ 
    sucesso: false,
    erro: 'Rota não encontrada'
  });
});

/**
 * Middleware para tratamento de erros global
 */
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  semCache(res);
  res.status(500).json({ 
    sucesso: false,
    erro: 'Erro interno do servidor',
    mensagem: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ============ INICIAR SERVIDOR ==========
const server = app.listen(PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 Backend SP500 Dashboard rodando!');
  console.log('='.repeat(60));
  console.log(`📍 Endereço: http://localhost:${PORT}`);
  console.log(`⏰ Horário: ${new Date().toLocaleString('pt-BR')}`);
  console.log('='.repeat(60));
  console.log('\n✅ Endpoints disponíveis:');
  console.log(`  📊 GET /api/setores - Lista setores`);
  console.log(`  📈 GET /api/setor/:setor - Dados do setor`);
  console.log(`  🧠 GET /api/inteligencia-setorial - Inteligência setorial GICS`);
  console.log(`  🌟 GET /api/curiosidades - Curiosidade do dia`);
  console.log(`  💰 GET /api/historico/:symbol - Histórico de preços`);
  console.log(`  📋 GET /api/resumo-dia - Resumo do dia`);
  console.log(`  💚 GET /api/health - Health check`);
  console.log('='.repeat(60) + '\n');
});

// Tratamento de erro ao iniciar servidor
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Erro: Porta ${PORT} já está em uso!`);
    console.error(`   Mude a porta com: PORT=5002 node server.js\n`);
  } else {
    console.error(`\n❌ Erro ao iniciar servidor: ${err.message}\n`);
  }
  process.exit(1);
});

// Tratamento de sinais de encerramento
process.on('SIGTERM', () => {
  console.log('\n🛑 Servidor encerrado (SIGTERM)');
  server.close(() => {
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n🛑 Servidor encerrado (SIGINT)');
  server.close(() => {
    process.exit(0);
  });
});
