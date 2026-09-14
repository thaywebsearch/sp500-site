async function loadTreemap() {
  const container = document.getElementById('treemap-view');
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
      return { name: s?.name || id, value: cos.reduce((a, c) => a + (c.marketCap || 0), 0), companies: cos.length };
    }));
    const total = stats.reduce((a, s) => a + s.value, 0);
    container.innerHTML = '<div class="treemap-container"><h2>??? Mapa de Setores</h2><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px;padding:20px">' + stats.map((s, i) => `<div style="background:#${Math.random().toString(16).slice(2,8)};padding:15px;border-radius:8px;text-align:center;color:white"><div>${s.name}</div><div>$${(s.value/1e9).toFixed(1)}B</div></div>`).join('') + '</div></div>';
  } catch (e) { container.innerHTML = 'Erro ao carregar'; }
}
