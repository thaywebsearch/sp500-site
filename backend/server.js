import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 5001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// ============ FUNÇÕES UTILITÁRIAS ============

// Carrega dados JSON de um setor
function carregarDados(setor) {
  const caminhoJson = path.join(__dirname, 'data', `${setor}.json`);
  
  if (!fs.existsSync(caminhoJson)) {
    throw new Error(`Dados não encontrados para: ${setor}`);
  }
  
  const conteudo = fs.readFileSync(caminhoJson, 'utf-8');
  return JSON.parse(conteudo);
}

// ============ ROTAS DA API ============

// Listar todos os setores
app.get('/api/setores', (req, res) => {
  try {
    const dataDir = path.join(__dirname, 'data');
    const setores = fs.readdirSync(dataDir)
      .filter(file => file.endsWith('.json')
        && file !== 'package.json'
        && file !== 'package-lock.json'
        && file !== 'daily-summary.json')
      .map(file => file.replace('.json', ''))
      .sort();
    
    res.json({ 
      sucesso: true,
      total: setores.length,
      setores 
    });
  } catch (erro) {
    res.status(500).json({ sucesso: false, erro: erro.message });
  }
});

// Obter dados de um setor
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
    res.status(404).json({ 
      sucesso: false,
      erro: erro.message 
    });
  }
});

// Histórico de preços diário via Yahoo Finance (últimos ~2 anos)
app.get('/api/historico/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const ticker = symbol.toUpperCase().replace(/\./g, '-');

    const url =
      `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}` +
      '?range=2y&interval=1d';

    const resposta = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!resposta.ok) throw new Error('Falha ao buscar histórico');

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
          `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}` +
          `-${String(d.getUTCDate()).padStart(2, '0')}`;

        return {
          data,
          open: quote.open?.[i] ?? null,
          high: quote.high?.[i] ?? null,
          low: quote.low?.[i] ?? null,
          close: quote.close?.[i] ?? null,
          volume: quote.volume?.[i] ?? null,
        };
      })
      .filter((r) => r.close !== null && r.close !== undefined && !Number.isNaN(r.close));

    if (registros.length === 0) {
      throw new Error('Sem dados de preço para o símbolo');
    }

    res.json({ sucesso: true, symbol, registros });
  } catch (erro) {
    res.status(502).json({ sucesso: false, erro: erro.message });
  }
});

// Resumo do dia (maiores altas/baixas e desempenho por setor)
app.get('/api/resumo-dia', (req, res) => {
  const caminhoJson = path.join(__dirname, 'data', 'daily-summary.json');

  if (!fs.existsSync(caminhoJson)) {
    return res.status(404).json({
      sucesso: false,
      erro: 'Resumo do dia ainda não gerado',
    });
  }

  try {
    const conteudo = fs.readFileSync(caminhoJson, 'utf-8');
    res.json({ sucesso: true, dados: JSON.parse(conteudo) });
  } catch (erro) {
    res.status(500).json({ sucesso: false, erro: erro.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: '✅ Backend rodando!' });
});

// Rota raiz
app.get('/', (req, res) => {
  res.json({ 
    mensagem: 'API SP500 by Sector',
    versao: '1.0.0',
    endpoints: [
      'GET /api/health',
      'GET /api/setores',
      'GET /api/setor/:setor',
      'GET /api/historico/:symbol',
      'GET /api/resumo-dia'
    ]
  });
});

// Erro 404
app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada' });
});

// ============ INICIA O SERVIDOR ============
app.listen(PORT, () => {
  console.log(`\n🚀 Backend rodando em http://localhost:${PORT}`);
  console.log(`📊 Teste: http://localhost:${PORT}/api/setores\n`);
});