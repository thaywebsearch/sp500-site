// ========== API HELPER FUNCTIONS ==========
import { API_BASE_URL } from './config.js';

// Um pedido pendurado no browser é tão mau como um erro: limita a espera.
const TIMEOUT_PADRAO_MS = 12000;

/** fetch com timeout explícito (AbortController) e limpeza do temporizador. */
async function fetchComTimeout(url, { timeoutMs = TIMEOUT_PADRAO_MS } = {}) {
  const controller = new AbortController();
  const temporizador = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(temporizador);
  }
}

/**
 * Obtém histórico de preços de uma ação
 * @param {string} symbol - Símbolo da ação (ex: 'AAPL')
 * @returns {Promise<Array>} Array de registros históricos
 */
export async function getPriceHistory(symbol) {
  try {
    const response = await fetchComTimeout(
      `${API_BASE_URL}/api/historico/${encodeURIComponent(symbol)}`
    );
    if (!response.ok) throw new Error(`Erro ao buscar histórico de ${symbol}`);
    const data = await response.json();
    return data.registros || [];
  } catch (erro) {
    console.error(`Erro ao buscar histórico de ${symbol}:`, erro);
    return [];
  }
}

/**
 * Obtém cotações atuais em lote (1 pedido para N símbolos).
 * @param {string[]} symbols
 * @returns {Promise<Object>} mapa símbolo -> { preco, data, moeda, stale }
 */
export async function getQuotes(symbols) {
  const lista = [...new Set((symbols || []).map((s) => String(s).toUpperCase()).filter(Boolean))];
  if (lista.length === 0) return {};

  try {
    const response = await fetchComTimeout(
      `${API_BASE_URL}/api/cotacoes?symbols=${encodeURIComponent(lista.join(','))}`
    );
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return data.cotacoes || {};
  } catch (erro) {
    console.error('Erro ao buscar cotações:', erro);
    return {};
  }
}

/**
 * Obtém o relatório agregado de inteligência setorial (GICS)
 * @returns {Promise<Object|null>} Relatório ou null se a rota não estiver disponível
 */
export async function getSectorIntelligence() {
  try {
    const response = await fetchComTimeout(`${API_BASE_URL}/api/inteligencia-setorial`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return data.dados || null;
  } catch (erro) {
    console.error('Erro ao buscar inteligência setorial:', erro);
    return null;
  }
}

/**
 * Obtém resumo do dia (maiores altas e baixas)
 * @returns {Promise<Object>} Dados do resumo do dia
 */
export async function getDailySummary() {
  try {
    const response = await fetchComTimeout(`${API_BASE_URL}/api/resumo-dia`);
    if (!response.ok) throw new Error('Erro ao buscar resumo do dia');
    const data = await response.json();
    return data.dados || {};
  } catch (erro) {
    console.error('Erro ao buscar resumo do dia:', erro);
    return {};
  }
}

/**
 * Health check - verifica se servidor está rodando
 * @returns {Promise<boolean>} true se servidor está OK
 */
export async function healthCheck() {
  try {
    const response = await fetchComTimeout(`${API_BASE_URL}/api/health`);
    return response.ok;
  } catch (erro) {
    console.error('Erro ao fazer health check:', erro);
    return false;
  }
}
