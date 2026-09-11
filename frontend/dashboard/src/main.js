// ==========================================
// 1. ESTADO E NAVEGAÇÃO DAS ABAS
// ==========================================

let currentTab = 'dashboard';

function setActiveTab(tab) {
  currentTab = tab;
  updateUI();
}

function updateUI() {
  // 1. Oculta todas as vistas
  const views = ['dashboard-view', 'treemap-view', 'heatmap-view', 'bubble-chart-view'];
  views.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });

  // 2. Atualiza classe 'active' dos botões de navegação
  document.querySelectorAll('.nav-tab').forEach(btn => {
    if (btn.dataset.tab === currentTab) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // 3. Exibe a vista ativa e dispara apenas a função correspondente
  if (currentTab === 'dashboard') {
    const dash = document.getElementById('dashboard-view');
    if (dash) dash.style.display = 'block';

  } else if (currentTab === 'treemap') {
    const tree = document.getElementById('treemap-view');
    if (tree) tree.style.display = 'block';
    if (typeof window.loadTreemap === 'function') {
      window.loadTreemap();
    }

  } else if (currentTab === 'heatmap') {
    const heat = document.getElementById('heatmap-view');
    if (heat) heat.style.display = 'block';
    if (typeof window.loadHeatmap === 'function') {
      window.loadHeatmap();
    }

  } else if (currentTab === 'bubble') {
    const bubble = document.getElementById('bubble-chart-view');
    if (bubble) bubble.style.display = 'block';
    if (typeof window.loadBubbleChart === 'function') {
      window.loadBubbleChart();
    }
  }
}

// ==========================================
// 2. INICIALIZAÇÃO DE EVENTOS
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  // Escuta os cliques nas abas
  document.querySelectorAll('.nav-tab').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetBtn = e.target.closest('.nav-tab');
      if (targetBtn && targetBtn.dataset.tab) {
        setActiveTab(targetBtn.dataset.tab);
      }
    });
  });

  // Garante a montagem inicial do Dashboard
  updateUI();
});