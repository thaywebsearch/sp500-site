// Configuração da API
const API_BASE_URL_BUBBLE = window.location.hostname === 'localhost' 
  ? 'http://localhost:5001'
  : 'https://sp500-site-production.up.railway.app';

const SECTORS_BUBBLE = [
  { id: 'communication-services', name: 'Communication Services', color: 0x00d4ff },
  { id: 'consumer-discretionary', name: 'Consumer Discretionary', color: 0x00e676 },
  { id: 'consumer-staples', name: 'Consumer Staples', color: 0xffab00 },
  { id: 'energy', name: 'Energy', color: 0xff5252 },
  { id: 'financials', name: 'Financials', color: 0x8bc34a },
  { id: 'health-care', name: 'Health Care', color: 0x4caf50 },
  { id: 'industrials', name: 'Industrials', color: 0x2196f3 },
  { id: 'information-technology', name: 'Information Technology', color: 0x9c27b0 },
  { id: 'materials', name: 'Materials', color: 0xff9800 },
  { id: 'real-estate', name: 'Real Estate', color: 0xf44336 },
  { id: 'utilities', name: 'Utilities', color: 0x00bcd4 },
];

let bubbleScene, bubbleCamera, bubbleRenderer, bubbleSpheres = [];

async function loadBubbleChart() {
  const container = document.getElementById('bubble-chart-view');
  if (!container) return;

  container.innerHTML = '<div class="loading"><div class="spinner"></div><p>Carregando Bubble Chart 3D...</p></div>';

  try {
    const setoresResponse = await fetch(`${API_BASE_URL_BUBBLE}/api/setores`);
    const setoresData = await setoresResponse.json();
    const setores = setoresData.setores || [];

    const sectorStats = await Promise.all(
      setores.map(async (setorId) => {
        try {
          const response = await fetch(`${API_BASE_URL_BUBBLE}/api/setor/${setorId}`);
          const sectorData = await response.json();
          
          const sector = SECTORS_BUBBLE.find(s => s.id === setorId);
          const companies = sectorData.dados?.companies || [];
          
          const totalMarketCap = companies.reduce((sum, c) => sum + (c.marketCap || 0), 0);
          const avgDividend = companies.length > 0 
            ? companies.reduce((sum, c) => sum + (c.dividendYield || 0), 0) / companies.length
            : 0;

          return {
            name: sector?.name || setorId,
            marketCap: totalMarketCap / 1e9,
            companies: companies.length,
            avgDividend: parseFloat(avgDividend.toFixed(2)),
            color: sector?.color || 0x00d4ff,
            topCompany: companies.length > 0 ? companies[0].symbol : 'N/A',
          };
        } catch (error) {
          console.error(`Erro ao carregar ${setorId}:`, error);
          return null;
        }
      })
    );

    const validStats = sectorStats.filter(s => s !== null);
    renderBubbleChart(validStats, container);
  } catch (error) {
    console.error('Erro ao carregar bubble chart:', error);
    container.innerHTML = '<div class="loading"><p>Erro ao carregar dados</p></div>';
  }
}

