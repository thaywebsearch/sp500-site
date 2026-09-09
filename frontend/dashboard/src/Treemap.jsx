import React, { useState, useEffect } from 'react';
import { Treemap, Tooltip, ResponsiveContainer } from 'recharts';
import '../styles/treemap.css';

const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5001'
  : 'https://sp500-site-production.up.railway.app';

const SECTORS = [
  { id: 'communication-services', name: 'Communication Services', color: '#00d4ff' },
  { id: 'consumer-discretionary', name: 'Consumer Discretionary', color: '#00e676' },
  { id: 'consumer-staples', name: 'Consumer Staples', color: '#ffab00' },
  { id: 'energy', name: 'Energy', color: '#ff5252' },
  { id: 'financials', name: 'Financials', color: '#00d4ff' },
  { id: 'health-care', name: 'Health Care', color: '#00e676' },
  { id: 'industrials', name: 'Industrials', color: '#ffab00' },
  { id: 'information-technology', name: 'Information Technology', color: '#ff5252' },
  { id: 'materials', name: 'Materials', color: '#00d4ff' },
  { id: 'real-estate', name: 'Real Estate', color: '#00e676' },
  { id: 'utilities', name: 'Utilities', color: '#ffab00' },
];

export default function TreemapView() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredSector, setHoveredSector] = useState(null);

  useEffect(() => {
    fetchSectorData();
  }, []);

  const fetchSectorData = async () => {
    try {
      setLoading(true);
      const setoresResponse = await fetch(`${API_BASE_URL}/api/setores`);
      const setoresData = await setoresResponse.json();
      const setores = setoresData.setores || [];

      const sectorStats = await Promise.all(
        setores.map(async (setorId) => {
          try {
            const response = await fetch(`${API_BASE_URL}/api/setor/${setorId}`);
            const sectorData = await response.json();
            
            const sector = SECTORS.find(s => s.id === setorId);
            const companies = sectorData.dados?.companies || [];
            
            const totalMarketCap = companies.reduce((sum, c) => sum + (c.marketCap || 0), 0);
            const avgDividend = companies.length > 0 
              ? companies.reduce((sum, c) => sum + (c.dividendYield || 0), 0) / companies.length
              : 0;

            return {
              name: sector?.name || setorId,
              value: totalMarketCap,
              fill: sector?.color || '#8884d8',
              companies: companies.length,
              avgDividend: avgDividend.toFixed(2),
              topCompany: companies.length > 0 ? companies[0].symbol : 'N/A',
            };
          } catch (error) {
            console.error(`Erro ao carregar ${setorId}:`, error);
            return null;
          }
        })
      );

      const validStats = sectorStats.filter(s => s !== null);
      const totalCap = validStats.reduce((sum, s) => sum + s.value, 0);

      const dataWithPercentage = validStats.map(s => ({
        ...s,
        percentage: ((s.value / totalCap) * 100).toFixed(2),
      }));

      setData(dataWithPercentage);
    } catch (error) {
      console.error('Erro ao carregar dados do treemap:', error);
    } finally {
      setLoading(false);
    }
  };

  const CustomizedContent = (props) => {
    const { x, y, width, height, name, value, companies, percentage, fill } = props;
    
    if (width < 50 || height < 50) return null;

    const marketCapBillions = (value / 1e9).toFixed(1);

    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill: fill,
            stroke: '#fff',
            strokeWidth: 2,
            opacity: hoveredSector === name ? 0.95 : 0.8,
            transition: 'all 0.3s ease',
          }}
        />
        <text
          x={x + width / 2}
          y={y + height / 2 - 20}
          textAnchor="middle"
          fill="#fff"
          fontSize={14}
          fontWeight="bold"
          style={{
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            pointerEvents: 'none',
          }}
        >
          {name}
        </text>
        <text
          x={x + width / 2}
          y={y + height / 2 + 5}
          textAnchor="middle"
          fill="#fff"
          fontSize={12}
          style={{
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            pointerEvents: 'none',
          }}
        >
          ${marketCapBillions}B
        </text>
        <text
          x={x + width / 2}
          y={y + height / 2 + 25}
          textAnchor="middle"
          fill="#fff"
          fontSize={11}
          style={{
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            pointerEvents: 'none',
          }}
        >
          {percentage}% do SP500
        </text>
      </g>
    );
  };

  const CustomTooltip = (props) => {
    const { active, payload } = props;
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="treemap-tooltip">
          <p className="tooltip-title">{data.name}</p>
          <p className="tooltip-row">
            <span>Market Cap:</span>
            <strong>${(data.value / 1e9).toFixed(2)}B</strong>
          </p>
          <p className="tooltip-row">
            <span>% do SP500:</span>
            <strong>{data.percentage}%</strong>
          </p>
          <p className="tooltip-row">
            <span>Empresas:</span>
            <strong>{data.companies}</strong>
          </p>
          <p className="tooltip-row">
            <span>Avg Dividend:</span>
            <strong>{data.avgDividend}%</strong>
          </p>
          <p className="tooltip-row">
            <span>Top Company:</span>
            <strong>{data.topCompany}</strong>
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="treemap-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Carregando mapa de setores...</p>
        </div>
      </div>
    );
  }

  const totalMarketCap = data.reduce((sum, s) => sum + s.value, 0);
  const topSector = data.reduce((max, s) => s.value > max.value ? s : max, data[0]);

  return (
    <div className="treemap-container">
      <div className="treemap-header">
        <h2>🗺️ Mapa de Setores - SP500</h2>
        <p className="subtitle">Market Cap por Setor | Tamanho = Peso no índice</p>
      </div>

      <div className="treemap-stats">
        <div className="stat-card">
          <span className="stat-label">Market Cap Total</span>
          <span className="stat-value">${(totalMarketCap / 1e12).toFixed(2)}T</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Maior Setor</span>
          <span className="stat-value">{topSector.name}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Setores Analisados</span>
          <span className="stat-value">{data.length}</span>
        </div>
      </div>

      <div className="treemap-chart">
        <ResponsiveContainer width="100%" height={600}>
          <Treemap
            data={data}
            dataKey="value"
            stroke="#fff"
            fill="#8884d8"
            content={<CustomizedContent />}
            onMouseEnter={(e) => setHoveredSector(e.name)}
            onMouseLeave={() => setHoveredSector(null)}
          >
            <Tooltip content={<CustomTooltip />} />
          </Treemap>
        </ResponsiveContainer>
      </div>

      <div className="treemap-legend">
        <h3>Detalhes por Setor</h3>
        <div className="legend-grid">
          {data.map((sector) => (
            <div
              key={sector.name}
              className={`legend-item ${hoveredSector === sector.name ? 'active' : ''}`}
              onMouseEnter={() => setHoveredSector(sector.name)}
              onMouseLeave={() => setHoveredSector(null)}
            >
              <div className="legend-color" style={{ backgroundColor: sector.fill }}></div>
              <div className="legend-info">
                <div className="legend-name">{sector.name}</div>
                <div className="legend-details">
                  ${(sector.value / 1e9).toFixed(1)}B • {sector.companies} empresas • {sector.percentage}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
