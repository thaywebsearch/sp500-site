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
      .filter(file => file.endsWith('.json') && file !== 'package.json' && file !== 'package-lock.json')
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

// Obter tudo de um setor (dados completos)
app.get('/api/setor/:setor/completo', (req, res) => {
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
      'GET /api/setor/:setor/completo'
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