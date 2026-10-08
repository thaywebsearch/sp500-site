(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))a(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const s of r.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&a(s)}).observe(document,{childList:!0,subtree:!0});function o(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function a(i){if(i.ep)return;i.ep=!0;const r=o(i);fetch(i.href,r)}})();const le=window.location.hostname,W=le==="localhost"||le==="127.0.0.1"?"http://localhost:5001":"https://sp500-site-production.up.railway.app",ie=[{id:"communication-services",name:"Communication Services"},{id:"consumer-discretionary",name:"Consumer Discretionary"},{id:"consumer-staples",name:"Consumer Staples"},{id:"energy",name:"Energy"},{id:"financials",name:"Financials"},{id:"health-care",name:"Health Care"},{id:"industrials",name:"Industrials"},{id:"information-technology",name:"Information Technology"},{id:"materials",name:"Materials"},{id:"real-estate",name:"Real Estate"},{id:"utilities",name:"Utilities"}];window.API_BASE_URL=W;window.SECTORS=ie;console.log("✅ Configuração global carregada:",W);let Y=[],u=null,te=0,se="",fe="alfabética";async function Le(){try{const e=document.getElementById("daily-curiosity-view");if(!e){console.error("Elemento daily-curiosity-view não encontrado");return}e.innerHTML='<div class="curiosidade-loading">Carregando curiosidade...</div>';const t=await fetch(`${W}/api/curiosidades`);if(!t.ok){console.error(`Erro ao buscar curiosidades: ${t.status}`),e.innerHTML=`<div class="curiosidade-erro">Erro ao carregar curiosidades (${t.status})</div>`;return}const o=await t.json();if(!o.sucesso||!o.dados||!o.dados.curiosidades){console.error("Dados de curiosidades inválidos:",o),e.innerHTML='<div class="curiosidade-erro">Formato de dados inválido</div>';return}if(Y=o.dados.curiosidades,te=o.dados.total||Y.length,se=o.dados.proximaEmpresa||"",fe=o.dados.ordem||"alfabética",Y.length===0){e.innerHTML='<div class="curiosidade-erro">Nenhuma curiosidade disponível</div>';return}De(),Te()}catch(e){console.error("Erro ao carregar curiosidades:",e);const t=document.getElementById("daily-curiosity-view");t&&(t.innerHTML=`<div class="curiosidade-erro">Erro ao carregar: ${e.message}</div>`)}}function De(){if(Y.length===0)return;const e=new Date,t=new Date(e.getFullYear(),e.getMonth(),e.getDate()),a=Math.floor(t.getTime()/864e5)%Y.length;u=Y[a],console.log(`Curiosidade do dia: ${u==null?void 0:u.empresa}`)}function Te(){const e=document.getElementById("daily-curiosity-view");if(!e||!u){console.error("View ou curiosidade não encontrada");return}Fe();const t=`
    <div class="curiosidade-container">
      <div class="curiosidade-header">
        <h1>🌟 Curiosidade do Dia</h1>
        <p class="curiosidade-data">${Ne()}</p>
      </div>

      <div class="curiosidade-card">
        <div class="curiosidade-simbolo">
          <span class="simbolo-badge">${u.simbolo}</span>
          <span class="posicao-badge">#${u.posicao}</span>
        </div>

        <div class="curiosidade-conteudo">
          <h2 class="curiosidade-empresa">${u.empresa}</h2>
          <p class="curiosidade-setor">
            <strong>Setor:</strong> ${u.setor||"N/A"}
          </p>

          <div class="curiosidade-titulo">
            <h3>${u.titulo}</h3>
          </div>

          <div class="curiosidade-descricao">
            <p>${u.descricao}</p>
          </div>

          ${u.fatos&&u.fatos.length>0?`
            <div class="curiosidade-fatos">
              <h4>📊 Fatos Interessantes:</h4>
              <ul>
                ${u.fatos.map(o=>`<li>${o}</li>`).join("")}
              </ul>
            </div>
          `:""}

          ${u.dividendYield?`
            <div class="curiosidade-dados">
              <p><strong>Dividend Yield:</strong> ${u.dividendYield}</p>
            </div>
          `:""}

          ${u.marketCap?`
            <div class="curiosidade-dados">
              <p><strong>Market Cap:</strong> ${u.marketCap}</p>
            </div>
          `:""}

          ${u.insight?`
            <div class="curiosidade-insight">
              <p><em>💡 ${u.insight}</em></p>
            </div>
          `:""}

          ${te>0?`
            <div class="curiosidade-progresso">
              <div class="progresso-texto">
                <span>Rotatividade diária · ordem ${fe}</span>
                <span>Empresa ${u.posicao} de ${te}</span>
              </div>
              <div class="progresso-barra">
                <div class="progresso-preenchido" style="width: ${Number(u.posicao)/te*100}%;"></div>
              </div>
            </div>
          `:""}

          <div class="curiosidade-acoes">
            <button class="btn-compartilhar" onclick="compartilharCuriosidade()">
              📤 Compartilhar
            </button>
            ${u.link?`
              <a href="${u.link}" target="_blank" class="btn-saibamais">
                🔗 Saiba Mais
              </a>
            `:""}
          </div>
        </div>
      </div>

      <div class="curiosidade-footer">
        <p>Curiosidade de ${u.empresa} - Atualizado em ${u.dataAdicao||"N/A"}</p>
        ${se?`<p class="curiosidade-proxima">⏭️ Amanhã: ${se}</p>`:""}
        <p class="curiosidade-dica">💡 Uma empresa diferente a cada dia, em ordem alfabética do S&P 500!</p>
      </div>
    </div>
  `;e.innerHTML=t,window.compartilharCuriosidade=Ie}function Fe(){if(document.getElementById("curiosidade-styles"))return;const e=document.createElement("style");e.id="curiosidade-styles",e.textContent=`
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
  `,document.head.appendChild(e)}function Ie(){if(!u)return;const e=(u.fatos||[]).map(o=>`• ${o}`).join(`
`),t=`🌟 Curiosidade do Dia: ${u.empresa} (${u.simbolo})

${u.descricao}

${e}

💡 ${u.insight||""}`;navigator.share?navigator.share({title:`Curiosidade do Dia - ${u.empresa}`,text:t,url:window.location.href}).catch(o=>console.log("Erro ao compartilhar:",o)):navigator.clipboard.writeText(t).then(()=>{alert("Curiosidade copiada para a área de transferência!")}).catch(o=>{alert("Erro ao copiar: "+o)})}function Ne(){const e=new Date,t={weekday:"long",year:"numeric",month:"long",day:"numeric"};return e.toLocaleDateString("pt-BR",t)}function X(e){const t=Number(e);return!t||Number.isNaN(t)?"N/A":t>=1e12?`$${(t/1e12).toFixed(3)}T`:t>=1e9?`$${(t/1e9).toFixed(2)}B`:t>=1e6?`$${(t/1e6).toFixed(2)}M`:`$${t.toLocaleString("en-US")}`}function v(e){return e?String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;"):""}const Be=new Set(["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming","D.C."]);function he(e){if(!e)return"Desconhecido";const t=String(e).split(",").map(a=>a.trim().replace(/\[\d+\]$/,"")),o=t[t.length-1];return!o||o.toLowerCase()==="none"?"Desconhecido":Be.has(o)?"United States":o}async function ze(e){try{const t=await fetch(`/api/historico/${e}`);if(!t.ok)throw new Error(`Erro ao buscar histórico de ${e}`);return(await t.json()).registros||[]}catch(t){return console.error(`Erro ao buscar histórico de ${e}:`,t),[]}}const Q=760,ae=320,C={top:28,right:28,bottom:44,left:68};function Pe(e){if(!e)return"";const[t,o,a]=e.split("-");return`${a}/${o}/${t.slice(2)}`}function ne(e){return Number.isFinite(e)?e>=100?`$${e.toFixed(0)}`:`$${e.toFixed(2)}`:"—"}function He(e){const t=e.map(f=>f.close),o=Math.min(...t),a=Math.max(...t),i=a-o||1,r=o-i*.08,s=a+i*.08,n=e.length,c=f=>C.left+f/(n-1)*(Q-C.left-C.right),d=f=>C.top+(1-(f-r)/(s-r))*(ae-C.top-C.bottom);let l=`<svg viewBox="0 0 ${Q} ${ae}" style="width:100%;height:auto;display:block;background:var(--plot-bg);border-radius:8px">`;const g=5;for(let f=0;f<=g;f++){const x=r+(s-r)*f/g,w=d(x);l+=`<line x1="${C.left}" y1="${w.toFixed(1)}" x2="${Q-C.right}" y2="${w.toFixed(1)}" stroke="var(--chart-axis)" stroke-width="1"/>`,l+=`<text x="${C.left-8}" y="${(w+4).toFixed(1)}" text-anchor="end" font-size="11" fill="var(--chart-label)">${ne(x)}</text>`}const m=[];for(let f=0;f<=4;f++)m.push(Math.round((n-1)*f/4));m.forEach(f=>{const x=c(f);l+=`<text x="${x.toFixed(1)}" y="${ae-C.bottom+18}" text-anchor="middle" font-size="11" fill="var(--chart-label)">${Pe(e[f].data)}</text>`});const h=e.map((f,x)=>`${c(x).toFixed(1)},${d(f.close).toFixed(1)}`).join(" "),$=`${C.left},${d(r).toFixed(1)} `+h+` ${c(n-1).toFixed(1)},${d(r).toFixed(1)}`;l+=`<polygon points="${$}" fill="rgba(0, 212, 255, 0.08)"/>`,l+=`<polyline points="${h}" fill="none" stroke="var(--accent-cyan)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;const k=e[n-1],b=d(k.close);return l+=`<circle cx="${c(n-1).toFixed(1)}" cy="${b.toFixed(1)}" r="4" fill="var(--accent-cyan)"/>`,l+=`<text x="${Q-C.right}" y="${(b-10).toFixed(1)}" text-anchor="end" font-size="12" font-weight="700" fill="var(--chart-text)">${ne(k.close)}</text>`,l+="</svg>",l}async function Oe(e,t){var i;(i=document.querySelector(".modal-overlay"))==null||i.remove();const o=document.createElement("div");o.className="modal-overlay";const a=()=>o.remove();o.addEventListener("click",r=>{r.target===o&&a()}),document.addEventListener("keydown",r=>{r.key==="Escape"&&a()}),o.innerHTML=`
    <div class="modal" role="dialog" aria-label="Histórico de ${v(e)}">
      <div class="modal-header">
        <h2 class="modal-title">
          📈 ${v(e)}
          <span class="modal-subtitle">${v(t||"")}</span>
        </h2>
        <button class="modal-close" aria-label="Fechar">✕</button>
      </div>
      <div class="modal-body" id="price-chart-body">
        <p class="modal-loading">Carregando histórico...</p>
      </div>
    </div>
  `,document.body.appendChild(o),o.querySelector(".modal-close").addEventListener("click",a);try{const r=await ze(e),s=o.querySelector("#price-chart-body");if(!r||r.length===0){s.innerHTML=`<p class="modal-error">Nenhum dado de preço disponível para ${v(e)}.</p>`;return}const n=r[0].close,c=r[r.length-1].close,d=(c-n)/n*100,l=d>=0,g=l?"positive":"negative";s.innerHTML=`
      <div class="price-stats">
        <div class="price-stat">
          <span class="price-stat-label">Último</span>
          <strong>${ne(c)}</strong>
        </div>
        <div class="price-stat">
          <span class="price-stat-label">Variação (2a)</span>
          <strong class="${g}">${l?"+":""}${d.toFixed(2)}%</strong>
        </div>
        <div class="price-stat">
          <span class="price-stat-label">Período</span>
          <strong>${r.length} pregões</strong>
        </div>
      </div>
      ${He(r)}
    `}catch(r){console.error(`Erro ao buscar histórico de ${e}:`,r);const s=o.querySelector("#price-chart-body");s.innerHTML=`<p class="modal-error">Erro ao carregar o histórico de ${v(e)}. Verifique se o backend está online.</p>`}}function M(e,t){return`
    <div class="company-detail">
      <span class="company-detail-label">${e}</span>
      <strong class="company-detail-value">${t}</strong>
    </div>
  `}function Ye(e){var r;(r=document.querySelector(".modal-overlay"))==null||r.remove();const t=document.createElement("div");t.className="modal-overlay";const o=()=>t.remove();t.addEventListener("click",s=>{s.target===t&&o()}),document.addEventListener("keydown",s=>{s.key==="Escape"&&o()});const a=e.dividendYield!==null&&e.dividendYield!==void 0?`${e.dividendYield.toFixed(2)}%`:"—",i=X(e.marketCap);t.innerHTML=`
    <div class="modal" role="dialog" aria-label="Detalhes de ${v(e.symbol)}">
      <div class="modal-header">
        <h2 class="modal-title">
          💼 ${v(e.symbol)}
          <span class="modal-subtitle">${v(e.name||"")}</span>
        </h2>
        <button class="modal-close" aria-label="Fechar">✕</button>
      </div>
      <div class="modal-body">
        <div class="company-details-grid">
          ${M("Empresa",v(e.name||"N/A"))}
          ${M("Setor",v(e.sectorName||e.sector||"N/A"))}
          ${M("Subindústria",v(e.subIndustry||"N/A"))}
          ${M("Sede",v(e.headquarters||"N/A"))}
          ${M("Market Cap",i)}
          ${M("Classificação",v(e.marketCapClassification||"N/A"))}
          ${M("Div. Yield",a)}
          ${M("Paga dividendos",e.hasDividend?v(e.hasDividend):"—")}
          ${M("Data de inclusão",v(e.dateAdded||"N/A"))}
          ${M("CIK",e.cik?v(String(e.cik)):"N/A")}
          ${M("Fundação",v(e.founded||"N/A"))}
        </div>
        <div class="modal-footer">
          <button class="modal-action" id="details-chart-btn">📈 Ver histórico de preços</button>
        </div>
      </div>
    </div>
  `,document.body.appendChild(t),t.querySelector(".modal-close").addEventListener("click",o),t.querySelector("#details-chart-btn").addEventListener("click",()=>{Oe(e.symbol,e.name)})}async function Re(){const e=document.getElementById("treemap-view");if(e){e.style.display="flex",e.style.flexDirection="column",e.style.height="100%",e.style.width="100%",e.style.margin="0",e.style.padding="0",e.style.background="var(--bg-primary)",e.innerHTML='<div style="display:flex;align-items:center;justify-content:center;height:100%;width:100%;font-size:14px;color:var(--text-secondary)">Carregando mapa de setores...</div>';try{let s=function(d,l){const g=d/l*100;return g>=80?"#ff5252":g>=60?"#ff9800":g>=40?"#ffeb3b":g>=20?"#8bc34a":"#4caf50"};var t=s;const i=(await(await fetch(`${window.API_BASE_URL}/api/setores`)).json()).setores||[],r=await Promise.all(i.map(async d=>{var f;const g=await(await fetch(`${window.API_BASE_URL}/api/setor/${d}`)).json(),m=window.SECTORS.find(x=>x.id===d),h=((f=g.dados)==null?void 0:f.companies)||[],$=h.reduce((x,w)=>x+(w.marketCap||0),0),k=h.length>0?h.reduce((x,w)=>x+(w.dividendYield||0),0)/h.length:0,b=h.filter(x=>x.hasDividend==="Sim").length;return{id:d,name:(m==null?void 0:m.name)||d,cap:($/1e9).toFixed(1),companies:h.length,avgDiv:parseFloat(k.toFixed(2)),withDiv:b,topCompany:h.length>0?h[0].symbol:"N/A"}})),n=Math.max(...r.map(d=>parseFloat(d.cap)));let c=`
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
    `;r.forEach(d=>{const l=s(parseFloat(d.cap),n),g=(parseFloat(d.cap)/n*100).toFixed(1),m=["consumer-staples","communication-services","consumer-discretionary","energy","financials","health-care","industrials","information-technology","materials","real-estate","utilities"].includes(d.id),h=m?new URL(`sectors/${d.id}.html`,document.baseURI).href:"#";c+=`
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
        onmouseover="${m?`this.style.borderColor='${l}';this.style.background='rgba(${parseInt(l.slice(1,3),16)},${parseInt(l.slice(3,5),16)},${parseInt(l.slice(5,7),16)},0.05)';this.style.transform='translateY(-4px)';this.style.boxShadow='0 12px 32px ${l}22'`:""}"
        onmouseout="${m?"this.style.borderColor='var(--border)';this.style.background='var(--bg-secondary)';this.style.transform='translateY(0)';this.style.boxShadow='none'":""}"
        onclick="${m?`navigateToSector('${h}', '${d.id}')`:`alert('🔒 O setor \\"${d.name}\\" ainda está em desenvolvimento.\\n\\nApenas Consumer Staples, Communication Services, Consumer Discretionary, Energy, Financials, Health Care, Industrials, Information Technology, Materials, Real Estate e Utilities estão disponíveis por enquanto!')`}"
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
              ">${d.name}</div>
              <div style="
                font-size: 12px;
                color: var(--text-secondary);
              ">${d.companies} empresas</div>
            </div>
            <div style="
              background: ${l}22;
              border: 1px solid ${l}44;
              padding: 8px 12px;
              border-radius: 6px;
              font-size: 13px;
              font-weight: 700;
              color: ${l};
              text-align: center;
            ">
              ${g}%
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
                width: ${g}%;
                height: 100%;
                background: linear-gradient(90deg, ${l}44, ${l});
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
                color: ${l};
              ">$${d.cap}B</div>
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
              ">${d.topCompany}</div>
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
              ">${d.avgDiv.toFixed(2)}%</div>
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
              ">${d.withDiv}/${d.companies}</div>
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
      `}),c+=`
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
    `,e.innerHTML=c}catch(o){console.error("Erro ao carregar treemap:",o),e.innerHTML='<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--accent-red)">Erro ao carregar mapa de setores</div>'}}}function qe(e,t){if(e==="#"){alert(`🔒 O setor "${t}" ainda está em desenvolvimento.

Apenas Consumer Staples, Communication Services, Consumer Discretionary, Energy, Financials, Health Care, Industrials, Information Technology, Materials, Real Estate e Utilities estão disponíveis por enquanto!`);return}window.open(e,"_blank")}window.navigateToSector=qe;async function je(){var t;const e=document.getElementById("heatmap-view");if(e){e.style.display="flex",e.style.flexDirection="column",e.style.height="100%",e.style.width="100%",e.style.padding="40px",e.style.boxSizing="border-box",e.style.background="var(--bg-primary)",e.style.overflowY="auto",e.innerHTML='<div style="text-align:center;color:var(--text-secondary)">Carregando heatmap...</div>';try{const i=(await(await fetch(`${window.API_BASE_URL}/api/setores`)).json()).setores||[];let r=`
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
    `;for(const s of i){const c=await(await fetch(`${window.API_BASE_URL}/api/setor/${s}`)).json(),d=window.SECTORS.find(m=>m.id===s),l=((t=c.dados)==null?void 0:t.companies)||[];if(l.length===0)continue;const g=l.sort((m,h)=>(h.marketCap||0)-(m.marketCap||0)).slice(0,4);r+=`
        <div style="margin-bottom: 40px;">
          <h3 style="
            font-size: 16px;
            margin: 0 0 20px 0;
            color: var(--text-primary);
            font-weight: 600;
          ">${(d==null?void 0:d.name)||s}</h3>

          <div style="
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 16px;
          ">
      `,g.forEach((m,h)=>{const $=(m.marketCap/1e9).toFixed(2),k=(m.dividendYield||0).toFixed(2);let b="#4caf50";$>500?b="#ff5252":$>200?b="#ff9800":$>100?b="#ffeb3b":$>50&&(b="#8bc34a"),r+=`
          <div style="
            background: linear-gradient(135deg, rgba(0, 212, 255, 0.05) 0%, rgba(0, 230, 118, 0.02) 100%);
            border: 1px solid var(--border);
            border-radius: 8px;
            padding: 16px;
            transition: all 0.3s ease;
          "
          onmouseover="this.style.borderColor='${b}';this.style.background='linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(0, 230, 118, 0.05) 100%)';this.style.transform='translateY(-2px)'"
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
              ">${m.symbol}</div>
              <div style="
                font-size: 11px;
                background: ${b}22;
                color: ${b};
                padding: 4px 8px;
                border-radius: 4px;
                font-weight: 600;
              ">
                #${h+1}
              </div>
            </div>

            <div style="
              font-size: 12px;
              color: var(--text-secondary);
              margin-bottom: 12px;
              word-break: break-word;
            ">
              ${m.name}
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
                  color: ${b};
                ">$${$}B</div>
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
    `,e.innerHTML=r}catch(o){console.error("Erro ao carregar heatmap:",o),e.innerHTML=`
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
        ">${o.message}</div>
      </div>
    `}}}const Ue={Energy:"#FF6B6B",Materials:"#C92A2A",Industrials:"#FFA94D","Consumer Discretionary":"#FFD43B","Consumer Staples":"#A9E34B","Health Care":"#51CF66",Financials:"#40C057","Information Technology":"#339AF0","Communication Services":"#748FFC",Utilities:"#9775FA","Real Estate":"#DA77F2"};function ve(e){return Ue[e]||"#808080"}function pe(e){if(!e)return 0;if(typeof e=="number")return e;const o=String(e).toUpperCase().trim().replace(/[$€¥₹]/g,"").trim();return o.includes("T")?parseFloat(o.replace("T",""))*1e12:o.includes("B")?parseFloat(o.replace("B",""))*1e9:o.includes("M")?parseFloat(o.replace("M",""))*1e6:parseFloat(o)||0}function Ve(e){if(!e)return 0;if(typeof e=="number")return e;const t=String(e).trim();return parseFloat(t.replace("%",""))||0}function _e(e,t){const o=document.getElementById(t);if(!o){console.error(`❌ Contentor ${t} não encontrado!`);return}console.log(`📊 Renderizando Bubble Chart com ${e.length} empresas...`),o.innerHTML="";const a=e.filter(p=>pe(p.marketCap)>0&&p.sectorName).map((p,I)=>({symbol:p.symbol,name:p.name,sector:p.sectorName,marketCap:pe(p.marketCap),dividendYield:Ve(p.dividendYield),index:I}));if(console.log(`✅ ${a.length} empresas com dados válidos`),a.length===0){o.innerHTML="<p>Sem dados disponíveis para o gráfico de bolhas.</p>";return}const i={top:40,right:40,bottom:60,left:60},r=Math.max(window.innerWidth-100,800)-i.left-i.right,s=600-i.top-i.bottom,n=Math.min(...a.map(p=>p.dividendYield)),c=Math.max(...a.map(p=>p.dividendYield)),d=Math.min(...a.map(p=>p.marketCap)),l=Math.max(...a.map(p=>p.marketCap)),g=p=>s-(p-n)/(c-n||1)*s,m=p=>5+(p-d)/(l-d||1)*50,h=(()=>{let p=42;return()=>(p=(p*9301+49297)%233280,p/233280)})(),$=a.map(()=>h()*r),k=document.createElementNS("http://www.w3.org/2000/svg","svg");k.setAttribute("width",r+i.left+i.right),k.setAttribute("height",s+i.top+i.bottom),k.style.cssText="display: block; margin: 20px auto; background: #fff;";const b=document.createElementNS("http://www.w3.org/2000/svg","g");b.setAttribute("transform",`translate(${i.left},${i.top})`);for(let p=0;p<=10;p++){const I=p/10*s,Z=n+p/10*(c-n),E=document.createElementNS("http://www.w3.org/2000/svg","line");E.setAttribute("x1",0),E.setAttribute("y1",I),E.setAttribute("x2",r),E.setAttribute("y2",I),E.setAttribute("stroke","#e0e0e0"),E.setAttribute("stroke-width","1"),E.setAttribute("stroke-dasharray","4"),b.appendChild(E);const A=document.createElementNS("http://www.w3.org/2000/svg","text");A.setAttribute("x",-10),A.setAttribute("y",I+5),A.setAttribute("text-anchor","end"),A.setAttribute("font-size","12"),A.setAttribute("fill","#666"),A.textContent=Z.toFixed(1)+"%",b.appendChild(A)}const f=document.createElementNS("http://www.w3.org/2000/svg","line");f.setAttribute("x1",0),f.setAttribute("y1",0),f.setAttribute("x2",0),f.setAttribute("y2",s),f.setAttribute("stroke","#333"),f.setAttribute("stroke-width","2"),b.appendChild(f);const x=document.createElementNS("http://www.w3.org/2000/svg","text");x.setAttribute("transform","rotate(-90)"),x.setAttribute("y",-40),x.setAttribute("x",-s/2),x.setAttribute("text-anchor","middle"),x.setAttribute("font-size","14"),x.setAttribute("font-weight","bold"),x.setAttribute("fill","#333"),x.textContent="💵 Dividend Yield (%)",b.appendChild(x);const w=document.createElementNS("http://www.w3.org/2000/svg","line");w.setAttribute("x1",0),w.setAttribute("y1",s),w.setAttribute("x2",r),w.setAttribute("y2",s),w.setAttribute("stroke","#333"),w.setAttribute("stroke-width","2"),b.appendChild(w);const B=document.createElementNS("http://www.w3.org/2000/svg","text");B.setAttribute("x",r/2),B.setAttribute("y",s+45),B.setAttribute("text-anchor","middle"),B.setAttribute("font-size","14"),B.setAttribute("font-weight","bold"),B.setAttribute("fill","#333"),B.textContent="📊 Distribuição Aleatória (cada bolha = empresa)",b.appendChild(B),a.forEach((p,I)=>{const Z=$[I],E=g(p.dividendYield),A=m(p.marketCap),Me=ve(p.sector),y=document.createElementNS("http://www.w3.org/2000/svg","circle");if(y.setAttribute("cx",Z),y.setAttribute("cy",E),y.setAttribute("r",A),y.setAttribute("fill",Me),y.setAttribute("opacity","0.7"),y.setAttribute("stroke","#fff"),y.setAttribute("stroke-width","2"),y.style.cursor="pointer",y.style.transition="all 0.3s ease",y.addEventListener("mouseover",S=>{y.setAttribute("opacity","1"),y.setAttribute("stroke-width","3"),Je(S,p)}),y.addEventListener("mouseout",()=>{y.setAttribute("opacity","0.7"),y.setAttribute("stroke-width","2"),be()}),b.appendChild(y),A>15){const S=document.createElementNS("http://www.w3.org/2000/svg","text");S.setAttribute("x",Z),S.setAttribute("y",E+5),S.setAttribute("text-anchor","middle"),S.setAttribute("font-size",Math.max(10,A/2)),S.setAttribute("font-weight","bold"),S.setAttribute("fill","#fff"),S.setAttribute("pointer-events","none"),S.textContent=p.symbol.substring(0,3),b.appendChild(S)}}),k.appendChild(b),o.appendChild(k),We(o,a),console.log("✅ Bubble Chart renderizado com sucesso!")}function We(e,t){const o=document.createElement("div");o.style.cssText=`
    margin: 30px auto;
    max-width: 800px;
    padding: 20px;
    background: #f9f9f9;
    border-radius: 8px;
    border: 1px solid #ddd;
  `;const a=document.createElement("h3");a.textContent="🫧 Como ler o gráfico",a.style.cssText="margin: 0 0 12px 0; color: #333;",o.appendChild(a);const i=document.createElement("div");i.style.cssText="margin-bottom: 16px; font-size: 13px; color: #666; line-height: 1.8;",i.innerHTML=`
    <div><strong>Tamanho da bolha:</strong> Market Cap da empresa (quanto maior, mais valiosa)</div>
    <div><strong>Eixo Y (vertical):</strong> Dividend Yield (mais acima = maior dividendo)</div>
    <div><strong>Eixo X (horizontal):</strong> posição aleatória, apenas para facilitar a visualização</div>
    <div><strong>Cor:</strong> setor da empresa</div>
  `,o.appendChild(i);const r=document.createElement("div");r.textContent="Setores",r.style.cssText="font-size: 13px; font-weight: 600; color: #333; margin-bottom: 8px;",o.appendChild(r);const s=new Set(t.map(c=>c.sector)),n=document.createElement("div");n.style.cssText="display: flex; flex-wrap: wrap; gap: 12px;",s.forEach(c=>{const d=document.createElement("div");d.style.cssText="display: flex; align-items: center; gap: 6px; font-size: 12px; color: #333;";const l=document.createElement("span");l.style.cssText=`display: inline-block; width: 14px; height: 14px; border-radius: 50%; background: ${ve(c)};`;const g=document.createElement("span");g.textContent=c,d.appendChild(l),d.appendChild(g),n.appendChild(d)}),o.appendChild(n),e.appendChild(o)}let oe=null;function Je(e,t){be();const o=document.createElement("div");o.style.cssText=`
    position: fixed;
    background: rgba(0, 0, 0, 0.85);
    color: #fff;
    padding: 10px 14px;
    border-radius: 6px;
    font-size: 12px;
    line-height: 1.5;
    pointer-events: none;
    z-index: 10000;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    white-space: nowrap;
  `;const a=t.marketCap>=1e12?(t.marketCap/1e12).toFixed(2)+"T":t.marketCap>=1e9?(t.marketCap/1e9).toFixed(2)+"B":(t.marketCap/1e6).toFixed(2)+"M";o.innerHTML=`
    <strong>${t.symbol}</strong> — ${t.name}<br>
    <strong>Setor:</strong> ${t.sector}<br>
    <strong>Market Cap:</strong> $${a}<br>
    <strong>Dividend Yield:</strong> ${t.dividendYield.toFixed(2)}%
  `;const i=e.target.getBoundingClientRect();o.style.left=i.left+10+"px",o.style.top=i.top-10+"px",document.body.appendChild(o),oe=o}function be(){oe&&(oe.remove(),oe=null)}console.log("✅ bubble-chart.js carregado!");const xe="sp500-watchlist",ye="sp500-price-alerts",de=50;function Ge(){try{const e=localStorage.getItem(xe);return e?JSON.parse(e):[]}catch(e){return console.error("Erro ao carregar watchlist:",e),[]}}function Ke(){try{localStorage.setItem(xe,JSON.stringify([...T]))}catch(e){console.error("Erro ao salvar watchlist:",e)}}function Xe(){try{const e=localStorage.getItem(ye);if(!e)return[];const t=JSON.parse(e);return Array.isArray(t)&&t.length>0&&Array.isArray(t[0])?t:Array.isArray(t)&&t.length>0&&typeof t[0]=="object"?t.map(o=>[o.symbol,o]):[]}catch(e){return console.error("Erro ao carregar price alerts:",e),[]}}function ce(){try{const e=Array.from(j.entries());localStorage.setItem(ye,JSON.stringify(e))}catch(e){console.error("Erro ao salvar price alerts:",e)}}function Ze(e,t){let o;return function(...i){const r=()=>{clearTimeout(o),e(...i)};clearTimeout(o),o=setTimeout(r,t)}}let L=[],D=[],F=1,J="dashboard",R=new Set;const T=new Set(Ge()||[]),re=Xe(),j=new Map(re&&re.length>0?re:[]);let N,P,U,V,_,q,z,H,ee;document.addEventListener("DOMContentLoaded",()=>{console.log("🚀 Inicializando dashboard..."),N=document.getElementById("sector-filter"),P=document.getElementById("country-filter"),U=document.getElementById("search-input"),V=document.getElementById("dividend-min"),_=document.getElementById("sort-select"),q=document.getElementById("table-body"),z=document.getElementById("stats"),H=document.getElementById("pagination"),ee=document.getElementById("header-checkbox"),console.log("📍 Elementos encontrados:",{sectorFilter:!!N,tableBody:!!q,statsEl:!!z,paginationEl:!!H});const e=document.querySelectorAll(".nav-tab");console.log(`📌 Encontradas ${e.length} abas`),e.forEach(r=>{r.addEventListener("click",s=>{s.preventDefault();const n=r.getAttribute("data-tab");console.log(`🔀 Navegando para: ${n}`),Qe(n)})}),N&&N.addEventListener("change",O),P&&P.addEventListener("change",O),U&&U.addEventListener("input",Ze(O,300)),V&&V.addEventListener("change",O),_&&_.addEventListener("change",O),ee&&ee.addEventListener("change",()=>{q.querySelectorAll(".row-checkbox").forEach(s=>{s.checked=ee.checked,s.dispatchEvent(new Event("change"))})});const t=document.getElementById("select-all"),o=document.getElementById("deselect-all"),a=document.getElementById("export-csv"),i=document.getElementById("export-json");t&&t.addEventListener("click",()=>{D.forEach(r=>R.add(r.symbol)),G(),K()}),o&&o.addEventListener("click",()=>{R.clear(),G(),K()}),a&&a.addEventListener("click",ft),i&&i.addEventListener("click",ht),console.log("✅ Event listeners registrados"),we(),$e(),ke(),Ee(),gt(),console.log("✅ Dashboard inicializado com sucesso!")});function Qe(e){console.log(`📍 Mudando aba para: ${e}`),J=e,we(),$e()}function we(){console.log(`🎨 Atualizando UI para: ${J}`);const e=document.getElementById("dashboard-view"),t=document.getElementById("treemap-view"),o=document.getElementById("heatmap-view"),a=document.getElementById("bubble-chart-view"),i=document.getElementById("watchlist-view"),r=document.getElementById("stock-of-day-view"),s=document.getElementById("daily-curiosity-view");switch([e,t,o,a,i,r,s].forEach(c=>{c&&(c.style.display="none")}),J){case"dashboard":e&&(e.style.display="block");break;case"stock-of-day":r&&(r.style.display="block",Ae());break;case"daily-curiosity":s&&(s.style.display="block",Le());break;case"treemap":t&&(t.style.display="block",Re());break;case"heatmap":o&&(o.style.display="block",je());break;case"bubble":a&&(a.style.display="block",et());break;case"watchlist":i&&(i.style.display="block",ot());break;default:e&&(e.style.display="block")}}function et(){const e=document.getElementById("bubble-chart-view");if(!e){console.error("❌ bubble-chart-view não encontrado!");return}console.log("📊 Carregando Bubble Chart..."),e.innerHTML='<div style="text-align: center; padding: 40px;"><p>Carregando gráfico de bolhas...</p></div>',_e(L,"bubble-chart-view")}function $e(){document.querySelectorAll(".nav-tab").forEach(t=>{t.classList.remove("active"),t.getAttribute("data-tab")===J&&(t.classList.add("active"),console.log(`✅ Aba ativa: ${J}`))})}async function ke(){console.log("📊 Carregando dados do dashboard..."),z&&(z.textContent="Carregando dados...");try{const e=await fetch(`${W}/api/setores`);if(!e.ok)throw new Error("Erro ao buscar setores");const o=(await e.json()).setores||[];console.log(`🔄 Carregando ${o.length} setores...`);const a=o.map(async r=>{try{const s=await fetch(`${W}/api/setor/${r}`);if(!s.ok)throw new Error(`HTTP ${s.status}`);const n=await s.json(),c=ie.find(l=>l.id===r),d=c?c.name:r;return n.dados&&n.dados.companies&&Array.isArray(n.dados.companies)?{generatedAt:n.dados.generatedAt||null,companies:n.dados.companies.map(l=>({...l,sector:r,sectorName:d}))}:{generatedAt:null,companies:[]}}catch(s){return console.error(`❌ Erro ao carregar ${r}:`,s),{generatedAt:null,companies:[]}}}),i=await Promise.all(a);L=i.flatMap(r=>r.companies),ue(i.map(r=>r.generatedAt).filter(Boolean)),console.log(`✅ ${L.length} empresas carregadas`),N&&(N.innerHTML='<option value="">Todos os Setores</option>',[...new Set(L.map(s=>s.sector))].sort().forEach(s=>{var c;const n=document.createElement("option");n.value=s,n.textContent=((c=ie.find(d=>d.id===s))==null?void 0:c.name)||s,N.appendChild(n)})),P&&(P.innerHTML='<option value="">Todos os Países</option>',[...new Set(L.map(s=>he(s.headquarters)))].sort().forEach(s=>{const n=document.createElement("option");n.value=s,n.textContent=s,P.appendChild(n)})),O(),K()}catch(e){console.error("❌ Erro ao carregar dados:",e),z&&(z.textContent="Erro ao carregar dados. Tente novamente."),ue([])}}function ue(e){const t=document.getElementById("freshness-badge"),o=document.getElementById("freshness-text");if(!o)return;const a=(e||[]).map(c=>new Date(c)).filter(c=>!Number.isNaN(c.getTime()));if(a.length===0){t&&(t.classList.remove("fd-fresh","fd-aging","fd-stale"),t.classList.add("fd-unknown")),o.textContent="Data indisponível";return}const i=new Date(Math.max(...a.map(c=>c.getTime()))),r=Math.floor((Date.now()-i.getTime())/864e5);let s="fd-fresh";r>30?s="fd-stale":r>7&&(s="fd-aging"),t&&(t.classList.remove("fd-fresh","fd-aging","fd-stale","fd-unknown"),t.classList.add(s));const n=i.toLocaleDateString("pt-BR");o.textContent=`Dados de ${n}`,t&&(t.title=`Última atualização dos dados: ${n}`)}function O(){const e=N?N.value:"",t=P?P.value:"",o=U?U.value.toLowerCase():"",a=V&&parseFloat(V.value)||0,i=_?_.value:"symbol-asc";D=L.filter(n=>{const c=!e||n.sector===e,d=!t||he(n.headquarters)===t,l=!o||n.symbol.toLowerCase().includes(o)||n.name.toLowerCase().includes(o)||n.subIndustry&&n.subIndustry.toLowerCase().includes(o)||n.headquarters&&n.headquarters.toLowerCase().includes(o),g=!a||(parseFloat(n.dividendYield)||0)>=a;return c&&d&&l&&g});const[r,s]=i.split("-");D.sort((n,c)=>{let d=n[r],l=c[r];if(typeof d=="string"){const h=(d||"").localeCompare(l||"");return s==="asc"?h:-h}const g=parseFloat(d)||0,m=parseFloat(l)||0;return s==="asc"?g-m:m-g}),F=1,G(),K()}function G(){if(!q){console.error("❌ tableBody não encontrado!");return}q.innerHTML="";const e=(F-1)*de,t=e+de,o=D.slice(e,t);console.log(`📋 Renderizando ${o.length} empresas (página ${F})`),o.forEach((a,i)=>{const r=R.has(a.symbol),s=document.createElement("tr");s.innerHTML=`
      <td>
        <input type="checkbox" class="row-checkbox" data-symbol="${a.symbol}" 
          ${r?"checked":""}>
      </td>
      <td class="col-index">${e+i+1}</td>
      <td><strong>${a.symbol}</strong></td>
      <td>${a.name||"N/A"}</td>
      <td>${a.sectorName||a.sector||"N/A"}</td>
      <td>${X(a.marketCap)}</td>
      <td>${a.subIndustry||a.industry||"N/A"}</td>
      <td>${a.headquarters||"N/A"}</td>
      <td>${a.dividendYield?parseFloat(a.dividendYield).toFixed(2)+"%":"N/A"}</td>
      <td>
        <button class="btn-watchlist" data-symbol="${a.symbol}" title="Adicionar à watchlist">
          ${T.has(a.symbol)?"★":"☆"}
        </button>
      </td>
    `;const n=s.querySelector(".row-checkbox");n.addEventListener("change",()=>{n.checked?R.add(a.symbol):R.delete(a.symbol),K()});const c=s.querySelector(".btn-watchlist");c.addEventListener("click",()=>{Ce(a.symbol),c.textContent=T.has(a.symbol)?"★":"☆",Ee()}),q.appendChild(s)}),console.log(`✅ ${o.length} linhas renderizadas`),tt()}function tt(){if(!H)return;H.innerHTML="";const e=Math.ceil(D.length/de),t=document.createElement("button");t.textContent="Anterior",t.disabled=F===1,t.addEventListener("click",()=>{F>1&&(F--,G())}),H.appendChild(t);const o=document.createElement("span");o.textContent=`Página ${F} de ${e}`,H.appendChild(o);const a=document.createElement("button");a.textContent="Próxima",a.disabled=F===e,a.addEventListener("click",()=>{F<e&&(F++,G())}),H.appendChild(a)}function K(){if(!z)return;const e=D.length,t=R.size,o=D.length>0?(D.reduce((a,i)=>a+(parseFloat(i.dividendYield)||0),0)/D.length).toFixed(2):0;z.innerHTML=`Total: ${e} | Selecionadas: ${t} | Dividend Yield Médio: ${o}%`}function Ce(e){T.has(e)?T.delete(e):T.add(e),Ke()}function Ee(){const e=document.querySelector("[data-watchlist-count]");e&&(e.textContent=T.size,console.log(`🌟 Watchlist atualizada: ${T.size} empresas`))}async function ot(){const e=document.getElementById("watchlist-view");if(!e)return;const t=L.filter(a=>T.has(a.symbol));if(t.length===0){e.innerHTML="<p>Nenhuma empresa na watchlist.</p>";return}let o='<table class="watchlist-table"><thead><tr><th>#</th><th>Símbolo</th><th>Nome</th><th>Setor</th><th>Dividend Yield</th><th>Market Cap</th></tr></thead><tbody>';t.forEach((a,i)=>{o+=`<tr>
      <td>${i+1}</td>
      <td><strong>${a.symbol}</strong></td>
      <td>${a.name}</td>
      <td>${a.sectorName||"N/A"}</td>
      <td>${a.dividendYield?parseFloat(a.dividendYield).toFixed(2)+"%":"N/A"}</td>
      <td>${X(a.marketCap)}</td>
    </tr>`}),o+="</tbody></table>",e.innerHTML=o}async function Ae(){const e=document.getElementById("stock-of-day-view");if(e){e.innerHTML=`
    <div class="stock-of-day-loading">
      <div class="loading-spinner"></div>
      <p>Analisando o mercado... selecionando a melhor oportunidade de hoje</p>
    </div>
  `;try{if(L.length===0&&await ke(),L.length===0){e.innerHTML=`
        <div class="stock-of-day-error">
          <h3>⚠️ Dados indisponíveis</h3>
          <p>Não foi possível carregar as empresas do S&P 500. Verifique a conexão com o servidor.</p>
          <button class="retry-btn" onclick="loadStockOfDay()">Tentar novamente</button>
        </div>
      `;return}const t=new Date().toISOString().slice(0,10),o=ct(t);if(o){ge(e,o);return}const a=await at();a.primary&&lt(t,a),ge(e,a)}catch(t){console.error("Erro ao carregar Ação do Dia:",t),e.innerHTML=`
      <div class="stock-of-day-error">
        <h3>⚠️ Indisponível no momento</h3>
        <p>Não foi possível gerar a análise. Tente novamente mais tarde.</p>
        <button class="retry-btn" onclick="loadStockOfDay()">Tentar novamente</button>
      </div>
    `}}}function at(){return new Promise(e=>{setTimeout(()=>{const t=new Date().toISOString().slice(0,10),o=rt(t),a=L.filter(c=>c.marketCap&&c.marketCap>1e9).map(c=>{const d=it(c),l=st(c.sector),g=T.has(c.symbol)?15:0,m=(c.dividendYield||0)>2?10:0,h=Math.min(20,Math.log10(c.marketCap/1e9)*5),$=nt(c),k=d+l+g+m+h+$;return{...c,score:Math.round(k*100)/100,breakdown:{technical:d,sector:l,watchlist:g,dividend:m,liquidity:Math.round(h),volatility:Math.round($)},rationale:dt(c,d,l,g,m)}}).sort((c,d)=>d.score-c.score);if(a.length===0){e({date:t,primary:null,alternatives:[],marketContext:me(),generatedAt:new Date().toISOString()});return}const i=a.slice(0,Math.min(10,a.length)),r=o%i.length,s=i[r],n=i.filter((c,d)=>d!==r).slice(0,3);e({date:t,primary:s,alternatives:n,marketContext:me(),generatedAt:new Date().toISOString()})},100)})}function rt(e){let t=0;for(let o=0;o<e.length;o++)t=(t<<5)-t+e.charCodeAt(o),t|=0;return Math.abs(t)}function it(e){let t=50;const o=e.dividendYield||0;o>4?t+=15:o>2?t+=8:o>0&&(t+=3);const a=e.marketCap||0;a>5e11?t+=10:a>1e11?t+=7:a>5e10?t+=5:a>1e10&&(t+=3);const i=(e.subIndustry||"").toLowerCase();["software","semiconductors","biotechnology","cloud","ai","cybersecurity","renewable"].some(s=>i.includes(s))&&(t+=12);const r=(e.name||"").toLowerCase();return["inc.","corporation","technologies","systems","solutions"].some(s=>r.includes(s))&&(t+=3),Math.min(90,t)}function st(e){return{"information-technology":15,"health-care":8,"consumer-discretionary":5,"communication-services":7,industrials:5,financials:3,materials:2,energy:0,utilities:-2,"real-estate":-3,"consumer-staples":1}[e]||0}function nt(e){const t=e.marketCap||0;return t>2e11?8:t>5e10?12:t>1e10?15:18}function dt(e,t,o,a,i){const r=[];return t>60&&r.push("Fundamentos técnicos sólidos"),o>10&&r.push(`Setor em momento favorável (${e.sectorName})`),a&&r.push("Está na sua watchlist pessoal"),i&&r.push(`Dividend yield atrativo (${(e.dividendYield||0).toFixed(1)}%)`),e.marketCap>1e11&&r.push("Grande capitalização — liquidez e estabilidade"),r.length===0&&r.push("Equilíbrio entre risco e retorno"),r.join(" • ")}function me(){const e=Math.random()*30+10;return e<15?{level:"Calmo",description:"Baixa volatilidade - ambiente propício para acumulação",class:"calm"}:e<25?{level:"Moderado",description:"Volatilidade normal - seleção seletiva recomendada",class:"moderate"}:{level:"Elevado",description:"Alta volatilidade - foco em qualidade e liquidez",class:"elevated"}}function ct(e){try{const t=localStorage.getItem("sp500-stock-of-day");if(!t)return null;const o=JSON.parse(t);return o.date===e&&o.primary?o:null}catch{return null}}function lt(e,t){try{localStorage.setItem("sp500-stock-of-day",JSON.stringify(t))}catch{}}function ge(e,t){const{primary:o,alternatives:a,marketContext:i,generatedAt:r}=t;if(!o){e.innerHTML=`
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
          <span class="market-context ${i.class}">${i.level}</span>
        </div>
      </header>

      <div class="stock-main-card">
        <div class="stock-identity">
          <div class="stock-symbol">${v(o.symbol)}</div>
          <div class="stock-name">${v(o.name)}</div>
          <div class="stock-sector">${v(o.sectorName||o.sector)}</div>
        </div>

        <div class="stock-score">
          <div class="score-circle" style="--score: ${o.score}">
            <span class="score-value">${o.score}</span>
            <span class="score-label">/ 100</span>
          </div>
          <div class="score-breakdown">
            ${Object.entries(o.breakdown).map(([s,n])=>`
              <div class="score-bar">
                <span class="bar-label">${s}</span>
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
            <span class="metric-value">${X(o.marketCap)}</span>
          </div>
          <div class="metric">
            <span class="metric-label">Div. Yield</span>
            <span class="metric-value">${(o.dividendYield||0).toFixed(2)}%</span>
          </div>
          <div class="metric">
            <span class="metric-label">Setor</span>
            <span class="metric-value">${v(o.sectorName||o.sector)}</span>
          </div>
          <div class="metric">
            <span class="metric-label">Sub-setor</span>
            <span class="metric-value">${v(o.subIndustry||"N/A")}</span>
          </div>
        </div>

        <div class="stock-actions">
          <button class="action-btn primary" onclick="toggleWatchlist('${o.symbol}'); loadStockOfDay();">
            ${T.has(o.symbol)?"★ Remover da Watchlist":"☆ Adicionar à Watchlist"}
          </button>
          <button class="action-btn secondary" onclick="openCompanyDetails({symbol:'${o.symbol}',name:'${v(o.name).replace(/'/g,"\\'")}'})">
            📈 Ver Detalhes
          </button>
          <button class="action-btn ghost" onclick="setPriceAlertPrompt('${o.symbol}')">🔔 Criar Alerta</button>
        </div>
      </div>

      <section class="stock-alternatives">
        <h3>🥈 Menções Honrosas</h3>
        <div class="alternatives-grid">
          ${a.map((s,n)=>`
            <div class="alt-card">
              <span class="alt-rank">${n+2}º</span>
              <div class="alt-info">
                <div class="alt-symbol">${v(s.symbol)}</div>
                <div class="alt-name">${v(s.name)}</div>
              </div>
              <div class="alt-score">${s.score}</div>
            </div>
          `).join("")}
        </div>
      </section>

      <footer class="stock-disclaimer">
        <p><strong>⚠️ Disclaimer:</strong> Esta análise é gerada algoritmicamente com base em dados públicos e heurísticas quantitativas. Não constitui recomendação de investimento. Faça sua própria pesquisa (DYOR).</p>
        <p class="generated-at">Gerado em ${new Date(r).toLocaleTimeString("pt-BR")} • Baseado em ${L.length} empresas do S&P 500</p>
      </footer>
    </div>
  `}function pt(e){const t=e.toUpperCase(),o=j.get(t);if(o&&o.triggered){confirm(`${e}: alerta já disparado. Remover?`)&&mt(t);return}const a=prompt(`Alerta de preço para ${e}:
Digite o preço alvo (ex: 150.25):`,o?o.target.toFixed(2):"");if(!a)return;const i=parseFloat(a);if(isNaN(i)||i<=0){alert("Preço inválido");return}const r=confirm(`Alertar quando o preço estiver ACIMA deste valor?
(OK = acima, Cancelar = abaixo)`)?"above":"below";ut(t,i,r)}function ut(e,t,o){return!e||typeof t!="number"||!["above","below"].includes(o)?!1:(j.set(e.toUpperCase(),{target:t,direction:o,triggered:!1}),ce(),!0)}function mt(e){j.delete(e.toUpperCase()),ce()}window.loadStockOfDay=Ae;window.toggleWatchlist=Ce;window.openCompanyDetails=Ye;window.setPriceAlertPrompt=pt;async function gt(){j.size!==0&&setInterval(async()=>{for(const[e,t]of j)t.triggered;ce()},6e4)}function ft(){const e=["#","Símbolo","Empresa","Setor","Market Cap","Subindústria","Sede","Dividend Yield"],t=D.map((a,i)=>[i+1,a.symbol,a.name,a.sectorName,X(a.marketCap),a.subIndustry||a.industry||"N/A",a.headquarters||"N/A",a.dividendYield||"N/A"]),o=[e,...t].map(a=>a.map(i=>`"${i}"`).join(",")).join(`
`);Se(o,"sp500-export.csv","text/csv")}function ht(){const e=JSON.stringify(D,null,2);Se(e,"sp500-export.json","application/json")}function Se(e,t,o){const a=new Blob([e],{type:o}),i=URL.createObjectURL(a),r=document.createElement("a");r.href=i,r.download=t,document.body.appendChild(r),r.click(),document.body.removeChild(r),URL.revokeObjectURL(i)}console.log("✅ main.js (10 colunas) carregado com sucesso!");
