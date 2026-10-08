import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 5001;

// Configurar __dirname para módulos ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Data de referência da "Curiosidade do Dia": neste dia a lista começa
// pela 1ª empresa em ordem alfabética e avança 1 posição por dia.
const DATA_INICIO_CURIOSIDADE = new Date('2026-10-08T00:00:00');
const MS_POR_DIA = 24 * 60 * 60 * 1000;

// ============ MIDDLEWARE ==========
app.use(cors());
app.use(express.json());

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
  
  const conteudo = fs.readFileSync(caminhoJson, 'utf-8');
  return JSON.parse(conteudo);
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
  return fs.readdirSync(dataDir)
    .filter(file => 
      file.endsWith('.json')
      && file !== 'package.json'
      && file !== 'package-lock.json'
      && file !== 'daily-summary.json'
      && file !== 'curiosidades.json'
      && file !== 'dividend-calendar.json'
    )
    .map(file => file.replace('.json', ''));
}

/**
 * Carrega todas as empresas do S&P 500 a partir dos arquivos de setor
 * @returns {Array} Lista com todas as empresas, cada uma com setorId
 */
function carregarTodasEmpresas() {
  const setores = listarArquivosDeSetores();
  const empresas = [];

  for (const setorId of setores) {
    const caminhoJson = path.join(__dirname, 'data', `${setorId}.json`);
    if (!fs.existsSync(caminhoJson)) continue;

    const dados = JSON.parse(fs.readFileSync(caminhoJson, 'utf-8'));
    const lista = dados.companies || [];

    lista.forEach(empresa => {
      empresas.push({
        ...empresa,
        setorId,
        setor: empresa.sector || setorId
      });
    });
  }

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
    const dataDir = path.join(__dirname, 'data');
    const setores = fs.readdirSync(dataDir)
      .filter(file => 
        file.endsWith('.json')
        && file !== 'package.json'
        && file !== 'package-lock.json'
        && file !== 'daily-summary.json'
        && file !== 'curiosidades.json'
        && file !== 'dividend-calendar.json'
      )
      .map(file => file.replace('.json', ''))
      .sort();
    
    res.json({ 
      sucesso: true,
      total: setores.length,
      setores 
    });
  } catch (erro) {
    console.error('Erro ao listar setores:', erro);
    res.status(500).json({ 
      sucesso: false, 
      erro: erro.message 
    });
  }
});

/**
 * Obter dados detalhados de um setor específico
 * GET /api/setor/:setor
 */
