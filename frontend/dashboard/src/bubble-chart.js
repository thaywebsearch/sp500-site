import { API_BASE_URL, SECTORS } from './config.js';

export async function loadBubbleChart() {
  const container = document.getElementById('bubble-chart-view');
  if (!container) return;
  container.innerHTML =
    '<div class="loading"><div class="spinner"></div><p>Carregando...</p></div>';
  try {
    const res = await fetch(`${API_BASE_URL}/api/setores`);
    const data = await res.json();
    const setores = data.setores || [];
    const stats = await Promise.all(
      setores.map(async (id) => {
        const r = await fetch(`${API_BASE_URL}/api/setor/${id}`);
        const d = await r.json();
        const s = SECTORS.find((x) => x.id === id);
        const cos = d.dados?.companies || [];
        return {
          name: s?.name || id,
          cap: cos.reduce((a, c) => a + (c.marketCap || 0), 0) / 1e9,
          count: cos.length,
          color: Math.random() * 0xffffff,
        };
      })
    );
    container.innerHTML =
      '<div class="bubble-chart-container"><h2>🫧 Bubble Chart</h2><div style="padding:20px;background:var(--bg-secondary);border-radius:8px">' +
      stats
        .map(
          (s) =>
            `<div style="padding:10px;margin:5px;background:#${Math.floor(s.color).toString(16).padStart(6, '0')};color:white;border-radius:4px">${s.name}: $${s.cap.toFixed(1)}B (${s.count} empresas)</div>`
        )
        .join('') +
      '</div></div>';
  } catch (e) {
    container.innerHTML = 'Erro ao carregar: ' + e.message;
  }
}
