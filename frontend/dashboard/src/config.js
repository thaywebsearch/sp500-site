// ========== CONFIGURAÇÃO GLOBAL ==========
// Este arquivo deve carregar PRIMEIRO em index.html

// Permite repontar a API sem alterar o codigo: definir VITE_API_URL no build.
const API_URL_FROM_ENV = import.meta.env?.VITE_API_URL;
const hostname = window.location.hostname;
const ehLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';

export const API_BASE_URL =
  API_URL_FROM_ENV ||
  (ehLocalhost ? 'http://localhost:5001' : 'https://sp500-api.onrender.com');

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