app.get('/api/setor/:setor', (req, res) => {
  try {
    const { setor } = req.params;
    const dados = carregarDados(setor);
    
    res.json({
      sucesso: true,
      setor,
      dados
    });
  } catch (erro) {
    console.error(`Erro ao carregar setor ${req.params.setor}:`, erro);
    res.status(404).json({ 
      sucesso: false,
      erro: erro.message 
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
      const ordenadas = empresas.sort((a, b) => a.name.localeCompare(b.name, 'en'));

      // Índice determinístico: avança 1 posição por dia a partir da data de referência
      const agora = new Date();
      const inicioDoDia = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
      const diasDesdeInicio = Math.round((inicioDoDia.getTime() - DATA_INICIO_CURIOSIDADE.getTime()) / MS_POR_DIA);
      const indice = ((diasDesdeInicio % ordenadas.length) + ordenadas.length) % ordenadas.length;

      const empresa = ordenadas[indice];
      const proximaEmpresa = ordenadas[(indice + 1) % ordenadas.length];

      const curiosidade = montarCuriosidade(empresa, indice + 1, ordenadas.length);

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
      return res.status(404).json({
        sucesso: false,
        erro: 'Nenhum dado de empresas encontrado e arquivo de curiosidades não disponível'
      });
    }
    
    const conteudo = fs.readFileSync(caminhoJson, 'utf-8');
    const dados = JSON.parse(conteudo);
    
    res.json({
      sucesso: true,
      dados
    });
  } catch (erro) {
    console.error('Erro ao carregar curiosidades:', erro);
    
    if (erro instanceof SyntaxError) {
      res.status(400).json({
        sucesso: false,
        erro: 'Erro ao parsear JSON de curiosidades: ' + erro.message
      });
    } else {
      res.status(500).json({
        sucesso: false,
        erro: erro.message
      });
    }
  }
});

/**
 * Histórico de preços de uma ação (últimos 2 anos via Yahoo Finance)
 * GET /api/historico/:symbol
 */
app.get('/api/historico/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const ticker = symbol.toUpperCase().replace(/\./g, '-');

    const url =
      `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?range=2y&interval=1d`;

    const resposta = await fetch(url, { 
      headers: { 'User-Agent': 'Mozilla/5.0' } 
    });

    if (!resposta.ok) {
      throw new Error(`Falha ao buscar histórico: ${resposta.statusText}`);
    }

    const json = await resposta.json();
    const resultado = json?.chart?.result?.[0];
    const quote = resultado?.indicators?.quote?.[0];
    const timestamps = resultado?.timestamp || [];

    if (!quote || timestamps.length === 0) {
      throw new Error('Sem dados de preço para o símbolo');
    }

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

    if (registros.length === 0) {
      throw new Error('Nenhum registro de preço válido encontrado');
    }

    res.json({ 
      sucesso: true, 
      symbol, 
      total: registros.length,
      registros 
    });
  } catch (erro) {
    console.error(`Erro ao buscar histórico de ${req.params.symbol}:`, erro);
    res.status(502).json({ 
      sucesso: false, 
      erro: erro.message 
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
      return res.status(404).json({
        sucesso: false,
        erro: 'Resumo do dia ainda não gerado'
      });
    }

    const conteudo = fs.readFileSync(caminhoJson, 'utf-8');
    const dados = JSON.parse(conteudo);

    res.json({ 
      sucesso: true, 
      dados 
    });
  } catch (erro) {
    console.error('Erro ao carregar resumo do dia:', erro);
    res.status(500).json({ 
      sucesso: false, 
      erro: erro.message 
    });
  }
});

/**
 * Calendário de dividendos (próximos eventos estimados por empresa)
 * GET /api/calendario-dividendos
 */
app.get('/api/calendario-dividendos', (req, res) => {
  try {
    const caminhoJson = path.join(__dirname, 'data', 'dividend-calendar.json');

    if (!fs.existsSync(caminhoJson)) {
      return res.status(404).json({
        sucesso: false,
        erro: 'Calendário de dividendos ainda não gerado'
      });
    }

    const conteudo = fs.readFileSync(caminhoJson, 'utf-8');
    const dados = JSON.parse(conteudo);
    
    // Opção de limitar resultados com ?max=10
    const max = parseInt(req.query.max, 10);
    const eventos = (Number.isFinite(max) && max > 0) 
      ? dados.events.slice(0, max) 
      : dados.events;

    res.json({
      sucesso: true,
      dados: { ...dados, events: eventos },
      total: dados.count,
      retornou: eventos.length
    });
  } catch (erro) {
    console.error('Erro ao carregar calendário de dividendos:', erro);
    res.status(500).json({ 
      sucesso: false, 
      erro: erro.message 
    });
  }
});

/**
 * Health check - verifica se o servidor está rodando
 * GET /api/health
 */
app.get('/api/health', (req, res) => {
  res.json({ 
    status: '✅ Backend rodando!',
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
    versao: '1.0.0',
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
        rota: '/api/resumo-dia',
        descricao: 'Obtém resumo do dia com maiores altas e baixas'
      },
      {
        metodo: 'GET',
        rota: '/api/calendario-dividendos',
        descricao: 'Obtém calendário de dividendos (use ?max=10 para limitar)'
      }
    ]
  });
});

/**
 * Middleware para erros 404
 */
app.use((req, res) => {
  res.status(404).json({ 
    sucesso: false,
    erro: 'Rota não encontrada',
    rota: req.originalUrl,
    metodo: req.method
  });
});

/**
 * Middleware para tratamento de erros global
 */
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
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
  console.log(`  🌟 GET /api/curiosidades - Curiosidade do dia`);
  console.log(`  💰 GET /api/historico/:symbol - Histórico de preços`);
  console.log(`  📋 GET /api/resumo-dia - Resumo do dia`);
  console.log(`  🎁 GET /api/calendario-dividendos - Calendário`);
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
