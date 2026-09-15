// ========== UTILIDADES PURAS (testáveis) ==========

export function formatMarketCap(marketCap) {
  if (!marketCap) return 'N/A';
  if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`;
  if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`;
  if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`;
  return `$${marketCap.toLocaleString('en-US')}`;
}

export function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function debounce(fn, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

export function filterCompanies(companies, { sector = '', search = '' } = {}) {
  let result = [...companies];
  const searchValue = search.toLowerCase().trim();

  if (sector) {
    result = result.filter((c) => c.sector === sector);
  }

  if (searchValue) {
    result = result.filter(
      (c) =>
        c.symbol.toLowerCase().includes(searchValue) ||
        c.name.toLowerCase().includes(searchValue) ||
        (c.subIndustry && c.subIndustry.toLowerCase().includes(searchValue)) ||
        (c.headquarters && c.headquarters.toLowerCase().includes(searchValue))
    );
  }

  return result;
}

export function sortCompanies(companies, sortValue = 'symbol-asc') {
  const sorted = [...companies];
  sorted.sort((a, b) => {
    switch (sortValue) {
      case 'marketCap-desc':
        return (b.marketCap || 0) - (a.marketCap || 0);
      case 'marketCap-asc':
        return (a.marketCap || 0) - (b.marketCap || 0);
      case 'symbol-asc':
        return a.symbol.localeCompare(b.symbol);
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'dividendYield-desc':
        return (b.dividendYield || 0) - (a.dividendYield || 0);
      default:
        return 0;
    }
  });
  return sorted;
}
