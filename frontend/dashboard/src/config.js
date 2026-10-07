// ========== CONFIGURAÇÃO GLOBAL ==========
// Este arquivo deve carregar PRIMEIRO em index.html

const hostname = window.location.hostname;
export const API_BASE_URL = hostname === 'localhost' || hostname === '127.0.0.1'
  ? 'http://localhost:5001'
  : 'https://sp500-site-production.up.railway.app';

export const SECTORS = [
  { id: 'communication-services', name: 'Communication Services' },
  { id: 'consumer-discretionary', name: 'Consumer Discretionary' },
  { id: 'consumer-staples', name: 'Consumer Staples' },
  { id: 'energy', name: 'Energy' },
  { id: 'financials', name: 'Financials' },
  { id: 'health-care', name: 'Health Care' },
  { id: 'industrials', name: 'Industrials' },
  { id: 'information-technology', name: 'Information Technology' },
  { id: 'materials', name: 'Materials' },
  { id: 'real-estate', name: 'Real Estate' },
  { id: 'utilities', name: 'Utilities' },
];

// Backward compatibility - também define no window
window.API_BASE_URL = API_BASE_URL;
window.SECTORS = SECTORS;

console.log('✅ Configuração global carregada:', API_BASE_URL);
