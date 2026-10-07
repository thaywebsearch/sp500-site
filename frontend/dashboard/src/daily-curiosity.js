// ========== CURIOSIDADE DO DIA ==========
// Carrega e renderiza uma curiosidade diferente cada dia do mês

import { API_BASE_URL } from './config.js';

// Variáveis globais
let todasAsCuriosidades = [];
let curiosidadeDoDia = null;

// ========== FUNÇÃO PRINCIPAL ==========
export async function loadCuriosidades() {
  try {
    const view = document.getElementById('daily-curiosity-view');
    
    if (!view) {
      console.error('Elemento daily-curiosity-view não encontrado');
      return;
    }

    // Mostrar "carregando"
    view.innerHTML = '<div class="curiosidade-loading">Carregando curiosidade...</div>';

    // Buscar curiosidades da API
    const response = await fetch(`${API_BASE_URL}/api/curiosidades`);
    
    if (!response.ok) {
      console.error(`Erro ao buscar curiosidades: ${response.status}`);
      view.innerHTML = `<div class="curiosidade-erro">Erro ao carregar curiosidades (${response.status})</div>`;
      return;
    }

    const data = await response.json();
    
    if (!data.sucesso || !data.dados || !data.dados.curiosidades) {
      console.error('Dados de curiosidades inválidos:', data);
      view.innerHTML = '<div class="curiosidade-erro">Formato de dados inválido</div>';
      return;
    }

    todasAsCuriosidades = data.dados.curiosidades;

    if (todasAsCuriosidades.length === 0) {
      view.innerHTML = '<div class="curiosidade-erro">Nenhuma curiosidade disponível</div>';
      return;
    }

    // Selecionar curiosidade do dia
    selecionarCuriosidadeDoDia();

    // Renderizar
    renderCuriosidade();

  } catch (erro) {
    console.error('Erro ao carregar curiosidades:', erro);
    const view = document.getElementById('daily-curiosity-view');
    if (view) {
      view.innerHTML = `<div class="curiosidade-erro">Erro ao carregar: ${erro.message}</div>`;
    }
  }
}

// ========== SELECIONAR CURIOSIDADE DO DIA ==========
function selecionarCuriosidadeDoDia() {
  if (todasAsCuriosidades.length === 0) return;

  // Usar dia do mês (1-31) para rotacionar entre curiosidades
  const hoje = new Date();
  const diaDoMes = hoje.getDate(); // 1-31
  const indice = (diaDoMes - 1) % todasAsCuriosidades.length;

  curiosidadeDoDia = todasAsCuriosidades[indice];
  console.log(`Curiosidade do dia ${diaDoMes}: ${curiosidadeDoDia?.empresa}`);
}

