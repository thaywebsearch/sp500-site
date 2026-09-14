async function loadHeatmap() {
  const container = document.getElementById('heatmap-view');
  if (!container) return;
  container.innerHTML = '<div class="loading"><div class="spinner"></div><p>Carregando...</p></div>';
  try {
    const res = await fetch(`${API_BASE_URL}/api/setores`);
    const data = await res.json();
    const setores = data.setores || [];
    const stats = await Promise.all(setores.map(async (id) => {
      const r = await fetch(`${API_BASE_URL}/api/setor/${id}`);
      const d = await r.json();
      const s = SECTORS.find(x => x.id === id);
      const cos = d.dados?.companies || [];
      const div = cos.filter(c => c.hasDividend === 'Sim').length;
      return { name: s?.name || id, cap: (cos.reduce((a, c) => a + (c.marketCap || 0), 0) / 1e9).toFixed(1), count: cos.length, div };
    }));
    container.innerHTML = '<div class="heatmap-container"><h2>?? Heatmap</h2><table style="width:100%;border-collapse:collapse"><tr><th style="border:1px solid var(--border);padding:10px">Setor</th><th style="border:1px solid var(--border);padding:10px">Market Cap</th><th style="border:1px solid var(--border);padding:10px">Empresas</th><th style="border:1px solid var(--border);padding:10px">Com Dividendo</th></tr>' + stats.map(s => `<tr><td style="border:1px solid var(--border);padding:10px">${s.name}</td><td style="border:1px solid var(--border);padding:10px">$${s.cap}B</td><td style="border:1px solid var(--border);padding:10px">${s.count}</td><td style="border:1px solid var(--border);padding:10px">${s.div}</td></tr>`).join('') + '</table></div>';
  } catch (e) { container.innerHTML = 'Erro ao carregar'; }
}
