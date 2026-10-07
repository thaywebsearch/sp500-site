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

// ============ ROTAS DA API ==========

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
    const caminhoJson = encontrarCuriosidades();
    
    if (!caminhoJson) {
      return res.status(404).json({
        sucesso: false,
        erro: 'Arquivo de curiosidades não encontrado. Procurei em: frontend/src/data/, src/data/, data/'
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