function renderBubbleChart(data, container) {
  container.innerHTML = `
    <div class="bubble-chart-container">
      <div class="treemap-header">
        <h2>🫧 Bubble Chart 3D - SP500</h2>
        <p class="subtitle">Eixos: Market Cap | Empresas | Dividend Yield | Tamanho da Bolha</p>
      </div>
      <div id="three-container" style="width: 100%; height: 600px; border-radius: 8px; overflow: hidden; border: 1px solid var(--border); margin-bottom: 30px;"></div>
      <div class="bubble-legend">
        <h3>Setores</h3>
        <div class="legend-grid" id="bubble-legend-grid"></div>
      </div>
      <div class="bubble-info">
        <p style="color: var(--text-secondary); font-size: 0.9em;">💡 Dica: Arraste para rodar | Scroll para zoom | Hover para detalhes</p>
      </div>
    </div>
  `;

  const threeContainer = container.querySelector('#three-container');
  const legendGrid = container.querySelector('#bubble-legend-grid');

  // Three.js Setup
  bubbleScene = new THREE.Scene();
  bubbleScene.background = new THREE.Color(0x101018);
  
  bubbleCamera = new THREE.PerspectiveCamera(75, threeContainer.clientWidth / threeContainer.clientHeight, 0.1, 1000);
  bubbleCamera.position.set(100, 100, 100);
  bubbleCamera.lookAt(0, 0, 0);

  bubbleRenderer = new THREE.WebGLRenderer({ antialias: true });
  bubbleRenderer.setSize(threeContainer.clientWidth, threeContainer.clientHeight);
  bubbleRenderer.shadowMap.enabled = true;
  threeContainer.appendChild(bubbleRenderer.domElement);

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  bubbleScene.add(ambientLight);

  const pointLight = new THREE.PointLight(0x00d4ff, 0.8);
  pointLight.position.set(100, 100, 100);
  bubbleScene.add(pointLight);

  // Axes
  const axesHelper = new THREE.AxesHelper(100);
  bubbleScene.add(axesHelper);

  // Grid
  const gridHelper = new THREE.GridHelper(200, 10, 0x2a2a3e, 0x1a1a2e);
  bubbleScene.add(gridHelper);

  // Normaliza dados
  const maxMarketCap = Math.max(...data.map(s => s.marketCap));
  const maxCompanies = Math.max(...data.map(s => s.companies));
  const maxDividend = Math.max(...data.map(s => s.avgDividend));

  bubbleSpheres = [];

  // Cria bolhas
  data.forEach((sector) => {
    const x = (sector.marketCap / maxMarketCap - 0.5) * 200;
    const y = (sector.avgDividend / maxDividend - 0.5) * 150;
    const z = (sector.companies / maxCompanies - 0.5) * 180;
    const size = Math.max(2, (sector.marketCap / maxMarketCap) * 15);

    const geometry = new THREE.SphereGeometry(size, 32, 32);
    const material = new THREE.MeshPhongMaterial({
      color: sector.color,
      emissive: sector.color,
      emissiveIntensity: 0.2,
      shininess: 100,
    });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    sphere.position.set(x, y, z);
    
    // Armazenar dados
    sphere.userData = {
      name: sector.name,
      marketCap: sector.marketCap,
      companies: sector.companies,
      avgDividend: sector.avgDividend,
      topCompany: sector.topCompany,
    };

    bubbleScene.add(sphere);
    bubbleSpheres.push({ sphere, originalPosition: { x, y, z } });
  });

  // Mouse controls
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };

  threeContainer.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousMousePosition = { x: e.clientX, y: e.clientY };
  });

  threeContainer.addEventListener('mousemove', (e) => {
    if (isDragging) {
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      bubbleScene.rotation.y += deltaX * 0.01;
      bubbleScene.rotation.x += deltaY * 0.01;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    }
  });

  threeContainer.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Zoom
  threeContainer.addEventListener('wheel', (e) => {
    e.preventDefault();
    bubbleCamera.position.z += e.deltaY * 0.1;
  });

  // Hover effect
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  threeContainer.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / threeContainer.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY / threeContainer.clientHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, bubbleCamera);
    const intersects = raycaster.intersectObjects(bubbleSpheres.map(s => s.sphere));

    bubbleSpheres.forEach(({ sphere, originalPosition }) => {
      sphere.scale.set(1, 1, 1);
      sphere.material.emissiveIntensity = 0.2;
    });

    if (intersects.length > 0) {
      const hovered = intersects[0].object;
      hovered.scale.set(1.3, 1.3, 1.3);
      hovered.material.emissiveIntensity = 0.6;
      
      // Mostra info
      showBubbleInfo(hovered.userData);
    }
  });

  // Legend
  data.forEach((sector) => {
    const item = document.createElement('div');
    item.className = 'legend-item';
    item.style.cursor = 'pointer';
    
    const color = document.createElement('div');
    color.className = 'legend-color';
    color.style.backgroundColor = '#' + sector.color.toString(16).padStart(6, '0');
    
    const info = document.createElement('div');
    info.className = 'legend-info';
    info.innerHTML = `
      <div class="legend-name">${sector.name}</div>
      <div class="legend-details">
        $${sector.marketCap.toFixed(1)}B • ${sector.companies} emp. • ${sector.avgDividend.toFixed(2)}%
      </div>
    `;
    
    item.appendChild(color);
    item.appendChild(info);
    legendGrid.appendChild(item);
  });

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    bubbleRenderer.render(bubbleScene, bubbleCamera);
  }
  animate();

  // Handle resize
  window.addEventListener('resize', () => {
    const width = threeContainer.clientWidth;
    const height = threeContainer.clientHeight;
    bubbleCamera.aspect = width / height;
    bubbleCamera.updateProjectionMatrix();
    bubbleRenderer.setSize(width, height);
  });
}

function showBubbleInfo(data) {
  let infoDiv = document.getElementById('bubble-info-popup');
  if (!infoDiv) {
    infoDiv = document.createElement('div');
    infoDiv.id = 'bubble-info-popup';
    infoDiv.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: var(--bg-secondary);
      border: 1px solid var(--accent-cyan);
      border-radius: 8px;
      padding: 15px;
      color: var(--text-primary);
      font-size: 0.9em;
      max-width: 300px;
      z-index: 1000;
      font-family: "JetBrains Mono", monospace;
    `;
    document.body.appendChild(infoDiv);
  }

  infoDiv.innerHTML = `
    <strong style="color: var(--accent-cyan);">${data.name}</strong><br>
    Market Cap: <strong>$${data.marketCap.toFixed(1)}B</strong><br>
    Empresas: <strong>${data.companies}</strong><br>
    Div. Yield: <strong>${data.avgDividend.toFixed(2)}%</strong><br>
    Top: <strong>${data.topCompany}</strong>
  `;
}

// Carrega Three.js se não estiver disponível
if (typeof THREE === 'undefined') {
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
  document.head.appendChild(script);
  script.onload = () => {
    console.log('Three.js carregado');
  };
}
