// ============ INTELIGÊNCIA SETORIAL GICS ============
// Funções puras que agregam os datasets dos 11 setores do S&P 500 em métricas
// comparáveis: tamanho, concentração (HHI), amplitude e perfil de dividendos.
// Não lêem ficheiros nem dependem do Express — são testáveis isoladamente e
// usadas pela rota GET /api/inteligencia-setorial.

/** Limiares do Herfindahl-Hirschman Index (0–10 000), por setor. */
export const HHI_ALTA = 2500;
export const HHI_MODERADA = 1500;

/** Limiares de cobertura de dividendos (rácio de empresas pagadoras). */
export const COBERTURA_RENDA = 0.7;
export const COBERTURA_EQUILIBRADA = 0.4;

const TOP_EMPRESAS = 5;
const TOP_SUBINDUSTRIAS = 3;

function arredondar(valor, casas = 2) {
  const fator = 10 ** casas;
  return Math.round((valor + Number.EPSILON) * fator) / fator;
}

function numeroPositivo(valor) {
  const num = Number(valor);
  return Number.isFinite(num) && num > 0 ? num : 0;
}

function yieldDe(empresa) {
  return numeroPositivo(empresa && empresa.dividendYield);
}

/** Mediana de uma lista de números (ignora valores inválidos). */
export function mediana(valores) {
  const nums = (valores || [])
    .filter((v) => v !== null && v !== undefined && v !== '')
    .map(Number)
    .filter((v) => Number.isFinite(v))
    .sort((a, b) => a - b);
  if (nums.length === 0) return 0;
  const meio = Math.floor(nums.length / 2);
  return nums.length % 2 === 1 ? nums[meio] : (nums[meio - 1] + nums[meio]) / 2;
}

/**
 * Herfindahl-Hirschman Index de uma lista de market caps.
 * 0 = pulverizado; 10 000 = uma única empresa detém todo o setor.
 */
export function hhi(valores) {
  const caps = (valores || []).map(numeroPositivo).filter((v) => v > 0);
  const total = caps.reduce((soma, v) => soma + v, 0);
  if (total <= 0) return 0;
  const somaQuadrados = caps.reduce((soma, v) => soma + (v / total) ** 2, 0);
  return arredondar(somaQuadrados * 10000, 1);
}

/** Classifica a concentração de mercado a partir do HHI. */
export function classificarConcentracao(indice) {
  if (indice >= HHI_ALTA) return 'Alta';
  if (indice >= HHI_MODERADA) return 'Moderada';
  return 'Baixa';
}

/** Classifica o perfil do setor pela cobertura de dividendos. */
export function classificarPerfil(cobertura) {
  if (cobertura >= COBERTURA_RENDA) return 'Renda';
  if (cobertura >= COBERTURA_EQUILIBRADA) return 'Equilibrado';
  return 'Crescimento';
}

function totalMarketCap(empresas) {
  return (empresas || []).reduce((soma, empresa) => soma + numeroPositivo(empresa.marketCap), 0);
}

function listarTopEmpresas(empresas, total) {
  return (empresas || [])
    .filter((empresa) => numeroPositivo(empresa.marketCap) > 0)
    .slice()
    .sort(
      (a, b) =>
        numeroPositivo(b.marketCap) - numeroPositivo(a.marketCap) ||
        String(a.symbol).localeCompare(String(b.symbol))
    )
    .slice(0, TOP_EMPRESAS)
    .map((empresa) => ({
      symbol: empresa.symbol || 'N/D',
      name: empresa.name || empresa.symbol || 'N/D',
      marketCap: numeroPositivo(empresa.marketCap),
      weight: total > 0 ? arredondar(numeroPositivo(empresa.marketCap) / total, 4) : 0,
    }));
}

function listarSubIndustrias(empresas, total) {
  const mapa = new Map();
  for (const empresa of empresas || []) {
    const nome = empresa.subIndustry || 'N/D';
    if (!mapa.has(nome)) mapa.set(nome, { name: nome, count: 0, marketCap: 0 });
    const entrada = mapa.get(nome);
    entrada.count += 1;
    entrada.marketCap += numeroPositivo(empresa.marketCap);
  }
  return Array.from(mapa.values())
    .sort(
      (a, b) => b.count - a.count || b.marketCap - a.marketCap || a.name.localeCompare(b.name)
    )
    .slice(0, TOP_SUBINDUSTRIAS)
    .map((entrada) => ({
      name: entrada.name,
      count: entrada.count,
      weight: total > 0 ? arredondar(entrada.marketCap / total, 4) : 0,
    }));
}

/**
 * Calcula as métricas de um setor.
 * @param {{id: string, name?: string, companies?: Array, generatedAt?: string}} setor
 * @param {number} [marketCapDoIndice] Market cap total do índice (para a participação).
 */
