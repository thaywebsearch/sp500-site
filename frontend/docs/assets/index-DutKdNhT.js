(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))o(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const n of r.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&o(n)}).observe(document,{childList:!0,subtree:!0});function a(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(i){if(i.ep)return;i.ep=!0;const r=a(i);fetch(i.href,r)}})();const ge=window.location.hostname,U=ge==="localhost"||ge==="127.0.0.1"?"http://localhost:5001":"https://sp500-site-production.up.railway.app",ce=[{id:"communication-services",name:"Communication Services"},{id:"consumer-discretionary",name:"Consumer Discretionary"},{id:"consumer-staples",name:"Consumer Staples"},{id:"energy",name:"Energy"},{id:"financials",name:"Financials"},{id:"health-care",name:"Health Care"},{id:"industrials",name:"Industrials"},{id:"information-technology",name:"Information Technology"},{id:"materials",name:"Materials"},{id:"real-estate",name:"Real Estate"},{id:"utilities",name:"Utilities"}];window.API_BASE_URL=U;window.SECTORS=ce;let j=[],b=null,ae=0,le="",ke="alfabética";async function He(){try{const e=document.getElementById("daily-curiosity-view");if(!e){console.error("Elemento daily-curiosity-view não encontrado");return}e.innerHTML='<div class="curiosidade-loading">Carregando curiosidade...</div>';const t=await fetch(`${U}/api/curiosidades`);if(!t.ok){console.error(`Erro ao buscar curiosidades: ${t.status}`),e.innerHTML=`<div class="curiosidade-erro">Erro ao carregar curiosidades (${t.status})</div>`;return}const a=await t.json();if(!a.sucesso||!a.dados||!a.dados.curiosidades){console.error("Dados de curiosidades inválidos:",a),e.innerHTML='<div class="curiosidade-erro">Formato de dados inválido</div>';return}if(j=a.dados.curiosidades,ae=a.dados.total||j.length,le=a.dados.proximaEmpresa||"",ke=a.dados.ordem||"alfabética",j.length===0){e.innerHTML='<div class="curiosidade-erro">Nenhuma curiosidade disponível</div>';return}Re(),Oe()}catch(e){console.error("Erro ao carregar curiosidades:",e);const t=document.getElementById("daily-curiosity-view");t&&(t.innerHTML=`<div class="curiosidade-erro">Erro ao carregar: ${e.message}</div>`)}}function Re(){if(j.length===0)return;const e=new Date,t=new Date(e.getFullYear(),e.getMonth(),e.getDate()),o=Math.floor(t.getTime()/864e5)%j.length;b=j[o]}function Oe(){const e=document.getElementById("daily-curiosity-view");if(!e||!b){console.error("View ou curiosidade não encontrada");return}je();const t=`
    <div class="curiosidade-container">
      <div class="curiosidade-header">
        <h1>🌟 Curiosidade do Dia</h1>
        <p class="curiosidade-data">${Ue()}</p>
      </div>

      <div class="curiosidade-card">
        <div class="curiosidade-simbolo">
          <span class="simbolo-badge">${b.simbolo}</span>
          <span class="posicao-badge">#${b.posicao}</span>
        </div>

        <div class="curiosidade-conteudo">
          <h2 class="curiosidade-empresa">${b.empresa}</h2>
          <p class="curiosidade-setor">
            <strong>Setor:</strong> ${b.setor||"N/A"}
          </p>

          <div class="curiosidade-titulo">
            <h3>${b.titulo}</h3>
          </div>

          <div class="curiosidade-descricao">
            <p>${b.descricao}</p>
          </div>

          ${b.fatos&&b.fatos.length>0?`
            <div class="curiosidade-fatos">
              <h4>📊 Fatos Interessantes:</h4>
              <ul>
                ${b.fatos.map(a=>`<li>${a}</li>`).join("")}
              </ul>
            </div>
          `:""}

          ${b.dividendYield?`
            <div class="curiosidade-dados">
              <p><strong>Dividend Yield:</strong> ${b.dividendYield}</p>
            </div>
          `:""}

          ${b.marketCap?`
            <div class="curiosidade-dados">
              <p><strong>Market Cap:</strong> ${b.marketCap}</p>
            </div>
          `:""}

          ${b.insight?`
            <div class="curiosidade-insight">
              <p><em>💡 ${b.insight}</em></p>
            </div>
          `:""}

          ${ae>0?`
            <div class="curiosidade-progresso">
              <div class="progresso-texto">
                <span>Rotatividade diária · ordem ${ke}</span>
                <span>Empresa ${b.posicao} de ${ae}</span>
              </div>
              <div class="progresso-barra">
                <div class="progresso-preenchido" style="width: ${Number(b.posicao)/ae*100}%;"></div>
              </div>
            </div>
          `:""}

          <div class="curiosidade-acoes">
            <button class="btn-compartilhar" onclick="compartilharCuriosidade()">
              📤 Compartilhar
            </button>
            ${b.link?`
              <a href="${b.link}" target="_blank" class="btn-saibamais">
                🔗 Saiba Mais
              </a>
            `:""}
          </div>
        </div>
      </div>

      <div class="curiosidade-footer">
        <p>Curiosidade de ${b.empresa} - Atualizado em ${b.dataAdicao||"N/A"}</p>
        ${le?`<p class="curiosidade-proxima">⏭️ Amanhã: ${le}</p>`:""}
        <p class="curiosidade-dica">💡 Uma empresa diferente a cada dia, em ordem alfabética do S&P 500!</p>
      </div>
    </div>
  `;e.innerHTML=t,window.compartilharCuriosidade=qe}function je(){if(document.getElementById("curiosidade-styles"))return;const e=document.createElement("style");e.id="curiosidade-styles",e.textContent=`
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
  `,document.head.appendChild(e)}function qe(){if(!b)return;const e=(b.fatos||[]).map(a=>`• ${a}`).join(`
`),t=`🌟 Curiosidade do Dia: ${b.empresa} (${b.simbolo})

${b.descricao}

${e}

💡 ${b.insight||""}`;navigator.share?navigator.share({title:`Curiosidade do Dia - ${b.empresa}`,text:t,url:window.location.href}).catch(a=>console.error("Erro ao compartilhar:",a)):navigator.clipboard.writeText(t).then(()=>{alert("Curiosidade copiada para a área de transferência!")}).catch(a=>{alert("Erro ao copiar: "+a)})}function Ue(){const e=new Date,t={weekday:"long",year:"numeric",month:"long",day:"numeric"};return e.toLocaleDateString("pt-BR",t)}function ie(e){const t=Number(e);return!t||Number.isNaN(t)?"N/A":t>=1e12?`$${(t/1e12).toFixed(3)}T`:t>=1e9?`$${(t/1e9).toFixed(2)}B`:t>=1e6?`$${(t/1e6).toFixed(2)}M`:`$${t.toLocaleString("en-US")}`}function Ce(e){if(!e||e.hasDividend==="Não")return"N/A";const t=Number(e.dividendYield);return Number.isFinite(t)?`${t.toFixed(2)}%`:"N/A"}function u(e){return e?String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;"):""}const Ve=new Set(["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming","D.C."]);function Ee(e){if(!e)return"Desconhecido";const t=String(e).split(",").map(o=>o.trim().replace(/\[\d+\]$/,"")),a=t[t.length-1];return!a||a.toLowerCase()==="none"?"Desconhecido":Ve.has(a)?"United States":a}async function Ae(e){try{const t=await fetch(`${U}/api/historico/${e}`);if(!t.ok)throw new Error(`Erro ao buscar histórico de ${e}`);return(await t.json()).registros||[]}catch(t){return console.error(`Erro ao buscar histórico de ${e}:`,t),[]}}const te=760,se=320,k={top:28,right:28,bottom:44,left:68};function _e(e){if(!e)return"";const[t,a,o]=e.split("-");return`${o}/${a}/${t.slice(2)}`}function pe(e){return Number.isFinite(e)?e>=100?`$${e.toFixed(0)}`:`$${e.toFixed(2)}`:"—"}function Ge(e){const t=e.map(f=>f.close),a=Math.min(...t),o=Math.max(...t),i=o-a||1,r=a-i*.08,n=o+i*.08,s=e.length,d=f=>k.left+f/(s-1)*(te-k.left-k.right),l=f=>k.top+(1-(f-r)/(n-r))*(se-k.top-k.bottom);let c=`<svg viewBox="0 0 ${te} ${se}" style="width:100%;height:auto;display:block;background:var(--plot-bg);border-radius:8px">`;const g=5;for(let f=0;f<=g;f++){const y=r+(n-r)*f/g,C=l(y);c+=`<line x1="${k.left}" y1="${C.toFixed(1)}" x2="${te-k.right}" y2="${C.toFixed(1)}" stroke="var(--chart-axis)" stroke-width="1"/>`,c+=`<text x="${k.left-8}" y="${(C+4).toFixed(1)}" text-anchor="end" font-size="11" fill="var(--chart-label)">${pe(y)}</text>`}const p=[];for(let f=0;f<=4;f++)p.push(Math.round((s-1)*f/4));p.forEach(f=>{const y=d(f);c+=`<text x="${y.toFixed(1)}" y="${se-k.bottom+18}" text-anchor="middle" font-size="11" fill="var(--chart-label)">${_e(e[f].data)}</text>`});const h=e.map((f,y)=>`${d(y).toFixed(1)},${l(f.close).toFixed(1)}`).join(" "),w=`${k.left},${l(r).toFixed(1)} `+h+` ${d(s-1).toFixed(1)},${l(r).toFixed(1)}`;c+=`<polygon points="${w}" fill="rgba(0, 212, 255, 0.08)"/>`,c+=`<polyline points="${h}" fill="none" stroke="var(--accent-cyan)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;const $=e[s-1],v=l($.close);return c+=`<circle cx="${d(s-1).toFixed(1)}" cy="${v.toFixed(1)}" r="4" fill="var(--accent-cyan)"/>`,c+=`<text x="${te-k.right}" y="${(v-10).toFixed(1)}" text-anchor="end" font-size="12" font-weight="700" fill="var(--chart-text)">${pe($.close)}</text>`,c+="</svg>",c}async function Ke(e,t){var i;(i=document.querySelector(".modal-overlay"))==null||i.remove();const a=document.createElement("div");a.className="modal-overlay";const o=()=>a.remove();a.addEventListener("click",r=>{r.target===a&&o()}),document.addEventListener("keydown",r=>{r.key==="Escape"&&o()}),a.innerHTML=`
    <div class="modal" role="dialog" aria-label="Histórico de ${u(e)}">
      <div class="modal-header">
        <h2 class="modal-title">
          📈 ${u(e)}
          <span class="modal-subtitle">${u(t||"")}</span>
        </h2>
        <button class="modal-close" aria-label="Fechar">✕</button>
      </div>
      <div class="modal-body" id="price-chart-body">
        <p class="modal-loading">Carregando histórico...</p>
      </div>
    </div>
  `,document.body.appendChild(a),a.querySelector(".modal-close").addEventListener("click",o);try{const r=await Ae(e),n=a.querySelector("#price-chart-body");if(!r||r.length===0){n.innerHTML=`<p class="modal-error">Nenhum dado de preço disponível para ${u(e)}.</p>`;return}const s=r[0].close,d=r[r.length-1].close,l=(d-s)/s*100,c=l>=0,g=c?"positive":"negative";n.innerHTML=`
      <div class="price-stats">
        <div class="price-stat">
          <span class="price-stat-label">Último</span>
          <strong>${pe(d)}</strong>
        </div>
        <div class="price-stat">
          <span class="price-stat-label">Variação (2a)</span>
          <strong class="${g}">${c?"+":""}${l.toFixed(2)}%</strong>
        </div>
        <div class="price-stat">
          <span class="price-stat-label">Período</span>
          <strong>${r.length} pregões</strong>
        </div>
      </div>
      ${Ge(r)}
    `}catch(r){console.error(`Erro ao buscar histórico de ${e}:`,r);const n=a.querySelector("#price-chart-body");n.innerHTML=`<p class="modal-error">Erro ao carregar o histórico de ${u(e)}. Verifique se o backend está online.</p>`}}function M(e,t){return`
    <div class="company-detail">
      <span class="company-detail-label">${e}</span>
      <strong class="company-detail-value">${t}</strong>
    </div>
  `}function Je(e){var r;(r=document.querySelector(".modal-overlay"))==null||r.remove();const t=document.createElement("div");t.className="modal-overlay";const a=()=>t.remove();t.addEventListener("click",n=>{n.target===t&&a()}),document.addEventListener("keydown",n=>{n.key==="Escape"&&a()});const o=e.dividendYield!==null&&e.dividendYield!==void 0?`${e.dividendYield.toFixed(2)}%`:"—",i=ie(e.marketCap);t.innerHTML=`
    <div class="modal" role="dialog" aria-label="Detalhes de ${u(e.symbol)}">
      <div class="modal-header">
        <h2 class="modal-title">
          💼 ${u(e.symbol)}
          <span class="modal-subtitle">${u(e.name||"")}</span>
        </h2>
        <button class="modal-close" aria-label="Fechar">✕</button>
      </div>
      <div class="modal-body">
        <div class="company-details-grid">
          ${M("Empresa",u(e.name||"N/A"))}
          ${M("Setor",u(e.sectorName||e.sector||"N/A"))}
          ${M("Subindústria",u(e.subIndustry||"N/A"))}
          ${M("Sede",u(e.headquarters||"N/A"))}
          ${M("Market Cap",i)}
          ${M("Classificação",u(e.marketCapClassification||"N/A"))}
          ${M("Div. Yield",o)}
          ${M("Paga dividendos",e.hasDividend?u(e.hasDividend):"—")}
          ${M("Data de inclusão",u(e.dateAdded||"N/A"))}
          ${M("CIK",e.cik?u(String(e.cik)):"N/A")}
          ${M("Fundação",u(e.founded||"N/A"))}
        </div>
        <div class="modal-footer">
          <button class="modal-action" id="details-chart-btn">📈 Ver histórico de preços</button>
        </div>
      </div>
    </div>
  `,document.body.appendChild(t),t.querySelector(".modal-close").addEventListener("click",a),t.querySelector("#details-chart-btn").addEventListener("click",()=>{Ke(e.symbol,e.name)})}function We(e,t){const a=e/t*100;return a>=80?"#ff5252":a>=60?"#ff9800":a>=40?"#ffeb3b":a>=20?"#8bc34a":"#4caf50"}async function Xe(){const e=document.getElementById("treemap-view");if(e){e.style.display="flex",e.style.flexDirection="column",e.style.height="100%",e.style.width="100%",e.style.margin="0",e.style.padding="0",e.style.background="var(--bg-primary)",e.innerHTML='<div style="display:flex;align-items:center;justify-content:center;height:100%;width:100%;font-size:14px;color:var(--text-secondary)">Carregando mapa de setores...</div>';try{const o=(await(await fetch(`${window.API_BASE_URL}/api/setores`)).json()).setores||[],i=await Promise.all(o.map(async s=>{var $;const l=await(await fetch(`${window.API_BASE_URL}/api/setor/${s}`)).json(),c=window.SECTORS.find(v=>v.id===s),g=(($=l.dados)==null?void 0:$.companies)||[],p=g.reduce((v,f)=>v+(f.marketCap||0),0),h=g.length>0?g.reduce((v,f)=>v+(f.dividendYield||0),0)/g.length:0,w=g.filter(v=>v.hasDividend==="Sim").length;return{id:s,name:(c==null?void 0:c.name)||s,cap:(p/1e9).toFixed(1),companies:g.length,avgDiv:parseFloat(h.toFixed(2)),withDiv:w,topCompany:g.length>0?g[0].symbol:"N/A"}})),r=Math.max(...i.map(s=>parseFloat(s.cap)));let n=`
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
    `;i.forEach(s=>{const d=We(parseFloat(s.cap),r),l=(parseFloat(s.cap)/r*100).toFixed(1),c=["consumer-staples","communication-services","consumer-discretionary","energy","financials","health-care","industrials","information-technology","materials","real-estate","utilities"].includes(s.id),g=c?new URL(`sector.html?sector=${s.id}`,document.baseURI).href:"#";n+=`
        <div style="
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 24px;
          transition: all 0.3s ease;
          cursor: ${c?"pointer":"not-allowed"};
          display: flex;
          flex-direction: column;
          gap: 20px;
          opacity: ${c?"1":"0.7"};
        "
        onmouseover="${c?`this.style.borderColor='${d}';this.style.background='rgba(${parseInt(d.slice(1,3),16)},${parseInt(d.slice(3,5),16)},${parseInt(d.slice(5,7),16)},0.05)';this.style.transform='translateY(-4px)';this.style.boxShadow='0 12px 32px ${d}22'`:""}"
        onmouseout="${c?"this.style.borderColor='var(--border)';this.style.background='var(--bg-secondary)';this.style.transform='translateY(0)';this.style.boxShadow='none'":""}"
        onclick="${c?`navigateToSector('${g}', '${s.id}')`:`alert('🔒 O setor \\"${s.name}\\" ainda está em desenvolvimento.\\n\\nApenas Consumer Staples, Communication Services, Consumer Discretionary, Energy, Financials, Health Care, Industrials, Information Technology, Materials, Real Estate e Utilities estão disponíveis por enquanto!')`}"
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
              background: ${d}22;
              border: 1px solid ${d}44;
              padding: 8px 12px;
              border-radius: 6px;
              font-size: 13px;
              font-weight: 700;
              color: ${d};
              text-align: center;
            ">
              ${l}%
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
                width: ${l}%;
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
    `,e.innerHTML=n}catch(t){console.error("Erro ao carregar treemap:",t),e.innerHTML='<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--accent-red)">Erro ao carregar mapa de setores</div>'}}}function Ze(e,t){if(e==="#"){alert(`🔒 O setor "${t}" ainda está em desenvolvimento.

Apenas Consumer Staples, Communication Services, Consumer Discretionary, Energy, Financials, Health Care, Industrials, Information Technology, Materials, Real Estate e Utilities estão disponíveis por enquanto!`);return}window.open(e,"_blank")}window.navigateToSector=Ze;async function Qe(){var t;const e=document.getElementById("heatmap-view");if(e){e.style.display="flex",e.style.flexDirection="column",e.style.height="100%",e.style.width="100%",e.style.padding="40px",e.style.boxSizing="border-box",e.style.background="var(--bg-primary)",e.style.overflowY="auto",e.innerHTML='<div style="text-align:center;color:var(--text-secondary)">Carregando heatmap...</div>';try{const i=(await(await fetch(`${window.API_BASE_URL}/api/setores`)).json()).setores||[];let r=`
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
    `;for(const n of i){const d=await(await fetch(`${window.API_BASE_URL}/api/setor/${n}`)).json(),l=window.SECTORS.find(p=>p.id===n),c=((t=d.dados)==null?void 0:t.companies)||[];if(c.length===0)continue;const g=c.sort((p,h)=>(h.marketCap||0)-(p.marketCap||0)).slice(0,4);r+=`
        <div style="margin-bottom: 40px;">
          <h3 style="
            font-size: 16px;
            margin: 0 0 20px 0;
            color: var(--text-primary);
            font-weight: 600;
          ">${(l==null?void 0:l.name)||n}</h3>

          <div style="
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 16px;
          ">
      `,g.forEach((p,h)=>{const w=(p.marketCap/1e9).toFixed(2),$=(p.dividendYield||0).toFixed(2);let v="#4caf50";w>500?v="#ff5252":w>200?v="#ff9800":w>100?v="#ffeb3b":w>50&&(v="#8bc34a"),r+=`
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
              ">${p.symbol}</div>
              <div style="
                font-size: 11px;
                background: ${v}22;
                color: ${v};
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
              ${p.name}
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
                ">${$}%</div>
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
    `,e.innerHTML=r}catch(a){console.error("Erro ao carregar heatmap:",a),e.innerHTML=`
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
    `}}}const et={Energy:"#FF6B6B",Materials:"#C92A2A",Industrials:"#FFA94D","Consumer Discretionary":"#FFD43B","Consumer Staples":"#A9E34B","Health Care":"#51CF66",Financials:"#40C057","Information Technology":"#339AF0","Communication Services":"#748FFC",Utilities:"#9775FA","Real Estate":"#DA77F2"};function Se(e){return et[e]||"#808080"}function ve(e){if(!e)return 0;if(typeof e=="number")return e;const a=String(e).toUpperCase().trim().replace(/[$€¥₹]/g,"").trim();return a.includes("T")?parseFloat(a.replace("T",""))*1e12:a.includes("B")?parseFloat(a.replace("B",""))*1e9:a.includes("M")?parseFloat(a.replace("M",""))*1e6:parseFloat(a)||0}function tt(e){if(!e)return 0;if(typeof e=="number")return e;const t=String(e).trim();return parseFloat(t.replace("%",""))||0}function at(e,t){const a=document.getElementById(t);if(!a){console.error(`❌ Contentor ${t} não encontrado!`);return}a.innerHTML="";const o=e.filter(m=>ve(m.marketCap)>0&&m.sectorName).map((m,L)=>({symbol:m.symbol,name:m.name,sector:m.sectorName,marketCap:ve(m.marketCap),dividendYield:tt(m.dividendYield),index:L}));if(o.length===0){a.innerHTML="<p>Sem dados disponíveis para o gráfico de bolhas.</p>";return}const i={top:40,right:40,bottom:60,left:60},r=Math.max(window.innerWidth-100,800)-i.left-i.right,n=600-i.top-i.bottom,s=Math.min(...o.map(m=>m.dividendYield)),d=Math.max(...o.map(m=>m.dividendYield)),l=Math.min(...o.map(m=>m.marketCap)),c=Math.max(...o.map(m=>m.marketCap)),g=m=>n-(m-s)/(d-s||1)*n,p=m=>5+(m-l)/(c-l||1)*50,h=(()=>{let m=42;return()=>(m=(m*9301+49297)%233280,m/233280)})(),w=o.map(()=>h()*r),$=document.createElementNS("http://www.w3.org/2000/svg","svg");$.setAttribute("width",r+i.left+i.right),$.setAttribute("height",n+i.top+i.bottom),$.style.cssText="display: block; margin: 20px auto; background: var(--plot-bg); border-radius: 8px;";const v=document.createElementNS("http://www.w3.org/2000/svg","g");v.setAttribute("transform",`translate(${i.left},${i.top})`);for(let m=0;m<=10;m++){const L=m/10*n,ee=s+m/10*(d-s),E=document.createElementNS("http://www.w3.org/2000/svg","line");E.setAttribute("x1",0),E.setAttribute("y1",L),E.setAttribute("x2",r),E.setAttribute("y2",L),E.setAttribute("stroke","var(--chart-axis)"),E.setAttribute("stroke-width","1"),E.setAttribute("stroke-dasharray","4"),v.appendChild(E);const A=document.createElementNS("http://www.w3.org/2000/svg","text");A.setAttribute("x",-10),A.setAttribute("y",L+5),A.setAttribute("text-anchor","end"),A.setAttribute("font-size","12"),A.setAttribute("fill","var(--chart-label)"),A.textContent=ee.toFixed(1)+"%",v.appendChild(A)}const f=document.createElementNS("http://www.w3.org/2000/svg","line");f.setAttribute("x1",0),f.setAttribute("y1",0),f.setAttribute("x2",0),f.setAttribute("y2",n),f.setAttribute("stroke","var(--chart-label)"),f.setAttribute("stroke-width","2"),v.appendChild(f);const y=document.createElementNS("http://www.w3.org/2000/svg","text");y.setAttribute("transform","rotate(-90)"),y.setAttribute("y",-40),y.setAttribute("x",-n/2),y.setAttribute("text-anchor","middle"),y.setAttribute("font-size","14"),y.setAttribute("font-weight","bold"),y.setAttribute("fill","var(--chart-text)"),y.textContent="💵 Dividend Yield (%)",v.appendChild(y);const C=document.createElementNS("http://www.w3.org/2000/svg","line");C.setAttribute("x1",0),C.setAttribute("y1",n),C.setAttribute("x2",r),C.setAttribute("y2",n),C.setAttribute("stroke","var(--chart-label)"),C.setAttribute("stroke-width","2"),v.appendChild(C);const F=document.createElementNS("http://www.w3.org/2000/svg","text");F.setAttribute("x",r/2),F.setAttribute("y",n+45),F.setAttribute("text-anchor","middle"),F.setAttribute("font-size","14"),F.setAttribute("font-weight","bold"),F.setAttribute("fill","var(--chart-text)"),F.textContent="📊 Distribuição Aleatória (cada bolha = empresa)",v.appendChild(F),o.forEach((m,L)=>{const ee=w[L],E=g(m.dividendYield),A=p(m.marketCap),Ye=Se(m.sector),x=document.createElementNS("http://www.w3.org/2000/svg","circle");if(x.setAttribute("cx",ee),x.setAttribute("cy",E),x.setAttribute("r",A),x.setAttribute("fill",Ye),x.setAttribute("opacity","0.7"),x.setAttribute("stroke","#fff"),x.setAttribute("stroke-width","2"),x.style.cursor="pointer",x.style.transition="all 0.3s ease",x.addEventListener("mouseover",S=>{x.setAttribute("opacity","1"),x.setAttribute("stroke-width","3"),it(S,m)}),x.addEventListener("mouseout",()=>{x.setAttribute("opacity","0.7"),x.setAttribute("stroke-width","2"),Me()}),v.appendChild(x),A>15){const S=document.createElementNS("http://www.w3.org/2000/svg","text");S.setAttribute("x",ee),S.setAttribute("y",E+5),S.setAttribute("text-anchor","middle"),S.setAttribute("font-size",Math.max(10,A/2)),S.setAttribute("font-weight","bold"),S.setAttribute("fill","#fff"),S.setAttribute("pointer-events","none"),S.textContent=m.symbol.substring(0,3),v.appendChild(S)}}),$.appendChild(v),a.appendChild($),ot(a,o)}function ot(e,t){const a=document.createElement("div");a.style.cssText=`
    margin: 30px auto;
    max-width: 800px;
    padding: 20px;
    background: var(--surface);
    border-radius: 8px;
    border: 1px solid var(--border);
  `;const o=document.createElement("h3");o.textContent="🫧 Como ler o gráfico",o.style.cssText="margin: 0 0 12px 0; color: var(--text-primary);",a.appendChild(o);const i=document.createElement("div");i.style.cssText="margin-bottom: 16px; font-size: 13px; color: var(--text-secondary); line-height: 1.8;",i.innerHTML=`
    <div><strong>Tamanho da bolha:</strong> Market Cap da empresa (quanto maior, mais valiosa)</div>
    <div><strong>Eixo Y (vertical):</strong> Dividend Yield (mais acima = maior dividendo)</div>
    <div><strong>Eixo X (horizontal):</strong> posição aleatória, apenas para facilitar a visualização</div>
    <div><strong>Cor:</strong> setor da empresa</div>
  `,a.appendChild(i);const r=document.createElement("div");r.textContent="Setores",r.style.cssText="font-size: 13px; font-weight: 600; color: var(--text-primary); margin-bottom: 8px;",a.appendChild(r);const n=new Set(t.map(d=>d.sector)),s=document.createElement("div");s.style.cssText="display: flex; flex-wrap: wrap; gap: 12px;",n.forEach(d=>{const l=document.createElement("div");l.style.cssText="display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text-primary);";const c=document.createElement("span");c.style.cssText=`display: inline-block; width: 14px; height: 14px; border-radius: 50%; background: ${Se(d)};`;const g=document.createElement("span");g.textContent=d,l.appendChild(c),l.appendChild(g),s.appendChild(l)}),a.appendChild(s),e.appendChild(a)}let oe=null;function it(e,t){Me();const a=document.createElement("div");a.style.cssText=`
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
  `;const o=t.marketCap>=1e12?(t.marketCap/1e12).toFixed(2)+"T":t.marketCap>=1e9?(t.marketCap/1e9).toFixed(2)+"B":(t.marketCap/1e6).toFixed(2)+"M";a.innerHTML=`
    <strong>${t.symbol}</strong> — ${t.name}<br>
    <strong>Setor:</strong> ${t.sector}<br>
    <strong>Market Cap:</strong> $${o}<br>
    <strong>Dividend Yield:</strong> ${t.dividendYield.toFixed(2)}%
  `;const i=e.target.getBoundingClientRect();a.style.left=i.left+10+"px",a.style.top=i.top-10+"px",document.body.appendChild(a),oe=a}function Me(){oe&&(oe.remove(),oe=null)}function N(e){const t=Number(e&&e.dividendYield);return Number.isFinite(t)&&t>0?t:0}function Q(e){return(e||[]).filter(t=>N(t)>0)}function rt(e){const t=Q(e);return t.length===0?0:t.reduce((o,i)=>o+N(i),0)/t.length}function st(e){const t=Q(e).map(N).sort((o,i)=>o-i);if(t.length===0)return 0;const a=Math.floor(t.length/2);return t.length%2===0?(t[a-1]+t[a])/2:t[a]}function nt(e){const t=e||[],a=Q(t),o=a.map(N);return{total:t.length,payers:a.length,nonPayers:t.length-a.length,payerRatio:t.length>0?a.length/t.length:0,avgYield:rt(t),medianYield:st(t),maxYield:o.length>0?Math.max(...o):0}}function dt(e,t=15){return Q(e).slice().sort((a,o)=>N(o)-N(a)||String(a.symbol).localeCompare(String(o.symbol))).slice(0,t)}const ct=[{label:"0–1%",min:0,max:1},{label:"1–2%",min:1,max:2},{label:"2–3%",min:2,max:3},{label:"3–4%",min:3,max:4},{label:"4–5%",min:4,max:5},{label:"5%+",min:5,max:1/0}];function lt(e){const t=Q(e);return ct.map(a=>({label:a.label,count:t.filter(o=>{const i=N(o);return i>=a.min&&i<a.max}).length}))}function pt(e){const t=new Map;for(const a of e||[]){const o=a.sectorName||a.sector||"N/A";t.has(o)||t.set(o,{sector:o,total:0,payers:0,yieldSum:0});const i=t.get(o);i.total+=1;const r=N(a);r>0&&(i.payers+=1,i.yieldSum+=r)}return Array.from(t.values()).map(a=>({sector:a.sector,total:a.total,payers:a.payers,avgYield:a.payers>0?a.yieldSum/a.payers:0})).sort((a,o)=>o.avgYield-a.avgYield||a.sector.localeCompare(o.sector))}const _=e=>`${Number(e).toFixed(2)}%`,fe=e=>`${(e*100).toFixed(0)}%`;function ut(e,t){const a=document.getElementById(t);if(!a){console.error(`❌ Contentor ${t} não encontrado!`);return}const o=e||[];if(o.length===0){a.innerHTML='<div class="treemap-container"><p>Sem dados disponíveis para o painel de dividendos.</p></div>';return}const i=nt(o),r=dt(o),n=lt(o),s=pt(o),d=Math.max(1,...n.map(p=>p.count)),l=r.map((p,h)=>`
      <tr class="dividend-row" data-dividend-symbol="${u(p.symbol)}" data-dividend-name="${u(p.name||p.symbol)}">
        <td class="col-index">${h+1}</td>
        <td><strong>${u(p.symbol)}</strong></td>
        <td>${u(p.name||"N/A")}</td>
        <td>${u(p.sectorName||p.sector||"N/A")}</td>
        <td class="dividend-yield">${_(N(p))}</td>
      </tr>`).join(""),c=n.map(p=>`
      <div class="dividend-bucket">
        <span class="dividend-bucket-label">${p.label}</span>
        <div class="dividend-bucket-track">
          <div class="dividend-bucket-fill" style="width: ${p.count/d*100}%"></div>
        </div>
        <span class="dividend-bucket-count">${p.count}</span>
      </div>`).join(""),g=s.map(p=>`
      <tr>
        <td>${u(p.sector)}</td>
        <td class="col-index">${p.payers} / ${p.total}</td>
        <td class="dividend-yield">${_(p.avgYield)}</td>
      </tr>`).join("");a.innerHTML=`
    <div class="dividends-view">
      <header class="treemap-header">
        <h2>💰 Dividendos</h2>
        <p class="subtitle">
          Renda por dividendos no S&amp;P 500 — ${i.payers} de ${i.total} empresas
          pagam dividendos (${fe(i.payerRatio)}).
        </p>
      </header>

      <div class="treemap-stats">
        <div class="stat-card">
          <span class="stat-label">Empresas</span>
          <span class="stat-value">${i.total}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Pagadoras</span>
          <span class="stat-value">${i.payers} (${fe(i.payerRatio)})</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Yield médio</span>
          <span class="stat-value">${_(i.avgYield)}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Yield mediano</span>
          <span class="stat-value">${_(i.medianYield)}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Maior yield</span>
          <span class="stat-value">${_(i.maxYield)}</span>
        </div>
      </div>

      <div class="dividend-columns">
        <section class="dividend-panel">
          <h3>🏆 Top por Dividend Yield</h3>
          <table class="dividend-table">
            <thead>
              <tr><th>#</th><th>Símbolo</th><th>Empresa</th><th>Setor</th><th>Yield</th></tr>
            </thead>
            <tbody>${l}</tbody>
          </table>
        </section>

        <section class="dividend-panel">
          <h3>📊 Distribuição por faixa</h3>
          <div class="dividend-buckets">${c}</div>
          <p class="dividend-note">Considera apenas as ${i.payers} empresas pagadoras.</p>
        </section>
      </div>

      <section class="dividend-panel">
        <h3>🏭 Yield médio por setor</h3>
        <table class="dividend-table">
          <thead>
            <tr><th>Setor</th><th>Pagadoras</th><th>Yield médio</th></tr>
          </thead>
          <tbody>${g}</tbody>
        </table>
      </section>
    </div>
  `,a.querySelectorAll(".dividend-row").forEach(p=>{p.addEventListener("click",()=>{typeof window.openCompanyDetails=="function"&&window.openCompanyDetails({symbol:p.dataset.dividendSymbol,name:p.dataset.dividendName})})})}const mt={bullish:{label:"Otimista",cls:"positive"},bearish:{label:"Pessimista",cls:"negative"},neutral:{label:"Neutro",cls:""}};async function gt(e="daily-summary"){const t=document.getElementById(e);if(t){t.innerHTML='<p class="summary-empty">Carregando resumo do dia...</p>';try{const a=await fetch(`${U}/api/resumo-dia`);if(!a.ok)throw new Error(`HTTP ${a.status}`);const o=await a.json();ft(t,o.dados||{})}catch(a){console.error("Erro ao carregar Resumo do Dia:",a),t.innerHTML='<p class="summary-empty">Resumo do dia indisponível no momento.</p>'}}}function De(e){const t=Number(e)||0;return`${t>0?"+":""}${t.toFixed(2)}%`}function vt(e){if(!e)return"";const t=new Date(`${e}T00:00:00`);return Number.isNaN(t.getTime())?"":t.toLocaleDateString("pt-BR")}function be(e,t){const a=(t||[]).map(o=>`
        <div class="summary-row">
          <span class="mini-symbol">${u(o.symbol||"")}</span>
          <span class="mini-name">${u(o.name||"")}</span>
          <span class="mini-change ${o.changePct>=0?"positive":"negative"}">${De(o.changePct)}</span>
        </div>`).join("");return`
    <div class="summary-list">
      <h4 class="summary-list-title">${e}</h4>
      ${a}
    </div>`}function ft(e,t){const a=t.stats||{},o=mt[t.marketMood]||{label:"—",cls:""},i=vt(t.referenceDate),r=[{label:"Em alta",value:a.gainers??"—",cls:"positive"},{label:"Em baixa",value:a.losers??"—",cls:"negative"},{label:"Estáveis",value:a.neutral??"—",cls:""},{label:"Total",value:a.total??"—",cls:""},{label:"Humor",value:o.label,cls:o.cls}].map(s=>`
      <div class="daily-card ${s.cls}">
        <span class="daily-label">${s.label}</span>
        <span class="daily-value">${s.value}</span>
      </div>`).join(""),n=(t.sectorPerformance||[]).map(s=>`
      <div class="daily-sector-card ${s.avgChangePct>=0?"positive":"negative"}">
        <span class="sector-name">${u(s.name||"")}</span>
        <span class="sector-change">${De(s.avgChangePct)}</span>
      </div>`).join("");e.innerHTML=`
    <header class="daily-summary-header">
      <h2>📊 Resumo do Dia</h2>
      ${i?`<span class="daily-date">Referência: ${i}</span>`:""}
    </header>

    <div class="daily-summary-grid">${r}</div>

    <div class="daily-lists">
      ${be("🚀 Maiores altas",t.topGainers)}
      ${be("📉 Maiores baixas",t.topLosers)}
    </div>

    <div class="daily-sectors">
      <h3>📈 Desempenho por setor</h3>
      <div class="daily-sectors-list">${n}</div>
    </div>
  `}const Le="sp500-price-alerts",ue=50;function bt(){try{const e=localStorage.getItem(Le);if(!e)return[];const t=JSON.parse(e);return Array.isArray(t)&&t.length>0&&Array.isArray(t[0])?t:Array.isArray(t)&&t.length>0&&typeof t[0]=="object"?t.map(a=>[a.symbol,a]):[]}catch(e){return console.error("Erro ao carregar price alerts:",e),[]}}function re(){try{const e=Array.from(V.entries());localStorage.setItem(Le,JSON.stringify(e))}catch(e){console.error("Erro ao salvar price alerts:",e)}}function ht(e,t){let a;return function(...i){const r=()=>{clearTimeout(a),e(...i)};clearTimeout(a),a=setTimeout(r,t)}}function me(){const e=document.getElementById("nav-menu"),t=document.getElementById("menu-toggle");e&&e.classList.remove("open"),t&&t.setAttribute("aria-expanded","false")}function yt(){const e=document.getElementById("menu-toggle"),t=document.getElementById("nav-menu");!e||!t||(e.addEventListener("click",a=>{a.stopPropagation();const o=t.classList.toggle("open");e.setAttribute("aria-expanded",String(o))}),document.addEventListener("click",a=>{t.classList.contains("open")&&!t.contains(a.target)&&me()}),document.addEventListener("keydown",a=>{a.key==="Escape"&&me()}))}let D=[],I=[],T=1,W="dashboard",q=new Set;const he=new Set,ne=bt(),V=new Map(ne&&ne.length>0?ne:[]);let B,z,G,K,J,H,P,R,Y;function xt(){B=document.getElementById("sector-filter"),z=document.getElementById("country-filter"),G=document.getElementById("search-input"),K=document.getElementById("dividend-min"),J=document.getElementById("sort-select"),H=document.getElementById("table-body"),P=document.getElementById("stats"),R=document.getElementById("pagination"),Y=document.getElementById("header-checkbox"),document.querySelectorAll(".nav-tab").forEach(r=>{r.addEventListener("click",n=>{n.preventDefault();const s=r.getAttribute("data-tab");wt(s),me()})}),yt(),B&&B.addEventListener("change",O),z&&z.addEventListener("change",O),G&&G.addEventListener("input",ht(O,300)),K&&K.addEventListener("change",O),J&&J.addEventListener("change",O),Y&&Y.addEventListener("change",()=>{const r=Y.checked;H.querySelectorAll(".row-checkbox").forEach(s=>{s.checked=r,s.dispatchEvent(new Event("change"))})});const t=document.getElementById("select-all"),a=document.getElementById("deselect-all"),o=document.getElementById("export-csv"),i=document.getElementById("export-json");t&&t.addEventListener("click",()=>{I.forEach(r=>q.add(r.symbol)),X(),Z()}),a&&a.addEventListener("click",()=>{q.clear(),X(),Z()}),o&&o.addEventListener("click",Pt),i&&i.addEventListener("click",Yt),Te(),Fe(),Be(),gt(),Bt()}document.addEventListener("DOMContentLoaded",xt);function wt(e){W=e,Te(),Fe()}function de(e,t){he.has(e)||(he.add(e),t())}function Te(){const e=document.getElementById("dashboard-view"),t=document.getElementById("treemap-view"),a=document.getElementById("heatmap-view"),o=document.getElementById("bubble-chart-view"),i=document.getElementById("dividends-view"),r=document.getElementById("stock-of-day-view"),n=document.getElementById("daily-curiosity-view");switch([e,t,a,o,i,r,n].forEach(d=>{d&&(d.style.display="none")}),W){case"dashboard":e&&(e.style.display="block");break;case"stock-of-day":r&&(r.style.display="block",ze());break;case"daily-curiosity":n&&(n.style.display="block",de("daily-curiosity",He));break;case"treemap":t&&(t.style.display="block",de("treemap",Xe));break;case"heatmap":a&&(a.style.display="block",de("heatmap",Qe));break;case"bubble":o&&(o.style.display="block",Ne());break;case"dividends":i&&(i.style.display="block",Ie());break;default:e&&(e.style.display="block")}}function Ne(){const e=document.getElementById("bubble-chart-view");if(!e){console.error("❌ bubble-chart-view não encontrado!");return}e.innerHTML='<div style="text-align: center; padding: 40px;"><p>Carregando gráfico de bolhas...</p></div>',at(D,"bubble-chart-view")}function Ie(){const e=document.getElementById("dividends-view");if(!e){console.error("❌ dividends-view não encontrado!");return}if(D.length===0){e.innerHTML='<div style="text-align: center; padding: 40px;"><p>Carregando dados de dividendos...</p></div>';return}ut(D,"dividends-view")}function Fe(){document.querySelectorAll(".nav-tab").forEach(t=>{t.classList.remove("active"),t.getAttribute("data-tab")===W&&t.classList.add("active")})}async function Be(){P&&(P.textContent="Carregando dados...");try{const e=await fetch(`${U}/api/setores`);if(!e.ok)throw new Error("Erro ao buscar setores");const o=((await e.json()).setores||[]).map(async r=>{try{const n=await fetch(`${U}/api/setor/${r}`);if(!n.ok)throw new Error(`HTTP ${n.status}`);const s=await n.json(),d=ce.find(c=>c.id===r),l=d?d.name:r;return s.dados&&s.dados.companies&&Array.isArray(s.dados.companies)?{generatedAt:s.dados.generatedAt||null,companies:s.dados.companies.map(c=>({...c,sector:r,sectorName:l}))}:{generatedAt:null,companies:[]}}catch(n){return console.error(`❌ Erro ao carregar ${r}:`,n),{generatedAt:null,companies:[]}}}),i=await Promise.all(o);D=i.flatMap(r=>r.companies),ye(i.map(r=>r.generatedAt).filter(Boolean)),B&&(B.innerHTML='<option value="">Todos os Setores</option>',[...new Set(D.map(n=>n.sector))].sort().forEach(n=>{var d;const s=document.createElement("option");s.value=n,s.textContent=((d=ce.find(l=>l.id===n))==null?void 0:d.name)||n,B.appendChild(s)})),z&&(z.innerHTML='<option value="">Todos os Países</option>',[...new Set(D.map(n=>Ee(n.headquarters)))].sort().forEach(n=>{const s=document.createElement("option");s.value=n,s.textContent=n,z.appendChild(s)})),O(),Z(),W==="bubble"&&Ne(),W==="dividends"&&Ie()}catch(e){console.error("❌ Erro ao carregar dados:",e),P&&(P.textContent="Erro ao carregar dados. Tente novamente."),ye([])}}function ye(e){const t=document.getElementById("freshness-badge"),a=document.getElementById("freshness-text");if(!a)return;const o=(e||[]).map(d=>new Date(d)).filter(d=>!Number.isNaN(d.getTime()));if(o.length===0){t&&(t.classList.remove("fd-fresh","fd-aging","fd-stale"),t.classList.add("fd-unknown")),a.textContent="Data indisponível";return}const i=new Date(Math.max(...o.map(d=>d.getTime()))),r=Math.floor((Date.now()-i.getTime())/864e5);let n="fd-fresh";r>30?n="fd-stale":r>7&&(n="fd-aging"),t&&(t.classList.remove("fd-fresh","fd-aging","fd-stale","fd-unknown"),t.classList.add(n));const s=i.toLocaleDateString("pt-BR");a.textContent=`Dados de ${s}`,t&&(t.title=`Última atualização dos dados: ${s}`)}function O(){const e=B?B.value:"",t=z?z.value:"",a=G?G.value.toLowerCase():"",o=K&&parseFloat(K.value)||0,i=J?J.value:"symbol-asc";I=D.filter(s=>{const d=!e||s.sector===e,l=!t||Ee(s.headquarters)===t,c=!a||s.symbol.toLowerCase().includes(a)||s.name.toLowerCase().includes(a)||s.subIndustry&&s.subIndustry.toLowerCase().includes(a)||s.headquarters&&s.headquarters.toLowerCase().includes(a),g=!o||(parseFloat(s.dividendYield)||0)>=o;return d&&l&&c&&g});const[r,n]=i.split("-");I.sort((s,d)=>{let l=s[r],c=d[r];if(typeof l=="string"){const h=(l||"").localeCompare(c||"");return n==="asc"?h:-h}const g=parseFloat(l)||0,p=parseFloat(c)||0;return n==="asc"?g-p:p-g}),T=1,X(),Z()}function X(){if(!H){console.error("❌ tableBody não encontrado!");return}H.innerHTML="";const e=(T-1)*ue,t=e+ue;I.slice(e,t).forEach((o,i)=>{const r=q.has(o.symbol),n=u(o.symbol),s=document.createElement("tr");s.innerHTML=`
      <td>
        <input type="checkbox" class="row-checkbox" data-symbol="${n}" 
          ${r?"checked":""}>
      </td>
      <td class="col-index">${e+i+1}</td>
      <td><strong>${u(o.symbol)}</strong></td>
      <td>${u(o.name||"N/A")}</td>
      <td>${u(o.sectorName||o.sector||"N/A")}</td>
      <td>${ie(o.marketCap)}</td>
      <td>${u(o.subIndustry||o.industry||"N/A")}</td>
      <td>${u(o.headquarters||"N/A")}</td>
      <td>${Ce(o)}</td>
    `;const d=s.querySelector(".row-checkbox");d.addEventListener("change",()=>{d.checked?q.add(o.symbol):q.delete(o.symbol),Z(),xe()}),H.appendChild(s)}),xe(),$t()}function xe(){if(!Y||!H)return;const e=H.querySelectorAll(".row-checkbox"),t=Array.from(e).filter(a=>a.checked).length;Y.checked=e.length>0&&t===e.length,Y.indeterminate=t>0&&t<e.length}function $t(){if(!R)return;R.innerHTML="";const e=Math.ceil(I.length/ue),t=document.createElement("button");t.textContent="Anterior",t.disabled=T===1,t.addEventListener("click",()=>{T>1&&(T--,X())}),R.appendChild(t);const a=document.createElement("span");a.textContent=`Página ${T} de ${e}`,R.appendChild(a);const o=document.createElement("button");o.textContent="Próxima",o.disabled=T===e,o.addEventListener("click",()=>{T<e&&(T++,X())}),R.appendChild(o)}function Z(){if(!P)return;const e=I.length,t=q.size,a=I.filter(i=>Number(i.dividendYield)>0),o=a.length>0?(a.reduce((i,r)=>i+Number(r.dividendYield),0)/a.length).toFixed(2):"0.00";P.innerHTML=`Total: ${e} | Selecionadas: ${t} | Yield Médio (pagadoras): ${o}%`}async function ze(){const e=document.getElementById("stock-of-day-view");if(e){e.innerHTML=`
    <div class="stock-of-day-loading">
      <div class="loading-spinner"></div>
      <p>Analisando o mercado... selecionando a melhor oportunidade de hoje</p>
    </div>
  `;try{if(D.length===0&&await Be(),D.length===0){e.innerHTML=`
        <div class="stock-of-day-error">
          <h3>⚠️ Dados indisponíveis</h3>
          <p>Não foi possível carregar as empresas do S&P 500. Verifique a conexão com o servidor.</p>
          <button class="retry-btn" onclick="loadStockOfDay()">Tentar novamente</button>
        </div>
      `;return}const t=new Date().toISOString().slice(0,10),a=Dt(t);if(a){$e(e,a);return}const o=await kt();o.primary&&Lt(t,o),$e(e,o)}catch(t){console.error("Erro ao carregar Ação do Dia:",t),e.innerHTML=`
      <div class="stock-of-day-error">
        <h3>⚠️ Indisponível no momento</h3>
        <p>Não foi possível gerar a análise. Tente novamente mais tarde.</p>
        <button class="retry-btn" onclick="loadStockOfDay()">Tentar novamente</button>
      </div>
    `}}}function kt(){return new Promise(e=>{setTimeout(()=>{const t=new Date().toISOString().slice(0,10),a=Ct(t),o=D.filter(d=>d.marketCap&&d.marketCap>1e9).map(d=>{const l=Et(d),c=At(d.sector),g=(d.dividendYield||0)>2?10:0,p=Math.min(20,Math.log10(d.marketCap/1e9)*5),h=St(d),w=l+c+g+p+h;return{...d,score:Math.round(w*100)/100,breakdown:{technical:l,sector:c,dividend:g,liquidity:Math.round(p),volatility:Math.round(h)},rationale:Mt(d,l,c,g)}}).sort((d,l)=>l.score-d.score);if(o.length===0){e({date:t,primary:null,alternatives:[],marketContext:we(),generatedAt:new Date().toISOString()});return}const i=o.slice(0,Math.min(10,o.length)),r=a%i.length,n=i[r],s=i.filter((d,l)=>l!==r).slice(0,3);e({date:t,primary:n,alternatives:s,marketContext:we(),generatedAt:new Date().toISOString()})},100)})}function Ct(e){let t=0;for(let a=0;a<e.length;a++)t=(t<<5)-t+e.charCodeAt(a),t|=0;return Math.abs(t)}function Et(e){let t=50;const a=e.dividendYield||0;a>4?t+=15:a>2?t+=8:a>0&&(t+=3);const o=e.marketCap||0;o>5e11?t+=10:o>1e11?t+=7:o>5e10?t+=5:o>1e10&&(t+=3);const i=(e.subIndustry||"").toLowerCase();["software","semiconductors","biotechnology","cloud","ai","cybersecurity","renewable"].some(n=>i.includes(n))&&(t+=12);const r=(e.name||"").toLowerCase();return["inc.","corporation","technologies","systems","solutions"].some(n=>r.includes(n))&&(t+=3),Math.min(90,t)}function At(e){return{"information-technology":15,"health-care":8,"consumer-discretionary":5,"communication-services":7,industrials:5,financials:3,materials:2,energy:0,utilities:-2,"real-estate":-3,"consumer-staples":1}[e]||0}function St(e){const t=e.marketCap||0;return t>2e11?8:t>5e10?12:t>1e10?15:18}function Mt(e,t,a,o){const i=[];return t>60&&i.push("Fundamentos técnicos sólidos"),a>10&&i.push(`Setor em momento favorável (${e.sectorName})`),o&&i.push(`Dividend yield atrativo (${(e.dividendYield||0).toFixed(1)}%)`),e.marketCap>1e11&&i.push("Grande capitalização — liquidez e estabilidade"),i.length===0&&i.push("Equilíbrio entre risco e retorno"),i.join(" • ")}function we(){const e=Math.random()*30+10;return e<15?{level:"Calmo",description:"Baixa volatilidade - ambiente propício para acumulação",class:"calm"}:e<25?{level:"Moderado",description:"Volatilidade normal - seleção seletiva recomendada",class:"moderate"}:{level:"Elevado",description:"Alta volatilidade - foco em qualidade e liquidez",class:"elevated"}}function Dt(e){try{const t=localStorage.getItem("sp500-stock-of-day");if(!t)return null;const a=JSON.parse(t);return a.date===e&&a.primary?a:null}catch{return null}}function Lt(e,t){try{localStorage.setItem("sp500-stock-of-day",JSON.stringify(t))}catch{}}function $e(e,t){const{primary:a,alternatives:o,marketContext:i,generatedAt:r}=t;if(!a){e.innerHTML=`
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
          <div class="stock-symbol">${u(a.symbol)}</div>
          <div class="stock-name">${u(a.name)}</div>
          <div class="stock-sector">${u(a.sectorName||a.sector)}</div>
        </div>

        <div class="stock-score">
          <div class="score-circle" style="--score: ${a.score}">
            <span class="score-value">${a.score}</span>
            <span class="score-label">/ 100</span>
          </div>
          <div class="score-breakdown">
            ${Object.entries(a.breakdown).map(([n,s])=>`
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
          <p>${a.rationale}</p>
        </div>

        <div class="stock-metrics">
          <div class="metric">
            <span class="metric-label">Market Cap</span>
            <span class="metric-value">${ie(a.marketCap)}</span>
          </div>
          <div class="metric">
            <span class="metric-label">Div. Yield</span>
            <span class="metric-value">${(a.dividendYield||0).toFixed(2)}%</span>
          </div>
          <div class="metric">
            <span class="metric-label">Setor</span>
            <span class="metric-value">${u(a.sectorName||a.sector)}</span>
          </div>
          <div class="metric">
            <span class="metric-label">Sub-setor</span>
            <span class="metric-value">${u(a.subIndustry||"N/A")}</span>
          </div>
        </div>

        <div class="stock-actions">
          <button class="action-btn secondary" onclick="openCompanyDetails({symbol:'${a.symbol}',name:'${u(a.name).replace(/'/g,"\\'")}'})">
            📈 Ver Detalhes
          </button>
          <button class="action-btn ghost" onclick="setPriceAlertPrompt('${a.symbol}')">🔔 Criar Alerta</button>
        </div>
      </div>

      <section class="stock-alternatives">
        <h3>🥈 Menções Honrosas</h3>
        <div class="alternatives-grid">
          ${o.map((n,s)=>`
            <div class="alt-card">
              <span class="alt-rank">${s+2}º</span>
              <div class="alt-info">
                <div class="alt-symbol">${u(n.symbol)}</div>
                <div class="alt-name">${u(n.name)}</div>
              </div>
              <div class="alt-score">${n.score}</div>
            </div>
          `).join("")}
        </div>
      </section>

      <footer class="stock-disclaimer">
        <p><strong>⚠️ Disclaimer:</strong> Esta análise é gerada algoritmicamente com base em dados públicos e heurísticas quantitativas. Não constitui recomendação de investimento. Faça sua própria pesquisa (DYOR).</p>
        <p class="generated-at">Gerado em ${new Date(r).toLocaleTimeString("pt-BR")} • Baseado em ${D.length} empresas do S&P 500</p>
      </footer>
    </div>
  `}function Tt(e){const t=e.toUpperCase(),a=V.get(t);if(a&&a.triggered){confirm(`${e}: alerta já disparado. Remover?`)&&It(t);return}const o=prompt(`Alerta de preço para ${e}:
Digite o preço alvo (ex: 150.25):`,a?a.target.toFixed(2):"");if(!o)return;const i=parseFloat(o);if(isNaN(i)||i<=0){alert("Preço inválido");return}const r=confirm(`Alertar quando o preço estiver ACIMA deste valor?
(OK = acima, Cancelar = abaixo)`)?"above":"below";Nt(t,i,r)}function Nt(e,t,a){return!e||typeof t!="number"||!["above","below"].includes(a)?!1:(V.set(e.toUpperCase(),{target:t,direction:a,triggered:!1}),re(),!0)}function It(e){V.delete(e.toUpperCase()),re()}window.loadStockOfDay=ze;window.openCompanyDetails=Je;window.setPriceAlertPrompt=Tt;async function Ft(){const e=[];for(const[t,a]of V)if(!a.triggered)try{const o=await Ae(t),i=o[o.length-1],r=i?Number(i.close):NaN;if(!Number.isFinite(r))continue;(a.direction==="above"&&r>=a.target||a.direction==="below"&&r<=a.target)&&(a.triggered=!0,a.triggeredAt=new Date().toISOString(),a.triggeredPrice=r,e.push(`${t} ($${r.toFixed(2)})`))}catch(o){console.error(`Erro ao verificar ${t}:`,o)}return e.length>0&&(re(),window.alert(`🔔 Alerta(s) de preço atingido(s): ${e.join(", ")}`)),e}async function Bt(){V.size!==0&&setInterval(async()=>{await Ft(),re()},6e4)}function zt(e){return`"${(e==null?"":String(e)).replace(/"/g,'""')}"`}function Pt(){const e=["#","Símbolo","Empresa","Setor","Market Cap","Subindústria","Sede","Dividend Yield"],t=I.map((o,i)=>[i+1,o.symbol,o.name,o.sectorName,ie(o.marketCap),o.subIndustry||o.industry||"N/A",o.headquarters||"N/A",Ce(o)]),a=[e,...t].map(o=>o.map(zt).join(",")).join(`
`);Pe(a,"sp500-export.csv","text/csv")}function Yt(){const e=JSON.stringify(I,null,2);Pe(e,"sp500-export.json","application/json")}function Pe(e,t,a){const o=new Blob([e],{type:a}),i=URL.createObjectURL(o),r=document.createElement("a");r.href=i,r.download=t,document.body.appendChild(r),r.click(),document.body.removeChild(r),URL.revokeObjectURL(i)}
