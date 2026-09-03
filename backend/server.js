import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

function carregarDados(setor) {
  const caminhoJson = path.join(__dirname, 'setores', setor, 'dados.json');
  if (!fs.existsSync(caminhoJson)) {
    throw new Error(`Dados não encontrados para: ${setor}`);
  }
  const conteudo = fs.readFileSync(caminhoJson, 'utf-8');
  return JSON.parse(conteudo);
}

function carregarMarkdown(setor, arquivo = 'README') {
  const caminhoMd = path.join(__dirname, 'setores', setor, 'markdown', `${arquivo}.md`);
  if (!fs.existsSync(caminhoMd)) {
    return null;
  }
  return fs.readFileSync(caminhoMd, 'utf-8');
}

app.get('/api/setores', (req, res) => {
  try {
    const setoresDir = path.join(__dirname, 'setores');
    const setores = fs.readdirSync(setoresDir)
      .filter(file => {
        const stat = fs.statSync(path.join(setoresDir, file));
        return stat.isDirectory();
      })
      .sort();
    res.json({ sucesso: true, total: setores.length, setores });
  } catch (erro) {
    res.status(500).json({ sucesso: false, erro: erro.message });
  }
});

app.get('/api/setor/:setor', (req, res) => {
  try {
    const { setor } = req.params;
    const dados = carregarDados(setor);
    res.json({ sucesso: true, setor, dados });
  } catch (erro) {
    res.status(404).json({ sucesso: false, erro: erro.message });
  }
});

app.get('/api/setor/:setor/markdown/:arquivo?', (req, res) => {
  try {
    const { setor, arquivo } = req.params;
    const conteudo = carregarMarkdown(setor, arquivo || 'README');
    if (!conteudo) {
      return res.status(404).json({ sucesso: false, erro: 'Markdown não encontrado' });
    }
    res.json({ sucesso: true, setor, arquivo: arquivo || 'README', conteudo });
  } catch (erro) {
    res.status(500).json({ sucesso: false, erro: erro.message });
  }
});

app.get('/api/setor/:setor/completo', (req, res) => {
  try {
    const { setor } = req.params;
    const dados = carregarDados(setor);
    const markdown = carregarMarkdown(setor);
    res.json({ sucesso: true, setor, dados, markdown });
  } catch (erro) {
    res.status(404).json({ sucesso: false, erro: erro.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: '✅ Backend rodando!' });
});

app.get('/', (req, res) => {
  res.json({ 
    mensagem: 'API SP500 by Sector',
    versao: '1.0.0',
    endpoints: [
      'GET /api/health',
      'GET /api/setores',
      'GET /api/setor/:setor',
      'GET /api/setor/:setor/markdown/:arquivo',
      'GET /api/setor/:setor/completo'
    ]
  });
});

app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada' });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Backend rodando em http://localhost:${PORT}`);
  console.log(`📊 Teste: http://localhost:${PORT}/api/setores\n`);
});