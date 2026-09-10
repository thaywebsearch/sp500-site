// Estados da aplicação
let currentTab = 'dashboard';

// Função para mudar de aba
function setActiveTab(tab) {
  currentTab = tab;
  updateUI();
}

// Função para atualizar UI
function updateUI() {
  // Oculta tudo
  document.getElementById('dashboard-view').style.display = 'none';
  document.getElementById('treemap-view').style.display = 'none';
  document.getElementById('heatmap-view').style.display = 'none';

  // Mostra apenas a aba ativa
  if (currentTab === 'dashboard') {
    document.getElementById('dashboard-view').style.display = 'block';

  } else if (currentTab === 'treemap') {
    document.getElementById('treemap-view').style.display = 'block';
    // Treemap já carrega sozinho
  } else if (currentTab === 'heatmap') {
    document.getElementById('heatmap-view').style.display = 'block';
    // Heatmap já carrega sozinho
  }
}

// Atualiza botões de navegação
function updateTabButtons() {
  const buttons = document.querySelectorAll('.nav-tab');
  buttons.forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.tab === currentTab) {
      btn.classList.add('active');
    }
  });
}

// Event listeners para botões
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.nav-tab').forEach(btn => {
    btn.addEventListener('click', (e) => {
      setActiveTab(e.target.dataset.tab);
      updateTabButtons();
    });
  });

  // Inicializa
  updateUI();
  updateTabButtons();
});

// Seu código original do dashboard vai aqui...
// (copie tudo que tinha antes de "async function loadAllData")