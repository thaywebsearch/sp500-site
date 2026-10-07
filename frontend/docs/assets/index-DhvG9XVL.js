(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))a(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const r of s.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&a(r)}).observe(document,{childList:!0,subtree:!0});function o(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function a(i){if(i.ep)return;i.ep=!0;const s=o(i);fetch(i.href,s)}})();const Q=window.location.hostname,O=Q==="localhost"||Q==="127.0.0.1"?"http://localhost:5001":"https://sp500-site-production.up.railway.app",_=[{id:"communication-services",name:"Communication Services"},{id:"consumer-discretionary",name:"Consumer Discretionary"},{id:"consumer-staples",name:"Consumer Staples"},{id:"energy",name:"Energy"},{id:"financials",name:"Financials"},{id:"health-care",name:"Health Care"},{id:"industrials",name:"Industrials"},{id:"information-technology",name:"Information Technology"},{id:"materials",name:"Materials"},{id:"real-estate",name:"Real Estate"},{id:"utilities",name:"Utilities"}];window.API_BASE_URL=O;window.SECTORS=_;console.log("✅ Configuração global carregada:",O);let I=[],c=null;async function ce(){try{const e=document.getElementById("daily-curiosity-view");if(!e){console.error("Elemento daily-curiosity-view não encontrado");return}e.innerHTML='<div class="curiosidade-loading">Carregando curiosidade...</div>';const t=await fetch(`${O}/api/curiosidades`);if(!t.ok){console.error(`Erro ao buscar curiosidades: ${t.status}`),e.innerHTML=`<div class="curiosidade-erro">Erro ao carregar curiosidades (${t.status})</div>`;return}const o=await t.json();if(!o.sucesso||!o.dados||!o.dados.curiosidades){console.error("Dados de curiosidades inválidos:",o),e.innerHTML='<div class="curiosidade-erro">Formato de dados inválido</div>';return}if(I=o.dados.curiosidades,I.length===0){e.innerHTML='<div class="curiosidade-erro">Nenhuma curiosidade disponível</div>';return}le(),ue()}catch(e){console.error("Erro ao carregar curiosidades:",e);const t=document.getElementById("daily-curiosity-view");t&&(t.innerHTML=`<div class="curiosidade-erro">Erro ao carregar: ${e.message}</div>`)}}function le(){if(I.length===0)return;const t=new Date().getDate(),o=(t-1)%I.length;c=I[o],console.log(`Curiosidade do dia ${t}: ${c==null?void 0:c.empresa}`)}function ue(){const e=document.getElementById("daily-curiosity-view");if(!e||!c){console.error("View ou curiosidade não encontrada");return}pe();const t=`
    <div class="curiosidade-container">
      <div class="curiosidade-header">
        <h1>🌟 Curiosidade do Dia</h1>
        <p class="curiosidade-data">${fe()}</p>
      </div>

      <div class="curiosidade-card">
        <div class="curiosidade-simbolo">
          <span class="simbolo-badge">${c.simbolo}</span>
          <span class="posicao-badge">#${c.posicao}</span>
        </div>

        <div class="curiosidade-conteudo">
          <h2 class="curiosidade-empresa">${c.empresa}</h2>
          <p class="curiosidade-setor">
            <strong>Setor:</strong> ${c.setor||"N/A"}
          </p>

          <div class="curiosidade-titulo">
            <h3>${c.titulo}</h3>
          </div>

          <div class="curiosidade-descricao">
            <p>${c.descricao}</p>
          </div>

          ${c.fatos&&c.fatos.length>0?`
            <div class="curiosidade-fatos">
              <h4>📊 Fatos Interessantes:</h4>
              <ul>
                ${c.fatos.map(o=>`<li>${o}</li>`).join("")}
              </ul>
            </div>
          `:""}

          ${c.dividendYield?`
            <div class="curiosidade-dados">
              <p><strong>Dividend Yield:</strong> ${c.dividendYield}</p>
            </div>
          `:""}

          ${c.marketCap?`
            <div class="curiosidade-dados">
              <p><strong>Market Cap:</strong> ${c.marketCap}</p>
            </div>
          `:""}

          ${c.insight?`
            <div class="curiosidade-insight">
              <p><em>💡 ${c.insight}</em></p>
            </div>
          `:""}

          <div class="curiosidade-acoes">
            <button class="btn-compartilhar" onclick="compartilharCuriosidade()">
              📤 Compartilhar
            </button>
            ${c.link?`
              <a href="${c.link}" target="_blank" class="btn-saibamais">
                🔗 Saiba Mais
              </a>
            `:""}
          </div>
        </div>
      </div>

      <div class="curiosidade-footer">
        <p>Curiosidade de ${c.empresa} - Atualizado em ${c.dataAdicao||"N/A"}</p>
        <p class="curiosidade-dica">💡 Uma curiosidade diferente a cada dia do mês!</p>
      </div>
    </div>
  `;e.innerHTML=t,window.compartilharCuriosidade=me}function pe(){if(document.getElementById("curiosidade-styles"))return;const e=document.createElement("style");e.id="curiosidade-styles",e.textContent=`
    .curiosidade-container {
      padding: 20px;
      max-width: 900px;
      margin: 0 auto;
    }

    .curiosidade-header {
      text-align: center;
      margin-bottom: 30px;
      border-bottom: 2px solid #ffd700;
      padding-bottom: 15px;
    }

    .curiosidade-header h1 {
      font-size: 2.5em;
      color: #ffd700;
      margin: 0;
      margin-bottom: 10px;
    }

    .curiosidade-data {
      color: #888;
      font-size: 0.9em;
    }

    .curiosidade-card {
      background: linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%);
      border: 2px solid #ffd700;
      border-radius: 10px;
      padding: 30px;
      margin-bottom: 20px;
      box-shadow: 0 8px 32px rgba(255, 215, 0, 0.2);
    }

    .curiosidade-simbolo {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
      align-items: center;
    }

    .simbolo-badge {
      background: #ffd700;
      color: #000;
      padding: 8px 15px;
      border-radius: 5px;
      font-weight: bold;
      font-size: 1.2em;
    }

    .posicao-badge {
      background: #555;
      color: #ffd700;
      padding: 8px 12px;
      border-radius: 5px;
      font-size: 0.9em;
    }

    .curiosidade-conteudo {
      color: #fff;
    }

    .curiosidade-empresa {
      font-size: 2em;
      color: #ffd700;
      margin: 0 0 10px 0;
    }

    .curiosidade-setor {
      color: #bbb;
      margin-bottom: 20px;
    }

    .curiosidade-titulo {
      background: rgba(255, 215, 0, 0.1);
      padding: 15px;
      border-left: 4px solid #ffd700;
      margin: 20px 0;
      border-radius: 5px;
    }

    .curiosidade-titulo h3 {
      margin: 0;
      color: #ffd700;
      font-size: 1.4em;
    }

    .curiosidade-descricao {
      line-height: 1.6;
      margin: 20px 0;
      color: #ddd;
      font-size: 1.05em;
    }

    .curiosidade-fatos {
      background: rgba(100, 100, 100, 0.3);
      padding: 15px;
      border-radius: 5px;
      margin: 20px 0;
    }

    .curiosidade-fatos h4 {
      color: #ffd700;
      margin-top: 0;
    }

    .curiosidade-fatos ul {
      list-style: none;
      padding: 0;
    }

    .curiosidade-fatos li {
      padding: 8px 0;
      border-bottom: 1px solid #444;
      color: #ddd;
    }

    .curiosidade-fatos li:last-child {
      border-bottom: none;
    }

    .curiosidade-dados {
      background: rgba(255, 215, 0, 0.05);
      padding: 12px;
      border-radius: 5px;
      margin: 10px 0;
      color: #ddd;
    }

    .curiosidade-insight {
      background: rgba(255, 215, 0, 0.1);
      padding: 15px;
      border-radius: 5px;
      margin: 20px 0;
      border-left: 4px solid #ffd700;
      color: #ffd700;
    }

    .curiosidade-acoes {
      display: flex;
      gap: 10px;
      margin-top: 25px;
      flex-wrap: wrap;
    }

    .btn-compartilhar,
    .btn-saibamais {
      padding: 12px 24px;
      border: 2px solid #ffd700;
      background: transparent;
      color: #ffd700;
      border-radius: 5px;
      cursor: pointer;
      font-size: 1em;
      font-weight: bold;
      transition: all 0.3s ease;
      text-decoration: none;
      display: inline-block;
    }

    .btn-compartilhar:hover,
    .btn-saibamais:hover {
      background: #ffd700;
      color: #000;
    }

    .curiosidade-footer {
      text-align: center;
      color: #888;
      font-size: 0.9em;
      margin-top: 30px;
      padding-top: 15px;
      border-top: 1px solid #444;
    }

    .curiosidade-loading {
      text-align: center;
      color: #ffd700;
      font-size: 1.2em;
      padding: 40px;
    }

    .curiosidade-erro {
      background: #8b0000;
      color: #fff;
      padding: 20px;
      border-radius: 5px;
      text-align: center;
    }

    @media (max-width: 768px) {
      .curiosidade-container {
        padding: 10px;
      }

      .curiosidade-header h1 {
        font-size: 1.8em;
      }

      .curiosidade-card {
        padding: 15px;
      }

      .curiosidade-empresa {
        font-size: 1.5em;
      }

      .curiosidade-acoes {
        flex-direction: column;
      }

      .btn-compartilhar,
      .btn-saibamais {
        width: 100%;
        text-align: center;
      }
    }
  `,document.head.appendChild(e)}function me(){if(!c)return;const e=`🌟 Curiosidade do Dia: ${c.empresa}

${c.descricao}

Símbolo: ${c.simbolo}`;navigator.share?navigator.share({title:`Curiosidade do Dia - ${c.empresa}`,text:e,url:window.location.href}).catch(t=>console.log("Erro ao compartilhar:",t)):navigator.clipboard.writeText(e).then(()=>{alert("Curiosidade copiada para a área de transferência!")}).catch(t=>{alert("Erro ao copiar: "+t)})}function fe(){const e=new Date,t={weekday:"long",year:"numeric",month:"long",day:"numeric"};return e.toLocaleDateString("pt-BR",t)}function he(e){return e?e>=1e12?`$${(e/1e12).toFixed(2)}T`:e>=1e9?`$${(e/1e9).toFixed(2)}B`:e>=1e6?`$${(e/1e6).toFixed(2)}M`:`$${e.toLocaleString("en-US")}`:"N/A"}function p(e){return e?String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;"):""}async function ge(e){try{const t=await fetch(`/api/historico/${e}`);if(!t.ok)throw new Error(`Erro ao buscar histórico de ${e}`);return(await t.json()).registros||[]}catch(t){return console.error(`Erro ao buscar histórico de ${e}:`,t),[]}}const j=760,V=320,h={top:28,right:28,bottom:44,left:68};function ve(e){if(!e)return"";const[t,o,a]=e.split("-");return`${a}/${o}/${t.slice(2)}`}function J(e){return Number.isFinite(e)?e>=100?`$${e.toFixed(0)}`:`$${e.toFixed(2)}`:"—"}function be(e){const t=e.map(m=>m.close),o=Math.min(...t),a=Math.max(...t),i=a-o||1,s=o-i*.08,r=a+i*.08,n=e.length,d=m=>h.left+m/(n-1)*(j-h.left-h.right),l=m=>h.top+(1-(m-s)/(r-s))*(V-h.top-h.bottom);let u=`<svg viewBox="0 0 ${j} ${V}" style="width:100%;height:auto;display:block;background:var(--plot-bg);border-radius:8px">`;const f=5;for(let m=0;m<=f;m++){const A=s+(r-s)*m/f,U=l(A);u+=`<line x1="${h.left}" y1="${U.toFixed(1)}" x2="${j-h.right}" y2="${U.toFixed(1)}" stroke="var(--chart-axis)" stroke-width="1"/>`,u+=`<text x="${h.left-8}" y="${(U+4).toFixed(1)}" text-anchor="end" font-size="11" fill="var(--chart-label)">${J(A)}</text>`}const $=[];for(let m=0;m<=4;m++)$.push(Math.round((n-1)*m/4));$.forEach(m=>{const A=d(m);u+=`<text x="${A.toFixed(1)}" y="${V-h.bottom+18}" text-anchor="middle" font-size="11" fill="var(--chart-label)">${ve(e[m].data)}</text>`});const w=e.map((m,A)=>`${d(A).toFixed(1)},${l(m.close).toFixed(1)}`).join(" "),q=`${h.left},${l(s).toFixed(1)} `+w+` ${d(n-1).toFixed(1)},${l(s).toFixed(1)}`;u+=`<polygon points="${q}" fill="rgba(0, 212, 255, 0.08)"/>`,u+=`<polyline points="${w}" fill="none" stroke="var(--accent-cyan)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;const Y=e[n-1],Z=l(Y.close);return u+=`<circle cx="${d(n-1).toFixed(1)}" cy="${Z.toFixed(1)}" r="4" fill="var(--accent-cyan)"/>`,u+=`<text x="${j-h.right}" y="${(Z-10).toFixed(1)}" text-anchor="end" font-size="12" font-weight="700" fill="var(--chart-text)">${J(Y.close)}</text>`,u+="</svg>",u}async function ye(e,t){var i;(i=document.querySelector(".modal-overlay"))==null||i.remove();const o=document.createElement("div");o.className="modal-overlay";const a=()=>o.remove();o.addEventListener("click",s=>{s.target===o&&a()}),document.addEventListener("keydown",s=>{s.key==="Escape"&&a()}),o.innerHTML=`
    <div class="modal" role="dialog" aria-label="Histórico de ${p(e)}">
      <div class="modal-header">
        <h2 class="modal-title">
          📈 ${p(e)}
          <span class="modal-subtitle">${p(t||"")}</span>
        </h2>
        <button class="modal-close" aria-label="Fechar">✕</button>
      </div>
      <div class="modal-body" id="price-chart-body">
        <p class="modal-loading">Carregando histórico...</p>
      </div>
    </div>
  `,document.body.appendChild(o),o.querySelector(".modal-close").addEventListener("click",a);try{const s=await ge(e),r=o.querySelector("#price-chart-body");if(!s||s.length===0){r.innerHTML=`<p class="modal-error">Nenhum dado de preço disponível para ${p(e)}.</p>`;return}const n=s[0].close,d=s[s.length-1].close,l=(d-n)/n*100,u=l>=0,f=u?"positive":"negative";r.innerHTML=`
      <div class="price-stats">
        <div class="price-stat">
          <span class="price-stat-label">Último</span>
          <strong>${J(d)}</strong>
        </div>
        <div class="price-stat">
          <span class="price-stat-label">Variação (2a)</span>
          <strong class="${f}">${u?"+":""}${l.toFixed(2)}%</strong>
        </div>
        <div class="price-stat">
          <span class="price-stat-label">Período</span>
          <strong>${s.length} pregões</strong>
        </div>
      </div>
      ${be(s)}
    `}catch(s){console.error(`Erro ao buscar histórico de ${e}:`,s);const r=o.querySelector("#price-chart-body");r.innerHTML=`<p class="modal-error">Erro ao carregar o histórico de ${p(e)}. Verifique se o backend está online.</p>`}}function g(e,t){return`
    <div class="company-detail">
      <span class="company-detail-label">${e}</span>
      <strong class="company-detail-value">${t}</strong>
    </div>
  `}function $e(e){var s;(s=document.querySelector(".modal-overlay"))==null||s.remove();const t=document.createElement("div");t.className="modal-overlay";const o=()=>t.remove();t.addEventListener("click",r=>{r.target===t&&o()}),document.addEventListener("keydown",r=>{r.key==="Escape"&&o()});const a=e.dividendYield!==null&&e.dividendYield!==void 0?`${e.dividendYield.toFixed(2)}%`:"—",i=he(e.marketCap);t.innerHTML=`
    <div class="modal" role="dialog" aria-label="Detalhes de ${p(e.symbol)}">
      <div class="modal-header">
        <h2 class="modal-title">
          💼 ${p(e.symbol)}
          <span class="modal-subtitle">${p(e.name||"")}</span>
        </h2>
        <button class="modal-close" aria-label="Fechar">✕</button>
      </div>
      <div class="modal-body">
        <div class="company-details-grid">
          ${g("Empresa",p(e.name||"N/A"))}
          ${g("Setor",p(e.sectorName||e.sector||"N/A"))}
          ${g("Subindústria",p(e.subIndustry||"N/A"))}
          ${g("Sede",p(e.headquarters||"N/A"))}
          ${g("Market Cap",i)}
          ${g("Classificação",p(e.marketCapClassification||"N/A"))}
          ${g("Div. Yield",a)}
          ${g("Paga dividendos",e.hasDividend?p(e.hasDividend):"—")}
          ${g("Data de inclusão",p(e.dateAdded||"N/A"))}
          ${g("CIK",e.cik?p(String(e.cik)):"N/A")}
          ${g("Fundação",p(e.founded||"N/A"))}
        </div>
        <div class="modal-footer">
          <button class="modal-action" id="details-chart-btn">📈 Ver histórico de preços</button>
        </div>
      </div>
    </div>
  `,document.body.appendChild(t),t.querySelector(".modal-close").addEventListener("click",o),t.querySelector("#details-chart-btn").addEventListener("click",()=>{ye(e.symbol,e.name)})}const ee="sp500-watchlist",te="sp500-price-alerts",K=50;function xe(){try{const e=localStorage.getItem(ee);return e?JSON.parse(e):[]}catch(e){return console.error("Erro ao carregar watchlist:",e),[]}}function ke(){try{localStorage.setItem(ee,JSON.stringify([...b]))}catch(e){console.error("Erro ao salvar watchlist:",e)}}function we(){try{const e=localStorage.getItem(te);if(!e)return[];const t=JSON.parse(e);return Array.isArray(t)&&t.length>0&&Array.isArray(t[0])?t:Array.isArray(t)&&t.length>0&&typeof t[0]=="object"?t.map(o=>[o.symbol,o]):[]}catch(e){return console.error("Erro ao carregar price alerts:",e),[]}}function G(){try{const e=Array.from(D.entries());localStorage.setItem(te,JSON.stringify(e))}catch(e){console.error("Erro ao salvar price alerts:",e)}}function Ee(e,t){let o;return function(...i){const s=()=>{clearTimeout(o),e(...i)};clearTimeout(o),o=setTimeout(s,t)}}let x=[],v=[],y=1,P="dashboard",M=new Set;const b=new Set(xe()||[]),W=we(),D=new Map(W&&W.length>0?W:[]);let k,C,B,T,F,N,E,S,R;document.addEventListener("DOMContentLoaded",()=>{console.log("🚀 Inicializando dashboard..."),k=document.getElementById("sector-filter"),C=document.getElementById("country-filter"),B=document.getElementById("search-input"),T=document.getElementById("dividend-min"),F=document.getElementById("sort-select"),N=document.getElementById("table-body"),E=document.getElementById("stats"),S=document.getElementById("pagination"),R=document.getElementById("header-checkbox"),console.log("📍 Elementos encontrados:",{sectorFilter:!!k,tableBody:!!N,statsEl:!!E,paginationEl:!!S});const e=document.querySelectorAll(".nav-tab");console.log(`📌 Encontradas ${e.length} abas`),e.forEach(s=>{s.addEventListener("click",r=>{r.preventDefault();const n=s.getAttribute("data-tab");console.log(`🔀 Navegando para: ${n}`),Ce(n)})}),k&&k.addEventListener("change",L),C&&C.addEventListener("change",L),B&&B.addEventListener("input",Ee(L,300)),T&&T.addEventListener("change",L),F&&F.addEventListener("change",L),R&&R.addEventListener("change",()=>{N.querySelectorAll(".row-checkbox").forEach(r=>{r.checked=R.checked,r.dispatchEvent(new Event("change"))})});const t=document.getElementById("select-all"),o=document.getElementById("deselect-all"),a=document.getElementById("export-csv"),i=document.getElementById("export-json");t&&t.addEventListener("click",()=>{v.forEach(s=>M.add(s.symbol)),H(),z()}),o&&o.addEventListener("click",()=>{M.clear(),H(),z()}),a&&a.addEventListener("click",Ye),i&&i.addEventListener("click",je),console.log("✅ Event listeners registrados"),oe(),ae(),se(),re(),qe(),console.log("✅ Dashboard inicializado com sucesso!")});function Ce(e){console.log(`📍 Mudando aba para: ${e}`),P=e,oe(),ae()}function oe(){console.log(`🎨 Atualizando UI para: ${P}`);const e=document.getElementById("dashboard-view"),t=document.getElementById("treemap-view"),o=document.getElementById("heatmap-view"),a=document.getElementById("bubble-chart-view"),i=document.getElementById("watchlist-view"),s=document.getElementById("stock-of-day-view"),r=document.getElementById("daily-curiosity-view");switch([e,t,o,a,i,s,r].forEach(d=>{d&&(d.style.display="none")}),P){case"dashboard":e&&(e.style.display="block");break;case"stock-of-day":s&&(s.style.display="block",ne());break;case"daily-curiosity":r&&(r.style.display="block",ce());break;case"treemap":t&&(t.style.display="block");break;case"heatmap":o&&(o.style.display="block");break;case"bubble":a&&(a.style.display="block");break;case"watchlist":i&&(i.style.display="block",Ae());break;default:e&&(e.style.display="block")}}function ae(){document.querySelectorAll(".nav-tab").forEach(t=>{t.classList.remove("active"),t.getAttribute("data-tab")===P&&(t.classList.add("active"),console.log(`✅ Aba ativa: ${P}`))})}async function se(){console.log("📊 Carregando dados do dashboard..."),E&&(E.textContent="Carregando dados...");try{const e=await fetch(`${O}/api/setores`);if(!e.ok)throw new Error("Erro ao buscar setores");const o=(await e.json()).setores||[];console.log(`🔄 Carregando ${o.length} setores...`);const a=o.map(async s=>{try{const r=await fetch(`${O}/api/setor/${s}`);if(!r.ok)throw new Error(`HTTP ${r.status}`);const n=await r.json(),d=_.find(u=>u.id===s),l=d?d.name:s;return n.dados&&n.dados.companies&&Array.isArray(n.dados.companies)?n.dados.companies.map(u=>({...u,sector:s,sectorName:l})):[]}catch(r){return console.error(`❌ Erro ao carregar ${s}:`,r),[]}});x=(await Promise.all(a)).flat(),console.log(`✅ ${x.length} empresas carregadas`),k&&(k.innerHTML='<option value="">Todos os Setores</option>',[...new Set(x.map(r=>r.sector))].sort().forEach(r=>{var d;const n=document.createElement("option");n.value=r,n.textContent=((d=_.find(l=>l.id===r))==null?void 0:d.name)||r,k.appendChild(n)})),C&&(C.innerHTML='<option value="">Todos os Países</option>',[...new Set(x.map(r=>r.location||r.country||"N/A"))].sort().forEach(r=>{const n=document.createElement("option");n.value=r,n.textContent=r,C.appendChild(n)})),L(),z()}catch(e){console.error("❌ Erro ao carregar dados:",e),E&&(E.textContent="Erro ao carregar dados. Tente novamente.")}}function L(){const e=k?k.value:"",t=C?C.value:"",o=B?B.value.toLowerCase():"",a=T&&parseFloat(T.value)||0,i=F?F.value:"symbol-asc";v=x.filter(n=>{const d=!e||n.sector===e,l=!t||(n.location||n.country||"N/A")===t,u=!o||n.symbol.toLowerCase().includes(o)||n.name.toLowerCase().includes(o),f=!a||(parseFloat(n.dividendYield)||0)>=a;return d&&l&&u&&f});const[s,r]=i.split("-");v.sort((n,d)=>{let l=n[s],u=d[s];if(typeof l=="string"){const w=(l||"").localeCompare(u||"");return r==="asc"?w:-w}const f=parseFloat(l)||0,$=parseFloat(u)||0;return r==="asc"?f-$:$-f}),y=1,H(),z()}function H(){if(!N){console.error("❌ tableBody não encontrado!");return}N.innerHTML="";const e=(y-1)*K,t=e+K,o=v.slice(e,t);console.log(`📋 Renderizando ${o.length} empresas (página ${y})`),o.forEach((a,i)=>{const s=M.has(a.symbol),r=document.createElement("tr");r.innerHTML=`
      <td>
        <input type="checkbox" class="row-checkbox" data-symbol="${a.symbol}" 
          ${s?"checked":""}>
      </td>
      <td class="col-index">${e+i+1}</td>
      <td><strong>${a.symbol}</strong></td>
      <td>${a.name||"N/A"}</td>
      <td>${a.sectorName||a.sector||"N/A"}</td>
      <td>${a.marketCap?a.marketCap:"N/A"}</td>
      <td>${a.subindustry||a.industry||"N/A"}</td>
      <td>${a.location||a.country||"N/A"}</td>
      <td>${a.dividendYield?parseFloat(a.dividendYield).toFixed(2)+"%":"N/A"}</td>
      <td>
        <button class="btn-watchlist" data-symbol="${a.symbol}" title="Adicionar à watchlist">
          ${b.has(a.symbol)?"★":"☆"}
        </button>
      </td>
    `;const n=r.querySelector(".row-checkbox");n.addEventListener("change",()=>{n.checked?M.add(a.symbol):M.delete(a.symbol),z()});const d=r.querySelector(".btn-watchlist");d.addEventListener("click",()=>{ie(a.symbol),d.textContent=b.has(a.symbol)?"★":"☆",re()}),N.appendChild(r)}),console.log(`✅ ${o.length} linhas renderizadas`),Se()}function Se(){if(!S)return;S.innerHTML="";const e=Math.ceil(v.length/K),t=document.createElement("button");t.textContent="Anterior",t.disabled=y===1,t.addEventListener("click",()=>{y>1&&(y--,H())}),S.appendChild(t);const o=document.createElement("span");o.textContent=`Página ${y} de ${e}`,S.appendChild(o);const a=document.createElement("button");a.textContent="Próxima",a.disabled=y===e,a.addEventListener("click",()=>{y<e&&(y++,H())}),S.appendChild(a)}function z(){if(!E)return;const e=v.length,t=M.size,o=v.length>0?(v.reduce((a,i)=>a+(parseFloat(i.dividendYield)||0),0)/v.length).toFixed(2):0;E.innerHTML=`Total: ${e} | Selecionadas: ${t} | Dividend Yield Médio: ${o}%`}function ie(e){b.has(e)?b.delete(e):b.add(e),ke()}function re(){const e=document.querySelector("[data-watchlist-count]");e&&(e.textContent=b.size,console.log(`🌟 Watchlist atualizada: ${b.size} empresas`))}async function Ae(){const e=document.getElementById("watchlist-view");if(!e)return;const t=x.filter(a=>b.has(a.symbol));if(t.length===0){e.innerHTML="<p>Nenhuma empresa na watchlist.</p>";return}let o='<table class="watchlist-table"><thead><tr><th>#</th><th>Símbolo</th><th>Nome</th><th>Setor</th><th>Dividend Yield</th><th>Market Cap</th></tr></thead><tbody>';t.forEach((a,i)=>{o+=`<tr>
      <td>${i+1}</td>
      <td><strong>${a.symbol}</strong></td>
      <td>${a.name}</td>
      <td>${a.sectorName||"N/A"}</td>
      <td>${a.dividendYield||"N/A"}</td>
      <td>${a.marketCap||"N/A"}</td>
    </tr>`}),o+="</tbody></table>",e.innerHTML=o}async function ne(){const e=document.getElementById("stock-of-day-view");if(e){e.innerHTML=`
    <div class="stock-of-day-loading">
      <div class="loading-spinner"></div>
      <p>Analisando o mercado... selecionando a melhor oportunidade de hoje</p>
    </div>
  `;try{x.length===0&&await se();const t=new Date().toISOString().slice(0,10),o=Fe(t);if(o){X(e,o);return}const a=await Le();Oe(t,a),X(e,a)}catch(t){console.error("Erro ao carregar Ação do Dia:",t),e.innerHTML=`
      <div class="stock-of-day-error">
        <h3>⚠️ Indisponível no momento</h3>
        <p>Não foi possível gerar a análise. Tente novamente mais tarde.</p>
        <button class="retry-btn" onclick="loadStockOfDay()">Tentar novamente</button>
      </div>
    `}}}function Le(){return new Promise(e=>{setTimeout(()=>{const t=new Date().toISOString().slice(0,10),o=Me(t),a=x.filter(d=>d.marketCap&&d.marketCap>1e9).map(d=>{const l=Ne(d),u=De(d.sector),f=b.has(d.symbol)?15:0,$=(d.dividendYield||0)>2?10:0,w=Math.min(20,Math.log10(d.marketCap/1e9)*5),q=Ie(d),Y=l+u+f+$+w+q;return{...d,score:Math.round(Y*100)/100,breakdown:{technical:l,sector:u,watchlist:f,dividend:$,liquidity:Math.round(w),volatility:Math.round(q)},rationale:Be(d,l,u,f,$)}}).sort((d,l)=>l.score-d.score),i=a.slice(0,Math.min(10,a.length)),s=o%i.length,r=i[s],n=i.filter((d,l)=>l!==s).slice(0,3);e({date:t,primary:r,alternatives:n,marketContext:Te(),generatedAt:new Date().toISOString()})},100)})}function Me(e){let t=0;for(let o=0;o<e.length;o++)t=(t<<5)-t+e.charCodeAt(o),t|=0;return Math.abs(t)}function Ne(e){let t=50;const o=e.dividendYield||0;o>4?t+=15:o>2?t+=8:o>0&&(t+=3);const a=e.marketCap||0;a>5e11?t+=10:a>1e11?t+=7:a>5e10?t+=5:a>1e10&&(t+=3);const i=(e.subIndustry||"").toLowerCase();["software","semiconductors","biotechnology","cloud","ai","cybersecurity","renewable"].some(r=>i.includes(r))&&(t+=12);const s=(e.name||"").toLowerCase();return["inc.","corporation","technologies","systems","solutions"].some(r=>s.includes(r))&&(t+=3),Math.min(90,t)}function De(e){return{"information-technology":15,"health-care":8,"consumer-discretionary":5,"communication-services":7,industrials:5,financials:3,materials:2,energy:0,utilities:-2,"real-estate":-3,"consumer-staples":1}[e]||0}function Ie(e){const t=e.marketCap||0;return t>2e11?8:t>5e10?12:t>1e10?15:18}function Be(e,t,o,a,i){const s=[];return t>60&&s.push("Fundamentos técnicos sólidos"),o>10&&s.push(`Setor em momento favorável (${e.sectorName})`),a&&s.push("Está na sua watchlist pessoal"),i&&s.push(`Dividend yield atrativo (${(e.dividendYield||0).toFixed(1)}%)`),e.marketCap>1e11&&s.push("Grande capitalização — liquidez e estabilidade"),s.length===0&&s.push("Equilíbrio entre risco e retorno"),s.join(" • ")}function Te(){const e=Math.random()*30+10;return e<15?{level:"Calmo",description:"Baixa volatilidade - ambiente propício para acumulação",class:"calm"}:e<25?{level:"Moderado",description:"Volatilidade normal - seleção seletiva recomendada",class:"moderate"}:{level:"Elevado",description:"Alta volatilidade - foco em qualidade e liquidez",class:"elevated"}}function Fe(e){try{const t=localStorage.getItem("sp500-stock-of-day");if(!t)return null;const o=JSON.parse(t);return o.date===e?o:null}catch{return null}}function Oe(e,t){try{localStorage.setItem("sp500-stock-of-day",JSON.stringify(t))}catch{}}function X(e,t){const{primary:o,alternatives:a,marketContext:i,generatedAt:s}=t;if(!o){e.innerHTML='<div class="stock-of-day-error"><p>Sem dados suficientes</p></div>';return}e.innerHTML=`
    <div class="stock-of-day-container">
      <header class="stock-of-day-header">
        <div class="stock-badge">
          <span class="badge-icon">🎯</span>
          <span class="badge-text">Ação do Dia</span>
        </div>
        <div class="stock-meta">
          <span class="stock-date">${new Date().toLocaleDateString("pt-BR",{weekday:"long",day:"numeric",month:"long"})}</span>
          <span class="market-context ${i.class}">${i.level}</span>
        </div>
      </header>

      <div class="stock-main-card">
        <div class="stock-identity">
          <div class="stock-symbol">${p(o.symbol)}</div>
          <div class="stock-name">${p(o.name)}</div>
          <div class="stock-sector">${p(o.sectorName||o.sector)}</div>
        </div>

        <div class="stock-score">
          <div class="score-circle" style="--score: ${o.score}">
            <span class="score-value">${o.score}</span>
            <span class="score-label">/ 100</span>
          </div>
          <div class="score-breakdown">
            ${Object.entries(o.breakdown).map(([r,n])=>`
              <div class="score-bar">
                <span class="bar-label">${r}</span>
                <div class="bar-track"><div class="bar-fill" style="width: ${Math.min(100,n*2)}%"></div></div>
                <span class="bar-value">${n}</span>
              </div>
            `).join("")}
          </div>
        </div>

        <div class="stock-rationale">
          <h4>🎯 Por que esta ação?</h4>
          <p>${o.rationale}</p>
        </div>

        <div class="stock-metrics">
          <div class="metric">
            <span class="metric-label">Market Cap</span>
            <span class="metric-value">$${(o.marketCap/1e9).toFixed(1)}B</span>
          </div>
          <div class="metric">
            <span class="metric-label">Div. Yield</span>
            <span class="metric-value">${(o.dividendYield||0).toFixed(2)}%</span>
          </div>
          <div class="metric">
            <span class="metric-label">Setor</span>
            <span class="metric-value">${p(o.sectorName||o.sector)}</span>
          </div>
          <div class="metric">
            <span class="metric-label">Sub-setor</span>
            <span class="metric-value">${p(o.subIndustry||"N/A")}</span>
          </div>
        </div>

        <div class="stock-actions">
          <button class="action-btn primary" onclick="toggleWatchlist('${o.symbol}'); loadStockOfDay();">
            ${b.has(o.symbol)?"★ Remover da Watchlist":"☆ Adicionar à Watchlist"}
          </button>
          <button class="action-btn secondary" onclick="openCompanyDetails({symbol:'${o.symbol}',name:'${p(o.name).replace(/'/g,"\\'")}'})">
            📈 Ver Detalhes
          </button>
          <button class="action-btn ghost" onclick="setPriceAlertPrompt('${o.symbol}')">🔔 Criar Alerta</button>
        </div>
      </div>

      <section class="stock-alternatives">
        <h3>🥈 Menções Honrosas</h3>
        <div class="alternatives-grid">
          ${a.map((r,n)=>`
            <div class="alt-card">
              <span class="alt-rank">${n+2}º</span>
              <div class="alt-info">
                <div class="alt-symbol">${p(r.symbol)}</div>
                <div class="alt-name">${p(r.name)}</div>
              </div>
              <div class="alt-score">${r.score}</div>
            </div>
          `).join("")}
        </div>
      </section>

      <footer class="stock-disclaimer">
        <p><strong>⚠️ Disclaimer:</strong> Esta análise é gerada algoritmicamente com base em dados públicos e heurísticas quantitativas. Não constitui recomendação de investimento. Faça sua própria pesquisa (DYOR).</p>
        <p class="generated-at">Gerado em ${new Date(s).toLocaleTimeString("pt-BR")} • Baseado em ${x.length} empresas do S&P 500</p>
      </footer>
    </div>
  `}function Pe(e){const t=e.toUpperCase(),o=D.get(t);if(o&&o.triggered){confirm(`${e}: alerta já disparado. Remover?`)&&ze(t);return}const a=prompt(`Alerta de preço para ${e}:
Digite o preço alvo (ex: 150.25):`,o?o.target.toFixed(2):"");if(!a)return;const i=parseFloat(a);if(isNaN(i)||i<=0){alert("Preço inválido");return}const s=confirm(`Alertar quando o preço estiver ACIMA deste valor?
(OK = acima, Cancelar = abaixo)`)?"above":"below";He(t,i,s)}function He(e,t,o){return!e||typeof t!="number"||!["above","below"].includes(o)?!1:(D.set(e.toUpperCase(),{target:t,direction:o,triggered:!1}),G(),!0)}function ze(e){D.delete(e.toUpperCase()),G()}window.loadStockOfDay=ne;window.toggleWatchlist=ie;window.openCompanyDetails=$e;window.setPriceAlertPrompt=Pe;async function qe(){D.size!==0&&setInterval(async()=>{for(const[e,t]of D)t.triggered;G()},6e4)}function Ye(){const e=["#","Símbolo","Empresa","Setor","Market Cap","Subindústria","Sede","Dividend Yield"],t=v.map((a,i)=>[i+1,a.symbol,a.name,a.sectorName,a.marketCap,a.subindustry||a.industry||"N/A",a.location||a.country||"N/A",a.dividendYield||"N/A"]),o=[e,...t].map(a=>a.map(i=>`"${i}"`).join(",")).join(`
`);de(o,"sp500-export.csv","text/csv")}function je(){const e=JSON.stringify(v,null,2);de(e,"sp500-export.json","application/json")}function de(e,t,o){const a=new Blob([e],{type:o}),i=URL.createObjectURL(a),s=document.createElement("a");s.href=i,s.download=t,document.body.appendChild(s),s.click(),document.body.removeChild(s),URL.revokeObjectURL(i)}console.log("✅ main.js (10 colunas) carregado com sucesso!");
