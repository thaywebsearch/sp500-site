(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))o(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const n of r.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&o(n)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();const fe=window.location.hostname,V=fe==="localhost"||fe==="127.0.0.1"?"http://localhost:5001":"https://sp500-site-production.up.railway.app",pe=[{id:"communication-services",name:"Communication Services"},{id:"consumer-discretionary",name:"Consumer Discretionary"},{id:"consumer-staples",name:"Consumer Staples"},{id:"energy",name:"Energy"},{id:"financials",name:"Financials"},{id:"health-care",name:"Health Care"},{id:"industrials",name:"Industrials"},{id:"information-technology",name:"Information Technology"},{id:"materials",name:"Materials"},{id:"real-estate",name:"Real Estate"},{id:"utilities",name:"Utilities"}];window.API_BASE_URL=V;window.SECTORS=pe;let q=[],h=null,re=0,ue="",Ae="alfabética";async function Ve(){try{const e=document.getElementById("daily-curiosity-view");if(!e){console.error("Elemento daily-curiosity-view não encontrado");return}e.innerHTML='<div class="curiosidade-loading">Carregando curiosidade...</div>';const a=await fetch(`${V}/api/curiosidades`);if(!a.ok){console.error(`Erro ao buscar curiosidades: ${a.status}`),e.innerHTML=`<div class="curiosidade-erro">Erro ao carregar curiosidades (${a.status})</div>`;return}const t=await a.json();if(!t.sucesso||!t.dados||!t.dados.curiosidades){console.error("Dados de curiosidades inválidos:",t),e.innerHTML='<div class="curiosidade-erro">Formato de dados inválido</div>';return}if(q=t.dados.curiosidades,re=t.dados.total||q.length,ue=t.dados.proximaEmpresa||"",Ae=t.dados.ordem||"alfabética",q.length===0){e.innerHTML='<div class="curiosidade-erro">Nenhuma curiosidade disponível</div>';return}Ge(),Ke()}catch(e){console.error("Erro ao carregar curiosidades:",e);const a=document.getElementById("daily-curiosity-view");a&&(a.innerHTML=`<div class="curiosidade-erro">Erro ao carregar: ${e.message}</div>`)}}function Ge(){if(q.length===0)return;const e=new Date,a=new Date(e.getFullYear(),e.getMonth(),e.getDate()),o=Math.floor(a.getTime()/864e5)%q.length;h=q[o]}function Ke(){const e=document.getElementById("daily-curiosity-view");if(!e||!h){console.error("View ou curiosidade não encontrada");return}Je();const a=`
    <div class="curiosidade-container">
      <div class="curiosidade-header">
        <h1>🌟 Curiosidade do Dia</h1>
        <p class="curiosidade-data">${We()}</p>
      </div>

      <div class="curiosidade-card">
        <div class="curiosidade-simbolo">
          <span class="simbolo-badge">${h.simbolo}</span>
          <span class="posicao-badge">#${h.posicao}</span>
        </div>

        <div class="curiosidade-conteudo">
          <h2 class="curiosidade-empresa">${h.empresa}</h2>
          <p class="curiosidade-setor">
            <strong>Setor:</strong> ${h.setor||"N/A"}
          </p>

          <div class="curiosidade-titulo">
            <h3>${h.titulo}</h3>
          </div>

          <div class="curiosidade-descricao">
            <p>${h.descricao}</p>
          </div>

          ${h.fatos&&h.fatos.length>0?`
            <div class="curiosidade-fatos">
              <h4>📊 Fatos Interessantes:</h4>
              <ul>
                ${h.fatos.map(t=>`<li>${t}</li>`).join("")}
              </ul>
            </div>
          `:""}

          ${h.dividendYield?`
            <div class="curiosidade-dados">
              <p><strong>Dividend Yield:</strong> ${h.dividendYield}</p>
            </div>
          `:""}

          ${h.marketCap?`
            <div class="curiosidade-dados">
              <p><strong>Market Cap:</strong> ${h.marketCap}</p>
            </div>
          `:""}

          ${h.insight?`
            <div class="curiosidade-insight">
              <p><em>💡 ${h.insight}</em></p>
            </div>
          `:""}

          ${re>0?`
            <div class="curiosidade-progresso">
              <div class="progresso-texto">
                <span>Rotatividade diária · ordem ${Ae}</span>
                <span>Empresa ${h.posicao} de ${re}</span>
              </div>
              <div class="progresso-barra">
                <div class="progresso-preenchido" style="width: ${Number(h.posicao)/re*100}%;"></div>
              </div>
            </div>
          `:""}

          <div class="curiosidade-acoes">
            <button class="btn-compartilhar" onclick="compartilharCuriosidade()">
              📤 Compartilhar
            </button>
            ${h.link?`
              <a href="${h.link}" target="_blank" class="btn-saibamais">
                🔗 Saiba Mais
              </a>
            `:""}
          </div>
        </div>
      </div>

      <div class="curiosidade-footer">
        <p>Curiosidade de ${h.empresa} - Atualizado em ${h.dataAdicao||"N/A"}</p>
        ${ue?`<p class="curiosidade-proxima">⏭️ Amanhã: ${ue}</p>`:""}
        <p class="curiosidade-dica">💡 Uma empresa diferente a cada dia, em ordem alfabética do S&P 500!</p>
      </div>
    </div>
  `;e.innerHTML=a,window.compartilharCuriosidade=_e}function Je(){if(document.getElementById("curiosidade-styles"))return;const e=document.createElement("style");e.id="curiosidade-styles",e.textContent=`
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
  `,document.head.appendChild(e)}function _e(){if(!h)return;const e=(h.fatos||[]).map(t=>`• ${t}`).join(`
`),a=`🌟 Curiosidade do Dia: ${h.empresa} (${h.simbolo})

${h.descricao}

${e}

💡 ${h.insight||""}`;navigator.share?navigator.share({title:`Curiosidade do Dia - ${h.empresa}`,text:a,url:window.location.href}).catch(t=>console.error("Erro ao compartilhar:",t)):navigator.clipboard.writeText(a).then(()=>{alert("Curiosidade copiada para a área de transferência!")}).catch(t=>{alert("Erro ao copiar: "+t)})}function We(){const e=new Date,a={weekday:"long",year:"numeric",month:"long",day:"numeric"};return e.toLocaleDateString("pt-BR",a)}function ne(e){const a=Number(e);return!a||Number.isNaN(a)?"N/A":a>=1e12?`$${(a/1e12).toFixed(3)}T`:a>=1e9?`$${(a/1e9).toFixed(2)}B`:a>=1e6?`$${(a/1e6).toFixed(2)}M`:`$${a.toLocaleString("en-US")}`}function De(e){if(!e||e.hasDividend==="Não")return"N/A";const a=Number(e.dividendYield);return Number.isFinite(a)?`${a.toFixed(2)}%`:"N/A"}function p(e){return e?String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;"):""}const Ze=new Set(["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming","D.C."]);function Me(e){if(!e)return"Desconhecido";const a=String(e).split(",").map(o=>o.trim().replace(/\[\d+\]$/,"")),t=a[a.length-1];return!t||t.toLowerCase()==="none"?"Desconhecido":Ze.has(t)?"United States":t}async function Te(e){try{const a=await fetch(`${V}/api/historico/${e}`);if(!a.ok)throw new Error(`Erro ao buscar histórico de ${e}`);return(await a.json()).registros||[]}catch(a){return console.error(`Erro ao buscar histórico de ${e}:`,a),[]}}const se=760,ce=320,$={top:28,right:28,bottom:44,left:68};function Xe(e){if(!e)return"";const[a,t,o]=e.split("-");return`${o}/${t}/${a.slice(2)}`}function me(e){return Number.isFinite(e)?e>=100?`$${e.toFixed(0)}`:`$${e.toFixed(2)}`:"—"}function Qe(e){const a=e.map(f=>f.close),t=Math.min(...a),o=Math.max(...a),s=o-t||1,r=t-s*.08,n=o+s*.08,i=e.length,d=f=>$.left+f/(i-1)*(se-$.left-$.right),u=f=>$.top+(1-(f-r)/(n-r))*(ce-$.top-$.bottom);let l=`<svg viewBox="0 0 ${se} ${ce}" style="width:100%;height:auto;display:block;background:var(--plot-bg);border-radius:8px">`;const m=5;for(let f=0;f<=m;f++){const b=r+(n-r)*f/m,C=u(b);l+=`<line x1="${$.left}" y1="${C.toFixed(1)}" x2="${se-$.right}" y2="${C.toFixed(1)}" stroke="var(--chart-axis)" stroke-width="1"/>`,l+=`<text x="${$.left-8}" y="${(C+4).toFixed(1)}" text-anchor="end" font-size="11" fill="var(--chart-label)">${me(b)}</text>`}const c=[];for(let f=0;f<=4;f++)c.push(Math.round((i-1)*f/4));c.forEach(f=>{const b=d(f);l+=`<text x="${b.toFixed(1)}" y="${ce-$.bottom+18}" text-anchor="middle" font-size="11" fill="var(--chart-label)">${Xe(e[f].data)}</text>`});const y=e.map((f,b)=>`${d(b).toFixed(1)},${u(f.close).toFixed(1)}`).join(" "),w=`${$.left},${u(r).toFixed(1)} `+y+` ${d(i-1).toFixed(1)},${u(r).toFixed(1)}`;l+=`<polygon points="${w}" fill="rgba(0, 212, 255, 0.08)"/>`,l+=`<polyline points="${y}" fill="none" stroke="var(--accent-cyan)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;const k=e[i-1],g=u(k.close);return l+=`<circle cx="${d(i-1).toFixed(1)}" cy="${g.toFixed(1)}" r="4" fill="var(--accent-cyan)"/>`,l+=`<text x="${se-$.right}" y="${(g-10).toFixed(1)}" text-anchor="end" font-size="12" font-weight="700" fill="var(--chart-text)">${me(k.close)}</text>`,l+="</svg>",l}async function et(e,a){var s;(s=document.querySelector(".modal-overlay"))==null||s.remove();const t=document.createElement("div");t.className="modal-overlay";const o=()=>t.remove();t.addEventListener("click",r=>{r.target===t&&o()}),document.addEventListener("keydown",r=>{r.key==="Escape"&&o()}),t.innerHTML=`
    <div class="modal" role="dialog" aria-label="Histórico de ${p(e)}">
      <div class="modal-header">
        <h2 class="modal-title">
          📈 ${p(e)}
          <span class="modal-subtitle">${p(a||"")}</span>
        </h2>
        <button class="modal-close" aria-label="Fechar">✕</button>
      </div>
      <div class="modal-body" id="price-chart-body">
        <p class="modal-loading">Carregando histórico...</p>
      </div>
    </div>
  `,document.body.appendChild(t),t.querySelector(".modal-close").addEventListener("click",o);try{const r=await Te(e),n=t.querySelector("#price-chart-body");if(!r||r.length===0){n.innerHTML=`<p class="modal-error">Nenhum dado de preço disponível para ${p(e)}.</p>`;return}const i=r[0].close,d=r[r.length-1].close,u=(d-i)/i*100,l=u>=0,m=l?"positive":"negative";n.innerHTML=`
      <div class="price-stats">
        <div class="price-stat">
          <span class="price-stat-label">Último</span>
          <strong>${me(d)}</strong>
        </div>
        <div class="price-stat">
          <span class="price-stat-label">Variação (2a)</span>
          <strong class="${m}">${l?"+":""}${u.toFixed(2)}%</strong>
        </div>
        <div class="price-stat">
          <span class="price-stat-label">Período</span>
          <strong>${r.length} pregões</strong>
        </div>
      </div>
      ${Qe(r)}
    `}catch(r){console.error(`Erro ao buscar histórico de ${e}:`,r);const n=t.querySelector("#price-chart-body");n.innerHTML=`<p class="modal-error">Erro ao carregar o histórico de ${p(e)}. Verifique se o backend está online.</p>`}}function D(e,a){return`
    <div class="company-detail">
      <span class="company-detail-label">${e}</span>
      <strong class="company-detail-value">${a}</strong>
    </div>
  `}function tt(e){var r;(r=document.querySelector(".modal-overlay"))==null||r.remove();const a=document.createElement("div");a.className="modal-overlay";const t=()=>a.remove();a.addEventListener("click",n=>{n.target===a&&t()}),document.addEventListener("keydown",n=>{n.key==="Escape"&&t()});const o=e.dividendYield!==null&&e.dividendYield!==void 0?`${e.dividendYield.toFixed(2)}%`:"—",s=ne(e.marketCap);a.innerHTML=`
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
          ${D("Empresa",p(e.name||"N/A"))}
          ${D("Setor",p(e.sectorName||e.sector||"N/A"))}
          ${D("Subindústria",p(e.subIndustry||"N/A"))}
          ${D("Sede",p(e.headquarters||"N/A"))}
          ${D("Market Cap",s)}
          ${D("Classificação",p(e.marketCapClassification||"N/A"))}
          ${D("Div. Yield",o)}
          ${D("Paga dividendos",e.hasDividend?p(e.hasDividend):"—")}
          ${D("Data de inclusão",p(e.dateAdded||"N/A"))}
          ${D("CIK",e.cik?p(String(e.cik)):"N/A")}
          ${D("Fundação",p(e.founded||"N/A"))}
        </div>
        <div class="modal-footer">
          <button class="modal-action" id="details-chart-btn">📈 Ver histórico de preços</button>
        </div>
      </div>
    </div>
  `,document.body.appendChild(a),a.querySelector(".modal-close").addEventListener("click",t),a.querySelector("#details-chart-btn").addEventListener("click",()=>{et(e.symbol,e.name)})}function at(e,a){const t=e/a*100;return t>=80?"#ff5252":t>=60?"#ff9800":t>=40?"#ffeb3b":t>=20?"#8bc34a":"#4caf50"}async function ot(){const e=document.getElementById("treemap-view");if(e){e.style.display="flex",e.style.flexDirection="column",e.style.height="100%",e.style.width="100%",e.style.margin="0",e.style.padding="0",e.style.background="var(--bg-primary)",e.innerHTML='<div style="display:flex;align-items:center;justify-content:center;height:100%;width:100%;font-size:14px;color:var(--text-secondary)">Carregando mapa de setores...</div>';try{const o=(await(await fetch(`${window.API_BASE_URL}/api/setores`)).json()).setores||[],s=await Promise.all(o.map(async i=>{var k;const u=await(await fetch(`${window.API_BASE_URL}/api/setor/${i}`)).json(),l=window.SECTORS.find(g=>g.id===i),m=((k=u.dados)==null?void 0:k.companies)||[],c=m.reduce((g,f)=>g+(f.marketCap||0),0),y=m.length>0?m.reduce((g,f)=>g+(f.dividendYield||0),0)/m.length:0,w=m.filter(g=>g.hasDividend==="Sim").length;return{id:i,name:(l==null?void 0:l.name)||i,cap:(c/1e9).toFixed(1),companies:m.length,avgDiv:parseFloat(y.toFixed(2)),withDiv:w,topCompany:m.length>0?m[0].symbol:"N/A"}})),r=Math.max(...s.map(i=>parseFloat(i.cap)));let n=`
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
    `;s.forEach(i=>{const d=at(parseFloat(i.cap),r),u=(parseFloat(i.cap)/r*100).toFixed(1),l=["consumer-staples","communication-services","consumer-discretionary","energy","financials","health-care","industrials","information-technology","materials","real-estate","utilities"].includes(i.id),m=l?new URL(`sector.html?sector=${i.id}`,document.baseURI).href:"#";n+=`
        <div style="
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 24px;
          transition: all 0.3s ease;
          cursor: ${l?"pointer":"not-allowed"};
          display: flex;
          flex-direction: column;
          gap: 20px;
          opacity: ${l?"1":"0.7"};
        "
        onmouseover="${l?`this.style.borderColor='${d}';this.style.background='rgba(${parseInt(d.slice(1,3),16)},${parseInt(d.slice(3,5),16)},${parseInt(d.slice(5,7),16)},0.05)';this.style.transform='translateY(-4px)';this.style.boxShadow='0 12px 32px ${d}22'`:""}"
        onmouseout="${l?"this.style.borderColor='var(--border)';this.style.background='var(--bg-secondary)';this.style.transform='translateY(0)';this.style.boxShadow='none'":""}"
        onclick="${l?`navigateToSector('${m}', '${i.id}')`:`alert('🔒 O setor \\"${i.name}\\" ainda está em desenvolvimento.\\n\\nApenas Consumer Staples, Communication Services, Consumer Discretionary, Energy, Financials, Health Care, Industrials, Information Technology, Materials, Real Estate e Utilities estão disponíveis por enquanto!')`}"
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
              ">${i.name}</div>
              <div style="
                font-size: 12px;
                color: var(--text-secondary);
              ">${i.companies} empresas</div>
            </div>
            <div style="
              background: ${d}22;
              border: 1px solid ${d}44;
              padding: 8px 12px;
              border-radius: 6px;
              font-size: 13px;
              font-weight: 700;
              color: ${d};
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
                background: linear-gradient(90deg, ${d}44, ${d});
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
                color: ${d};
              ">$${i.cap}B</div>
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
              ">${i.topCompany}</div>
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
              ">${i.avgDiv.toFixed(2)}%</div>
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
              ">${i.withDiv}/${i.companies}</div>
            </div>
          </div>

          <!-- CTA Button -->
          ${l?`
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
      `}),n+=`
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
    `,e.innerHTML=n}catch(a){console.error("Erro ao carregar treemap:",a),e.innerHTML='<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--accent-red)">Erro ao carregar mapa de setores</div>'}}}function st(e,a){if(e==="#"){alert(`🔒 O setor "${a}" ainda está em desenvolvimento.

Apenas Consumer Staples, Communication Services, Consumer Discretionary, Energy, Financials, Health Care, Industrials, Information Technology, Materials, Real Estate e Utilities estão disponíveis por enquanto!`);return}window.open(e,"_blank")}window.navigateToSector=st;async function rt(){var a;const e=document.getElementById("heatmap-view");if(e){e.style.display="flex",e.style.flexDirection="column",e.style.height="100%",e.style.width="100%",e.style.padding="40px",e.style.boxSizing="border-box",e.style.background="var(--bg-primary)",e.style.overflowY="auto",e.innerHTML='<div style="text-align:center;color:var(--text-secondary)">Carregando heatmap...</div>';try{const s=(await(await fetch(`${window.API_BASE_URL}/api/setores`)).json()).setores||[];let r=`
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
    `;for(const n of s){const d=await(await fetch(`${window.API_BASE_URL}/api/setor/${n}`)).json(),u=window.SECTORS.find(c=>c.id===n),l=((a=d.dados)==null?void 0:a.companies)||[];if(l.length===0)continue;const m=l.sort((c,y)=>(y.marketCap||0)-(c.marketCap||0)).slice(0,4);r+=`
        <div style="margin-bottom: 40px;">
          <h3 style="
            font-size: 16px;
            margin: 0 0 20px 0;
            color: var(--text-primary);
            font-weight: 600;
          ">${(u==null?void 0:u.name)||n}</h3>

          <div style="
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 16px;
          ">
      `,m.forEach((c,y)=>{const w=(c.marketCap/1e9).toFixed(2),k=(c.dividendYield||0).toFixed(2);let g="#4caf50";w>500?g="#ff5252":w>200?g="#ff9800":w>100?g="#ffeb3b":w>50&&(g="#8bc34a"),r+=`
          <div style="
            background: linear-gradient(135deg, rgba(0, 212, 255, 0.05) 0%, rgba(0, 230, 118, 0.02) 100%);
            border: 1px solid var(--border);
            border-radius: 8px;
            padding: 16px;
            transition: all 0.3s ease;
          "
          onmouseover="this.style.borderColor='${g}';this.style.background='linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(0, 230, 118, 0.05) 100%)';this.style.transform='translateY(-2px)'"
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
              ">${c.symbol}</div>
              <div style="
                font-size: 11px;
                background: ${g}22;
                color: ${g};
                padding: 4px 8px;
                border-radius: 4px;
                font-weight: 600;
              ">
                #${y+1}
              </div>
            </div>

            <div style="
              font-size: 12px;
              color: var(--text-secondary);
              margin-bottom: 12px;
              word-break: break-word;
            ">
              ${c.name}
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
                  color: ${g};
                ">$${w}B</div>
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
        `}),r+=`
          </div>
        </div>
      `}r+=`
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
    `,e.innerHTML=r}catch(t){console.error("Erro ao carregar heatmap:",t),e.innerHTML=`
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
    `}}}const it={Energy:"#FF6B6B",Materials:"#C92A2A",Industrials:"#FFA94D","Consumer Discretionary":"#FFD43B","Consumer Staples":"#A9E34B","Health Care":"#51CF66",Financials:"#40C057","Information Technology":"#339AF0","Communication Services":"#748FFC",Utilities:"#9775FA","Real Estate":"#DA77F2"};function Le(e){return it[e]||"#808080"}function he(e){if(!e)return 0;if(typeof e=="number")return e;const t=String(e).toUpperCase().trim().replace(/[$€¥₹]/g,"").trim();return t.includes("T")?parseFloat(t.replace("T",""))*1e12:t.includes("B")?parseFloat(t.replace("B",""))*1e9:t.includes("M")?parseFloat(t.replace("M",""))*1e6:parseFloat(t)||0}function nt(e){if(!e)return 0;if(typeof e=="number")return e;const a=String(e).trim();return parseFloat(a.replace("%",""))||0}function dt(e,a){const t=document.getElementById(a);if(!t){console.error(`❌ Contentor ${a} não encontrado!`);return}t.innerHTML="";const o=e.filter(v=>he(v.marketCap)>0&&v.sectorName).map((v,T)=>({symbol:v.symbol,name:v.name,sector:v.sectorName,marketCap:he(v.marketCap),dividendYield:nt(v.dividendYield),index:T}));if(o.length===0){t.innerHTML="<p>Sem dados disponíveis para o gráfico de bolhas.</p>";return}const s={top:40,right:40,bottom:60,left:60},r=Math.max(window.innerWidth-100,800)-s.left-s.right,n=600-s.top-s.bottom,i=Math.min(...o.map(v=>v.dividendYield)),d=Math.max(...o.map(v=>v.dividendYield)),u=Math.min(...o.map(v=>v.marketCap)),l=Math.max(...o.map(v=>v.marketCap)),m=v=>n-(v-i)/(d-i||1)*n,c=v=>5+(v-u)/(l-u||1)*50,y=(()=>{let v=42;return()=>(v=(v*9301+49297)%233280,v/233280)})(),w=o.map(()=>y()*r),k=document.createElementNS("http://www.w3.org/2000/svg","svg");k.setAttribute("width",r+s.left+s.right),k.setAttribute("height",n+s.top+s.bottom),k.style.cssText="display: block; margin: 20px auto; background: var(--plot-bg); border-radius: 8px;";const g=document.createElementNS("http://www.w3.org/2000/svg","g");g.setAttribute("transform",`translate(${s.left},${s.top})`);for(let v=0;v<=10;v++){const T=v/10*n,oe=i+v/10*(d-i),E=document.createElementNS("http://www.w3.org/2000/svg","line");E.setAttribute("x1",0),E.setAttribute("y1",T),E.setAttribute("x2",r),E.setAttribute("y2",T),E.setAttribute("stroke","var(--chart-axis)"),E.setAttribute("stroke-width","1"),E.setAttribute("stroke-dasharray","4"),g.appendChild(E);const S=document.createElementNS("http://www.w3.org/2000/svg","text");S.setAttribute("x",-10),S.setAttribute("y",T+5),S.setAttribute("text-anchor","end"),S.setAttribute("font-size","12"),S.setAttribute("fill","var(--chart-label)"),S.textContent=oe.toFixed(1)+"%",g.appendChild(S)}const f=document.createElementNS("http://www.w3.org/2000/svg","line");f.setAttribute("x1",0),f.setAttribute("y1",0),f.setAttribute("x2",0),f.setAttribute("y2",n),f.setAttribute("stroke","var(--chart-label)"),f.setAttribute("stroke-width","2"),g.appendChild(f);const b=document.createElementNS("http://www.w3.org/2000/svg","text");b.setAttribute("transform","rotate(-90)"),b.setAttribute("y",-40),b.setAttribute("x",-n/2),b.setAttribute("text-anchor","middle"),b.setAttribute("font-size","14"),b.setAttribute("font-weight","bold"),b.setAttribute("fill","var(--chart-text)"),b.textContent="💵 Dividend Yield (%)",g.appendChild(b);const C=document.createElementNS("http://www.w3.org/2000/svg","line");C.setAttribute("x1",0),C.setAttribute("y1",n),C.setAttribute("x2",r),C.setAttribute("y2",n),C.setAttribute("stroke","var(--chart-label)"),C.setAttribute("stroke-width","2"),g.appendChild(C);const N=document.createElementNS("http://www.w3.org/2000/svg","text");N.setAttribute("x",r/2),N.setAttribute("y",n+45),N.setAttribute("text-anchor","middle"),N.setAttribute("font-size","14"),N.setAttribute("font-weight","bold"),N.setAttribute("fill","var(--chart-text)"),N.textContent="📊 Distribuição Aleatória (cada bolha = empresa)",g.appendChild(N),o.forEach((v,T)=>{const oe=w[T],E=m(v.dividendYield),S=c(v.marketCap),Ue=Le(v.sector),x=document.createElementNS("http://www.w3.org/2000/svg","circle");if(x.setAttribute("cx",oe),x.setAttribute("cy",E),x.setAttribute("r",S),x.setAttribute("fill",Ue),x.setAttribute("opacity","0.7"),x.setAttribute("stroke","#fff"),x.setAttribute("stroke-width","2"),x.style.cursor="pointer",x.style.transition="all 0.3s ease",x.addEventListener("mouseover",A=>{x.setAttribute("opacity","1"),x.setAttribute("stroke-width","3"),lt(A,v)}),x.addEventListener("mouseout",()=>{x.setAttribute("opacity","0.7"),x.setAttribute("stroke-width","2"),Ie()}),g.appendChild(x),S>15){const A=document.createElementNS("http://www.w3.org/2000/svg","text");A.setAttribute("x",oe),A.setAttribute("y",E+5),A.setAttribute("text-anchor","middle"),A.setAttribute("font-size",Math.max(10,S/2)),A.setAttribute("font-weight","bold"),A.setAttribute("fill","#fff"),A.setAttribute("pointer-events","none"),A.textContent=v.symbol.substring(0,3),g.appendChild(A)}}),k.appendChild(g),t.appendChild(k),ct(t,o)}function ct(e,a){const t=document.createElement("div");t.style.cssText=`
    margin: 30px auto;
    max-width: 800px;
    padding: 20px;
    background: var(--surface);
    border-radius: 8px;
    border: 1px solid var(--border);
  `;const o=document.createElement("h3");o.textContent="🫧 Como ler o gráfico",o.style.cssText="margin: 0 0 12px 0; color: var(--text-primary);",t.appendChild(o);const s=document.createElement("div");s.style.cssText="margin-bottom: 16px; font-size: 13px; color: var(--text-secondary); line-height: 1.8;",s.innerHTML=`
    <div><strong>Tamanho da bolha:</strong> Market Cap da empresa (quanto maior, mais valiosa)</div>
    <div><strong>Eixo Y (vertical):</strong> Dividend Yield (mais acima = maior dividendo)</div>
    <div><strong>Eixo X (horizontal):</strong> posição aleatória, apenas para facilitar a visualização</div>
    <div><strong>Cor:</strong> setor da empresa</div>
  `,t.appendChild(s);const r=document.createElement("div");r.textContent="Setores",r.style.cssText="font-size: 13px; font-weight: 600; color: var(--text-primary); margin-bottom: 8px;",t.appendChild(r);const n=new Set(a.map(d=>d.sector)),i=document.createElement("div");i.style.cssText="display: flex; flex-wrap: wrap; gap: 12px;",n.forEach(d=>{const u=document.createElement("div");u.style.cssText="display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text-primary);";const l=document.createElement("span");l.style.cssText=`display: inline-block; width: 14px; height: 14px; border-radius: 50%; background: ${Le(d)};`;const m=document.createElement("span");m.textContent=d,u.appendChild(l),u.appendChild(m),i.appendChild(u)}),t.appendChild(i),e.appendChild(t)}let ie=null;function lt(e,a){Ie();const t=document.createElement("div");t.style.cssText=`
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
  `;const s=e.target.getBoundingClientRect();t.style.left=s.left+10+"px",t.style.top=s.top-10+"px",document.body.appendChild(t),ie=t}function Ie(){ie&&(ie.remove(),ie=null)}function I(e){const a=Number(e&&e.dividendYield);return Number.isFinite(a)&&a>0?a:0}function ae(e){return(e||[]).filter(a=>I(a)>0)}function pt(e){const a=ae(e);return a.length===0?0:a.reduce((o,s)=>o+I(s),0)/a.length}function ut(e){const a=ae(e).map(I).sort((o,s)=>o-s);if(a.length===0)return 0;const t=Math.floor(a.length/2);return a.length%2===0?(a[t-1]+a[t])/2:a[t]}function mt(e){const a=e||[],t=ae(a),o=t.map(I);return{total:a.length,payers:t.length,nonPayers:a.length-t.length,payerRatio:a.length>0?t.length/a.length:0,avgYield:pt(a),medianYield:ut(a),maxYield:o.length>0?Math.max(...o):0}}function vt(e,a=15){return ae(e).slice().sort((t,o)=>I(o)-I(t)||String(t.symbol).localeCompare(String(o.symbol))).slice(0,a)}const gt=[{label:"0–1%",min:0,max:1},{label:"1–2%",min:1,max:2},{label:"2–3%",min:2,max:3},{label:"3–4%",min:3,max:4},{label:"4–5%",min:4,max:5},{label:"5%+",min:5,max:1/0}];function ft(e){const a=ae(e);return gt.map(t=>({label:t.label,count:a.filter(o=>{const s=I(o);return s>=t.min&&s<t.max}).length}))}function ht(e){const a=new Map;for(const t of e||[]){const o=t.sectorName||t.sector||"N/A";a.has(o)||a.set(o,{sector:o,total:0,payers:0,yieldSum:0});const s=a.get(o);s.total+=1;const r=I(t);r>0&&(s.payers+=1,s.yieldSum+=r)}return Array.from(a.values()).map(t=>({sector:t.sector,total:t.total,payers:t.payers,avgYield:t.payers>0?t.yieldSum/t.payers:0})).sort((t,o)=>o.avgYield-t.avgYield||t.sector.localeCompare(o.sector))}const K=e=>`${Number(e).toFixed(2)}%`,ye=e=>`${(e*100).toFixed(0)}%`;function yt(e,a){const t=document.getElementById(a);if(!t){console.error(`❌ Contentor ${a} não encontrado!`);return}const o=e||[];if(o.length===0){t.innerHTML='<div class="treemap-container"><p>Sem dados disponíveis para o painel de dividendos.</p></div>';return}const s=mt(o),r=vt(o),n=ft(o),i=ht(o),d=Math.max(1,...n.map(c=>c.count)),u=r.map((c,y)=>`
      <tr class="dividend-row" data-dividend-symbol="${p(c.symbol)}" data-dividend-name="${p(c.name||c.symbol)}">
        <td class="col-index">${y+1}</td>
        <td><strong>${p(c.symbol)}</strong></td>
        <td>${p(c.name||"N/A")}</td>
        <td>${p(c.sectorName||c.sector||"N/A")}</td>
        <td class="dividend-yield">${K(I(c))}</td>
      </tr>`).join(""),l=n.map(c=>`
      <div class="dividend-bucket">
        <span class="dividend-bucket-label">${c.label}</span>
        <div class="dividend-bucket-track">
          <div class="dividend-bucket-fill" style="width: ${c.count/d*100}%"></div>
        </div>
        <span class="dividend-bucket-count">${c.count}</span>
      </div>`).join(""),m=i.map(c=>`
      <tr>
        <td>${p(c.sector)}</td>
        <td class="col-index">${c.payers} / ${c.total}</td>
        <td class="dividend-yield">${K(c.avgYield)}</td>
      </tr>`).join("");t.innerHTML=`
    <div class="dividends-view">
      <header class="treemap-header">
        <h2>💰 Dividendos</h2>
        <p class="subtitle">
          Renda por dividendos no S&amp;P 500 — ${s.payers} de ${s.total} empresas
          pagam dividendos (${ye(s.payerRatio)}).
        </p>
      </header>

      <div class="treemap-stats">
        <div class="stat-card">
          <span class="stat-label">Empresas</span>
          <span class="stat-value">${s.total}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Pagadoras</span>
          <span class="stat-value">${s.payers} (${ye(s.payerRatio)})</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Yield médio</span>
          <span class="stat-value">${K(s.avgYield)}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Yield mediano</span>
          <span class="stat-value">${K(s.medianYield)}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Maior yield</span>
          <span class="stat-value">${K(s.maxYield)}</span>
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
          <div class="dividend-buckets">${l}</div>
          <p class="dividend-note">Considera apenas as ${s.payers} empresas pagadoras.</p>
        </section>
      </div>

      <section class="dividend-panel">
        <h3>🏭 Yield médio por setor</h3>
        <table class="dividend-table">
          <thead>
            <tr><th>Setor</th><th>Pagadoras</th><th>Yield médio</th></tr>
          </thead>
          <tbody>${m}</tbody>
        </table>
      </section>
    </div>
  `,t.querySelectorAll(".dividend-row").forEach(c=>{c.addEventListener("click",()=>{typeof window.openCompanyDetails=="function"&&window.openCompanyDetails({symbol:c.dataset.dividendSymbol,name:c.dataset.dividendName})})})}const z=[{company:"3M",ticker:"MMM",sector:"Industrials"},{company:"American Express",ticker:"AXP",sector:"Financials"},{company:"Amgen",ticker:"AMGN",sector:"Health Care"},{company:"Apple",ticker:"AAPL",sector:"Information Technology"},{company:"Boeing",ticker:"BA",sector:"Industrials"},{company:"Caterpillar",ticker:"CAT",sector:"Industrials"},{company:"Chevron",ticker:"CVX",sector:"Energy"},{company:"Cisco Systems",ticker:"CSCO",sector:"Information Technology"},{company:"Coca-Cola",ticker:"KO",sector:"Consumer Staples"},{company:"Dow Inc.",ticker:"DOW",sector:"Materials"},{company:"Goldman Sachs",ticker:"GS",sector:"Financials"},{company:"Home Depot",ticker:"HD",sector:"Consumer Discretionary"},{company:"Honeywell",ticker:"HON",sector:"Industrials"},{company:"IBM",ticker:"IBM",sector:"Information Technology"},{company:"Intel",ticker:"INTC",sector:"Information Technology"},{company:"Johnson & Johnson",ticker:"JNJ",sector:"Health Care"},{company:"JPMorgan Chase",ticker:"JPM",sector:"Financials"},{company:"McDonald's",ticker:"MCD",sector:"Consumer Discretionary"},{company:"Merck",ticker:"MRK",sector:"Health Care"},{company:"Microsoft",ticker:"MSFT",sector:"Information Technology"},{company:"Nike",ticker:"NKE",sector:"Consumer Discretionary"},{company:"Procter & Gamble",ticker:"PG",sector:"Consumer Staples"},{company:"Salesforce",ticker:"CRM",sector:"Information Technology"},{company:"The Travelers Companies",ticker:"TRV",sector:"Financials"},{company:"UnitedHealth Group",ticker:"UNH",sector:"Health Care"},{company:"Verizon",ticker:"VZ",sector:"Communication Services"},{company:"Visa",ticker:"V",sector:"Financials"},{company:"Walgreens Boots Alliance",ticker:"WBA",sector:"Consumer Staples"},{company:"Walt Disney",ticker:"DIS",sector:"Communication Services"},{company:"Nvidia",ticker:"NVDA",sector:"Information Technology"}],bt={"Communication Services":"#00d4ff","Consumer Discretionary":"#ffab00","Consumer Staples":"#00e676",Energy:"#ff5252",Financials:"#ba68c8","Health Care":"#29b6f6",Industrials:"#ffa726","Information Technology":"#00d4ff",Materials:"#66bb6a","Real Estate":"#ec407a",Utilities:"#42a5f5"};function xt(e){return String(e||"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")}function wt(e){return bt[e]||"#00d4ff"}function Be(e){return`dow-sector--${xt(e)}`}function kt(e,{search:a="",sector:t=""}={}){const o=String(a).toLowerCase().trim();return(e||[]).filter(s=>{const r=!o||String(s.company).toLowerCase().includes(o)||String(s.ticker).toLowerCase().includes(o),n=!t||s.sector===t;return r&&n})}function $t(e,a="company"){return[...e||[]].sort((t,o)=>{switch(a){case"ticker":return t.ticker.localeCompare(o.ticker);case"sector":return t.sector.localeCompare(o.sector)||t.company.localeCompare(o.company);default:return t.company.localeCompare(o.company)}})}function be(e){return[...new Set((e||[]).map(a=>a.sector))].sort()}function Ct(e){const a=new Map;return(e||[]).forEach(t=>{a.has(t.sector)||a.set(t.sector,[]),a.get(t.sector).push(t.company)}),[...a.entries()].map(([t,o])=>({sector:t,companies:o,count:o.length})).sort((t,o)=>o.count-t.count||t.sector.localeCompare(o.sector))}function Et(e){return(e||[]).filter(a=>a.sector==="Information Technology").length}function St(e){return`<div class="dow-cards">${(e||[]).map(t=>`
      <article class="dow-card">
        <div class="dow-card-head">
          <h3>${p(t.company)}</h3>
          <span class="dow-ticker">${p(t.ticker)}</span>
        </div>
        <span class="dow-sector ${Be(t.sector)}">${p(t.sector)}</span>
      </article>`).join("")}</div>`}function At(e){return`
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
        <td><strong>${p(t.company)}</strong></td>
        <td><span class="dow-ticker">${p(t.ticker)}</span></td>
        <td><span class="dow-sector ${Be(t.sector)}">${p(t.sector)}</span></td>
      </tr>`).join("")}</tbody>
      </table>
    </div>`}function Dt(e="dow-jones-view"){const a=document.getElementById(e);if(!a){console.error(`❌ Contentor ${e} não encontrado!`);return}const t={search:"",sector:"",sortBy:"company",view:"cards"},o=be(z).length,s=be(z).map(c=>`<option value="${p(c)}">${p(c)}</option>`).join(""),r=Ct(z).map(c=>`
      <div class="dow-breakdown-item">
        <div class="dow-breakdown-head" style="color: ${wt(c.sector)}">
          <span>${p(c.sector)}</span>
          <span class="dow-breakdown-count">${c.count}</span>
        </div>
        <p class="dow-breakdown-list">${c.companies.map(y=>p(y)).join(", ")}</p>
      </div>`).join("");a.innerHTML=`
    <div class="dow-jones-view">
      <header class="dow-header">
        <div class="dow-header-content">
          <h2>Dow Jones 30</h2>
          <p>📈 30 maiores empresas - índice blue chip dos EUA</p>
        </div>
        <div class="dow-stats">
          <div class="dow-stat">
            <span class="dow-stat-value">${z.length}</span>
            <span class="dow-stat-label">Empresas</span>
          </div>
          <div class="dow-stat">
            <span class="dow-stat-value">${o}</span>
            <span class="dow-stat-label">Setores</span>
          </div>
          <div class="dow-stat">
            <span class="dow-stat-value">${Et(z)}</span>
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
            ${s}
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
        <div class="dow-breakdown-grid">${r}</div>
      </section>

      <aside class="dow-info">
        <strong>💡 Sobre o Dow Jones Industrial Average (DJIA):</strong> um dos índices de ações
        mais antigos e respeitados do mundo, composto por 30 grandes empresas americanas. É
        frequentemente usado como indicador da saúde da economia dos EUA. As suas empresas são
        consideradas "blue chips" e o índice é ponderado por preço.
      </aside>
    </div>
  `;const n=a.querySelector("#dow-results"),i=a.querySelector("#dow-search"),d=a.querySelector("#dow-sector"),u=a.querySelector("#dow-sort"),l=a.querySelectorAll(".dow-view-btn");function m(){const c=$t(kt(z,{search:t.search,sector:t.sector}),t.sortBy);if(c.length===0){n.innerHTML='<p class="dow-empty">Nenhuma empresa encontrada.</p>';return}n.innerHTML=t.view==="table"?At(c):St(c),t.view==="table"&&n.querySelectorAll("th[data-sort]").forEach(y=>{y.addEventListener("click",()=>{t.sortBy=y.dataset.sort,u&&(u.value=t.sortBy),m()})})}i&&i.addEventListener("input",()=>{t.search=i.value,m()}),d&&d.addEventListener("change",()=>{t.sector=d.value,m()}),u&&u.addEventListener("change",()=>{t.sortBy=u.value,m()}),l.forEach(c=>{c.addEventListener("click",()=>{t.view=c.dataset.view,l.forEach(y=>y.classList.toggle("active",y===c)),m()})}),m()}const J=[{company:"American States Water",ticker:"AWR",sector:"Utilities"},{company:"California Water Service",ticker:"CWT",sector:"Utilities"},{company:"Northwest Natural",ticker:"NWN",sector:"Utilities"},{company:"Procter & Gamble",ticker:"PG",sector:"Consumer Defensive"},{company:"Coca-Cola",ticker:"KO",sector:"Consumer Defensive"},{company:"Johnson & Johnson",ticker:"JNJ",sector:"Healthcare"},{company:"Colgate-Palmolive",ticker:"CL",sector:"Consumer Defensive"},{company:"Genuine Parts",ticker:"GPC",sector:"Consumer Cyclical"},{company:"Emerson Electric",ticker:"EMR",sector:"Industrials"},{company:"Dover",ticker:"DOV",sector:"Industrials"},{company:"Lowe's",ticker:"LOW",sector:"Consumer Cyclical"},{company:"Federal Realty",ticker:"FRT",sector:"Real Estate"},{company:"ABM Industries",ticker:"ABM",sector:"Industrials"},{company:"Stepan",ticker:"SCL",sector:"Basic Materials"},{company:"H.B. Fuller",ticker:"FUL",sector:"Basic Materials"},{company:"Universal Corp",ticker:"UVV",sector:"Consumer Defensive"},{company:"Hormel Foods",ticker:"HRL",sector:"Consumer Defensive"},{company:"Kimberly-Clark",ticker:"KMB",sector:"Consumer Defensive"},{company:"Middlesex Water",ticker:"MSEX",sector:"Utilities"},{company:"MSA Safety",ticker:"MSA",sector:"Industrials"},{company:"PPG Industries",ticker:"PPG",sector:"Basic Materials"},{company:"RPM International",ticker:"RPM",sector:"Basic Materials"},{company:"Black Hills",ticker:"BKH",sector:"Utilities"},{company:"National Fuel Gas",ticker:"NFG",sector:"Energy"},{company:"PepsiCo",ticker:"PEP",sector:"Consumer Defensive"},{company:"Altria",ticker:"MO",sector:"Consumer Defensive"},{company:"Stanley Black & Decker",ticker:"SWK",sector:"Industrials"},{company:"Target",ticker:"TGT",sector:"Consumer Cyclical"},{company:"Sysco",ticker:"SYY",sector:"Consumer Defensive"},{company:"Cincinnati Financial",ticker:"CINF",sector:"Financials"},{company:"Tootsie Roll",ticker:"TR",sector:"Consumer Defensive"},{company:"Gorman-Rupp",ticker:"GRC",sector:"Industrials"},{company:"Pentair",ticker:"PNR",sector:"Industrials"},{company:"H2O America",ticker:"HTO",sector:"Utilities"},{company:"MGE Energy",ticker:"MGEE",sector:"Utilities"},{company:"RLI Corp",ticker:"RLI",sector:"Financials"},{company:"S&P Global",ticker:"SPGI",sector:"Financials"},{company:"Automatic Data Processing",ticker:"ADP",sector:"Industrials"}],Mt={"Basic Materials":"#66bb6a","Consumer Cyclical":"#ffab00","Consumer Defensive":"#00e676",Energy:"#ff5252",Financials:"#ba68c8",Healthcare:"#29b6f6",Industrials:"#ffa726","Real Estate":"#ec407a",Utilities:"#42a5f5"};function Tt(e){return String(e||"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")}function Lt(e){return Mt[e]||"#00e676"}function Ne(e){return`dk-sector--${Tt(e)}`}function It(e,{search:a="",sector:t=""}={}){const o=String(a).toLowerCase().trim();return(e||[]).filter(s=>{const r=!o||String(s.company).toLowerCase().includes(o)||String(s.ticker).toLowerCase().includes(o),n=!t||s.sector===t;return r&&n})}function Bt(e,a="company"){return[...e||[]].sort((t,o)=>{switch(a){case"ticker":return t.ticker.localeCompare(o.ticker);case"sector":return t.sector.localeCompare(o.sector)||t.company.localeCompare(o.company);default:return t.company.localeCompare(o.company)}})}function xe(e){return[...new Set((e||[]).map(a=>a.sector))].sort()}function Nt(e){const a=new Map;return(e||[]).forEach(t=>{a.has(t.sector)||a.set(t.sector,[]),a.get(t.sector).push(t.company)}),[...a.entries()].map(([t,o])=>({sector:t,companies:o,count:o.length})).sort((t,o)=>o.count-t.count||t.sector.localeCompare(o.sector))}function Ft(e){return`<div class="dk-cards">${(e||[]).map(t=>`
      <article class="dk-card">
        <div class="dk-card-head">
          <h3>${p(t.company)}</h3>
          <span class="dk-ticker">${p(t.ticker)}</span>
        </div>
        <span class="dk-sector ${Ne(t.sector)}">${p(t.sector)}</span>
        <div class="dk-badge">👑 50+ Anos de Dividendos</div>
      </article>`).join("")}</div>`}function Pt(e){return`
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
        <td><strong>${p(t.company)}</strong></td>
        <td><span class="dk-ticker">${p(t.ticker)}</span></td>
        <td><span class="dk-sector ${Ne(t.sector)}">${p(t.sector)}</span></td>
      </tr>`).join("")}</tbody>
      </table>
    </div>`}function Ht(e="dividend-kings-view"){const a=document.getElementById(e);if(!a){console.error(`❌ Contentor ${e} não encontrado!`);return}const t={search:"",sector:"",sortBy:"company",view:"cards"},o=xe(J).length,s=xe(J).map(m=>`<option value="${p(m)}">${p(m)}</option>`).join(""),r=Nt(J).map(m=>`
      <div class="dk-breakdown-item">
        <div class="dk-breakdown-head" style="color: ${Lt(m.sector)}">
          <span>${p(m.sector)}</span>
          <span class="dk-breakdown-count">${m.count}</span>
        </div>
        <p class="dk-breakdown-list">${m.companies.map(c=>p(c)).join(", ")}</p>
      </div>`).join("");a.innerHTML=`
    <div class="dividend-kings-view">
      <header class="dk-header">
        <div class="dk-header-content">
          <h2>Dividend Kings</h2>
          <p>👑 50+ anos de aumento ininterrupto de dividendos</p>
        </div>
        <div class="dk-stats">
          <div class="dk-stat">
            <span class="dk-stat-value">${J.length}</span>
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
            ${s}
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
        <div class="dk-breakdown-grid">${r}</div>
      </section>

      <aside class="dk-info">
        <strong>💡 O que são Dividend Kings?</strong> são empresas que aumentaram
        ininterruptamente os seus dividendos por mais de 50 anos consecutivos. Estão entre as
        empresas mais estáveis e rentáveis do mercado, com modelos de negócio sólidos e geração de
        caixa consistente — ideais para investidores que procuram renda passiva fiável e crescimento
        a longo prazo.
      </aside>
    </div>
  `;const n=a.querySelector("#dk-results"),i=a.querySelector("#dk-search"),d=a.querySelector("#dk-sector"),u=a.querySelector("#dk-sort"),l=()=>{const m=Bt(It(J,{search:t.search,sector:t.sector}),t.sortBy);if(m.length===0){n.innerHTML='<p class="dk-empty">Nenhuma empresa encontrada.</p>';return}if(t.view==="cards"){n.innerHTML=Ft(m);return}n.innerHTML=Pt(m),n.querySelectorAll(".dk-table th[data-sort]").forEach(c=>{c.addEventListener("click",()=>{t.sortBy=c.getAttribute("data-sort"),u&&(u.value=t.sortBy),l()})})};i&&i.addEventListener("input",()=>{t.search=i.value,l()}),d&&d.addEventListener("change",()=>{t.sector=d.value,l()}),u&&u.addEventListener("change",()=>{t.sortBy=u.value,l()}),a.querySelectorAll(".dk-view-btn").forEach(m=>{m.addEventListener("click",()=>{t.view=m.getAttribute("data-view"),a.querySelectorAll(".dk-view-btn").forEach(c=>c.classList.remove("active")),m.classList.add("active"),l()})}),l()}const Rt={bullish:{label:"Otimista",cls:"positive"},bearish:{label:"Pessimista",cls:"negative"},neutral:{label:"Neutro",cls:""}};async function Ot(e="daily-summary"){const a=document.getElementById(e);if(a){a.innerHTML='<p class="summary-empty">Carregando resumo do dia...</p>';try{const t=await fetch(`${V}/api/resumo-dia`);if(!t.ok)throw new Error(`HTTP ${t.status}`);const o=await t.json();Yt(a,o.dados||{})}catch(t){console.error("Erro ao carregar Resumo do Dia:",t),a.innerHTML='<p class="summary-empty">Resumo do dia indisponível no momento.</p>'}}}function Fe(e){const a=Number(e)||0;return`${a>0?"+":""}${a.toFixed(2)}%`}function zt(e){if(!e)return"";const a=new Date(`${e}T00:00:00`);return Number.isNaN(a.getTime())?"":a.toLocaleDateString("pt-BR")}function we(e,a){const t=(a||[]).map(o=>`
        <div class="summary-row">
          <span class="mini-symbol">${p(o.symbol||"")}</span>
          <span class="mini-name">${p(o.name||"")}</span>
          <span class="mini-change ${o.changePct>=0?"positive":"negative"}">${Fe(o.changePct)}</span>
        </div>`).join("");return`
    <div class="summary-list">
      <h4 class="summary-list-title">${e}</h4>
      ${t}
    </div>`}function Yt(e,a){const t=a.stats||{},o=Rt[a.marketMood]||{label:"—",cls:""},s=zt(a.referenceDate),r=[{label:"Em alta",value:t.gainers??"—",cls:"positive"},{label:"Em baixa",value:t.losers??"—",cls:"negative"},{label:"Estáveis",value:t.neutral??"—",cls:""},{label:"Total",value:t.total??"—",cls:""},{label:"Humor",value:o.label,cls:o.cls}].map(i=>`
      <div class="daily-card ${i.cls}">
        <span class="daily-label">${i.label}</span>
        <span class="daily-value">${i.value}</span>
      </div>`).join(""),n=(a.sectorPerformance||[]).map(i=>`
      <div class="daily-sector-card ${i.avgChangePct>=0?"positive":"negative"}">
        <span class="sector-name">${p(i.name||"")}</span>
        <span class="sector-change">${Fe(i.avgChangePct)}</span>
      </div>`).join("");e.innerHTML=`
    <header class="daily-summary-header">
      <h2>📊 Resumo do Dia</h2>
      ${s?`<span class="daily-date">Referência: ${s}</span>`:""}
    </header>

    <div class="daily-summary-grid">${r}</div>

    <div class="daily-lists">
      ${we("🚀 Maiores altas",a.topGainers)}
      ${we("📉 Maiores baixas",a.topLosers)}
    </div>

    <div class="daily-sectors">
      <h3>📈 Desempenho por setor</h3>
      <div class="daily-sectors-list">${n}</div>
    </div>
  `}const Pe="sp500-price-alerts",ve=50;function jt(){try{const e=localStorage.getItem(Pe);if(!e)return[];const a=JSON.parse(e);return Array.isArray(a)&&a.length>0&&Array.isArray(a[0])?a:Array.isArray(a)&&a.length>0&&typeof a[0]=="object"?a.map(t=>[t.symbol,t]):[]}catch(e){return console.error("Erro ao carregar price alerts:",e),[]}}function de(){try{const e=Array.from(G.entries());localStorage.setItem(Pe,JSON.stringify(e))}catch(e){console.error("Erro ao salvar price alerts:",e)}}function qt(e,a){let t;return function(...s){const r=()=>{clearTimeout(t),e(...s)};clearTimeout(t),t=setTimeout(r,a)}}function ge(){const e=document.getElementById("nav-menu"),a=document.getElementById("menu-toggle");e&&e.classList.remove("open"),a&&a.setAttribute("aria-expanded","false")}function Ut(){const e=document.getElementById("menu-toggle"),a=document.getElementById("nav-menu");!e||!a||(e.addEventListener("click",t=>{t.stopPropagation();const o=a.classList.toggle("open");e.setAttribute("aria-expanded",String(o))}),document.addEventListener("click",t=>{a.classList.contains("open")&&!a.contains(t.target)&&ge()}),document.addEventListener("keydown",t=>{t.key==="Escape"&&ge()}))}let M=[],B=[],L=1,Q="dashboard",U=new Set;const ke=new Set,le=jt(),G=new Map(le&&le.length>0?le:[]);let F,P,W,Z,X,O,H,Y,R;function Vt(){F=document.getElementById("sector-filter"),P=document.getElementById("country-filter"),W=document.getElementById("search-input"),Z=document.getElementById("dividend-min"),X=document.getElementById("sort-select"),O=document.getElementById("table-body"),H=document.getElementById("stats"),Y=document.getElementById("pagination"),R=document.getElementById("header-checkbox"),document.querySelectorAll(".nav-tab").forEach(r=>{r.addEventListener("click",n=>{n.preventDefault();const i=r.getAttribute("data-tab");Gt(i),ge()})}),Ut(),F&&F.addEventListener("change",j),P&&P.addEventListener("change",j),W&&W.addEventListener("input",qt(j,300)),Z&&Z.addEventListener("change",j),X&&X.addEventListener("change",j),R&&R.addEventListener("change",()=>{const r=R.checked;O.querySelectorAll(".row-checkbox").forEach(i=>{i.checked=r,i.dispatchEvent(new Event("change"))})});const a=document.getElementById("select-all"),t=document.getElementById("deselect-all"),o=document.getElementById("export-csv"),s=document.getElementById("export-json");a&&a.addEventListener("click",()=>{B.forEach(r=>U.add(r.symbol)),ee(),te()}),t&&t.addEventListener("click",()=>{U.clear(),ee(),te()}),o&&o.addEventListener("click",la),s&&s.addEventListener("click",pa),He(),ze(),Ye(),Ot(),da()}document.addEventListener("DOMContentLoaded",Vt);function Gt(e){Q=e,He(),ze()}function _(e,a){ke.has(e)||(ke.add(e),a())}function He(){const e=document.getElementById("dashboard-view"),a=document.getElementById("treemap-view"),t=document.getElementById("heatmap-view"),o=document.getElementById("bubble-chart-view"),s=document.getElementById("dividends-view"),r=document.getElementById("stock-of-day-view"),n=document.getElementById("daily-curiosity-view"),i=document.getElementById("dow-jones-view"),d=document.getElementById("dividend-kings-view");switch([e,a,t,o,s,r,n,i,d].forEach(l=>{l&&(l.style.display="none")}),Q){case"dashboard":e&&(e.style.display="block");break;case"stock-of-day":r&&(r.style.display="block",je());break;case"daily-curiosity":n&&(n.style.display="block",_("daily-curiosity",Ve));break;case"treemap":a&&(a.style.display="block",_("treemap",ot));break;case"heatmap":t&&(t.style.display="block",_("heatmap",rt));break;case"bubble":o&&(o.style.display="block",Re());break;case"dividends":s&&(s.style.display="block",Oe());break;case"dow-jones":i&&(i.style.display="block",_("dow-jones",Kt));break;case"dividend-kings":d&&(d.style.display="block",_("dividend-kings",Jt));break;default:e&&(e.style.display="block")}}function Re(){const e=document.getElementById("bubble-chart-view");if(!e){console.error("❌ bubble-chart-view não encontrado!");return}e.innerHTML='<div style="text-align: center; padding: 40px;"><p>Carregando gráfico de bolhas...</p></div>',dt(M,"bubble-chart-view")}function Oe(){const e=document.getElementById("dividends-view");if(!e){console.error("❌ dividends-view não encontrado!");return}if(M.length===0){e.innerHTML='<div style="text-align: center; padding: 40px;"><p>Carregando dados de dividendos...</p></div>';return}yt(M,"dividends-view")}function Kt(){if(!document.getElementById("dow-jones-view")){console.error("❌ dow-jones-view não encontrado!");return}Dt("dow-jones-view")}function Jt(){if(!document.getElementById("dividend-kings-view")){console.error("❌ dividend-kings-view não encontrado!");return}Ht("dividend-kings-view")}function ze(){document.querySelectorAll(".nav-tab").forEach(a=>{a.classList.remove("active"),a.getAttribute("data-tab")===Q&&a.classList.add("active")})}async function Ye(){H&&(H.textContent="Carregando dados...");try{const e=await fetch(`${V}/api/setores`);if(!e.ok)throw new Error("Erro ao buscar setores");const o=((await e.json()).setores||[]).map(async r=>{try{const n=await fetch(`${V}/api/setor/${r}`);if(!n.ok)throw new Error(`HTTP ${n.status}`);const i=await n.json(),d=pe.find(l=>l.id===r),u=d?d.name:r;return i.dados&&i.dados.companies&&Array.isArray(i.dados.companies)?{generatedAt:i.dados.generatedAt||null,companies:i.dados.companies.map(l=>({...l,sector:r,sectorName:u}))}:{generatedAt:null,companies:[]}}catch(n){return console.error(`❌ Erro ao carregar ${r}:`,n),{generatedAt:null,companies:[]}}}),s=await Promise.all(o);M=s.flatMap(r=>r.companies),$e(s.map(r=>r.generatedAt).filter(Boolean)),F&&(F.innerHTML='<option value="">Todos os Setores</option>',[...new Set(M.map(n=>n.sector))].sort().forEach(n=>{var d;const i=document.createElement("option");i.value=n,i.textContent=((d=pe.find(u=>u.id===n))==null?void 0:d.name)||n,F.appendChild(i)})),P&&(P.innerHTML='<option value="">Todos os Países</option>',[...new Set(M.map(n=>Me(n.headquarters)))].sort().forEach(n=>{const i=document.createElement("option");i.value=n,i.textContent=n,P.appendChild(i)})),j(),te(),Q==="bubble"&&Re(),Q==="dividends"&&Oe()}catch(e){console.error("❌ Erro ao carregar dados:",e),H&&(H.textContent="Erro ao carregar dados. Tente novamente."),$e([])}}function $e(e){const a=document.getElementById("freshness-badge"),t=document.getElementById("freshness-text");if(!t)return;const o=(e||[]).map(d=>new Date(d)).filter(d=>!Number.isNaN(d.getTime()));if(o.length===0){a&&(a.classList.remove("fd-fresh","fd-aging","fd-stale"),a.classList.add("fd-unknown")),t.textContent="Data indisponível";return}const s=new Date(Math.max(...o.map(d=>d.getTime()))),r=Math.floor((Date.now()-s.getTime())/864e5);let n="fd-fresh";r>30?n="fd-stale":r>7&&(n="fd-aging"),a&&(a.classList.remove("fd-fresh","fd-aging","fd-stale","fd-unknown"),a.classList.add(n));const i=s.toLocaleDateString("pt-BR");t.textContent=`Dados de ${i}`,a&&(a.title=`Última atualização dos dados: ${i}`)}function j(){const e=F?F.value:"",a=P?P.value:"",t=W?W.value.toLowerCase():"",o=Z&&parseFloat(Z.value)||0,s=X?X.value:"symbol-asc";B=M.filter(i=>{const d=!e||i.sector===e,u=!a||Me(i.headquarters)===a,l=!t||i.symbol.toLowerCase().includes(t)||i.name.toLowerCase().includes(t)||i.subIndustry&&i.subIndustry.toLowerCase().includes(t)||i.headquarters&&i.headquarters.toLowerCase().includes(t),m=!o||(parseFloat(i.dividendYield)||0)>=o;return d&&u&&l&&m});const[r,n]=s.split("-");B.sort((i,d)=>{let u=i[r],l=d[r];if(typeof u=="string"){const y=(u||"").localeCompare(l||"");return n==="asc"?y:-y}const m=parseFloat(u)||0,c=parseFloat(l)||0;return n==="asc"?m-c:c-m}),L=1,ee(),te()}function ee(){if(!O){console.error("❌ tableBody não encontrado!");return}O.innerHTML="";const e=(L-1)*ve,a=e+ve;B.slice(e,a).forEach((o,s)=>{const r=U.has(o.symbol),n=p(o.symbol),i=document.createElement("tr");i.innerHTML=`
      <td>
        <input type="checkbox" class="row-checkbox" data-symbol="${n}" 
          ${r?"checked":""}>
      </td>
      <td class="col-index">${e+s+1}</td>
      <td><strong>${p(o.symbol)}</strong></td>
      <td>${p(o.name||"N/A")}</td>
      <td>${p(o.sectorName||o.sector||"N/A")}</td>
      <td>${ne(o.marketCap)}</td>
      <td>${p(o.subIndustry||o.industry||"N/A")}</td>
      <td>${p(o.headquarters||"N/A")}</td>
      <td>${De(o)}</td>
    `;const d=i.querySelector(".row-checkbox");d.addEventListener("change",()=>{d.checked?U.add(o.symbol):U.delete(o.symbol),te(),Ce()}),O.appendChild(i)}),Ce(),_t()}function Ce(){if(!R||!O)return;const e=O.querySelectorAll(".row-checkbox"),a=Array.from(e).filter(t=>t.checked).length;R.checked=e.length>0&&a===e.length,R.indeterminate=a>0&&a<e.length}function _t(){if(!Y)return;Y.innerHTML="";const e=Math.ceil(B.length/ve),a=document.createElement("button");a.textContent="Anterior",a.disabled=L===1,a.addEventListener("click",()=>{L>1&&(L--,ee())}),Y.appendChild(a);const t=document.createElement("span");t.textContent=`Página ${L} de ${e}`,Y.appendChild(t);const o=document.createElement("button");o.textContent="Próxima",o.disabled=L===e,o.addEventListener("click",()=>{L<e&&(L++,ee())}),Y.appendChild(o)}function te(){if(!H)return;const e=B.length,a=U.size,t=B.filter(s=>Number(s.dividendYield)>0),o=t.length>0?(t.reduce((s,r)=>s+Number(r.dividendYield),0)/t.length).toFixed(2):"0.00";H.innerHTML=`Total: ${e} | Selecionadas: ${a} | Yield Médio (pagadoras): ${o}%`}async function je(){const e=document.getElementById("stock-of-day-view");if(e){e.innerHTML=`
    <div class="stock-of-day-loading">
      <div class="loading-spinner"></div>
      <p>Analisando o mercado... selecionando a melhor oportunidade de hoje</p>
    </div>
  `;try{if(M.length===0&&await Ye(),M.length===0){e.innerHTML=`
        <div class="stock-of-day-error">
          <h3>⚠️ Dados indisponíveis</h3>
          <p>Não foi possível carregar as empresas do S&P 500. Verifique a conexão com o servidor.</p>
          <button class="retry-btn" onclick="loadStockOfDay()">Tentar novamente</button>
        </div>
      `;return}const a=new Date().toISOString().slice(0,10),t=aa(a);if(t){Se(e,t);return}const o=await Wt();o.primary&&oa(a,o),Se(e,o)}catch(a){console.error("Erro ao carregar Ação do Dia:",a),e.innerHTML=`
      <div class="stock-of-day-error">
        <h3>⚠️ Indisponível no momento</h3>
        <p>Não foi possível gerar a análise. Tente novamente mais tarde.</p>
        <button class="retry-btn" onclick="loadStockOfDay()">Tentar novamente</button>
      </div>
    `}}}function Wt(){return new Promise(e=>{setTimeout(()=>{const a=new Date().toISOString().slice(0,10),t=Zt(a),o=M.filter(d=>d.marketCap&&d.marketCap>1e9).map(d=>{const u=Xt(d),l=Qt(d.sector),m=(d.dividendYield||0)>2?10:0,c=Math.min(20,Math.log10(d.marketCap/1e9)*5),y=ea(d),w=u+l+m+c+y;return{...d,score:Math.round(w*100)/100,breakdown:{technical:u,sector:l,dividend:m,liquidity:Math.round(c),volatility:Math.round(y)},rationale:ta(d,u,l,m)}}).sort((d,u)=>u.score-d.score);if(o.length===0){e({date:a,primary:null,alternatives:[],marketContext:Ee(),generatedAt:new Date().toISOString()});return}const s=o.slice(0,Math.min(10,o.length)),r=t%s.length,n=s[r],i=s.filter((d,u)=>u!==r).slice(0,3);e({date:a,primary:n,alternatives:i,marketContext:Ee(),generatedAt:new Date().toISOString()})},100)})}function Zt(e){let a=0;for(let t=0;t<e.length;t++)a=(a<<5)-a+e.charCodeAt(t),a|=0;return Math.abs(a)}function Xt(e){let a=50;const t=e.dividendYield||0;t>4?a+=15:t>2?a+=8:t>0&&(a+=3);const o=e.marketCap||0;o>5e11?a+=10:o>1e11?a+=7:o>5e10?a+=5:o>1e10&&(a+=3);const s=(e.subIndustry||"").toLowerCase();["software","semiconductors","biotechnology","cloud","ai","cybersecurity","renewable"].some(n=>s.includes(n))&&(a+=12);const r=(e.name||"").toLowerCase();return["inc.","corporation","technologies","systems","solutions"].some(n=>r.includes(n))&&(a+=3),Math.min(90,a)}function Qt(e){return{"information-technology":15,"health-care":8,"consumer-discretionary":5,"communication-services":7,industrials:5,financials:3,materials:2,energy:0,utilities:-2,"real-estate":-3,"consumer-staples":1}[e]||0}function ea(e){const a=e.marketCap||0;return a>2e11?8:a>5e10?12:a>1e10?15:18}function ta(e,a,t,o){const s=[];return a>60&&s.push("Fundamentos técnicos sólidos"),t>10&&s.push(`Setor em momento favorável (${e.sectorName})`),o&&s.push(`Dividend yield atrativo (${(e.dividendYield||0).toFixed(1)}%)`),e.marketCap>1e11&&s.push("Grande capitalização — liquidez e estabilidade"),s.length===0&&s.push("Equilíbrio entre risco e retorno"),s.join(" • ")}function Ee(){const e=Math.random()*30+10;return e<15?{level:"Calmo",description:"Baixa volatilidade - ambiente propício para acumulação",class:"calm"}:e<25?{level:"Moderado",description:"Volatilidade normal - seleção seletiva recomendada",class:"moderate"}:{level:"Elevado",description:"Alta volatilidade - foco em qualidade e liquidez",class:"elevated"}}function aa(e){try{const a=localStorage.getItem("sp500-stock-of-day");if(!a)return null;const t=JSON.parse(a);return t.date===e&&t.primary?t:null}catch{return null}}function oa(e,a){try{localStorage.setItem("sp500-stock-of-day",JSON.stringify(a))}catch{}}function Se(e,a){const{primary:t,alternatives:o,marketContext:s,generatedAt:r}=a;if(!t){e.innerHTML=`
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
          <span class="market-context ${s.class}">${s.level}</span>
        </div>
      </header>

      <div class="stock-main-card">
        <div class="stock-identity">
          <div class="stock-symbol">${p(t.symbol)}</div>
          <div class="stock-name">${p(t.name)}</div>
          <div class="stock-sector">${p(t.sectorName||t.sector)}</div>
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
            <span class="metric-value">${ne(t.marketCap)}</span>
          </div>
          <div class="metric">
            <span class="metric-label">Div. Yield</span>
            <span class="metric-value">${(t.dividendYield||0).toFixed(2)}%</span>
          </div>
          <div class="metric">
            <span class="metric-label">Setor</span>
            <span class="metric-value">${p(t.sectorName||t.sector)}</span>
          </div>
          <div class="metric">
            <span class="metric-label">Sub-setor</span>
            <span class="metric-value">${p(t.subIndustry||"N/A")}</span>
          </div>
        </div>

        <div class="stock-actions">
          <button class="action-btn secondary" onclick="openCompanyDetails({symbol:'${t.symbol}',name:'${p(t.name).replace(/'/g,"\\'")}'})">
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
                <div class="alt-symbol">${p(n.symbol)}</div>
                <div class="alt-name">${p(n.name)}</div>
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
  `}function sa(e){const a=e.toUpperCase(),t=G.get(a);if(t&&t.triggered){confirm(`${e}: alerta já disparado. Remover?`)&&ia(a);return}const o=prompt(`Alerta de preço para ${e}:
Digite o preço alvo (ex: 150.25):`,t?t.target.toFixed(2):"");if(!o)return;const s=parseFloat(o);if(isNaN(s)||s<=0){alert("Preço inválido");return}const r=confirm(`Alertar quando o preço estiver ACIMA deste valor?
(OK = acima, Cancelar = abaixo)`)?"above":"below";ra(a,s,r)}function ra(e,a,t){return!e||typeof a!="number"||!["above","below"].includes(t)?!1:(G.set(e.toUpperCase(),{target:a,direction:t,triggered:!1}),de(),!0)}function ia(e){G.delete(e.toUpperCase()),de()}window.loadStockOfDay=je;window.openCompanyDetails=tt;window.setPriceAlertPrompt=sa;async function na(){const e=[];for(const[a,t]of G)if(!t.triggered)try{const o=await Te(a),s=o[o.length-1],r=s?Number(s.close):NaN;if(!Number.isFinite(r))continue;(t.direction==="above"&&r>=t.target||t.direction==="below"&&r<=t.target)&&(t.triggered=!0,t.triggeredAt=new Date().toISOString(),t.triggeredPrice=r,e.push(`${a} ($${r.toFixed(2)})`))}catch(o){console.error(`Erro ao verificar ${a}:`,o)}return e.length>0&&(de(),window.alert(`🔔 Alerta(s) de preço atingido(s): ${e.join(", ")}`)),e}async function da(){G.size!==0&&setInterval(async()=>{await na(),de()},6e4)}function ca(e){return`"${(e==null?"":String(e)).replace(/"/g,'""')}"`}function la(){const e=["#","Símbolo","Empresa","Setor","Market Cap","Subindústria","Sede","Dividend Yield"],a=B.map((o,s)=>[s+1,o.symbol,o.name,o.sectorName,ne(o.marketCap),o.subIndustry||o.industry||"N/A",o.headquarters||"N/A",De(o)]),t=[e,...a].map(o=>o.map(ca).join(",")).join(`
`);qe(t,"sp500-export.csv","text/csv")}function pa(){const e=JSON.stringify(B,null,2);qe(e,"sp500-export.json","application/json")}function qe(e,a,t){const o=new Blob([e],{type:t}),s=URL.createObjectURL(o),r=document.createElement("a");r.href=s,r.download=a,document.body.appendChild(r),r.click(),document.body.removeChild(r),URL.revokeObjectURL(s)}
