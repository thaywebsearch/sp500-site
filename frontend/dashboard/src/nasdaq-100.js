// ========== NASDAQ-100 MODULE ==========

import { escapeHtml } from './utils.js';

export const NASDAQ_100 = [
  {
    rank: 1,
    ticker: 'NVDA',
    company: 'NVIDIA Corporation',
    sector: 'Technology',
    weight: 13.31,
    cap: 5470,
    category: 'Mega Cap',
    cumulative: 13.31,
    concentration: 'Top 10',
  },
  {
    rank: 2,
    ticker: 'AAPL',
    company: 'Apple Inc.',
    sector: 'Technology',
    weight: 11.57,
    cap: 4390,
    category: 'Mega Cap',
    cumulative: 24.88,
    concentration: 'Top 10',
  },
  {
    rank: 3,
    ticker: 'MSFT',
    company: 'Microsoft Corporation',
    sector: 'Technology',
    weight: 8.55,
    cap: 3010,
    category: 'Mega Cap',
    cumulative: 33.43,
    concentration: 'Top 10',
  },
  {
    rank: 4,
    ticker: 'AMZN',
    company: 'Amazon.com Inc.',
    sector: 'Consumer Discretionary',
    weight: 7.07,
    cap: 2910,
    category: 'Mega Cap',
    cumulative: 40.5,
    concentration: 'Top 10',
  },
  {
    rank: 5,
    ticker: 'GOOGL',
    company: 'Alphabet Inc. Class A',
    sector: 'Communication Services',
    weight: 5.75,
    cap: 4880,
    category: 'Mega Cap',
    cumulative: 46.25,
    concentration: 'Top 10',
  },
  {
    rank: 6,
    ticker: 'GOOG',
    company: 'Alphabet Inc. Class C',
    sector: 'Communication Services',
    weight: 5.33,
    cap: 4830,
    category: 'Mega Cap',
    cumulative: 51.58,
    concentration: 'Top 10',
  },
  {
    rank: 7,
    ticker: 'AVGO',
    company: 'Broadcom Inc.',
    sector: 'Technology',
    weight: 4.6,
    cap: 1970,
    category: 'Mega Cap',
    cumulative: 56.18,
    concentration: 'Top 10',
  },
  {
    rank: 8,
    ticker: 'META',
    company: 'Meta Platforms Inc. Class A',
    sector: 'Communication Services',
    weight: 4.58,
    cap: 1570,
    category: 'Mega Cap',
    cumulative: 60.76,
    concentration: 'Top 10',
  },
  {
    rank: 9,
    ticker: 'TSLA',
    company: 'Tesla Inc.',
    sector: 'Consumer Discretionary',
    weight: 4.44,
    cap: 1670,
    category: 'Mega Cap',
    cumulative: 65.2,
    concentration: 'Top 10',
  },
  {
    rank: 10,
    ticker: 'WMT',
    company: 'Walmart Inc.',
    sector: 'Consumer Staples',
    weight: 3.06,
    cap: 1050,
    category: 'Mega Cap',
    cumulative: 68.26,
    concentration: 'Top 10',
  },
  {
    rank: 11,
    ticker: 'ASML',
    company: 'ASML Holding N.V.',
    sector: 'Technology',
    weight: 1.65,
    cap: 609.6,
    category: 'Mega Cap',
    cumulative: 69.91,
    concentration: 'Top 11–25',
  },
  {
    rank: 12,
    ticker: 'COST',
    company: 'Costco Wholesale Corporation',
    sector: 'Consumer Staples',
    weight: 1.37,
    cap: 458.3,
    category: 'Mega Cap',
    cumulative: 71.28,
    concentration: 'Top 11–25',
  },
  {
    rank: 13,
    ticker: 'MU',
    company: 'Micron Technology Inc.',
    sector: 'Technology',
    weight: 1.3,
    cap: 906.3,
    category: 'Mega Cap',
    cumulative: 72.58,
    concentration: 'Top 11–25',
  },
  {
    rank: 14,
    ticker: 'NFLX',
    company: 'Netflix Inc.',
    sector: 'Communication Services',
    weight: 1.25,
    cap: 368.7,
    category: 'Mega Cap',
    cumulative: 73.83,
    concentration: 'Top 11–25',
  },
  {
    rank: 15,
    ticker: 'PLTR',
    company: 'Palantir Technologies Inc. Class A',
    sector: 'Technology',
    weight: 1.09,
    cap: 311.8,
    category: 'Mega Cap',
    cumulative: 74.92,
    concentration: 'Top 11–25',
  },
  {
    rank: 16,
    ticker: 'AMD',
    company: 'Advanced Micro Devices Inc.',
    sector: 'Technology',
    weight: 1.07,
    cap: 726.4,
    category: 'Mega Cap',
    cumulative: 75.99,
    concentration: 'Top 11–25',
  },
  {
    rank: 17,
    ticker: 'CSCO',
    company: 'Cisco Systems Inc.',
    sector: 'Technology',
    weight: 0.97,
    cap: 402.4,
    category: 'Mega Cap',
    cumulative: 76.96,
    concentration: 'Top 11–25',
  },
  {
    rank: 18,
    ticker: 'AMAT',
    company: 'Applied Materials Inc.',
    sector: 'Technology',
    weight: 0.88,
    cap: 346.5,
    category: 'Mega Cap',
    cumulative: 77.84,
    concentration: 'Top 11–25',
  },
  {
    rank: 19,
    ticker: 'LRCX',
    company: 'Lam Research Corporation',
    sector: 'Technology',
    weight: 0.86,
    cap: 369.5,
    category: 'Mega Cap',
    cumulative: 78.7,
    concentration: 'Top 11–25',
  },
  {
    rank: 20,
    ticker: 'INTC',
    company: 'Intel Corporation',
    sector: 'Technology',
    weight: 0.76,
    cap: 604.6,
    category: 'Mega Cap',
    cumulative: 79.46,
    concentration: 'Top 11–25',
  },
  {
    rank: 21,
    ticker: 'LIN',
    company: 'Linde plc',
    sector: 'Materials',
    weight: 0.71,
    cap: 237.3,
    category: 'Mega Cap',
    cumulative: 80.17,
    concentration: 'Top 11–25',
  },
  {
    rank: 22,
    ticker: 'TMUS',
    company: 'T-Mobile US Inc.',
    sector: 'Communication Services',
    weight: 0.69,
    cap: 205.9,
    category: 'Mega Cap',
    cumulative: 80.86,
    concentration: 'Top 11–25',
  },
  {
    rank: 23,
    ticker: 'PEP',
    company: 'PepsiCo Inc.',
    sector: 'Consumer Staples',
    weight: 0.65,
    cap: 204,
    category: 'Mega Cap',
    cumulative: 81.51,
    concentration: 'Top 11–25',
  },
  {
    rank: 24,
    ticker: 'KLAC',
    company: 'KLA Corporation',
    sector: 'Technology',
    weight: 0.62,
    cap: 241.6,
    category: 'Mega Cap',
    cumulative: 82.13,
    concentration: 'Top 11–25',
  },
  {
    rank: 25,
    ticker: 'AMGN',
    company: 'Amgen Inc.',
    sector: 'Health Care',
    weight: 0.59,
    cap: 181.7,
    category: 'Large Cap',
    cumulative: 82.72,
    concentration: 'Top 11–25',
  },
  {
    rank: 26,
    ticker: 'TXN',
    company: 'Texas Instruments Incorporated',
    sector: 'Technology',
    weight: 0.56,
    cap: 278.8,
    category: 'Mega Cap',
    cumulative: 83.28,
    concentration: 'Rest (26–100)',
  },
  {
    rank: 27,
    ticker: 'GILD',
    company: 'Gilead Sciences Inc.',
    sector: 'Health Care',
    weight: 0.54,
    cap: 165.2,
    category: 'Large Cap',
    cumulative: 83.82,
    concentration: 'Rest (26–100)',
  },
  {
    rank: 28,
    ticker: 'ISRG',
    company: 'Intuitive Surgical Inc.',
    sector: 'Health Care',
    weight: 0.51,
    cap: 153.1,
    category: 'Large Cap',
    cumulative: 84.33,
    concentration: 'Rest (26–100)',
  },
  {
    rank: 29,
    ticker: 'ARM',
    company: 'Arm Holdings plc ADR',
    sector: 'Technology',
    weight: 0.5,
    cap: 235.4,
    category: 'Mega Cap',
    cumulative: 84.83,
    concentration: 'Rest (26–100)',
  },
  {
    rank: 30,
    ticker: 'ADI',
    company: 'Analog Devices Inc.',
    sector: 'Technology',
    weight: 0.49,
    cap: 211.1,
    category: 'Mega Cap',
    cumulative: 85.32,
    concentration: 'Rest (26–100)',
  },
  {
    rank: 31,
    ticker: 'SHOP',
    company: 'Shopify Inc. Class A',
    sector: 'Consumer Discretionary',
    weight: 0.48,
    cap: 123.8,
    category: 'Large Cap',
    cumulative: 85.8,
    concentration: 'Rest (26–100)',
  },
  {
    rank: 32,
    ticker: 'PDD',
    company: 'PDD Holdings Inc. ADR',
    sector: 'Consumer Discretionary',
    weight: 0.45,
    cap: 141.8,
    category: 'Large Cap',
    cumulative: 86.25,
    concentration: 'Rest (26–100)',
  },
  {
    rank: 33,
    ticker: 'HON',
    company: 'Honeywell International Inc.',
    sector: 'Industrials',
    weight: 0.45,
    cap: 138.1,
    category: 'Large Cap',
    cumulative: 86.7,
    concentration: 'Rest (26–100)',
  },
  {
    rank: 34,
    ticker: 'QCOM',
    company: 'QUALCOMM Incorporated',
    sector: 'Technology',
    weight: 0.43,
    cap: 224.7,
    category: 'Mega Cap',
    cumulative: 87.13,
    concentration: 'Rest (26–100)',
  },
  {
    rank: 35,
    ticker: 'BKNG',
    company: 'Booking Holdings Inc.',
    sector: 'Consumer Discretionary',
    weight: 0.42,
    cap: 120.1,
    category: 'Large Cap',
    cumulative: 87.55,
    concentration: 'Rest (26–100)',
  },
  {
    rank: 36,
    ticker: 'APP',
    company: 'AppLovin Corporation Class A',
    sector: 'Technology',
    weight: 0.41,
    cap: 152.4,
    category: 'Large Cap',
    cumulative: 87.96,
    concentration: 'Rest (26–100)',
  },
  {
    rank: 37,
    ticker: 'PANW',
    company: 'Palo Alto Networks Inc.',
    sector: 'Technology',
    weight: 0.4,
    cap: 184.7,
    category: 'Large Cap',
    cumulative: 88.36,
    concentration: 'Rest (26–100)',
  },
  {
    rank: 38,
    ticker: 'INTU',
    company: 'Intuit Inc.',
    sector: 'Technology',
    weight: 0.36,
    cap: 103.4,
    category: 'Large Cap',
    cumulative: 88.72,
    concentration: 'Rest (26–100)',
  },
  {
    rank: 39,
    ticker: 'VRTX',
    company: 'Vertex Pharmaceuticals Incorporated',
    sector: 'Health Care',
    weight: 0.36,
    cap: 115,
    category: 'Large Cap',
    cumulative: 89.08,
    concentration: 'Rest (26–100)',
  },
  {
    rank: 40,
    ticker: 'SBUX',
    company: 'Starbucks Corporation',
    sector: 'Consumer Discretionary',
    weight: 0.32,
    cap: 120.8,
    category: 'Large Cap',
    cumulative: 89.4,
    concentration: 'Rest (26–100)',
  },
  {
    rank: 41,
    ticker: 'WDC',
    company: 'Western Digital Corporation',
    sector: 'Technology',
    weight: 0.32,
    cap: 170.3,
    category: 'Large Cap',
    cumulative: 89.72,
    concentration: 'Rest (26–100)',
  },
  {
    rank: 42,
    ticker: 'CEG',
    company: 'Constellation Energy Corporation',
    sector: 'Utilities',
    weight: 0.31,
    cap: 99.3,
    category: 'Large Cap',
    cumulative: 90.03,
    concentration: 'Rest (26–100)',
  },
  {
    rank: 43,
    ticker: 'CMCSA',
    company: 'Comcast Corporation Class A',
    sector: 'Communication Services',
    weight: 0.31,
    cap: 89.1,
    category: 'Large Cap',
    cumulative: 90.34,
    concentration: 'Rest (26–100)',
  },
  {
    rank: 44,
    ticker: 'CRWD',
    company: 'CrowdStrike Holdings Inc. Class A',
    sector: 'Technology',
    weight: 0.31,
    cap: 143.2,
    category: 'Large Cap',
    cumulative: 90.65,
    concentration: 'Rest (26–100)',
  },
  {
    rank: 45,
    ticker: 'ADBE',
    company: 'Adobe Inc.',
    sector: 'Technology',
    weight: 0.3,
    cap: 95.4,
    category: 'Large Cap',
    cumulative: 90.95,
    concentration: 'Rest (26–100)',
  },
  {
    rank: 46,
    ticker: 'STX',
    company: 'Seagate Technology Holdings plc',
    sector: 'Technology',
    weight: 0.3,
    cap: 183.3,
    category: 'Large Cap',
    cumulative: 91.25,
    concentration: 'Rest (26–100)',
  },
  {
    rank: 47,
    ticker: 'MRVL',
    company: 'Marvell Technology Inc.',
    sector: 'Technology',
    weight: 0.29,
    cap: 155.6,
    category: 'Large Cap',
    cumulative: 91.54,
    concentration: 'Rest (26–100)',
  },
  {
    rank: 48,
    ticker: 'MAR',
    company: 'Marriott International Inc. Class A',
    sector: 'Consumer Discretionary',
    weight: 0.27,
    cap: 92.3,
    category: 'Large Cap',
    cumulative: 91.81,
    concentration: 'Rest (26–100)',
  },
  {
    rank: 49,
    ticker: 'MELI',
    company: 'MercadoLibre Inc.',
    sector: 'Consumer Discretionary',
    weight: 0.27,
    cap: 79.2,
    category: 'Large Cap',
    cumulative: 92.08,
    concentration: 'Rest (26–100)',
  },
  {
    rank: 50,
    ticker: 'REGN',
    company: 'Regeneron Pharmaceuticals Inc.',
    sector: 'Health Care',
    weight: 0.25,
    cap: 75.5,
    category: 'Large Cap',
    cumulative: 92.33,
    concentration: 'Rest (26–100)',
  },
  {
    rank: 51,
    ticker: 'ADP',
    company: 'Automatic Data Processing Inc.',
    sector: 'Technology',
    weight: 0.25,
    cap: 83.4,
    category: 'Large Cap',
    cumulative: 92.58,
    concentration: 'Rest (26–100)',
  },
  {
    rank: 52,
    ticker: 'CDNS',
    company: 'Cadence Design Systems Inc.',
    sector: 'Technology',
    weight: 0.24,
    cap: 97.8,
    category: 'Large Cap',
    cumulative: 92.82,
    concentration: 'Rest (26–100)',
  },
  {
    rank: 53,
    ticker: 'ORLY',
    company: "O'Reilly Automotive Inc.",
    sector: 'Consumer Discretionary',
    weight: 0.24,
    cap: 74.3,
    category: 'Large Cap',
    cumulative: 93.06,
    concentration: 'Rest (26–100)',
  },
  {
    rank: 54,
    ticker: 'CSX',
    company: 'CSX Corporation',
    sector: 'Industrials',
    weight: 0.24,
    cap: 82.5,
    category: 'Large Cap',
    cumulative: 93.3,
    concentration: 'Rest (26–100)',
  },
  {
    rank: 55,
    ticker: 'SNPS',
    company: 'Synopsys Inc.',
    sector: 'Technology',
    weight: 0.24,
    cap: 97.6,
    category: 'Large Cap',
    cumulative: 93.54,
    concentration: 'Rest (26–100)',
  },
  {
    rank: 56,
    ticker: 'ABNB',
    company: 'Airbnb Inc. Class A',
    sector: 'Consumer Discretionary',
    weight: 0.24,
    cap: 78.9,
    category: 'Large Cap',
    cumulative: 93.78,
    concentration: 'Rest (26–100)',
  },
  {
    rank: 57,
    ticker: 'MDLZ',
    company: 'Mondelez International Inc. Class A',
    sector: 'Consumer Staples',
    weight: 0.23,
    cap: 79,
    category: 'Large Cap',
    cumulative: 94.01,
    concentration: 'Rest (26–100)',
  },
  {
    rank: 58,
    ticker: 'MNST',
    company: 'Monster Beverage Corporation',
    sector: 'Consumer Staples',
    weight: 0.22,
    cap: 84,
    category: 'Large Cap',
    cumulative: 94.23,
    concentration: 'Rest (26–100)',
  },
  {
    rank: 59,
    ticker: 'ROST',
    company: 'Ross Stores Inc.',
    sector: 'Consumer Discretionary',
    weight: 0.22,
    cap: 68.5,
    category: 'Large Cap',
    cumulative: 94.45,
    concentration: 'Rest (26–100)',
  },
  {
    rank: 60,
    ticker: 'AEP',
    company: 'American Electric Power Company Inc.',
    sector: 'Utilities',
    weight: 0.22,
    cap: 69.6,
    category: 'Large Cap',
    cumulative: 94.67,
    concentration: 'Rest (26–100)',
  },
  {
    rank: 61,
    ticker: 'WBD',
    company: 'Warner Bros. Discovery Inc. Series A',
    sector: 'Communication Services',
    weight: 0.22,
    cap: 68.3,
    category: 'Large Cap',
    cumulative: 94.89,
    concentration: 'Rest (26–100)',
  },
  {
    rank: 62,
    ticker: 'CTAS',
    company: 'Cintas Corporation',
    sector: 'Industrials',
    weight: 0.21,
    cap: 65.4,
    category: 'Large Cap',
    cumulative: 95.1,
    concentration: 'Rest (26–100)',
  },
  {
    rank: 63,
    ticker: 'DASH',
    company: 'DoorDash Inc. Class A',
    sector: 'Consumer Discretionary',
    weight: 0.2,
    cap: 65,
    category: 'Large Cap',
    cumulative: 95.3,
    concentration: 'Rest (26–100)',
  },
  {
    rank: 64,
    ticker: 'PCAR',
    company: 'PACCAR Inc.',
    sector: 'Industrials',
    weight: 0.19,
    cap: 58.8,
    category: 'Large Cap',
    cumulative: 95.49,
    concentration: 'Rest (26–100)',
  },
  {
    rank: 65,
    ticker: 'FTNT',
    company: 'Fortinet Inc.',
    sector: 'Technology',
    weight: 0.19,
    cap: 86.2,
    category: 'Large Cap',
    cumulative: 95.68,
    concentration: 'Rest (26–100)',
  },
  {
    rank: 66,
    ticker: 'BKR',
    company: 'Baker Hughes Company Class A',
    sector: 'Energy',
    weight: 0.18,
    cap: 64.9,
    category: 'Large Cap',
    cumulative: 95.86,
    concentration: 'Rest (26–100)',
  },
  {
    rank: 67,
    ticker: 'MPWR',
    company: 'Monolithic Power Systems Inc.',
    sector: 'Technology',
    weight: 0.17,
    cap: 81.1,
    category: 'Large Cap',
    cumulative: 96.03,
    concentration: 'Rest (26–100)',
  },
  {
    rank: 68,
    ticker: 'FANG',
    company: 'Diamondback Energy Inc.',
    sector: 'Energy',
    weight: 0.17,
    cap: 56.6,
    category: 'Large Cap',
    cumulative: 96.2,
    concentration: 'Rest (26–100)',
  },
  {
    rank: 69,
    ticker: 'FAST',
    company: 'Fastenal Company',
    sector: 'Industrials',
    weight: 0.17,
    cap: 50.2,
    category: 'Large Cap',
    cumulative: 96.37,
    concentration: 'Rest (26–100)',
  },
  {
    rank: 70,
    ticker: 'EA',
    company: 'Electronic Arts Inc.',
    sector: 'Communication Services',
    weight: 0.16,
    cap: 50.2,
    category: 'Large Cap',
    cumulative: 96.53,
    concentration: 'Rest (26–100)',
  },
  {
    rank: 71,
    ticker: 'ADSK',
    company: 'Autodesk Inc.',
    sector: 'Technology',
    weight: 0.16,
    cap: 48.8,
    category: 'Large Cap',
    cumulative: 96.69,
    concentration: 'Rest (26–100)',
  },
  {
    rank: 72,
    ticker: 'NXPI',
    company: 'NXP Semiconductors N.V.',
    sector: 'Technology',
    weight: 0.15,
    cap: 75.3,
    category: 'Large Cap',
    cumulative: 96.84,
    concentration: 'Rest (26–100)',
  },
  {
    rank: 73,
    ticker: 'EXC',
    company: 'Exelon Corporation',
    sector: 'Utilities',
    weight: 0.15,
    cap: 45.3,
    category: 'Large Cap',
    cumulative: 96.99,
    concentration: 'Rest (26–100)',
  },
  {
    rank: 74,
    ticker: 'XEL',
    company: 'Xcel Energy Inc.',
    sector: 'Utilities',
    weight: 0.15,
    cap: 49.9,
    category: 'Large Cap',
    cumulative: 97.14,
    concentration: 'Rest (26–100)',
  },
  {
    rank: 75,
    ticker: 'FER',
    company: 'Ferrovial SE',
    sector: 'Utilities',
    weight: 0.15,
    cap: 48.7,
    category: 'Large Cap',
    cumulative: 97.29,
    concentration: 'Rest (26–100)',
  },
  {
    rank: 76,
    ticker: 'IDXX',
    company: 'IDEXX Laboratories Inc.',
    sector: 'Health Care',
    weight: 0.14,
    cap: 41.7,
    category: 'Large Cap',
    cumulative: 97.43,
    concentration: 'Rest (26–100)',
  },
  {
    rank: 77,
    ticker: 'ALNY',
    company: 'Alnylam Pharmaceuticals Inc.',
    sector: 'Health Care',
    weight: 0.14,
    cap: 38.9,
    category: 'Large Cap',
    cumulative: 97.57,
    concentration: 'Rest (26–100)',
  },
  {
    rank: 78,
    ticker: 'MSTR',
    company: 'Strategy Inc.',
    sector: 'Technology',
    weight: 0.13,
    cap: 62.4,
    category: 'Large Cap',
    cumulative: 97.7,
    concentration: 'Rest (26–100)',
  },
  {
    rank: 79,
    ticker: 'DDOG',
    company: 'Datadog Inc. Class A',
    sector: 'Technology',
    weight: 0.13,
    cap: 73.1,
    category: 'Large Cap',
    cumulative: 97.83,
    concentration: 'Rest (26–100)',
  },
  {
    rank: 80,
    ticker: 'ODFL',
    company: 'Old Dominion Freight Line Inc.',
    sector: 'Industrials',
    weight: 0.13,
    cap: 39.3,
    category: 'Large Cap',
    cumulative: 97.96,
    concentration: 'Rest (26–100)',
  },
  {
    rank: 81,
    ticker: 'PYPL',
    company: 'PayPal Holdings Inc.',
    sector: 'Technology',
    weight: 0.13,
    cap: 39.9,
    category: 'Large Cap',
    cumulative: 98.09,
    concentration: 'Rest (26–100)',
  },
  {
    rank: 82,
    ticker: 'CCEP',
    company: 'Coca-Cola Europacific Partners plc',
    sector: 'Consumer Staples',
    weight: 0.13,
    cap: 40.5,
    category: 'Large Cap',
    cumulative: 98.22,
    concentration: 'Rest (26–100)',
  },
  {
    rank: 83,
    ticker: 'TRI',
    company: 'Thomson Reuters Corporation',
    sector: 'Technology',
    weight: 0.12,
    cap: 35.8,
    category: 'Large Cap',
    cumulative: 98.34,
    concentration: 'Rest (26–100)',
  },
  {
    rank: 84,
    ticker: 'TTWO',
    company: 'Take-Two Interactive Software Inc.',
    sector: 'Communication Services',
    weight: 0.11,
    cap: 42,
    category: 'Large Cap',
    cumulative: 98.45,
    concentration: 'Rest (26–100)',
  },
  {
    rank: 85,
    ticker: 'ROP',
    company: 'Roper Technologies Inc.',
    sector: 'Industrials',
    weight: 0.11,
    cap: 31.9,
    category: 'Large Cap',
    cumulative: 98.56,
    concentration: 'Rest (26–100)',
  },
  {
    rank: 86,
    ticker: 'MCHP',
    company: 'Microchip Technology Incorporated',
    sector: 'Technology',
    weight: 0.11,
    cap: 52.3,
    category: 'Large Cap',
    cumulative: 98.67,
    concentration: 'Rest (26–100)',
  },
  {
    rank: 87,
    ticker: 'INSM',
    company: 'Insmed Incorporated',
    sector: 'Health Care',
    weight: 0.11,
    cap: 25.6,
    category: 'Large Cap',
    cumulative: 98.78,
    concentration: 'Rest (26–100)',
  },
  {
    rank: 88,
    ticker: 'KDP',
    company: 'Keurig Dr Pepper Inc.',
    sector: 'Consumer Staples',
    weight: 0.11,
    cap: 39.9,
    category: 'Large Cap',
    cumulative: 98.89,
    concentration: 'Rest (26–100)',
  },
  {
    rank: 89,
    ticker: 'AXON',
    company: 'Axon Enterprise Inc.',
    sector: 'Industrials',
    weight: 0.11,
    cap: 30.4,
    category: 'Large Cap',
    cumulative: 99,
    concentration: 'Rest (26–100)',
  },
  {
    rank: 90,
    ticker: 'WDAY',
    company: 'Workday Inc. Class A',
    sector: 'Technology',
    weight: 0.1,
    cap: 29.1,
    category: 'Large Cap',
    cumulative: 99.1,
    concentration: 'Rest (26–100)',
  },
  {
    rank: 91,
    ticker: 'PAYX',
    company: 'Paychex Inc.',
    sector: 'Technology',
    weight: 0.1,
    cap: 32.2,
    category: 'Large Cap',
    cumulative: 99.2,
    concentration: 'Rest (26–100)',
  },
  {
    rank: 92,
    ticker: 'GEHC',
    company: 'GE HealthCare Technologies Inc.',
    sector: 'Health Care',
    weight: 0.1,
    cap: 28.2,
    category: 'Large Cap',
    cumulative: 99.3,
    concentration: 'Rest (26–100)',
  },
  {
    rank: 93,
    ticker: 'CPRT',
    company: 'Copart Inc.',
    sector: 'Industrials',
    weight: 0.1,
    cap: 31.7,
    category: 'Large Cap',
    cumulative: 99.4,
    concentration: 'Rest (26–100)',
  },
  {
    rank: 94,
    ticker: 'CTSH',
    company: 'Cognizant Technology Solutions Corporation Class A',
    sector: 'Technology',
    weight: 0.09,
    cap: 21.7,
    category: 'Large Cap',
    cumulative: 99.49,
    concentration: 'Rest (26–100)',
  },
  {
    rank: 95,
    ticker: 'CHTR',
    company: 'Charter Communications Inc. Class A',
    sector: 'Communication Services',
    weight: 0.08,
    cap: 20.2,
    category: 'Large Cap',
    cumulative: 99.57,
    concentration: 'Rest (26–100)',
  },
  {
    rank: 96,
    ticker: 'KHC',
    company: 'Kraft Heinz Company',
    sector: 'Consumer Staples',
    weight: 0.08,
    cap: 27.5,
    category: 'Large Cap',
    cumulative: 99.65,
    concentration: 'Rest (26–100)',
  },
  {
    rank: 97,
    ticker: 'VRSK',
    company: 'Verisk Analytics Inc.',
    sector: 'Technology',
    weight: 0.08,
    cap: 21.2,
    category: 'Large Cap',
    cumulative: 99.73,
    concentration: 'Rest (26–100)',
  },
  {
    rank: 98,
    ticker: 'DXCM',
    company: 'DexCom Inc.',
    sector: 'Health Care',
    weight: 0.08,
    cap: 22.6,
    category: 'Large Cap',
    cumulative: 99.81,
    concentration: 'Rest (26–100)',
  },
  {
    rank: 99,
    ticker: 'ZS',
    company: 'Zscaler Inc. Class A',
    sector: 'Technology',
    weight: 0.07,
    cap: 24.5,
    category: 'Large Cap',
    cumulative: 99.88,
    concentration: 'Rest (26–100)',
  },
  {
    rank: 100,
    ticker: 'TEAM',
    company: 'Atlassian Corporation Class A',
    sector: 'Technology',
    weight: 0.06,
    cap: 20.5,
    category: 'Large Cap',
    cumulative: 99.94,
    concentration: 'Rest (26–100)',
  },
];

