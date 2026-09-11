// Importação de estilos para o Vite compilar
import './style.css';
import './styles/globals.css';

// 1. IMPORTAÇÃO DOS MÓDULOS DE GRÁFICOS
// ==========================================
import { loadTreemap } from './treemap.js';
import { loadHeatmap } from './heatmap.js';
import { loadBubbleChart } from './bubble-chart.js';

// ==========================================
// 2. ESTADO DA APLICAÇÃO E NAVEGAÇÃO
// ==========================================
let currentTab = 'dashboard';

/**
 * Altera a aba ativa e dispara a atualização da UI
 * @param {string} tab - ID da aba ('dashboard', 'treemap', 'heatmap', 'bubble')
 */
function setActiveTab(tab) {
  currentTab = tab;
  updateUI();
}

/**
 * Atualiza a visibilidade das vistas e carrega os gráficos sob procura
 */
function updateUI() {
  // 1. Oculta todas as vistas
  const views = ['dashboard-view', 'treemap-view', 'heatmap-view', 'bubble-chart-view'];
  views.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });

  // 2. Atualiza os botões (adiciona/remove a classe 'active')
  document.querySelectorAll('.nav-tab').forEach(btn => {
    if (btn.dataset.tab === currentTab) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // 3. Exibe a vista ativa e dispara a renderização apenas do gráfico selecionado
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

// ==========================================
// 3. EVENT LISTENERS E INICIALIZAÇÃO
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  // Atribui os ouvintes de clique aos botões de navegação
  document.querySelectorAll('.nav-tab').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetBtn = e.target.closest('.nav-tab');
      if (targetBtn && targetBtn.dataset.tab) {
        setActiveTab(targetBtn.dataset.tab);
      }
    });
  });

  // Carrega o Dashboard inicialmente
  updateUI();
});