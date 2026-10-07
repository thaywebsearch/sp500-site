// ========== API HELPER FUNCTIONS ==========

/**
 * Obtém histórico de preços de uma ação
 * @param {string} symbol - Símbolo da ação (ex: 'AAPL')
 * @returns {Promise<Array>} Array de registros históricos
 */
export async function getPriceHistory(symbol) {
  try {
    const response = await fetch(`/api/historico/${symbol}`);
    if (!response.ok) throw new Error(`Erro ao buscar histórico de ${symbol}`);
    const data = await response.json();
    return data.registros || [];
  } catch (erro) {
    console.error(`Erro ao buscar histórico de ${symbol}:`, erro);
    return [];
  }
}

/**
 * Obtém resumo do dia (maiores altas e baixas)
 * @returns {Promise<Object>} Dados do resumo do dia
 */
export async function getDailySummary() {
  try {
    const response = await fetch('/api/resumo-dia');
    if (!response.ok) throw new Error('Erro ao buscar resumo do dia');
    const data = await response.json();
    return data.dados || {};
  } catch (erro) {
    console.error('Erro ao buscar resumo do dia:', erro);
    return {};
  }
}

/**
 * Obtém calendário de dividendos
 * @param {number} max - Número máximo de eventos (opcional)
 * @returns {Promise<Object>} Dados do calendário
 */
export async function getDividendCalendar(max = null) {
  try {
    const url = max ? `/api/calendario-dividendos?max=${max}` : '/api/calendario-dividendos';
    const response = await fetch(url);
    if (!response.ok) throw new Error('Erro ao buscar calendário de dividendos');
    const data = await response.json();
    return data.dados || {};
  } catch (erro) {
    console.error('Erro ao buscar calendário de dividendos:', erro);
    return {};
  }
}

/**
 * Health check - verifica se servidor está rodando
 * @returns {Promise<boolean>} true se servidor está OK
 */
export async function healthCheck() {
  try {
    const response = await fetch('/api/health');
    return response.ok;
  } catch (erro) {
    console.error('Erro ao fazer health check:', erro);
    return false;
  }
}
