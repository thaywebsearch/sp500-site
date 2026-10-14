(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))r(o);new MutationObserver(o=>{for(const s of o)if(s.type==="childList")for(const n of s.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&r(n)}).observe(document,{childList:!0,subtree:!0});function t(o){const s={};return o.integrity&&(s.integrity=o.integrity),o.referrerPolicy&&(s.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?s.credentials="include":o.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(o){if(o.ep)return;o.ep=!0;const s=t(o);fetch(o.href,s)}})();const fe=window.location.hostname,K=fe==="localhost"||fe==="127.0.0.1"?"http://localhost:5001":"https://sp500-site-production.up.railway.app",me=[{id:"communication-services",name:"Communication Services"},{id:"consumer-discretionary",name:"Consumer Discretionary"},{id:"consumer-staples",name:"Consumer Staples"},{id:"energy",name:"Energy"},{id:"financials",name:"Financials"},{id:"health-care",name:"Health Care"},{id:"industrials",name:"Industrials"},{id:"information-technology",name:"Information Technology"},{id:"materials",name:"Materials"},{id:"real-estate",name:"Real Estate"},{id:"utilities",name:"Utilities"}];window.API_BASE_URL=K;window.SECTORS=me;let U=[],h=null,ie=0,ue="",Me="alfabética";async function Je(){try{const e=document.getElementById("daily-curiosity-view");if(!e){console.error("Elemento daily-curiosity-view não encontrado");return}e.innerHTML='<div class="curiosidade-loading">Carregando curiosidade...</div>';const a=await fetch(`${K}/api/curiosidades`);if(!a.ok){console.error(`Erro ao buscar curiosidades: ${a.status}`),e.innerHTML=`<div class="curiosidade-erro">Erro ao carregar curiosidades (${a.status})</div>`;return}const t=await a.json();if(!t.sucesso||!t.dados||!t.dados.curiosidades){console.error("Dados de curiosidades inválidos:",t),e.innerHTML='<div class="curiosidade-erro">Formato de dados inválido</div>';return}if(U=t.dados.curiosidades,ie=t.dados.total||U.length,ue=t.dados.proximaEmpresa||"",Me=t.dados.ordem||"alfabética",U.length===0){e.innerHTML='<div class="curiosidade-erro">Nenhuma curiosidade disponível</div>';return}We(),_e()}catch(e){console.error("Erro ao carregar curiosidades:",e);const a=document.getElementById("daily-curiosity-view");a&&(a.innerHTML=`<div class="curiosidade-erro">Erro ao carregar: ${e.message}</div>`)}}function We(){if(U.length===0)return;const e=new Date,a=new Date(e.getFullYear(),e.getMonth(),e.getDate()),r=Math.floor(a.getTime()/864e5)%U.length;h=U[r]}function _e(){const e=document.getElementById("daily-curiosity-view");if(!e||!h){console.error("View ou curiosidade não encontrada");return}Ze();const a=`
    <div class="curiosidade-container">
      <div class="curiosidade-header">
        <h1>🌟 Curiosidade do Dia</h1>
        <p class="curiosidade-data">${Qe()}</p>
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

          ${ie>0?`
            <div class="curiosidade-progresso">
              <div class="progresso-texto">
                <span>Rotatividade diária · ordem ${Me}</span>
                <span>Empresa ${h.posicao} de ${ie}</span>
              </div>
              <div class="progresso-barra">
                <div class="progresso-preenchido" style="width: ${Number(h.posicao)/ie*100}%;"></div>
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
  `;e.innerHTML=a,window.compartilharCuriosidade=Xe}function Ze(){if(document.getElementById("curiosidade-styles"))return;const e=document.createElement("style");e.id="curiosidade-styles",e.textContent=`
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
  `,document.head.appendChild(e)}function Xe(){if(!h)return;const e=(h.fatos||[]).map(t=>`• ${t}`).join(`
`),a=`🌟 Curiosidade do Dia: ${h.empresa} (${h.simbolo})

${h.descricao}

${e}

💡 ${h.insight||""}`;navigator.share?navigator.share({title:`Curiosidade do Dia - ${h.empresa}`,text:a,url:window.location.href}).catch(t=>console.error("Erro ao compartilhar:",t)):navigator.clipboard.writeText(a).then(()=>{alert("Curiosidade copiada para a área de transferência!")}).catch(t=>{alert("Erro ao copiar: "+t)})}function Qe(){const e=new Date,a={weekday:"long",year:"numeric",month:"long",day:"numeric"};return e.toLocaleDateString("pt-BR",a)}function ce(e){const a=Number(e);return!a||Number.isNaN(a)?"N/A":a>=1e12?`$${(a/1e12).toFixed(3)}T`:a>=1e9?`$${(a/1e9).toFixed(2)}B`:a>=1e6?`$${(a/1e6).toFixed(2)}M`:`$${a.toLocaleString("en-US")}`}function Te(e){if(!e||e.hasDividend==="Não")return"N/A";const a=Number(e.dividendYield);return Number.isFinite(a)?`${a.toFixed(2)}%`:"N/A"}function l(e){return e?String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;"):""}const et=new Set(["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming","D.C."]);function Le(e){if(!e)return"Desconhecido";const a=String(e).split(",").map(r=>r.trim().replace(/\[\d+\]$/,"")),t=a[a.length-1];return!t||t.toLowerCase()==="none"?"Desconhecido":et.has(t)?"United States":t}async function Ie(e){try{const a=await fetch(`${K}/api/historico/${e}`);if(!a.ok)throw new Error(`Erro ao buscar histórico de ${e}`);return(await a.json()).registros||[]}catch(a){return console.error(`Erro ao buscar histórico de ${e}:`,a),[]}}const se=760,le=320,C={top:28,right:28,bottom:44,left:68};function tt(e){if(!e)return"";const[a,t,r]=e.split("-");return`${r}/${t}/${a.slice(2)}`}function ve(e){return Number.isFinite(e)?e>=100?`$${e.toFixed(0)}`:`$${e.toFixed(2)}`:"—"}function at(e){const a=e.map(f=>f.close),t=Math.min(...a),r=Math.max(...a),o=r-t||1,s=t-o*.08,n=r+o*.08,i=e.length,d=f=>C.left+f/(i-1)*(se-C.left-C.right),p=f=>C.top+(1-(f-s)/(n-s))*(le-C.top-C.bottom);let u=`<svg viewBox="0 0 ${se} ${le}" style="width:100%;height:auto;display:block;background:var(--plot-bg);border-radius:8px">`;const m=5;for(let f=0;f<=m;f++){const b=s+(n-s)*f/m,$=p(b);u+=`<line x1="${C.left}" y1="${$.toFixed(1)}" x2="${se-C.right}" y2="${$.toFixed(1)}" stroke="var(--chart-axis)" stroke-width="1"/>`,u+=`<text x="${C.left-8}" y="${($+4).toFixed(1)}" text-anchor="end" font-size="11" fill="var(--chart-label)">${ve(b)}</text>`}const c=[];for(let f=0;f<=4;f++)c.push(Math.round((i-1)*f/4));c.forEach(f=>{const b=d(f);u+=`<text x="${b.toFixed(1)}" y="${le-C.bottom+18}" text-anchor="middle" font-size="11" fill="var(--chart-label)">${tt(e[f].data)}</text>`});const y=e.map((f,b)=>`${d(b).toFixed(1)},${p(f.close).toFixed(1)}`).join(" "),x=`${C.left},${p(s).toFixed(1)} `+y+` ${d(i-1).toFixed(1)},${p(s).toFixed(1)}`;u+=`<polygon points="${x}" fill="rgba(0, 212, 255, 0.08)"/>`,u+=`<polyline points="${y}" fill="none" stroke="var(--accent-cyan)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;const w=e[i-1],g=p(w.close);return u+=`<circle cx="${d(i-1).toFixed(1)}" cy="${g.toFixed(1)}" r="4" fill="var(--accent-cyan)"/>`,u+=`<text x="${se-C.right}" y="${(g-10).toFixed(1)}" text-anchor="end" font-size="12" font-weight="700" fill="var(--chart-text)">${ve(w.close)}</text>`,u+="</svg>",u}async function rt(e,a){var o;(o=document.querySelector(".modal-overlay"))==null||o.remove();const t=document.createElement("div");t.className="modal-overlay";const r=()=>t.remove();t.addEventListener("click",s=>{s.target===t&&r()}),document.addEventListener("keydown",s=>{s.key==="Escape"&&r()}),t.innerHTML=`
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
  `,document.body.appendChild(t),t.querySelector(".modal-close").addEventListener("click",r);try{const s=await Ie(e),n=t.querySelector("#price-chart-body");if(!s||s.length===0){n.innerHTML=`<p class="modal-error">Nenhum dado de preço disponível para ${l(e)}.</p>`;return}const i=s[0].close,d=s[s.length-1].close,p=(d-i)/i*100,u=p>=0,m=u?"positive":"negative";n.innerHTML=`
      <div class="price-stats">
        <div class="price-stat">
          <span class="price-stat-label">Último</span>
          <strong>${ve(d)}</strong>
        </div>
        <div class="price-stat">
          <span class="price-stat-label">Variação (2a)</span>
          <strong class="${m}">${u?"+":""}${p.toFixed(2)}%</strong>
        </div>
        <div class="price-stat">
          <span class="price-stat-label">Período</span>
          <strong>${s.length} pregões</strong>
        </div>
      </div>
      ${at(s)}
    `}catch(s){console.error(`Erro ao buscar histórico de ${e}:`,s);const n=t.querySelector("#price-chart-body");n.innerHTML=`<p class="modal-error">Erro ao carregar o histórico de ${l(e)}. Verifique se o backend está online.</p>`}}function D(e,a){return`
    <div class="company-detail">
      <span class="company-detail-label">${e}</span>
      <strong class="company-detail-value">${a}</strong>
    </div>
  `}function ot(e){var s;(s=document.querySelector(".modal-overlay"))==null||s.remove();const a=document.createElement("div");a.className="modal-overlay";const t=()=>a.remove();a.addEventListener("click",n=>{n.target===a&&t()}),document.addEventListener("keydown",n=>{n.key==="Escape"&&t()});const r=e.dividendYield!==null&&e.dividendYield!==void 0?`${e.dividendYield.toFixed(2)}%`:"—",o=ce(e.marketCap);a.innerHTML=`
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
          ${D("Empresa",l(e.name||"N/A"))}
          ${D("Setor",l(e.sectorName||e.sector||"N/A"))}
          ${D("Subindústria",l(e.subIndustry||"N/A"))}
          ${D("Sede",l(e.headquarters||"N/A"))}
          ${D("Market Cap",o)}
          ${D("Classificação",l(e.marketCapClassification||"N/A"))}
          ${D("Div. Yield",r)}
          ${D("Paga dividendos",e.hasDividend?l(e.hasDividend):"—")}
          ${D("Data de inclusão",l(e.dateAdded||"N/A"))}
          ${D("CIK",e.cik?l(String(e.cik)):"N/A")}
          ${D("Fundação",l(e.founded||"N/A"))}
        </div>
        <div class="modal-footer">
          <button class="modal-action" id="details-chart-btn">📈 Ver histórico de preços</button>
        </div>
      </div>
    </div>
  `,document.body.appendChild(a),a.querySelector(".modal-close").addEventListener("click",t),a.querySelector("#details-chart-btn").addEventListener("click",()=>{rt(e.symbol,e.name)})}function st(e,a){const t=e/a*100;return t>=80?"#ff5252":t>=60?"#ff9800":t>=40?"#ffeb3b":t>=20?"#8bc34a":"#4caf50"}async function it(){const e=document.getElementById("treemap-view");if(e){e.style.display="flex",e.style.flexDirection="column",e.style.height="100%",e.style.width="100%",e.style.margin="0",e.style.padding="0",e.style.background="var(--bg-primary)",e.innerHTML='<div style="display:flex;align-items:center;justify-content:center;height:100%;width:100%;font-size:14px;color:var(--text-secondary)">Carregando mapa de setores...</div>';try{const r=(await(await fetch(`${window.API_BASE_URL}/api/setores`)).json()).setores||[],o=await Promise.all(r.map(async i=>{var w;const p=await(await fetch(`${window.API_BASE_URL}/api/setor/${i}`)).json(),u=window.SECTORS.find(g=>g.id===i),m=((w=p.dados)==null?void 0:w.companies)||[],c=m.reduce((g,f)=>g+(f.marketCap||0),0),y=m.length>0?m.reduce((g,f)=>g+(f.dividendYield||0),0)/m.length:0,x=m.filter(g=>g.hasDividend==="Sim").length;return{id:i,name:(u==null?void 0:u.name)||i,cap:(c/1e9).toFixed(1),companies:m.length,avgDiv:parseFloat(y.toFixed(2)),withDiv:x,topCompany:m.length>0?m[0].symbol:"N/A"}})),s=Math.max(...o.map(i=>parseFloat(i.cap)));let n=`
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
    `;o.forEach(i=>{const d=st(parseFloat(i.cap),s),p=(parseFloat(i.cap)/s*100).toFixed(1),u=["consumer-staples","communication-services","consumer-discretionary","energy","financials","health-care","industrials","information-technology","materials","real-estate","utilities"].includes(i.id),m=u?new URL(`sector.html?sector=${i.id}`,document.baseURI).href:"#";n+=`
        <div style="
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 24px;
          transition: all 0.3s ease;
          cursor: ${u?"pointer":"not-allowed"};
          display: flex;
          flex-direction: column;
          gap: 20px;
          opacity: ${u?"1":"0.7"};
        "
        onmouseover="${u?`this.style.borderColor='${d}';this.style.background='rgba(${parseInt(d.slice(1,3),16)},${parseInt(d.slice(3,5),16)},${parseInt(d.slice(5,7),16)},0.05)';this.style.transform='translateY(-4px)';this.style.boxShadow='0 12px 32px ${d}22'`:""}"
        onmouseout="${u?"this.style.borderColor='var(--border)';this.style.background='var(--bg-secondary)';this.style.transform='translateY(0)';this.style.boxShadow='none'":""}"
        onclick="${u?`navigateToSector('${m}', '${i.id}')`:`alert('🔒 O setor \\"${i.name}\\" ainda está em desenvolvimento.\\n\\nApenas Consumer Staples, Communication Services, Consumer Discretionary, Energy, Financials, Health Care, Industrials, Information Technology, Materials, Real Estate e Utilities estão disponíveis por enquanto!')`}"
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
              ${p}%
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
                width: ${p}%;
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
          ${u?`
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
    `,e.innerHTML=n}catch(a){console.error("Erro ao carregar treemap:",a),e.innerHTML='<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--accent-red)">Erro ao carregar mapa de setores</div>'}}}function nt(e,a){if(e==="#"){alert(`🔒 O setor "${a}" ainda está em desenvolvimento.

Apenas Consumer Staples, Communication Services, Consumer Discretionary, Energy, Financials, Health Care, Industrials, Information Technology, Materials, Real Estate e Utilities estão disponíveis por enquanto!`);return}window.open(e,"_blank")}window.navigateToSector=nt;async function ct(){var a;const e=document.getElementById("heatmap-view");if(e){e.style.display="flex",e.style.flexDirection="column",e.style.height="100%",e.style.width="100%",e.style.padding="40px",e.style.boxSizing="border-box",e.style.background="var(--bg-primary)",e.style.overflowY="auto",e.innerHTML='<div style="text-align:center;color:var(--text-secondary)">Carregando heatmap...</div>';try{const o=(await(await fetch(`${window.API_BASE_URL}/api/setores`)).json()).setores||[];let s=`
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
    `;for(const n of o){const d=await(await fetch(`${window.API_BASE_URL}/api/setor/${n}`)).json(),p=window.SECTORS.find(c=>c.id===n),u=((a=d.dados)==null?void 0:a.companies)||[];if(u.length===0)continue;const m=u.sort((c,y)=>(y.marketCap||0)-(c.marketCap||0)).slice(0,4);s+=`
        <div style="margin-bottom: 40px;">
          <h3 style="
            font-size: 16px;
            margin: 0 0 20px 0;
            color: var(--text-primary);
            font-weight: 600;
          ">${(p==null?void 0:p.name)||n}</h3>

          <div style="
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 16px;
          ">
      `,m.forEach((c,y)=>{const x=(c.marketCap/1e9).toFixed(2),w=(c.dividendYield||0).toFixed(2);let g="#4caf50";x>500?g="#ff5252":x>200?g="#ff9800":x>100?g="#ffeb3b":x>50&&(g="#8bc34a"),s+=`
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
                ">$${x}B</div>
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
                ">${w}%</div>
              </div>
            </div>
          </div>
        `}),s+=`
          </div>
        </div>
      `}s+=`
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
    `,e.innerHTML=s}catch(t){console.error("Erro ao carregar heatmap:",t),e.innerHTML=`
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
    `}}}const dt={Energy:"#FF6B6B",Materials:"#C92A2A",Industrials:"#FFA94D","Consumer Discretionary":"#FFD43B","Consumer Staples":"#A9E34B","Health Care":"#51CF66",Financials:"#40C057","Information Technology":"#339AF0","Communication Services":"#748FFC",Utilities:"#9775FA","Real Estate":"#DA77F2"};function Be(e){return dt[e]||"#808080"}function he(e){if(!e)return 0;if(typeof e=="number")return e;const t=String(e).toUpperCase().trim().replace(/[$€¥₹]/g,"").trim();return t.includes("T")?parseFloat(t.replace("T",""))*1e12:t.includes("B")?parseFloat(t.replace("B",""))*1e9:t.includes("M")?parseFloat(t.replace("M",""))*1e6:parseFloat(t)||0}function lt(e){if(!e)return 0;if(typeof e=="number")return e;const a=String(e).trim();return parseFloat(a.replace("%",""))||0}function pt(e,a){const t=document.getElementById(a);if(!t){console.error(`❌ Contentor ${a} não encontrado!`);return}t.innerHTML="";const r=e.filter(v=>he(v.marketCap)>0&&v.sectorName).map((v,T)=>({symbol:v.symbol,name:v.name,sector:v.sectorName,marketCap:he(v.marketCap),dividendYield:lt(v.dividendYield),index:T}));if(r.length===0){t.innerHTML="<p>Sem dados disponíveis para o gráfico de bolhas.</p>";return}const o={top:40,right:40,bottom:60,left:60},s=Math.max(window.innerWidth-100,800)-o.left-o.right,n=600-o.top-o.bottom,i=Math.min(...r.map(v=>v.dividendYield)),d=Math.max(...r.map(v=>v.dividendYield)),p=Math.min(...r.map(v=>v.marketCap)),u=Math.max(...r.map(v=>v.marketCap)),m=v=>n-(v-i)/(d-i||1)*n,c=v=>5+(v-p)/(u-p||1)*50,y=(()=>{let v=42;return()=>(v=(v*9301+49297)%233280,v/233280)})(),x=r.map(()=>y()*s),w=document.createElementNS("http://www.w3.org/2000/svg","svg");w.setAttribute("width",s+o.left+o.right),w.setAttribute("height",n+o.top+o.bottom),w.style.cssText="display: block; margin: 20px auto; background: var(--plot-bg); border-radius: 8px;";const g=document.createElementNS("http://www.w3.org/2000/svg","g");g.setAttribute("transform",`translate(${o.left},${o.top})`);for(let v=0;v<=10;v++){const T=v/10*n,oe=i+v/10*(d-i),S=document.createElementNS("http://www.w3.org/2000/svg","line");S.setAttribute("x1",0),S.setAttribute("y1",T),S.setAttribute("x2",s),S.setAttribute("y2",T),S.setAttribute("stroke","var(--chart-axis)"),S.setAttribute("stroke-width","1"),S.setAttribute("stroke-dasharray","4"),g.appendChild(S);const E=document.createElementNS("http://www.w3.org/2000/svg","text");E.setAttribute("x",-10),E.setAttribute("y",T+5),E.setAttribute("text-anchor","end"),E.setAttribute("font-size","12"),E.setAttribute("fill","var(--chart-label)"),E.textContent=oe.toFixed(1)+"%",g.appendChild(E)}const f=document.createElementNS("http://www.w3.org/2000/svg","line");f.setAttribute("x1",0),f.setAttribute("y1",0),f.setAttribute("x2",0),f.setAttribute("y2",n),f.setAttribute("stroke","var(--chart-label)"),f.setAttribute("stroke-width","2"),g.appendChild(f);const b=document.createElementNS("http://www.w3.org/2000/svg","text");b.setAttribute("transform","rotate(-90)"),b.setAttribute("y",-40),b.setAttribute("x",-n/2),b.setAttribute("text-anchor","middle"),b.setAttribute("font-size","14"),b.setAttribute("font-weight","bold"),b.setAttribute("fill","var(--chart-text)"),b.textContent="💵 Dividend Yield (%)",g.appendChild(b);const $=document.createElementNS("http://www.w3.org/2000/svg","line");$.setAttribute("x1",0),$.setAttribute("y1",n),$.setAttribute("x2",s),$.setAttribute("y2",n),$.setAttribute("stroke","var(--chart-label)"),$.setAttribute("stroke-width","2"),g.appendChild($);const N=document.createElementNS("http://www.w3.org/2000/svg","text");N.setAttribute("x",s/2),N.setAttribute("y",n+45),N.setAttribute("text-anchor","middle"),N.setAttribute("font-size","14"),N.setAttribute("font-weight","bold"),N.setAttribute("fill","var(--chart-text)"),N.textContent="📊 Distribuição Aleatória (cada bolha = empresa)",g.appendChild(N),r.forEach((v,T)=>{const oe=x[T],S=m(v.dividendYield),E=c(v.marketCap),Ke=Be(v.sector),k=document.createElementNS("http://www.w3.org/2000/svg","circle");if(k.setAttribute("cx",oe),k.setAttribute("cy",S),k.setAttribute("r",E),k.setAttribute("fill",Ke),k.setAttribute("opacity","0.7"),k.setAttribute("stroke","#fff"),k.setAttribute("stroke-width","2"),k.style.cursor="pointer",k.style.transition="all 0.3s ease",k.addEventListener("mouseover",A=>{k.setAttribute("opacity","1"),k.setAttribute("stroke-width","3"),ut(A,v)}),k.addEventListener("mouseout",()=>{k.setAttribute("opacity","0.7"),k.setAttribute("stroke-width","2"),Ne()}),g.appendChild(k),E>15){const A=document.createElementNS("http://www.w3.org/2000/svg","text");A.setAttribute("x",oe),A.setAttribute("y",S+5),A.setAttribute("text-anchor","middle"),A.setAttribute("font-size",Math.max(10,E/2)),A.setAttribute("font-weight","bold"),A.setAttribute("fill","#fff"),A.setAttribute("pointer-events","none"),A.textContent=v.symbol.substring(0,3),g.appendChild(A)}}),w.appendChild(g),t.appendChild(w),mt(t,r)}function mt(e,a){const t=document.createElement("div");t.style.cssText=`
    margin: 30px auto;
    max-width: 800px;
    padding: 20px;
    background: var(--surface);
    border-radius: 8px;
    border: 1px solid var(--border);
  `;const r=document.createElement("h3");r.textContent="🫧 Como ler o gráfico",r.style.cssText="margin: 0 0 12px 0; color: var(--text-primary);",t.appendChild(r);const o=document.createElement("div");o.style.cssText="margin-bottom: 16px; font-size: 13px; color: var(--text-secondary); line-height: 1.8;",o.innerHTML=`
    <div><strong>Tamanho da bolha:</strong> Market Cap da empresa (quanto maior, mais valiosa)</div>
    <div><strong>Eixo Y (vertical):</strong> Dividend Yield (mais acima = maior dividendo)</div>
    <div><strong>Eixo X (horizontal):</strong> posição aleatória, apenas para facilitar a visualização</div>
    <div><strong>Cor:</strong> setor da empresa</div>
  `,t.appendChild(o);const s=document.createElement("div");s.textContent="Setores",s.style.cssText="font-size: 13px; font-weight: 600; color: var(--text-primary); margin-bottom: 8px;",t.appendChild(s);const n=new Set(a.map(d=>d.sector)),i=document.createElement("div");i.style.cssText="display: flex; flex-wrap: wrap; gap: 12px;",n.forEach(d=>{const p=document.createElement("div");p.style.cssText="display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text-primary);";const u=document.createElement("span");u.style.cssText=`display: inline-block; width: 14px; height: 14px; border-radius: 50%; background: ${Be(d)};`;const m=document.createElement("span");m.textContent=d,p.appendChild(u),p.appendChild(m),i.appendChild(p)}),t.appendChild(i),e.appendChild(t)}let ne=null;function ut(e,a){Ne();const t=document.createElement("div");t.style.cssText=`
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
  `;const r=a.marketCap>=1e12?(a.marketCap/1e12).toFixed(2)+"T":a.marketCap>=1e9?(a.marketCap/1e9).toFixed(2)+"B":(a.marketCap/1e6).toFixed(2)+"M";t.innerHTML=`
    <strong>${a.symbol}</strong> — ${a.name}<br>
    <strong>Setor:</strong> ${a.sector}<br>
    <strong>Market Cap:</strong> $${r}<br>
    <strong>Dividend Yield:</strong> ${a.dividendYield.toFixed(2)}%
  `;const o=e.target.getBoundingClientRect();t.style.left=o.left+10+"px",t.style.top=o.top-10+"px",document.body.appendChild(t),ne=t}function Ne(){ne&&(ne.remove(),ne=null)}function I(e){const a=Number(e&&e.dividendYield);return Number.isFinite(a)&&a>0?a:0}function re(e){return(e||[]).filter(a=>I(a)>0)}function vt(e){const a=re(e);return a.length===0?0:a.reduce((r,o)=>r+I(o),0)/a.length}function yt(e){const a=re(e).map(I).sort((r,o)=>r-o);if(a.length===0)return 0;const t=Math.floor(a.length/2);return a.length%2===0?(a[t-1]+a[t])/2:a[t]}function gt(e){const a=e||[],t=re(a),r=t.map(I);return{total:a.length,payers:t.length,nonPayers:a.length-t.length,payerRatio:a.length>0?t.length/a.length:0,avgYield:vt(a),medianYield:yt(a),maxYield:r.length>0?Math.max(...r):0}}function ft(e,a=15){return re(e).slice().sort((t,r)=>I(r)-I(t)||String(t.symbol).localeCompare(String(r.symbol))).slice(0,a)}const ht=[{label:"0–1%",min:0,max:1},{label:"1–2%",min:1,max:2},{label:"2–3%",min:2,max:3},{label:"3–4%",min:3,max:4},{label:"4–5%",min:4,max:5},{label:"5%+",min:5,max:1/0}];function bt(e){const a=re(e);return ht.map(t=>({label:t.label,count:a.filter(r=>{const o=I(r);return o>=t.min&&o<t.max}).length}))}function kt(e){const a=new Map;for(const t of e||[]){const r=t.sectorName||t.sector||"N/A";a.has(r)||a.set(r,{sector:r,total:0,payers:0,yieldSum:0});const o=a.get(r);o.total+=1;const s=I(t);s>0&&(o.payers+=1,o.yieldSum+=s)}return Array.from(a.values()).map(t=>({sector:t.sector,total:t.total,payers:t.payers,avgYield:t.payers>0?t.yieldSum/t.payers:0})).sort((t,r)=>r.avgYield-t.avgYield||t.sector.localeCompare(r.sector))}const W=e=>`${Number(e).toFixed(2)}%`,be=e=>`${(e*100).toFixed(0)}%`;function xt(e,a){const t=document.getElementById(a);if(!t){console.error(`❌ Contentor ${a} não encontrado!`);return}const r=e||[];if(r.length===0){t.innerHTML='<div class="treemap-container"><p>Sem dados disponíveis para o painel de dividendos.</p></div>';return}const o=gt(r),s=ft(r),n=bt(r),i=kt(r),d=Math.max(1,...n.map(c=>c.count)),p=s.map((c,y)=>`
      <tr class="dividend-row" data-dividend-symbol="${l(c.symbol)}" data-dividend-name="${l(c.name||c.symbol)}">
        <td class="col-index">${y+1}</td>
        <td><strong>${l(c.symbol)}</strong></td>
        <td>${l(c.name||"N/A")}</td>
        <td>${l(c.sectorName||c.sector||"N/A")}</td>
        <td class="dividend-yield">${W(I(c))}</td>
      </tr>`).join(""),u=n.map(c=>`
      <div class="dividend-bucket">
        <span class="dividend-bucket-label">${c.label}</span>
        <div class="dividend-bucket-track">
          <div class="dividend-bucket-fill" style="width: ${c.count/d*100}%"></div>
        </div>
        <span class="dividend-bucket-count">${c.count}</span>
      </div>`).join(""),m=i.map(c=>`
      <tr>
        <td>${l(c.sector)}</td>
        <td class="col-index">${c.payers} / ${c.total}</td>
        <td class="dividend-yield">${W(c.avgYield)}</td>
      </tr>`).join("");t.innerHTML=`
    <div class="dividends-view">
      <header class="treemap-header">
        <h2>💰 Dividendos</h2>
        <p class="subtitle">
          Renda por dividendos no S&amp;P 500 — ${o.payers} de ${o.total} empresas
          pagam dividendos (${be(o.payerRatio)}).
        </p>
      </header>

      <div class="treemap-stats">
        <div class="stat-card">
          <span class="stat-label">Empresas</span>
          <span class="stat-value">${o.total}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Pagadoras</span>
          <span class="stat-value">${o.payers} (${be(o.payerRatio)})</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Yield médio</span>
          <span class="stat-value">${W(o.avgYield)}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Yield mediano</span>
          <span class="stat-value">${W(o.medianYield)}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Maior yield</span>
          <span class="stat-value">${W(o.maxYield)}</span>
        </div>
      </div>

      <div class="dividend-columns">
        <section class="dividend-panel">
          <h3>🏆 Top por Dividend Yield</h3>
          <table class="dividend-table">
            <thead>
              <tr><th>#</th><th>Símbolo</th><th>Empresa</th><th>Setor</th><th>Yield</th></tr>
            </thead>
            <tbody>${p}</tbody>
          </table>
        </section>

        <section class="dividend-panel">
          <h3>📊 Distribuição por faixa</h3>
          <div class="dividend-buckets">${u}</div>
          <p class="dividend-note">Considera apenas as ${o.payers} empresas pagadoras.</p>
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
  `,t.querySelectorAll(".dividend-row").forEach(c=>{c.addEventListener("click",()=>{typeof window.openCompanyDetails=="function"&&window.openCompanyDetails({symbol:c.dataset.dividendSymbol,name:c.dataset.dividendName})})})}const Y=[{company:"3M",ticker:"MMM",sector:"Industrials"},{company:"American Express",ticker:"AXP",sector:"Financials"},{company:"Amgen",ticker:"AMGN",sector:"Health Care"},{company:"Apple",ticker:"AAPL",sector:"Information Technology"},{company:"Boeing",ticker:"BA",sector:"Industrials"},{company:"Caterpillar",ticker:"CAT",sector:"Industrials"},{company:"Chevron",ticker:"CVX",sector:"Energy"},{company:"Cisco Systems",ticker:"CSCO",sector:"Information Technology"},{company:"Coca-Cola",ticker:"KO",sector:"Consumer Staples"},{company:"Dow Inc.",ticker:"DOW",sector:"Materials"},{company:"Goldman Sachs",ticker:"GS",sector:"Financials"},{company:"Home Depot",ticker:"HD",sector:"Consumer Discretionary"},{company:"Honeywell",ticker:"HON",sector:"Industrials"},{company:"IBM",ticker:"IBM",sector:"Information Technology"},{company:"Intel",ticker:"INTC",sector:"Information Technology"},{company:"Johnson & Johnson",ticker:"JNJ",sector:"Health Care"},{company:"JPMorgan Chase",ticker:"JPM",sector:"Financials"},{company:"McDonald's",ticker:"MCD",sector:"Consumer Discretionary"},{company:"Merck",ticker:"MRK",sector:"Health Care"},{company:"Microsoft",ticker:"MSFT",sector:"Information Technology"},{company:"Nike",ticker:"NKE",sector:"Consumer Discretionary"},{company:"Procter & Gamble",ticker:"PG",sector:"Consumer Staples"},{company:"Salesforce",ticker:"CRM",sector:"Information Technology"},{company:"The Travelers Companies",ticker:"TRV",sector:"Financials"},{company:"UnitedHealth Group",ticker:"UNH",sector:"Health Care"},{company:"Verizon",ticker:"VZ",sector:"Communication Services"},{company:"Visa",ticker:"V",sector:"Financials"},{company:"Walgreens Boots Alliance",ticker:"WBA",sector:"Consumer Staples"},{company:"Walt Disney",ticker:"DIS",sector:"Communication Services"},{company:"Nvidia",ticker:"NVDA",sector:"Information Technology"}],wt={"Communication Services":"#00d4ff","Consumer Discretionary":"#ffab00","Consumer Staples":"#00e676",Energy:"#ff5252",Financials:"#ba68c8","Health Care":"#29b6f6",Industrials:"#ffa726","Information Technology":"#00d4ff",Materials:"#66bb6a","Real Estate":"#ec407a",Utilities:"#42a5f5"};function Ct(e){return String(e||"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")}function $t(e){return wt[e]||"#00d4ff"}function Fe(e){return`dow-sector--${Ct(e)}`}function St(e,{search:a="",sector:t=""}={}){const r=String(a).toLowerCase().trim();return(e||[]).filter(o=>{const s=!r||String(o.company).toLowerCase().includes(r)||String(o.ticker).toLowerCase().includes(r),n=!t||o.sector===t;return s&&n})}function Et(e,a="company"){return[...e||[]].sort((t,r)=>{switch(a){case"ticker":return t.ticker.localeCompare(r.ticker);case"sector":return t.sector.localeCompare(r.sector)||t.company.localeCompare(r.company);default:return t.company.localeCompare(r.company)}})}function ke(e){return[...new Set((e||[]).map(a=>a.sector))].sort()}function At(e){const a=new Map;return(e||[]).forEach(t=>{a.has(t.sector)||a.set(t.sector,[]),a.get(t.sector).push(t.company)}),[...a.entries()].map(([t,r])=>({sector:t,companies:r,count:r.length})).sort((t,r)=>r.count-t.count||t.sector.localeCompare(r.sector))}function Dt(e){return(e||[]).filter(a=>a.sector==="Information Technology").length}function Mt(e){return`<div class="dow-cards">${(e||[]).map(t=>`
      <article class="dow-card">
        <div class="dow-card-head">
          <h3>${l(t.company)}</h3>
          <span class="dow-ticker">${l(t.ticker)}</span>
        </div>
        <span class="dow-sector ${Fe(t.sector)}">${l(t.sector)}</span>
      </article>`).join("")}</div>`}function Tt(e){return`
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
        <td><span class="dow-sector ${Fe(t.sector)}">${l(t.sector)}</span></td>
      </tr>`).join("")}</tbody>
      </table>
    </div>`}function Lt(e="dow-jones-view"){const a=document.getElementById(e);if(!a){console.error(`❌ Contentor ${e} não encontrado!`);return}const t={search:"",sector:"",sortBy:"company",view:"cards"},r=ke(Y).length,o=ke(Y).map(c=>`<option value="${l(c)}">${l(c)}</option>`).join(""),s=At(Y).map(c=>`
      <div class="dow-breakdown-item">
        <div class="dow-breakdown-head" style="color: ${$t(c.sector)}">
          <span>${l(c.sector)}</span>
          <span class="dow-breakdown-count">${c.count}</span>
        </div>
        <p class="dow-breakdown-list">${c.companies.map(y=>l(y)).join(", ")}</p>
      </div>`).join("");a.innerHTML=`
    <div class="dow-jones-view">
      <header class="dow-header">
        <div class="dow-header-content">
          <h2>Dow Jones 30</h2>
          <p>📈 30 maiores empresas - índice blue chip dos EUA</p>
        </div>
        <div class="dow-stats">
          <div class="dow-stat">
            <span class="dow-stat-value">${Y.length}</span>
            <span class="dow-stat-label">Empresas</span>
          </div>
          <div class="dow-stat">
            <span class="dow-stat-value">${r}</span>
            <span class="dow-stat-label">Setores</span>
          </div>
          <div class="dow-stat">
            <span class="dow-stat-value">${Dt(Y)}</span>
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
            ${o}
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
        <div class="dow-breakdown-grid">${s}</div>
      </section>

      <aside class="dow-info">
        <strong>💡 Sobre o Dow Jones Industrial Average (DJIA):</strong> um dos índices de ações
        mais antigos e respeitados do mundo, composto por 30 grandes empresas americanas. É
        frequentemente usado como indicador da saúde da economia dos EUA. As suas empresas são
        consideradas "blue chips" e o índice é ponderado por preço.
      </aside>
    </div>
  `;const n=a.querySelector("#dow-results"),i=a.querySelector("#dow-search"),d=a.querySelector("#dow-sector"),p=a.querySelector("#dow-sort"),u=a.querySelectorAll(".dow-view-btn");function m(){const c=Et(St(Y,{search:t.search,sector:t.sector}),t.sortBy);if(c.length===0){n.innerHTML='<p class="dow-empty">Nenhuma empresa encontrada.</p>';return}n.innerHTML=t.view==="table"?Tt(c):Mt(c),t.view==="table"&&n.querySelectorAll("th[data-sort]").forEach(y=>{y.addEventListener("click",()=>{t.sortBy=y.dataset.sort,p&&(p.value=t.sortBy),m()})})}i&&i.addEventListener("input",()=>{t.search=i.value,m()}),d&&d.addEventListener("change",()=>{t.sector=d.value,m()}),p&&p.addEventListener("change",()=>{t.sortBy=p.value,m()}),u.forEach(c=>{c.addEventListener("click",()=>{t.view=c.dataset.view,u.forEach(y=>y.classList.toggle("active",y===c)),m()})}),m()}const _=[{company:"American States Water",ticker:"AWR",sector:"Utilities"},{company:"California Water Service",ticker:"CWT",sector:"Utilities"},{company:"Northwest Natural",ticker:"NWN",sector:"Utilities"},{company:"Procter & Gamble",ticker:"PG",sector:"Consumer Defensive"},{company:"Coca-Cola",ticker:"KO",sector:"Consumer Defensive"},{company:"Johnson & Johnson",ticker:"JNJ",sector:"Healthcare"},{company:"Colgate-Palmolive",ticker:"CL",sector:"Consumer Defensive"},{company:"Genuine Parts",ticker:"GPC",sector:"Consumer Cyclical"},{company:"Emerson Electric",ticker:"EMR",sector:"Industrials"},{company:"Dover",ticker:"DOV",sector:"Industrials"},{company:"Lowe's",ticker:"LOW",sector:"Consumer Cyclical"},{company:"Federal Realty",ticker:"FRT",sector:"Real Estate"},{company:"ABM Industries",ticker:"ABM",sector:"Industrials"},{company:"Stepan",ticker:"SCL",sector:"Basic Materials"},{company:"H.B. Fuller",ticker:"FUL",sector:"Basic Materials"},{company:"Universal Corp",ticker:"UVV",sector:"Consumer Defensive"},{company:"Hormel Foods",ticker:"HRL",sector:"Consumer Defensive"},{company:"Kimberly-Clark",ticker:"KMB",sector:"Consumer Defensive"},{company:"Middlesex Water",ticker:"MSEX",sector:"Utilities"},{company:"MSA Safety",ticker:"MSA",sector:"Industrials"},{company:"PPG Industries",ticker:"PPG",sector:"Basic Materials"},{company:"RPM International",ticker:"RPM",sector:"Basic Materials"},{company:"Black Hills",ticker:"BKH",sector:"Utilities"},{company:"National Fuel Gas",ticker:"NFG",sector:"Energy"},{company:"PepsiCo",ticker:"PEP",sector:"Consumer Defensive"},{company:"Altria",ticker:"MO",sector:"Consumer Defensive"},{company:"Stanley Black & Decker",ticker:"SWK",sector:"Industrials"},{company:"Target",ticker:"TGT",sector:"Consumer Cyclical"},{company:"Sysco",ticker:"SYY",sector:"Consumer Defensive"},{company:"Cincinnati Financial",ticker:"CINF",sector:"Financials"},{company:"Tootsie Roll",ticker:"TR",sector:"Consumer Defensive"},{company:"Gorman-Rupp",ticker:"GRC",sector:"Industrials"},{company:"Pentair",ticker:"PNR",sector:"Industrials"},{company:"H2O America",ticker:"HTO",sector:"Utilities"},{company:"MGE Energy",ticker:"MGEE",sector:"Utilities"},{company:"RLI Corp",ticker:"RLI",sector:"Financials"},{company:"S&P Global",ticker:"SPGI",sector:"Financials"},{company:"Automatic Data Processing",ticker:"ADP",sector:"Industrials"}],It={"Basic Materials":"#66bb6a","Consumer Cyclical":"#ffab00","Consumer Defensive":"#00e676",Energy:"#ff5252",Financials:"#ba68c8",Healthcare:"#29b6f6",Industrials:"#ffa726","Real Estate":"#ec407a",Utilities:"#42a5f5"};function Bt(e){return String(e||"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")}function Nt(e){return It[e]||"#00e676"}function Pe(e){return`dk-sector--${Bt(e)}`}function Ft(e,{search:a="",sector:t=""}={}){const r=String(a).toLowerCase().trim();return(e||[]).filter(o=>{const s=!r||String(o.company).toLowerCase().includes(r)||String(o.ticker).toLowerCase().includes(r),n=!t||o.sector===t;return s&&n})}function Pt(e,a="company"){return[...e||[]].sort((t,r)=>{switch(a){case"ticker":return t.ticker.localeCompare(r.ticker);case"sector":return t.sector.localeCompare(r.sector)||t.company.localeCompare(r.company);default:return t.company.localeCompare(r.company)}})}function xe(e){return[...new Set((e||[]).map(a=>a.sector))].sort()}function Ht(e){const a=new Map;return(e||[]).forEach(t=>{a.has(t.sector)||a.set(t.sector,[]),a.get(t.sector).push(t.company)}),[...a.entries()].map(([t,r])=>({sector:t,companies:r,count:r.length})).sort((t,r)=>r.count-t.count||t.sector.localeCompare(r.sector))}function Rt(e){return`<div class="dk-cards">${(e||[]).map(t=>`
      <article class="dk-card">
        <div class="dk-card-head">
          <h3>${l(t.company)}</h3>
          <span class="dk-ticker">${l(t.ticker)}</span>
        </div>
        <span class="dk-sector ${Pe(t.sector)}">${l(t.sector)}</span>
        <div class="dk-badge">👑 50+ Anos de Dividendos</div>
      </article>`).join("")}</div>`}function Ot(e){return`
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
        <td><span class="dk-sector ${Pe(t.sector)}">${l(t.sector)}</span></td>
      </tr>`).join("")}</tbody>
      </table>
    </div>`}function Yt(e="dividend-kings-view"){const a=document.getElementById(e);if(!a){console.error(`❌ Contentor ${e} não encontrado!`);return}const t={search:"",sector:"",sortBy:"company",view:"cards"},r=xe(_).length,o=xe(_).map(m=>`<option value="${l(m)}">${l(m)}</option>`).join(""),s=Ht(_).map(m=>`
      <div class="dk-breakdown-item">
        <div class="dk-breakdown-head" style="color: ${Nt(m.sector)}">
          <span>${l(m.sector)}</span>
          <span class="dk-breakdown-count">${m.count}</span>
        </div>
        <p class="dk-breakdown-list">${m.companies.map(c=>l(c)).join(", ")}</p>
      </div>`).join("");a.innerHTML=`
    <div class="dividend-kings-view">
      <header class="dk-header">
        <div class="dk-header-content">
          <h2>Dividend Kings</h2>
          <p>👑 50+ anos de aumento ininterrupto de dividendos</p>
        </div>
        <div class="dk-stats">
          <div class="dk-stat">
            <span class="dk-stat-value">${_.length}</span>
            <span class="dk-stat-label">Empresas</span>
          </div>
          <div class="dk-stat">
            <span class="dk-stat-value">${r}</span>
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
            ${o}
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
        <div class="dk-breakdown-grid">${s}</div>
      </section>

      <aside class="dk-info">
        <strong>💡 O que são Dividend Kings?</strong> são empresas que aumentaram
        ininterruptamente os seus dividendos por mais de 50 anos consecutivos. Estão entre as
        empresas mais estáveis e rentáveis do mercado, com modelos de negócio sólidos e geração de
        caixa consistente — ideais para investidores que procuram renda passiva fiável e crescimento
        a longo prazo.
      </aside>
    </div>
  `;const n=a.querySelector("#dk-results"),i=a.querySelector("#dk-search"),d=a.querySelector("#dk-sector"),p=a.querySelector("#dk-sort"),u=()=>{const m=Pt(Ft(_,{search:t.search,sector:t.sector}),t.sortBy);if(m.length===0){n.innerHTML='<p class="dk-empty">Nenhuma empresa encontrada.</p>';return}if(t.view==="cards"){n.innerHTML=Rt(m);return}n.innerHTML=Ot(m),n.querySelectorAll(".dk-table th[data-sort]").forEach(c=>{c.addEventListener("click",()=>{t.sortBy=c.getAttribute("data-sort"),p&&(p.value=t.sortBy),u()})})};i&&i.addEventListener("input",()=>{t.search=i.value,u()}),d&&d.addEventListener("change",()=>{t.sector=d.value,u()}),p&&p.addEventListener("change",()=>{t.sortBy=p.value,u()}),a.querySelectorAll(".dk-view-btn").forEach(m=>{m.addEventListener("click",()=>{t.view=m.getAttribute("data-view"),a.querySelectorAll(".dk-view-btn").forEach(c=>c.classList.remove("active")),m.classList.add("active"),u()})}),u()}const z=[{company:"AbbVie",ticker:"ABBV",sector:"Health Care",years:53},{company:"Abbott Laboratories",ticker:"ABT",sector:"Health Care",years:53},{company:"Archer-Daniels-Midland",ticker:"ADM",sector:"Consumer Staples",years:50},{company:"Automatic Data Processing",ticker:"ADP",sector:"Information Technology",years:50},{company:"Aflac",ticker:"AFL",sector:"Financials",years:44},{company:"Albemarle",ticker:"ALB",sector:"Materials",years:31},{company:"Amcor",ticker:"AMCR",sector:"Materials",years:30},{company:"A.O. Smith",ticker:"AOS",sector:"Industrials",years:32},{company:"Air Products & Chemicals",ticker:"APD",sector:"Materials",years:43},{company:"Atmos Energy",ticker:"ATO",sector:"Utilities",years:42},{company:"Becton Dickinson",ticker:"BDX",sector:"Health Care",years:54},{company:"Franklin Resources",ticker:"BEN",sector:"Financials",years:46},{company:"Brown-Forman",ticker:"BF.B",sector:"Consumer Staples",years:41},{company:"Brown & Brown",ticker:"BRO",sector:"Financials",years:32},{company:"Cardinal Health",ticker:"CAH",sector:"Health Care",years:29},{company:"Caterpillar",ticker:"CAT",sector:"Industrials",years:32},{company:"Chubb",ticker:"CB",sector:"Financials",years:32},{company:"Church & Dwight",ticker:"CHD",sector:"Consumer Staples",years:29},{company:"C.H. Robinson",ticker:"CHRW",sector:"Industrials",years:28},{company:"Cincinnati Financial",ticker:"CINF",sector:"Financials",years:65},{company:"Colgate-Palmolive",ticker:"CL",sector:"Consumer Staples",years:62},{company:"Clorox",ticker:"CLX",sector:"Consumer Staples",years:48},{company:"Cintas",ticker:"CTAS",sector:"Industrials",years:43},{company:"Chevron",ticker:"CVX",sector:"Energy",years:38},{company:"Dover",ticker:"DOV",sector:"Industrials",years:70},{company:"Ecolab",ticker:"ECL",sector:"Materials",years:34},{company:"Consolidated Edison",ticker:"ED",sector:"Utilities",years:51},{company:"Emerson Electric",ticker:"EMR",sector:"Industrials",years:69},{company:"Erie Indemnity",ticker:"ERIE",sector:"Financials",years:36},{company:"Eversource Energy",ticker:"ES",sector:"Utilities",years:27},{company:"Essex Property Trust",ticker:"ESS",sector:"Real Estate",years:31},{company:"Expeditors International",ticker:"EXPD",sector:"Industrials",years:29},{company:"Fastenal",ticker:"FAST",sector:"Industrials",years:25},{company:"FactSet Research Systems",ticker:"FDS",sector:"Financials",years:25},{company:"Federal Realty",ticker:"FRT",sector:"Real Estate",years:50},{company:"Genuine Parts",ticker:"GPC",sector:"Consumer Discretionary",years:50},{company:"Grainger",ticker:"GWW",sector:"Industrials",years:40},{company:"Hasbro",ticker:"HAS",sector:"Consumer Discretionary",years:25},{company:"Hormel Foods",ticker:"HRL",sector:"Consumer Staples",years:57},{company:"IBM",ticker:"IBM",sector:"Information Technology",years:29},{company:"Johnson & Johnson",ticker:"JNJ",sector:"Health Care",years:62},{company:"Kimberly-Clark",ticker:"KMB",sector:"Consumer Staples",years:53},{company:"Coca-Cola",ticker:"KO",sector:"Consumer Staples",years:62},{company:"Leggett & Platt",ticker:"LEG",sector:"Consumer Discretionary",years:52},{company:"Linde",ticker:"LIN",sector:"Materials",years:29},{company:"Lowe's",ticker:"LOW",sector:"Consumer Discretionary",years:50},{company:"McDonald's",ticker:"MCD",sector:"Consumer Discretionary",years:47},{company:"Medtronic",ticker:"MDT",sector:"Health Care",years:47},{company:"McCormick",ticker:"MKC",sector:"Consumer Staples",years:37},{company:"3M",ticker:"MMM",sector:"Industrials",years:64},{company:"Nordson",ticker:"NDSN",sector:"Industrials",years:60},{company:"National Fuel Gas",ticker:"NFG",sector:"Energy",years:52},{company:"Nucor",ticker:"NUE",sector:"Materials",years:50},{company:"Realty Income",ticker:"O",sector:"Real Estate",years:30},{company:"PepsiCo",ticker:"PEP",sector:"Consumer Staples",years:51},{company:"Procter & Gamble",ticker:"PG",sector:"Consumer Staples",years:67},{company:"Pentair",ticker:"PNR",sector:"Industrials",years:47},{company:"PPG Industries",ticker:"PPG",sector:"Materials",years:52},{company:"Roper Technologies",ticker:"ROP",sector:"Industrials",years:30},{company:"Republic Services",ticker:"RSG",sector:"Industrials",years:25},{company:"Sherwin-Williams",ticker:"SHW",sector:"Materials",years:45},{company:"Smucker",ticker:"SJM",sector:"Consumer Staples",years:28},{company:"S&P Global",ticker:"SPGI",sector:"Financials",years:50},{company:"Stanley Black & Decker",ticker:"SWK",sector:"Industrials",years:55},{company:"Sysco",ticker:"SYY",sector:"Consumer Staples",years:53},{company:"T. Rowe Price",ticker:"TROW",sector:"Financials",years:36},{company:"VF Corp",ticker:"VFC",sector:"Consumer Discretionary",years:50},{company:"Walgreens Boots Alliance",ticker:"WBA",sector:"Consumer Staples",years:47},{company:"Walmart",ticker:"WMT",sector:"Consumer Staples",years:50},{company:"West Pharmaceutical Services",ticker:"WST",sector:"Health Care",years:30},{company:"Exxon Mobil",ticker:"XOM",sector:"Energy",years:42}],zt={"Consumer Staples":"#00e676","Communication Services":"#00d4ff","Consumer Discretionary":"#ffab00",Energy:"#ff5252",Financials:"#ba68c8","Health Care":"#29b6f6",Industrials:"#ffa726","Information Technology":"#00d4ff",Materials:"#66bb6a","Real Estate":"#ec407a",Utilities:"#42a5f5"};function qt(e){return String(e||"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")}function jt(e){return zt[e]||"#ffc107"}function He(e){return`da-sector--${qt(e)}`}function Vt(e){return(e||[]).reduce((a,t)=>Math.max(a,Number(t.years)||0),0)}function Ut(e,{search:a="",sector:t="",minYears:r=0}={}){const o=String(a).toLowerCase().trim(),s=Number(r)||0;return(e||[]).filter(n=>{const i=!o||String(n.company).toLowerCase().includes(o)||String(n.ticker).toLowerCase().includes(o),d=!t||n.sector===t,p=(Number(n.years)||0)>=s;return i&&d&&p})}function Gt(e,a="years"){return[...e||[]].sort((t,r)=>{switch(a){case"company":return t.company.localeCompare(r.company);case"ticker":return t.ticker.localeCompare(r.ticker);case"sector":return t.sector.localeCompare(r.sector)||t.company.localeCompare(r.company);case"years":return(r.years||0)-(t.years||0)||t.company.localeCompare(r.company);default:return 0}})}function we(e){return[...new Set((e||[]).map(a=>a.sector))].sort()}function Kt(e){const a=new Map;return(e||[]).forEach(t=>{a.has(t.sector)||a.set(t.sector,[]),a.get(t.sector).push(t.company)}),[...a.entries()].map(([t,r])=>({sector:t,companies:r,count:r.length})).sort((t,r)=>r.count-t.count||t.sector.localeCompare(r.sector))}function Jt(e){return`<div class="da-cards">${(e||[]).map(t=>`
      <article class="da-card">
        <div class="da-card-head">
          <h3>${l(t.company)}</h3>
          <span class="da-ticker">${l(t.ticker)}</span>
        </div>
        <span class="da-sector ${He(t.sector)}">${l(t.sector)}</span>
        <div class="da-years">🏆 ${l(String(t.years))} Anos de Aumento</div>
      </article>`).join("")}</div>`}function Wt(e){return`
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
        <td><span class="da-sector ${He(t.sector)}">${l(t.sector)}</span></td>
        <td><strong class="da-years-value">${l(String(t.years))}</strong></td>
      </tr>`).join("")}</tbody>
      </table>
    </div>`}function _t(e="dividend-aristocrats-view"){const a=document.getElementById(e);if(!a){console.error("❌ dividend-aristocrats-view não encontrado!");return}const t={search:"",sector:"",minYears:0,sortBy:"years",view:"cards"},r=we(z).length,o=we(z).map(c=>`<option value="${l(c)}">${l(c)}</option>`).join(""),s=Kt(z).map(c=>`
      <div class="da-breakdown-item">
        <div class="da-breakdown-head" style="color: ${jt(c.sector)}">
          <span>${l(c.sector)}</span>
          <span class="da-breakdown-count">${c.count}</span>
        </div>
        <p class="da-breakdown-list">${c.companies.map(y=>l(y)).join(", ")}</p>
      </div>`).join("");a.innerHTML=`
    <div class="dividend-aristocrats-view">
      <header class="da-header">
        <div class="da-header-content">
          <h2>Dividend Aristocrats</h2>
          <p>🏆 Empresas do S&amp;P 500 com 25+ anos de aumento de dividendos</p>
        </div>
        <div class="da-stats">
          <div class="da-stat">
            <span class="da-stat-value">${z.length}</span>
            <span class="da-stat-label">Empresas</span>
          </div>
          <div class="da-stat">
            <span class="da-stat-value">${r}</span>
            <span class="da-stat-label">Setores</span>
          </div>
          <div class="da-stat">
            <span class="da-stat-value">${Vt(z)}</span>
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
            ${o}
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
        <div class="da-breakdown-grid">${s}</div>
      </section>

      <aside class="da-info">
        <strong>💡 O que são Dividend Aristocrats?</strong> são empresas do S&amp;P 500 que
        aumentaram os seus dividendos por pelo menos 25 anos consecutivos. Este histórico indica
        resiliência do negócio, geração de caixa consistente e compromisso da administração com os
        acionistas. Os valores de anos apresentados são os da lista de origem e podem ser
        atualizados periodicamente.
      </aside>
    </div>
  `;const n=a.querySelector("#da-results"),i=a.querySelector("#da-search"),d=a.querySelector("#da-sector"),p=a.querySelector("#da-min-years"),u=a.querySelector("#da-sort"),m=()=>{const c=Gt(Ut(z,{search:t.search,sector:t.sector,minYears:t.minYears}),t.sortBy);if(c.length===0){n.innerHTML='<p class="da-empty">Nenhuma empresa encontrada.</p>';return}if(t.view==="cards"){n.innerHTML=Jt(c);return}n.innerHTML=Wt(c),n.querySelectorAll(".da-table th[data-sort]").forEach(y=>{y.addEventListener("click",()=>{t.sortBy=y.getAttribute("data-sort"),u&&(u.value=t.sortBy),m()})})};i&&i.addEventListener("input",()=>{t.search=i.value,m()}),d&&d.addEventListener("change",()=>{t.sector=d.value,m()}),p&&p.addEventListener("input",()=>{t.minYears=Number(p.value)||0,m()}),u&&u.addEventListener("change",()=>{t.sortBy=u.value,m()}),a.querySelectorAll(".da-view-btn").forEach(c=>{c.addEventListener("click",()=>{t.view=c.getAttribute("data-view"),a.querySelectorAll(".da-view-btn").forEach(y=>y.classList.remove("active")),c.classList.add("active"),m()})}),m()}const Zt={bullish:{label:"Otimista",cls:"positive"},bearish:{label:"Pessimista",cls:"negative"},neutral:{label:"Neutro",cls:""}};async function Xt(e="daily-summary"){const a=document.getElementById(e);if(a){a.innerHTML='<p class="summary-empty">Carregando resumo do dia...</p>';try{const t=await fetch(`${K}/api/resumo-dia`);if(!t.ok)throw new Error(`HTTP ${t.status}`);const r=await t.json();ea(a,r.dados||{})}catch(t){console.error("Erro ao carregar Resumo do Dia:",t),a.innerHTML='<p class="summary-empty">Resumo do dia indisponível no momento.</p>'}}}function Re(e){const a=Number(e)||0;return`${a>0?"+":""}${a.toFixed(2)}%`}function Qt(e){if(!e)return"";const a=new Date(`${e}T00:00:00`);return Number.isNaN(a.getTime())?"":a.toLocaleDateString("pt-BR")}function Ce(e,a){const t=(a||[]).map(r=>`
        <div class="summary-row">
          <span class="mini-symbol">${l(r.symbol||"")}</span>
          <span class="mini-name">${l(r.name||"")}</span>
          <span class="mini-change ${r.changePct>=0?"positive":"negative"}">${Re(r.changePct)}</span>
        </div>`).join("");return`
    <div class="summary-list">
      <h4 class="summary-list-title">${e}</h4>
      ${t}
    </div>`}function ea(e,a){const t=a.stats||{},r=Zt[a.marketMood]||{label:"—",cls:""},o=Qt(a.referenceDate),s=[{label:"Em alta",value:t.gainers??"—",cls:"positive"},{label:"Em baixa",value:t.losers??"—",cls:"negative"},{label:"Estáveis",value:t.neutral??"—",cls:""},{label:"Total",value:t.total??"—",cls:""},{label:"Humor",value:r.label,cls:r.cls}].map(i=>`
      <div class="daily-card ${i.cls}">
        <span class="daily-label">${i.label}</span>
        <span class="daily-value">${i.value}</span>
      </div>`).join(""),n=(a.sectorPerformance||[]).map(i=>`
      <div class="daily-sector-card ${i.avgChangePct>=0?"positive":"negative"}">
        <span class="sector-name">${l(i.name||"")}</span>
        <span class="sector-change">${Re(i.avgChangePct)}</span>
      </div>`).join("");e.innerHTML=`
    <header class="daily-summary-header">
      <h2>📊 Resumo do Dia</h2>
      ${o?`<span class="daily-date">Referência: ${o}</span>`:""}
    </header>

    <div class="daily-summary-grid">${s}</div>

    <div class="daily-lists">
      ${Ce("🚀 Maiores altas",a.topGainers)}
      ${Ce("📉 Maiores baixas",a.topLosers)}
    </div>

    <div class="daily-sectors">
      <h3>📈 Desempenho por setor</h3>
      <div class="daily-sectors-list">${n}</div>
    </div>
  `}const Oe="sp500-price-alerts",ye=50;function ta(){try{const e=localStorage.getItem(Oe);if(!e)return[];const a=JSON.parse(e);return Array.isArray(a)&&a.length>0&&Array.isArray(a[0])?a:Array.isArray(a)&&a.length>0&&typeof a[0]=="object"?a.map(t=>[t.symbol,t]):[]}catch(e){return console.error("Erro ao carregar price alerts:",e),[]}}function de(){try{const e=Array.from(J.entries());localStorage.setItem(Oe,JSON.stringify(e))}catch(e){console.error("Erro ao salvar price alerts:",e)}}function aa(e,a){let t;return function(...o){const s=()=>{clearTimeout(t),e(...o)};clearTimeout(t),t=setTimeout(s,a)}}function ge(){const e=document.getElementById("nav-menu"),a=document.getElementById("menu-toggle");e&&e.classList.remove("open"),a&&a.setAttribute("aria-expanded","false")}function ra(){const e=document.getElementById("menu-toggle"),a=document.getElementById("nav-menu");!e||!a||(e.addEventListener("click",t=>{t.stopPropagation();const r=a.classList.toggle("open");e.setAttribute("aria-expanded",String(r))}),document.addEventListener("click",t=>{a.classList.contains("open")&&!a.contains(t.target)&&ge()}),document.addEventListener("keydown",t=>{t.key==="Escape"&&ge()}))}let M=[],B=[],L=1,ee="dashboard",G=new Set;const $e=new Set,pe=ta(),J=new Map(pe&&pe.length>0?pe:[]);let F,P,Z,X,Q,O,H,j,R;function oa(){F=document.getElementById("sector-filter"),P=document.getElementById("country-filter"),Z=document.getElementById("search-input"),X=document.getElementById("dividend-min"),Q=document.getElementById("sort-select"),O=document.getElementById("table-body"),H=document.getElementById("stats"),j=document.getElementById("pagination"),R=document.getElementById("header-checkbox"),document.querySelectorAll(".nav-tab").forEach(s=>{s.addEventListener("click",n=>{n.preventDefault();const i=s.getAttribute("data-tab");sa(i),ge()})}),ra(),F&&F.addEventListener("change",V),P&&P.addEventListener("change",V),Z&&Z.addEventListener("input",aa(V,300)),X&&X.addEventListener("change",V),Q&&Q.addEventListener("change",V),R&&R.addEventListener("change",()=>{const s=R.checked;O.querySelectorAll(".row-checkbox").forEach(i=>{i.checked=s,i.dispatchEvent(new Event("change"))})});const a=document.getElementById("select-all"),t=document.getElementById("deselect-all"),r=document.getElementById("export-csv"),o=document.getElementById("export-json");a&&a.addEventListener("click",()=>{B.forEach(s=>G.add(s.symbol)),te(),ae()}),t&&t.addEventListener("click",()=>{G.clear(),te(),ae()}),r&&r.addEventListener("click",$a),o&&o.addEventListener("click",Sa),Ye(),je(),Ve(),Xt(),wa()}document.addEventListener("DOMContentLoaded",oa);function sa(e){ee=e,Ye(),je()}function q(e,a){$e.has(e)||($e.add(e),a())}function Ye(){const e=document.getElementById("dashboard-view"),a=document.getElementById("treemap-view"),t=document.getElementById("heatmap-view"),r=document.getElementById("bubble-chart-view"),o=document.getElementById("dividends-view"),s=document.getElementById("stock-of-day-view"),n=document.getElementById("daily-curiosity-view"),i=document.getElementById("dow-jones-view"),d=document.getElementById("dividend-kings-view"),p=document.getElementById("dividend-aristocrats-view");switch([e,a,t,r,o,s,n,i,d,p].forEach(m=>{m&&(m.style.display="none")}),ee){case"dashboard":e&&(e.style.display="block");break;case"stock-of-day":s&&(s.style.display="block",Ue());break;case"daily-curiosity":n&&(n.style.display="block",q("daily-curiosity",Je));break;case"treemap":a&&(a.style.display="block",q("treemap",it));break;case"heatmap":t&&(t.style.display="block",q("heatmap",ct));break;case"bubble":r&&(r.style.display="block",ze());break;case"dividends":o&&(o.style.display="block",qe());break;case"dow-jones":i&&(i.style.display="block",q("dow-jones",ia));break;case"dividend-kings":d&&(d.style.display="block",q("dividend-kings",na));break;case"dividend-aristocrats":p&&(p.style.display="block",q("dividend-aristocrats",ca));break;default:e&&(e.style.display="block")}}function ze(){const e=document.getElementById("bubble-chart-view");if(!e){console.error("❌ bubble-chart-view não encontrado!");return}e.innerHTML='<div style="text-align: center; padding: 40px;"><p>Carregando gráfico de bolhas...</p></div>',pt(M,"bubble-chart-view")}function qe(){const e=document.getElementById("dividends-view");if(!e){console.error("❌ dividends-view não encontrado!");return}if(M.length===0){e.innerHTML='<div style="text-align: center; padding: 40px;"><p>Carregando dados de dividendos...</p></div>';return}xt(M,"dividends-view")}function ia(){if(!document.getElementById("dow-jones-view")){console.error("❌ dow-jones-view não encontrado!");return}Lt("dow-jones-view")}function na(){if(!document.getElementById("dividend-kings-view")){console.error("❌ dividend-kings-view não encontrado!");return}Yt("dividend-kings-view")}function ca(){if(!document.getElementById("dividend-aristocrats-view")){console.error("❌ dividend-aristocrats-view não encontrado!");return}_t("dividend-aristocrats-view")}function je(){document.querySelectorAll(".nav-tab").forEach(a=>{a.classList.remove("active"),a.getAttribute("data-tab")===ee&&a.classList.add("active")})}async function Ve(){H&&(H.textContent="Carregando dados...");try{const e=await fetch(`${K}/api/setores`);if(!e.ok)throw new Error("Erro ao buscar setores");const r=((await e.json()).setores||[]).map(async s=>{try{const n=await fetch(`${K}/api/setor/${s}`);if(!n.ok)throw new Error(`HTTP ${n.status}`);const i=await n.json(),d=me.find(u=>u.id===s),p=d?d.name:s;return i.dados&&i.dados.companies&&Array.isArray(i.dados.companies)?{generatedAt:i.dados.generatedAt||null,companies:i.dados.companies.map(u=>({...u,sector:s,sectorName:p}))}:{generatedAt:null,companies:[]}}catch(n){return console.error(`❌ Erro ao carregar ${s}:`,n),{generatedAt:null,companies:[]}}}),o=await Promise.all(r);M=o.flatMap(s=>s.companies),Se(o.map(s=>s.generatedAt).filter(Boolean)),F&&(F.innerHTML='<option value="">Todos os Setores</option>',[...new Set(M.map(n=>n.sector))].sort().forEach(n=>{var d;const i=document.createElement("option");i.value=n,i.textContent=((d=me.find(p=>p.id===n))==null?void 0:d.name)||n,F.appendChild(i)})),P&&(P.innerHTML='<option value="">Todos os Países</option>',[...new Set(M.map(n=>Le(n.headquarters)))].sort().forEach(n=>{const i=document.createElement("option");i.value=n,i.textContent=n,P.appendChild(i)})),V(),ae(),ee==="bubble"&&ze(),ee==="dividends"&&qe()}catch(e){console.error("❌ Erro ao carregar dados:",e),H&&(H.textContent="Erro ao carregar dados. Tente novamente."),Se([])}}function Se(e){const a=document.getElementById("freshness-badge"),t=document.getElementById("freshness-text");if(!t)return;const r=(e||[]).map(d=>new Date(d)).filter(d=>!Number.isNaN(d.getTime()));if(r.length===0){a&&(a.classList.remove("fd-fresh","fd-aging","fd-stale"),a.classList.add("fd-unknown")),t.textContent="Data indisponível";return}const o=new Date(Math.max(...r.map(d=>d.getTime()))),s=Math.floor((Date.now()-o.getTime())/864e5);let n="fd-fresh";s>30?n="fd-stale":s>7&&(n="fd-aging"),a&&(a.classList.remove("fd-fresh","fd-aging","fd-stale","fd-unknown"),a.classList.add(n));const i=o.toLocaleDateString("pt-BR");t.textContent=`Dados de ${i}`,a&&(a.title=`Última atualização dos dados: ${i}`)}function V(){const e=F?F.value:"",a=P?P.value:"",t=Z?Z.value.toLowerCase():"",r=X&&parseFloat(X.value)||0,o=Q?Q.value:"symbol-asc";B=M.filter(i=>{const d=!e||i.sector===e,p=!a||Le(i.headquarters)===a,u=!t||i.symbol.toLowerCase().includes(t)||i.name.toLowerCase().includes(t)||i.subIndustry&&i.subIndustry.toLowerCase().includes(t)||i.headquarters&&i.headquarters.toLowerCase().includes(t),m=!r||(parseFloat(i.dividendYield)||0)>=r;return d&&p&&u&&m});const[s,n]=o.split("-");B.sort((i,d)=>{let p=i[s],u=d[s];if(typeof p=="string"){const y=(p||"").localeCompare(u||"");return n==="asc"?y:-y}const m=parseFloat(p)||0,c=parseFloat(u)||0;return n==="asc"?m-c:c-m}),L=1,te(),ae()}function te(){if(!O){console.error("❌ tableBody não encontrado!");return}O.innerHTML="";const e=(L-1)*ye,a=e+ye;B.slice(e,a).forEach((r,o)=>{const s=G.has(r.symbol),n=l(r.symbol),i=document.createElement("tr");i.innerHTML=`
      <td>
        <input type="checkbox" class="row-checkbox" data-symbol="${n}" 
          ${s?"checked":""}>
      </td>
      <td class="col-index">${e+o+1}</td>
      <td><strong>${l(r.symbol)}</strong></td>
      <td>${l(r.name||"N/A")}</td>
      <td>${l(r.sectorName||r.sector||"N/A")}</td>
      <td>${ce(r.marketCap)}</td>
      <td>${l(r.subIndustry||r.industry||"N/A")}</td>
      <td>${l(r.headquarters||"N/A")}</td>
      <td>${Te(r)}</td>
    `;const d=i.querySelector(".row-checkbox");d.addEventListener("change",()=>{d.checked?G.add(r.symbol):G.delete(r.symbol),ae(),Ee()}),O.appendChild(i)}),Ee(),da()}function Ee(){if(!R||!O)return;const e=O.querySelectorAll(".row-checkbox"),a=Array.from(e).filter(t=>t.checked).length;R.checked=e.length>0&&a===e.length,R.indeterminate=a>0&&a<e.length}function da(){if(!j)return;j.innerHTML="";const e=Math.ceil(B.length/ye),a=document.createElement("button");a.textContent="Anterior",a.disabled=L===1,a.addEventListener("click",()=>{L>1&&(L--,te())}),j.appendChild(a);const t=document.createElement("span");t.textContent=`Página ${L} de ${e}`,j.appendChild(t);const r=document.createElement("button");r.textContent="Próxima",r.disabled=L===e,r.addEventListener("click",()=>{L<e&&(L++,te())}),j.appendChild(r)}function ae(){if(!H)return;const e=B.length,a=G.size,t=B.filter(o=>Number(o.dividendYield)>0),r=t.length>0?(t.reduce((o,s)=>o+Number(s.dividendYield),0)/t.length).toFixed(2):"0.00";H.innerHTML=`Total: ${e} | Selecionadas: ${a} | Yield Médio (pagadoras): ${r}%`}async function Ue(){const e=document.getElementById("stock-of-day-view");if(e){e.innerHTML=`
    <div class="stock-of-day-loading">
      <div class="loading-spinner"></div>
      <p>Analisando o mercado... selecionando a melhor oportunidade de hoje</p>
    </div>
  `;try{if(M.length===0&&await Ve(),M.length===0){e.innerHTML=`
        <div class="stock-of-day-error">
          <h3>⚠️ Dados indisponíveis</h3>
          <p>Não foi possível carregar as empresas do S&P 500. Verifique a conexão com o servidor.</p>
          <button class="retry-btn" onclick="loadStockOfDay()">Tentar novamente</button>
        </div>
      `;return}const a=new Date().toISOString().slice(0,10),t=ga(a);if(t){De(e,t);return}const r=await la();r.primary&&fa(a,r),De(e,r)}catch(a){console.error("Erro ao carregar Ação do Dia:",a),e.innerHTML=`
      <div class="stock-of-day-error">
        <h3>⚠️ Indisponível no momento</h3>
        <p>Não foi possível gerar a análise. Tente novamente mais tarde.</p>
        <button class="retry-btn" onclick="loadStockOfDay()">Tentar novamente</button>
      </div>
    `}}}function la(){return new Promise(e=>{setTimeout(()=>{const a=new Date().toISOString().slice(0,10),t=pa(a),r=M.filter(d=>d.marketCap&&d.marketCap>1e9).map(d=>{const p=ma(d),u=ua(d.sector),m=(d.dividendYield||0)>2?10:0,c=Math.min(20,Math.log10(d.marketCap/1e9)*5),y=va(d),x=p+u+m+c+y;return{...d,score:Math.round(x*100)/100,breakdown:{technical:p,sector:u,dividend:m,liquidity:Math.round(c),volatility:Math.round(y)},rationale:ya(d,p,u,m)}}).sort((d,p)=>p.score-d.score);if(r.length===0){e({date:a,primary:null,alternatives:[],marketContext:Ae(),generatedAt:new Date().toISOString()});return}const o=r.slice(0,Math.min(10,r.length)),s=t%o.length,n=o[s],i=o.filter((d,p)=>p!==s).slice(0,3);e({date:a,primary:n,alternatives:i,marketContext:Ae(),generatedAt:new Date().toISOString()})},100)})}function pa(e){let a=0;for(let t=0;t<e.length;t++)a=(a<<5)-a+e.charCodeAt(t),a|=0;return Math.abs(a)}function ma(e){let a=50;const t=e.dividendYield||0;t>4?a+=15:t>2?a+=8:t>0&&(a+=3);const r=e.marketCap||0;r>5e11?a+=10:r>1e11?a+=7:r>5e10?a+=5:r>1e10&&(a+=3);const o=(e.subIndustry||"").toLowerCase();["software","semiconductors","biotechnology","cloud","ai","cybersecurity","renewable"].some(n=>o.includes(n))&&(a+=12);const s=(e.name||"").toLowerCase();return["inc.","corporation","technologies","systems","solutions"].some(n=>s.includes(n))&&(a+=3),Math.min(90,a)}function ua(e){return{"information-technology":15,"health-care":8,"consumer-discretionary":5,"communication-services":7,industrials:5,financials:3,materials:2,energy:0,utilities:-2,"real-estate":-3,"consumer-staples":1}[e]||0}function va(e){const a=e.marketCap||0;return a>2e11?8:a>5e10?12:a>1e10?15:18}function ya(e,a,t,r){const o=[];return a>60&&o.push("Fundamentos técnicos sólidos"),t>10&&o.push(`Setor em momento favorável (${e.sectorName})`),r&&o.push(`Dividend yield atrativo (${(e.dividendYield||0).toFixed(1)}%)`),e.marketCap>1e11&&o.push("Grande capitalização — liquidez e estabilidade"),o.length===0&&o.push("Equilíbrio entre risco e retorno"),o.join(" • ")}function Ae(){const e=Math.random()*30+10;return e<15?{level:"Calmo",description:"Baixa volatilidade - ambiente propício para acumulação",class:"calm"}:e<25?{level:"Moderado",description:"Volatilidade normal - seleção seletiva recomendada",class:"moderate"}:{level:"Elevado",description:"Alta volatilidade - foco em qualidade e liquidez",class:"elevated"}}function ga(e){try{const a=localStorage.getItem("sp500-stock-of-day");if(!a)return null;const t=JSON.parse(a);return t.date===e&&t.primary?t:null}catch{return null}}function fa(e,a){try{localStorage.setItem("sp500-stock-of-day",JSON.stringify(a))}catch{}}function De(e,a){const{primary:t,alternatives:r,marketContext:o,generatedAt:s}=a;if(!t){e.innerHTML=`
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
          <span class="market-context ${o.class}">${o.level}</span>
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
            <span class="metric-value">${ce(t.marketCap)}</span>
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
          ${r.map((n,i)=>`
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
        <p class="generated-at">Gerado em ${new Date(s).toLocaleTimeString("pt-BR")} • Baseado em ${M.length} empresas do S&P 500</p>
      </footer>
    </div>
  `}function ha(e){const a=e.toUpperCase(),t=J.get(a);if(t&&t.triggered){confirm(`${e}: alerta já disparado. Remover?`)&&ka(a);return}const r=prompt(`Alerta de preço para ${e}:
Digite o preço alvo (ex: 150.25):`,t?t.target.toFixed(2):"");if(!r)return;const o=parseFloat(r);if(isNaN(o)||o<=0){alert("Preço inválido");return}const s=confirm(`Alertar quando o preço estiver ACIMA deste valor?
(OK = acima, Cancelar = abaixo)`)?"above":"below";ba(a,o,s)}function ba(e,a,t){return!e||typeof a!="number"||!["above","below"].includes(t)?!1:(J.set(e.toUpperCase(),{target:a,direction:t,triggered:!1}),de(),!0)}function ka(e){J.delete(e.toUpperCase()),de()}window.loadStockOfDay=Ue;window.openCompanyDetails=ot;window.setPriceAlertPrompt=ha;async function xa(){const e=[];for(const[a,t]of J)if(!t.triggered)try{const r=await Ie(a),o=r[r.length-1],s=o?Number(o.close):NaN;if(!Number.isFinite(s))continue;(t.direction==="above"&&s>=t.target||t.direction==="below"&&s<=t.target)&&(t.triggered=!0,t.triggeredAt=new Date().toISOString(),t.triggeredPrice=s,e.push(`${a} ($${s.toFixed(2)})`))}catch(r){console.error(`Erro ao verificar ${a}:`,r)}return e.length>0&&(de(),window.alert(`🔔 Alerta(s) de preço atingido(s): ${e.join(", ")}`)),e}async function wa(){J.size!==0&&setInterval(async()=>{await xa(),de()},6e4)}function Ca(e){return`"${(e==null?"":String(e)).replace(/"/g,'""')}"`}function $a(){const e=["#","Símbolo","Empresa","Setor","Market Cap","Subindústria","Sede","Dividend Yield"],a=B.map((r,o)=>[o+1,r.symbol,r.name,r.sectorName,ce(r.marketCap),r.subIndustry||r.industry||"N/A",r.headquarters||"N/A",Te(r)]),t=[e,...a].map(r=>r.map(Ca).join(",")).join(`
`);Ge(t,"sp500-export.csv","text/csv")}function Sa(){const e=JSON.stringify(B,null,2);Ge(e,"sp500-export.json","application/json")}function Ge(e,a,t){const r=new Blob([e],{type:t}),o=URL.createObjectURL(r),s=document.createElement("a");s.href=o,s.download=a,document.body.appendChild(s),s.click(),document.body.removeChild(s),URL.revokeObjectURL(o)}
