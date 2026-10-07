// ========== CURIOSIDADE DO DIA ==========

let curiosidadesData = [];
let curiosidadeAtual = null;

/**
 * Carregar curiosidades do JSON
 */
async function loadCuriosidades() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/curiosidades`);
    if (!response.ok) throw new Error('Erro ao carregar curiosidades');
    
    const data = await response.json();
    curiosidadesData = data.curiosidades || [];
    
    // Determinar qual curiosidade mostrar baseado na data
    selecionarCuriosidadeDoDia();
    renderCuriosidade();
  } catch (error) {
    console.error('Erro ao carregar curiosidades:', error);
    // Fallback: usar curiosidade local
    renderCuriosidadeLocal();
  }
}

/**
 * Selecionar curiosidade baseado na data
 */
function selecionarCuriosidadeDoDia() {
  if (curiosidadesData.length === 0) return;
  
  // Pegar data de hoje
  const hoje = new Date();
  const diaDasema = hoje.getDate(); // 1-31
  
  // Rotacionar entre curiosidades (1º do mês = primeira, 2º = segunda, etc)
  const indice = (diaDasema - 1) % curiosidadesData.length;
  curiosidadeAtual = curiosidadesData[indice];
}

/**
 * Renderizar curiosidade do dia
 */
function renderCuriosidade() {
  const container = document.getElementById('daily-curiosity-view');
  if (!container || !curiosidadeAtual) return;
  
  const { posicao, simbolo, empresa, setor, titulo, descricao, fatos, dividendYield, marketCap, insight, link, imagem } = curiosidadeAtual;
  
  const formatPct = (v) => v && v !== '0.00%' ? v : 'Sem dividendo';
  
  container.innerHTML = `
    <div class="curiosity-container">
      <!-- Header -->
      <div class="curiosity-header">
        <div class="curiosity-badge">🌟 Curiosidade do Dia</div>
        <h1 class="curiosity-title">${titulo}</h1>
        <p class="curiosity-date">${formatarData(new Date())}</p>
      </div>
      
      <!-- Hero Section -->
      <div class="curiosity-hero">
        <img src="${imagem}" alt="${empresa}" class="curiosity-image" onerror="this.src='https://via.placeholder.com/400x300?text=${encodeURIComponent(empresa)}'">
        <div class="curiosity-quick-info">
          <div class="quick-info-item">
            <span class="label">Posição</span>
            <span class="value">${posicao}</span>
          </div>
          <div class="quick-info-item">
            <span class="label">Símbolo</span>
            <span class="value">${simbolo}</span>
          </div>
          <div class="quick-info-item">
            <span class="label">Market Cap</span>
            <span class="value">${marketCap}</span>
          </div>
          <div class="quick-info-item">
            <span class="label">Div. Yield</span>
            <span class="value">${formatPct(dividendYield)}</span>
          </div>
        </div>
      </div>
      
      <!-- Empresa Info -->
      <div class="curiosity-info">
        <div class="info-section">
          <h2 class="empresa-name">${empresa}</h2>
          <p class="setor-badge">${setor}</p>
          <p class="descricao">${descricao}</p>
        </div>
      </div>
      
      <!-- Fatos Principais -->
      <div class="curiosity-fatos">
        <h3>📌 Fatos Principais</h3>
        <ul class="fatos-lista">
          ${fatos.map(fato => `<li>${fato}</li>`).join('')}
        </ul>
      </div>
      
      <!-- Insight -->
      <div class="curiosity-insight">
        <h3>💡 Insight para Investidores</h3>
        <p>${insight}</p>
      </div>
      
      <!-- Botão Link -->
      <div class="curiosity-actions">
        <a href="${link}" target="_blank" class="btn-curiosity-link">
          🔗 Visite o Site Oficial
        </a>
        <button class="btn-curiosity-share" onclick="compartilharCuriosidade()">
          📤 Compartilhar
        </button>
      </div>
      
      <!-- Próximas Curiosidades -->
      <div class="curiosity-next">
        <h3>📅 Próximas Curiosidades</h3>
        <div class="next-grid">
          ${gerarProximas3Curiosidades()}
        </div>
      </div>
      
      <!-- Footer Info -->
      <p class="curiosity-footer">
        💡 Dica: Volte amanhã para descobrir uma curiosidade diferente sobre outra empresa do S&P 500!
      </p>
    </div>
  `;
  
  // Adicionar estilos se não existirem
  adicionarEstilosCuriosidade();
}

/**
 * Gerar próximas 3 curiosidades
 */
function gerarProximas3Curiosidades() {
  if (!curiosidadeAtual) return '';
  
  const indiceAtual = curiosidadesData.indexOf(curiosidadeAtual);
  const proximas = [];
  
  for (let i = 1; i <= 3 && indiceAtual + i < curiosidadesData.length; i++) {
    const curiosidade = curiosidadesData[indiceAtual + i];
    proximas.push(`
      <div class="next-card">
        <div class="next-rank">${curiosidade.posicao}</div>
        <div class="next-symbol">${curiosidade.simbolo}</div>
        <div class="next-name">${curiosidade.empresa}</div>
      </div>
    `);
  }
  
  return proximas.join('');
}

/**
 * Compartilhar curiosidade
 */
function compartilharCuriosidade() {
  if (!curiosidadeAtual) return;
  
  const texto = `🌟 Curiosidade do Dia: ${curiosidadeAtual.titulo}