const SECTOR_COLORS = {
  Technology: '#00d4ff',
  'Communication Services': '#00d4ff',
  'Consumer Discretionary': '#ffab00',
  'Consumer Staples': '#00e676',
  'Health Care': '#29b6f6',
  Industrials: '#ffa726',
  Materials: '#66bb6a',
  Energy: '#ff5252',
  Utilities: '#42a5f5',
  Financials: '#ba68c8',
  'Real Estate': '#ec407a',
};

export function sectorSlug(sector) {
  return String(sector || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function sectorColor(sector) {
  return SECTOR_COLORS[sector] || '#00d4ff';
}

export function getNasdaqSectorClass(sector) {
  return `nq-sector--${sectorSlug(sector)}`;
}

export function formatCap(billions) {
  const value = Number(billions) || 0;
  return value >= 1000 ? `$${(value / 1000).toFixed(2)}T` : `$${value.toFixed(1)}B`;
}

export function totalMarketCap(list) {
  return (list || []).reduce((sum, c) => sum + (Number(c.cap) || 0), 0);
}

export function totalWeight(list) {
  return (list || []).reduce((sum, c) => sum + (Number(c.weight) || 0), 0);
}

export function filterNasdaq100(list, { search = '', sector = '', category = '' } = {}) {
  const term = String(search).toLowerCase().trim();
  return (list || []).filter((c) => {
    const matchesSearch =
      !term ||
      String(c.company).toLowerCase().includes(term) ||
      String(c.ticker).toLowerCase().includes(term);
    const matchesSector = !sector || c.sector === sector;
    const matchesCategory = !category || c.category === category;
    return matchesSearch && matchesSector && matchesCategory;
  });
}

export function sortNasdaq100(list, sortBy = 'rank') {
  return [...(list || [])].sort((a, b) => {
    switch (sortBy) {
      case 'cap':
        return (b.cap || 0) - (a.cap || 0);
      case 'weight':
        return (b.weight || 0) - (a.weight || 0) || (a.rank || 0) - (b.rank || 0);
      case 'company':
        return a.company.localeCompare(b.company);
      case 'ticker':
        return a.ticker.localeCompare(b.ticker);
      case 'sector':
        return a.sector.localeCompare(b.sector) || (a.rank || 0) - (b.rank || 0);
      case 'rank':
      default:
        return (a.rank || 0) - (b.rank || 0);
    }
  });
}

export function nasdaqSectorOptions(list) {
  return [...new Set((list || []).map((c) => c.sector))].sort();
}

export function nasdaqBreakdown(list) {
  const groups = new Map();
  (list || []).forEach((c) => {
    if (!groups.has(c.sector)) groups.set(c.sector, []);
    groups.get(c.sector).push(c);
  });
  return [...groups.entries()]
    .map(([sector, companies]) => ({
      sector,
      companies: companies.map((c) => c.ticker),
      count: companies.length,
      weight: companies.reduce((sum, c) => sum + (Number(c.weight) || 0), 0),
    }))
    .sort((a, b) => b.count - a.count || a.sector.localeCompare(b.sector));
}

export function renderNasdaqCards(list) {
  const cards = (list || [])
    .map(
      (c) => `
      <article class="nq-card">
        <div class="nq-card-head">
          <div>
            <span class="nq-rank">#${escapeHtml(c.rank)}</span>
            <h3>${escapeHtml(c.company)}</h3>
          </div>
          <span class="nq-ticker">${escapeHtml(c.ticker)}</span>
        </div>
        <span class="nq-sector ${getNasdaqSectorClass(c.sector)}">${escapeHtml(c.sector)}</span>
        <div class="nq-metrics">
          <div class="nq-metric">
            <span class="nq-metric-value">${formatCap(c.cap)}</span>
            <span class="nq-metric-label">Market Cap</span>
          </div>
          <div class="nq-metric">
            <span class="nq-metric-value">${(Number(c.weight) || 0).toFixed(2)}%</span>
            <span class="nq-metric-label">Peso no Índice</span>
          </div>
        </div>
        <span class="nq-cat">${escapeHtml(c.category)} · ${escapeHtml(c.concentration)}</span>
      </article>`
    )
    .join('');
  return `<div class="nq-cards">${cards}</div>`;
}

export function renderNasdaqTable(list) {
  const rows = (list || [])
    .map(
      (c) => `
      <tr>
        <td>${escapeHtml(c.rank)}</td>
        <td><strong>${escapeHtml(c.company)}</strong></td>
        <td><span class="nq-ticker">${escapeHtml(c.ticker)}</span></td>
        <td><span class="nq-sector ${getNasdaqSectorClass(c.sector)}">${escapeHtml(c.sector)}</span></td>
        <td>${formatCap(c.cap)}</td>
        <td><strong class="nq-weight">${(Number(c.weight) || 0).toFixed(2)}%</strong></td>
        <td>${(Number(c.cumulative) || 0).toFixed(2)}%</td>
        <td><span class="nq-cat">${escapeHtml(c.category)}</span></td>
      </tr>`
    )
    .join('');
  return `
    <div class="nq-table-wrapper">
      <table class="nq-table">
        <thead>
          <tr>
            <th data-sort="rank">#</th>
            <th data-sort="company">Empresa</th>
            <th data-sort="ticker">Ticker</th>
            <th data-sort="sector">Setor</th>
            <th data-sort="cap">Market Cap</th>
            <th data-sort="weight">Peso (%)</th>
            <th>Peso Acumulado (%)</th>
            <th>Categoria</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

export function renderNasdaq100(containerId = 'nasdaq-100-view') {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`❌ Contentor ${containerId} não encontrado!`);
    return;
  }

  const state = { search: '', sector: '', category: '', sortBy: 'rank', view: 'cards' };

  const optionsHtml = nasdaqSectorOptions(NASDAQ_100)
    .map((s) => `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`)
    .join('');

  const breakdownHtml = nasdaqBreakdown(NASDAQ_100)
    .map(
      (group) => `
      <div class="nq-breakdown-item">
        <div class="nq-breakdown-head" style="color: ${sectorColor(group.sector)}">
          <span>${escapeHtml(group.sector)}</span>
          <span class="nq-breakdown-count">${group.count} · ${group.weight.toFixed(2)}%</span>
        </div>
        <p class="nq-breakdown-list">${group.companies.map((c) => escapeHtml(c)).join(', ')}</p>
      </div>`
    )
    .join('');

  container.innerHTML = `
    <div class="nasdaq-view">
      <header class="nq-header">
        <div class="nq-header-content">
          <h2>Nasdaq-100</h2>
          <p>💻 100 maiores empresas não financeiras da Nasdaq · Snapshot 01/05/2026</p>
        </div>
        <div class="nq-stats">
          <div class="nq-stat">
            <span class="nq-stat-value">${NASDAQ_100.length}</span>
            <span class="nq-stat-label">Empresas</span>
          </div>
          <div class="nq-stat">
            <span class="nq-stat-value">${formatCap(totalMarketCap(NASDAQ_100))}</span>
            <span class="nq-stat-label">Market Cap Total</span>
          </div>
          <div class="nq-stat">
            <span class="nq-stat-value">${totalWeight(NASDAQ_100).toFixed(2)}%</span>
            <span class="nq-stat-label">Peso no Índice</span>
          </div>
        </div>
      </header>

      <div class="nq-filters">
        <div class="nq-filter">
          <label for="nq-search">Buscar</label>
          <input type="text" id="nq-search" placeholder="Empresa ou ticker..." />
        </div>
        <div class="nq-filter">
          <label for="nq-sector">Setor</label>
          <select id="nq-sector">
            <option value="">Todos os Setores</option>
            ${optionsHtml}
          </select>
        </div>
        <div class="nq-filter">
          <label for="nq-cap">Categoria de Capitalização</label>
          <select id="nq-cap">
            <option value="">Todas</option>
            <option value="Mega Cap">Mega Cap</option>
            <option value="Large Cap">Large Cap</option>
          </select>
        </div>
        <div class="nq-filter">
          <label for="nq-sort">Ordenar por</label>
          <select id="nq-sort">
            <option value="rank">Ranking (1º → 100º)</option>
            <option value="cap">Market Cap (maior)</option>
            <option value="weight">Peso (maior)</option>
            <option value="company">Empresa (A-Z)</option>
            <option value="ticker">Ticker (A-Z)</option>
            <option value="sector">Setor (A-Z)</option>
          </select>
        </div>
      </div>

      <div class="nq-view-toggle" role="tablist">
        <button class="nq-view-btn active" data-view="cards" type="button">Cartões</button>
        <button class="nq-view-btn" data-view="table" type="button">Tabela</button>
      </div>

      <div id="nq-results" class="nq-results"></div>

      <section class="nq-breakdown">
        <h3>Distribuição por setor</h3>
        <div class="nq-breakdown-grid">${breakdownHtml}</div>
      </section>

      <aside class="nq-info">
        <strong>💡 Sobre o Nasdaq-100:</strong> o índice reúne as 100 maiores empresas não
        financeiras negociadas na Nasdaq, ponderadas por capitalização de mercado. Como o peso é
        concentrado, as dez primeiras empresas respondem por cerca de dois terços do índice. Os
        dados correspondem ao snapshot de 01/05/2026 e devem ser atualizados periodicamente.
      </aside>
    </div>
  `;

  const resultsEl = container.querySelector('#nq-results');
  const searchEl = container.querySelector('#nq-search');
  const sectorEl = container.querySelector('#nq-sector');
  const capEl = container.querySelector('#nq-cap');
  const sortEl = container.querySelector('#nq-sort');

  const render = () => {
    const filtered = sortNasdaq100(
      filterNasdaq100(NASDAQ_100, {
        search: state.search,
        sector: state.sector,
        category: state.category,
      }),
      state.sortBy
    );

    if (filtered.length === 0) {
      resultsEl.innerHTML = '<p class="nq-empty">Nenhuma empresa encontrada.</p>';
      return;
    }

    if (state.view === 'cards') {
      resultsEl.innerHTML = renderNasdaqCards(filtered);
      return;
    }

    resultsEl.innerHTML = renderNasdaqTable(filtered);
    resultsEl.querySelectorAll('.nq-table th[data-sort]').forEach((th) => {
      th.addEventListener('click', () => {
        state.sortBy = th.getAttribute('data-sort');
        if (sortEl) sortEl.value = state.sortBy;
        render();
      });
    });
  };

  if (searchEl) {
    searchEl.addEventListener('input', () => {
      state.search = searchEl.value;
      render();
    });
  }

  if (sectorEl) {
    sectorEl.addEventListener('change', () => {
      state.sector = sectorEl.value;
      render();
    });
  }

  if (capEl) {
    capEl.addEventListener('change', () => {
      state.category = capEl.value;
      render();
    });
  }

  if (sortEl) {
    sortEl.addEventListener('change', () => {
      state.sortBy = sortEl.value;
      render();
    });
  }

  container.querySelectorAll('.nq-view-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.view = btn.getAttribute('data-view');
      container.querySelectorAll('.nq-view-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      render();
    });
  });

  render();
}