// ========== RENDERIZAR CURIOSIDADE ==========
function renderCuriosidade() {
  const view = document.getElementById('daily-curiosity-view');
  
  if (!view || !curiosidadeDoDia) {
    console.error('View ou curiosidade não encontrada');
    return;
  }

  // Adicionar estilos se não estiverem presentes
  adicionarEstilosCuriosidade();

  // Construir HTML
  const html = `
    <div class="curiosidade-container">
      <div class="curiosidade-header">
        <h1>🌟 Curiosidade do Dia</h1>
        <p class="curiosidade-data">${formatarData()}</p>
      </div>

      <div class="curiosidade-card">
        <div class="curiosidade-simbolo">
          <span class="simbolo-badge">${curiosidadeDoDia.simbolo}</span>
          <span class="posicao-badge">#${curiosidadeDoDia.posicao}</span>
        </div>

        <div class="curiosidade-conteudo">
          <h2 class="curiosidade-empresa">${curiosidadeDoDia.empresa}</h2>
          <p class="curiosidade-setor">
            <strong>Setor:</strong> ${curiosidadeDoDia.setor || 'N/A'}
          </p>

          <div class="curiosidade-titulo">
            <h3>${curiosidadeDoDia.titulo}</h3>
          </div>

          <div class="curiosidade-descricao">
            <p>${curiosidadeDoDia.descricao}</p>
          </div>

          ${curiosidadeDoDia.fatos && curiosidadeDoDia.fatos.length > 0 ? `
            <div class="curiosidade-fatos">
              <h4>📊 Fatos Interessantes:</h4>
              <ul>
                ${curiosidadeDoDia.fatos.map(fato => `<li>${fato}</li>`).join('')}
              </ul>
            </div>
          ` : ''}

          ${curiosidadeDoDia.dividendYield ? `
            <div class="curiosidade-dados">
              <p><strong>Dividend Yield:</strong> ${curiosidadeDoDia.dividendYield}</p>
            </div>
          ` : ''}

          ${curiosidadeDoDia.marketCap ? `
            <div class="curiosidade-dados">
              <p><strong>Market Cap:</strong> ${curiosidadeDoDia.marketCap}</p>
            </div>
          ` : ''}

          ${curiosidadeDoDia.insight ? `
            <div class="curiosidade-insight">
              <p><em>💡 ${curiosidadeDoDia.insight}</em></p>
            </div>
          ` : ''}

          <div class="curiosidade-acoes">
            <button class="btn-compartilhar" onclick="compartilharCuriosidade()">
              📤 Compartilhar
            </button>
            ${curiosidadeDoDia.link ? `
              <a href="${curiosidadeDoDia.link}" target="_blank" class="btn-saibamais">
                🔗 Saiba Mais
              </a>
            ` : ''}
          </div>
        </div>
      </div>

      <div class="curiosidade-footer">
        <p>Curiosidade de ${curiosidadeDoDia.empresa} - Atualizado em ${curiosidadeDoDia.dataAdicao || 'N/A'}</p>
        <p class="curiosidade-dica">💡 Uma curiosidade diferente a cada dia do mês!</p>
      </div>
    </div>
  `;

  view.innerHTML = html;

  // Expor função globalmente para botão compartilhar
  window.compartilharCuriosidade = compartilharCuriosidade;
}

