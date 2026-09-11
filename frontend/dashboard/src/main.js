import './style.css';
import './styles/globals.css';

import { loadTreemap } from './treemap.js';
import { loadHeatmap } from './heatmap.js';
import { loadBubbleChart } from './bubble-chart.js';

let currentTab = 'dashboard';

function setActiveTab(tab) {
  console.log('➡️ A mudar para a aba:', tab);
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

  // 2. Atualiza estado visual dos botões
  document.querySelectorAll('.nav-tab').forEach(btn => {
    if (btn.dataset.tab === currentTab) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // 3. Exibe a vista ativa e executa o respetivo gráfico
  if (currentTab === 'dashboard') {
    const dash = document.getElementById('dashboard-view');
    if (dash) dash.style.display = 'block';

  } else if (currentTab === 'treemap') {
    const tree = document.getElementById('treemap-view');
    if (tree) tree.style.display = 'block';
    if (typeof loadTreemap === 'function') loadTreemap();

  } else if (currentTab === 'heatmap') {
    const heat = document.getElementById('heatmap-view');
    if (heat) heat.style.display = 'block';
    if (typeof loadHeatmap === 'function') loadHeatmap();

  } else if (currentTab === 'bubble') {
    const bubble = document.getElementById('bubble-chart-view');
    if (bubble) bubble.style.display = 'block';
    if (typeof loadBubbleChart === 'function') loadBubbleChart();
  }
}

// Configuração dos eventos após o carregamento completo do DOM
function initApp() {
  console.log('🚀 App iniciada. A procurar botões .nav-tab...');
  const buttons = document.querySelectorAll('.nav-tab');
  console.log(`Encontrados ${buttons.length} botões.`);

  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetBtn = e.target.closest('.nav-tab');
      if (targetBtn && targetBtn.dataset.tab) {
        setActiveTab(targetBtn.dataset.tab);
      }
    });
  });

  // Renderiza o Dashboard inicialmente
  updateUI();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}