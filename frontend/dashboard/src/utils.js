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

const US_STATES = new Set([
  'Alabama',
  'Alaska',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'Florida',
  'Georgia',
  'Hawaii',
  'Idaho',
  'Illinois',
  'Indiana',
  'Iowa',
  'Kansas',
  'Kentucky',
  'Louisiana',
  'Maine',
  'Maryland',
  'Massachusetts',
  'Michigan',
  'Minnesota',
  'Mississippi',
  'Missouri',
  'Montana',
  'Nebraska',
  'Nevada',
  'New Hampshire',
  'New Jersey',
  'New Mexico',
  'New York',
  'North Carolina',
  'North Dakota',
  'Ohio',
  'Oklahoma',
  'Oregon',
  'Pennsylvania',
  'Rhode Island',
  'South Carolina',
  'South Dakota',
  'Tennessee',
  'Texas',
  'Utah',
  'Vermont',
  'Virginia',
  'Washington',
  'West Virginia',
  'Wisconsin',
  'Wyoming',
  'D.C.',
]);

export function getCountry(headquarters) {
  if (!headquarters) return 'Desconhecido';
  const parts = String(headquarters)
    .split(',')
    .map((s) => s.trim().replace(/\[\d+\]$/, ''));
  const tail = parts[parts.length - 1];
  if (!tail || tail.toLowerCase() === 'none') return 'Desconhecido';
  return US_STATES.has(tail) ? 'United States' : tail;
}

export function filterCompanies(
  companies,
  { sector = '', search = '', country = '', dividendMin = '' } = {}
) {
  let result = [...companies];
  const searchValue = search.toLowerCase().trim();

  if (sector) {
    result = result.filter((c) => c.sector === sector);
  }

  if (country) {
    result = result.filter((c) => getCountry(c.headquarters) === country);
  }

  if (dividendMin !== '' && dividendMin !== null && dividendMin !== undefined) {
    const min = Number(dividendMin);
    if (!Number.isNaN(min)) {
      result = result.filter(
        (c) => c.dividendYield !== null && c.dividendYield !== undefined && c.dividendYield >= min
      );
    }
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