export function buildSectorMetrics(setor, marketCapDoIndice = 0) {
  const empresas = Array.isArray(setor && setor.companies) ? setor.companies : [];
  const id = (setor && setor.id) || 'N/D';
  const nome = (setor && setor.name) || id;
  const total = totalMarketCap(empresas);
  const base = numeroPositivo(marketCapDoIndice) || total;

  const pagadoras = empresas.filter((empresa) => yieldDe(empresa) > 0);
  const somaYields = pagadoras.reduce((soma, empresa) => soma + yieldDe(empresa), 0);
  const cobertura = empresas.length > 0 ? pagadoras.length / empresas.length : 0;
  const topEmpresas = listarTopEmpresas(empresas, total);
  const indiceConcentracao = hhi(empresas.map((empresa) => empresa.marketCap));

  return {
    id,
    name: nome,
    companyCount: empresas.length,
    totalMarketCap: total,
    marketCapShare: base > 0 ? arredondar(total / base, 4) : 0,
    medianMarketCap: mediana(empresas.map((empresa) => empresa.marketCap)),
    averageMarketCap: empresas.length > 0 ? Math.round(total / empresas.length) : 0,
    hhi: indiceConcentracao,
    concentration: classificarConcentracao(indiceConcentracao),
    topCompany: topEmpresas[0] || null,
    topCompanies: topEmpresas,
    top3Weight: arredondar(
      topEmpresas.slice(0, 3).reduce((soma, empresa) => soma + empresa.weight, 0),
      4
    ),
    dividendPayers: pagadoras.length,
    dividendCoverage: arredondar(cobertura, 4),
    averageDividendYield: pagadoras.length > 0 ? arredondar(somaYields / pagadoras.length, 2) : 0,
    incomeProfile: classificarPerfil(cobertura),
    subIndustryCount: new Set(empresas.map((empresa) => empresa.subIndustry || 'N/D')).size,
    topSubIndustries: listarSubIndustrias(empresas, total),
    rank: 0,
  };
}

function resumo(sector, campo) {
  if (!sector) return null;
  return { id: sector.id, name: sector.name, [campo]: sector[campo] };
}

function buildHighlights(setores) {
  if (setores.length === 0) {
    return {
      largestSector: null,
      mostConcentrated: null,
      mostDiversified: null,
      highestYield: null,
      widestSector: null,
    };
  }

  const porCap = setores[0];
  const maisConcentrado = setores.reduce((melhor, atual) =>
    atual.hhi > melhor.hhi ? atual : melhor
  );
  const maisDiversificado = setores.reduce((melhor, atual) =>
    atual.hhi < melhor.hhi ? atual : melhor
  );
  const comYield = setores.filter((s) => s.averageDividendYield > 0);
  const maiorYield = comYield.length
    ? comYield.reduce((melhor, atual) =>
        atual.averageDividendYield > melhor.averageDividendYield ? atual : melhor
      )
    : null;
  const maisAmplo = setores.reduce((melhor, atual) =>
    atual.companyCount > melhor.companyCount ? atual : melhor
  );

  return {
    largestSector: {
      id: porCap.id,
      name: porCap.name,
      marketCap: porCap.totalMarketCap,
      share: porCap.marketCapShare,
    },
    mostConcentrated: resumo(maisConcentrado, 'hhi'),
    mostDiversified: resumo(maisDiversificado, 'hhi'),
    highestYield: resumo(maiorYield, 'averageDividendYield'),
    widestSector: resumo(maisAmplo, 'companyCount'),
  };
}

/**
 * Constrói o relatório completo de inteligência setorial.
 * @param {Array<{id: string, name?: string, companies?: Array, generatedAt?: string}>} setores
 * @param {{generatedAt?: string}} [opcoes]
 */
export function buildSectorIntelligence(setores, opcoes = {}) {
  const lista = (Array.isArray(setores) ? setores : []).filter((setor) => setor && setor.id);
  const totalIndice = lista.reduce((soma, setor) => soma + totalMarketCap(setor.companies), 0);

  const metricas = lista
    .map((setor) => buildSectorMetrics(setor, totalIndice))
    .sort((a, b) => b.totalMarketCap - a.totalMarketCap || a.name.localeCompare(b.name));

  metricas.forEach((setor, indice) => {
    setor.rank = indice + 1;
  });

  const todasEmpresas = lista.flatMap((setor) =>
    Array.isArray(setor.companies) ? setor.companies : []
  );
  const pagadoras = todasEmpresas.filter((empresa) => yieldDe(empresa) > 0);
  const datas = lista
    .map((setor) => setor.generatedAt)
    .filter(Boolean)
    .sort();

  return {
    generatedAt: opcoes.generatedAt || datas[datas.length - 1] || null,
    sectorCount: metricas.length,
    totalCompanies: todasEmpresas.length,
    totalMarketCap: totalIndice,
    dividendPayers: pagadoras.length,
    dividendCoverage:
      todasEmpresas.length > 0 ? arredondar(pagadoras.length / todasEmpresas.length, 4) : 0,
    indexHhi: hhi(todasEmpresas.map((empresa) => empresa.marketCap)),
    sectors: metricas,
    highlights: buildHighlights(metricas),
  };
}
