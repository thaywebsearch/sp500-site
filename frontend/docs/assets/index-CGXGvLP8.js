(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))o(r);new MutationObserver(r=>{for(const n of r)if(n.type==="childList")for(const s of n.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&o(s)}).observe(document,{childList:!0,subtree:!0});function e(r){const n={};return r.integrity&&(n.integrity=r.integrity),r.referrerPolicy&&(n.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?n.credentials="include":r.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function o(r){if(r.ep)return;r.ep=!0;const n=e(r);fetch(r.href,n)}})();const Mt="https://sp500-api.onrender.com",z=Mt,Be=[{id:"communication-services",name:"Communication Services"},{id:"consumer-discretionary",name:"Consumer Discretionary"},{id:"consumer-staples",name:"Consumer Staples"},{id:"energy",name:"Energy"},{id:"financials",name:"Financials"},{id:"health-care",name:"Health Care"},{id:"industrials",name:"Industrials"},{id:"information-technology",name:"Information Technology"},{id:"materials",name:"Materials"},{id:"real-estate",name:"Real Estate"},{id:"utilities",name:"Utilities"}];window.API_BASE_URL=z;window.SECTORS=Be;let oe=[],y=null,Ce=0,Me="",tt="alfabética";async function Lt(){try{const t=document.getElementById("daily-curiosity-view");if(!t){console.error("Elemento daily-curiosity-view não encontrado");return}t.innerHTML='<div class="curiosidade-loading">Carregando curiosidade...</div>';const a=await fetch(`${z}/api/curiosidades`);if(!a.ok){console.error(`Erro ao buscar curiosidades: ${a.status}`),t.innerHTML=`<div class="curiosidade-erro">Erro ao carregar curiosidades (${a.status})</div>`;return}const e=await a.json();if(!e.sucesso||!e.dados||!e.dados.curiosidades){console.error("Dados de curiosidades inválidos:",e),t.innerHTML='<div class="curiosidade-erro">Formato de dados inválido</div>';return}if(oe=e.dados.curiosidades,Ce=e.dados.total||oe.length,Me=e.dados.proximaEmpresa||"",tt=e.dados.ordem||"alfabética",oe.length===0){t.innerHTML='<div class="curiosidade-erro">Nenhuma curiosidade disponível</div>';return}It(),Dt()}catch(t){console.error("Erro ao carregar curiosidades:",t);const a=document.getElementById("daily-curiosity-view");a&&(a.innerHTML=`<div class="curiosidade-erro">Erro ao carregar: ${t.message}</div>`)}}function It(){if(oe.length===0)return;const t=new Date,a=new Date(t.getFullYear(),t.getMonth(),t.getDate()),o=Math.floor(a.getTime()/864e5)%oe.length;y=oe[o]}function Dt(){const t=document.getElementById("daily-curiosity-view");if(!t||!y){console.error("View ou curiosidade não encontrada");return}Rt();const a=`
    <div class="curiosidade-container">
      <div class="curiosidade-header">
        <h1>🌟 Curiosidade do Dia</h1>
        <p class="curiosidade-data">${Pt()}</p>
      </div>

      <div class="curiosidade-card">
        <div class="curiosidade-simbolo">
          <span class="simbolo-badge">${y.simbolo}</span>
          <span class="posicao-badge">#${y.posicao}</span>
        </div>

        <div class="curiosidade-conteudo">
          <h2 class="curiosidade-empresa">${y.empresa}</h2>
          <p class="curiosidade-setor">
            <strong>Setor:</strong> ${y.setor||"N/A"}
          </p>

          <div class="curiosidade-titulo">
            <h3>${y.titulo}</h3>
          </div>

          <div class="curiosidade-descricao">
            <p>${y.descricao}</p>
          </div>

          ${y.fatos&&y.fatos.length>0?`
            <div class="curiosidade-fatos">
              <h4>📊 Fatos Interessantes:</h4>
              <ul>
                ${y.fatos.map(e=>`<li>${e}</li>`).join("")}
              </ul>
            </div>
          `:""}

          ${y.dividendYield?`
            <div class="curiosidade-dados">
              <p><strong>Dividend Yield:</strong> ${y.dividendYield}</p>
            </div>
          `:""}

          ${y.marketCap?`
            <div class="curiosidade-dados">
              <p><strong>Market Cap:</strong> ${y.marketCap}</p>
            </div>
          `:""}

          ${y.insight?`
            <div class="curiosidade-insight">
              <p><em>💡 ${y.insight}</em></p>
            </div>
          `:""}

          ${Ce>0?`
            <div class="curiosidade-progresso">
              <div class="progresso-texto">
                <span>Rotatividade diária · ordem ${tt}</span>
                <span>Empresa ${y.posicao} de ${Ce}</span>
              </div>
              <div class="progresso-barra">
                <div class="progresso-preenchido" style="width: ${Number(y.posicao)/Ce*100}%;"></div>
              </div>
            </div>
          `:""}

          <div class="curiosidade-acoes">
            <button class="btn-compartilhar" onclick="compartilharCuriosidade()">
              📤 Compartilhar
            </button>
            ${y.link?`
              <a href="${y.link}" target="_blank" class="btn-saibamais">
                🔗 Saiba Mais
              </a>
            `:""}
          </div>
        </div>
      </div>

      <div class="curiosidade-footer">
        <p>Curiosidade de ${y.empresa} - Atualizado em ${y.dataAdicao||"N/A"}</p>
        ${Me?`<p class="curiosidade-proxima">⏭️ Amanhã: ${Me}</p>`:""}
        <p class="curiosidade-dica">💡 Uma empresa diferente a cada dia, em ordem alfabética do S&P 500!</p>
      </div>
    </div>
  `;t.innerHTML=a,window.compartilharCuriosidade=Nt}function Rt(){if(document.getElementById("curiosidade-styles"))return;const t=document.createElement("style");t.id="curiosidade-styles",t.textContent=`
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

    .curiosidade-proxima {
      color: #ffd700;
      font-weight: bold;
      margin-top: 8px;
    }

    .curiosidade-progresso {
      margin: 20px 0 0 0;
    }

    .progresso-texto {
      display: flex;
      justify-content: space-between;
      font-size: 0.85em;
      color: #bbb;
      margin-bottom: 6px;
      flex-wrap: wrap;
      gap: 6px;
    }

    .progresso-barra {
      width: 100%;
      height: 8px;
      background: rgba(255, 215, 0, 0.15);
      border-radius: 4px;
      overflow: hidden;
    }

    .progresso-preenchido {
      height: 100%;
      background: linear-gradient(90deg, #ffd700 0%, #ffa000 100%);
      border-radius: 4px;
      transition: width 0.4s ease;
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
  `,document.head.appendChild(t)}function Nt(){if(!y)return;const t=(y.fatos||[]).map(e=>`• ${e}`).join(`
`),a=`🌟 Curiosidade do Dia: ${y.empresa} (${y.simbolo})

${y.descricao}

${t}

💡 ${y.insight||""}`;navigator.share?navigator.share({title:`Curiosidade do Dia - ${y.empresa}`,text:a,url:window.location.href}).catch(e=>console.error("Erro ao compartilhar:",e)):navigator.clipboard.writeText(a).then(()=>{alert("Curiosidade copiada para a área de transferência!")}).catch(e=>{alert("Erro ao copiar: "+e)})}function Pt(){const t=new Date,a={weekday:"long",year:"numeric",month:"long",day:"numeric"};return t.toLocaleDateString("pt-BR",a)}function J(t){const a=Number(t);return!a||Number.isNaN(a)?"N/A":a>=1e12?`$${(a/1e12).toFixed(3)}T`:a>=1e9?`$${(a/1e9).toFixed(2)}B`:a>=1e6?`$${(a/1e6).toFixed(2)}M`:`$${a.toLocaleString("en-US")}`}function at(t){if(!t||t.hasDividend==="Não")return"N/A";const a=Number(t.dividendYield);return Number.isFinite(a)?`${a.toFixed(2)}%`:"N/A"}function l(t){return t?String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;"):""}const Bt=new Set(["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming","D.C."]);function ot(t){if(!t)return"Desconhecido";const a=String(t).split(",").map(o=>o.trim().replace(/\[\d+\]$/,"")),e=a[a.length-1];return!e||e.toLowerCase()==="none"?"Desconhecido":Bt.has(e)?"United States":e}const Ht=12e3;async function He(t,{timeoutMs:a=Ht}={}){const e=new AbortController,o=setTimeout(()=>e.abort(),a);try{return await fetch(t,{signal:e.signal})}finally{clearTimeout(o)}}async function qt(t){try{const a=await He(`${z}/api/historico/${encodeURIComponent(t)}`);if(!a.ok)throw new Error(`Erro ao buscar histórico de ${t}`);return(await a.json()).registros||[]}catch(a){return console.error(`Erro ao buscar histórico de ${t}:`,a),[]}}async function Ft(t){const a=[...new Set((t||[]).map(e=>String(e).toUpperCase()).filter(Boolean))];if(a.length===0)return{};try{const e=await He(`${z}/api/cotacoes?symbols=${encodeURIComponent(a.join(","))}`);if(!e.ok)throw new Error(`HTTP ${e.status}`);return(await e.json()).cotacoes||{}}catch(e){return console.error("Erro ao buscar cotações:",e),{}}}async function Ot(){try{const t=await He(`${z}/api/inteligencia-setorial`);if(!t.ok)throw new Error(`HTTP ${t.status}`);return(await t.json()).dados||null}catch(t){return console.error("Erro ao buscar inteligência setorial:",t),null}}const Yt=15*60*1e3;let Se=null,se=null;const $e=new Map,ie=new Map;function qe(t){var a;return((a=Be.find(e=>e.id===t))==null?void 0:a.name)||t}async function rt(t){const a=await fetch(t);if(!a.ok)throw new Error(`HTTP ${a.status}`);return a.json()}function nt(t){return!!t&&Date.now()-t.ts<Yt}function st({force:t=!1}={}){if(!t&&nt(Se))return Promise.resolve(Se.ids);if(!t&&se)return se;const a=rt(`${z}/api/setores`).then(e=>{const o=Array.isArray(e&&e.setores)?e.setores:[];return Se={ids:o,ts:Date.now()},o});return se=a,a.catch(()=>{}).finally(()=>{se===a&&(se=null)}),a}function it(t,{force:a=!1}={}){const e=String(t);if(!a&&nt($e.get(e)))return Promise.resolve($e.get(e).dados);if(!a&&ie.has(e))return ie.get(e);const o=rt(`${z}/api/setor/${encodeURIComponent(e)}`).then(r=>{const n=r&&r.dados?r.dados:{};return $e.set(e,{dados:n,ts:Date.now()}),n});return ie.set(e,o),o.catch(()=>{}).finally(()=>{ie.get(e)===o&&ie.delete(e)}),o}async function Fe({force:t=!1}={}){const a=await st({force:t}),e=await Promise.allSettled(a.map(o=>it(o,{force:t})));return a.map((o,r)=>{const n=e[r],s=n.status==="fulfilled"?n.value:null;return n.status==="rejected"&&console.error(`Erro ao carregar o setor ${o}:`,n.reason),{id:o,name:qe(o),companies:Array.isArray(s&&s.companies)?s.companies:[],generatedAt:s&&s.generatedAt||null}})}const fe=760,Ae=320,w={top:28,right:28,bottom:44,left:68};function zt(t){if(!t)return"";const[a,e,o]=t.split("-");return`${o}/${e}/${a.slice(2)}`}function Le(t){return Number.isFinite(t)?t>=100?`$${t.toFixed(0)}`:`$${t.toFixed(2)}`:"—"}function jt(t){const a=t.map(h=>h.close),e=Math.min(...a),o=Math.max(...a),r=o-e||1,n=e-r*.08,s=o+r*.08,i=t.length,c=h=>w.left+h/(i-1)*(fe-w.left-w.right),m=h=>w.top+(1-(h-n)/(s-n))*(Ae-w.top-w.bottom);let u=`<svg viewBox="0 0 ${fe} ${Ae}" style="width:100%;height:auto;display:block;background:var(--plot-bg);border-radius:8px">`;const p=5;for(let h=0;h<=p;h++){const H=n+(s-n)*h/p,C=m(H);u+=`<line x1="${w.left}" y1="${C.toFixed(1)}" x2="${fe-w.right}" y2="${C.toFixed(1)}" stroke="var(--chart-axis)" stroke-width="1"/>`,u+=`<text x="${w.left-8}" y="${(C+4).toFixed(1)}" text-anchor="end" font-size="11" fill="var(--chart-label)">${Le(H)}</text>`}const d=[];for(let h=0;h<=4;h++)d.push(Math.round((i-1)*h/4));d.forEach(h=>{const H=c(h);u+=`<text x="${H.toFixed(1)}" y="${Ae-w.bottom+18}" text-anchor="middle" font-size="11" fill="var(--chart-label)">${zt(t[h].data)}</text>`});const g=t.map((h,H)=>`${c(H).toFixed(1)},${m(h.close).toFixed(1)}`).join(" "),k=`${w.left},${m(n).toFixed(1)} `+g+` ${c(i-1).toFixed(1)},${m(n).toFixed(1)}`;u+=`<polygon points="${k}" fill="rgba(0, 212, 255, 0.08)"/>`,u+=`<polyline points="${g}" fill="none" stroke="var(--accent-cyan)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;const T=t[i-1],he=m(T.close);return u+=`<circle cx="${c(i-1).toFixed(1)}" cy="${he.toFixed(1)}" r="4" fill="var(--accent-cyan)"/>`,u+=`<text x="${fe-w.right}" y="${(he-10).toFixed(1)}" text-anchor="end" font-size="12" font-weight="700" fill="var(--chart-text)">${Le(T.close)}</text>`,u+="</svg>",u}async function Ut(t,a){var r;(r=document.querySelector(".modal-overlay"))==null||r.remove();const e=document.createElement("div");e.className="modal-overlay";const o=()=>e.remove();e.addEventListener("click",n=>{n.target===e&&o()}),document.addEventListener("keydown",n=>{n.key==="Escape"&&o()}),e.innerHTML=`
    <div class="modal" role="dialog" aria-label="Histórico de ${l(t)}">
      <div class="modal-header">
        <h2 class="modal-title">
          📈 ${l(t)}
          <span class="modal-subtitle">${l(a||"")}</span>
        </h2>
        <button class="modal-close" aria-label="Fechar">✕</button>
      </div>
      <div class="modal-body" id="price-chart-body">
        <p class="modal-loading">Carregando histórico...</p>
      </div>
    </div>
  `,document.body.appendChild(e),e.querySelector(".modal-close").addEventListener("click",o);try{const n=await qt(t),s=e.querySelector("#price-chart-body");if(!n||n.length===0){s.innerHTML=`<p class="modal-error">Nenhum dado de preço disponível para ${l(t)}.</p>`;return}const i=n[0].close,c=n[n.length-1].close,m=(c-i)/i*100,u=m>=0,p=u?"positive":"negative";s.innerHTML=`
      <div class="price-stats">
        <div class="price-stat">
          <span class="price-stat-label">Último</span>
          <strong>${Le(c)}</strong>
        </div>
        <div class="price-stat">
          <span class="price-stat-label">Variação (2a)</span>
          <strong class="${p}">${u?"+":""}${m.toFixed(2)}%</strong>
        </div>
        <div class="price-stat">
          <span class="price-stat-label">Período</span>
          <strong>${n.length} pregões</strong>
        </div>
      </div>
      ${jt(n)}
    `}catch(n){console.error(`Erro ao buscar histórico de ${t}:`,n);const s=e.querySelector("#price-chart-body");s.innerHTML=`<p class="modal-error">Erro ao carregar o histórico de ${l(t)}. Verifique se o backend está online.</p>`}}function A(t,a){return`
    <div class="company-detail">
      <span class="company-detail-label">${t}</span>
      <strong class="company-detail-value">${a}</strong>
    </div>
  `}function Vt(t){var n;(n=document.querySelector(".modal-overlay"))==null||n.remove();const a=document.createElement("div");a.className="modal-overlay";const e=()=>a.remove();a.addEventListener("click",s=>{s.target===a&&e()}),document.addEventListener("keydown",s=>{s.key==="Escape"&&e()});const o=t.dividendYield!==null&&t.dividendYield!==void 0?`${t.dividendYield.toFixed(2)}%`:"—",r=J(t.marketCap);a.innerHTML=`
    <div class="modal" role="dialog" aria-label="Detalhes de ${l(t.symbol)}">
      <div class="modal-header">
        <h2 class="modal-title">
          💼 ${l(t.symbol)}
          <span class="modal-subtitle">${l(t.name||"")}</span>
        </h2>
        <button class="modal-close" aria-label="Fechar">✕</button>
      </div>
      <div class="modal-body">
        <div class="company-details-grid">
          ${A("Empresa",l(t.name||"N/A"))}
          ${A("Setor",l(t.sectorName||t.sector||"N/A"))}
          ${A("Subindústria",l(t.subIndustry||"N/A"))}
          ${A("Sede",l(t.headquarters||"N/A"))}
          ${A("Market Cap",r)}
          ${A("Classificação",l(t.marketCapClassification||"N/A"))}
          ${A("Div. Yield",o)}
          ${A("Paga dividendos",t.hasDividend?l(t.hasDividend):"—")}
          ${A("Data de inclusão",l(t.dateAdded||"N/A"))}
          ${A("CIK",t.cik?l(String(t.cik)):"N/A")}
          ${A("Fundação",l(t.founded||"N/A"))}
        </div>
        <div class="modal-footer">
          <button class="modal-action" id="details-chart-btn">📈 Ver histórico de preços</button>
        </div>
      </div>
    </div>
  `,document.body.appendChild(a),a.querySelector(".modal-close").addEventListener("click",e),a.querySelector("#details-chart-btn").addEventListener("click",()=>{Ut(t.symbol,t.name)})}function Gt(t,a){const e=t/a*100;return e>=80?"#ff5252":e>=60?"#ff9800":e>=40?"#ffeb3b":e>=20?"#8bc34a":"#4caf50"}async function Wt(){const t=document.getElementById("treemap-view");if(t){t.style.display="flex",t.style.flexDirection="column",t.style.width="100%",t.style.margin="0",t.style.padding="0",t.style.background="var(--bg-primary)",t.innerHTML='<div style="display:flex;align-items:center;justify-content:center;min-height:60vh;width:100%;font-size:14px;color:var(--text-secondary)">Carregando mapa de setores...</div>';try{const e=(await Fe()).map(({id:n,name:s,companies:i})=>{const c=i.reduce((d,g)=>d+(g.marketCap||0),0),m=i.length>0?i.reduce((d,g)=>d+(g.dividendYield||0),0)/i.length:0,u=i.filter(d=>d.hasDividend==="Sim").length,p=i.length>0?i.reduce((d,g)=>(g.marketCap||0)>(d.marketCap||0)?g:d).symbol:"N/A";return{id:n,name:s,cap:(c/1e9).toFixed(1),companies:i.length,avgDiv:parseFloat(m.toFixed(2)),withDiv:u,topCompany:p}}),o=Math.max(...e.map(n=>parseFloat(n.cap)));let r=`
      <div style="
        display: flex;
        flex-direction: column;
        width: 100%;
        padding: clamp(12px, 4vw, 40px);
        box-sizing: border-box;
        gap: clamp(20px, 4vw, 40px);
      ">
        <div>
          <h2 style="
            margin: 0 0 8px 0;
            font-size: 24px;
            color: var(--text-primary);
            font-weight: 600;
          ">🗺️ Mapa de Setores - SP500</h2>
          <p style="
            margin: 0;
            font-size: 13px;
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: 1px;
          ">Clique em qualquer setor para explorar as empresas 👇</p>
        </div>

        <div style="
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr));
          gap: 20px;
          flex: 1;
        ">
    `;e.forEach(n=>{const s=Gt(parseFloat(n.cap),o),i=(parseFloat(n.cap)/o*100).toFixed(1),c=["consumer-staples","communication-services","consumer-discretionary","energy","financials","health-care","industrials","information-technology","materials","real-estate","utilities"].includes(n.id),m=c?new URL(`sector.html?sector=${n.id}`,document.baseURI).href:"#";r+=`
        <div style="
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: clamp(14px, 4vw, 24px);
          transition: all 0.3s ease;
          cursor: ${c?"pointer":"not-allowed"};
          display: flex;
          flex-direction: column;
          gap: 20px;
          opacity: ${c?"1":"0.7"};
        "
        onmouseover="${c?`this.style.borderColor='${s}';this.style.background='rgba(${parseInt(s.slice(1,3),16)},${parseInt(s.slice(3,5),16)},${parseInt(s.slice(5,7),16)},0.05)';this.style.transform='translateY(-4px)';this.style.boxShadow='0 12px 32px ${s}22'`:""}"
        onmouseout="${c?"this.style.borderColor='var(--border)';this.style.background='var(--bg-secondary)';this.style.transform='translateY(0)';this.style.boxShadow='none'":""}"
        onclick="${c?`navigateToSector('${m}', '${n.id}')`:`alert('🔒 O setor \\"${n.name}\\" ainda está em desenvolvimento.\\n\\nApenas Consumer Staples, Communication Services, Consumer Discretionary, Energy, Financials, Health Care, Industrials, Information Technology, Materials, Real Estate e Utilities estão disponíveis por enquanto!')`}"
        >
          <!-- Header com nome e percentual -->
          <div style="
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
          ">
            <div>
              <div style="
                font-size: 16px;
                font-weight: 600;
                color: var(--text-primary);
                margin-bottom: 4px;
              ">${n.name}</div>
              <div style="
                font-size: 12px;
                color: var(--text-secondary);
              ">${n.companies} empresas</div>
            </div>
            <div style="
              background: ${s}22;
              border: 1px solid ${s}44;
              padding: 8px 12px;
              border-radius: 6px;
              font-size: 13px;
              font-weight: 700;
              color: ${s};
              text-align: center;
            ">
              ${i}%
            </div>
          </div>

          <!-- Barra de Progresso -->
          <div>
            <div style="
              width: 100%;
              height: 6px;
              background: rgba(42, 42, 62, 0.5);
              border-radius: 3px;
              overflow: hidden;
            ">
              <div style="
                width: ${i}%;
                height: 100%;
                background: linear-gradient(90deg, ${s}44, ${s});
                transition: width 0.3s ease;
              "></div>
            </div>
          </div>

          <!-- Grid de Métricas -->
          <div style="
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 16px;
          ">
            <div style="
              padding: 16px;
              background: rgba(0, 212, 255, 0.05);
              border: 1px solid rgba(0, 212, 255, 0.1);
              border-radius: 8px;
            ">
              <div style="
                font-size: 11px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                color: var(--text-secondary);
                margin-bottom: 8px;
              ">Market Cap</div>
              <div style="
                font-size: 18px;
                font-weight: 700;
                color: ${s};
              ">$${n.cap}B</div>
            </div>

            <div style="
              padding: 16px;
              background: rgba(0, 212, 255, 0.05);
              border: 1px solid rgba(0, 212, 255, 0.1);
              border-radius: 8px;
            ">
              <div style="
                font-size: 11px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                color: var(--text-secondary);
                margin-bottom: 8px;
              ">Top Company</div>
              <div style="
                font-size: 18px;
                font-weight: 700;
                color: var(--text-primary);
              ">${n.topCompany}</div>
            </div>

            <div style="
              padding: 16px;
              background: rgba(0, 212, 255, 0.05);
              border: 1px solid rgba(0, 212, 255, 0.1);
              border-radius: 8px;
            ">
              <div style="
                font-size: 11px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                color: var(--text-secondary);
                margin-bottom: 8px;
              ">Avg Dividend</div>
              <div style="
                font-size: 18px;
                font-weight: 700;
                color: var(--text-primary);
              ">${n.avgDiv.toFixed(2)}%</div>
            </div>

            <div style="
              padding: 16px;
              background: rgba(0, 212, 255, 0.05);
              border: 1px solid rgba(0, 212, 255, 0.1);
              border-radius: 8px;
            ">
              <div style="
                font-size: 11px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                color: var(--text-secondary);
                margin-bottom: 8px;
              ">Com Dividendo</div>
              <div style="
                font-size: 18px;
                font-weight: 700;
                color: var(--text-primary);
              ">${n.withDiv}/${n.companies}</div>
            </div>
          </div>

          <!-- CTA Button -->
          ${c?`
            <div style="
              padding: 12px;
              background: linear-gradient(90deg, var(--accent-green)44, var(--accent-cyan)44);
              border-radius: 8px;
              text-align: center;
              font-size: 12px;
              font-weight: 600;
              color: var(--accent-cyan);
              text-transform: uppercase;
              letter-spacing: 0.5px;
            ">
              🚀 Ver Empresas (Nova Aba) →
            </div>
          `:`
            <div style="
              padding: 12px;
              background: rgba(42, 42, 62, 0.5);
              border-radius: 8px;
              text-align: center;
              font-size: 12px;
              font-weight: 600;
              color: var(--text-secondary);
              text-transform: uppercase;
              letter-spacing: 0.5px;
            ">
              🔒 Em Desenvolvimento
            </div>
          `}
        </div>
      `}),r+=`
        </div>

        <div style="
          padding: 24px;
          background: rgba(26, 26, 46, 0.5);
          border: 1px solid var(--border);
          border-radius: 12px;
        ">
          <h3 style="
            margin: 0 0 16px 0;
            font-size: 14px;
            color: var(--text-primary);
            text-transform: uppercase;
            letter-spacing: 1px;
          ">📊 Legenda de Cores (Market Cap Relativo)</h3>
          <div style="
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 20px;
            font-size: 12px;
            color: var(--text-secondary);
          ">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 20px; height: 20px; background: #4caf50; border-radius: 4px;"></div>
              <span>Baixo (&lt;20%)</span>
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 20px; height: 20px; background: #8bc34a; border-radius: 4px;"></div>
              <span>Baixo-Médio (20-40%)</span>
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 20px; height: 20px; background: #ffeb3b; border-radius: 4px;"></div>
              <span>Médio (40-60%)</span>
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 20px; height: 20px; background: #ff9800; border-radius: 4px;"></div>
              <span>Alto (60-80%)</span>
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 20px; height: 20px; background: #ff5252; border-radius: 4px;"></div>
              <span>Muito Alto (&gt;80%)</span>
            </div>
          </div>
        </div>
      </div>
    `,t.innerHTML=r}catch(a){console.error("Erro ao carregar treemap:",a),t.innerHTML='<div style="display:flex;align-items:center;justify-content:center;min-height:60vh;color:var(--accent-red)">Erro ao carregar mapa de setores</div>'}}}function Kt(t,a){if(t==="#"){alert(`🔒 O setor "${a}" ainda está em desenvolvimento.

Apenas Consumer Staples, Communication Services, Consumer Discretionary, Energy, Financials, Health Care, Industrials, Information Technology, Materials, Real Estate e Utilities estão disponíveis por enquanto!`);return}window.open(t,"_blank")}window.navigateToSector=Kt;async function _t(){const t=document.getElementById("heatmap-view");if(t){t.style.display="flex",t.style.flexDirection="column",t.style.width="100%",t.style.padding="clamp(12px, 4vw, 40px)",t.style.boxSizing="border-box",t.style.background="var(--bg-primary)",t.innerHTML='<div style="text-align:center;color:var(--text-secondary)">Carregando heatmap...</div>';try{const a=await Fe();let e=`
      <div>
        <h2 style="
          margin: 0 0 8px 0;
          font-size: 24px;
          color: var(--text-primary);
          font-weight: 600;
        ">🔥 Heatmap - Top 4 Empresas por Setor</h2>
        <p style="
          margin: 0 0 40px 0;
          font-size: 13px;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 1px;
        ">Market Cap e Dividend Yield dos líderes de cada setor</p>
      </div>
    `;for(const{id:o,name:r,companies:n}of a){if(n.length===0)continue;const s=[...n].sort((i,c)=>(c.marketCap||0)-(i.marketCap||0)).slice(0,4);e+=`
        <div style="margin-bottom: 40px;">
          <h3 style="
            font-size: 16px;
            margin: 0 0 20px 0;
            color: var(--text-primary);
            font-weight: 600;
          ">${r||o}</h3>

          <div style="
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr));
            gap: 16px;
          ">
      `,s.forEach((i,c)=>{const m=(i.marketCap/1e9).toFixed(2),u=(i.dividendYield||0).toFixed(2);let p="#4caf50";m>500?p="#ff5252":m>200?p="#ff9800":m>100?p="#ffeb3b":m>50&&(p="#8bc34a"),e+=`
          <div style="
            background: linear-gradient(135deg, rgba(0, 212, 255, 0.05) 0%, rgba(0, 230, 118, 0.02) 100%);
            border: 1px solid var(--border);
            border-radius: 8px;
            padding: 16px;
            transition: all 0.3s ease;
          "
          onmouseover="this.style.borderColor='${p}';this.style.background='linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(0, 230, 118, 0.05) 100%)';this.style.transform='translateY(-2px)'"
          onmouseout="this.style.borderColor='var(--border)';this.style.background='linear-gradient(135deg, rgba(0, 212, 255, 0.05) 0%, rgba(0, 230, 118, 0.02) 100%)';this.style.transform='translateY(0)'"
          >
            <div style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 12px;
            ">
              <div style="
                font-size: 14px;
                font-weight: 700;
                color: var(--text-primary);
              ">${i.symbol}</div>
              <div style="
                font-size: 11px;
                background: ${p}22;
                color: ${p};
                padding: 4px 8px;
                border-radius: 4px;
                font-weight: 600;
              ">
                #${c+1}
              </div>
            </div>

            <div style="
              font-size: 12px;
              color: var(--text-secondary);
              margin-bottom: 12px;
              word-break: break-word;
            ">
              ${i.name}
            </div>

            <div style="
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 8px;
            ">
              <div style="
                padding: 8px;
                background: rgba(0, 212, 255, 0.05);
                border: 1px solid rgba(0, 212, 255, 0.1);
                border-radius: 6px;
              ">
                <div style="
                  font-size: 9px;
                  color: var(--text-secondary);
                  text-transform: uppercase;
                  margin-bottom: 4px;
                ">Market Cap</div>
                <div style="
                  font-size: 14px;
                  font-weight: 700;
                  color: ${p};
                ">$${m}B</div>
              </div>

              <div style="
                padding: 8px;
                background: rgba(0, 212, 255, 0.05);
                border: 1px solid rgba(0, 212, 255, 0.1);
                border-radius: 6px;
              ">
                <div style="
                  font-size: 9px;
                  color: var(--text-secondary);
                  text-transform: uppercase;
                  margin-bottom: 4px;
                ">Dividend</div>
                <div style="
                  font-size: 14px;
                  font-weight: 700;
                  color: var(--accent-green);
                ">${u}%</div>
              </div>
            </div>
          </div>
        `}),e+=`
          </div>
        </div>
      `}e+=`
      <div style="
        padding: 20px;
        background: rgba(26, 26, 46, 0.5);
        border: 1px solid var(--border);
        border-radius: 12px;
        margin-top: 40px;
      ">
        <h3 style="
          margin: 0 0 12px 0;
          font-size: 13px;
          color: var(--text-primary);
          text-transform: uppercase;
          letter-spacing: 1px;
        ">💡 Como Ler Este Heatmap:</h3>
        <p style="
          margin: 0;
          font-size: 12px;
          color: var(--text-secondary);
          line-height: 1.8;
        ">
          Este gráfico mostra os 4 maiores líderes por Market Cap em cada setor do SP500.
          <br>As cores indicam o tamanho do Market Cap: <strong style="color: #ff5252;">Vermelho = Muito Grande</strong>,
          <strong style="color: #ff9800;">Laranja = Grande</strong>,
          <strong style="color: #ffeb3b;">Amarelo = Médio</strong>,
          <strong style="color: #8bc34a;">Verde = Pequeno</strong>.
        </p>
      </div>
    `,t.innerHTML=e}catch(a){console.error("Erro ao carregar heatmap:",a),t.innerHTML=`
      <div style="
        text-align: center;
        color: var(--accent-red);
        padding: 40px;
      ">
        ❌ Erro ao carregar heatmap
        <div style="
          font-size: 12px;
          color: var(--text-secondary);
          margin-top: 10px;
        ">${a.message}</div>
      </div>
    `}}}const Jt={Energy:"#FF6B6B",Materials:"#C92A2A",Industrials:"#FFA94D","Consumer Discretionary":"#FFD43B","Consumer Staples":"#A9E34B","Health Care":"#51CF66",Financials:"#40C057","Information Technology":"#339AF0","Communication Services":"#748FFC",Utilities:"#9775FA","Real Estate":"#DA77F2"};function ct(t){return Jt[t]||"#808080"}function Ye(t){if(!t)return 0;if(typeof t=="number")return t;const e=String(t).toUpperCase().trim().replace(/[$€¥₹]/g,"").trim();return e.includes("T")?parseFloat(e.replace("T",""))*1e12:e.includes("B")?parseFloat(e.replace("B",""))*1e9:e.includes("M")?parseFloat(e.replace("M",""))*1e6:parseFloat(e)||0}function Xt(t){if(!t)return 0;if(typeof t=="number")return t;const a=String(t).trim();return parseFloat(a.replace("%",""))||0}const ze=200,Zt=700;function Qt(t){const a=Math.max(Math.floor(Number(t)||0),ze),e=a<Zt,o=e?{top:30,right:16,bottom:78,left:46}:{top:40,right:40,bottom:60,left:60},r=Math.max(a-o.left-o.right,ze),n=e?420:500,s=Math.min(55,Math.max(14,Math.round(r/11)));return{narrow:e,margin:o,width:r,height:n,maxRadius:s,totalWidth:r+o.left+o.right,totalHeight:n+o.top+o.bottom}}let ee=null;function dt(t,a){const e=document.getElementById(a);if(!e){console.error(`❌ Contentor ${a} não encontrado!`);return}e.innerHTML="",ee={companies:t,containerId:a};const o=t.filter(v=>Ye(v.marketCap)>0&&v.sectorName).map((v,b)=>({symbol:v.symbol,name:v.name,sector:v.sectorName,marketCap:Ye(v.marketCap),dividendYield:Xt(v.dividendYield),index:b}));if(o.length===0){e.innerHTML="<p>Sem dados disponíveis para o gráfico de bolhas.</p>";return}const r=document.createElement("div");r.className="bubble-chart-frame",e.appendChild(r);const n=Qt(r.clientWidth||e.clientWidth||window.innerWidth),{margin:s,width:i,height:c,maxRadius:m,narrow:u}=n,p=Math.min(...o.map(v=>v.dividendYield)),d=Math.max(...o.map(v=>v.dividendYield)),g=Math.min(...o.map(v=>v.marketCap)),k=Math.max(...o.map(v=>v.marketCap)),T=v=>c-(v-p)/(d-p||1)*c,he=v=>5+(v-g)/(k-g||1)*(m-5),h=(()=>{let v=42;return()=>(v=(v*9301+49297)%233280,v/233280)})(),H=o.map(()=>h()*i),C=document.createElementNS("http://www.w3.org/2000/svg","svg");C.setAttribute("width",n.totalWidth),C.setAttribute("height",n.totalHeight),C.setAttribute("viewBox",`0 0 ${n.totalWidth} ${n.totalHeight}`),C.setAttribute("role","img"),C.setAttribute("aria-label","Gráfico de bolhas: dividend yield no eixo vertical, tamanho pela capitalização bolsista e cor por setor."),C.style.cssText="display: block; margin: 20px auto; background: var(--plot-bg); border-radius: 8px; max-width: 100%;";const M=document.createElementNS("http://www.w3.org/2000/svg","g");M.setAttribute("transform",`translate(${s.left},${s.top})`);for(let v=0;v<=10;v++){const b=v/10*c,x=p+v/10*(d-p),S=document.createElementNS("http://www.w3.org/2000/svg","line");S.setAttribute("x1",0),S.setAttribute("y1",b),S.setAttribute("x2",i),S.setAttribute("y2",b),S.setAttribute("stroke","var(--chart-axis)"),S.setAttribute("stroke-width","1"),S.setAttribute("stroke-dasharray","4"),M.appendChild(S);const I=document.createElementNS("http://www.w3.org/2000/svg","text");I.setAttribute("x",-10),I.setAttribute("y",b+5),I.setAttribute("text-anchor","end"),I.setAttribute("font-size",u?"10":"12"),I.setAttribute("fill","var(--chart-label)"),I.textContent=x.toFixed(1)+"%",M.appendChild(I)}const j=document.createElementNS("http://www.w3.org/2000/svg","line");j.setAttribute("x1",0),j.setAttribute("y1",0),j.setAttribute("x2",0),j.setAttribute("y2",c),j.setAttribute("stroke","var(--chart-label)"),j.setAttribute("stroke-width","2"),M.appendChild(j);const R=document.createElementNS("http://www.w3.org/2000/svg","text");R.setAttribute("transform","rotate(-90)"),R.setAttribute("y",-s.left+20),R.setAttribute("x",-c/2),R.setAttribute("text-anchor","middle"),R.setAttribute("font-size",u?"12":"14"),R.setAttribute("font-weight","bold"),R.setAttribute("fill","var(--chart-text)"),R.textContent="💵 Dividend Yield (%)",M.appendChild(R);const U=document.createElementNS("http://www.w3.org/2000/svg","line");U.setAttribute("x1",0),U.setAttribute("y1",c),U.setAttribute("x2",i),U.setAttribute("y2",c),U.setAttribute("stroke","var(--chart-label)"),U.setAttribute("stroke-width","2"),M.appendChild(U);const L=document.createElementNS("http://www.w3.org/2000/svg","text");if(L.setAttribute("x",i/2),L.setAttribute("y",c+(u?26:45)),L.setAttribute("text-anchor","middle"),L.setAttribute("font-size",u?"11":"14"),L.setAttribute("font-weight","bold"),L.setAttribute("fill","var(--chart-text)"),u){const v=document.createElementNS("http://www.w3.org/2000/svg","tspan");v.setAttribute("x",i/2),v.setAttribute("dy","0"),v.textContent="📊 Distribuição Aleatória";const b=document.createElementNS("http://www.w3.org/2000/svg","tspan");b.setAttribute("x",i/2),b.setAttribute("dy","16"),b.textContent="(cada bolha = empresa)",L.appendChild(v),L.appendChild(b)}else L.textContent="📊 Distribuição Aleatória (cada bolha = empresa)";M.appendChild(L),o.forEach((v,b)=>{const x=he(v.marketCap),S=Math.min(Math.max(H[b],x),Math.max(i-x,x)),I=Math.min(Math.max(T(v.dividendYield),x),Math.max(c-x,x)),Tt=ct(v.sector),f=document.createElementNS("http://www.w3.org/2000/svg","circle");if(f.setAttribute("cx",S),f.setAttribute("cy",I),f.setAttribute("r",x),f.setAttribute("fill",Tt),f.setAttribute("opacity","0.7"),f.setAttribute("stroke","#fff"),f.setAttribute("stroke-width","2"),f.style.cursor="pointer",f.style.transition="all 0.3s ease",f.addEventListener("mouseover",$=>{f.setAttribute("opacity","1"),f.setAttribute("stroke-width","3"),ta($,v)}),f.addEventListener("mouseout",()=>{f.setAttribute("opacity","0.7"),f.setAttribute("stroke-width","2"),lt()}),M.appendChild(f),x>15){const $=document.createElementNS("http://www.w3.org/2000/svg","text");$.setAttribute("x",S),$.setAttribute("y",I+5),$.setAttribute("text-anchor","middle"),$.setAttribute("font-size",Math.max(10,x/2)),$.setAttribute("font-weight","bold"),$.setAttribute("fill","#fff"),$.setAttribute("pointer-events","none"),$.textContent=v.symbol.substring(0,3),M.appendChild($)}}),C.appendChild(M),r.appendChild(C),ea(e,o)}function ea(t,a){const e=document.createElement("div");e.className="bubble-legend",e.style.cssText=`
    margin: 30px auto;
    width: 100%;
    max-width: 800px;
    padding: 16px;
    background: var(--surface);
    border-radius: 8px;
    border: 1px solid var(--border);
  `;const o=document.createElement("h3");o.textContent="🫧 Como ler o gráfico",o.style.cssText="margin: 0 0 12px 0; color: var(--text-primary);",e.appendChild(o);const r=document.createElement("div");r.style.cssText="margin-bottom: 16px; font-size: 13px; color: var(--text-secondary); line-height: 1.8;",r.innerHTML=`
    <div><strong>Tamanho da bolha:</strong> Market Cap da empresa (quanto maior, mais valiosa)</div>
    <div><strong>Eixo Y (vertical):</strong> Dividend Yield (mais acima = maior dividendo)</div>
    <div><strong>Eixo X (horizontal):</strong> posição aleatória, apenas para facilitar a visualização</div>
    <div><strong>Cor:</strong> setor da empresa</div>
  `,e.appendChild(r);const n=document.createElement("div");n.textContent="Setores",n.style.cssText="font-size: 13px; font-weight: 600; color: var(--text-primary); margin-bottom: 8px;",e.appendChild(n);const s=new Set(a.map(c=>c.sector)),i=document.createElement("div");i.style.cssText="display: flex; flex-wrap: wrap; gap: 12px;",s.forEach(c=>{const m=document.createElement("div");m.style.cssText="display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text-primary);";const u=document.createElement("span");u.style.cssText=`display: inline-block; width: 14px; height: 14px; border-radius: 50%; background: ${ct(c)};`;const p=document.createElement("span");p.textContent=c,m.appendChild(u),m.appendChild(p),i.appendChild(m)}),e.appendChild(i),t.appendChild(e)}let we=null;function ta(t,a){lt();const e=document.createElement("div");e.style.cssText=`
    position: fixed;
    background: var(--bg-secondary);
    color: var(--text-primary);
    border: 1px solid var(--accent-cyan);
    padding: 10px 14px;
    border-radius: 6px;
    font-size: 12px;
    line-height: 1.5;
    pointer-events: none;
    z-index: 10000;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    white-space: nowrap;
  `;const o=a.marketCap>=1e12?(a.marketCap/1e12).toFixed(2)+"T":a.marketCap>=1e9?(a.marketCap/1e9).toFixed(2)+"B":(a.marketCap/1e6).toFixed(2)+"M";e.innerHTML=`
    <strong>${a.symbol}</strong> — ${a.name}<br>
    <strong>Setor:</strong> ${a.sector}<br>
    <strong>Market Cap:</strong> $${o}<br>
    <strong>Dividend Yield:</strong> ${a.dividendYield.toFixed(2)}%
  `;const r=t.target.getBoundingClientRect();e.style.left=r.left+10+"px",e.style.top=r.top-10+"px",document.body.appendChild(e),we=e}function lt(){we&&(we.remove(),we=null)}let je=null;function aa(){if(!ee)return;const t=document.getElementById(ee.containerId);!t||t.offsetParent===null||(clearTimeout(je),je=setTimeout(()=>{ee&&dt(ee.companies,ee.containerId)},150))}typeof window<"u"&&typeof window.addEventListener=="function"&&window.addEventListener("resize",aa);function P(t){const a=Number(t&&t.dividendYield);return Number.isFinite(a)&&a>0?a:0}function ye(t){return(t||[]).filter(a=>P(a)>0)}function oa(t){const a=ye(t);return a.length===0?0:a.reduce((o,r)=>o+P(r),0)/a.length}function ra(t){const a=ye(t).map(P).sort((o,r)=>o-r);if(a.length===0)return 0;const e=Math.floor(a.length/2);return a.length%2===0?(a[e-1]+a[e])/2:a[e]}function na(t){const a=t||[],e=ye(a),o=e.map(P);return{total:a.length,payers:e.length,nonPayers:a.length-e.length,payerRatio:a.length>0?e.length/a.length:0,avgYield:oa(a),medianYield:ra(a),maxYield:o.length>0?Math.max(...o):0}}function sa(t,a=15){return ye(t).slice().sort((e,o)=>P(o)-P(e)||String(e.symbol).localeCompare(String(o.symbol))).slice(0,a)}const ia=[{label:"0–1%",min:0,max:1},{label:"1–2%",min:1,max:2},{label:"2–3%",min:2,max:3},{label:"3–4%",min:3,max:4},{label:"4–5%",min:4,max:5},{label:"5%+",min:5,max:1/0}];function ca(t){const a=ye(t);return ia.map(e=>({label:e.label,count:a.filter(o=>{const r=P(o);return r>=e.min&&r<e.max}).length}))}function da(t){const a=new Map;for(const e of t||[]){const o=e.sectorName||e.sector||"N/A";a.has(o)||a.set(o,{sector:o,total:0,payers:0,yieldSum:0});const r=a.get(o);r.total+=1;const n=P(e);n>0&&(r.payers+=1,r.yieldSum+=n)}return Array.from(a.values()).map(e=>({sector:e.sector,total:e.total,payers:e.payers,avgYield:e.payers>0?e.yieldSum/e.payers:0})).sort((e,o)=>o.avgYield-e.avgYield||e.sector.localeCompare(o.sector))}const ce=t=>`${Number(t).toFixed(2)}%`,Ue=t=>`${(t*100).toFixed(0)}%`;function la(t,a){const e=document.getElementById(a);if(!e){console.error(`❌ Contentor ${a} não encontrado!`);return}const o=t||[];if(o.length===0){e.innerHTML='<div class="treemap-container"><p>Sem dados disponíveis para o painel de dividendos.</p></div>';return}const r=na(o),n=sa(o),s=ca(o),i=da(o),c=Math.max(1,...s.map(d=>d.count)),m=n.map((d,g)=>`
      <tr class="dividend-row" data-dividend-symbol="${l(d.symbol)}" data-dividend-name="${l(d.name||d.symbol)}">
        <td class="col-index">${g+1}</td>
        <td><strong>${l(d.symbol)}</strong></td>
        <td>${l(d.name||"N/A")}</td>
        <td>${l(d.sectorName||d.sector||"N/A")}</td>
        <td class="dividend-yield">${ce(P(d))}</td>
      </tr>`).join(""),u=s.map(d=>`
      <div class="dividend-bucket">
        <span class="dividend-bucket-label">${d.label}</span>
        <div class="dividend-bucket-track">
          <div class="dividend-bucket-fill" style="width: ${d.count/c*100}%"></div>
        </div>
        <span class="dividend-bucket-count">${d.count}</span>
      </div>`).join(""),p=i.map(d=>`
      <tr>
        <td>${l(d.sector)}</td>
        <td class="col-index">${d.payers} / ${d.total}</td>
        <td class="dividend-yield">${ce(d.avgYield)}</td>
      </tr>`).join("");e.innerHTML=`
    <div class="dividends-view">
      <header class="treemap-header">
        <h2>💰 Dividendos</h2>
        <p class="subtitle">
          Renda por dividendos no S&amp;P 500 — ${r.payers} de ${r.total} empresas
          pagam dividendos (${Ue(r.payerRatio)}).
        </p>
      </header>

      <div class="treemap-stats">
        <div class="stat-card">
          <span class="stat-label">Empresas</span>
          <span class="stat-value">${r.total}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Pagadoras</span>
          <span class="stat-value">${r.payers} (${Ue(r.payerRatio)})</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Yield médio</span>
          <span class="stat-value">${ce(r.avgYield)}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Yield mediano</span>
          <span class="stat-value">${ce(r.medianYield)}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Maior yield</span>
          <span class="stat-value">${ce(r.maxYield)}</span>
        </div>
      </div>

      <div class="dividend-columns">
        <section class="dividend-panel">
          <h3>🏆 Top por Dividend Yield</h3>
          <table class="dividend-table">
            <thead>
              <tr><th>#</th><th>Símbolo</th><th>Empresa</th><th>Setor</th><th>Yield</th></tr>
            </thead>
            <tbody>${m}</tbody>
          </table>
        </section>

        <section class="dividend-panel">
          <h3>📊 Distribuição por faixa</h3>
          <div class="dividend-buckets">${u}</div>
          <p class="dividend-note">Considera apenas as ${r.payers} empresas pagadoras.</p>
        </section>
      </div>

      <section class="dividend-panel">
        <h3>🏭 Yield médio por setor</h3>
        <table class="dividend-table">
          <thead>
            <tr><th>Setor</th><th>Pagadoras</th><th>Yield médio</th></tr>
          </thead>
          <tbody>${p}</tbody>
        </table>
      </section>
    </div>
  `,e.querySelectorAll(".dividend-row").forEach(d=>{d.addEventListener("click",()=>{typeof window.openCompanyDetails=="function"&&window.openCompanyDetails({symbol:d.dataset.dividendSymbol,name:d.dataset.dividendName})})})}const X=[{company:"3M",ticker:"MMM",sector:"Industrials"},{company:"American Express",ticker:"AXP",sector:"Financials"},{company:"Amgen",ticker:"AMGN",sector:"Health Care"},{company:"Apple",ticker:"AAPL",sector:"Information Technology"},{company:"Boeing",ticker:"BA",sector:"Industrials"},{company:"Caterpillar",ticker:"CAT",sector:"Industrials"},{company:"Chevron",ticker:"CVX",sector:"Energy"},{company:"Cisco Systems",ticker:"CSCO",sector:"Information Technology"},{company:"Coca-Cola",ticker:"KO",sector:"Consumer Staples"},{company:"Dow Inc.",ticker:"DOW",sector:"Materials"},{company:"Goldman Sachs",ticker:"GS",sector:"Financials"},{company:"Home Depot",ticker:"HD",sector:"Consumer Discretionary"},{company:"Honeywell",ticker:"HON",sector:"Industrials"},{company:"IBM",ticker:"IBM",sector:"Information Technology"},{company:"Intel",ticker:"INTC",sector:"Information Technology"},{company:"Johnson & Johnson",ticker:"JNJ",sector:"Health Care"},{company:"JPMorgan Chase",ticker:"JPM",sector:"Financials"},{company:"McDonald's",ticker:"MCD",sector:"Consumer Discretionary"},{company:"Merck",ticker:"MRK",sector:"Health Care"},{company:"Microsoft",ticker:"MSFT",sector:"Information Technology"},{company:"Nike",ticker:"NKE",sector:"Consumer Discretionary"},{company:"Procter & Gamble",ticker:"PG",sector:"Consumer Staples"},{company:"Salesforce",ticker:"CRM",sector:"Information Technology"},{company:"The Travelers Companies",ticker:"TRV",sector:"Financials"},{company:"UnitedHealth Group",ticker:"UNH",sector:"Health Care"},{company:"Verizon",ticker:"VZ",sector:"Communication Services"},{company:"Visa",ticker:"V",sector:"Financials"},{company:"Walgreens Boots Alliance",ticker:"WBA",sector:"Consumer Staples"},{company:"Walt Disney",ticker:"DIS",sector:"Communication Services"},{company:"Nvidia",ticker:"NVDA",sector:"Information Technology"}],pa={"Communication Services":"#00d4ff","Consumer Discretionary":"#ffab00","Consumer Staples":"#00e676",Energy:"#ff5252",Financials:"#ba68c8","Health Care":"#29b6f6",Industrials:"#ffa726","Information Technology":"#00d4ff",Materials:"#66bb6a","Real Estate":"#ec407a",Utilities:"#42a5f5"};function ua(t){return String(t||"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")}function ma(t){return pa[t]||"#00d4ff"}function pt(t){return`dow-sector--${ua(t)}`}function ga(t,{search:a="",sector:e=""}={}){const o=String(a).toLowerCase().trim();return(t||[]).filter(r=>{const n=!o||String(r.company).toLowerCase().includes(o)||String(r.ticker).toLowerCase().includes(o),s=!e||r.sector===e;return n&&s})}function va(t,a="company"){return[...t||[]].sort((e,o)=>{switch(a){case"ticker":return e.ticker.localeCompare(o.ticker);case"sector":return e.sector.localeCompare(o.sector)||e.company.localeCompare(o.company);default:return e.company.localeCompare(o.company)}})}function Ve(t){return[...new Set((t||[]).map(a=>a.sector))].sort()}function ya(t){const a=new Map;return(t||[]).forEach(e=>{a.has(e.sector)||a.set(e.sector,[]),a.get(e.sector).push(e.company)}),[...a.entries()].map(([e,o])=>({sector:e,companies:o,count:o.length})).sort((e,o)=>o.count-e.count||e.sector.localeCompare(o.sector))}function ha(t){return(t||[]).filter(a=>a.sector==="Information Technology").length}function fa(t){return`<div class="dow-cards">${(t||[]).map(e=>`
      <article class="dow-card">
        <div class="dow-card-head">
          <h3>${l(e.company)}</h3>
          <span class="dow-ticker">${l(e.ticker)}</span>
        </div>
        <span class="dow-sector ${pt(e.sector)}">${l(e.sector)}</span>
      </article>`).join("")}</div>`}function ba(t){return`
    <div class="dow-table-wrapper">
      <table class="dow-table">
        <thead>
          <tr>
            <th data-sort="company">Empresa</th>
            <th data-sort="ticker">Ticker</th>
            <th data-sort="sector">Setor</th>
          </tr>
        </thead>
        <tbody>${(t||[]).map(e=>`
      <tr>
        <td><strong>${l(e.company)}</strong></td>
        <td><span class="dow-ticker">${l(e.ticker)}</span></td>
        <td><span class="dow-sector ${pt(e.sector)}">${l(e.sector)}</span></td>
      </tr>`).join("")}</tbody>
      </table>
    </div>`}function ka(t="dow-jones-view"){const a=document.getElementById(t);if(!a){console.error(`❌ Contentor ${t} não encontrado!`);return}const e={search:"",sector:"",sortBy:"company",view:"cards"},o=Ve(X).length,r=Ve(X).map(d=>`<option value="${l(d)}">${l(d)}</option>`).join(""),n=ya(X).map(d=>`
      <div class="dow-breakdown-item">
        <div class="dow-breakdown-head" style="color: ${ma(d.sector)}">
          <span>${l(d.sector)}</span>
          <span class="dow-breakdown-count">${d.count}</span>
        </div>
        <p class="dow-breakdown-list">${d.companies.map(g=>l(g)).join(", ")}</p>
      </div>`).join("");a.innerHTML=`
    <div class="dow-jones-view">
      <header class="dow-header">
        <div class="dow-header-content">
          <h2>Dow Jones 30</h2>
          <p>📈 30 maiores empresas - índice blue chip dos EUA</p>
        </div>
        <div class="dow-stats">
          <div class="dow-stat">
            <span class="dow-stat-value">${X.length}</span>
            <span class="dow-stat-label">Empresas</span>
          </div>
          <div class="dow-stat">
            <span class="dow-stat-value">${o}</span>
            <span class="dow-stat-label">Setores</span>
          </div>
          <div class="dow-stat">
            <span class="dow-stat-value">${ha(X)}</span>
            <span class="dow-stat-label">Tech</span>
          </div>
        </div>
      </header>

      <div class="dow-filters">
        <div class="dow-filter">
          <label for="dow-search">Buscar</label>
          <input type="text" id="dow-search" placeholder="Empresa ou ticker..." />
        </div>
        <div class="dow-filter">
          <label for="dow-sector">Setor</label>
          <select id="dow-sector">
            <option value="">Todos os Setores</option>
            ${r}
          </select>
        </div>
        <div class="dow-filter">
          <label for="dow-sort">Ordenar por</label>
          <select id="dow-sort">
            <option value="company">Empresa (A-Z)</option>
            <option value="ticker">Ticker (A-Z)</option>
            <option value="sector">Setor (A-Z)</option>
          </select>
        </div>
      </div>

      <div class="dow-view-toggle" role="tablist">
        <button class="dow-view-btn active" data-view="cards" type="button">Cartões</button>
        <button class="dow-view-btn" data-view="table" type="button">Tabela</button>
      </div>

      <div id="dow-results" class="dow-results"></div>

      <section class="dow-breakdown">
        <h3>Distribuição por setor</h3>
        <div class="dow-breakdown-grid">${n}</div>
      </section>

      <aside class="dow-info">
        <strong>💡 Sobre o Dow Jones Industrial Average (DJIA):</strong> um dos índices de ações
        mais antigos e respeitados do mundo, composto por 30 grandes empresas americanas. É
        frequentemente usado como indicador da saúde da economia dos EUA. As suas empresas são
        consideradas "blue chips" e o índice é ponderado por preço.
      </aside>
    </div>
  `;const s=a.querySelector("#dow-results"),i=a.querySelector("#dow-search"),c=a.querySelector("#dow-sector"),m=a.querySelector("#dow-sort"),u=a.querySelectorAll(".dow-view-btn");function p(){const d=va(ga(X,{search:e.search,sector:e.sector}),e.sortBy);if(d.length===0){s.innerHTML='<p class="dow-empty">Nenhuma empresa encontrada.</p>';return}s.innerHTML=e.view==="table"?ba(d):fa(d),e.view==="table"&&s.querySelectorAll("th[data-sort]").forEach(g=>{g.addEventListener("click",()=>{e.sortBy=g.dataset.sort,m&&(m.value=e.sortBy),p()})})}i&&i.addEventListener("input",()=>{e.search=i.value,p()}),c&&c.addEventListener("change",()=>{e.sector=c.value,p()}),m&&m.addEventListener("change",()=>{e.sortBy=m.value,p()}),u.forEach(d=>{d.addEventListener("click",()=>{e.view=d.dataset.view,u.forEach(g=>g.classList.toggle("active",g===d)),p()})}),p()}const de=[{company:"American States Water",ticker:"AWR",sector:"Utilities"},{company:"California Water Service",ticker:"CWT",sector:"Utilities"},{company:"Northwest Natural",ticker:"NWN",sector:"Utilities"},{company:"Procter & Gamble",ticker:"PG",sector:"Consumer Defensive"},{company:"Coca-Cola",ticker:"KO",sector:"Consumer Defensive"},{company:"Johnson & Johnson",ticker:"JNJ",sector:"Healthcare"},{company:"Colgate-Palmolive",ticker:"CL",sector:"Consumer Defensive"},{company:"Genuine Parts",ticker:"GPC",sector:"Consumer Cyclical"},{company:"Emerson Electric",ticker:"EMR",sector:"Industrials"},{company:"Dover",ticker:"DOV",sector:"Industrials"},{company:"Lowe's",ticker:"LOW",sector:"Consumer Cyclical"},{company:"Federal Realty",ticker:"FRT",sector:"Real Estate"},{company:"ABM Industries",ticker:"ABM",sector:"Industrials"},{company:"Stepan",ticker:"SCL",sector:"Basic Materials"},{company:"H.B. Fuller",ticker:"FUL",sector:"Basic Materials"},{company:"Universal Corp",ticker:"UVV",sector:"Consumer Defensive"},{company:"Hormel Foods",ticker:"HRL",sector:"Consumer Defensive"},{company:"Kimberly-Clark",ticker:"KMB",sector:"Consumer Defensive"},{company:"Middlesex Water",ticker:"MSEX",sector:"Utilities"},{company:"MSA Safety",ticker:"MSA",sector:"Industrials"},{company:"PPG Industries",ticker:"PPG",sector:"Basic Materials"},{company:"RPM International",ticker:"RPM",sector:"Basic Materials"},{company:"Black Hills",ticker:"BKH",sector:"Utilities"},{company:"National Fuel Gas",ticker:"NFG",sector:"Energy"},{company:"PepsiCo",ticker:"PEP",sector:"Consumer Defensive"},{company:"Altria",ticker:"MO",sector:"Consumer Defensive"},{company:"Stanley Black & Decker",ticker:"SWK",sector:"Industrials"},{company:"Target",ticker:"TGT",sector:"Consumer Cyclical"},{company:"Sysco",ticker:"SYY",sector:"Consumer Defensive"},{company:"Cincinnati Financial",ticker:"CINF",sector:"Financials"},{company:"Tootsie Roll",ticker:"TR",sector:"Consumer Defensive"},{company:"Gorman-Rupp",ticker:"GRC",sector:"Industrials"},{company:"Pentair",ticker:"PNR",sector:"Industrials"},{company:"H2O America",ticker:"HTO",sector:"Utilities"},{company:"MGE Energy",ticker:"MGEE",sector:"Utilities"},{company:"RLI Corp",ticker:"RLI",sector:"Financials"},{company:"S&P Global",ticker:"SPGI",sector:"Financials"},{company:"Automatic Data Processing",ticker:"ADP",sector:"Industrials"}],Ca={"Basic Materials":"#66bb6a","Consumer Cyclical":"#ffab00","Consumer Defensive":"#00e676",Energy:"#ff5252",Financials:"#ba68c8",Healthcare:"#29b6f6",Industrials:"#ffa726","Real Estate":"#ec407a",Utilities:"#42a5f5"};function wa(t){return String(t||"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")}function xa(t){return Ca[t]||"#00e676"}function ut(t){return`dk-sector--${wa(t)}`}function Sa(t,{search:a="",sector:e=""}={}){const o=String(a).toLowerCase().trim();return(t||[]).filter(r=>{const n=!o||String(r.company).toLowerCase().includes(o)||String(r.ticker).toLowerCase().includes(o),s=!e||r.sector===e;return n&&s})}function $a(t,a="company"){return[...t||[]].sort((e,o)=>{switch(a){case"ticker":return e.ticker.localeCompare(o.ticker);case"sector":return e.sector.localeCompare(o.sector)||e.company.localeCompare(o.company);default:return e.company.localeCompare(o.company)}})}function Ge(t){return[...new Set((t||[]).map(a=>a.sector))].sort()}function Aa(t){const a=new Map;return(t||[]).forEach(e=>{a.has(e.sector)||a.set(e.sector,[]),a.get(e.sector).push(e.company)}),[...a.entries()].map(([e,o])=>({sector:e,companies:o,count:o.length})).sort((e,o)=>o.count-e.count||e.sector.localeCompare(o.sector))}function Ea(t){return`<div class="dk-cards">${(t||[]).map(e=>`
      <article class="dk-card">
        <div class="dk-card-head">
          <h3>${l(e.company)}</h3>
          <span class="dk-ticker">${l(e.ticker)}</span>
        </div>
        <span class="dk-sector ${ut(e.sector)}">${l(e.sector)}</span>
        <div class="dk-badge">👑 50+ Anos de Dividendos</div>
      </article>`).join("")}</div>`}function Ta(t){return`
    <div class="dk-table-wrapper">
      <table class="dk-table">
        <thead>
          <tr>
            <th data-sort="company">Empresa</th>
            <th data-sort="ticker">Ticker</th>
            <th data-sort="sector">Setor</th>
          </tr>
        </thead>
        <tbody>${(t||[]).map(e=>`
      <tr>
        <td><strong>${l(e.company)}</strong></td>
        <td><span class="dk-ticker">${l(e.ticker)}</span></td>
        <td><span class="dk-sector ${ut(e.sector)}">${l(e.sector)}</span></td>
      </tr>`).join("")}</tbody>
      </table>
    </div>`}function Ma(t="dividend-kings-view"){const a=document.getElementById(t);if(!a){console.error(`❌ Contentor ${t} não encontrado!`);return}const e={search:"",sector:"",sortBy:"company",view:"cards"},o=Ge(de).length,r=Ge(de).map(p=>`<option value="${l(p)}">${l(p)}</option>`).join(""),n=Aa(de).map(p=>`
      <div class="dk-breakdown-item">
        <div class="dk-breakdown-head" style="color: ${xa(p.sector)}">
          <span>${l(p.sector)}</span>
          <span class="dk-breakdown-count">${p.count}</span>
        </div>
        <p class="dk-breakdown-list">${p.companies.map(d=>l(d)).join(", ")}</p>
      </div>`).join("");a.innerHTML=`
    <div class="dividend-kings-view">
      <header class="dk-header">
        <div class="dk-header-content">
          <h2>Dividend Kings</h2>
          <p>👑 50+ anos de aumento ininterrupto de dividendos</p>
        </div>
        <div class="dk-stats">
          <div class="dk-stat">
            <span class="dk-stat-value">${de.length}</span>
            <span class="dk-stat-label">Empresas</span>
          </div>
          <div class="dk-stat">
            <span class="dk-stat-value">${o}</span>
            <span class="dk-stat-label">Setores</span>
          </div>
          <div class="dk-stat">
            <span class="dk-stat-value">50+</span>
            <span class="dk-stat-label">Anos de Dividendos</span>
          </div>
        </div>
      </header>

      <div class="dk-filters">
        <div class="dk-filter">
          <label for="dk-search">Buscar</label>
          <input type="text" id="dk-search" placeholder="Empresa ou ticker..." />
        </div>
        <div class="dk-filter">
          <label for="dk-sector">Setor</label>
          <select id="dk-sector">
            <option value="">Todos os Setores</option>
            ${r}
          </select>
        </div>
        <div class="dk-filter">
          <label for="dk-sort">Ordenar por</label>
          <select id="dk-sort">
            <option value="company">Empresa (A-Z)</option>
            <option value="ticker">Ticker (A-Z)</option>
            <option value="sector">Setor (A-Z)</option>
          </select>
        </div>
      </div>

      <div class="dk-view-toggle" role="tablist">
        <button class="dk-view-btn active" data-view="cards" type="button">Cartões</button>
        <button class="dk-view-btn" data-view="table" type="button">Tabela</button>
      </div>

      <div id="dk-results" class="dk-results"></div>

      <section class="dk-breakdown">
        <h3>Distribuição por setor</h3>
        <div class="dk-breakdown-grid">${n}</div>
      </section>

      <aside class="dk-info">
        <strong>💡 O que são Dividend Kings?</strong> são empresas que aumentaram
        ininterruptamente os seus dividendos por mais de 50 anos consecutivos. Estão entre as
        empresas mais estáveis e rentáveis do mercado, com modelos de negócio sólidos e geração de
        caixa consistente — ideais para investidores que procuram renda passiva fiável e crescimento
        a longo prazo.
      </aside>
    </div>
  `;const s=a.querySelector("#dk-results"),i=a.querySelector("#dk-search"),c=a.querySelector("#dk-sector"),m=a.querySelector("#dk-sort"),u=()=>{const p=$a(Sa(de,{search:e.search,sector:e.sector}),e.sortBy);if(p.length===0){s.innerHTML='<p class="dk-empty">Nenhuma empresa encontrada.</p>';return}if(e.view==="cards"){s.innerHTML=Ea(p);return}s.innerHTML=Ta(p),s.querySelectorAll(".dk-table th[data-sort]").forEach(d=>{d.addEventListener("click",()=>{e.sortBy=d.getAttribute("data-sort"),m&&(m.value=e.sortBy),u()})})};i&&i.addEventListener("input",()=>{e.search=i.value,u()}),c&&c.addEventListener("change",()=>{e.sector=c.value,u()}),m&&m.addEventListener("change",()=>{e.sortBy=m.value,u()}),a.querySelectorAll(".dk-view-btn").forEach(p=>{p.addEventListener("click",()=>{e.view=p.getAttribute("data-view"),a.querySelectorAll(".dk-view-btn").forEach(d=>d.classList.remove("active")),p.classList.add("active"),u()})}),u()}const Z=[{company:"AbbVie",ticker:"ABBV",sector:"Health Care",years:53},{company:"Abbott Laboratories",ticker:"ABT",sector:"Health Care",years:53},{company:"Archer-Daniels-Midland",ticker:"ADM",sector:"Consumer Staples",years:50},{company:"Automatic Data Processing",ticker:"ADP",sector:"Information Technology",years:50},{company:"Aflac",ticker:"AFL",sector:"Financials",years:44},{company:"Albemarle",ticker:"ALB",sector:"Materials",years:31},{company:"Amcor",ticker:"AMCR",sector:"Materials",years:30},{company:"A.O. Smith",ticker:"AOS",sector:"Industrials",years:32},{company:"Air Products & Chemicals",ticker:"APD",sector:"Materials",years:43},{company:"Atmos Energy",ticker:"ATO",sector:"Utilities",years:42},{company:"Becton Dickinson",ticker:"BDX",sector:"Health Care",years:54},{company:"Franklin Resources",ticker:"BEN",sector:"Financials",years:46},{company:"Brown-Forman",ticker:"BF.B",sector:"Consumer Staples",years:41},{company:"Brown & Brown",ticker:"BRO",sector:"Financials",years:32},{company:"Cardinal Health",ticker:"CAH",sector:"Health Care",years:29},{company:"Caterpillar",ticker:"CAT",sector:"Industrials",years:32},{company:"Chubb",ticker:"CB",sector:"Financials",years:32},{company:"Church & Dwight",ticker:"CHD",sector:"Consumer Staples",years:29},{company:"C.H. Robinson",ticker:"CHRW",sector:"Industrials",years:28},{company:"Cincinnati Financial",ticker:"CINF",sector:"Financials",years:65},{company:"Colgate-Palmolive",ticker:"CL",sector:"Consumer Staples",years:62},{company:"Clorox",ticker:"CLX",sector:"Consumer Staples",years:48},{company:"Cintas",ticker:"CTAS",sector:"Industrials",years:43},{company:"Chevron",ticker:"CVX",sector:"Energy",years:38},{company:"Dover",ticker:"DOV",sector:"Industrials",years:70},{company:"Ecolab",ticker:"ECL",sector:"Materials",years:34},{company:"Consolidated Edison",ticker:"ED",sector:"Utilities",years:51},{company:"Emerson Electric",ticker:"EMR",sector:"Industrials",years:69},{company:"Erie Indemnity",ticker:"ERIE",sector:"Financials",years:36},{company:"Eversource Energy",ticker:"ES",sector:"Utilities",years:27},{company:"Essex Property Trust",ticker:"ESS",sector:"Real Estate",years:31},{company:"Expeditors International",ticker:"EXPD",sector:"Industrials",years:29},{company:"Fastenal",ticker:"FAST",sector:"Industrials",years:25},{company:"FactSet Research Systems",ticker:"FDS",sector:"Financials",years:25},{company:"Federal Realty",ticker:"FRT",sector:"Real Estate",years:50},{company:"Genuine Parts",ticker:"GPC",sector:"Consumer Discretionary",years:50},{company:"Grainger",ticker:"GWW",sector:"Industrials",years:40},{company:"Hasbro",ticker:"HAS",sector:"Consumer Discretionary",years:25},{company:"Hormel Foods",ticker:"HRL",sector:"Consumer Staples",years:57},{company:"IBM",ticker:"IBM",sector:"Information Technology",years:29},{company:"Johnson & Johnson",ticker:"JNJ",sector:"Health Care",years:62},{company:"Kimberly-Clark",ticker:"KMB",sector:"Consumer Staples",years:53},{company:"Coca-Cola",ticker:"KO",sector:"Consumer Staples",years:62},{company:"Leggett & Platt",ticker:"LEG",sector:"Consumer Discretionary",years:52},{company:"Linde",ticker:"LIN",sector:"Materials",years:29},{company:"Lowe's",ticker:"LOW",sector:"Consumer Discretionary",years:50},{company:"McDonald's",ticker:"MCD",sector:"Consumer Discretionary",years:47},{company:"Medtronic",ticker:"MDT",sector:"Health Care",years:47},{company:"McCormick",ticker:"MKC",sector:"Consumer Staples",years:37},{company:"3M",ticker:"MMM",sector:"Industrials",years:64},{company:"Nordson",ticker:"NDSN",sector:"Industrials",years:60},{company:"National Fuel Gas",ticker:"NFG",sector:"Energy",years:52},{company:"Nucor",ticker:"NUE",sector:"Materials",years:50},{company:"Realty Income",ticker:"O",sector:"Real Estate",years:30},{company:"PepsiCo",ticker:"PEP",sector:"Consumer Staples",years:51},{company:"Procter & Gamble",ticker:"PG",sector:"Consumer Staples",years:67},{company:"Pentair",ticker:"PNR",sector:"Industrials",years:47},{company:"PPG Industries",ticker:"PPG",sector:"Materials",years:52},{company:"Roper Technologies",ticker:"ROP",sector:"Industrials",years:30},{company:"Republic Services",ticker:"RSG",sector:"Industrials",years:25},{company:"Sherwin-Williams",ticker:"SHW",sector:"Materials",years:45},{company:"Smucker",ticker:"SJM",sector:"Consumer Staples",years:28},{company:"S&P Global",ticker:"SPGI",sector:"Financials",years:50},{company:"Stanley Black & Decker",ticker:"SWK",sector:"Industrials",years:55},{company:"Sysco",ticker:"SYY",sector:"Consumer Staples",years:53},{company:"T. Rowe Price",ticker:"TROW",sector:"Financials",years:36},{company:"VF Corp",ticker:"VFC",sector:"Consumer Discretionary",years:50},{company:"Walgreens Boots Alliance",ticker:"WBA",sector:"Consumer Staples",years:47},{company:"Walmart",ticker:"WMT",sector:"Consumer Staples",years:50},{company:"West Pharmaceutical Services",ticker:"WST",sector:"Health Care",years:30},{company:"Exxon Mobil",ticker:"XOM",sector:"Energy",years:42}],La={"Consumer Staples":"#00e676","Communication Services":"#00d4ff","Consumer Discretionary":"#ffab00",Energy:"#ff5252",Financials:"#ba68c8","Health Care":"#29b6f6",Industrials:"#ffa726","Information Technology":"#00d4ff",Materials:"#66bb6a","Real Estate":"#ec407a",Utilities:"#42a5f5"};function Ia(t){return String(t||"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")}function Da(t){return La[t]||"#ffc107"}function mt(t){return`da-sector--${Ia(t)}`}function Ra(t){return(t||[]).reduce((a,e)=>Math.max(a,Number(e.years)||0),0)}function Na(t,{search:a="",sector:e="",minYears:o=0}={}){const r=String(a).toLowerCase().trim(),n=Number(o)||0;return(t||[]).filter(s=>{const i=!r||String(s.company).toLowerCase().includes(r)||String(s.ticker).toLowerCase().includes(r),c=!e||s.sector===e,m=(Number(s.years)||0)>=n;return i&&c&&m})}function Pa(t,a="years"){return[...t||[]].sort((e,o)=>{switch(a){case"company":return e.company.localeCompare(o.company);case"ticker":return e.ticker.localeCompare(o.ticker);case"sector":return e.sector.localeCompare(o.sector)||e.company.localeCompare(o.company);case"years":return(o.years||0)-(e.years||0)||e.company.localeCompare(o.company);default:return 0}})}function We(t){return[...new Set((t||[]).map(a=>a.sector))].sort()}function Ba(t){const a=new Map;return(t||[]).forEach(e=>{a.has(e.sector)||a.set(e.sector,[]),a.get(e.sector).push(e.company)}),[...a.entries()].map(([e,o])=>({sector:e,companies:o,count:o.length})).sort((e,o)=>o.count-e.count||e.sector.localeCompare(o.sector))}function Ha(t){return`<div class="da-cards">${(t||[]).map(e=>`
      <article class="da-card">
        <div class="da-card-head">
          <h3>${l(e.company)}</h3>
          <span class="da-ticker">${l(e.ticker)}</span>
        </div>
        <span class="da-sector ${mt(e.sector)}">${l(e.sector)}</span>
        <div class="da-years">🏆 ${l(String(e.years))} Anos de Aumento</div>
      </article>`).join("")}</div>`}function qa(t){return`
    <div class="da-table-wrapper">
      <table class="da-table">
        <thead>
          <tr>
            <th data-sort="company">Empresa</th>
            <th data-sort="ticker">Ticker</th>
            <th data-sort="sector">Setor</th>
            <th data-sort="years">Anos de Aumento</th>
          </tr>
        </thead>
        <tbody>${(t||[]).map(e=>`
      <tr>
        <td><strong>${l(e.company)}</strong></td>
        <td><span class="da-ticker">${l(e.ticker)}</span></td>
        <td><span class="da-sector ${mt(e.sector)}">${l(e.sector)}</span></td>
        <td><strong class="da-years-value">${l(String(e.years))}</strong></td>
      </tr>`).join("")}</tbody>
      </table>
    </div>`}function Fa(t="dividend-aristocrats-view"){const a=document.getElementById(t);if(!a){console.error("❌ dividend-aristocrats-view não encontrado!");return}const e={search:"",sector:"",minYears:0,sortBy:"years",view:"cards"},o=We(Z).length,r=We(Z).map(d=>`<option value="${l(d)}">${l(d)}</option>`).join(""),n=Ba(Z).map(d=>`
      <div class="da-breakdown-item">
        <div class="da-breakdown-head" style="color: ${Da(d.sector)}">
          <span>${l(d.sector)}</span>
          <span class="da-breakdown-count">${d.count}</span>
        </div>
        <p class="da-breakdown-list">${d.companies.map(g=>l(g)).join(", ")}</p>
      </div>`).join("");a.innerHTML=`
    <div class="dividend-aristocrats-view">
      <header class="da-header">
        <div class="da-header-content">
          <h2>Dividend Aristocrats</h2>
          <p>🏆 Empresas do S&amp;P 500 com 25+ anos de aumento de dividendos</p>
        </div>
        <div class="da-stats">
          <div class="da-stat">
            <span class="da-stat-value">${Z.length}</span>
            <span class="da-stat-label">Empresas</span>
          </div>
          <div class="da-stat">
            <span class="da-stat-value">${o}</span>
            <span class="da-stat-label">Setores</span>
          </div>
          <div class="da-stat">
            <span class="da-stat-value">${Ra(Z)}</span>
            <span class="da-stat-label">Maior Sequência (anos)</span>
          </div>
        </div>
      </header>

      <div class="da-filters">
        <div class="da-filter">
          <label for="da-search">Buscar</label>
          <input type="text" id="da-search" placeholder="Empresa ou ticker..." />
        </div>
        <div class="da-filter">
          <label for="da-sector">Setor</label>
          <select id="da-sector">
            <option value="">Todos os Setores</option>
            ${r}
          </select>
        </div>
        <div class="da-filter">
          <label for="da-min-years">Mínimo de Anos</label>
          <input type="number" id="da-min-years" placeholder="Ex: 50" min="0" step="1" />
        </div>
        <div class="da-filter">
          <label for="da-sort">Ordenar por</label>
          <select id="da-sort">
            <option value="years">Anos de Aumento (maior)</option>
            <option value="company">Empresa (A-Z)</option>
            <option value="ticker">Ticker (A-Z)</option>
            <option value="sector">Setor (A-Z)</option>
          </select>
        </div>
      </div>

      <div class="da-view-toggle" role="tablist">
        <button class="da-view-btn active" data-view="cards" type="button">Cartões</button>
        <button class="da-view-btn" data-view="table" type="button">Tabela</button>
      </div>

      <div id="da-results" class="da-results"></div>

      <section class="da-breakdown">
        <h3>Distribuição por setor</h3>
        <div class="da-breakdown-grid">${n}</div>
      </section>

      <aside class="da-info">
        <strong>💡 O que são Dividend Aristocrats?</strong> são empresas do S&amp;P 500 que
        aumentaram os seus dividendos por pelo menos 25 anos consecutivos. Este histórico indica
        resiliência do negócio, geração de caixa consistente e compromisso da administração com os
        acionistas. Os valores de anos apresentados são os da lista de origem e podem ser
        atualizados periodicamente.
      </aside>
    </div>
  `;const s=a.querySelector("#da-results"),i=a.querySelector("#da-search"),c=a.querySelector("#da-sector"),m=a.querySelector("#da-min-years"),u=a.querySelector("#da-sort"),p=()=>{const d=Pa(Na(Z,{search:e.search,sector:e.sector,minYears:e.minYears}),e.sortBy);if(d.length===0){s.innerHTML='<p class="da-empty">Nenhuma empresa encontrada.</p>';return}if(e.view==="cards"){s.innerHTML=Ha(d);return}s.innerHTML=qa(d),s.querySelectorAll(".da-table th[data-sort]").forEach(g=>{g.addEventListener("click",()=>{e.sortBy=g.getAttribute("data-sort"),u&&(u.value=e.sortBy),p()})})};i&&i.addEventListener("input",()=>{e.search=i.value,p()}),c&&c.addEventListener("change",()=>{e.sector=c.value,p()}),m&&m.addEventListener("input",()=>{e.minYears=Number(m.value)||0,p()}),u&&u.addEventListener("change",()=>{e.sortBy=u.value,p()}),a.querySelectorAll(".da-view-btn").forEach(d=>{d.addEventListener("click",()=>{e.view=d.getAttribute("data-view"),a.querySelectorAll(".da-view-btn").forEach(g=>g.classList.remove("active")),d.classList.add("active"),p()})}),p()}const Q=[{rank:1,ticker:"NVDA",company:"NVIDIA Corporation",sector:"Technology",weight:13.31,cap:5470,category:"Mega Cap",cumulative:13.31,concentration:"Top 10"},{rank:2,ticker:"AAPL",company:"Apple Inc.",sector:"Technology",weight:11.57,cap:4390,category:"Mega Cap",cumulative:24.88,concentration:"Top 10"},{rank:3,ticker:"MSFT",company:"Microsoft Corporation",sector:"Technology",weight:8.55,cap:3010,category:"Mega Cap",cumulative:33.43,concentration:"Top 10"},{rank:4,ticker:"AMZN",company:"Amazon.com Inc.",sector:"Consumer Discretionary",weight:7.07,cap:2910,category:"Mega Cap",cumulative:40.5,concentration:"Top 10"},{rank:5,ticker:"GOOGL",company:"Alphabet Inc. Class A",sector:"Communication Services",weight:5.75,cap:4880,category:"Mega Cap",cumulative:46.25,concentration:"Top 10"},{rank:6,ticker:"GOOG",company:"Alphabet Inc. Class C",sector:"Communication Services",weight:5.33,cap:4830,category:"Mega Cap",cumulative:51.58,concentration:"Top 10"},{rank:7,ticker:"AVGO",company:"Broadcom Inc.",sector:"Technology",weight:4.6,cap:1970,category:"Mega Cap",cumulative:56.18,concentration:"Top 10"},{rank:8,ticker:"META",company:"Meta Platforms Inc. Class A",sector:"Communication Services",weight:4.58,cap:1570,category:"Mega Cap",cumulative:60.76,concentration:"Top 10"},{rank:9,ticker:"TSLA",company:"Tesla Inc.",sector:"Consumer Discretionary",weight:4.44,cap:1670,category:"Mega Cap",cumulative:65.2,concentration:"Top 10"},{rank:10,ticker:"WMT",company:"Walmart Inc.",sector:"Consumer Staples",weight:3.06,cap:1050,category:"Mega Cap",cumulative:68.26,concentration:"Top 10"},{rank:11,ticker:"ASML",company:"ASML Holding N.V.",sector:"Technology",weight:1.65,cap:609.6,category:"Mega Cap",cumulative:69.91,concentration:"Top 11–25"},{rank:12,ticker:"COST",company:"Costco Wholesale Corporation",sector:"Consumer Staples",weight:1.37,cap:458.3,category:"Mega Cap",cumulative:71.28,concentration:"Top 11–25"},{rank:13,ticker:"MU",company:"Micron Technology Inc.",sector:"Technology",weight:1.3,cap:906.3,category:"Mega Cap",cumulative:72.58,concentration:"Top 11–25"},{rank:14,ticker:"NFLX",company:"Netflix Inc.",sector:"Communication Services",weight:1.25,cap:368.7,category:"Mega Cap",cumulative:73.83,concentration:"Top 11–25"},{rank:15,ticker:"PLTR",company:"Palantir Technologies Inc. Class A",sector:"Technology",weight:1.09,cap:311.8,category:"Mega Cap",cumulative:74.92,concentration:"Top 11–25"},{rank:16,ticker:"AMD",company:"Advanced Micro Devices Inc.",sector:"Technology",weight:1.07,cap:726.4,category:"Mega Cap",cumulative:75.99,concentration:"Top 11–25"},{rank:17,ticker:"CSCO",company:"Cisco Systems Inc.",sector:"Technology",weight:.97,cap:402.4,category:"Mega Cap",cumulative:76.96,concentration:"Top 11–25"},{rank:18,ticker:"AMAT",company:"Applied Materials Inc.",sector:"Technology",weight:.88,cap:346.5,category:"Mega Cap",cumulative:77.84,concentration:"Top 11–25"},{rank:19,ticker:"LRCX",company:"Lam Research Corporation",sector:"Technology",weight:.86,cap:369.5,category:"Mega Cap",cumulative:78.7,concentration:"Top 11–25"},{rank:20,ticker:"INTC",company:"Intel Corporation",sector:"Technology",weight:.76,cap:604.6,category:"Mega Cap",cumulative:79.46,concentration:"Top 11–25"},{rank:21,ticker:"LIN",company:"Linde plc",sector:"Materials",weight:.71,cap:237.3,category:"Mega Cap",cumulative:80.17,concentration:"Top 11–25"},{rank:22,ticker:"TMUS",company:"T-Mobile US Inc.",sector:"Communication Services",weight:.69,cap:205.9,category:"Mega Cap",cumulative:80.86,concentration:"Top 11–25"},{rank:23,ticker:"PEP",company:"PepsiCo Inc.",sector:"Consumer Staples",weight:.65,cap:204,category:"Mega Cap",cumulative:81.51,concentration:"Top 11–25"},{rank:24,ticker:"KLAC",company:"KLA Corporation",sector:"Technology",weight:.62,cap:241.6,category:"Mega Cap",cumulative:82.13,concentration:"Top 11–25"},{rank:25,ticker:"AMGN",company:"Amgen Inc.",sector:"Health Care",weight:.59,cap:181.7,category:"Large Cap",cumulative:82.72,concentration:"Top 11–25"},{rank:26,ticker:"TXN",company:"Texas Instruments Incorporated",sector:"Technology",weight:.56,cap:278.8,category:"Mega Cap",cumulative:83.28,concentration:"Rest (26–100)"},{rank:27,ticker:"GILD",company:"Gilead Sciences Inc.",sector:"Health Care",weight:.54,cap:165.2,category:"Large Cap",cumulative:83.82,concentration:"Rest (26–100)"},{rank:28,ticker:"ISRG",company:"Intuitive Surgical Inc.",sector:"Health Care",weight:.51,cap:153.1,category:"Large Cap",cumulative:84.33,concentration:"Rest (26–100)"},{rank:29,ticker:"ARM",company:"Arm Holdings plc ADR",sector:"Technology",weight:.5,cap:235.4,category:"Mega Cap",cumulative:84.83,concentration:"Rest (26–100)"},{rank:30,ticker:"ADI",company:"Analog Devices Inc.",sector:"Technology",weight:.49,cap:211.1,category:"Mega Cap",cumulative:85.32,concentration:"Rest (26–100)"},{rank:31,ticker:"SHOP",company:"Shopify Inc. Class A",sector:"Consumer Discretionary",weight:.48,cap:123.8,category:"Large Cap",cumulative:85.8,concentration:"Rest (26–100)"},{rank:32,ticker:"PDD",company:"PDD Holdings Inc. ADR",sector:"Consumer Discretionary",weight:.45,cap:141.8,category:"Large Cap",cumulative:86.25,concentration:"Rest (26–100)"},{rank:33,ticker:"HON",company:"Honeywell International Inc.",sector:"Industrials",weight:.45,cap:138.1,category:"Large Cap",cumulative:86.7,concentration:"Rest (26–100)"},{rank:34,ticker:"QCOM",company:"QUALCOMM Incorporated",sector:"Technology",weight:.43,cap:224.7,category:"Mega Cap",cumulative:87.13,concentration:"Rest (26–100)"},{rank:35,ticker:"BKNG",company:"Booking Holdings Inc.",sector:"Consumer Discretionary",weight:.42,cap:120.1,category:"Large Cap",cumulative:87.55,concentration:"Rest (26–100)"},{rank:36,ticker:"APP",company:"AppLovin Corporation Class A",sector:"Technology",weight:.41,cap:152.4,category:"Large Cap",cumulative:87.96,concentration:"Rest (26–100)"},{rank:37,ticker:"PANW",company:"Palo Alto Networks Inc.",sector:"Technology",weight:.4,cap:184.7,category:"Large Cap",cumulative:88.36,concentration:"Rest (26–100)"},{rank:38,ticker:"INTU",company:"Intuit Inc.",sector:"Technology",weight:.36,cap:103.4,category:"Large Cap",cumulative:88.72,concentration:"Rest (26–100)"},{rank:39,ticker:"VRTX",company:"Vertex Pharmaceuticals Incorporated",sector:"Health Care",weight:.36,cap:115,category:"Large Cap",cumulative:89.08,concentration:"Rest (26–100)"},{rank:40,ticker:"SBUX",company:"Starbucks Corporation",sector:"Consumer Discretionary",weight:.32,cap:120.8,category:"Large Cap",cumulative:89.4,concentration:"Rest (26–100)"},{rank:41,ticker:"WDC",company:"Western Digital Corporation",sector:"Technology",weight:.32,cap:170.3,category:"Large Cap",cumulative:89.72,concentration:"Rest (26–100)"},{rank:42,ticker:"CEG",company:"Constellation Energy Corporation",sector:"Utilities",weight:.31,cap:99.3,category:"Large Cap",cumulative:90.03,concentration:"Rest (26–100)"},{rank:43,ticker:"CMCSA",company:"Comcast Corporation Class A",sector:"Communication Services",weight:.31,cap:89.1,category:"Large Cap",cumulative:90.34,concentration:"Rest (26–100)"},{rank:44,ticker:"CRWD",company:"CrowdStrike Holdings Inc. Class A",sector:"Technology",weight:.31,cap:143.2,category:"Large Cap",cumulative:90.65,concentration:"Rest (26–100)"},{rank:45,ticker:"ADBE",company:"Adobe Inc.",sector:"Technology",weight:.3,cap:95.4,category:"Large Cap",cumulative:90.95,concentration:"Rest (26–100)"},{rank:46,ticker:"STX",company:"Seagate Technology Holdings plc",sector:"Technology",weight:.3,cap:183.3,category:"Large Cap",cumulative:91.25,concentration:"Rest (26–100)"},{rank:47,ticker:"MRVL",company:"Marvell Technology Inc.",sector:"Technology",weight:.29,cap:155.6,category:"Large Cap",cumulative:91.54,concentration:"Rest (26–100)"},{rank:48,ticker:"MAR",company:"Marriott International Inc. Class A",sector:"Consumer Discretionary",weight:.27,cap:92.3,category:"Large Cap",cumulative:91.81,concentration:"Rest (26–100)"},{rank:49,ticker:"MELI",company:"MercadoLibre Inc.",sector:"Consumer Discretionary",weight:.27,cap:79.2,category:"Large Cap",cumulative:92.08,concentration:"Rest (26–100)"},{rank:50,ticker:"REGN",company:"Regeneron Pharmaceuticals Inc.",sector:"Health Care",weight:.25,cap:75.5,category:"Large Cap",cumulative:92.33,concentration:"Rest (26–100)"},{rank:51,ticker:"ADP",company:"Automatic Data Processing Inc.",sector:"Technology",weight:.25,cap:83.4,category:"Large Cap",cumulative:92.58,concentration:"Rest (26–100)"},{rank:52,ticker:"CDNS",company:"Cadence Design Systems Inc.",sector:"Technology",weight:.24,cap:97.8,category:"Large Cap",cumulative:92.82,concentration:"Rest (26–100)"},{rank:53,ticker:"ORLY",company:"O'Reilly Automotive Inc.",sector:"Consumer Discretionary",weight:.24,cap:74.3,category:"Large Cap",cumulative:93.06,concentration:"Rest (26–100)"},{rank:54,ticker:"CSX",company:"CSX Corporation",sector:"Industrials",weight:.24,cap:82.5,category:"Large Cap",cumulative:93.3,concentration:"Rest (26–100)"},{rank:55,ticker:"SNPS",company:"Synopsys Inc.",sector:"Technology",weight:.24,cap:97.6,category:"Large Cap",cumulative:93.54,concentration:"Rest (26–100)"},{rank:56,ticker:"ABNB",company:"Airbnb Inc. Class A",sector:"Consumer Discretionary",weight:.24,cap:78.9,category:"Large Cap",cumulative:93.78,concentration:"Rest (26–100)"},{rank:57,ticker:"MDLZ",company:"Mondelez International Inc. Class A",sector:"Consumer Staples",weight:.23,cap:79,category:"Large Cap",cumulative:94.01,concentration:"Rest (26–100)"},{rank:58,ticker:"MNST",company:"Monster Beverage Corporation",sector:"Consumer Staples",weight:.22,cap:84,category:"Large Cap",cumulative:94.23,concentration:"Rest (26–100)"},{rank:59,ticker:"ROST",company:"Ross Stores Inc.",sector:"Consumer Discretionary",weight:.22,cap:68.5,category:"Large Cap",cumulative:94.45,concentration:"Rest (26–100)"},{rank:60,ticker:"AEP",company:"American Electric Power Company Inc.",sector:"Utilities",weight:.22,cap:69.6,category:"Large Cap",cumulative:94.67,concentration:"Rest (26–100)"},{rank:61,ticker:"WBD",company:"Warner Bros. Discovery Inc. Series A",sector:"Communication Services",weight:.22,cap:68.3,category:"Large Cap",cumulative:94.89,concentration:"Rest (26–100)"},{rank:62,ticker:"CTAS",company:"Cintas Corporation",sector:"Industrials",weight:.21,cap:65.4,category:"Large Cap",cumulative:95.1,concentration:"Rest (26–100)"},{rank:63,ticker:"DASH",company:"DoorDash Inc. Class A",sector:"Consumer Discretionary",weight:.2,cap:65,category:"Large Cap",cumulative:95.3,concentration:"Rest (26–100)"},{rank:64,ticker:"PCAR",company:"PACCAR Inc.",sector:"Industrials",weight:.19,cap:58.8,category:"Large Cap",cumulative:95.49,concentration:"Rest (26–100)"},{rank:65,ticker:"FTNT",company:"Fortinet Inc.",sector:"Technology",weight:.19,cap:86.2,category:"Large Cap",cumulative:95.68,concentration:"Rest (26–100)"},{rank:66,ticker:"BKR",company:"Baker Hughes Company Class A",sector:"Energy",weight:.18,cap:64.9,category:"Large Cap",cumulative:95.86,concentration:"Rest (26–100)"},{rank:67,ticker:"MPWR",company:"Monolithic Power Systems Inc.",sector:"Technology",weight:.17,cap:81.1,category:"Large Cap",cumulative:96.03,concentration:"Rest (26–100)"},{rank:68,ticker:"FANG",company:"Diamondback Energy Inc.",sector:"Energy",weight:.17,cap:56.6,category:"Large Cap",cumulative:96.2,concentration:"Rest (26–100)"},{rank:69,ticker:"FAST",company:"Fastenal Company",sector:"Industrials",weight:.17,cap:50.2,category:"Large Cap",cumulative:96.37,concentration:"Rest (26–100)"},{rank:70,ticker:"EA",company:"Electronic Arts Inc.",sector:"Communication Services",weight:.16,cap:50.2,category:"Large Cap",cumulative:96.53,concentration:"Rest (26–100)"},{rank:71,ticker:"ADSK",company:"Autodesk Inc.",sector:"Technology",weight:.16,cap:48.8,category:"Large Cap",cumulative:96.69,concentration:"Rest (26–100)"},{rank:72,ticker:"NXPI",company:"NXP Semiconductors N.V.",sector:"Technology",weight:.15,cap:75.3,category:"Large Cap",cumulative:96.84,concentration:"Rest (26–100)"},{rank:73,ticker:"EXC",company:"Exelon Corporation",sector:"Utilities",weight:.15,cap:45.3,category:"Large Cap",cumulative:96.99,concentration:"Rest (26–100)"},{rank:74,ticker:"XEL",company:"Xcel Energy Inc.",sector:"Utilities",weight:.15,cap:49.9,category:"Large Cap",cumulative:97.14,concentration:"Rest (26–100)"},{rank:75,ticker:"FER",company:"Ferrovial SE",sector:"Utilities",weight:.15,cap:48.7,category:"Large Cap",cumulative:97.29,concentration:"Rest (26–100)"},{rank:76,ticker:"IDXX",company:"IDEXX Laboratories Inc.",sector:"Health Care",weight:.14,cap:41.7,category:"Large Cap",cumulative:97.43,concentration:"Rest (26–100)"},{rank:77,ticker:"ALNY",company:"Alnylam Pharmaceuticals Inc.",sector:"Health Care",weight:.14,cap:38.9,category:"Large Cap",cumulative:97.57,concentration:"Rest (26–100)"},{rank:78,ticker:"MSTR",company:"Strategy Inc.",sector:"Technology",weight:.13,cap:62.4,category:"Large Cap",cumulative:97.7,concentration:"Rest (26–100)"},{rank:79,ticker:"DDOG",company:"Datadog Inc. Class A",sector:"Technology",weight:.13,cap:73.1,category:"Large Cap",cumulative:97.83,concentration:"Rest (26–100)"},{rank:80,ticker:"ODFL",company:"Old Dominion Freight Line Inc.",sector:"Industrials",weight:.13,cap:39.3,category:"Large Cap",cumulative:97.96,concentration:"Rest (26–100)"},{rank:81,ticker:"PYPL",company:"PayPal Holdings Inc.",sector:"Technology",weight:.13,cap:39.9,category:"Large Cap",cumulative:98.09,concentration:"Rest (26–100)"},{rank:82,ticker:"CCEP",company:"Coca-Cola Europacific Partners plc",sector:"Consumer Staples",weight:.13,cap:40.5,category:"Large Cap",cumulative:98.22,concentration:"Rest (26–100)"},{rank:83,ticker:"TRI",company:"Thomson Reuters Corporation",sector:"Technology",weight:.12,cap:35.8,category:"Large Cap",cumulative:98.34,concentration:"Rest (26–100)"},{rank:84,ticker:"TTWO",company:"Take-Two Interactive Software Inc.",sector:"Communication Services",weight:.11,cap:42,category:"Large Cap",cumulative:98.45,concentration:"Rest (26–100)"},{rank:85,ticker:"ROP",company:"Roper Technologies Inc.",sector:"Industrials",weight:.11,cap:31.9,category:"Large Cap",cumulative:98.56,concentration:"Rest (26–100)"},{rank:86,ticker:"MCHP",company:"Microchip Technology Incorporated",sector:"Technology",weight:.11,cap:52.3,category:"Large Cap",cumulative:98.67,concentration:"Rest (26–100)"},{rank:87,ticker:"INSM",company:"Insmed Incorporated",sector:"Health Care",weight:.11,cap:25.6,category:"Large Cap",cumulative:98.78,concentration:"Rest (26–100)"},{rank:88,ticker:"KDP",company:"Keurig Dr Pepper Inc.",sector:"Consumer Staples",weight:.11,cap:39.9,category:"Large Cap",cumulative:98.89,concentration:"Rest (26–100)"},{rank:89,ticker:"AXON",company:"Axon Enterprise Inc.",sector:"Industrials",weight:.11,cap:30.4,category:"Large Cap",cumulative:99,concentration:"Rest (26–100)"},{rank:90,ticker:"WDAY",company:"Workday Inc. Class A",sector:"Technology",weight:.1,cap:29.1,category:"Large Cap",cumulative:99.1,concentration:"Rest (26–100)"},{rank:91,ticker:"PAYX",company:"Paychex Inc.",sector:"Technology",weight:.1,cap:32.2,category:"Large Cap",cumulative:99.2,concentration:"Rest (26–100)"},{rank:92,ticker:"GEHC",company:"GE HealthCare Technologies Inc.",sector:"Health Care",weight:.1,cap:28.2,category:"Large Cap",cumulative:99.3,concentration:"Rest (26–100)"},{rank:93,ticker:"CPRT",company:"Copart Inc.",sector:"Industrials",weight:.1,cap:31.7,category:"Large Cap",cumulative:99.4,concentration:"Rest (26–100)"},{rank:94,ticker:"CTSH",company:"Cognizant Technology Solutions Corporation Class A",sector:"Technology",weight:.09,cap:21.7,category:"Large Cap",cumulative:99.49,concentration:"Rest (26–100)"},{rank:95,ticker:"CHTR",company:"Charter Communications Inc. Class A",sector:"Communication Services",weight:.08,cap:20.2,category:"Large Cap",cumulative:99.57,concentration:"Rest (26–100)"},{rank:96,ticker:"KHC",company:"Kraft Heinz Company",sector:"Consumer Staples",weight:.08,cap:27.5,category:"Large Cap",cumulative:99.65,concentration:"Rest (26–100)"},{rank:97,ticker:"VRSK",company:"Verisk Analytics Inc.",sector:"Technology",weight:.08,cap:21.2,category:"Large Cap",cumulative:99.73,concentration:"Rest (26–100)"},{rank:98,ticker:"DXCM",company:"DexCom Inc.",sector:"Health Care",weight:.08,cap:22.6,category:"Large Cap",cumulative:99.81,concentration:"Rest (26–100)"},{rank:99,ticker:"ZS",company:"Zscaler Inc. Class A",sector:"Technology",weight:.07,cap:24.5,category:"Large Cap",cumulative:99.88,concentration:"Rest (26–100)"},{rank:100,ticker:"TEAM",company:"Atlassian Corporation Class A",sector:"Technology",weight:.06,cap:20.5,category:"Large Cap",cumulative:99.94,concentration:"Rest (26–100)"}],Oa={Technology:"#00d4ff","Communication Services":"#00d4ff","Consumer Discretionary":"#ffab00","Consumer Staples":"#00e676","Health Care":"#29b6f6",Industrials:"#ffa726",Materials:"#66bb6a",Energy:"#ff5252",Utilities:"#42a5f5",Financials:"#ba68c8","Real Estate":"#ec407a"};function Ya(t){return String(t||"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")}function za(t){return Oa[t]||"#00d4ff"}function gt(t){return`nq-sector--${Ya(t)}`}function Oe(t){const a=Number(t)||0;return a>=1e3?`$${(a/1e3).toFixed(2)}T`:`$${a.toFixed(1)}B`}function ja(t){return(t||[]).reduce((a,e)=>a+(Number(e.cap)||0),0)}function Ua(t){return(t||[]).reduce((a,e)=>a+(Number(e.weight)||0),0)}function Va(t,{search:a="",sector:e="",category:o=""}={}){const r=String(a).toLowerCase().trim();return(t||[]).filter(n=>{const s=!r||String(n.company).toLowerCase().includes(r)||String(n.ticker).toLowerCase().includes(r),i=!e||n.sector===e,c=!o||n.category===o;return s&&i&&c})}function Ga(t,a="rank"){return[...t||[]].sort((e,o)=>{switch(a){case"cap":return(o.cap||0)-(e.cap||0);case"weight":return(o.weight||0)-(e.weight||0)||(e.rank||0)-(o.rank||0);case"company":return e.company.localeCompare(o.company);case"ticker":return e.ticker.localeCompare(o.ticker);case"sector":return e.sector.localeCompare(o.sector)||(e.rank||0)-(o.rank||0);case"rank":default:return(e.rank||0)-(o.rank||0)}})}function Wa(t){return[...new Set((t||[]).map(a=>a.sector))].sort()}function Ka(t){const a=new Map;return(t||[]).forEach(e=>{a.has(e.sector)||a.set(e.sector,[]),a.get(e.sector).push(e)}),[...a.entries()].map(([e,o])=>({sector:e,companies:o.map(r=>r.ticker),count:o.length,weight:o.reduce((r,n)=>r+(Number(n.weight)||0),0)})).sort((e,o)=>o.count-e.count||e.sector.localeCompare(o.sector))}function _a(t){return`<div class="nq-cards">${(t||[]).map(e=>`
      <article class="nq-card">
        <div class="nq-card-head">
          <div>
            <span class="nq-rank">#${l(e.rank)}</span>
            <h3>${l(e.company)}</h3>
          </div>
          <span class="nq-ticker">${l(e.ticker)}</span>
        </div>
        <span class="nq-sector ${gt(e.sector)}">${l(e.sector)}</span>
        <div class="nq-metrics">
          <div class="nq-metric">
            <span class="nq-metric-value">${Oe(e.cap)}</span>
            <span class="nq-metric-label">Market Cap</span>
          </div>
          <div class="nq-metric">
            <span class="nq-metric-value">${(Number(e.weight)||0).toFixed(2)}%</span>
            <span class="nq-metric-label">Peso no Índice</span>
          </div>
        </div>
        <span class="nq-cat">${l(e.category)} · ${l(e.concentration)}</span>
      </article>`).join("")}</div>`}function Ja(t){return`
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
        <tbody>${(t||[]).map(e=>`
      <tr>
        <td>${l(e.rank)}</td>
        <td><strong>${l(e.company)}</strong></td>
        <td><span class="nq-ticker">${l(e.ticker)}</span></td>
        <td><span class="nq-sector ${gt(e.sector)}">${l(e.sector)}</span></td>
        <td>${Oe(e.cap)}</td>
        <td><strong class="nq-weight">${(Number(e.weight)||0).toFixed(2)}%</strong></td>
        <td>${(Number(e.cumulative)||0).toFixed(2)}%</td>
        <td><span class="nq-cat">${l(e.category)}</span></td>
      </tr>`).join("")}</tbody>
      </table>
    </div>`}function Xa(t="nasdaq-100-view"){const a=document.getElementById(t);if(!a){console.error(`❌ Contentor ${t} não encontrado!`);return}const e={search:"",sector:"",category:"",sortBy:"rank",view:"cards"},o=Wa(Q).map(p=>`<option value="${l(p)}">${l(p)}</option>`).join(""),r=Ka(Q).map(p=>`
      <div class="nq-breakdown-item">
        <div class="nq-breakdown-head" style="color: ${za(p.sector)}">
          <span>${l(p.sector)}</span>
          <span class="nq-breakdown-count">${p.count} · ${p.weight.toFixed(2)}%</span>
        </div>
        <p class="nq-breakdown-list">${p.companies.map(d=>l(d)).join(", ")}</p>
      </div>`).join("");a.innerHTML=`
    <div class="nasdaq-view">
      <header class="nq-header">
        <div class="nq-header-content">
          <h2>Nasdaq-100</h2>
          <p>💻 100 maiores empresas não financeiras da Nasdaq · Snapshot 01/05/2026</p>
        </div>
        <div class="nq-stats">
          <div class="nq-stat">
            <span class="nq-stat-value">${Q.length}</span>
            <span class="nq-stat-label">Empresas</span>
          </div>
          <div class="nq-stat">
            <span class="nq-stat-value">${Oe(ja(Q))}</span>
            <span class="nq-stat-label">Market Cap Total</span>
          </div>
          <div class="nq-stat">
            <span class="nq-stat-value">${Ua(Q).toFixed(2)}%</span>
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
            ${o}
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
        <div class="nq-breakdown-grid">${r}</div>
      </section>

      <aside class="nq-info">
        <strong>💡 Sobre o Nasdaq-100:</strong> o índice reúne as 100 maiores empresas não
        financeiras negociadas na Nasdaq, ponderadas por capitalização de mercado. Como o peso é
        concentrado, as dez primeiras empresas respondem por cerca de dois terços do índice. Os
        dados correspondem ao snapshot de 01/05/2026 e devem ser atualizados periodicamente.
      </aside>
    </div>
  `;const n=a.querySelector("#nq-results"),s=a.querySelector("#nq-search"),i=a.querySelector("#nq-sector"),c=a.querySelector("#nq-cap"),m=a.querySelector("#nq-sort"),u=()=>{const p=Ga(Va(Q,{search:e.search,sector:e.sector,category:e.category}),e.sortBy);if(p.length===0){n.innerHTML='<p class="nq-empty">Nenhuma empresa encontrada.</p>';return}if(e.view==="cards"){n.innerHTML=_a(p);return}n.innerHTML=Ja(p),n.querySelectorAll(".nq-table th[data-sort]").forEach(d=>{d.addEventListener("click",()=>{e.sortBy=d.getAttribute("data-sort"),m&&(m.value=e.sortBy),u()})})};s&&s.addEventListener("input",()=>{e.search=s.value,u()}),i&&i.addEventListener("change",()=>{e.sector=i.value,u()}),c&&c.addEventListener("change",()=>{e.category=c.value,u()}),m&&m.addEventListener("change",()=>{e.sortBy=m.value,u()}),a.querySelectorAll(".nq-view-btn").forEach(p=>{p.addEventListener("click",()=>{e.view=p.getAttribute("data-view"),a.querySelectorAll(".nq-view-btn").forEach(d=>d.classList.remove("active")),p.classList.add("active"),u()})}),u()}const Za={bullish:{label:"Otimista",cls:"positive"},bearish:{label:"Pessimista",cls:"negative"},neutral:{label:"Neutro",cls:""}};async function Qa(t="daily-summary"){const a=document.getElementById(t);if(a){a.innerHTML='<p class="summary-empty">Carregando resumo do dia...</p>';try{const e=await fetch(`${z}/api/resumo-dia`);if(!e.ok)throw new Error(`HTTP ${e.status}`);const o=await e.json();to(a,o.dados||{})}catch(e){console.error("Erro ao carregar Resumo do Dia:",e),a.innerHTML='<p class="summary-empty">Resumo do dia indisponível no momento.</p>'}}}function vt(t){const a=Number(t)||0;return`${a>0?"+":""}${a.toFixed(2)}%`}function eo(t){if(!t)return"";const a=new Date(`${t}T00:00:00`);return Number.isNaN(a.getTime())?"":a.toLocaleDateString("pt-BR")}function Ke(t,a){const e=(a||[]).map(o=>`
        <div class="summary-row">
          <span class="mini-symbol">${l(o.symbol||"")}</span>
          <span class="mini-name">${l(o.name||"")}</span>
          <span class="mini-change ${o.changePct>=0?"positive":"negative"}">${vt(o.changePct)}</span>
        </div>`).join("");return`
    <div class="summary-list">
      <h4 class="summary-list-title">${t}</h4>
      ${e}
    </div>`}function to(t,a){const e=a.stats||{},o=Za[a.marketMood]||{label:"—",cls:""},r=eo(a.referenceDate),n=[{label:"Em alta",value:e.gainers??"—",cls:"positive"},{label:"Em baixa",value:e.losers??"—",cls:"negative"},{label:"Estáveis",value:e.neutral??"—",cls:""},{label:"Total",value:e.total??"—",cls:""},{label:"Humor",value:o.label,cls:o.cls}].map(i=>`
      <div class="daily-card ${i.cls}">
        <span class="daily-label">${i.label}</span>
        <span class="daily-value">${i.value}</span>
      </div>`).join(""),s=(a.sectorPerformance||[]).map(i=>`
      <div class="daily-sector-card ${i.avgChangePct>=0?"positive":"negative"}">
        <span class="sector-name">${l(i.name||"")}</span>
        <span class="sector-change">${vt(i.avgChangePct)}</span>
      </div>`).join("");t.innerHTML=`
    <header class="daily-summary-header">
      <h2>📊 Resumo do Dia</h2>
      ${r?`<span class="daily-date">Referência: ${r}</span>`:""}
    </header>

    <div class="daily-summary-grid">${n}</div>

    <div class="daily-lists">
      ${Ke("🚀 Maiores altas",a.topGainers)}
      ${Ke("📉 Maiores baixas",a.topLosers)}
    </div>

    <div class="daily-sectors">
      <h3>📈 Desempenho por setor</h3>
      <div class="daily-sectors-list">${s}</div>
    </div>
  `}const Ie=2500,yt=1500,ao=.7,oo=.4,ro=5,no=3,_e="marketCapShare-desc",so={Alta:"si-badge--high",Moderada:"si-badge--moderate",Baixa:"si-badge--low"},io={Renda:"si-badge--income",Equilibrado:"si-badge--balanced",Crescimento:"si-badge--growth"};function F(t,a=2){const e=10**a;return Math.round((t+Number.EPSILON)*e)/e}function D(t){const a=Number(t);return Number.isFinite(a)&&a>0?a:0}function De(t){return D(t&&t.dividendYield)}function co(t){const a=(t||[]).filter(o=>o!=null&&o!=="").map(Number).filter(o=>Number.isFinite(o)).sort((o,r)=>o-r);if(a.length===0)return 0;const e=Math.floor(a.length/2);return a.length%2===1?a[e]:(a[e-1]+a[e])/2}function ht(t){const a=(t||[]).map(D).filter(r=>r>0),e=a.reduce((r,n)=>r+n,0);if(e<=0)return 0;const o=a.reduce((r,n)=>r+(n/e)**2,0);return F(o*1e4,1)}function lo(t){return t>=Ie?"Alta":t>=yt?"Moderada":"Baixa"}function po(t){return t>=ao?"Renda":t>=oo?"Equilibrado":"Crescimento"}function W(t){const a=Number(t);return Number.isFinite(a)?`${(a*100).toFixed(1)}%`:"0.0%"}function K(t){const a=Number(t);return Number.isFinite(a)?a.toLocaleString("pt-BR",{maximumFractionDigits:0}):"0"}function ft(t){return(t||[]).reduce((a,e)=>a+D(e.marketCap),0)}function uo(t,a){return(t||[]).filter(e=>D(e.marketCap)>0).slice().sort((e,o)=>D(o.marketCap)-D(e.marketCap)||String(e.symbol).localeCompare(String(o.symbol))).slice(0,ro).map(e=>({symbol:e.symbol||"N/D",name:e.name||e.symbol||"N/D",marketCap:D(e.marketCap),weight:a>0?F(D(e.marketCap)/a,4):0}))}function mo(t,a){const e=new Map;for(const o of t||[]){const r=o.subIndustry||"N/D";e.has(r)||e.set(r,{name:r,count:0,marketCap:0});const n=e.get(r);n.count+=1,n.marketCap+=D(o.marketCap)}return Array.from(e.values()).sort((o,r)=>r.count-o.count||r.marketCap-o.marketCap||o.name.localeCompare(r.name)).slice(0,no).map(o=>({name:o.name,count:o.count,weight:a>0?F(o.marketCap/a,4):0}))}function go(t,a=0){const e=Array.isArray(t&&t.companies)?t.companies:[],o=t&&t.id||"N/D",r=t&&t.name||o,n=ft(e),s=D(a)||n,i=e.filter(d=>De(d)>0),c=i.reduce((d,g)=>d+De(g),0),m=e.length>0?i.length/e.length:0,u=uo(e,n),p=ht(e.map(d=>d.marketCap));return{id:o,name:r,companyCount:e.length,totalMarketCap:n,marketCapShare:s>0?F(n/s,4):0,medianMarketCap:co(e.map(d=>d.marketCap)),averageMarketCap:e.length>0?Math.round(n/e.length):0,hhi:p,concentration:lo(p),topCompany:u[0]||null,topCompanies:u,top3Weight:F(u.slice(0,3).reduce((d,g)=>d+g.weight,0),4),dividendPayers:i.length,dividendCoverage:F(m,4),averageDividendYield:i.length>0?F(c/i.length,2):0,incomeProfile:po(m),subIndustryCount:new Set(e.map(d=>d.subIndustry||"N/D")).size,topSubIndustries:mo(e,n),rank:0}}function be(t,a){return t?{id:t.id,name:t.name,[a]:t[a]}:null}function vo(t){if(t.length===0)return{largestSector:null,mostConcentrated:null,mostDiversified:null,highestYield:null,widestSector:null};const a=t[0],e=t.reduce((i,c)=>c.hhi>i.hhi?c:i),o=t.reduce((i,c)=>c.hhi<i.hhi?c:i),r=t.filter(i=>i.averageDividendYield>0),n=r.length?r.reduce((i,c)=>c.averageDividendYield>i.averageDividendYield?c:i):null,s=t.reduce((i,c)=>c.companyCount>i.companyCount?c:i);return{largestSector:{id:a.id,name:a.name,marketCap:a.totalMarketCap,share:a.marketCapShare},mostConcentrated:be(e,"hhi"),mostDiversified:be(o,"hhi"),highestYield:be(n,"averageDividendYield"),widestSector:be(s,"companyCount")}}function yo(t,a={}){const e=(Array.isArray(t)?t:[]).filter(c=>c&&c.id),o=e.reduce((c,m)=>c+ft(m.companies),0),r=e.map(c=>go(c,o)).sort((c,m)=>m.totalMarketCap-c.totalMarketCap||c.name.localeCompare(m.name));r.forEach((c,m)=>{c.rank=m+1});const n=e.flatMap(c=>Array.isArray(c.companies)?c.companies:[]),s=n.filter(c=>De(c)>0),i=e.map(c=>c.generatedAt).filter(Boolean).sort();return{generatedAt:a.generatedAt||i[i.length-1]||null,sectorCount:r.length,totalCompanies:n.length,totalMarketCap:o,dividendPayers:s.length,dividendCoverage:n.length>0?F(s.length/n.length,4):0,indexHhi:ht(n.map(c=>c.marketCap)),sectors:r,highlights:vo(r)}}function ho(t,a=_e){const e=String(a||_e),o=e.lastIndexOf("-"),r=o>0?e.slice(0,o):e,n=o>0?e.slice(o+1):"desc";return[...t||[]].sort((s,i)=>{const c=s[r],m=i[r];if(typeof c=="string"||typeof m=="string"){const p=String(c??"").localeCompare(String(m??""),"pt");return n==="asc"?p:-p}const u=(Number(c)||0)-(Number(m)||0);return u!==0?n==="asc"?u:-u:String(s.name).localeCompare(String(i.name),"pt")})}function fo(){return`
    <div class="si-view">
      <div class="si-loading">
        <div class="loading-spinner"></div>
        <p>A calcular inteligência setorial...</p>
      </div>
    </div>
  `}function Re(t){return`
    <div class="si-view">
      <div class="si-empty">
        <h3>⚠️ ${l(t)}</h3>
        <p>Não foi possível carregar as métricas dos setores. Verifique a ligação à API.</p>
      </div>
    </div>
  `}function bo(t){const a=t.topCompanies||[],e=a.length?a.map((r,n)=>`
          <button
            type="button"
            class="si-company"
            data-symbol="${l(r.symbol)}"
            data-name="${l(r.name)}"
          >
            <span class="si-company-rank">${n+1}</span>
            <span class="si-company-symbol">${l(r.symbol)}</span>
            <span class="si-company-name">${l(r.name)}</span>
            <span class="si-company-cap">${J(r.marketCap)}</span>
            <span class="si-company-weight">${W(r.weight)}</span>
          </button>`).join(""):'<p class="si-muted">Sem empresas com market cap disponível.</p>',o=(t.topSubIndustries||[]).length?`<ul class="si-subindustries">
        ${t.topSubIndustries.map(r=>`
          <li>
            <span>${l(r.name)}</span>
            <span class="si-muted">${r.count} · ${W(r.weight)}</span>
          </li>`).join("")}
      </ul>`:'<p class="si-muted">Sem subindústrias disponíveis.</p>';return`
    <div class="si-detail-grid">
      <section>
        <h4>Top 5 empresas por market cap</h4>
        <div class="si-company-list">${e}</div>
      </section>
      <section>
        <h4>Principais subindústrias</h4>
        ${o}
      </section>
    </div>
  `}function ko(t){const a=l(t.id),e=t.topCompany||t.topCompanies&&t.topCompanies[0],o=so[t.concentration]||"si-badge--low",r=io[t.incomeProfile]||"si-badge--balanced",n=Math.min(100,(Number(t.marketCapShare)||0)*100).toFixed(1);return`
    <tr class="si-row" data-sector="${a}">
      <td class="si-rank">${t.rank}</td>
      <td class="si-sector-cell">
        <button
          type="button"
          class="si-sector-btn"
          aria-expanded="false"
          aria-controls="si-detail-${a}"
        >
          <span class="si-caret" aria-hidden="true">▸</span>
          <span>${l(t.name)}</span>
        </button>
      </td>
      <td class="si-num">${t.companyCount}</td>
      <td class="si-num">${J(t.totalMarketCap)}</td>
      <td class="si-share">
        <div class="si-bar">
          <span class="si-bar-fill" style="width: ${n}%"></span>
        </div>
        <span class="si-share-value">${W(t.marketCapShare)}</span>
      </td>
      <td class="si-num">${K(t.hhi)}</td>
      <td><span class="si-badge ${o}">${l(t.concentration)}</span></td>
      <td>
        ${e?`<strong>${l(e.symbol)}</strong>
               <span class="si-muted">${W(e.weight)}</span>`:'<span class="si-muted">—</span>'}
      </td>
      <td class="si-num">${W(t.dividendCoverage)}</td>
      <td class="si-num">${(Number(t.averageDividendYield)||0).toFixed(2)}%</td>
      <td><span class="si-badge ${r}">${l(t.incomeProfile)}</span></td>
    </tr>
    <tr class="si-detail" id="si-detail-${a}" hidden>
      <td colspan="11">${bo(t)}</td>
    </tr>
  `}function Co(t){return[["Setores",String(t.sectorCount??0)],["Empresas",String(t.totalCompanies??0)],["Market cap total",J(t.totalMarketCap)],["Cobertura de dividendos",W(t.dividendCoverage)],["HHI do índice",K(t.indexHhi)]].map(([e,o])=>`
      <div class="si-stat">
        <span class="si-stat-label">${e}</span>
        <span class="si-stat-value">${o}</span>
      </div>`).join("")}function wo(t){var o,r,n,s;const a=t||{};return[{icon:"🏆",label:"Maior setor",name:(o=a.largestSector)==null?void 0:o.name,detail:a.largestSector?`${W(a.largestSector.share)} do índice`:"Sem dados"},{icon:"🎯",label:"Mais concentrado",name:(r=a.mostConcentrated)==null?void 0:r.name,detail:a.mostConcentrated?`HHI ${K(a.mostConcentrated.hhi)}`:"Sem dados"},{icon:"🧩",label:"Mais diversificado",name:(n=a.mostDiversified)==null?void 0:n.name,detail:a.mostDiversified?`HHI ${K(a.mostDiversified.hhi)}`:"Sem dados"},{icon:"💰",label:"Maior yield médio",name:(s=a.highestYield)==null?void 0:s.name,detail:a.highestYield?`${Number(a.highestYield.averageDividendYield).toFixed(2)}% (pagadoras)`:"Sem pagadoras"}].map(i=>`
      <div class="si-highlight">
        <span class="si-highlight-icon" aria-hidden="true">${i.icon}</span>
        <div>
          <span class="si-highlight-label">${i.label}</span>
          <strong class="si-highlight-name">${l(i.name||"—")}</strong>
          <span class="si-highlight-detail">${l(i.detail)}</span>
        </div>
      </div>`).join("")}function xo(t){if(!t)return"data desconhecida";const a=new Date(t);return Number.isNaN(a.getTime())?l(String(t)):a.toLocaleDateString("pt-BR")}function So(t,a){const e=document.getElementById(t);if(!e){console.error(`❌ Contentor ${t} não encontrado!`);return}const o=Array.isArray(a&&a.sectors)?a.sectors:[];if(o.length===0){e.innerHTML=Re("Sem dados setoriais");return}const r=a.source==="local"?"calculado no browser":"servido pela API do S&P 500";e.innerHTML=`
    <div class="si-view">
      <header class="si-header">
        <h2>🧠 Inteligência Setorial GICS</h2>
        <p class="subtitle">
          Comparação dos ${a.sectorCount} setores do S&amp;P 500 por tamanho, concentração,
          amplitude e perfil de dividendos.
        </p>
        <span class="si-source">
          Dados de ${xo(a.generatedAt)} · ${r}
        </span>
      </header>

      <div class="si-stats">${Co(a)}</div>

      <div class="si-highlights">${wo(a.highlights)}</div>

      <section class="si-panel">
        <div class="si-toolbar">
          <h3>Ranking dos setores</h3>
          <label class="si-sort" for="si-sort">
            Ordenar por
            <select id="si-sort">
              <option value="marketCapShare-desc">Participação no índice</option>
              <option value="hhi-desc">Concentração (HHI)</option>
              <option value="dividendCoverage-desc">Cobertura de dividendos</option>
              <option value="averageDividendYield-desc">Yield médio</option>
              <option value="companyCount-desc">Nº de empresas</option>
              <option value="name-asc">Nome</option>
            </select>
          </label>
        </div>

        <div class="si-table-wrapper">
          <table class="si-table">
            <caption class="si-caption">
              Métricas por setor GICS — clique num setor para ver as maiores empresas.
            </caption>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Setor</th>
                <th scope="col">Empresas</th>
                <th scope="col">Market cap</th>
                <th scope="col">Participação</th>
                <th scope="col">HHI</th>
                <th scope="col">Concentração</th>
                <th scope="col">Top empresa</th>
                <th scope="col">Cobertura div.</th>
                <th scope="col">Yield médio</th>
                <th scope="col">Perfil</th>
              </tr>
            </thead>
            <tbody id="si-tbody"></tbody>
          </table>
        </div>
      </section>

      <p class="si-note">
        <strong>Metodologia:</strong> HHI calculado sobre o market cap (0–10 000; ≥
        ${K(Ie)} concentração alta, ${K(yt)}–
        ${K(Ie)} moderada). Cobertura = percentagem de empresas com dividend
        yield positivo; o yield médio considera apenas as pagadoras. Perfil: Renda ≥ 70%,
        Equilibrado 40–70%, Crescimento &lt; 40%.
      </p>
    </div>
  `;const n=e.querySelector("#si-sort"),s=e.querySelector("#si-tbody");if(!n||!s)return;const i=new Set,c=()=>{s.querySelectorAll(".si-sector-btn").forEach(u=>{u.addEventListener("click",()=>{const p=u.closest("tr"),d=p.nextElementSibling,g=p.dataset.sector,k=u.getAttribute("aria-expanded")==="true";u.setAttribute("aria-expanded",String(!k));const T=u.querySelector(".si-caret");T&&(T.textContent=k?"▸":"▾"),d&&(d.hidden=k),k?i.delete(g):i.add(g)})}),s.querySelectorAll(".si-company").forEach(u=>{u.addEventListener("click",()=>{typeof window.openCompanyDetails=="function"&&window.openCompanyDetails({symbol:u.dataset.symbol,name:u.dataset.name})})})},m=()=>{const u=ho(o,n.value);s.innerHTML=u.map(ko).join(""),i.forEach(p=>{const d=s.querySelector(`tr[data-sector="${p}"]`);if(!d)return;const g=d.querySelector(".si-sector-btn"),k=d.nextElementSibling;g&&g.setAttribute("aria-expanded","true");const T=g&&g.querySelector(".si-caret");T&&(T.textContent="▾"),k&&(k.hidden=!1)}),c()};n.addEventListener("change",m),m()}function Je(t){return!!(t&&Array.isArray(t.sectors)&&t.sectors.length>0)}async function $o(){const a=(await Fe()).map(e=>({id:e.id,name:e.name||qe(e.id),companies:e.companies,generatedAt:e.generatedAt}));return yo(a)}async function Ao(t="sector-intelligence-view"){const a=document.getElementById(t);if(!a){console.error(`❌ Contentor ${t} não encontrado!`);return}a.innerHTML=fo();let e=await Ot(),o="api";if(!Je(e))try{e=await $o(),o="local"}catch(r){console.error("Erro ao calcular inteligência setorial no browser:",r),a.innerHTML=Re("Dados indisponíveis");return}if(!Je(e)){a.innerHTML=Re("Dados indisponíveis");return}So(t,{...e,source:o})}const bt="sp500-price-alerts",Ne=50;function Eo(){try{const t=localStorage.getItem(bt);if(!t)return[];const a=JSON.parse(t);return Array.isArray(a)&&a.length>0&&Array.isArray(a[0])?a:Array.isArray(a)&&a.length>0&&typeof a[0]=="object"?a.map(e=>[e.symbol,e]):[]}catch(t){return console.error("Erro ao carregar price alerts:",t),[]}}function xe(){try{const t=Array.from(ne.entries());localStorage.setItem(bt,JSON.stringify(t))}catch(t){console.error("Erro ao salvar price alerts:",t)}}function To(t,a){let e;return function(...r){const n=()=>{clearTimeout(e),t(...r)};clearTimeout(e),e=setTimeout(n,a)}}function Pe(){const t=document.getElementById("nav-menu"),a=document.getElementById("menu-toggle");t&&t.classList.remove("open"),a&&a.setAttribute("aria-expanded","false")}function Mo(){const t=document.getElementById("menu-toggle"),a=document.getElementById("nav-menu");!t||!a||(t.addEventListener("click",e=>{e.stopPropagation();const o=a.classList.toggle("open");t.setAttribute("aria-expanded",String(o))}),document.addEventListener("click",e=>{a.classList.contains("open")&&!a.contains(e.target)&&Pe()}),document.addEventListener("keydown",e=>{e.key==="Escape"&&Pe()}))}let E=[],B=[],N=1,me="dashboard",re=new Set;const Xe=new Set,Ee=Eo(),ne=new Map(Ee&&Ee.length>0?Ee:[]);let O,Y,le,pe,ue,_,V,te,G;function Lo(){O=document.getElementById("sector-filter"),Y=document.getElementById("country-filter"),le=document.getElementById("search-input"),pe=document.getElementById("dividend-min"),ue=document.getElementById("sort-select"),_=document.getElementById("table-body"),V=document.getElementById("stats"),te=document.getElementById("pagination"),G=document.getElementById("header-checkbox"),document.querySelectorAll(".nav-tab").forEach(n=>{n.addEventListener("click",s=>{s.preventDefault();const i=n.getAttribute("data-tab");Io(i),Pe()})}),Mo(),O&&O.addEventListener("change",ae),Y&&Y.addEventListener("change",ae),le&&le.addEventListener("input",To(ae,300)),pe&&pe.addEventListener("change",ae),ue&&ue.addEventListener("change",ae),G&&G.addEventListener("change",()=>{const n=G.checked;_.querySelectorAll(".row-checkbox").forEach(i=>{i.checked=n,i.dispatchEvent(new Event("change"))})});const a=document.getElementById("select-all"),e=document.getElementById("deselect-all"),o=document.getElementById("export-csv"),r=document.getElementById("export-json");a&&a.addEventListener("click",()=>{B.forEach(n=>re.add(n.symbol)),ge(),ve()}),e&&e.addEventListener("click",()=>{re.clear(),ge(),ve()}),o&&o.addEventListener("click",Zo),r&&r.addEventListener("click",Qo),kt(),xt(),St(),Qa(),At()}document.addEventListener("DOMContentLoaded",Lo);function Io(t){me=t,kt(),xt()}function q(t,a){Xe.has(t)||(Xe.add(t),a())}function kt(){const t=document.getElementById("dashboard-view"),a=document.getElementById("treemap-view"),e=document.getElementById("heatmap-view"),o=document.getElementById("bubble-chart-view"),r=document.getElementById("dividends-view"),n=document.getElementById("stock-of-day-view"),s=document.getElementById("daily-curiosity-view"),i=document.getElementById("dow-jones-view"),c=document.getElementById("dividend-kings-view"),m=document.getElementById("dividend-aristocrats-view"),u=document.getElementById("nasdaq-100-view"),p=document.getElementById("sector-intelligence-view");switch([t,a,e,o,r,n,s,i,c,m,u,p].forEach(g=>{g&&(g.style.display="none")}),me){case"dashboard":t&&(t.style.display="block");break;case"stock-of-day":n&&(n.style.display="block",$t());break;case"daily-curiosity":s&&(s.style.display="block",q("daily-curiosity",Lt));break;case"treemap":a&&(a.style.display="block",q("treemap",Wt));break;case"heatmap":e&&(e.style.display="block",q("heatmap",_t));break;case"bubble":o&&(o.style.display="block",Ct());break;case"dividends":r&&(r.style.display="block",wt());break;case"dow-jones":i&&(i.style.display="block",q("dow-jones",Do));break;case"dividend-kings":c&&(c.style.display="block",q("dividend-kings",Ro));break;case"dividend-aristocrats":m&&(m.style.display="block",q("dividend-aristocrats",No));break;case"nasdaq-100":u&&(u.style.display="block",q("nasdaq-100",Po));break;case"sector-intelligence":p&&(p.style.display="block",q("sector-intelligence",()=>Ao("sector-intelligence-view")));break;default:t&&(t.style.display="block")}}function Ct(){const t=document.getElementById("bubble-chart-view");if(!t){console.error("❌ bubble-chart-view não encontrado!");return}t.innerHTML='<div style="text-align: center; padding: 40px;"><p>Carregando gráfico de bolhas...</p></div>',dt(E,"bubble-chart-view")}function wt(){const t=document.getElementById("dividends-view");if(!t){console.error("❌ dividends-view não encontrado!");return}if(E.length===0){t.innerHTML='<div style="text-align: center; padding: 40px;"><p>Carregando dados de dividendos...</p></div>';return}la(E,"dividends-view")}function Do(){if(!document.getElementById("dow-jones-view")){console.error("❌ dow-jones-view não encontrado!");return}ka("dow-jones-view")}function Ro(){if(!document.getElementById("dividend-kings-view")){console.error("❌ dividend-kings-view não encontrado!");return}Ma("dividend-kings-view")}function No(){if(!document.getElementById("dividend-aristocrats-view")){console.error("❌ dividend-aristocrats-view não encontrado!");return}Fa("dividend-aristocrats-view")}function Po(){if(!document.getElementById("nasdaq-100-view")){console.error("❌ nasdaq-100-view não encontrado!");return}Xa("nasdaq-100-view")}function xt(){document.querySelectorAll(".nav-tab").forEach(a=>{a.classList.remove("active"),a.getAttribute("data-tab")===me&&a.classList.add("active")})}async function St(){V&&(V.textContent="Carregando dados...");try{const t=await st({force:!0}),a=await Promise.all(t.map(async e=>{try{const o=await it(e,{force:!0});return o&&Array.isArray(o.companies)?{generatedAt:o.generatedAt||null,companies:o.companies.map(r=>({...r,sector:e,sectorName:qe(e)}))}:{generatedAt:null,companies:[]}}catch(o){return console.error(`❌ Erro ao carregar ${e}:`,o),{generatedAt:null,companies:[]}}}));E=a.flatMap(e=>e.companies),Ze(a.map(e=>e.generatedAt).filter(Boolean)),O&&(O.innerHTML='<option value="">Todos os Setores</option>',[...new Set(E.map(o=>o.sector))].sort().forEach(o=>{var n;const r=document.createElement("option");r.value=o,r.textContent=((n=Be.find(s=>s.id===o))==null?void 0:n.name)||o,O.appendChild(r)})),Y&&(Y.innerHTML='<option value="">Todos os Países</option>',[...new Set(E.map(o=>ot(o.headquarters)))].sort().forEach(o=>{const r=document.createElement("option");r.value=o,r.textContent=o,Y.appendChild(r)})),ae(),ve(),me==="bubble"&&Ct(),me==="dividends"&&wt()}catch(t){console.error("❌ Erro ao carregar dados:",t),V&&(V.textContent="Erro ao carregar dados. Tente novamente."),Ze([])}}function Ze(t){const a=document.getElementById("freshness-badge"),e=document.getElementById("freshness-text");if(!e)return;const o=(t||[]).map(u=>new Date(u)).filter(u=>!Number.isNaN(u.getTime()));if(o.length===0){a&&(a.classList.remove("fd-fresh","fd-aging","fd-stale"),a.classList.add("fd-unknown")),e.textContent="Data indisponível";return}const r=new Date(Math.max(...o.map(u=>u.getTime()))),n=Math.floor((Date.now()-r.getTime())/864e5);let s="fd-fresh";n>30?s="fd-stale":n>7&&(s="fd-aging"),a&&(a.classList.remove("fd-fresh","fd-aging","fd-stale","fd-unknown"),a.classList.add(s));const i=r.toLocaleDateString("pt-BR"),c=n<=0?"hoje":`há ${n} dia${n===1?"":"s"}`,m=s==="fd-stale"?"Dados desatualizados":"Dados";e.textContent=`${m} de ${i} (${c})`,a&&(a.title=`Última atualização dos dados: ${i} (${c})`,a.dataset.idadeDias=String(n),a.dataset.frescura=s.replace("fd-",""))}function ae(){const t=O?O.value:"",a=Y?Y.value:"",e=le?le.value.toLowerCase():"",o=pe&&parseFloat(pe.value)||0,r=ue?ue.value:"symbol-asc";B=E.filter(i=>{const c=!t||i.sector===t,m=!a||ot(i.headquarters)===a,u=!e||i.symbol.toLowerCase().includes(e)||i.name.toLowerCase().includes(e)||i.subIndustry&&i.subIndustry.toLowerCase().includes(e)||i.headquarters&&i.headquarters.toLowerCase().includes(e),p=!o||(parseFloat(i.dividendYield)||0)>=o;return c&&m&&u&&p});const[n,s]=r.split("-");B.sort((i,c)=>{let m=i[n],u=c[n];if(typeof m=="string"){const g=(m||"").localeCompare(u||"");return s==="asc"?g:-g}const p=parseFloat(m)||0,d=parseFloat(u)||0;return s==="asc"?p-d:d-p}),N=1,ge(),ve()}function ge(){if(!_){console.error("❌ tableBody não encontrado!");return}_.innerHTML="";const t=(N-1)*Ne,a=t+Ne;B.slice(t,a).forEach((o,r)=>{const n=re.has(o.symbol),s=l(o.symbol),i=document.createElement("tr");i.innerHTML=`
      <td>
        <input type="checkbox" class="row-checkbox" data-symbol="${s}" 
          ${n?"checked":""}>
      </td>
      <td class="col-index">${t+r+1}</td>
      <td><strong>${l(o.symbol)}</strong></td>
      <td>${l(o.name||"N/A")}</td>
      <td>${l(o.sectorName||o.sector||"N/A")}</td>
      <td>${J(o.marketCap)}</td>
      <td>${l(o.subIndustry||o.industry||"N/A")}</td>
      <td>${l(o.headquarters||"N/A")}</td>
      <td>${at(o)}</td>
    `;const c=i.querySelector(".row-checkbox");c.addEventListener("change",()=>{c.checked?re.add(o.symbol):re.delete(o.symbol),ve(),Qe()}),_.appendChild(i)}),Qe(),Bo()}function Qe(){if(!G||!_)return;const t=_.querySelectorAll(".row-checkbox"),a=Array.from(t).filter(e=>e.checked).length;G.checked=t.length>0&&a===t.length,G.indeterminate=a>0&&a<t.length}function Bo(){if(!te)return;te.innerHTML="";const t=Math.ceil(B.length/Ne),a=document.createElement("button");a.textContent="Anterior",a.disabled=N===1,a.addEventListener("click",()=>{N>1&&(N--,ge())}),te.appendChild(a);const e=document.createElement("span");e.textContent=`Página ${N} de ${t}`,te.appendChild(e);const o=document.createElement("button");o.textContent="Próxima",o.disabled=N===t,o.addEventListener("click",()=>{N<t&&(N++,ge())}),te.appendChild(o)}function ve(){if(!V)return;const t=B.length,a=re.size,e=B.filter(r=>Number(r.dividendYield)>0),o=e.length>0?(e.reduce((r,n)=>r+Number(n.dividendYield),0)/e.length).toFixed(2):"0.00";V.innerHTML=`Total: ${t} | Selecionadas: ${a} | Yield Médio (pagadoras): ${o}%`}async function $t(){const t=document.getElementById("stock-of-day-view");if(t){t.innerHTML=`
    <div class="stock-of-day-loading">
      <div class="loading-spinner"></div>
      <p>Analisando o mercado... selecionando a melhor oportunidade de hoje</p>
    </div>
  `;try{if(E.length===0&&await St(),E.length===0){t.innerHTML=`
        <div class="stock-of-day-error">
          <h3>⚠️ Dados indisponíveis</h3>
          <p>Não foi possível carregar as empresas do S&P 500. Verifique a conexão com o servidor.</p>
          <button class="retry-btn" onclick="loadStockOfDay()">Tentar novamente</button>
        </div>
      `;return}const a=new Date().toISOString().slice(0,10),e=jo(a);if(e){et(t,e);return}const o=await Ho();o.primary&&Uo(a,o),et(t,o)}catch(a){console.error("Erro ao carregar Ação do Dia:",a),t.innerHTML=`
      <div class="stock-of-day-error">
        <h3>⚠️ Indisponível no momento</h3>
        <p>Não foi possível gerar a análise. Tente novamente mais tarde.</p>
        <button class="retry-btn" onclick="loadStockOfDay()">Tentar novamente</button>
      </div>
    `}}}function Ho(){return new Promise(t=>{setTimeout(()=>{const a=new Date().toISOString().slice(0,10),e=qo(a),o=E.filter(c=>c.marketCap&&c.marketCap>1e9).map(c=>{const m=Fo(c),u=Oo(c.sector),p=(c.dividendYield||0)>2?10:0,d=Math.min(20,Math.log10(c.marketCap/1e9)*5),g=Yo(c),k=m+u+p+d+g;return{...c,score:Math.round(k*100)/100,breakdown:{technical:m,sector:u,dividend:p,liquidity:Math.round(d),volatility:Math.round(g)},rationale:zo(c,m,u,p)}}).sort((c,m)=>m.score-c.score);if(o.length===0){t({date:a,primary:null,alternatives:[],generatedAt:new Date().toISOString()});return}const r=o.slice(0,Math.min(10,o.length)),n=e%r.length,s=r[n],i=r.filter((c,m)=>m!==n).slice(0,3);t({date:a,primary:s,alternatives:i,generatedAt:new Date().toISOString()})},100)})}function qo(t){let a=0;for(let e=0;e<t.length;e++)a=(a<<5)-a+t.charCodeAt(e),a|=0;return Math.abs(a)}function Fo(t){let a=50;const e=t.dividendYield||0;e>4?a+=15:e>2?a+=8:e>0&&(a+=3);const o=t.marketCap||0;o>5e11?a+=10:o>1e11?a+=7:o>5e10?a+=5:o>1e10&&(a+=3);const r=(t.subIndustry||"").toLowerCase();["software","semiconductors","biotechnology","cloud","ai","cybersecurity","renewable"].some(s=>r.includes(s))&&(a+=12);const n=(t.name||"").toLowerCase();return["inc.","corporation","technologies","systems","solutions"].some(s=>n.includes(s))&&(a+=3),Math.min(90,a)}function Oo(t){return{"information-technology":15,"health-care":8,"consumer-discretionary":5,"communication-services":7,industrials:5,financials:3,materials:2,energy:0,utilities:-2,"real-estate":-3,"consumer-staples":1}[t]||0}function Yo(t){const a=t.marketCap||0;return a>2e11?8:a>5e10?12:a>1e10?15:18}function zo(t,a,e,o){const r=[];return a>60&&r.push("Fundamentos técnicos sólidos"),e>10&&r.push(`Setor em momento favorável (${t.sectorName})`),o&&r.push(`Dividend yield atrativo (${(t.dividendYield||0).toFixed(1)}%)`),t.marketCap>1e11&&r.push("Grande capitalização — liquidez e estabilidade"),r.length===0&&r.push("Equilíbrio entre risco e retorno"),r.join(" • ")}function jo(t){try{const a=localStorage.getItem("sp500-stock-of-day");if(!a)return null;const e=JSON.parse(a);return e.date===t&&e.primary?e:null}catch{return null}}function Uo(t,a){try{localStorage.setItem("sp500-stock-of-day",JSON.stringify(a))}catch{}}function et(t,a){const{primary:e,alternatives:o,generatedAt:r}=a;if(!e){t.innerHTML=`
      <div class="stock-of-day-error">
        <h3>⚠️ Sem dados suficientes</h3>
        <p>Não foi possível selecionar uma ação com os dados disponíveis.</p>
        <button class="retry-btn" onclick="loadStockOfDay()">Tentar novamente</button>
      </div>
    `;return}t.innerHTML=`
    <div class="stock-of-day-container">
      <header class="stock-of-day-header">
        <div class="stock-badge">
          <span class="badge-icon">🎯</span>
          <span class="badge-text">Ação do Dia</span>
        </div>
        <div class="stock-meta">
          <span class="stock-date">${new Date().toLocaleDateString("pt-BR",{weekday:"long",day:"numeric",month:"long"})}</span>
        </div>
      </header>

      <div class="stock-main-card">
        <div class="stock-identity">
          <div class="stock-symbol">${l(e.symbol)}</div>
          <div class="stock-name">${l(e.name)}</div>
          <div class="stock-sector">${l(e.sectorName||e.sector)}</div>
        </div>

        <div class="stock-score">
          <div class="score-circle" style="--score: ${e.score}">
            <span class="score-value">${e.score}</span>
            <span class="score-label">/ 100</span>
          </div>
          <div class="score-breakdown">
            ${Object.entries(e.breakdown).map(([n,s])=>`
              <div class="score-bar">
                <span class="bar-label">${n}</span>
                <div class="bar-track"><div class="bar-fill" style="width: ${Math.min(100,s*2)}%"></div></div>
                <span class="bar-value">${s}</span>
              </div>
            `).join("")}
          </div>
        </div>

        <div class="stock-rationale">
          <h4>🎯 Por que esta ação?</h4>
          <p>${e.rationale}</p>
        </div>

        <div class="stock-metrics">
          <div class="metric">
            <span class="metric-label">Market Cap</span>
            <span class="metric-value">${J(e.marketCap)}</span>
          </div>
          <div class="metric">
            <span class="metric-label">Div. Yield</span>
            <span class="metric-value">${(e.dividendYield||0).toFixed(2)}%</span>
          </div>
          <div class="metric">
            <span class="metric-label">Setor</span>
            <span class="metric-value">${l(e.sectorName||e.sector)}</span>
          </div>
          <div class="metric">
            <span class="metric-label">Sub-setor</span>
            <span class="metric-value">${l(e.subIndustry||"N/A")}</span>
          </div>
        </div>

        <div class="stock-actions">
          <button class="action-btn secondary" onclick="openCompanyDetails({symbol:'${e.symbol}',name:'${l(e.name).replace(/'/g,"\\'")}'})">
            📈 Ver Detalhes
          </button>
          <button class="action-btn ghost" onclick="setPriceAlertPrompt('${e.symbol}')">🔔 Criar Alerta</button>
        </div>
      </div>

      <section class="stock-alternatives">
        <h3>🥈 Menções Honrosas</h3>
        <div class="alternatives-grid">
          ${o.map((n,s)=>`
            <div class="alt-card">
              <span class="alt-rank">${s+2}º</span>
              <div class="alt-info">
                <div class="alt-symbol">${l(n.symbol)}</div>
                <div class="alt-name">${l(n.name)}</div>
              </div>
              <div class="alt-score">${n.score}</div>
            </div>
          `).join("")}
        </div>
      </section>

      <footer class="stock-disclaimer">
        <p><strong>⚠️ Disclaimer:</strong> Esta análise é gerada algoritmicamente com base em dados públicos e heurísticas quantitativas. Não constitui recomendação de investimento. Faça sua própria pesquisa (DYOR).</p>
        <p class="generated-at">Gerado em ${new Date(r).toLocaleTimeString("pt-BR")} • Baseado em ${E.length} empresas do S&P 500</p>
      </footer>
    </div>
  `}function Vo(t){const a=t.toUpperCase(),e=ne.get(a);if(e&&e.triggered){confirm(`${t}: alerta já disparado. Remover?`)&&Wo(a);return}const o=prompt(`Alerta de preço para ${t}:
Digite o preço alvo (ex: 150.25):`,e?e.target.toFixed(2):"");if(!o)return;const r=parseFloat(o);if(isNaN(r)||r<=0){alert("Preço inválido");return}const n=confirm(`Alertar quando o preço estiver ACIMA deste valor?
(OK = acima, Cancelar = abaixo)`)?"above":"below";Go(a,r,n)}function Go(t,a,e){return!t||typeof a!="number"||!["above","below"].includes(e)?!1:(ne.set(t.toUpperCase(),{target:a,direction:e,triggered:!1}),xe(),At(),!0)}function Wo(t){ne.delete(t.toUpperCase()),xe()}window.loadStockOfDay=$t;window.openCompanyDetails=Vt;window.setPriceAlertPrompt=Vo;const Ko=5*60*1e3;let ke=null,Te=!1;async function _o(){const t=[...ne.entries()].filter(([,o])=>!o.triggered);if(t.length===0)return[];const a=[],e=await Ft(t.map(([o])=>o));for(const[o,r]of t){const n=e[o],s=Number(n&&n.preco);if(!Number.isFinite(s))continue;(r.direction==="above"&&s>=r.target||r.direction==="below"&&s<=r.target)&&(r.triggered=!0,r.triggeredAt=new Date().toISOString(),r.triggeredPrice=s,a.push(`${o} ($${s.toFixed(2)})`))}return a.length>0&&(xe(),window.alert(`🔔 Alerta(s) de preço atingido(s): ${a.join(", ")}`)),a}async function Jo(){if(!(Te||ne.size===0)){Te=!0;try{await _o(),xe()}finally{Te=!1}}}function At(){ke||(ke=setInterval(Jo,Ko),typeof ke.unref=="function"&&ke.unref())}function Xo(t){return`"${(t==null?"":String(t)).replace(/"/g,'""')}"`}function Zo(){const t=["#","Símbolo","Empresa","Setor","Market Cap","Subindústria","Sede","Dividend Yield"],a=B.map((o,r)=>[r+1,o.symbol,o.name,o.sectorName,J(o.marketCap),o.subIndustry||o.industry||"N/A",o.headquarters||"N/A",at(o)]),e=[t,...a].map(o=>o.map(Xo).join(",")).join(`
`);Et(e,"sp500-export.csv","text/csv")}function Qo(){const t=JSON.stringify(B,null,2);Et(t,"sp500-export.json","application/json")}function Et(t,a,e){const o=new Blob([t],{type:e}),r=URL.createObjectURL(o),n=document.createElement("a");n.href=r,n.download=a,document.body.appendChild(n),n.click(),document.body.removeChild(n),URL.revokeObjectURL(r)}