// ========== ADICIONAR ESTILOS ==========
function adicionarEstilosCuriosidade() {
  // Verificar se estilos já foram adicionados
  if (document.getElementById('curiosidade-styles')) return;

  const style = document.createElement('style');
  style.id = 'curiosidade-styles';
  style.textContent = `
    .curiosidade-container {
      padding: 20px;
      max-width: 900px;
      margin: 0 auto;
    }

    .curiosidade-header {
      text-align: center;
      margin-bottom: 30px;
      border-bottom: 2px solid #ffd700;
      padding-bottom: 15px;
    }

    .curiosidade-header h1 {
      font-size: 2.5em;
      color: #ffd700;
      margin: 0;
      margin-bottom: 10px;
    }

    .curiosidade-data {
      color: #888;
      font-size: 0.9em;
    }

    .curiosidade-card {
      background: linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%);
      border: 2px solid #ffd700;
      border-radius: 10px;
      padding: 30px;
      margin-bottom: 20px;
      box-shadow: 0 8px 32px rgba(255, 215, 0, 0.2);
    }

    .curiosidade-simbolo {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
      align-items: center;
    }

    .simbolo-badge {
      background: #ffd700;
      color: #000;
      padding: 8px 15px;
      border-radius: 5px;
      font-weight: bold;
      font-size: 1.2em;
    }

    .posicao-badge {
      background: #555;
      color: #ffd700;
      padding: 8px 12px;
      border-radius: 5px;
      font-size: 0.9em;
    }

    .curiosidade-conteudo {
      color: #fff;
    }

    .curiosidade-empresa {
      font-size: 2em;
      color: #ffd700;
      margin: 0 0 10px 0;
    }

    .curiosidade-setor {
      color: #bbb;
      margin-bottom: 20px;
    }

    .curiosidade-titulo {
      background: rgba(255, 215, 0, 0.1);
      padding: 15px;
      border-left: 4px solid #ffd700;
      margin: 20px 0;
      border-radius: 5px;
    }

    .curiosidade-titulo h3 {
      margin: 0;
      color: #ffd700;
      font-size: 1.4em;
    }

    .curiosidade-descricao {
      line-height: 1.6;
      margin: 20px 0;
      color: #ddd;
      font-size: 1.05em;
    }

    .curiosidade-fatos {
      background: rgba(100, 100, 100, 0.3);
      padding: 15px;
      border-radius: 5px;
      margin: 20px 0;
    }

    .curiosidade-fatos h4 {
      color: #ffd700;
      margin-top: 0;
    }

    .curiosidade-fatos ul {
      list-style: none;
      padding: 0;
    }

    .curiosidade-fatos li {
      padding: 8px 0;
      border-bottom: 1px solid #444;
      color: #ddd;
    }

    .curiosidade-fatos li:last-child {
      border-bottom: none;
    }

    .curiosidade-dados {
      background: rgba(255, 215, 0, 0.05);
      padding: 12px;
      border-radius: 5px;
      margin: 10px 0;
      color: #ddd;
    }

    .curiosidade-insight {
      background: rgba(255, 215, 0, 0.1);
      padding: 15px;
      border-radius: 5px;
      margin: 20px 0;
      border-left: 4px solid #ffd700;
      color: #ffd700;
    }

    .curiosidade-acoes {
      display: flex;
      gap: 10px;
      margin-top: 25px;
      flex-wrap: wrap;
    }

    .btn-compartilhar,
    .btn-saibamais {
      padding: 12px 24px;
      border: 2px solid #ffd700;
      background: transparent;
      color: #ffd700;
      border-radius: 5px;
      cursor: pointer;
      font-size: 1em;
      font-weight: bold;
      transition: all 0.3s ease;
      text-decoration: none;
      display: inline-block;
    }

    .btn-compartilhar:hover,
    .btn-saibamais:hover {
      background: #ffd700;
      color: #000;
    }

    .curiosidade-footer {
      text-align: center;
      color: #888;
      font-size: 0.9em;
      margin-top: 30px;
      padding-top: 15px;
      border-top: 1px solid #444;
    }

    .curiosidade-loading {
      text-align: center;
      color: #ffd700;
      font-size: 1.2em;
      padding: 40px;
    }

    .curiosidade-erro {
      background: #8b0000;
      color: #fff;
      padding: 20px;
      border-radius: 5px;
      text-align: center;
    }

    @media (max-width: 768px) {
      .curiosidade-container {
        padding: 10px;
      }

      .curiosidade-header h1 {
        font-size: 1.8em;
      }

      .curiosidade-card {
        padding: 15px;
      }

      .curiosidade-empresa {
        font-size: 1.5em;
      }

      .curiosidade-acoes {
        flex-direction: column;
      }

      .btn-compartilhar,
      .btn-saibamais {
        width: 100%;
        text-align: center;
      }
    }
  `;

  document.head.appendChild(style);
}

// ========== COMPARTILHAR CURIOSIDADE ==========
function compartilharCuriosidade() {
  if (!curiosidadeDoDia) return;

  const texto = `🌟 Curiosidade do Dia: ${curiosidadeDoDia.empresa}\n\n${curiosidadeDoDia.descricao}\n\nSímbolo: ${curiosidadeDoDia.simbolo}`;

  if (navigator.share) {
    navigator.share({
      title: `Curiosidade do Dia - ${curiosidadeDoDia.empresa}`,
      text: texto,
      url: window.location.href
    }).catch(err => console.log('Erro ao compartilhar:', err));
  } else {
    // Fallback: copiar para clipboard
    navigator.clipboard.writeText(texto).then(() => {
      alert('Curiosidade copiada para a área de transferência!');
    }).catch(err => {
      alert('Erro ao copiar: ' + err);
    });
  }
}

// ========== UTILITÁRIOS ==========
function formatarData() {
  const hoje = new Date();
  const opcoes = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return hoje.toLocaleDateString('pt-BR', opcoes);
}
