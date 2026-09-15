import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yahooFinance from 'yahoo-finance2';

const yf = new yahooFinance({ suppressNotices: ['yahooSurvey'] });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = __dirname;

const sectors = [
  'communication-services',
  'consumer-discretionary',
  'consumer-staples',
  'energy',
  'financials',
  'health-care',
  'industrials',
  'information-technology',
  'materials',
  'real-estate',
  'utilities'
];

function getMarketCapClassification(marketCap) {
  if (!marketCap) return 'Unknown';
  if (marketCap >= 200_000_000_000) return 'Mega';
  if (marketCap >= 10_000_000_000) return 'Large';
  if (marketCap >= 2_000_000_000) return 'Mid';
  if (marketCap >= 300_000_000) return 'Small';
  return 'Micro';
}

function hasDividendYield(dividendYield) {
  return dividendYield && dividendYield > 0 ? 'Sim' : 'Não';
}

async function fetchCompanyData(symbol) {
  try {
    const quote = await yf.quote(symbol);
    return {
      symbol,
      marketCap: quote.marketCap || null,
      marketCapClassification: getMarketCapClassification(quote.marketCap),
      dividendYield: quote.dividendYield || null,
      hasDividend: hasDividendYield(quote.dividendYield)
    };
  } catch (error) {
    console.error(`Erro ao buscar ${symbol}:`, error.message);
    return {
      symbol,
      marketCap: null,
      marketCapClassification: 'Unknown',
      dividendYield: null,
      hasDividend: 'Não'
    };
  }
}

async function enrichSectorFile(sectorDir) {
  const filePath = path.join(DATA_DIR, sectorDir, `${sectorDir}.json`);
  const content = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(content);
  
  const symbols = data.companies.map(c => c.symbol);
  console.log(`Processing ${sectorDir} - ${symbols.length} companies...`);
  
  const batchSize = 10;
  const enrichedData = {};
  
  for (let i = 0; i < symbols.length; i += batchSize) {
    const batch = symbols.slice(i, i + batchSize);
    console.log(`  Batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(symbols.length/batchSize)}`);
    
    const results = await Promise.all(batch.map(s => fetchCompanyData(s)));
    results.forEach(r => {
      enrichedData[r.symbol] = r;
    });
    
    if (i + batchSize < symbols.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  data.companies = data.companies.map(company => {
    const enriched = enrichedData[company.symbol] || {};
    return {
      ...company,
      marketCap: enriched.marketCap,
      marketCapClassification: enriched.marketCapClassification,
      dividendYield: enriched.dividendYield,
      hasDividend: enriched.hasDividend
    };
  });
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`  ✓ Updated ${filePath}`);
}

async function main() {
  console.log('Iniciando enriquecimento de dados...\n');
  
  for (const sector of sectors) {
    try {
      await enrichSectorFile(sector);
    } catch (error) {
      console.error(`Error processing ${sector}:`, error.message);
    }
  }
  
  console.log('\n✓ Todos os setores enriquecidos!');
}

main().catch(console.error);