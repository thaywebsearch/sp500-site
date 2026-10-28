(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))o(r);new MutationObserver(r=>{for(const n of r)if(n.type==="childList")for(const i of n.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&o(i)}).observe(document,{childList:!0,subtree:!0});function t(r){const n={};return r.integrity&&(n.integrity=r.integrity),r.referrerPolicy&&(n.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?n.credentials="include":r.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function o(r){if(r.ep)return;r.ep=!0;const n=t(r);fetch(r.href,n)}})();const ct="https://sp500-api.onrender.com",R=ct,ye=[{id:"communication-services",name:"Communication Services"},{id:"consumer-discretionary",name:"Consumer Discretionary"},{id:"consumer-staples",name:"Consumer Staples"},{id:"energy",name:"Energy"},{id:"financials",name:"Financials"},{id:"health-care",name:"Health Care"},{id:"industrials",name:"Industrials"},{id:"information-technology",name:"Information Technology"},{id:"materials",name:"Materials"},{id:"real-estate",name:"Real Estate"},{id:"utilities",name:"Utilities"}];window.API_BASE_URL=R;window.SECTORS=ye;let Z=[],f=null,ue=0,be="",Fe="alfabética";async function dt(){try{const e=document.getElementById("daily-curiosity-view");if(!e){console.error("Elemento daily-curiosity-view não encontrado");return}e.innerHTML='<div class="curiosidade-loading">Carregando curiosidade...</div>';const a=await fetch(`${R}/api/curiosidades`);if(!a.ok){console.error(`Erro ao buscar curiosidades: ${a.status}`),e.innerHTML=`<div class="curiosidade-erro">Erro ao carregar curiosidades (${a.status})</div>`;return}const t=await a.json();if(!t.sucesso||!t.dados||!t.dados.curiosidades){console.error("Dados de curiosidades inválidos:",t),e.innerHTML='<div class="curiosidade-erro">Formato de dados inválido</div>';return}if(Z=t.dados.curiosidades,ue=t.dados.total||Z.length,be=t.dados.proximaEmpresa||"",Fe=t.dados.ordem||"alfabética",Z.length===0){e.innerHTML='<div class="curiosidade-erro">Nenhuma curiosidade disponível</div>';return}lt(),pt()}catch(e){console.error("Erro ao carregar curiosidades:",e);const a=document.getElementById("daily-curiosity-view");a&&(a.innerHTML=`<div class="curiosidade-erro">Erro ao carregar: ${e.message}</div>`)}}function lt(){if(Z.length===0)return;const e=new Date,a=new Date(e.getFullYear(),e.getMonth(),e.getDate()),o=Math.floor(a.getTime()/864e5)%Z.length;f=Z[o]}function pt(){const e=document.getElementById("daily-curiosity-view");if(!e||!f){console.error("View ou curiosidade não encontrada");return}mt();const a=`
    <div class="curiosidade-container">
      <div class="curiosidade-header">
        <h1>🌟 Curiosidade do Dia</h1>
        <p class="curiosidade-data">${gt()}</p>
      </div>

      <div class="curiosidade-card">
        <div class="curiosidade-simbolo">
          <span class="simbolo-badge">${f.simbolo}</span>
          <span class="posicao-badge">#${f.posicao}</span>
        </div>

        <div class="curiosidade-conteudo">
          <h2 class="curiosidade-empresa">${f.empresa}</h2>
          <p class="curiosidade-setor">
            <strong>Setor:</strong> ${f.setor||"N/A"}
          </p>

          <div class="curiosidade-titulo">
            <h3>${f.titulo}</h3>
          </div>

          <div class="curiosidade-descricao">
            <p>${f.descricao}</p>
          </div>

          ${f.fatos&&f.fatos.length>0?`
            <div class="curiosidade-fatos">
              <h4>📊 Fatos Interessantes:</h4>
              <ul>
                ${f.fatos.map(t=>`<li>${t}</li>`).join("")}
              </ul>
            </div>
          `:""}

          ${f.dividendYield?`
            <div class="curiosidade-dados">
              <p><strong>Dividend Yield:</strong> ${f.dividendYield}</p>
            </div>
          `:""}

          ${f.marketCap?`
            <div class="curiosidade-dados">
              <p><strong>Market Cap:</strong> ${f.marketCap}</p>
            </div>
          `:""}

          ${f.insight?`
            <div class="curiosidade-insight">
              <p><em>💡 ${f.insight}</em></p>
            </div>
          `:""}

          ${ue>0?`
            <div class="curiosidade-progresso">
              <div class="progresso-texto">
                <span>Rotatividade diária · ordem ${Fe}</span>
                <span>Empresa ${f.posicao} de ${ue}</span>
              </div>
              <div class="progresso-barra">
                <div class="progresso-preenchido" style="width: ${Number(f.posicao)/ue*100}%;"></div>
              </div>
            </div>
          `:""}

          <div class="curiosidade-acoes">
            <button class="btn-compartilhar" onclick="compartilharCuriosidade()">
              📤 Compartilhar
            </button>
            ${f.link?`
              <a href="${f.link}" target="_blank" class="btn-saibamais">
                🔗 Saiba Mais
              </a>
            `:""}
          </div>
        </div>
      </div>

      <div class="curiosidade-footer">
        <p>Curiosidade de ${f.empresa} - Atualizado em ${f.dataAdicao||"N/A"}</p>
        ${be?`<p class="curiosidade-proxima">⏭️ Amanhã: ${be}</p>`:""}
        <p class="curiosidade-dica">💡 Uma empresa diferente a cada dia, em ordem alfabética do S&P 500!</p>
      </div>
    </div>
  `;e.innerHTML=a,window.compartilharCuriosidade=ut}function mt(){if(document.getElementById("curiosidade-styles"))return;const e=document.createElement("style");e.id="curiosidade-styles",e.textContent=`
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
  `,document.head.appendChild(e)}function ut(){if(!f)return;const e=(f.fatos||[]).map(t=>`• ${t}`).join(`
`),a=`🌟 Curiosidade do Dia: ${f.empresa} (${f.simbolo})

${f.descricao}

${e}

💡 ${f.insight||""}`;navigator.share?navigator.share({title:`Curiosidade do Dia - ${f.empresa}`,text:a,url:window.location.href}).catch(t=>console.error("Erro ao compartilhar:",t)):navigator.clipboard.writeText(a).then(()=>{alert("Curiosidade copiada para a área de transferência!")}).catch(t=>{alert("Erro ao copiar: "+t)})}function gt(){const e=new Date,a={weekday:"long",year:"numeric",month:"long",day:"numeric"};return e.toLocaleDateString("pt-BR",a)}function G(e){const a=Number(e);return!a||Number.isNaN(a)?"N/A":a>=1e12?`$${(a/1e12).toFixed(3)}T`:a>=1e9?`$${(a/1e9).toFixed(2)}B`:a>=1e6?`$${(a/1e6).toFixed(2)}M`:`$${a.toLocaleString("en-US")}`}function Oe(e){if(!e||e.hasDividend==="Não")return"N/A";const a=Number(e.dividendYield);return Number.isFinite(a)?`${a.toFixed(2)}%`:"N/A"}function l(e){return e?String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;"):""}const yt=new Set(["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming","D.C."]);function Ye(e){if(!e)return"Desconhecido";const a=String(e).split(",").map(o=>o.trim().replace(/\[\d+\]$/,"")),t=a[a.length-1];return!t||t.toLowerCase()==="none"?"Desconhecido":yt.has(t)?"United States":t}async function ze(e){try{const a=await fetch(`${R}/api/historico/${e}`);if(!a.ok)throw new Error(`Erro ao buscar histórico de ${e}`);return(await a.json()).registros||[]}catch(a){return console.error(`Erro ao buscar histórico de ${e}:`,a),[]}}async function vt(){try{const e=await fetch(`${R}/api/inteligencia-setorial`);if(!e.ok)throw new Error(`HTTP ${e.status}`);return(await e.json()).dados||null}catch(e){return console.error("Erro ao buscar inteligência setorial:",e),null}}const pe=760,he=320,x={top:28,right:28,bottom:44,left:68};function ht(e){if(!e)return"";const[a,t,o]=e.split("-");return`${o}/${t}/${a.slice(2)}`}function ke(e){return Number.isFinite(e)?e>=100?`$${e.toFixed(0)}`:`$${e.toFixed(2)}`:"—"}function ft(e){const a=e.map(h=>h.close),t=Math.min(...a),o=Math.max(...a),r=o-t||1,n=t-r*.08,i=o+r*.08,s=e.length,c=h=>x.left+h/(s-1)*(pe-x.left-x.right),u=h=>x.top+(1-(h-n)/(i-n))*(he-x.top-x.bottom);let m=`<svg viewBox="0 0 ${pe} ${he}" style="width:100%;height:auto;display:block;background:var(--plot-bg);border-radius:8px">`;const p=5;for(let h=0;h<=p;h++){const C=n+(i-n)*h/p,S=u(C);m+=`<line x1="${x.left}" y1="${S.toFixed(1)}" x2="${pe-x.right}" y2="${S.toFixed(1)}" stroke="var(--chart-axis)" stroke-width="1"/>`,m+=`<text x="${x.left-8}" y="${(S+4).toFixed(1)}" text-anchor="end" font-size="11" fill="var(--chart-label)">${ke(C)}</text>`}const d=[];for(let h=0;h<=4;h++)d.push(Math.round((s-1)*h/4));d.forEach(h=>{const C=c(h);m+=`<text x="${C.toFixed(1)}" y="${he-x.bottom+18}" text-anchor="middle" font-size="11" fill="var(--chart-label)">${ht(e[h].data)}</text>`});const g=e.map((h,C)=>`${c(C).toFixed(1)},${u(h.close).toFixed(1)}`).join(" "),b=`${x.left},${u(n).toFixed(1)} `+g+` ${c(s-1).toFixed(1)},${u(n).toFixed(1)}`;m+=`<polygon points="${b}" fill="rgba(0, 212, 255, 0.08)"/>`,m+=`<polyline points="${g}" fill="none" stroke="var(--accent-cyan)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;const k=e[s-1],v=u(k.close);return m+=`<circle cx="${c(s-1).toFixed(1)}" cy="${v.toFixed(1)}" r="4" fill="var(--accent-cyan)"/>`,m+=`<text x="${pe-x.right}" y="${(v-10).toFixed(1)}" text-anchor="end" font-size="12" font-weight="700" fill="var(--chart-text)">${ke(k.close)}</text>`,m+="</svg>",m}async function bt(e,a){var r;(r=document.querySelector(".modal-overlay"))==null||r.remove();const t=document.createElement("div");t.className="modal-overlay";const o=()=>t.remove();t.addEventListener("click",n=>{n.target===t&&o()}),document.addEventListener("keydown",n=>{n.key==="Escape"&&o()}),t.innerHTML=`
    <div class="modal" role="dialog" aria-label="Histórico de ${l(e)}">
      <div class="modal-header">
        <h2 class="modal-title">
          📈 ${l(e)}
          <span class="modal-subtitle">${l(a||"")}</span>
        </h2>
        <button class="modal-close" aria-label="Fechar">✕</button>
      </div>
      <div class="modal-body" id="price-chart-body">
        <p class="modal-loading">Carregando histórico...</p>
      </div>
    </div>
  `,document.body.appendChild(t),t.querySelector(".modal-close").addEventListener("click",o);try{const n=await ze(e),i=t.querySelector("#price-chart-body");if(!n||n.length===0){i.innerHTML=`<p class="modal-error">Nenhum dado de preço disponível para ${l(e)}.</p>`;return}const s=n[0].close,c=n[n.length-1].close,u=(c-s)/s*100,m=u>=0,p=m?"positive":"negative";i.innerHTML=`
      <div class="price-stats">
        <div class="price-stat">
          <span class="price-stat-label">Último</span>
          <strong>${ke(c)}</strong>
        </div>
        <div class="price-stat">
          <span class="price-stat-label">Variação (2a)</span>
          <strong class="${p}">${m?"+":""}${u.toFixed(2)}%</strong>
        </div>
        <div class="price-stat">
          <span class="price-stat-label">Período</span>
          <strong>${n.length} pregões</strong>
        </div>
      </div>
      ${ft(n)}
    `}catch(n){console.error(`Erro ao buscar histórico de ${e}:`,n);const i=t.querySelector("#price-chart-body");i.innerHTML=`<p class="modal-error">Erro ao carregar o histórico de ${l(e)}. Verifique se o backend está online.</p>`}}function T(e,a){return`
    <div class="company-detail">
      <span class="company-detail-label">${e}</span>
      <strong class="company-detail-value">${a}</strong>
    </div>
  `}function kt(e){var n;(n=document.querySelector(".modal-overlay"))==null||n.remove();const a=document.createElement("div");a.className="modal-overlay";const t=()=>a.remove();a.addEventListener("click",i=>{i.target===a&&t()}),document.addEventListener("keydown",i=>{i.key==="Escape"&&t()});const o=e.dividendYield!==null&&e.dividendYield!==void 0?`${e.dividendYield.toFixed(2)}%`:"—",r=G(e.marketCap);a.innerHTML=`
    <div class="modal" role="dialog" aria-label="Detalhes de ${l(e.symbol)}">
      <div class="modal-header">
        <h2 class="modal-title">
          💼 ${l(e.symbol)}
          <span class="modal-subtitle">${l(e.name||"")}</span>
        </h2>
        <button class="modal-close" aria-label="Fechar">✕</button>
      </div>
      <div class="modal-body">
        <div class="company-details-grid">
          ${T("Empresa",l(e.name||"N/A"))}
          ${T("Setor",l(e.sectorName||e.sector||"N/A"))}
          ${T("Subindústria",l(e.subIndustry||"N/A"))}
          ${T("Sede",l(e.headquarters||"N/A"))}
          ${T("Market Cap",r)}
          ${T("Classificação",l(e.marketCapClassification||"N/A"))}
          ${T("Div. Yield",o)}
          ${T("Paga dividendos",e.hasDividend?l(e.hasDividend):"—")}
          ${T("Data de inclusão",l(e.dateAdded||"N/A"))}
          ${T("CIK",e.cik?l(String(e.cik)):"N/A")}
          ${T("Fundação",l(e.founded||"N/A"))}
        </div>
        <div class="modal-footer">
          <button class="modal-action" id="details-chart-btn">📈 Ver histórico de preços</button>
        </div>
      </div>
    </div>
  `,document.body.appendChild(a),a.querySelector(".modal-close").addEventListener("click",t),a.querySelector("#details-chart-btn").addEventListener("click",()=>{bt(e.symbol,e.name)})}function Ct(e,a){const t=e/a*100;return t>=80?"#ff5252":t>=60?"#ff9800":t>=40?"#ffeb3b":t>=20?"#8bc34a":"#4caf50"}async function wt(){const e=document.getElementById("treemap-view");if(e){e.style.display="flex",e.style.flexDirection="column",e.style.height="100%",e.style.width="100%",e.style.margin="0",e.style.padding="0",e.style.background="var(--bg-primary)",e.innerHTML='<div style="display:flex;align-items:center;justify-content:center;height:100%;width:100%;font-size:14px;color:var(--text-secondary)">Carregando mapa de setores...</div>';try{const o=(await(await fetch(`${window.API_BASE_URL}/api/setores`)).json()).setores||[],r=await Promise.all(o.map(async s=>{var k;const u=await(await fetch(`${window.API_BASE_URL}/api/setor/${s}`)).json(),m=window.SECTORS.find(v=>v.id===s),p=((k=u.dados)==null?void 0:k.companies)||[],d=p.reduce((v,h)=>v+(h.marketCap||0),0),g=p.length>0?p.reduce((v,h)=>v+(h.dividendYield||0),0)/p.length:0,b=p.filter(v=>v.hasDividend==="Sim").length;return{id:s,name:(m==null?void 0:m.name)||s,cap:(d/1e9).toFixed(1),companies:p.length,avgDiv:parseFloat(g.toFixed(2)),withDiv:b,topCompany:p.length>0?p[0].symbol:"N/A"}})),n=Math.max(...r.map(s=>parseFloat(s.cap)));let i=`
      <div style="
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%;
        padding: 40px;
        box-sizing: border-box;
        overflow-y: auto;
        gap: 40px;
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
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          flex: 1;
        ">
    `;r.forEach(s=>{const c=Ct(parseFloat(s.cap),n),u=(parseFloat(s.cap)/n*100).toFixed(1),m=["consumer-staples","communication-services","consumer-discretionary","energy","financials","health-care","industrials","information-technology","materials","real-estate","utilities"].includes(s.id),p=m?new URL(`sector.html?sector=${s.id}`,document.baseURI).href:"#";i+=`
        <div style="
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 24px;
          transition: all 0.3s ease;
          cursor: ${m?"pointer":"not-allowed"};
          display: flex;
          flex-direction: column;
          gap: 20px;
          opacity: ${m?"1":"0.7"};
        "
        onmouseover="${m?`this.style.borderColor='${c}';this.style.background='rgba(${parseInt(c.slice(1,3),16)},${parseInt(c.slice(3,5),16)},${parseInt(c.slice(5,7),16)},0.05)';this.style.transform='translateY(-4px)';this.style.boxShadow='0 12px 32px ${c}22'`:""}"
        onmouseout="${m?"this.style.borderColor='var(--border)';this.style.background='var(--bg-secondary)';this.style.transform='translateY(0)';this.style.boxShadow='none'":""}"
        onclick="${m?`navigateToSector('${p}', '${s.id}')`:`alert('🔒 O setor \\"${s.name}\\" ainda está em desenvolvimento.\\n\\nApenas Consumer Staples, Communication Services, Consumer Discretionary, Energy, Financials, Health Care, Industrials, Information Technology, Materials, Real Estate e Utilities estão disponíveis por enquanto!')`}"
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
              ">${s.name}</div>
              <div style="
                font-size: 12px;
                color: var(--text-secondary);
              ">${s.companies} empresas</div>
            </div>
            <div style="
              background: ${c}22;
              border: 1px solid ${c}44;
              padding: 8px 12px;
              border-radius: 6px;
              font-size: 13px;
              font-weight: 700;
              color: ${c};
              text-align: center;
            ">
              ${u}%
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
                width: ${u}%;
                height: 100%;
                background: linear-gradient(90deg, ${c}44, ${c});
                transition: width 0.3s ease;
              "></div>
            </div>
          </div>

          <!-- Grid de Métricas -->
          <div style="
            display: grid;
            grid-template-columns: 1fr 1fr;
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
                color: ${c};
              ">$${s.cap}B</div>
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
              ">${s.topCompany}</div>
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
              ">${s.avgDiv.toFixed(2)}%</div>
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
              ">${s.withDiv}/${s.companies}</div>
            </div>
          </div>

          <!-- CTA Button -->
          ${m?`
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
      `}),i+=`
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
    `,e.innerHTML=i}catch(a){console.error("Erro ao carregar treemap:",a),e.innerHTML='<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--accent-red)">Erro ao carregar mapa de setores</div>'}}}function xt(e,a){if(e==="#"){alert(`🔒 O setor "${a}" ainda está em desenvolvimento.

Apenas Consumer Staples, Communication Services, Consumer Discretionary, Energy, Financials, Health Care, Industrials, Information Technology, Materials, Real Estate e Utilities estão disponíveis por enquanto!`);return}window.open(e,"_blank")}window.navigateToSector=xt;async function St(){var a;const e=document.getElementById("heatmap-view");if(e){e.style.display="flex",e.style.flexDirection="column",e.style.height="100%",e.style.width="100%",e.style.padding="40px",e.style.boxSizing="border-box",e.style.background="var(--bg-primary)",e.style.overflowY="auto",e.innerHTML='<div style="text-align:center;color:var(--text-secondary)">Carregando heatmap...</div>';try{const r=(await(await fetch(`${window.API_BASE_URL}/api/setores`)).json()).setores||[];let n=`
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
    `;for(const i of r){const c=await(await fetch(`${window.API_BASE_URL}/api/setor/${i}`)).json(),u=window.SECTORS.find(d=>d.id===i),m=((a=c.dados)==null?void 0:a.companies)||[];if(m.length===0)continue;const p=m.sort((d,g)=>(g.marketCap||0)-(d.marketCap||0)).slice(0,4);n+=`
        <div style="margin-bottom: 40px;">
          <h3 style="
            font-size: 16px;
            margin: 0 0 20px 0;
            color: var(--text-primary);
            font-weight: 600;
          ">${(u==null?void 0:u.name)||i}</h3>

          <div style="
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 16px;
          ">
      `,p.forEach((d,g)=>{const b=(d.marketCap/1e9).toFixed(2),k=(d.dividendYield||0).toFixed(2);let v="#4caf50";b>500?v="#ff5252":b>200?v="#ff9800":b>100?v="#ffeb3b":b>50&&(v="#8bc34a"),n+=`
          <div style="
            background: linear-gradient(135deg, rgba(0, 212, 255, 0.05) 0%, rgba(0, 230, 118, 0.02) 100%);
            border: 1px solid var(--border);
            border-radius: 8px;
            padding: 16px;
            transition: all 0.3s ease;
          "
          onmouseover="this.style.borderColor='${v}';this.style.background='linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(0, 230, 118, 0.05) 100%)';this.style.transform='translateY(-2px)'"
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
              ">${d.symbol}</div>
              <div style="
                font-size: 11px;
                background: ${v}22;
                color: ${v};
                padding: 4px 8px;
                border-radius: 4px;
                font-weight: 600;
              ">
                #${g+1}
              </div>
            </div>

            <div style="
              font-size: 12px;
              color: var(--text-secondary);
              margin-bottom: 12px;
              word-break: break-word;
            ">
              ${d.name}
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
                  color: ${v};
                ">$${b}B</div>
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
                ">${k}%</div>
              </div>
            </div>
          </div>
        `}),n+=`
          </div>
        </div>
      `}n+=`
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
    `,e.innerHTML=n}catch(t){console.error("Erro ao carregar heatmap:",t),e.innerHTML=`
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
        ">${t.message}</div>
      </div>
    `}}}const $t={Energy:"#FF6B6B",Materials:"#C92A2A",Industrials:"#FFA94D","Consumer Discretionary":"#FFD43B","Consumer Staples":"#A9E34B","Health Care":"#51CF66",Financials:"#40C057","Information Technology":"#339AF0","Communication Services":"#748FFC",Utilities:"#9775FA","Real Estate":"#DA77F2"};function je(e){return $t[e]||"#808080"}function Ee(e){if(!e)return 0;if(typeof e=="number")return e;const t=String(e).toUpperCase().trim().replace(/[$€¥₹]/g,"").trim();return t.includes("T")?parseFloat(t.replace("T",""))*1e12:t.includes("B")?parseFloat(t.replace("B",""))*1e9:t.includes("M")?parseFloat(t.replace("M",""))*1e6:parseFloat(t)||0}function At(e){if(!e)return 0;if(typeof e=="number")return e;const a=String(e).trim();return parseFloat(a.replace("%",""))||0}function Et(e,a){const t=document.getElementById(a);if(!t){console.error(`❌ Contentor ${a} não encontrado!`);return}t.innerHTML="";const o=e.filter(y=>Ee(y.marketCap)>0&&y.sectorName).map((y,I)=>({symbol:y.symbol,name:y.name,sector:y.sectorName,marketCap:Ee(y.marketCap),dividendYield:At(y.dividendYield),index:I}));if(o.length===0){t.innerHTML="<p>Sem dados disponíveis para o gráfico de bolhas.</p>";return}const r={top:40,right:40,bottom:60,left:60},n=Math.max(window.innerWidth-100,800)-r.left-r.right,i=600-r.top-r.bottom,s=Math.min(...o.map(y=>y.dividendYield)),c=Math.max(...o.map(y=>y.dividendYield)),u=Math.min(...o.map(y=>y.marketCap)),m=Math.max(...o.map(y=>y.marketCap)),p=y=>i-(y-s)/(c-s||1)*i,d=y=>5+(y-u)/(m-u||1)*50,g=(()=>{let y=42;return()=>(y=(y*9301+49297)%233280,y/233280)})(),b=o.map(()=>g()*n),k=document.createElementNS("http://www.w3.org/2000/svg","svg");k.setAttribute("width",n+r.left+r.right),k.setAttribute("height",i+r.top+r.bottom),k.style.cssText="display: block; margin: 20px auto; background: var(--plot-bg); border-radius: 8px;";const v=document.createElementNS("http://www.w3.org/2000/svg","g");v.setAttribute("transform",`translate(${r.left},${r.top})`);for(let y=0;y<=10;y++){const I=y/10*i,le=s+y/10*(c-s),$=document.createElementNS("http://www.w3.org/2000/svg","line");$.setAttribute("x1",0),$.setAttribute("y1",I),$.setAttribute("x2",n),$.setAttribute("y2",I),$.setAttribute("stroke","var(--chart-axis)"),$.setAttribute("stroke-width","1"),$.setAttribute("stroke-dasharray","4"),v.appendChild($);const A=document.createElementNS("http://www.w3.org/2000/svg","text");A.setAttribute("x",-10),A.setAttribute("y",I+5),A.setAttribute("text-anchor","end"),A.setAttribute("font-size","12"),A.setAttribute("fill","var(--chart-label)"),A.textContent=le.toFixed(1)+"%",v.appendChild(A)}const h=document.createElementNS("http://www.w3.org/2000/svg","line");h.setAttribute("x1",0),h.setAttribute("y1",0),h.setAttribute("x2",0),h.setAttribute("y2",i),h.setAttribute("stroke","var(--chart-label)"),h.setAttribute("stroke-width","2"),v.appendChild(h);const C=document.createElementNS("http://www.w3.org/2000/svg","text");C.setAttribute("transform","rotate(-90)"),C.setAttribute("y",-40),C.setAttribute("x",-i/2),C.setAttribute("text-anchor","middle"),C.setAttribute("font-size","14"),C.setAttribute("font-weight","bold"),C.setAttribute("fill","var(--chart-text)"),C.textContent="💵 Dividend Yield (%)",v.appendChild(C);const S=document.createElementNS("http://www.w3.org/2000/svg","line");S.setAttribute("x1",0),S.setAttribute("y1",i),S.setAttribute("x2",n),S.setAttribute("y2",i),S.setAttribute("stroke","var(--chart-label)"),S.setAttribute("stroke-width","2"),v.appendChild(S);const B=document.createElementNS("http://www.w3.org/2000/svg","text");B.setAttribute("x",n/2),B.setAttribute("y",i+45),B.setAttribute("text-anchor","middle"),B.setAttribute("font-size","14"),B.setAttribute("font-weight","bold"),B.setAttribute("fill","var(--chart-text)"),B.textContent="📊 Distribuição Aleatória (cada bolha = empresa)",v.appendChild(B),o.forEach((y,I)=>{const le=b[I],$=p(y.dividendYield),A=d(y.marketCap),it=je(y.sector),w=document.createElementNS("http://www.w3.org/2000/svg","circle");if(w.setAttribute("cx",le),w.setAttribute("cy",$),w.setAttribute("r",A),w.setAttribute("fill",it),w.setAttribute("opacity","0.7"),w.setAttribute("stroke","#fff"),w.setAttribute("stroke-width","2"),w.style.cursor="pointer",w.style.transition="all 0.3s ease",w.addEventListener("mouseover",E=>{w.setAttribute("opacity","1"),w.setAttribute("stroke-width","3"),Mt(E,y)}),w.addEventListener("mouseout",()=>{w.setAttribute("opacity","0.7"),w.setAttribute("stroke-width","2"),Ue()}),v.appendChild(w),A>15){const E=document.createElementNS("http://www.w3.org/2000/svg","text");E.setAttribute("x",le),E.setAttribute("y",$+5),E.setAttribute("text-anchor","middle"),E.setAttribute("font-size",Math.max(10,A/2)),E.setAttribute("font-weight","bold"),E.setAttribute("fill","#fff"),E.setAttribute("pointer-events","none"),E.textContent=y.symbol.substring(0,3),v.appendChild(E)}}),k.appendChild(v),t.appendChild(k),Tt(t,o)}function Tt(e,a){const t=document.createElement("div");t.style.cssText=`
    margin: 30px auto;
    max-width: 800px;
    padding: 20px;
    background: var(--surface);
    border-radius: 8px;
    border: 1px solid var(--border);
  `;const o=document.createElement("h3");o.textContent="🫧 Como ler o gráfico",o.style.cssText="margin: 0 0 12px 0; color: var(--text-primary);",t.appendChild(o);const r=document.createElement("div");r.style.cssText="margin-bottom: 16px; font-size: 13px; color: var(--text-secondary); line-height: 1.8;",r.innerHTML=`
    <div><strong>Tamanho da bolha:</strong> Market Cap da empresa (quanto maior, mais valiosa)</div>
    <div><strong>Eixo Y (vertical):</strong> Dividend Yield (mais acima = maior dividendo)</div>
    <div><strong>Eixo X (horizontal):</strong> posição aleatória, apenas para facilitar a visualização</div>
    <div><strong>Cor:</strong> setor da empresa</div>
  `,t.appendChild(r);const n=document.createElement("div");n.textContent="Setores",n.style.cssText="font-size: 13px; font-weight: 600; color: var(--text-primary); margin-bottom: 8px;",t.appendChild(n);const i=new Set(a.map(c=>c.sector)),s=document.createElement("div");s.style.cssText="display: flex; flex-wrap: wrap; gap: 12px;",i.forEach(c=>{const u=document.createElement("div");u.style.cssText="display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text-primary);";const m=document.createElement("span");m.style.cssText=`display: inline-block; width: 14px; height: 14px; border-radius: 50%; background: ${je(c)};`;const p=document.createElement("span");p.textContent=c,u.appendChild(m),u.appendChild(p),s.appendChild(u)}),t.appendChild(s),e.appendChild(t)}let ge=null;function Mt(e,a){Ue();const t=document.createElement("div");t.style.cssText=`
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
  `;const o=a.marketCap>=1e12?(a.marketCap/1e12).toFixed(2)+"T":a.marketCap>=1e9?(a.marketCap/1e9).toFixed(2)+"B":(a.marketCap/1e6).toFixed(2)+"M";t.innerHTML=`
    <strong>${a.symbol}</strong> — ${a.name}<br>
    <strong>Setor:</strong> ${a.sector}<br>
    <strong>Market Cap:</strong> $${o}<br>
    <strong>Dividend Yield:</strong> ${a.dividendYield.toFixed(2)}%
  `;const r=e.target.getBoundingClientRect();t.style.left=r.left+10+"px",t.style.top=r.top-10+"px",document.body.appendChild(t),ge=t}function Ue(){ge&&(ge.remove(),ge=null)}function N(e){const a=Number(e&&e.dividendYield);return Number.isFinite(a)&&a>0?a:0}function de(e){return(e||[]).filter(a=>N(a)>0)}function Lt(e){const a=de(e);return a.length===0?0:a.reduce((o,r)=>o+N(r),0)/a.length}function It(e){const a=de(e).map(N).sort((o,r)=>o-r);if(a.length===0)return 0;const t=Math.floor(a.length/2);return a.length%2===0?(a[t-1]+a[t])/2:a[t]}function Dt(e){const a=e||[],t=de(a),o=t.map(N);return{total:a.length,payers:t.length,nonPayers:a.length-t.length,payerRatio:a.length>0?t.length/a.length:0,avgYield:Lt(a),medianYield:It(a),maxYield:o.length>0?Math.max(...o):0}}function Rt(e,a=15){return de(e).slice().sort((t,o)=>N(o)-N(t)||String(t.symbol).localeCompare(String(o.symbol))).slice(0,a)}const Nt=[{label:"0–1%",min:0,max:1},{label:"1–2%",min:1,max:2},{label:"2–3%",min:2,max:3},{label:"3–4%",min:3,max:4},{label:"4–5%",min:4,max:5},{label:"5%+",min:5,max:1/0}];function Pt(e){const a=de(e);return Nt.map(t=>({label:t.label,count:a.filter(o=>{const r=N(o);return r>=t.min&&r<t.max}).length}))}function Bt(e){const a=new Map;for(const t of e||[]){const o=t.sectorName||t.sector||"N/A";a.has(o)||a.set(o,{sector:o,total:0,payers:0,yieldSum:0});const r=a.get(o);r.total+=1;const n=N(t);n>0&&(r.payers+=1,r.yieldSum+=n)}return Array.from(a.values()).map(t=>({sector:t.sector,total:t.total,payers:t.payers,avgYield:t.payers>0?t.yieldSum/t.payers:0})).sort((t,o)=>o.avgYield-t.avgYield||t.sector.localeCompare(o.sector))}const te=e=>`${Number(e).toFixed(2)}%`,Te=e=>`${(e*100).toFixed(0)}%`;function Ht(e,a){const t=document.getElementById(a);if(!t){console.error(`❌ Contentor ${a} não encontrado!`);return}const o=e||[];if(o.length===0){t.innerHTML='<div class="treemap-container"><p>Sem dados disponíveis para o painel de dividendos.</p></div>';return}const r=Dt(o),n=Rt(o),i=Pt(o),s=Bt(o),c=Math.max(1,...i.map(d=>d.count)),u=n.map((d,g)=>`
      <tr class="dividend-row" data-dividend-symbol="${l(d.symbol)}" data-dividend-name="${l(d.name||d.symbol)}">
        <td class="col-index">${g+1}</td>
        <td><strong>${l(d.symbol)}</strong></td>
        <td>${l(d.name||"N/A")}</td>
        <td>${l(d.sectorName||d.sector||"N/A")}</td>
        <td class="dividend-yield">${te(N(d))}</td>
      </tr>`).join(""),m=i.map(d=>`
      <div class="dividend-bucket">
        <span class="dividend-bucket-label">${d.label}</span>
        <div class="dividend-bucket-track">
          <div class="dividend-bucket-fill" style="width: ${d.count/c*100}%"></div>
        </div>
        <span class="dividend-bucket-count">${d.count}</span>
      </div>`).join(""),p=s.map(d=>`
      <tr>
        <td>${l(d.sector)}</td>
        <td class="col-index">${d.payers} / ${d.total}</td>
        <td class="dividend-yield">${te(d.avgYield)}</td>
      </tr>`).join("");t.innerHTML=`
    <div class="dividends-view">
      <header class="treemap-header">
        <h2>💰 Dividendos</h2>
        <p class="subtitle">
          Renda por dividendos no S&amp;P 500 — ${r.payers} de ${r.total} empresas
          pagam dividendos (${Te(r.payerRatio)}).
        </p>
      </header>

      <div class="treemap-stats">
        <div class="stat-card">
          <span class="stat-label">Empresas</span>
          <span class="stat-value">${r.total}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Pagadoras</span>
          <span class="stat-value">${r.payers} (${Te(r.payerRatio)})</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Yield médio</span>
          <span class="stat-value">${te(r.avgYield)}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Yield mediano</span>
          <span class="stat-value">${te(r.medianYield)}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Maior yield</span>
          <span class="stat-value">${te(r.maxYield)}</span>
        </div>
      </div>

      <div class="dividend-columns">
        <section class="dividend-panel">
          <h3>🏆 Top por Dividend Yield</h3>
          <table class="dividend-table">
            <thead>
              <tr><th>#</th><th>Símbolo</th><th>Empresa</th><th>Setor</th><th>Yield</th></tr>
            </thead>
            <tbody>${u}</tbody>
          </table>
        </section>

        <section class="dividend-panel">
          <h3>📊 Distribuição por faixa</h3>
          <div class="dividend-buckets">${m}</div>
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
  `,t.querySelectorAll(".dividend-row").forEach(d=>{d.addEventListener("click",()=>{typeof window.openCompanyDetails=="function"&&window.openCompanyDetails({symbol:d.dataset.dividendSymbol,name:d.dataset.dividendName})})})}const W=[{company:"3M",ticker:"MMM",sector:"Industrials"},{company:"American Express",ticker:"AXP",sector:"Financials"},{company:"Amgen",ticker:"AMGN",sector:"Health Care"},{company:"Apple",ticker:"AAPL",sector:"Information Technology"},{company:"Boeing",ticker:"BA",sector:"Industrials"},{company:"Caterpillar",ticker:"CAT",sector:"Industrials"},{company:"Chevron",ticker:"CVX",sector:"Energy"},{company:"Cisco Systems",ticker:"CSCO",sector:"Information Technology"},{company:"Coca-Cola",ticker:"KO",sector:"Consumer Staples"},{company:"Dow Inc.",ticker:"DOW",sector:"Materials"},{company:"Goldman Sachs",ticker:"GS",sector:"Financials"},{company:"Home Depot",ticker:"HD",sector:"Consumer Discretionary"},{company:"Honeywell",ticker:"HON",sector:"Industrials"},{company:"IBM",ticker:"IBM",sector:"Information Technology"},{company:"Intel",ticker:"INTC",sector:"Information Technology"},{company:"Johnson & Johnson",ticker:"JNJ",sector:"Health Care"},{company:"JPMorgan Chase",ticker:"JPM",sector:"Financials"},{company:"McDonald's",ticker:"MCD",sector:"Consumer Discretionary"},{company:"Merck",ticker:"MRK",sector:"Health Care"},{company:"Microsoft",ticker:"MSFT",sector:"Information Technology"},{company:"Nike",ticker:"NKE",sector:"Consumer Discretionary"},{company:"Procter & Gamble",ticker:"PG",sector:"Consumer Staples"},{company:"Salesforce",ticker:"CRM",sector:"Information Technology"},{company:"The Travelers Companies",ticker:"TRV",sector:"Financials"},{company:"UnitedHealth Group",ticker:"UNH",sector:"Health Care"},{company:"Verizon",ticker:"VZ",sector:"Communication Services"},{company:"Visa",ticker:"V",sector:"Financials"},{company:"Walgreens Boots Alliance",ticker:"WBA",sector:"Consumer Staples"},{company:"Walt Disney",ticker:"DIS",sector:"Communication Services"},{company:"Nvidia",ticker:"NVDA",sector:"Information Technology"}],qt={"Communication Services":"#00d4ff","Consumer Discretionary":"#ffab00","Consumer Staples":"#00e676",Energy:"#ff5252",Financials:"#ba68c8","Health Care":"#29b6f6",Industrials:"#ffa726","Information Technology":"#00d4ff",Materials:"#66bb6a","Real Estate":"#ec407a",Utilities:"#42a5f5"};function Ft(e){return String(e||"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")}function Ot(e){return qt[e]||"#00d4ff"}function Ve(e){return`dow-sector--${Ft(e)}`}function Yt(e,{search:a="",sector:t=""}={}){const o=String(a).toLowerCase().trim();return(e||[]).filter(r=>{const n=!o||String(r.company).toLowerCase().includes(o)||String(r.ticker).toLowerCase().includes(o),i=!t||r.sector===t;return n&&i})}function zt(e,a="company"){return[...e||[]].sort((t,o)=>{switch(a){case"ticker":return t.ticker.localeCompare(o.ticker);case"sector":return t.sector.localeCompare(o.sector)||t.company.localeCompare(o.company);default:return t.company.localeCompare(o.company)}})}function Me(e){return[...new Set((e||[]).map(a=>a.sector))].sort()}function jt(e){const a=new Map;return(e||[]).forEach(t=>{a.has(t.sector)||a.set(t.sector,[]),a.get(t.sector).push(t.company)}),[...a.entries()].map(([t,o])=>({sector:t,companies:o,count:o.length})).sort((t,o)=>o.count-t.count||t.sector.localeCompare(o.sector))}function Ut(e){return(e||[]).filter(a=>a.sector==="Information Technology").length}function Vt(e){return`<div class="dow-cards">${(e||[]).map(t=>`
      <article class="dow-card">
        <div class="dow-card-head">
          <h3>${l(t.company)}</h3>
          <span class="dow-ticker">${l(t.ticker)}</span>
        </div>
        <span class="dow-sector ${Ve(t.sector)}">${l(t.sector)}</span>
      </article>`).join("")}</div>`}function Gt(e){return`
    <div class="dow-table-wrapper">
      <table class="dow-table">
        <thead>
          <tr>
            <th data-sort="company">Empresa</th>
            <th data-sort="ticker">Ticker</th>
            <th data-sort="sector">Setor</th>
          </tr>
        </thead>
        <tbody>${(e||[]).map(t=>`
      <tr>
        <td><strong>${l(t.company)}</strong></td>
        <td><span class="dow-ticker">${l(t.ticker)}</span></td>
        <td><span class="dow-sector ${Ve(t.sector)}">${l(t.sector)}</span></td>
      </tr>`).join("")}</tbody>
      </table>
    </div>`}function Wt(e="dow-jones-view"){const a=document.getElementById(e);if(!a){console.error(`❌ Contentor ${e} não encontrado!`);return}const t={search:"",sector:"",sortBy:"company",view:"cards"},o=Me(W).length,r=Me(W).map(d=>`<option value="${l(d)}">${l(d)}</option>`).join(""),n=jt(W).map(d=>`
      <div class="dow-breakdown-item">
        <div class="dow-breakdown-head" style="color: ${Ot(d.sector)}">
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
            <span class="dow-stat-value">${W.length}</span>
            <span class="dow-stat-label">Empresas</span>
          </div>
          <div class="dow-stat">
            <span class="dow-stat-value">${o}</span>
            <span class="dow-stat-label">Setores</span>
          </div>
          <div class="dow-stat">
            <span class="dow-stat-value">${Ut(W)}</span>
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
  `;const i=a.querySelector("#dow-results"),s=a.querySelector("#dow-search"),c=a.querySelector("#dow-sector"),u=a.querySelector("#dow-sort"),m=a.querySelectorAll(".dow-view-btn");function p(){const d=zt(Yt(W,{search:t.search,sector:t.sector}),t.sortBy);if(d.length===0){i.innerHTML='<p class="dow-empty">Nenhuma empresa encontrada.</p>';return}i.innerHTML=t.view==="table"?Gt(d):Vt(d),t.view==="table"&&i.querySelectorAll("th[data-sort]").forEach(g=>{g.addEventListener("click",()=>{t.sortBy=g.dataset.sort,u&&(u.value=t.sortBy),p()})})}s&&s.addEventListener("input",()=>{t.search=s.value,p()}),c&&c.addEventListener("change",()=>{t.sector=c.value,p()}),u&&u.addEventListener("change",()=>{t.sortBy=u.value,p()}),m.forEach(d=>{d.addEventListener("click",()=>{t.view=d.dataset.view,m.forEach(g=>g.classList.toggle("active",g===d)),p()})}),p()}const ae=[{company:"American States Water",ticker:"AWR",sector:"Utilities"},{company:"California Water Service",ticker:"CWT",sector:"Utilities"},{company:"Northwest Natural",ticker:"NWN",sector:"Utilities"},{company:"Procter & Gamble",ticker:"PG",sector:"Consumer Defensive"},{company:"Coca-Cola",ticker:"KO",sector:"Consumer Defensive"},{company:"Johnson & Johnson",ticker:"JNJ",sector:"Healthcare"},{company:"Colgate-Palmolive",ticker:"CL",sector:"Consumer Defensive"},{company:"Genuine Parts",ticker:"GPC",sector:"Consumer Cyclical"},{company:"Emerson Electric",ticker:"EMR",sector:"Industrials"},{company:"Dover",ticker:"DOV",sector:"Industrials"},{company:"Lowe's",ticker:"LOW",sector:"Consumer Cyclical"},{company:"Federal Realty",ticker:"FRT",sector:"Real Estate"},{company:"ABM Industries",ticker:"ABM",sector:"Industrials"},{company:"Stepan",ticker:"SCL",sector:"Basic Materials"},{company:"H.B. Fuller",ticker:"FUL",sector:"Basic Materials"},{company:"Universal Corp",ticker:"UVV",sector:"Consumer Defensive"},{company:"Hormel Foods",ticker:"HRL",sector:"Consumer Defensive"},{company:"Kimberly-Clark",ticker:"KMB",sector:"Consumer Defensive"},{company:"Middlesex Water",ticker:"MSEX",sector:"Utilities"},{company:"MSA Safety",ticker:"MSA",sector:"Industrials"},{company:"PPG Industries",ticker:"PPG",sector:"Basic Materials"},{company:"RPM International",ticker:"RPM",sector:"Basic Materials"},{company:"Black Hills",ticker:"BKH",sector:"Utilities"},{company:"National Fuel Gas",ticker:"NFG",sector:"Energy"},{company:"PepsiCo",ticker:"PEP",sector:"Consumer Defensive"},{company:"Altria",ticker:"MO",sector:"Consumer Defensive"},{company:"Stanley Black & Decker",ticker:"SWK",sector:"Industrials"},{company:"Target",ticker:"TGT",sector:"Consumer Cyclical"},{company:"Sysco",ticker:"SYY",sector:"Consumer Defensive"},{company:"Cincinnati Financial",ticker:"CINF",sector:"Financials"},{company:"Tootsie Roll",ticker:"TR",sector:"Consumer Defensive"},{company:"Gorman-Rupp",ticker:"GRC",sector:"Industrials"},{company:"Pentair",ticker:"PNR",sector:"Industrials"},{company:"H2O America",ticker:"HTO",sector:"Utilities"},{company:"MGE Energy",ticker:"MGEE",sector:"Utilities"},{company:"RLI Corp",ticker:"RLI",sector:"Financials"},{company:"S&P Global",ticker:"SPGI",sector:"Financials"},{company:"Automatic Data Processing",ticker:"ADP",sector:"Industrials"}],Kt={"Basic Materials":"#66bb6a","Consumer Cyclical":"#ffab00","Consumer Defensive":"#00e676",Energy:"#ff5252",Financials:"#ba68c8",Healthcare:"#29b6f6",Industrials:"#ffa726","Real Estate":"#ec407a",Utilities:"#42a5f5"};function _t(e){return String(e||"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")}function Jt(e){return Kt[e]||"#00e676"}function Ge(e){return`dk-sector--${_t(e)}`}function Xt(e,{search:a="",sector:t=""}={}){const o=String(a).toLowerCase().trim();return(e||[]).filter(r=>{const n=!o||String(r.company).toLowerCase().includes(o)||String(r.ticker).toLowerCase().includes(o),i=!t||r.sector===t;return n&&i})}function Zt(e,a="company"){return[...e||[]].sort((t,o)=>{switch(a){case"ticker":return t.ticker.localeCompare(o.ticker);case"sector":return t.sector.localeCompare(o.sector)||t.company.localeCompare(o.company);default:return t.company.localeCompare(o.company)}})}function Le(e){return[...new Set((e||[]).map(a=>a.sector))].sort()}function Qt(e){const a=new Map;return(e||[]).forEach(t=>{a.has(t.sector)||a.set(t.sector,[]),a.get(t.sector).push(t.company)}),[...a.entries()].map(([t,o])=>({sector:t,companies:o,count:o.length})).sort((t,o)=>o.count-t.count||t.sector.localeCompare(o.sector))}function ea(e){return`<div class="dk-cards">${(e||[]).map(t=>`
      <article class="dk-card">
        <div class="dk-card-head">
          <h3>${l(t.company)}</h3>
          <span class="dk-ticker">${l(t.ticker)}</span>
        </div>
        <span class="dk-sector ${Ge(t.sector)}">${l(t.sector)}</span>
        <div class="dk-badge">👑 50+ Anos de Dividendos</div>
      </article>`).join("")}</div>`}function ta(e){return`
    <div class="dk-table-wrapper">
      <table class="dk-table">
        <thead>
          <tr>
            <th data-sort="company">Empresa</th>
            <th data-sort="ticker">Ticker</th>
            <th data-sort="sector">Setor</th>
          </tr>
        </thead>
        <tbody>${(e||[]).map(t=>`
      <tr>
        <td><strong>${l(t.company)}</strong></td>
        <td><span class="dk-ticker">${l(t.ticker)}</span></td>
        <td><span class="dk-sector ${Ge(t.sector)}">${l(t.sector)}</span></td>
      </tr>`).join("")}</tbody>
      </table>
    </div>`}function aa(e="dividend-kings-view"){const a=document.getElementById(e);if(!a){console.error(`❌ Contentor ${e} não encontrado!`);return}const t={search:"",sector:"",sortBy:"company",view:"cards"},o=Le(ae).length,r=Le(ae).map(p=>`<option value="${l(p)}">${l(p)}</option>`).join(""),n=Qt(ae).map(p=>`
      <div class="dk-breakdown-item">
        <div class="dk-breakdown-head" style="color: ${Jt(p.sector)}">
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
            <span class="dk-stat-value">${ae.length}</span>
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
  `;const i=a.querySelector("#dk-results"),s=a.querySelector("#dk-search"),c=a.querySelector("#dk-sector"),u=a.querySelector("#dk-sort"),m=()=>{const p=Zt(Xt(ae,{search:t.search,sector:t.sector}),t.sortBy);if(p.length===0){i.innerHTML='<p class="dk-empty">Nenhuma empresa encontrada.</p>';return}if(t.view==="cards"){i.innerHTML=ea(p);return}i.innerHTML=ta(p),i.querySelectorAll(".dk-table th[data-sort]").forEach(d=>{d.addEventListener("click",()=>{t.sortBy=d.getAttribute("data-sort"),u&&(u.value=t.sortBy),m()})})};s&&s.addEventListener("input",()=>{t.search=s.value,m()}),c&&c.addEventListener("change",()=>{t.sector=c.value,m()}),u&&u.addEventListener("change",()=>{t.sortBy=u.value,m()}),a.querySelectorAll(".dk-view-btn").forEach(p=>{p.addEventListener("click",()=>{t.view=p.getAttribute("data-view"),a.querySelectorAll(".dk-view-btn").forEach(d=>d.classList.remove("active")),p.classList.add("active"),m()})}),m()}const K=[{company:"AbbVie",ticker:"ABBV",sector:"Health Care",years:53},{company:"Abbott Laboratories",ticker:"ABT",sector:"Health Care",years:53},{company:"Archer-Daniels-Midland",ticker:"ADM",sector:"Consumer Staples",years:50},{company:"Automatic Data Processing",ticker:"ADP",sector:"Information Technology",years:50},{company:"Aflac",ticker:"AFL",sector:"Financials",years:44},{company:"Albemarle",ticker:"ALB",sector:"Materials",years:31},{company:"Amcor",ticker:"AMCR",sector:"Materials",years:30},{company:"A.O. Smith",ticker:"AOS",sector:"Industrials",years:32},{company:"Air Products & Chemicals",ticker:"APD",sector:"Materials",years:43},{company:"Atmos Energy",ticker:"ATO",sector:"Utilities",years:42},{company:"Becton Dickinson",ticker:"BDX",sector:"Health Care",years:54},{company:"Franklin Resources",ticker:"BEN",sector:"Financials",years:46},{company:"Brown-Forman",ticker:"BF.B",sector:"Consumer Staples",years:41},{company:"Brown & Brown",ticker:"BRO",sector:"Financials",years:32},{company:"Cardinal Health",ticker:"CAH",sector:"Health Care",years:29},{company:"Caterpillar",ticker:"CAT",sector:"Industrials",years:32},{company:"Chubb",ticker:"CB",sector:"Financials",years:32},{company:"Church & Dwight",ticker:"CHD",sector:"Consumer Staples",years:29},{company:"C.H. Robinson",ticker:"CHRW",sector:"Industrials",years:28},{company:"Cincinnati Financial",ticker:"CINF",sector:"Financials",years:65},{company:"Colgate-Palmolive",ticker:"CL",sector:"Consumer Staples",years:62},{company:"Clorox",ticker:"CLX",sector:"Consumer Staples",years:48},{company:"Cintas",ticker:"CTAS",sector:"Industrials",years:43},{company:"Chevron",ticker:"CVX",sector:"Energy",years:38},{company:"Dover",ticker:"DOV",sector:"Industrials",years:70},{company:"Ecolab",ticker:"ECL",sector:"Materials",years:34},{company:"Consolidated Edison",ticker:"ED",sector:"Utilities",years:51},{company:"Emerson Electric",ticker:"EMR",sector:"Industrials",years:69},{company:"Erie Indemnity",ticker:"ERIE",sector:"Financials",years:36},{company:"Eversource Energy",ticker:"ES",sector:"Utilities",years:27},{company:"Essex Property Trust",ticker:"ESS",sector:"Real Estate",years:31},{company:"Expeditors International",ticker:"EXPD",sector:"Industrials",years:29},{company:"Fastenal",ticker:"FAST",sector:"Industrials",years:25},{company:"FactSet Research Systems",ticker:"FDS",sector:"Financials",years:25},{company:"Federal Realty",ticker:"FRT",sector:"Real Estate",years:50},{company:"Genuine Parts",ticker:"GPC",sector:"Consumer Discretionary",years:50},{company:"Grainger",ticker:"GWW",sector:"Industrials",years:40},{company:"Hasbro",ticker:"HAS",sector:"Consumer Discretionary",years:25},{company:"Hormel Foods",ticker:"HRL",sector:"Consumer Staples",years:57},{company:"IBM",ticker:"IBM",sector:"Information Technology",years:29},{company:"Johnson & Johnson",ticker:"JNJ",sector:"Health Care",years:62},{company:"Kimberly-Clark",ticker:"KMB",sector:"Consumer Staples",years:53},{company:"Coca-Cola",ticker:"KO",sector:"Consumer Staples",years:62},{company:"Leggett & Platt",ticker:"LEG",sector:"Consumer Discretionary",years:52},{company:"Linde",ticker:"LIN",sector:"Materials",years:29},{company:"Lowe's",ticker:"LOW",sector:"Consumer Discretionary",years:50},{company:"McDonald's",ticker:"MCD",sector:"Consumer Discretionary",years:47},{company:"Medtronic",ticker:"MDT",sector:"Health Care",years:47},{company:"McCormick",ticker:"MKC",sector:"Consumer Staples",years:37},{company:"3M",ticker:"MMM",sector:"Industrials",years:64},{company:"Nordson",ticker:"NDSN",sector:"Industrials",years:60},{company:"National Fuel Gas",ticker:"NFG",sector:"Energy",years:52},{company:"Nucor",ticker:"NUE",sector:"Materials",years:50},{company:"Realty Income",ticker:"O",sector:"Real Estate",years:30},{company:"PepsiCo",ticker:"PEP",sector:"Consumer Staples",years:51},{company:"Procter & Gamble",ticker:"PG",sector:"Consumer Staples",years:67},{company:"Pentair",ticker:"PNR",sector:"Industrials",years:47},{company:"PPG Industries",ticker:"PPG",sector:"Materials",years:52},{company:"Roper Technologies",ticker:"ROP",sector:"Industrials",years:30},{company:"Republic Services",ticker:"RSG",sector:"Industrials",years:25},{company:"Sherwin-Williams",ticker:"SHW",sector:"Materials",years:45},{company:"Smucker",ticker:"SJM",sector:"Consumer Staples",years:28},{company:"S&P Global",ticker:"SPGI",sector:"Financials",years:50},{company:"Stanley Black & Decker",ticker:"SWK",sector:"Industrials",years:55},{company:"Sysco",ticker:"SYY",sector:"Consumer Staples",years:53},{company:"T. Rowe Price",ticker:"TROW",sector:"Financials",years:36},{company:"VF Corp",ticker:"VFC",sector:"Consumer Discretionary",years:50},{company:"Walgreens Boots Alliance",ticker:"WBA",sector:"Consumer Staples",years:47},{company:"Walmart",ticker:"WMT",sector:"Consumer Staples",years:50},{company:"West Pharmaceutical Services",ticker:"WST",sector:"Health Care",years:30},{company:"Exxon Mobil",ticker:"XOM",sector:"Energy",years:42}],oa={"Consumer Staples":"#00e676","Communication Services":"#00d4ff","Consumer Discretionary":"#ffab00",Energy:"#ff5252",Financials:"#ba68c8","Health Care":"#29b6f6",Industrials:"#ffa726","Information Technology":"#00d4ff",Materials:"#66bb6a","Real Estate":"#ec407a",Utilities:"#42a5f5"};function ra(e){return String(e||"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")}function na(e){return oa[e]||"#ffc107"}function We(e){return`da-sector--${ra(e)}`}function sa(e){return(e||[]).reduce((a,t)=>Math.max(a,Number(t.years)||0),0)}function ia(e,{search:a="",sector:t="",minYears:o=0}={}){const r=String(a).toLowerCase().trim(),n=Number(o)||0;return(e||[]).filter(i=>{const s=!r||String(i.company).toLowerCase().includes(r)||String(i.ticker).toLowerCase().includes(r),c=!t||i.sector===t,u=(Number(i.years)||0)>=n;return s&&c&&u})}function ca(e,a="years"){return[...e||[]].sort((t,o)=>{switch(a){case"company":return t.company.localeCompare(o.company);case"ticker":return t.ticker.localeCompare(o.ticker);case"sector":return t.sector.localeCompare(o.sector)||t.company.localeCompare(o.company);case"years":return(o.years||0)-(t.years||0)||t.company.localeCompare(o.company);default:return 0}})}function Ie(e){return[...new Set((e||[]).map(a=>a.sector))].sort()}function da(e){const a=new Map;return(e||[]).forEach(t=>{a.has(t.sector)||a.set(t.sector,[]),a.get(t.sector).push(t.company)}),[...a.entries()].map(([t,o])=>({sector:t,companies:o,count:o.length})).sort((t,o)=>o.count-t.count||t.sector.localeCompare(o.sector))}function la(e){return`<div class="da-cards">${(e||[]).map(t=>`
      <article class="da-card">
        <div class="da-card-head">
          <h3>${l(t.company)}</h3>
          <span class="da-ticker">${l(t.ticker)}</span>
        </div>
        <span class="da-sector ${We(t.sector)}">${l(t.sector)}</span>
        <div class="da-years">🏆 ${l(String(t.years))} Anos de Aumento</div>
      </article>`).join("")}</div>`}function pa(e){return`
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
        <tbody>${(e||[]).map(t=>`
      <tr>
        <td><strong>${l(t.company)}</strong></td>
        <td><span class="da-ticker">${l(t.ticker)}</span></td>
        <td><span class="da-sector ${We(t.sector)}">${l(t.sector)}</span></td>
        <td><strong class="da-years-value">${l(String(t.years))}</strong></td>
      </tr>`).join("")}</tbody>
      </table>
    </div>`}function ma(e="dividend-aristocrats-view"){const a=document.getElementById(e);if(!a){console.error("❌ dividend-aristocrats-view não encontrado!");return}const t={search:"",sector:"",minYears:0,sortBy:"years",view:"cards"},o=Ie(K).length,r=Ie(K).map(d=>`<option value="${l(d)}">${l(d)}</option>`).join(""),n=da(K).map(d=>`
      <div class="da-breakdown-item">
        <div class="da-breakdown-head" style="color: ${na(d.sector)}">
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
            <span class="da-stat-value">${K.length}</span>
            <span class="da-stat-label">Empresas</span>
          </div>
          <div class="da-stat">
            <span class="da-stat-value">${o}</span>
            <span class="da-stat-label">Setores</span>
          </div>
          <div class="da-stat">
            <span class="da-stat-value">${sa(K)}</span>
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
  `;const i=a.querySelector("#da-results"),s=a.querySelector("#da-search"),c=a.querySelector("#da-sector"),u=a.querySelector("#da-min-years"),m=a.querySelector("#da-sort"),p=()=>{const d=ca(ia(K,{search:t.search,sector:t.sector,minYears:t.minYears}),t.sortBy);if(d.length===0){i.innerHTML='<p class="da-empty">Nenhuma empresa encontrada.</p>';return}if(t.view==="cards"){i.innerHTML=la(d);return}i.innerHTML=pa(d),i.querySelectorAll(".da-table th[data-sort]").forEach(g=>{g.addEventListener("click",()=>{t.sortBy=g.getAttribute("data-sort"),m&&(m.value=t.sortBy),p()})})};s&&s.addEventListener("input",()=>{t.search=s.value,p()}),c&&c.addEventListener("change",()=>{t.sector=c.value,p()}),u&&u.addEventListener("input",()=>{t.minYears=Number(u.value)||0,p()}),m&&m.addEventListener("change",()=>{t.sortBy=m.value,p()}),a.querySelectorAll(".da-view-btn").forEach(d=>{d.addEventListener("click",()=>{t.view=d.getAttribute("data-view"),a.querySelectorAll(".da-view-btn").forEach(g=>g.classList.remove("active")),d.classList.add("active"),p()})}),p()}const _=[{rank:1,ticker:"NVDA",company:"NVIDIA Corporation",sector:"Technology",weight:13.31,cap:5470,category:"Mega Cap",cumulative:13.31,concentration:"Top 10"},{rank:2,ticker:"AAPL",company:"Apple Inc.",sector:"Technology",weight:11.57,cap:4390,category:"Mega Cap",cumulative:24.88,concentration:"Top 10"},{rank:3,ticker:"MSFT",company:"Microsoft Corporation",sector:"Technology",weight:8.55,cap:3010,category:"Mega Cap",cumulative:33.43,concentration:"Top 10"},{rank:4,ticker:"AMZN",company:"Amazon.com Inc.",sector:"Consumer Discretionary",weight:7.07,cap:2910,category:"Mega Cap",cumulative:40.5,concentration:"Top 10"},{rank:5,ticker:"GOOGL",company:"Alphabet Inc. Class A",sector:"Communication Services",weight:5.75,cap:4880,category:"Mega Cap",cumulative:46.25,concentration:"Top 10"},{rank:6,ticker:"GOOG",company:"Alphabet Inc. Class C",sector:"Communication Services",weight:5.33,cap:4830,category:"Mega Cap",cumulative:51.58,concentration:"Top 10"},{rank:7,ticker:"AVGO",company:"Broadcom Inc.",sector:"Technology",weight:4.6,cap:1970,category:"Mega Cap",cumulative:56.18,concentration:"Top 10"},{rank:8,ticker:"META",company:"Meta Platforms Inc. Class A",sector:"Communication Services",weight:4.58,cap:1570,category:"Mega Cap",cumulative:60.76,concentration:"Top 10"},{rank:9,ticker:"TSLA",company:"Tesla Inc.",sector:"Consumer Discretionary",weight:4.44,cap:1670,category:"Mega Cap",cumulative:65.2,concentration:"Top 10"},{rank:10,ticker:"WMT",company:"Walmart Inc.",sector:"Consumer Staples",weight:3.06,cap:1050,category:"Mega Cap",cumulative:68.26,concentration:"Top 10"},{rank:11,ticker:"ASML",company:"ASML Holding N.V.",sector:"Technology",weight:1.65,cap:609.6,category:"Mega Cap",cumulative:69.91,concentration:"Top 11–25"},{rank:12,ticker:"COST",company:"Costco Wholesale Corporation",sector:"Consumer Staples",weight:1.37,cap:458.3,category:"Mega Cap",cumulative:71.28,concentration:"Top 11–25"},{rank:13,ticker:"MU",company:"Micron Technology Inc.",sector:"Technology",weight:1.3,cap:906.3,category:"Mega Cap",cumulative:72.58,concentration:"Top 11–25"},{rank:14,ticker:"NFLX",company:"Netflix Inc.",sector:"Communication Services",weight:1.25,cap:368.7,category:"Mega Cap",cumulative:73.83,concentration:"Top 11–25"},{rank:15,ticker:"PLTR",company:"Palantir Technologies Inc. Class A",sector:"Technology",weight:1.09,cap:311.8,category:"Mega Cap",cumulative:74.92,concentration:"Top 11–25"},{rank:16,ticker:"AMD",company:"Advanced Micro Devices Inc.",sector:"Technology",weight:1.07,cap:726.4,category:"Mega Cap",cumulative:75.99,concentration:"Top 11–25"},{rank:17,ticker:"CSCO",company:"Cisco Systems Inc.",sector:"Technology",weight:.97,cap:402.4,category:"Mega Cap",cumulative:76.96,concentration:"Top 11–25"},{rank:18,ticker:"AMAT",company:"Applied Materials Inc.",sector:"Technology",weight:.88,cap:346.5,category:"Mega Cap",cumulative:77.84,concentration:"Top 11–25"},{rank:19,ticker:"LRCX",company:"Lam Research Corporation",sector:"Technology",weight:.86,cap:369.5,category:"Mega Cap",cumulative:78.7,concentration:"Top 11–25"},{rank:20,ticker:"INTC",company:"Intel Corporation",sector:"Technology",weight:.76,cap:604.6,category:"Mega Cap",cumulative:79.46,concentration:"Top 11–25"},{rank:21,ticker:"LIN",company:"Linde plc",sector:"Materials",weight:.71,cap:237.3,category:"Mega Cap",cumulative:80.17,concentration:"Top 11–25"},{rank:22,ticker:"TMUS",company:"T-Mobile US Inc.",sector:"Communication Services",weight:.69,cap:205.9,category:"Mega Cap",cumulative:80.86,concentration:"Top 11–25"},{rank:23,ticker:"PEP",company:"PepsiCo Inc.",sector:"Consumer Staples",weight:.65,cap:204,category:"Mega Cap",cumulative:81.51,concentration:"Top 11–25"},{rank:24,ticker:"KLAC",company:"KLA Corporation",sector:"Technology",weight:.62,cap:241.6,category:"Mega Cap",cumulative:82.13,concentration:"Top 11–25"},{rank:25,ticker:"AMGN",company:"Amgen Inc.",sector:"Health Care",weight:.59,cap:181.7,category:"Large Cap",cumulative:82.72,concentration:"Top 11–25"},{rank:26,ticker:"TXN",company:"Texas Instruments Incorporated",sector:"Technology",weight:.56,cap:278.8,category:"Mega Cap",cumulative:83.28,concentration:"Rest (26–100)"},{rank:27,ticker:"GILD",company:"Gilead Sciences Inc.",sector:"Health Care",weight:.54,cap:165.2,category:"Large Cap",cumulative:83.82,concentration:"Rest (26–100)"},{rank:28,ticker:"ISRG",company:"Intuitive Surgical Inc.",sector:"Health Care",weight:.51,cap:153.1,category:"Large Cap",cumulative:84.33,concentration:"Rest (26–100)"},{rank:29,ticker:"ARM",company:"Arm Holdings plc ADR",sector:"Technology",weight:.5,cap:235.4,category:"Mega Cap",cumulative:84.83,concentration:"Rest (26–100)"},{rank:30,ticker:"ADI",company:"Analog Devices Inc.",sector:"Technology",weight:.49,cap:211.1,category:"Mega Cap",cumulative:85.32,concentration:"Rest (26–100)"},{rank:31,ticker:"SHOP",company:"Shopify Inc. Class A",sector:"Consumer Discretionary",weight:.48,cap:123.8,category:"Large Cap",cumulative:85.8,concentration:"Rest (26–100)"},{rank:32,ticker:"PDD",company:"PDD Holdings Inc. ADR",sector:"Consumer Discretionary",weight:.45,cap:141.8,category:"Large Cap",cumulative:86.25,concentration:"Rest (26–100)"},{rank:33,ticker:"HON",company:"Honeywell International Inc.",sector:"Industrials",weight:.45,cap:138.1,category:"Large Cap",cumulative:86.7,concentration:"Rest (26–100)"},{rank:34,ticker:"QCOM",company:"QUALCOMM Incorporated",sector:"Technology",weight:.43,cap:224.7,category:"Mega Cap",cumulative:87.13,concentration:"Rest (26–100)"},{rank:35,ticker:"BKNG",company:"Booking Holdings Inc.",sector:"Consumer Discretionary",weight:.42,cap:120.1,category:"Large Cap",cumulative:87.55,concentration:"Rest (26–100)"},{rank:36,ticker:"APP",company:"AppLovin Corporation Class A",sector:"Technology",weight:.41,cap:152.4,category:"Large Cap",cumulative:87.96,concentration:"Rest (26–100)"},{rank:37,ticker:"PANW",company:"Palo Alto Networks Inc.",sector:"Technology",weight:.4,cap:184.7,category:"Large Cap",cumulative:88.36,concentration:"Rest (26–100)"},{rank:38,ticker:"INTU",company:"Intuit Inc.",sector:"Technology",weight:.36,cap:103.4,category:"Large Cap",cumulative:88.72,concentration:"Rest (26–100)"},{rank:39,ticker:"VRTX",company:"Vertex Pharmaceuticals Incorporated",sector:"Health Care",weight:.36,cap:115,category:"Large Cap",cumulative:89.08,concentration:"Rest (26–100)"},{rank:40,ticker:"SBUX",company:"Starbucks Corporation",sector:"Consumer Discretionary",weight:.32,cap:120.8,category:"Large Cap",cumulative:89.4,concentration:"Rest (26–100)"},{rank:41,ticker:"WDC",company:"Western Digital Corporation",sector:"Technology",weight:.32,cap:170.3,category:"Large Cap",cumulative:89.72,concentration:"Rest (26–100)"},{rank:42,ticker:"CEG",company:"Constellation Energy Corporation",sector:"Utilities",weight:.31,cap:99.3,category:"Large Cap",cumulative:90.03,concentration:"Rest (26–100)"},{rank:43,ticker:"CMCSA",company:"Comcast Corporation Class A",sector:"Communication Services",weight:.31,cap:89.1,category:"Large Cap",cumulative:90.34,concentration:"Rest (26–100)"},{rank:44,ticker:"CRWD",company:"CrowdStrike Holdings Inc. Class A",sector:"Technology",weight:.31,cap:143.2,category:"Large Cap",cumulative:90.65,concentration:"Rest (26–100)"},{rank:45,ticker:"ADBE",company:"Adobe Inc.",sector:"Technology",weight:.3,cap:95.4,category:"Large Cap",cumulative:90.95,concentration:"Rest (26–100)"},{rank:46,ticker:"STX",company:"Seagate Technology Holdings plc",sector:"Technology",weight:.3,cap:183.3,category:"Large Cap",cumulative:91.25,concentration:"Rest (26–100)"},{rank:47,ticker:"MRVL",company:"Marvell Technology Inc.",sector:"Technology",weight:.29,cap:155.6,category:"Large Cap",cumulative:91.54,concentration:"Rest (26–100)"},{rank:48,ticker:"MAR",company:"Marriott International Inc. Class A",sector:"Consumer Discretionary",weight:.27,cap:92.3,category:"Large Cap",cumulative:91.81,concentration:"Rest (26–100)"},{rank:49,ticker:"MELI",company:"MercadoLibre Inc.",sector:"Consumer Discretionary",weight:.27,cap:79.2,category:"Large Cap",cumulative:92.08,concentration:"Rest (26–100)"},{rank:50,ticker:"REGN",company:"Regeneron Pharmaceuticals Inc.",sector:"Health Care",weight:.25,cap:75.5,category:"Large Cap",cumulative:92.33,concentration:"Rest (26–100)"},{rank:51,ticker:"ADP",company:"Automatic Data Processing Inc.",sector:"Technology",weight:.25,cap:83.4,category:"Large Cap",cumulative:92.58,concentration:"Rest (26–100)"},{rank:52,ticker:"CDNS",company:"Cadence Design Systems Inc.",sector:"Technology",weight:.24,cap:97.8,category:"Large Cap",cumulative:92.82,concentration:"Rest (26–100)"},{rank:53,ticker:"ORLY",company:"O'Reilly Automotive Inc.",sector:"Consumer Discretionary",weight:.24,cap:74.3,category:"Large Cap",cumulative:93.06,concentration:"Rest (26–100)"},{rank:54,ticker:"CSX",company:"CSX Corporation",sector:"Industrials",weight:.24,cap:82.5,category:"Large Cap",cumulative:93.3,concentration:"Rest (26–100)"},{rank:55,ticker:"SNPS",company:"Synopsys Inc.",sector:"Technology",weight:.24,cap:97.6,category:"Large Cap",cumulative:93.54,concentration:"Rest (26–100)"},{rank:56,ticker:"ABNB",company:"Airbnb Inc. Class A",sector:"Consumer Discretionary",weight:.24,cap:78.9,category:"Large Cap",cumulative:93.78,concentration:"Rest (26–100)"},{rank:57,ticker:"MDLZ",company:"Mondelez International Inc. Class A",sector:"Consumer Staples",weight:.23,cap:79,category:"Large Cap",cumulative:94.01,concentration:"Rest (26–100)"},{rank:58,ticker:"MNST",company:"Monster Beverage Corporation",sector:"Consumer Staples",weight:.22,cap:84,category:"Large Cap",cumulative:94.23,concentration:"Rest (26–100)"},{rank:59,ticker:"ROST",company:"Ross Stores Inc.",sector:"Consumer Discretionary",weight:.22,cap:68.5,category:"Large Cap",cumulative:94.45,concentration:"Rest (26–100)"},{rank:60,ticker:"AEP",company:"American Electric Power Company Inc.",sector:"Utilities",weight:.22,cap:69.6,category:"Large Cap",cumulative:94.67,concentration:"Rest (26–100)"},{rank:61,ticker:"WBD",company:"Warner Bros. Discovery Inc. Series A",sector:"Communication Services",weight:.22,cap:68.3,category:"Large Cap",cumulative:94.89,concentration:"Rest (26–100)"},{rank:62,ticker:"CTAS",company:"Cintas Corporation",sector:"Industrials",weight:.21,cap:65.4,category:"Large Cap",cumulative:95.1,concentration:"Rest (26–100)"},{rank:63,ticker:"DASH",company:"DoorDash Inc. Class A",sector:"Consumer Discretionary",weight:.2,cap:65,category:"Large Cap",cumulative:95.3,concentration:"Rest (26–100)"},{rank:64,ticker:"PCAR",company:"PACCAR Inc.",sector:"Industrials",weight:.19,cap:58.8,category:"Large Cap",cumulative:95.49,concentration:"Rest (26–100)"},{rank:65,ticker:"FTNT",company:"Fortinet Inc.",sector:"Technology",weight:.19,cap:86.2,category:"Large Cap",cumulative:95.68,concentration:"Rest (26–100)"},{rank:66,ticker:"BKR",company:"Baker Hughes Company Class A",sector:"Energy",weight:.18,cap:64.9,category:"Large Cap",cumulative:95.86,concentration:"Rest (26–100)"},{rank:67,ticker:"MPWR",company:"Monolithic Power Systems Inc.",sector:"Technology",weight:.17,cap:81.1,category:"Large Cap",cumulative:96.03,concentration:"Rest (26–100)"},{rank:68,ticker:"FANG",company:"Diamondback Energy Inc.",sector:"Energy",weight:.17,cap:56.6,category:"Large Cap",cumulative:96.2,concentration:"Rest (26–100)"},{rank:69,ticker:"FAST",company:"Fastenal Company",sector:"Industrials",weight:.17,cap:50.2,category:"Large Cap",cumulative:96.37,concentration:"Rest (26–100)"},{rank:70,ticker:"EA",company:"Electronic Arts Inc.",sector:"Communication Services",weight:.16,cap:50.2,category:"Large Cap",cumulative:96.53,concentration:"Rest (26–100)"},{rank:71,ticker:"ADSK",company:"Autodesk Inc.",sector:"Technology",weight:.16,cap:48.8,category:"Large Cap",cumulative:96.69,concentration:"Rest (26–100)"},{rank:72,ticker:"NXPI",company:"NXP Semiconductors N.V.",sector:"Technology",weight:.15,cap:75.3,category:"Large Cap",cumulative:96.84,concentration:"Rest (26–100)"},{rank:73,ticker:"EXC",company:"Exelon Corporation",sector:"Utilities",weight:.15,cap:45.3,category:"Large Cap",cumulative:96.99,concentration:"Rest (26–100)"},{rank:74,ticker:"XEL",company:"Xcel Energy Inc.",sector:"Utilities",weight:.15,cap:49.9,category:"Large Cap",cumulative:97.14,concentration:"Rest (26–100)"},{rank:75,ticker:"FER",company:"Ferrovial SE",sector:"Utilities",weight:.15,cap:48.7,category:"Large Cap",cumulative:97.29,concentration:"Rest (26–100)"},{rank:76,ticker:"IDXX",company:"IDEXX Laboratories Inc.",sector:"Health Care",weight:.14,cap:41.7,category:"Large Cap",cumulative:97.43,concentration:"Rest (26–100)"},{rank:77,ticker:"ALNY",company:"Alnylam Pharmaceuticals Inc.",sector:"Health Care",weight:.14,cap:38.9,category:"Large Cap",cumulative:97.57,concentration:"Rest (26–100)"},{rank:78,ticker:"MSTR",company:"Strategy Inc.",sector:"Technology",weight:.13,cap:62.4,category:"Large Cap",cumulative:97.7,concentration:"Rest (26–100)"},{rank:79,ticker:"DDOG",company:"Datadog Inc. Class A",sector:"Technology",weight:.13,cap:73.1,category:"Large Cap",cumulative:97.83,concentration:"Rest (26–100)"},{rank:80,ticker:"ODFL",company:"Old Dominion Freight Line Inc.",sector:"Industrials",weight:.13,cap:39.3,category:"Large Cap",cumulative:97.96,concentration:"Rest (26–100)"},{rank:81,ticker:"PYPL",company:"PayPal Holdings Inc.",sector:"Technology",weight:.13,cap:39.9,category:"Large Cap",cumulative:98.09,concentration:"Rest (26–100)"},{rank:82,ticker:"CCEP",company:"Coca-Cola Europacific Partners plc",sector:"Consumer Staples",weight:.13,cap:40.5,category:"Large Cap",cumulative:98.22,concentration:"Rest (26–100)"},{rank:83,ticker:"TRI",company:"Thomson Reuters Corporation",sector:"Technology",weight:.12,cap:35.8,category:"Large Cap",cumulative:98.34,concentration:"Rest (26–100)"},{rank:84,ticker:"TTWO",company:"Take-Two Interactive Software Inc.",sector:"Communication Services",weight:.11,cap:42,category:"Large Cap",cumulative:98.45,concentration:"Rest (26–100)"},{rank:85,ticker:"ROP",company:"Roper Technologies Inc.",sector:"Industrials",weight:.11,cap:31.9,category:"Large Cap",cumulative:98.56,concentration:"Rest (26–100)"},{rank:86,ticker:"MCHP",company:"Microchip Technology Incorporated",sector:"Technology",weight:.11,cap:52.3,category:"Large Cap",cumulative:98.67,concentration:"Rest (26–100)"},{rank:87,ticker:"INSM",company:"Insmed Incorporated",sector:"Health Care",weight:.11,cap:25.6,category:"Large Cap",cumulative:98.78,concentration:"Rest (26–100)"},{rank:88,ticker:"KDP",company:"Keurig Dr Pepper Inc.",sector:"Consumer Staples",weight:.11,cap:39.9,category:"Large Cap",cumulative:98.89,concentration:"Rest (26–100)"},{rank:89,ticker:"AXON",company:"Axon Enterprise Inc.",sector:"Industrials",weight:.11,cap:30.4,category:"Large Cap",cumulative:99,concentration:"Rest (26–100)"},{rank:90,ticker:"WDAY",company:"Workday Inc. Class A",sector:"Technology",weight:.1,cap:29.1,category:"Large Cap",cumulative:99.1,concentration:"Rest (26–100)"},{rank:91,ticker:"PAYX",company:"Paychex Inc.",sector:"Technology",weight:.1,cap:32.2,category:"Large Cap",cumulative:99.2,concentration:"Rest (26–100)"},{rank:92,ticker:"GEHC",company:"GE HealthCare Technologies Inc.",sector:"Health Care",weight:.1,cap:28.2,category:"Large Cap",cumulative:99.3,concentration:"Rest (26–100)"},{rank:93,ticker:"CPRT",company:"Copart Inc.",sector:"Industrials",weight:.1,cap:31.7,category:"Large Cap",cumulative:99.4,concentration:"Rest (26–100)"},{rank:94,ticker:"CTSH",company:"Cognizant Technology Solutions Corporation Class A",sector:"Technology",weight:.09,cap:21.7,category:"Large Cap",cumulative:99.49,concentration:"Rest (26–100)"},{rank:95,ticker:"CHTR",company:"Charter Communications Inc. Class A",sector:"Communication Services",weight:.08,cap:20.2,category:"Large Cap",cumulative:99.57,concentration:"Rest (26–100)"},{rank:96,ticker:"KHC",company:"Kraft Heinz Company",sector:"Consumer Staples",weight:.08,cap:27.5,category:"Large Cap",cumulative:99.65,concentration:"Rest (26–100)"},{rank:97,ticker:"VRSK",company:"Verisk Analytics Inc.",sector:"Technology",weight:.08,cap:21.2,category:"Large Cap",cumulative:99.73,concentration:"Rest (26–100)"},{rank:98,ticker:"DXCM",company:"DexCom Inc.",sector:"Health Care",weight:.08,cap:22.6,category:"Large Cap",cumulative:99.81,concentration:"Rest (26–100)"},{rank:99,ticker:"ZS",company:"Zscaler Inc. Class A",sector:"Technology",weight:.07,cap:24.5,category:"Large Cap",cumulative:99.88,concentration:"Rest (26–100)"},{rank:100,ticker:"TEAM",company:"Atlassian Corporation Class A",sector:"Technology",weight:.06,cap:20.5,category:"Large Cap",cumulative:99.94,concentration:"Rest (26–100)"}],ua={Technology:"#00d4ff","Communication Services":"#00d4ff","Consumer Discretionary":"#ffab00","Consumer Staples":"#00e676","Health Care":"#29b6f6",Industrials:"#ffa726",Materials:"#66bb6a",Energy:"#ff5252",Utilities:"#42a5f5",Financials:"#ba68c8","Real Estate":"#ec407a"};function ga(e){return String(e||"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")}function ya(e){return ua[e]||"#00d4ff"}function Ke(e){return`nq-sector--${ga(e)}`}function Ae(e){const a=Number(e)||0;return a>=1e3?`$${(a/1e3).toFixed(2)}T`:`$${a.toFixed(1)}B`}function va(e){return(e||[]).reduce((a,t)=>a+(Number(t.cap)||0),0)}function ha(e){return(e||[]).reduce((a,t)=>a+(Number(t.weight)||0),0)}function fa(e,{search:a="",sector:t="",category:o=""}={}){const r=String(a).toLowerCase().trim();return(e||[]).filter(n=>{const i=!r||String(n.company).toLowerCase().includes(r)||String(n.ticker).toLowerCase().includes(r),s=!t||n.sector===t,c=!o||n.category===o;return i&&s&&c})}function ba(e,a="rank"){return[...e||[]].sort((t,o)=>{switch(a){case"cap":return(o.cap||0)-(t.cap||0);case"weight":return(o.weight||0)-(t.weight||0)||(t.rank||0)-(o.rank||0);case"company":return t.company.localeCompare(o.company);case"ticker":return t.ticker.localeCompare(o.ticker);case"sector":return t.sector.localeCompare(o.sector)||(t.rank||0)-(o.rank||0);case"rank":default:return(t.rank||0)-(o.rank||0)}})}function ka(e){return[...new Set((e||[]).map(a=>a.sector))].sort()}function Ca(e){const a=new Map;return(e||[]).forEach(t=>{a.has(t.sector)||a.set(t.sector,[]),a.get(t.sector).push(t)}),[...a.entries()].map(([t,o])=>({sector:t,companies:o.map(r=>r.ticker),count:o.length,weight:o.reduce((r,n)=>r+(Number(n.weight)||0),0)})).sort((t,o)=>o.count-t.count||t.sector.localeCompare(o.sector))}function wa(e){return`<div class="nq-cards">${(e||[]).map(t=>`
      <article class="nq-card">
        <div class="nq-card-head">
          <div>
            <span class="nq-rank">#${l(t.rank)}</span>
            <h3>${l(t.company)}</h3>
          </div>
          <span class="nq-ticker">${l(t.ticker)}</span>
        </div>
        <span class="nq-sector ${Ke(t.sector)}">${l(t.sector)}</span>
        <div class="nq-metrics">
          <div class="nq-metric">
            <span class="nq-metric-value">${Ae(t.cap)}</span>
            <span class="nq-metric-label">Market Cap</span>
          </div>
          <div class="nq-metric">
            <span class="nq-metric-value">${(Number(t.weight)||0).toFixed(2)}%</span>
            <span class="nq-metric-label">Peso no Índice</span>
          </div>
        </div>
        <span class="nq-cat">${l(t.category)} · ${l(t.concentration)}</span>
      </article>`).join("")}</div>`}function xa(e){return`
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
        <tbody>${(e||[]).map(t=>`
      <tr>
        <td>${l(t.rank)}</td>
        <td><strong>${l(t.company)}</strong></td>
        <td><span class="nq-ticker">${l(t.ticker)}</span></td>
        <td><span class="nq-sector ${Ke(t.sector)}">${l(t.sector)}</span></td>
        <td>${Ae(t.cap)}</td>
        <td><strong class="nq-weight">${(Number(t.weight)||0).toFixed(2)}%</strong></td>
        <td>${(Number(t.cumulative)||0).toFixed(2)}%</td>
        <td><span class="nq-cat">${l(t.category)}</span></td>
      </tr>`).join("")}</tbody>
      </table>
    </div>`}function Sa(e="nasdaq-100-view"){const a=document.getElementById(e);if(!a){console.error(`❌ Contentor ${e} não encontrado!`);return}const t={search:"",sector:"",category:"",sortBy:"rank",view:"cards"},o=ka(_).map(p=>`<option value="${l(p)}">${l(p)}</option>`).join(""),r=Ca(_).map(p=>`
      <div class="nq-breakdown-item">
        <div class="nq-breakdown-head" style="color: ${ya(p.sector)}">
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
            <span class="nq-stat-value">${_.length}</span>
            <span class="nq-stat-label">Empresas</span>
          </div>
          <div class="nq-stat">
            <span class="nq-stat-value">${Ae(va(_))}</span>
            <span class="nq-stat-label">Market Cap Total</span>
          </div>
          <div class="nq-stat">
            <span class="nq-stat-value">${ha(_).toFixed(2)}%</span>
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
  `;const n=a.querySelector("#nq-results"),i=a.querySelector("#nq-search"),s=a.querySelector("#nq-sector"),c=a.querySelector("#nq-cap"),u=a.querySelector("#nq-sort"),m=()=>{const p=ba(fa(_,{search:t.search,sector:t.sector,category:t.category}),t.sortBy);if(p.length===0){n.innerHTML='<p class="nq-empty">Nenhuma empresa encontrada.</p>';return}if(t.view==="cards"){n.innerHTML=wa(p);return}n.innerHTML=xa(p),n.querySelectorAll(".nq-table th[data-sort]").forEach(d=>{d.addEventListener("click",()=>{t.sortBy=d.getAttribute("data-sort"),u&&(u.value=t.sortBy),m()})})};i&&i.addEventListener("input",()=>{t.search=i.value,m()}),s&&s.addEventListener("change",()=>{t.sector=s.value,m()}),c&&c.addEventListener("change",()=>{t.category=c.value,m()}),u&&u.addEventListener("change",()=>{t.sortBy=u.value,m()}),a.querySelectorAll(".nq-view-btn").forEach(p=>{p.addEventListener("click",()=>{t.view=p.getAttribute("data-view"),a.querySelectorAll(".nq-view-btn").forEach(d=>d.classList.remove("active")),p.classList.add("active"),m()})}),m()}const $a={bullish:{label:"Otimista",cls:"positive"},bearish:{label:"Pessimista",cls:"negative"},neutral:{label:"Neutro",cls:""}};async function Aa(e="daily-summary"){const a=document.getElementById(e);if(a){a.innerHTML='<p class="summary-empty">Carregando resumo do dia...</p>';try{const t=await fetch(`${R}/api/resumo-dia`);if(!t.ok)throw new Error(`HTTP ${t.status}`);const o=await t.json();Ta(a,o.dados||{})}catch(t){console.error("Erro ao carregar Resumo do Dia:",t),a.innerHTML='<p class="summary-empty">Resumo do dia indisponível no momento.</p>'}}}function _e(e){const a=Number(e)||0;return`${a>0?"+":""}${a.toFixed(2)}%`}function Ea(e){if(!e)return"";const a=new Date(`${e}T00:00:00`);return Number.isNaN(a.getTime())?"":a.toLocaleDateString("pt-BR")}function De(e,a){const t=(a||[]).map(o=>`
        <div class="summary-row">
          <span class="mini-symbol">${l(o.symbol||"")}</span>
          <span class="mini-name">${l(o.name||"")}</span>
          <span class="mini-change ${o.changePct>=0?"positive":"negative"}">${_e(o.changePct)}</span>
        </div>`).join("");return`
    <div class="summary-list">
      <h4 class="summary-list-title">${e}</h4>
      ${t}
    </div>`}function Ta(e,a){const t=a.stats||{},o=$a[a.marketMood]||{label:"—",cls:""},r=Ea(a.referenceDate),n=[{label:"Em alta",value:t.gainers??"—",cls:"positive"},{label:"Em baixa",value:t.losers??"—",cls:"negative"},{label:"Estáveis",value:t.neutral??"—",cls:""},{label:"Total",value:t.total??"—",cls:""},{label:"Humor",value:o.label,cls:o.cls}].map(s=>`
      <div class="daily-card ${s.cls}">
        <span class="daily-label">${s.label}</span>
        <span class="daily-value">${s.value}</span>
      </div>`).join(""),i=(a.sectorPerformance||[]).map(s=>`
      <div class="daily-sector-card ${s.avgChangePct>=0?"positive":"negative"}">
        <span class="sector-name">${l(s.name||"")}</span>
        <span class="sector-change">${_e(s.avgChangePct)}</span>
      </div>`).join("");e.innerHTML=`
    <header class="daily-summary-header">
      <h2>📊 Resumo do Dia</h2>
      ${r?`<span class="daily-date">Referência: ${r}</span>`:""}
    </header>

    <div class="daily-summary-grid">${n}</div>

    <div class="daily-lists">
      ${De("🚀 Maiores altas",a.topGainers)}
      ${De("📉 Maiores baixas",a.topLosers)}
    </div>

    <div class="daily-sectors">
      <h3>📈 Desempenho por setor</h3>
      <div class="daily-sectors-list">${i}</div>
    </div>
  `}const Ce=2500,Je=1500,Ma=.7,La=.4,Ia=5,Da=3,Re="marketCapShare-desc",Ra={Alta:"si-badge--high",Moderada:"si-badge--moderate",Baixa:"si-badge--low"},Na={Renda:"si-badge--income",Equilibrado:"si-badge--balanced",Crescimento:"si-badge--growth"};function q(e,a=2){const t=10**a;return Math.round((e+Number.EPSILON)*t)/t}function L(e){const a=Number(e);return Number.isFinite(a)&&a>0?a:0}function we(e){return L(e&&e.dividendYield)}function Pa(e){const a=(e||[]).filter(o=>o!=null&&o!=="").map(Number).filter(o=>Number.isFinite(o)).sort((o,r)=>o-r);if(a.length===0)return 0;const t=Math.floor(a.length/2);return a.length%2===1?a[t]:(a[t-1]+a[t])/2}function Xe(e){const a=(e||[]).map(L).filter(r=>r>0),t=a.reduce((r,n)=>r+n,0);if(t<=0)return 0;const o=a.reduce((r,n)=>r+(n/t)**2,0);return q(o*1e4,1)}function Ba(e){return e>=Ce?"Alta":e>=Je?"Moderada":"Baixa"}function Ha(e){return e>=Ma?"Renda":e>=La?"Equilibrado":"Crescimento"}function j(e){const a=Number(e);return Number.isFinite(a)?`${(a*100).toFixed(1)}%`:"0.0%"}function U(e){const a=Number(e);return Number.isFinite(a)?a.toLocaleString("pt-BR",{maximumFractionDigits:0}):"0"}function Ze(e){return(e||[]).reduce((a,t)=>a+L(t.marketCap),0)}function qa(e,a){return(e||[]).filter(t=>L(t.marketCap)>0).slice().sort((t,o)=>L(o.marketCap)-L(t.marketCap)||String(t.symbol).localeCompare(String(o.symbol))).slice(0,Ia).map(t=>({symbol:t.symbol||"N/D",name:t.name||t.symbol||"N/D",marketCap:L(t.marketCap),weight:a>0?q(L(t.marketCap)/a,4):0}))}function Fa(e,a){const t=new Map;for(const o of e||[]){const r=o.subIndustry||"N/D";t.has(r)||t.set(r,{name:r,count:0,marketCap:0});const n=t.get(r);n.count+=1,n.marketCap+=L(o.marketCap)}return Array.from(t.values()).sort((o,r)=>r.count-o.count||r.marketCap-o.marketCap||o.name.localeCompare(r.name)).slice(0,Da).map(o=>({name:o.name,count:o.count,weight:a>0?q(o.marketCap/a,4):0}))}function Oa(e,a=0){const t=Array.isArray(e&&e.companies)?e.companies:[],o=e&&e.id||"N/D",r=e&&e.name||o,n=Ze(t),i=L(a)||n,s=t.filter(d=>we(d)>0),c=s.reduce((d,g)=>d+we(g),0),u=t.length>0?s.length/t.length:0,m=qa(t,n),p=Xe(t.map(d=>d.marketCap));return{id:o,name:r,companyCount:t.length,totalMarketCap:n,marketCapShare:i>0?q(n/i,4):0,medianMarketCap:Pa(t.map(d=>d.marketCap)),averageMarketCap:t.length>0?Math.round(n/t.length):0,hhi:p,concentration:Ba(p),topCompany:m[0]||null,topCompanies:m,top3Weight:q(m.slice(0,3).reduce((d,g)=>d+g.weight,0),4),dividendPayers:s.length,dividendCoverage:q(u,4),averageDividendYield:s.length>0?q(c/s.length,2):0,incomeProfile:Ha(u),subIndustryCount:new Set(t.map(d=>d.subIndustry||"N/D")).size,topSubIndustries:Fa(t,n),rank:0}}function me(e,a){return e?{id:e.id,name:e.name,[a]:e[a]}:null}function Ya(e){if(e.length===0)return{largestSector:null,mostConcentrated:null,mostDiversified:null,highestYield:null,widestSector:null};const a=e[0],t=e.reduce((s,c)=>c.hhi>s.hhi?c:s),o=e.reduce((s,c)=>c.hhi<s.hhi?c:s),r=e.filter(s=>s.averageDividendYield>0),n=r.length?r.reduce((s,c)=>c.averageDividendYield>s.averageDividendYield?c:s):null,i=e.reduce((s,c)=>c.companyCount>s.companyCount?c:s);return{largestSector:{id:a.id,name:a.name,marketCap:a.totalMarketCap,share:a.marketCapShare},mostConcentrated:me(t,"hhi"),mostDiversified:me(o,"hhi"),highestYield:me(n,"averageDividendYield"),widestSector:me(i,"companyCount")}}function za(e,a={}){const t=(Array.isArray(e)?e:[]).filter(c=>c&&c.id),o=t.reduce((c,u)=>c+Ze(u.companies),0),r=t.map(c=>Oa(c,o)).sort((c,u)=>u.totalMarketCap-c.totalMarketCap||c.name.localeCompare(u.name));r.forEach((c,u)=>{c.rank=u+1});const n=t.flatMap(c=>Array.isArray(c.companies)?c.companies:[]),i=n.filter(c=>we(c)>0),s=t.map(c=>c.generatedAt).filter(Boolean).sort();return{generatedAt:a.generatedAt||s[s.length-1]||null,sectorCount:r.length,totalCompanies:n.length,totalMarketCap:o,dividendPayers:i.length,dividendCoverage:n.length>0?q(i.length/n.length,4):0,indexHhi:Xe(n.map(c=>c.marketCap)),sectors:r,highlights:Ya(r)}}function ja(e,a=Re){const t=String(a||Re),o=t.lastIndexOf("-"),r=o>0?t.slice(0,o):t,n=o>0?t.slice(o+1):"desc";return[...e||[]].sort((i,s)=>{const c=i[r],u=s[r];if(typeof c=="string"||typeof u=="string"){const p=String(c??"").localeCompare(String(u??""),"pt");return n==="asc"?p:-p}const m=(Number(c)||0)-(Number(u)||0);return m!==0?n==="asc"?m:-m:String(i.name).localeCompare(String(s.name),"pt")})}function Ua(){return`
    <div class="si-view">
      <div class="si-loading">
        <div class="loading-spinner"></div>
        <p>A calcular inteligência setorial...</p>
      </div>
    </div>
  `}function xe(e){return`
    <div class="si-view">
      <div class="si-empty">
        <h3>⚠️ ${l(e)}</h3>
        <p>Não foi possível carregar as métricas dos setores. Verifique a ligação à API.</p>
      </div>
    </div>
  `}function Va(e){const a=e.topCompanies||[],t=a.length?a.map((r,n)=>`
          <button
            type="button"
            class="si-company"
            data-symbol="${l(r.symbol)}"
            data-name="${l(r.name)}"
          >
            <span class="si-company-rank">${n+1}</span>
            <span class="si-company-symbol">${l(r.symbol)}</span>
            <span class="si-company-name">${l(r.name)}</span>
            <span class="si-company-cap">${G(r.marketCap)}</span>
            <span class="si-company-weight">${j(r.weight)}</span>
          </button>`).join(""):'<p class="si-muted">Sem empresas com market cap disponível.</p>',o=(e.topSubIndustries||[]).length?`<ul class="si-subindustries">
        ${e.topSubIndustries.map(r=>`
          <li>
            <span>${l(r.name)}</span>
            <span class="si-muted">${r.count} · ${j(r.weight)}</span>
          </li>`).join("")}
      </ul>`:'<p class="si-muted">Sem subindústrias disponíveis.</p>';return`
    <div class="si-detail-grid">
      <section>
        <h4>Top 5 empresas por market cap</h4>
        <div class="si-company-list">${t}</div>
      </section>
      <section>
        <h4>Principais subindústrias</h4>
        ${o}
      </section>
    </div>
  `}function Ga(e){const a=l(e.id),t=e.topCompany||e.topCompanies&&e.topCompanies[0],o=Ra[e.concentration]||"si-badge--low",r=Na[e.incomeProfile]||"si-badge--balanced",n=Math.min(100,(Number(e.marketCapShare)||0)*100).toFixed(1);return`
    <tr class="si-row" data-sector="${a}">
      <td class="si-rank">${e.rank}</td>
      <td class="si-sector-cell">
        <button
          type="button"
          class="si-sector-btn"
          aria-expanded="false"
          aria-controls="si-detail-${a}"
        >
          <span class="si-caret" aria-hidden="true">▸</span>
          <span>${l(e.name)}</span>
        </button>
      </td>
      <td class="si-num">${e.companyCount}</td>
      <td class="si-num">${G(e.totalMarketCap)}</td>
      <td class="si-share">
        <div class="si-bar">
          <span class="si-bar-fill" style="width: ${n}%"></span>
        </div>
        <span class="si-share-value">${j(e.marketCapShare)}</span>
      </td>
      <td class="si-num">${U(e.hhi)}</td>
      <td><span class="si-badge ${o}">${l(e.concentration)}</span></td>
      <td>
        ${t?`<strong>${l(t.symbol)}</strong>
               <span class="si-muted">${j(t.weight)}</span>`:'<span class="si-muted">—</span>'}
      </td>
      <td class="si-num">${j(e.dividendCoverage)}</td>
      <td class="si-num">${(Number(e.averageDividendYield)||0).toFixed(2)}%</td>
      <td><span class="si-badge ${r}">${l(e.incomeProfile)}</span></td>
    </tr>
    <tr class="si-detail" id="si-detail-${a}" hidden>
      <td colspan="11">${Va(e)}</td>
    </tr>
  `}function Wa(e){return[["Setores",String(e.sectorCount??0)],["Empresas",String(e.totalCompanies??0)],["Market cap total",G(e.totalMarketCap)],["Cobertura de dividendos",j(e.dividendCoverage)],["HHI do índice",U(e.indexHhi)]].map(([t,o])=>`
      <div class="si-stat">
        <span class="si-stat-label">${t}</span>
        <span class="si-stat-value">${o}</span>
      </div>`).join("")}function Ka(e){var o,r,n,i;const a=e||{};return[{icon:"🏆",label:"Maior setor",name:(o=a.largestSector)==null?void 0:o.name,detail:a.largestSector?`${j(a.largestSector.share)} do índice`:"Sem dados"},{icon:"🎯",label:"Mais concentrado",name:(r=a.mostConcentrated)==null?void 0:r.name,detail:a.mostConcentrated?`HHI ${U(a.mostConcentrated.hhi)}`:"Sem dados"},{icon:"🧩",label:"Mais diversificado",name:(n=a.mostDiversified)==null?void 0:n.name,detail:a.mostDiversified?`HHI ${U(a.mostDiversified.hhi)}`:"Sem dados"},{icon:"💰",label:"Maior yield médio",name:(i=a.highestYield)==null?void 0:i.name,detail:a.highestYield?`${Number(a.highestYield.averageDividendYield).toFixed(2)}% (pagadoras)`:"Sem pagadoras"}].map(s=>`
      <div class="si-highlight">
        <span class="si-highlight-icon" aria-hidden="true">${s.icon}</span>
        <div>
          <span class="si-highlight-label">${s.label}</span>
          <strong class="si-highlight-name">${l(s.name||"—")}</strong>
          <span class="si-highlight-detail">${l(s.detail)}</span>
        </div>
      </div>`).join("")}function _a(e){if(!e)return"data desconhecida";const a=new Date(e);return Number.isNaN(a.getTime())?l(String(e)):a.toLocaleDateString("pt-BR")}function Ja(e,a){const t=document.getElementById(e);if(!t){console.error(`❌ Contentor ${e} não encontrado!`);return}const o=Array.isArray(a&&a.sectors)?a.sectors:[];if(o.length===0){t.innerHTML=xe("Sem dados setoriais");return}const r=a.source==="local"?"calculado no browser":"servido pela API do S&P 500";t.innerHTML=`
    <div class="si-view">
      <header class="si-header">
        <h2>🧠 Inteligência Setorial GICS</h2>
        <p class="subtitle">
          Comparação dos ${a.sectorCount} setores do S&amp;P 500 por tamanho, concentração,
          amplitude e perfil de dividendos.
        </p>
        <span class="si-source">
          Dados de ${_a(a.generatedAt)} · ${r}
        </span>
      </header>

      <div class="si-stats">${Wa(a)}</div>

      <div class="si-highlights">${Ka(a.highlights)}</div>

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
        ${U(Ce)} concentração alta, ${U(Je)}–
        ${U(Ce)} moderada). Cobertura = percentagem de empresas com dividend
        yield positivo; o yield médio considera apenas as pagadoras. Perfil: Renda ≥ 70%,
        Equilibrado 40–70%, Crescimento &lt; 40%.
      </p>
    </div>
  `;const n=t.querySelector("#si-sort"),i=t.querySelector("#si-tbody");if(!n||!i)return;const s=new Set,c=()=>{i.querySelectorAll(".si-sector-btn").forEach(m=>{m.addEventListener("click",()=>{const p=m.closest("tr"),d=p.nextElementSibling,g=p.dataset.sector,b=m.getAttribute("aria-expanded")==="true";m.setAttribute("aria-expanded",String(!b));const k=m.querySelector(".si-caret");k&&(k.textContent=b?"▸":"▾"),d&&(d.hidden=b),b?s.delete(g):s.add(g)})}),i.querySelectorAll(".si-company").forEach(m=>{m.addEventListener("click",()=>{typeof window.openCompanyDetails=="function"&&window.openCompanyDetails({symbol:m.dataset.symbol,name:m.dataset.name})})})},u=()=>{const m=ja(o,n.value);i.innerHTML=m.map(Ga).join(""),s.forEach(p=>{const d=i.querySelector(`tr[data-sector="${p}"]`);if(!d)return;const g=d.querySelector(".si-sector-btn"),b=d.nextElementSibling;g&&g.setAttribute("aria-expanded","true");const k=g&&g.querySelector(".si-caret");k&&(k.textContent="▾"),b&&(b.hidden=!1)}),c()};n.addEventListener("change",u),u()}function Ne(e){return!!(e&&Array.isArray(e.sectors)&&e.sectors.length>0)}async function Xa(){const e=await fetch(`${R}/api/setores`);if(!e.ok)throw new Error(`HTTP ${e.status} ao listar setores`);const a=await e.json(),t=Array.isArray(a.setores)?a.setores:[],o=await Promise.all(t.map(async r=>{var n;try{const i=await fetch(`${R}/api/setor/${r}`);if(!i.ok)return null;const c=(await i.json()).dados||{};return{id:r,name:c.sector||((n=ye.find(u=>u.id===r))==null?void 0:n.name)||r,companies:Array.isArray(c.companies)?c.companies:[],generatedAt:c.generatedAt||null}}catch(i){return console.error(`Erro ao carregar o setor ${r}:`,i),null}}));return za(o.filter(Boolean))}async function Za(e="sector-intelligence-view"){const a=document.getElementById(e);if(!a){console.error(`❌ Contentor ${e} não encontrado!`);return}a.innerHTML=Ua();let t=await vt(),o="api";if(!Ne(t))try{t=await Xa(),o="local"}catch(r){console.error("Erro ao calcular inteligência setorial no browser:",r),a.innerHTML=xe("Dados indisponíveis");return}if(!Ne(t)){a.innerHTML=xe("Dados indisponíveis");return}Ja(e,{...t,source:o})}const Qe="sp500-price-alerts",Se=50;function Qa(){try{const e=localStorage.getItem(Qe);if(!e)return[];const a=JSON.parse(e);return Array.isArray(a)&&a.length>0&&Array.isArray(a[0])?a:Array.isArray(a)&&a.length>0&&typeof a[0]=="object"?a.map(t=>[t.symbol,t]):[]}catch(e){return console.error("Erro ao carregar price alerts:",e),[]}}function ve(){try{const e=Array.from(ee.entries());localStorage.setItem(Qe,JSON.stringify(e))}catch(e){console.error("Erro ao salvar price alerts:",e)}}function eo(e,a){let t;return function(...r){const n=()=>{clearTimeout(t),e(...r)};clearTimeout(t),t=setTimeout(n,a)}}function $e(){const e=document.getElementById("nav-menu"),a=document.getElementById("menu-toggle");e&&e.classList.remove("open"),a&&a.setAttribute("aria-expanded","false")}function to(){const e=document.getElementById("menu-toggle"),a=document.getElementById("nav-menu");!e||!a||(e.addEventListener("click",t=>{t.stopPropagation();const o=a.classList.toggle("open");e.setAttribute("aria-expanded",String(o))}),document.addEventListener("click",t=>{a.classList.contains("open")&&!a.contains(t.target)&&$e()}),document.addEventListener("keydown",t=>{t.key==="Escape"&&$e()}))}let M=[],P=[],D=1,se="dashboard",Q=new Set;const Pe=new Set,fe=Qa(),ee=new Map(fe&&fe.length>0?fe:[]);let F,O,oe,re,ne,V,Y,J,z;function ao(){F=document.getElementById("sector-filter"),O=document.getElementById("country-filter"),oe=document.getElementById("search-input"),re=document.getElementById("dividend-min"),ne=document.getElementById("sort-select"),V=document.getElementById("table-body"),Y=document.getElementById("stats"),J=document.getElementById("pagination"),z=document.getElementById("header-checkbox"),document.querySelectorAll(".nav-tab").forEach(n=>{n.addEventListener("click",i=>{i.preventDefault();const s=n.getAttribute("data-tab");oo(s),$e()})}),to(),F&&F.addEventListener("change",X),O&&O.addEventListener("change",X),oe&&oe.addEventListener("input",eo(X,300)),re&&re.addEventListener("change",X),ne&&ne.addEventListener("change",X),z&&z.addEventListener("change",()=>{const n=z.checked;V.querySelectorAll(".row-checkbox").forEach(s=>{s.checked=n,s.dispatchEvent(new Event("change"))})});const a=document.getElementById("select-all"),t=document.getElementById("deselect-all"),o=document.getElementById("export-csv"),r=document.getElementById("export-json");a&&a.addEventListener("click",()=>{P.forEach(n=>Q.add(n.symbol)),ie(),ce()}),t&&t.addEventListener("click",()=>{Q.clear(),ie(),ce()}),o&&o.addEventListener("click",So),r&&r.addEventListener("click",$o),et(),ot(),rt(),Aa(),wo()}document.addEventListener("DOMContentLoaded",ao);function oo(e){se=e,et(),ot()}function H(e,a){Pe.has(e)||(Pe.add(e),a())}function et(){const e=document.getElementById("dashboard-view"),a=document.getElementById("treemap-view"),t=document.getElementById("heatmap-view"),o=document.getElementById("bubble-chart-view"),r=document.getElementById("dividends-view"),n=document.getElementById("stock-of-day-view"),i=document.getElementById("daily-curiosity-view"),s=document.getElementById("dow-jones-view"),c=document.getElementById("dividend-kings-view"),u=document.getElementById("dividend-aristocrats-view"),m=document.getElementById("nasdaq-100-view"),p=document.getElementById("sector-intelligence-view");switch([e,a,t,o,r,n,i,s,c,u,m,p].forEach(g=>{g&&(g.style.display="none")}),se){case"dashboard":e&&(e.style.display="block");break;case"stock-of-day":n&&(n.style.display="block",nt());break;case"daily-curiosity":i&&(i.style.display="block",H("daily-curiosity",dt));break;case"treemap":a&&(a.style.display="block",H("treemap",wt));break;case"heatmap":t&&(t.style.display="block",H("heatmap",St));break;case"bubble":o&&(o.style.display="block",tt());break;case"dividends":r&&(r.style.display="block",at());break;case"dow-jones":s&&(s.style.display="block",H("dow-jones",ro));break;case"dividend-kings":c&&(c.style.display="block",H("dividend-kings",no));break;case"dividend-aristocrats":u&&(u.style.display="block",H("dividend-aristocrats",so));break;case"nasdaq-100":m&&(m.style.display="block",H("nasdaq-100",io));break;case"sector-intelligence":p&&(p.style.display="block",H("sector-intelligence",()=>Za("sector-intelligence-view")));break;default:e&&(e.style.display="block")}}function tt(){const e=document.getElementById("bubble-chart-view");if(!e){console.error("❌ bubble-chart-view não encontrado!");return}e.innerHTML='<div style="text-align: center; padding: 40px;"><p>Carregando gráfico de bolhas...</p></div>',Et(M,"bubble-chart-view")}function at(){const e=document.getElementById("dividends-view");if(!e){console.error("❌ dividends-view não encontrado!");return}if(M.length===0){e.innerHTML='<div style="text-align: center; padding: 40px;"><p>Carregando dados de dividendos...</p></div>';return}Ht(M,"dividends-view")}function ro(){if(!document.getElementById("dow-jones-view")){console.error("❌ dow-jones-view não encontrado!");return}Wt("dow-jones-view")}function no(){if(!document.getElementById("dividend-kings-view")){console.error("❌ dividend-kings-view não encontrado!");return}aa("dividend-kings-view")}function so(){if(!document.getElementById("dividend-aristocrats-view")){console.error("❌ dividend-aristocrats-view não encontrado!");return}ma("dividend-aristocrats-view")}function io(){if(!document.getElementById("nasdaq-100-view")){console.error("❌ nasdaq-100-view não encontrado!");return}Sa("nasdaq-100-view")}function ot(){document.querySelectorAll(".nav-tab").forEach(a=>{a.classList.remove("active"),a.getAttribute("data-tab")===se&&a.classList.add("active")})}async function rt(){Y&&(Y.textContent="Carregando dados...");try{const e=await fetch(`${R}/api/setores`);if(!e.ok)throw new Error("Erro ao buscar setores");const o=((await e.json()).setores||[]).map(async n=>{try{const i=await fetch(`${R}/api/setor/${n}`);if(!i.ok)throw new Error(`HTTP ${i.status}`);const s=await i.json(),c=ye.find(m=>m.id===n),u=c?c.name:n;return s.dados&&s.dados.companies&&Array.isArray(s.dados.companies)?{generatedAt:s.dados.generatedAt||null,companies:s.dados.companies.map(m=>({...m,sector:n,sectorName:u}))}:{generatedAt:null,companies:[]}}catch(i){return console.error(`❌ Erro ao carregar ${n}:`,i),{generatedAt:null,companies:[]}}}),r=await Promise.all(o);M=r.flatMap(n=>n.companies),Be(r.map(n=>n.generatedAt).filter(Boolean)),F&&(F.innerHTML='<option value="">Todos os Setores</option>',[...new Set(M.map(i=>i.sector))].sort().forEach(i=>{var c;const s=document.createElement("option");s.value=i,s.textContent=((c=ye.find(u=>u.id===i))==null?void 0:c.name)||i,F.appendChild(s)})),O&&(O.innerHTML='<option value="">Todos os Países</option>',[...new Set(M.map(i=>Ye(i.headquarters)))].sort().forEach(i=>{const s=document.createElement("option");s.value=i,s.textContent=i,O.appendChild(s)})),X(),ce(),se==="bubble"&&tt(),se==="dividends"&&at()}catch(e){console.error("❌ Erro ao carregar dados:",e),Y&&(Y.textContent="Erro ao carregar dados. Tente novamente."),Be([])}}function Be(e){const a=document.getElementById("freshness-badge"),t=document.getElementById("freshness-text");if(!t)return;const o=(e||[]).map(c=>new Date(c)).filter(c=>!Number.isNaN(c.getTime()));if(o.length===0){a&&(a.classList.remove("fd-fresh","fd-aging","fd-stale"),a.classList.add("fd-unknown")),t.textContent="Data indisponível";return}const r=new Date(Math.max(...o.map(c=>c.getTime()))),n=Math.floor((Date.now()-r.getTime())/864e5);let i="fd-fresh";n>30?i="fd-stale":n>7&&(i="fd-aging"),a&&(a.classList.remove("fd-fresh","fd-aging","fd-stale","fd-unknown"),a.classList.add(i));const s=r.toLocaleDateString("pt-BR");t.textContent=`Dados de ${s}`,a&&(a.title=`Última atualização dos dados: ${s}`)}function X(){const e=F?F.value:"",a=O?O.value:"",t=oe?oe.value.toLowerCase():"",o=re&&parseFloat(re.value)||0,r=ne?ne.value:"symbol-asc";P=M.filter(s=>{const c=!e||s.sector===e,u=!a||Ye(s.headquarters)===a,m=!t||s.symbol.toLowerCase().includes(t)||s.name.toLowerCase().includes(t)||s.subIndustry&&s.subIndustry.toLowerCase().includes(t)||s.headquarters&&s.headquarters.toLowerCase().includes(t),p=!o||(parseFloat(s.dividendYield)||0)>=o;return c&&u&&m&&p});const[n,i]=r.split("-");P.sort((s,c)=>{let u=s[n],m=c[n];if(typeof u=="string"){const g=(u||"").localeCompare(m||"");return i==="asc"?g:-g}const p=parseFloat(u)||0,d=parseFloat(m)||0;return i==="asc"?p-d:d-p}),D=1,ie(),ce()}function ie(){if(!V){console.error("❌ tableBody não encontrado!");return}V.innerHTML="";const e=(D-1)*Se,a=e+Se;P.slice(e,a).forEach((o,r)=>{const n=Q.has(o.symbol),i=l(o.symbol),s=document.createElement("tr");s.innerHTML=`
      <td>
        <input type="checkbox" class="row-checkbox" data-symbol="${i}" 
          ${n?"checked":""}>
      </td>
      <td class="col-index">${e+r+1}</td>
      <td><strong>${l(o.symbol)}</strong></td>
      <td>${l(o.name||"N/A")}</td>
      <td>${l(o.sectorName||o.sector||"N/A")}</td>
      <td>${G(o.marketCap)}</td>
      <td>${l(o.subIndustry||o.industry||"N/A")}</td>
      <td>${l(o.headquarters||"N/A")}</td>
      <td>${Oe(o)}</td>
    `;const c=s.querySelector(".row-checkbox");c.addEventListener("change",()=>{c.checked?Q.add(o.symbol):Q.delete(o.symbol),ce(),He()}),V.appendChild(s)}),He(),co()}function He(){if(!z||!V)return;const e=V.querySelectorAll(".row-checkbox"),a=Array.from(e).filter(t=>t.checked).length;z.checked=e.length>0&&a===e.length,z.indeterminate=a>0&&a<e.length}function co(){if(!J)return;J.innerHTML="";const e=Math.ceil(P.length/Se),a=document.createElement("button");a.textContent="Anterior",a.disabled=D===1,a.addEventListener("click",()=>{D>1&&(D--,ie())}),J.appendChild(a);const t=document.createElement("span");t.textContent=`Página ${D} de ${e}`,J.appendChild(t);const o=document.createElement("button");o.textContent="Próxima",o.disabled=D===e,o.addEventListener("click",()=>{D<e&&(D++,ie())}),J.appendChild(o)}function ce(){if(!Y)return;const e=P.length,a=Q.size,t=P.filter(r=>Number(r.dividendYield)>0),o=t.length>0?(t.reduce((r,n)=>r+Number(n.dividendYield),0)/t.length).toFixed(2):"0.00";Y.innerHTML=`Total: ${e} | Selecionadas: ${a} | Yield Médio (pagadoras): ${o}%`}async function nt(){const e=document.getElementById("stock-of-day-view");if(e){e.innerHTML=`
    <div class="stock-of-day-loading">
      <div class="loading-spinner"></div>
      <p>Analisando o mercado... selecionando a melhor oportunidade de hoje</p>
    </div>
  `;try{if(M.length===0&&await rt(),M.length===0){e.innerHTML=`
        <div class="stock-of-day-error">
          <h3>⚠️ Dados indisponíveis</h3>
          <p>Não foi possível carregar as empresas do S&P 500. Verifique a conexão com o servidor.</p>
          <button class="retry-btn" onclick="loadStockOfDay()">Tentar novamente</button>
        </div>
      `;return}const a=new Date().toISOString().slice(0,10),t=vo(a);if(t){qe(e,t);return}const o=await lo();o.primary&&ho(a,o),qe(e,o)}catch(a){console.error("Erro ao carregar Ação do Dia:",a),e.innerHTML=`
      <div class="stock-of-day-error">
        <h3>⚠️ Indisponível no momento</h3>
        <p>Não foi possível gerar a análise. Tente novamente mais tarde.</p>
        <button class="retry-btn" onclick="loadStockOfDay()">Tentar novamente</button>
      </div>
    `}}}function lo(){return new Promise(e=>{setTimeout(()=>{const a=new Date().toISOString().slice(0,10),t=po(a),o=M.filter(c=>c.marketCap&&c.marketCap>1e9).map(c=>{const u=mo(c),m=uo(c.sector),p=(c.dividendYield||0)>2?10:0,d=Math.min(20,Math.log10(c.marketCap/1e9)*5),g=go(c),b=u+m+p+d+g;return{...c,score:Math.round(b*100)/100,breakdown:{technical:u,sector:m,dividend:p,liquidity:Math.round(d),volatility:Math.round(g)},rationale:yo(c,u,m,p)}}).sort((c,u)=>u.score-c.score);if(o.length===0){e({date:a,primary:null,alternatives:[],generatedAt:new Date().toISOString()});return}const r=o.slice(0,Math.min(10,o.length)),n=t%r.length,i=r[n],s=r.filter((c,u)=>u!==n).slice(0,3);e({date:a,primary:i,alternatives:s,generatedAt:new Date().toISOString()})},100)})}function po(e){let a=0;for(let t=0;t<e.length;t++)a=(a<<5)-a+e.charCodeAt(t),a|=0;return Math.abs(a)}function mo(e){let a=50;const t=e.dividendYield||0;t>4?a+=15:t>2?a+=8:t>0&&(a+=3);const o=e.marketCap||0;o>5e11?a+=10:o>1e11?a+=7:o>5e10?a+=5:o>1e10&&(a+=3);const r=(e.subIndustry||"").toLowerCase();["software","semiconductors","biotechnology","cloud","ai","cybersecurity","renewable"].some(i=>r.includes(i))&&(a+=12);const n=(e.name||"").toLowerCase();return["inc.","corporation","technologies","systems","solutions"].some(i=>n.includes(i))&&(a+=3),Math.min(90,a)}function uo(e){return{"information-technology":15,"health-care":8,"consumer-discretionary":5,"communication-services":7,industrials:5,financials:3,materials:2,energy:0,utilities:-2,"real-estate":-3,"consumer-staples":1}[e]||0}function go(e){const a=e.marketCap||0;return a>2e11?8:a>5e10?12:a>1e10?15:18}function yo(e,a,t,o){const r=[];return a>60&&r.push("Fundamentos técnicos sólidos"),t>10&&r.push(`Setor em momento favorável (${e.sectorName})`),o&&r.push(`Dividend yield atrativo (${(e.dividendYield||0).toFixed(1)}%)`),e.marketCap>1e11&&r.push("Grande capitalização — liquidez e estabilidade"),r.length===0&&r.push("Equilíbrio entre risco e retorno"),r.join(" • ")}function vo(e){try{const a=localStorage.getItem("sp500-stock-of-day");if(!a)return null;const t=JSON.parse(a);return t.date===e&&t.primary?t:null}catch{return null}}function ho(e,a){try{localStorage.setItem("sp500-stock-of-day",JSON.stringify(a))}catch{}}function qe(e,a){const{primary:t,alternatives:o,generatedAt:r}=a;if(!t){e.innerHTML=`
      <div class="stock-of-day-error">
        <h3>⚠️ Sem dados suficientes</h3>
        <p>Não foi possível selecionar uma ação com os dados disponíveis.</p>
        <button class="retry-btn" onclick="loadStockOfDay()">Tentar novamente</button>
      </div>
    `;return}e.innerHTML=`
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
          <div class="stock-symbol">${l(t.symbol)}</div>
          <div class="stock-name">${l(t.name)}</div>
          <div class="stock-sector">${l(t.sectorName||t.sector)}</div>
        </div>

        <div class="stock-score">
          <div class="score-circle" style="--score: ${t.score}">
            <span class="score-value">${t.score}</span>
            <span class="score-label">/ 100</span>
          </div>
          <div class="score-breakdown">
            ${Object.entries(t.breakdown).map(([n,i])=>`
              <div class="score-bar">
                <span class="bar-label">${n}</span>
                <div class="bar-track"><div class="bar-fill" style="width: ${Math.min(100,i*2)}%"></div></div>
                <span class="bar-value">${i}</span>
              </div>
            `).join("")}
          </div>
        </div>

        <div class="stock-rationale">
          <h4>🎯 Por que esta ação?</h4>
          <p>${t.rationale}</p>
        </div>

        <div class="stock-metrics">
          <div class="metric">
            <span class="metric-label">Market Cap</span>
            <span class="metric-value">${G(t.marketCap)}</span>
          </div>
          <div class="metric">
            <span class="metric-label">Div. Yield</span>
            <span class="metric-value">${(t.dividendYield||0).toFixed(2)}%</span>
          </div>
          <div class="metric">
            <span class="metric-label">Setor</span>
            <span class="metric-value">${l(t.sectorName||t.sector)}</span>
          </div>
          <div class="metric">
            <span class="metric-label">Sub-setor</span>
            <span class="metric-value">${l(t.subIndustry||"N/A")}</span>
          </div>
        </div>

        <div class="stock-actions">
          <button class="action-btn secondary" onclick="openCompanyDetails({symbol:'${t.symbol}',name:'${l(t.name).replace(/'/g,"\\'")}'})">
            📈 Ver Detalhes
          </button>
          <button class="action-btn ghost" onclick="setPriceAlertPrompt('${t.symbol}')">🔔 Criar Alerta</button>
        </div>
      </div>

      <section class="stock-alternatives">
        <h3>🥈 Menções Honrosas</h3>
        <div class="alternatives-grid">
          ${o.map((n,i)=>`
            <div class="alt-card">
              <span class="alt-rank">${i+2}º</span>
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
        <p class="generated-at">Gerado em ${new Date(r).toLocaleTimeString("pt-BR")} • Baseado em ${M.length} empresas do S&P 500</p>
      </footer>
    </div>
  `}function fo(e){const a=e.toUpperCase(),t=ee.get(a);if(t&&t.triggered){confirm(`${e}: alerta já disparado. Remover?`)&&ko(a);return}const o=prompt(`Alerta de preço para ${e}:
Digite o preço alvo (ex: 150.25):`,t?t.target.toFixed(2):"");if(!o)return;const r=parseFloat(o);if(isNaN(r)||r<=0){alert("Preço inválido");return}const n=confirm(`Alertar quando o preço estiver ACIMA deste valor?
(OK = acima, Cancelar = abaixo)`)?"above":"below";bo(a,r,n)}function bo(e,a,t){return!e||typeof a!="number"||!["above","below"].includes(t)?!1:(ee.set(e.toUpperCase(),{target:a,direction:t,triggered:!1}),ve(),!0)}function ko(e){ee.delete(e.toUpperCase()),ve()}window.loadStockOfDay=nt;window.openCompanyDetails=kt;window.setPriceAlertPrompt=fo;async function Co(){const e=[];for(const[a,t]of ee)if(!t.triggered)try{const o=await ze(a),r=o[o.length-1],n=r?Number(r.close):NaN;if(!Number.isFinite(n))continue;(t.direction==="above"&&n>=t.target||t.direction==="below"&&n<=t.target)&&(t.triggered=!0,t.triggeredAt=new Date().toISOString(),t.triggeredPrice=n,e.push(`${a} ($${n.toFixed(2)})`))}catch(o){console.error(`Erro ao verificar ${a}:`,o)}return e.length>0&&(ve(),window.alert(`🔔 Alerta(s) de preço atingido(s): ${e.join(", ")}`)),e}async function wo(){ee.size!==0&&setInterval(async()=>{await Co(),ve()},6e4)}function xo(e){return`"${(e==null?"":String(e)).replace(/"/g,'""')}"`}function So(){const e=["#","Símbolo","Empresa","Setor","Market Cap","Subindústria","Sede","Dividend Yield"],a=P.map((o,r)=>[r+1,o.symbol,o.name,o.sectorName,G(o.marketCap),o.subIndustry||o.industry||"N/A",o.headquarters||"N/A",Oe(o)]),t=[e,...a].map(o=>o.map(xo).join(",")).join(`
`);st(t,"sp500-export.csv","text/csv")}function $o(){const e=JSON.stringify(P,null,2);st(e,"sp500-export.json","application/json")}function st(e,a,t){const o=new Blob([e],{type:t}),r=URL.createObjectURL(o),n=document.createElement("a");n.href=r,n.download=a,document.body.appendChild(n),n.click(),document.body.removeChild(n),URL.revokeObjectURL(r)}