${curiosidadeAtual.empresa} (${curiosidadeAtual.simbolo})

${curiosidadeAtual.insight}

Descubra mais no SP500 Dashboard!`;
  
  // Copiar para clipboard
  navigator.clipboard.writeText(texto).then(() => {
    alert('✅ Curiosidade copiada para a área de transferência!');
  });
}

/**
 * Renderizar curiosidade local (fallback)
 */
function renderCuriosidadeLocal() {
  const container = document.getElementById('daily-curiosity-view');
  if (!container) return;
  
  container.innerHTML = `
    <div class="curiosity-container">
      <div class="curiosity-loading">
        <h2>📊 Curiosidade do Dia</h2>
        <p>Carregando curiosidade...</p>
        <p style="margin-top: 2rem; color: var(--text-muted);">
          Para adicionar curiosidades, edite o arquivo <code>curiosidades.json</code> e reinicie o servidor.
        </p>
      </div>
    </div>
  `;
}

/**
 * Formatar data em português
 */
function formatarData(data) {
  const opcoes = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  return data.toLocaleDateString('pt-BR', opcoes);
}

/**
 * Adicionar estilos CSS para curiosidade
 */
function adicionarEstilosCuriosidade() {
  // Verificar se já foi adicionado
  if (document.getElementById('curiosity-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'curiosity-styles';
  style.textContent = `
    .curiosity-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 2rem;
      background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-primary) 100%);
      border-radius: 12px;
    }
    
    .curiosity-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    
    .curiosity-badge {
      display: inline-block;
      padding: 0.5rem 1rem;
      background: linear-gradient(135deg, #ff6b6b, #ff8787);
      color: white;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: bold;
      margin-bottom: 1rem;
    }
    
    .curiosity-title {
      font-size: 2.5rem;
      color: var(--text-primary);
      margin: 1rem 0;
      font-weight: 700;
    }
    
    .curiosity-date {
      color: var(--text-muted);
      font-size: 0.95rem;
    }
    
    .curiosity-hero {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      margin-bottom: 2rem;
      align-items: center;
    }
    
    .curiosity-image {
      width: 100%;
      height: 300px;
      object-fit: cover;
      border-radius: 8px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }
    
    .curiosity-quick-info {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    
    .quick-info-item {
      background: var(--bg-tertiary);
      padding: 1.5rem;
      border-radius: 8px;
      text-align: center;
      border-left: 4px solid var(--accent-primary);
    }
    
    .quick-info-item .label {
      display: block;
      color: var(--text-muted);
      font-size: 0.85rem;
      margin-bottom: 0.5rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .quick-info-item .value {
      display: block;
      color: var(--text-primary);
      font-size: 1.3rem;
      font-weight: bold;
    }
    
    .curiosity-info {
      background: var(--bg-tertiary);
      padding: 2rem;
      border-radius: 8px;
      margin-bottom: 2rem;
    }
    
    .empresa-name {
      font-size: 2rem;
      color: var(--accent-primary);
      margin-bottom: 0.5rem;
    }
    
    .setor-badge {
      display: inline-block;
      background: var(--bg-secondary);
      padding: 0.4rem 0.8rem;
      border-radius: 4px;
      color: var(--text-muted);
      font-size: 0.85rem;
      margin-bottom: 1rem;
    }
    
    .descricao {
      font-size: 1.05rem;
      line-height: 1.6;
      color: var(--text-primary);
    }
    
    .curiosity-fatos,
    .curiosity-insight {
      background: var(--bg-tertiary);
      padding: 2rem;
      border-radius: 8px;
      margin-bottom: 2rem;
    }
    
    .curiosity-fatos h3,
    .curiosity-insight h3 {
      color: var(--accent-primary);
      margin-bottom: 1rem;
      font-size: 1.3rem;
    }
    
    .fatos-lista {
      list-style: none;
      padding: 0;
    }
    
    .fatos-lista li {
      padding: 0.8rem 0;
      padding-left: 2rem;
      position: relative;
      color: var(--text-primary);
      border-bottom: 1px solid var(--bg-secondary);
    }
    
    .fatos-lista li:last-child {
      border-bottom: none;
    }
    
    .fatos-lista li:before {
      content: "✓";
      position: absolute;
      left: 0;
      color: var(--accent-primary);
      font-weight: bold;
    }
    
    .curiosity-insight p {
      font-size: 1.1rem;
      line-height: 1.7;
      color: var(--text-primary);
      padding: 1rem;
      background: var(--bg-secondary);
      border-left: 4px solid var(--accent-primary);
      border-radius: 4px;
    }
    
    .curiosity-actions {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 2rem;
    }
    
    .btn-curiosity-link,
    .btn-curiosity-share {
      padding: 1rem 2rem;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
      text-align: center;
      display: block;
    }
    
    .btn-curiosity-link {
      background: linear-gradient(135deg, var(--accent-primary), #ff8787);
      color: white;
    }
    
    .btn-curiosity-link:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
    }
    
    .btn-curiosity-share {
      background: var(--bg-tertiary);
      color: var(--text-primary);
      border: 2px solid var(--accent-primary);
    }
    
    .btn-curiosity-share:hover {
      background: var(--accent-primary);
      color: white;
    }
    
    .curiosity-next {
      background: var(--bg-tertiary);
      padding: 2rem;
      border-radius: 8px;
      margin-bottom: 2rem;
    }
    
    .curiosity-next h3 {
      color: var(--accent-primary);
      margin-bottom: 1.5rem;
    }
    
    .next-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
    }
    
    .next-card {
      background: var(--bg-secondary);
      padding: 1.5rem;
      border-radius: 8px;
      text-align: center;
      border: 2px solid var(--bg-secondary);
      transition: all 0.3s ease;
      cursor: pointer;
    }
    
    .next-card:hover {
      border-color: var(--accent-primary);
      transform: translateY(-4px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
    }
    
    .next-rank {
      font-size: 0.85rem;
      color: var(--text-muted);
      text-transform: uppercase;
      margin-bottom: 0.5rem;
    }
    
    .next-symbol {
      font-size: 1.5rem;
      font-weight: bold;
      color: var(--accent-primary);
      margin-bottom: 0.5rem;
    }
    
    .next-name {
      font-size: 0.9rem;
      color: var(--text-primary);
      line-height: 1.4;
    }
    
    .curiosity-footer {
      text-align: center;
      color: var(--text-muted);
      font-size: 0.95rem;
      padding-top: 2rem;
      border-top: 1px solid var(--bg-tertiary);
    }
    
    .curiosity-loading {
      text-align: center;
      padding: 4rem 2rem;
    }
    
    .curiosity-loading h2 {
      color: var(--text-primary);
      margin-bottom: 1rem;
    }
    
    .curiosity-loading p {
      color: var(--text-muted);
    }
    
    code {
      background: var(--bg-tertiary);
      padding: 0.2rem 0.4rem;
      border-radius: 4px;
      color: var(--accent-primary);
      font-family: 'Courier New', monospace;
    }
    
    /* Responsivo */
    @media (max-width: 768px) {
      .curiosity-container {
        padding: 1rem;
      }
      
      .curiosity-title {
        font-size: 1.8rem;
      }
      
      .curiosity-hero {
        grid-template-columns: 1fr;
      }
      
      .curiosity-actions {
        grid-template-columns: 1fr;
      }
      
      .next-grid {
        grid-template-columns: 1fr;
      }
    }
  `;
  
  document.head.appendChild(style);
}

// Carregar curiosidades quando a página for inicializada
document.addEventListener('DOMContentLoaded', () => {
  // Aguardar um pouco para garantir que API_BASE_URL está definido
  setTimeout(() => {
    loadCuriosidades();
  }, 500);
});
