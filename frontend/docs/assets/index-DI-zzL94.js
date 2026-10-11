(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))o(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const n of s.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&o(n)}).observe(document,{childList:!0,subtree:!0});function a(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function o(r){if(r.ep)return;r.ep=!0;const s=a(r);fetch(r.href,s)}})();const ge=window.location.hostname,U=ge==="localhost"||ge==="127.0.0.1"?"http://localhost:5001":"https://sp500-site-production.up.railway.app",le=[{id:"communication-services",name:"Communication Services"},{id:"consumer-discretionary",name:"Consumer Discretionary"},{id:"consumer-staples",name:"Consumer Staples"},{id:"energy",name:"Energy"},{id:"financials",name:"Financials"},{id:"health-care",name:"Health Care"},{id:"industrials",name:"Industrials"},{id:"information-technology",name:"Information Technology"},{id:"materials",name:"Materials"},{id:"real-estate",name:"Real Estate"},{id:"utilities",name:"Utilities"}];window.API_BASE_URL=U;window.SECTORS=le;let q=[],h=null,re=0,pe="",Ee="alfabética";async function je(){try{const e=document.getElementById("daily-curiosity-view");if(!e){console.error("Elemento daily-curiosity-view não encontrado");return}e.innerHTML='<div class="curiosidade-loading">Carregando curiosidade...</div>';const t=await fetch(`${U}/api/curiosidades`);if(!t.ok){console.error(`Erro ao buscar curiosidades: ${t.status}`),e.innerHTML=`<div class="curiosidade-erro">Erro ao carregar curiosidades (${t.status})</div>`;return}const a=await t.json();if(!a.sucesso||!a.dados||!a.dados.curiosidades){console.error("Dados de curiosidades inválidos:",a),e.innerHTML='<div class="curiosidade-erro">Formato de dados inválido</div>';return}if(q=a.dados.curiosidades,re=a.dados.total||q.length,pe=a.dados.proximaEmpresa||"",Ee=a.dados.ordem||"alfabética",q.length===0){e.innerHTML='<div class="curiosidade-erro">Nenhuma curiosidade disponível</div>';return}qe(),Ve()}catch(e){console.error("Erro ao carregar curiosidades:",e);const t=document.getElementById("daily-curiosity-view");t&&(t.innerHTML=`<div class="curiosidade-erro">Erro ao carregar: ${e.message}</div>`)}}function qe(){if(q.length===0)return;const e=new Date,t=new Date(e.getFullYear(),e.getMonth(),e.getDate()),o=Math.floor(t.getTime()/864e5)%q.length;h=q[o]}function Ve(){const e=document.getElementById("daily-curiosity-view");if(!e||!h){console.error("View ou curiosidade não encontrada");return}Ue();const t=`
    <div class="curiosidade-container">
      <div class="curiosidade-header">
        <h1>🌟 Curiosidade do Dia</h1>
        <p class="curiosidade-data">${_e()}</p>
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
                ${h.fatos.map(a=>`<li>${a}</li>`).join("")}
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
                <span>Rotatividade diária · ordem ${Ee}</span>
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
        ${pe?`<p class="curiosidade-proxima">⏭️ Amanhã: ${pe}</p>`:""}
        <p class="curiosidade-dica">💡 Uma empresa diferente a cada dia, em ordem alfabética do S&P 500!</p>
      </div>
    </div>
  `;e.innerHTML=t,window.compartilharCuriosidade=Je}function Ue(){if(document.getElementById("curiosidade-styles"))return;const e=document.createElement("style");e.id="curiosidade-styles",e.textContent=`
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
  `,document.head.appendChild(e)}function Je(){if(!h)return;const e=(h.fatos||[]).map(a=>`• ${a}`).join(`
`),t=`🌟 Curiosidade do Dia: ${h.empresa} (${h.simbolo})

${h.descricao}

${e}

💡 ${h.insight||""}`;navigator.share?navigator.share({title:`Curiosidade do Dia - ${h.empresa}`,text:t,url:window.location.href}).catch(a=>console.error("Erro ao compartilhar:",a)):navigator.clipboard.writeText(t).then(()=>{alert("Curiosidade copiada para a área de transferência!")}).catch(a=>{alert("Erro ao copiar: "+a)})}function _e(){const e=new Date,t={weekday:"long",year:"numeric",month:"long",day:"numeric"};return e.toLocaleDateString("pt-BR",t)}function ie(e){const t=Number(e);return!t||Number.isNaN(t)?"N/A":t>=1e12?`$${(t/1e12).toFixed(3)}T`:t>=1e9?`$${(t/1e9).toFixed(2)}B`:t>=1e6?`$${(t/1e6).toFixed(2)}M`:`$${t.toLocaleString("en-US")}`}function Se(e){if(!e||e.hasDividend==="Não")return"N/A";const t=Number(e.dividendYield);return Number.isFinite(t)?`${t.toFixed(2)}%`:"N/A"}function u(e){return e?String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;"):""}const Ge=new Set(["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming","D.C."]);function Ae(e){if(!e)return"Desconhecido";const t=String(e).split(",").map(o=>o.trim().replace(/\[\d+\]$/,"")),a=t[t.length-1];return!a||a.toLowerCase()==="none"?"Desconhecido":Ge.has(a)?"United States":a}async function De(e){try{const t=await fetch(`${U}/api/historico/${e}`);if(!t.ok)throw new Error(`Erro ao buscar histórico de ${e}`);return(await t.json()).registros||[]}catch(t){return console.error(`Erro ao buscar histórico de ${e}:`,t),[]}}const ae=760,de=320,$={top:28,right:28,bottom:44,left:68};function Ke(e){if(!e)return"";const[t,a,o]=e.split("-");return`${o}/${a}/${t.slice(2)}`}function ue(e){return Number.isFinite(e)?e>=100?`$${e.toFixed(0)}`:`$${e.toFixed(2)}`:"—"}function We(e){const t=e.map(f=>f.close),a=Math.min(...t),o=Math.max(...t),r=o-a||1,s=a-r*.08,n=o+r*.08,i=e.length,d=f=>$.left+f/(i-1)*(ae-$.left-$.right),l=f=>$.top+(1-(f-s)/(n-s))*(de-$.top-$.bottom);let p=`<svg viewBox="0 0 ${ae} ${de}" style="width:100%;height:auto;display:block;background:var(--plot-bg);border-radius:8px">`;const m=5;for(let f=0;f<=m;f++){const y=s+(n-s)*f/m,C=l(y);p+=`<line x1="${$.left}" y1="${C.toFixed(1)}" x2="${ae-$.right}" y2="${C.toFixed(1)}" stroke="var(--chart-axis)" stroke-width="1"/>`,p+=`<text x="${$.left-8}" y="${(C+4).toFixed(1)}" text-anchor="end" font-size="11" fill="var(--chart-label)">${ue(y)}</text>`}const c=[];for(let f=0;f<=4;f++)c.push(Math.round((i-1)*f/4));c.forEach(f=>{const y=d(f);p+=`<text x="${y.toFixed(1)}" y="${de-$.bottom+18}" text-anchor="middle" font-size="11" fill="var(--chart-label)">${Ke(e[f].data)}</text>`});const b=e.map((f,y)=>`${d(y).toFixed(1)},${l(f.close).toFixed(1)}`).join(" "),w=`${$.left},${l(s).toFixed(1)} `+b+` ${d(i-1).toFixed(1)},${l(s).toFixed(1)}`;p+=`<polygon points="${w}" fill="rgba(0, 212, 255, 0.08)"/>`,p+=`<polyline points="${b}" fill="none" stroke="var(--accent-cyan)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;const k=e[i-1],g=l(k.close);return p+=`<circle cx="${d(i-1).toFixed(1)}" cy="${g.toFixed(1)}" r="4" fill="var(--accent-cyan)"/>`,p+=`<text x="${ae-$.right}" y="${(g-10).toFixed(1)}" text-anchor="end" font-size="12" font-weight="700" fill="var(--chart-text)">${ue(k.close)}</text>`,p+="</svg>",p}async function Ze(e,t){var r;(r=document.querySelector(".modal-overlay"))==null||r.remove();const a=document.createElement("div");a.className="modal-overlay";const o=()=>a.remove();a.addEventListener("click",s=>{s.target===a&&o()}),document.addEventListener("keydown",s=>{s.key==="Escape"&&o()}),a.innerHTML=`
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
  `,document.body.appendChild(a),a.querySelector(".modal-close").addEventListener("click",o);try{const s=await De(e),n=a.querySelector("#price-chart-body");if(!s||s.length===0){n.innerHTML=`<p class="modal-error">Nenhum dado de preço disponível para ${u(e)}.</p>`;return}const i=s[0].close,d=s[s.length-1].close,l=(d-i)/i*100,p=l>=0,m=p?"positive":"negative";n.innerHTML=`
      <div class="price-stats">
        <div class="price-stat">
          <span class="price-stat-label">Último</span>
          <strong>${ue(d)}</strong>
        </div>
        <div class="price-stat">
          <span class="price-stat-label">Variação (2a)</span>
          <strong class="${m}">${p?"+":""}${l.toFixed(2)}%</strong>
        </div>
        <div class="price-stat">
          <span class="price-stat-label">Período</span>
          <strong>${s.length} pregões</strong>
        </div>
      </div>
      ${We(s)}
    `}catch(s){console.error(`Erro ao buscar histórico de ${e}:`,s);const n=a.querySelector("#price-chart-body");n.innerHTML=`<p class="modal-error">Erro ao carregar o histórico de ${u(e)}. Verifique se o backend está online.</p>`}}function D(e,t){return`
    <div class="company-detail">
      <span class="company-detail-label">${e}</span>
      <strong class="company-detail-value">${t}</strong>
    </div>
  `}function Xe(e){var s;(s=document.querySelector(".modal-overlay"))==null||s.remove();const t=document.createElement("div");t.className="modal-overlay";const a=()=>t.remove();t.addEventListener("click",n=>{n.target===t&&a()}),document.addEventListener("keydown",n=>{n.key==="Escape"&&a()});const o=e.dividendYield!==null&&e.dividendYield!==void 0?`${e.dividendYield.toFixed(2)}%`:"—",r=ie(e.marketCap);t.innerHTML=`
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
          ${D("Empresa",u(e.name||"N/A"))}
          ${D("Setor",u(e.sectorName||e.sector||"N/A"))}
          ${D("Subindústria",u(e.subIndustry||"N/A"))}
          ${D("Sede",u(e.headquarters||"N/A"))}
          ${D("Market Cap",r)}
          ${D("Classificação",u(e.marketCapClassification||"N/A"))}
          ${D("Div. Yield",o)}
          ${D("Paga dividendos",e.hasDividend?u(e.hasDividend):"—")}
          ${D("Data de inclusão",u(e.dateAdded||"N/A"))}
          ${D("CIK",e.cik?u(String(e.cik)):"N/A")}
          ${D("Fundação",u(e.founded||"N/A"))}
        </div>
        <div class="modal-footer">
          <button class="modal-action" id="details-chart-btn">📈 Ver histórico de preços</button>
        </div>
      </div>
    </div>
  `,document.body.appendChild(t),t.querySelector(".modal-close").addEventListener("click",a),t.querySelector("#details-chart-btn").addEventListener("click",()=>{Ze(e.symbol,e.name)})}function Qe(e,t){const a=e/t*100;return a>=80?"#ff5252":a>=60?"#ff9800":a>=40?"#ffeb3b":a>=20?"#8bc34a":"#4caf50"}async function et(){const e=document.getElementById("treemap-view");if(e){e.style.display="flex",e.style.flexDirection="column",e.style.height="100%",e.style.width="100%",e.style.margin="0",e.style.padding="0",e.style.background="var(--bg-primary)",e.innerHTML='<div style="display:flex;align-items:center;justify-content:center;height:100%;width:100%;font-size:14px;color:var(--text-secondary)">Carregando mapa de setores...</div>';try{const o=(await(await fetch(`${window.API_BASE_URL}/api/setores`)).json()).setores||[],r=await Promise.all(o.map(async i=>{var k;const l=await(await fetch(`${window.API_BASE_URL}/api/setor/${i}`)).json(),p=window.SECTORS.find(g=>g.id===i),m=((k=l.dados)==null?void 0:k.companies)||[],c=m.reduce((g,f)=>g+(f.marketCap||0),0),b=m.length>0?m.reduce((g,f)=>g+(f.dividendYield||0),0)/m.length:0,w=m.filter(g=>g.hasDividend==="Sim").length;return{id:i,name:(p==null?void 0:p.name)||i,cap:(c/1e9).toFixed(1),companies:m.length,avgDiv:parseFloat(b.toFixed(2)),withDiv:w,topCompany:m.length>0?m[0].symbol:"N/A"}})),s=Math.max(...r.map(i=>parseFloat(i.cap)));let n=`
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
    `;r.forEach(i=>{const d=Qe(parseFloat(i.cap),s),l=(parseFloat(i.cap)/s*100).toFixed(1),p=["consumer-staples","communication-services","consumer-discretionary","energy","financials","health-care","industrials","information-technology","materials","real-estate","utilities"].includes(i.id),m=p?new URL(`sector.html?sector=${i.id}`,document.baseURI).href:"#";n+=`
        <div style="
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 24px;
          transition: all 0.3s ease;
          cursor: ${p?"pointer":"not-allowed"};
          display: flex;
          flex-direction: column;
          gap: 20px;
          opacity: ${p?"1":"0.7"};
        "
        onmouseover="${p?`this.style.borderColor='${d}';this.style.background='rgba(${parseInt(d.slice(1,3),16)},${parseInt(d.slice(3,5),16)},${parseInt(d.slice(5,7),16)},0.05)';this.style.transform='translateY(-4px)';this.style.boxShadow='0 12px 32px ${d}22'`:""}"
        onmouseout="${p?"this.style.borderColor='var(--border)';this.style.background='var(--bg-secondary)';this.style.transform='translateY(0)';this.style.boxShadow='none'":""}"
        onclick="${p?`navigateToSector('${m}', '${i.id}')`:`alert('🔒 O setor \\"${i.name}\\" ainda está em desenvolvimento.\\n\\nApenas Consumer Staples, Communication Services, Consumer Discretionary, Energy, Financials, Health Care, Industrials, Information Technology, Materials, Real Estate e Utilities estão disponíveis por enquanto!')`}"
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
          ${p?`
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
    `,e.innerHTML=n}catch(t){console.error("Erro ao carregar treemap:",t),e.innerHTML='<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--accent-red)">Erro ao carregar mapa de setores</div>'}}}function tt(e,t){if(e==="#"){alert(`🔒 O setor "${t}" ainda está em desenvolvimento.

Apenas Consumer Staples, Communication Services, Consumer Discretionary, Energy, Financials, Health Care, Industrials, Information Technology, Materials, Real Estate e Utilities estão disponíveis por enquanto!`);return}window.open(e,"_blank")}window.navigateToSector=tt;async function at(){var t;const e=document.getElementById("heatmap-view");if(e){e.style.display="flex",e.style.flexDirection="column",e.style.height="100%",e.style.width="100%",e.style.padding="40px",e.style.boxSizing="border-box",e.style.background="var(--bg-primary)",e.style.overflowY="auto",e.innerHTML='<div style="text-align:center;color:var(--text-secondary)">Carregando heatmap...</div>';try{const r=(await(await fetch(`${window.API_BASE_URL}/api/setores`)).json()).setores||[];let s=`
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
    `;for(const n of r){const d=await(await fetch(`${window.API_BASE_URL}/api/setor/${n}`)).json(),l=window.SECTORS.find(c=>c.id===n),p=((t=d.dados)==null?void 0:t.companies)||[];if(p.length===0)continue;const m=p.sort((c,b)=>(b.marketCap||0)-(c.marketCap||0)).slice(0,4);s+=`
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
      `,m.forEach((c,b)=>{const w=(c.marketCap/1e9).toFixed(2),k=(c.dividendYield||0).toFixed(2);let g="#4caf50";w>500?g="#ff5252":w>200?g="#ff9800":w>100?g="#ffeb3b":w>50&&(g="#8bc34a"),s+=`
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
                #${b+1}
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
    `,e.innerHTML=s}catch(a){console.error("Erro ao carregar heatmap:",a),e.innerHTML=`
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
    `}}}const ot={Energy:"#FF6B6B",Materials:"#C92A2A",Industrials:"#FFA94D","Consumer Discretionary":"#FFD43B","Consumer Staples":"#A9E34B","Health Care":"#51CF66",Financials:"#40C057","Information Technology":"#339AF0","Communication Services":"#748FFC",Utilities:"#9775FA","Real Estate":"#DA77F2"};function Me(e){return ot[e]||"#808080"}function fe(e){if(!e)return 0;if(typeof e=="number")return e;const a=String(e).toUpperCase().trim().replace(/[$€¥₹]/g,"").trim();return a.includes("T")?parseFloat(a.replace("T",""))*1e12:a.includes("B")?parseFloat(a.replace("B",""))*1e9:a.includes("M")?parseFloat(a.replace("M",""))*1e6:parseFloat(a)||0}function rt(e){if(!e)return 0;if(typeof e=="number")return e;const t=String(e).trim();return parseFloat(t.replace("%",""))||0}function st(e,t){const a=document.getElementById(t);if(!a){console.error(`❌ Contentor ${t} não encontrado!`);return}a.innerHTML="";const o=e.filter(v=>fe(v.marketCap)>0&&v.sectorName).map((v,T)=>({symbol:v.symbol,name:v.name,sector:v.sectorName,marketCap:fe(v.marketCap),dividendYield:rt(v.dividendYield),index:T}));if(o.length===0){a.innerHTML="<p>Sem dados disponíveis para o gráfico de bolhas.</p>";return}const r={top:40,right:40,bottom:60,left:60},s=Math.max(window.innerWidth-100,800)-r.left-r.right,n=600-r.top-r.bottom,i=Math.min(...o.map(v=>v.dividendYield)),d=Math.max(...o.map(v=>v.dividendYield)),l=Math.min(...o.map(v=>v.marketCap)),p=Math.max(...o.map(v=>v.marketCap)),m=v=>n-(v-i)/(d-i||1)*n,c=v=>5+(v-l)/(p-l||1)*50,b=(()=>{let v=42;return()=>(v=(v*9301+49297)%233280,v/233280)})(),w=o.map(()=>b()*s),k=document.createElementNS("http://www.w3.org/2000/svg","svg");k.setAttribute("width",s+r.left+r.right),k.setAttribute("height",n+r.top+r.bottom),k.style.cssText="display: block; margin: 20px auto; background: var(--plot-bg); border-radius: 8px;";const g=document.createElementNS("http://www.w3.org/2000/svg","g");g.setAttribute("transform",`translate(${r.left},${r.top})`);for(let v=0;v<=10;v++){const T=v/10*n,te=i+v/10*(d-i),E=document.createElementNS("http://www.w3.org/2000/svg","line");E.setAttribute("x1",0),E.setAttribute("y1",T),E.setAttribute("x2",s),E.setAttribute("y2",T),E.setAttribute("stroke","var(--chart-axis)"),E.setAttribute("stroke-width","1"),E.setAttribute("stroke-dasharray","4"),g.appendChild(E);const S=document.createElementNS("http://www.w3.org/2000/svg","text");S.setAttribute("x",-10),S.setAttribute("y",T+5),S.setAttribute("text-anchor","end"),S.setAttribute("font-size","12"),S.setAttribute("fill","var(--chart-label)"),S.textContent=te.toFixed(1)+"%",g.appendChild(S)}const f=document.createElementNS("http://www.w3.org/2000/svg","line");f.setAttribute("x1",0),f.setAttribute("y1",0),f.setAttribute("x2",0),f.setAttribute("y2",n),f.setAttribute("stroke","var(--chart-label)"),f.setAttribute("stroke-width","2"),g.appendChild(f);const y=document.createElementNS("http://www.w3.org/2000/svg","text");y.setAttribute("transform","rotate(-90)"),y.setAttribute("y",-40),y.setAttribute("x",-n/2),y.setAttribute("text-anchor","middle"),y.setAttribute("font-size","14"),y.setAttribute("font-weight","bold"),y.setAttribute("fill","var(--chart-text)"),y.textContent="💵 Dividend Yield (%)",g.appendChild(y);const C=document.createElementNS("http://www.w3.org/2000/svg","line");C.setAttribute("x1",0),C.setAttribute("y1",n),C.setAttribute("x2",s),C.setAttribute("y2",n),C.setAttribute("stroke","var(--chart-label)"),C.setAttribute("stroke-width","2"),g.appendChild(C);const B=document.createElementNS("http://www.w3.org/2000/svg","text");B.setAttribute("x",s/2),B.setAttribute("y",n+45),B.setAttribute("text-anchor","middle"),B.setAttribute("font-size","14"),B.setAttribute("font-weight","bold"),B.setAttribute("fill","var(--chart-text)"),B.textContent="📊 Distribuição Aleatória (cada bolha = empresa)",g.appendChild(B),o.forEach((v,T)=>{const te=w[T],E=m(v.dividendYield),S=c(v.marketCap),Re=Me(v.sector),x=document.createElementNS("http://www.w3.org/2000/svg","circle");if(x.setAttribute("cx",te),x.setAttribute("cy",E),x.setAttribute("r",S),x.setAttribute("fill",Re),x.setAttribute("opacity","0.7"),x.setAttribute("stroke","#fff"),x.setAttribute("stroke-width","2"),x.style.cursor="pointer",x.style.transition="all 0.3s ease",x.addEventListener("mouseover",A=>{x.setAttribute("opacity","1"),x.setAttribute("stroke-width","3"),nt(A,v)}),x.addEventListener("mouseout",()=>{x.setAttribute("opacity","0.7"),x.setAttribute("stroke-width","2"),Te()}),g.appendChild(x),S>15){const A=document.createElementNS("http://www.w3.org/2000/svg","text");A.setAttribute("x",te),A.setAttribute("y",E+5),A.setAttribute("text-anchor","middle"),A.setAttribute("font-size",Math.max(10,S/2)),A.setAttribute("font-weight","bold"),A.setAttribute("fill","#fff"),A.setAttribute("pointer-events","none"),A.textContent=v.symbol.substring(0,3),g.appendChild(A)}}),k.appendChild(g),a.appendChild(k),it(a,o)}function it(e,t){const a=document.createElement("div");a.style.cssText=`
    margin: 30px auto;
    max-width: 800px;
    padding: 20px;
    background: var(--surface);
    border-radius: 8px;
    border: 1px solid var(--border);
  `;const o=document.createElement("h3");o.textContent="🫧 Como ler o gráfico",o.style.cssText="margin: 0 0 12px 0; color: var(--text-primary);",a.appendChild(o);const r=document.createElement("div");r.style.cssText="margin-bottom: 16px; font-size: 13px; color: var(--text-secondary); line-height: 1.8;",r.innerHTML=`
    <div><strong>Tamanho da bolha:</strong> Market Cap da empresa (quanto maior, mais valiosa)</div>
    <div><strong>Eixo Y (vertical):</strong> Dividend Yield (mais acima = maior dividendo)</div>
    <div><strong>Eixo X (horizontal):</strong> posição aleatória, apenas para facilitar a visualização</div>
    <div><strong>Cor:</strong> setor da empresa</div>
  `,a.appendChild(r);const s=document.createElement("div");s.textContent="Setores",s.style.cssText="font-size: 13px; font-weight: 600; color: var(--text-primary); margin-bottom: 8px;",a.appendChild(s);const n=new Set(t.map(d=>d.sector)),i=document.createElement("div");i.style.cssText="display: flex; flex-wrap: wrap; gap: 12px;",n.forEach(d=>{const l=document.createElement("div");l.style.cssText="display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text-primary);";const p=document.createElement("span");p.style.cssText=`display: inline-block; width: 14px; height: 14px; border-radius: 50%; background: ${Me(d)};`;const m=document.createElement("span");m.textContent=d,l.appendChild(p),l.appendChild(m),i.appendChild(l)}),a.appendChild(i),e.appendChild(a)}let se=null;function nt(e,t){Te();const a=document.createElement("div");a.style.cssText=`
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
  `;const r=e.target.getBoundingClientRect();a.style.left=r.left+10+"px",a.style.top=r.top-10+"px",document.body.appendChild(a),se=a}function Te(){se&&(se.remove(),se=null)}function I(e){const t=Number(e&&e.dividendYield);return Number.isFinite(t)&&t>0?t:0}function ee(e){return(e||[]).filter(t=>I(t)>0)}function dt(e){const t=ee(e);return t.length===0?0:t.reduce((o,r)=>o+I(r),0)/t.length}function ct(e){const t=ee(e).map(I).sort((o,r)=>o-r);if(t.length===0)return 0;const a=Math.floor(t.length/2);return t.length%2===0?(t[a-1]+t[a])/2:t[a]}function lt(e){const t=e||[],a=ee(t),o=a.map(I);return{total:t.length,payers:a.length,nonPayers:t.length-a.length,payerRatio:t.length>0?a.length/t.length:0,avgYield:dt(t),medianYield:ct(t),maxYield:o.length>0?Math.max(...o):0}}function pt(e,t=15){return ee(e).slice().sort((a,o)=>I(o)-I(a)||String(a.symbol).localeCompare(String(o.symbol))).slice(0,t)}const ut=[{label:"0–1%",min:0,max:1},{label:"1–2%",min:1,max:2},{label:"2–3%",min:2,max:3},{label:"3–4%",min:3,max:4},{label:"4–5%",min:4,max:5},{label:"5%+",min:5,max:1/0}];function mt(e){const t=ee(e);return ut.map(a=>({label:a.label,count:t.filter(o=>{const r=I(o);return r>=a.min&&r<a.max}).length}))}function vt(e){const t=new Map;for(const a of e||[]){const o=a.sectorName||a.sector||"N/A";t.has(o)||t.set(o,{sector:o,total:0,payers:0,yieldSum:0});const r=t.get(o);r.total+=1;const s=I(a);s>0&&(r.payers+=1,r.yieldSum+=s)}return Array.from(t.values()).map(a=>({sector:a.sector,total:a.total,payers:a.payers,avgYield:a.payers>0?a.yieldSum/a.payers:0})).sort((a,o)=>o.avgYield-a.avgYield||a.sector.localeCompare(o.sector))}const _=e=>`${Number(e).toFixed(2)}%`,he=e=>`${(e*100).toFixed(0)}%`;function gt(e,t){const a=document.getElementById(t);if(!a){console.error(`❌ Contentor ${t} não encontrado!`);return}const o=e||[];if(o.length===0){a.innerHTML='<div class="treemap-container"><p>Sem dados disponíveis para o painel de dividendos.</p></div>';return}const r=lt(o),s=pt(o),n=mt(o),i=vt(o),d=Math.max(1,...n.map(c=>c.count)),l=s.map((c,b)=>`
      <tr class="dividend-row" data-dividend-symbol="${u(c.symbol)}" data-dividend-name="${u(c.name||c.symbol)}">
        <td class="col-index">${b+1}</td>
        <td><strong>${u(c.symbol)}</strong></td>
        <td>${u(c.name||"N/A")}</td>
        <td>${u(c.sectorName||c.sector||"N/A")}</td>
        <td class="dividend-yield">${_(I(c))}</td>
      </tr>`).join(""),p=n.map(c=>`
      <div class="dividend-bucket">
        <span class="dividend-bucket-label">${c.label}</span>
        <div class="dividend-bucket-track">
          <div class="dividend-bucket-fill" style="width: ${c.count/d*100}%"></div>
        </div>
        <span class="dividend-bucket-count">${c.count}</span>
      </div>`).join(""),m=i.map(c=>`
      <tr>
        <td>${u(c.sector)}</td>
        <td class="col-index">${c.payers} / ${c.total}</td>
        <td class="dividend-yield">${_(c.avgYield)}</td>
      </tr>`).join("");a.innerHTML=`
    <div class="dividends-view">
      <header class="treemap-header">
        <h2>💰 Dividendos</h2>
        <p class="subtitle">
          Renda por dividendos no S&amp;P 500 — ${r.payers} de ${r.total} empresas
          pagam dividendos (${he(r.payerRatio)}).
        </p>
      </header>

      <div class="treemap-stats">
        <div class="stat-card">
          <span class="stat-label">Empresas</span>
          <span class="stat-value">${r.total}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Pagadoras</span>
          <span class="stat-value">${r.payers} (${he(r.payerRatio)})</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Yield médio</span>
          <span class="stat-value">${_(r.avgYield)}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Yield mediano</span>
          <span class="stat-value">${_(r.medianYield)}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Maior yield</span>
          <span class="stat-value">${_(r.maxYield)}</span>
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
          <div class="dividend-buckets">${p}</div>
          <p class="dividend-note">Considera apenas as ${r.payers} empresas pagadoras.</p>
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
  `,a.querySelectorAll(".dividend-row").forEach(c=>{c.addEventListener("click",()=>{typeof window.openCompanyDetails=="function"&&window.openCompanyDetails({symbol:c.dataset.dividendSymbol,name:c.dataset.dividendName})})})}const O=[{company:"3M",ticker:"MMM",sector:"Industrials"},{company:"American Express",ticker:"AXP",sector:"Financials"},{company:"Amgen",ticker:"AMGN",sector:"Health Care"},{company:"Apple",ticker:"AAPL",sector:"Information Technology"},{company:"Boeing",ticker:"BA",sector:"Industrials"},{company:"Caterpillar",ticker:"CAT",sector:"Industrials"},{company:"Chevron",ticker:"CVX",sector:"Energy"},{company:"Cisco Systems",ticker:"CSCO",sector:"Information Technology"},{company:"Coca-Cola",ticker:"KO",sector:"Consumer Staples"},{company:"Dow Inc.",ticker:"DOW",sector:"Materials"},{company:"Goldman Sachs",ticker:"GS",sector:"Financials"},{company:"Home Depot",ticker:"HD",sector:"Consumer Discretionary"},{company:"Honeywell",ticker:"HON",sector:"Industrials"},{company:"IBM",ticker:"IBM",sector:"Information Technology"},{company:"Intel",ticker:"INTC",sector:"Information Technology"},{company:"Johnson & Johnson",ticker:"JNJ",sector:"Health Care"},{company:"JPMorgan Chase",ticker:"JPM",sector:"Financials"},{company:"McDonald's",ticker:"MCD",sector:"Consumer Discretionary"},{company:"Merck",ticker:"MRK",sector:"Health Care"},{company:"Microsoft",ticker:"MSFT",sector:"Information Technology"},{company:"Nike",ticker:"NKE",sector:"Consumer Discretionary"},{company:"Procter & Gamble",ticker:"PG",sector:"Consumer Staples"},{company:"Salesforce",ticker:"CRM",sector:"Information Technology"},{company:"The Travelers Companies",ticker:"TRV",sector:"Financials"},{company:"UnitedHealth Group",ticker:"UNH",sector:"Health Care"},{company:"Verizon",ticker:"VZ",sector:"Communication Services"},{company:"Visa",ticker:"V",sector:"Financials"},{company:"Walgreens Boots Alliance",ticker:"WBA",sector:"Consumer Staples"},{company:"Walt Disney",ticker:"DIS",sector:"Communication Services"},{company:"Nvidia",ticker:"NVDA",sector:"Information Technology"}],ft={"Communication Services":"#00d4ff","Consumer Discretionary":"#ffab00","Consumer Staples":"#00e676",Energy:"#ff5252",Financials:"#ba68c8","Health Care":"#29b6f6",Industrials:"#ffa726","Information Technology":"#00d4ff",Materials:"#66bb6a","Real Estate":"#ec407a",Utilities:"#42a5f5"};function ht(e){return String(e||"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")}function bt(e){return ft[e]||"#00d4ff"}function Le(e){return`dow-sector--${ht(e)}`}function yt(e,{search:t="",sector:a=""}={}){const o=String(t).toLowerCase().trim();return(e||[]).filter(r=>{const s=!o||String(r.company).toLowerCase().includes(o)||String(r.ticker).toLowerCase().includes(o),n=!a||r.sector===a;return s&&n})}function xt(e,t="company"){return[...e||[]].sort((a,o)=>{switch(t){case"ticker":return a.ticker.localeCompare(o.ticker);case"sector":return a.sector.localeCompare(o.sector)||a.company.localeCompare(o.company);default:return a.company.localeCompare(o.company)}})}function be(e){return[...new Set((e||[]).map(t=>t.sector))].sort()}function wt(e){const t=new Map;return(e||[]).forEach(a=>{t.has(a.sector)||t.set(a.sector,[]),t.get(a.sector).push(a.company)}),[...t.entries()].map(([a,o])=>({sector:a,companies:o,count:o.length})).sort((a,o)=>o.count-a.count||a.sector.localeCompare(o.sector))}function kt(e){return(e||[]).filter(t=>t.sector==="Information Technology").length}function $t(e){return`<div class="dow-cards">${(e||[]).map(a=>`
      <article class="dow-card">
        <div class="dow-card-head">
          <h3>${u(a.company)}</h3>
          <span class="dow-ticker">${u(a.ticker)}</span>
        </div>
        <span class="dow-sector ${Le(a.sector)}">${u(a.sector)}</span>
      </article>`).join("")}</div>`}function Ct(e){return`
    <div class="dow-table-wrapper">
      <table class="dow-table">
        <thead>
          <tr>
            <th data-sort="company">Empresa</th>
            <th data-sort="ticker">Ticker</th>
            <th data-sort="sector">Setor</th>
          </tr>
        </thead>
        <tbody>${(e||[]).map(a=>`
      <tr>
        <td><strong>${u(a.company)}</strong></td>
        <td><span class="dow-ticker">${u(a.ticker)}</span></td>
        <td><span class="dow-sector ${Le(a.sector)}">${u(a.sector)}</span></td>
      </tr>`).join("")}</tbody>
      </table>
    </div>`}function Et(e="dow-jones-view"){const t=document.getElementById(e);if(!t){console.error(`❌ Contentor ${e} não encontrado!`);return}const a={search:"",sector:"",sortBy:"company",view:"cards"},o=be(O).length,r=be(O).map(c=>`<option value="${u(c)}">${u(c)}</option>`).join(""),s=wt(O).map(c=>`
      <div class="dow-breakdown-item">
        <div class="dow-breakdown-head" style="color: ${bt(c.sector)}">
          <span>${u(c.sector)}</span>
          <span class="dow-breakdown-count">${c.count}</span>
        </div>
        <p class="dow-breakdown-list">${c.companies.map(b=>u(b)).join(", ")}</p>
      </div>`).join("");t.innerHTML=`
    <div class="dow-jones-view">
      <header class="dow-header">
        <div class="dow-header-content">
          <h2>Dow Jones 30</h2>
          <p>📈 30 maiores empresas - índice blue chip dos EUA</p>
        </div>
        <div class="dow-stats">
          <div class="dow-stat">
            <span class="dow-stat-value">${O.length}</span>
            <span class="dow-stat-label">Empresas</span>
          </div>
          <div class="dow-stat">
            <span class="dow-stat-value">${o}</span>
            <span class="dow-stat-label">Setores</span>
          </div>
          <div class="dow-stat">
            <span class="dow-stat-value">${kt(O)}</span>
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
        <div class="dow-breakdown-grid">${s}</div>
      </section>

      <aside class="dow-info">
        <strong>💡 Sobre o Dow Jones Industrial Average (DJIA):</strong> um dos índices de ações
        mais antigos e respeitados do mundo, composto por 30 grandes empresas americanas. É
        frequentemente usado como indicador da saúde da economia dos EUA. As suas empresas são
        consideradas "blue chips" e o índice é ponderado por preço.
      </aside>
    </div>
  `;const n=t.querySelector("#dow-results"),i=t.querySelector("#dow-search"),d=t.querySelector("#dow-sector"),l=t.querySelector("#dow-sort"),p=t.querySelectorAll(".dow-view-btn");function m(){const c=xt(yt(O,{search:a.search,sector:a.sector}),a.sortBy);if(c.length===0){n.innerHTML='<p class="dow-empty">Nenhuma empresa encontrada.</p>';return}n.innerHTML=a.view==="table"?Ct(c):$t(c),a.view==="table"&&n.querySelectorAll("th[data-sort]").forEach(b=>{b.addEventListener("click",()=>{a.sortBy=b.dataset.sort,l&&(l.value=a.sortBy),m()})})}i&&i.addEventListener("input",()=>{a.search=i.value,m()}),d&&d.addEventListener("change",()=>{a.sector=d.value,m()}),l&&l.addEventListener("change",()=>{a.sortBy=l.value,m()}),p.forEach(c=>{c.addEventListener("click",()=>{a.view=c.dataset.view,p.forEach(b=>b.classList.toggle("active",b===c)),m()})}),m()}const St={bullish:{label:"Otimista",cls:"positive"},bearish:{label:"Pessimista",cls:"negative"},neutral:{label:"Neutro",cls:""}};async function At(e="daily-summary"){const t=document.getElementById(e);if(t){t.innerHTML='<p class="summary-empty">Carregando resumo do dia...</p>';try{const a=await fetch(`${U}/api/resumo-dia`);if(!a.ok)throw new Error(`HTTP ${a.status}`);const o=await a.json();Mt(t,o.dados||{})}catch(a){console.error("Erro ao carregar Resumo do Dia:",a),t.innerHTML='<p class="summary-empty">Resumo do dia indisponível no momento.</p>'}}}function Ie(e){const t=Number(e)||0;return`${t>0?"+":""}${t.toFixed(2)}%`}function Dt(e){if(!e)return"";const t=new Date(`${e}T00:00:00`);return Number.isNaN(t.getTime())?"":t.toLocaleDateString("pt-BR")}function ye(e,t){const a=(t||[]).map(o=>`
        <div class="summary-row">
          <span class="mini-symbol">${u(o.symbol||"")}</span>
          <span class="mini-name">${u(o.name||"")}</span>
          <span class="mini-change ${o.changePct>=0?"positive":"negative"}">${Ie(o.changePct)}</span>
        </div>`).join("");return`
    <div class="summary-list">
      <h4 class="summary-list-title">${e}</h4>
      ${a}
    </div>`}function Mt(e,t){const a=t.stats||{},o=St[t.marketMood]||{label:"—",cls:""},r=Dt(t.referenceDate),s=[{label:"Em alta",value:a.gainers??"—",cls:"positive"},{label:"Em baixa",value:a.losers??"—",cls:"negative"},{label:"Estáveis",value:a.neutral??"—",cls:""},{label:"Total",value:a.total??"—",cls:""},{label:"Humor",value:o.label,cls:o.cls}].map(i=>`
      <div class="daily-card ${i.cls}">
        <span class="daily-label">${i.label}</span>
        <span class="daily-value">${i.value}</span>
      </div>`).join(""),n=(t.sectorPerformance||[]).map(i=>`
      <div class="daily-sector-card ${i.avgChangePct>=0?"positive":"negative"}">
        <span class="sector-name">${u(i.name||"")}</span>
        <span class="sector-change">${Ie(i.avgChangePct)}</span>
      </div>`).join("");e.innerHTML=`
    <header class="daily-summary-header">
      <h2>📊 Resumo do Dia</h2>
      ${r?`<span class="daily-date">Referência: ${r}</span>`:""}
    </header>

    <div class="daily-summary-grid">${s}</div>

    <div class="daily-lists">
      ${ye("🚀 Maiores altas",t.topGainers)}
      ${ye("📉 Maiores baixas",t.topLosers)}
    </div>

    <div class="daily-sectors">
      <h3>📈 Desempenho por setor</h3>
      <div class="daily-sectors-list">${n}</div>
    </div>
  `}const Ne="sp500-price-alerts",me=50;function Tt(){try{const e=localStorage.getItem(Ne);if(!e)return[];const t=JSON.parse(e);return Array.isArray(t)&&t.length>0&&Array.isArray(t[0])?t:Array.isArray(t)&&t.length>0&&typeof t[0]=="object"?t.map(a=>[a.symbol,a]):[]}catch(e){return console.error("Erro ao carregar price alerts:",e),[]}}function ne(){try{const e=Array.from(J.entries());localStorage.setItem(Ne,JSON.stringify(e))}catch(e){console.error("Erro ao salvar price alerts:",e)}}function Lt(e,t){let a;return function(...r){const s=()=>{clearTimeout(a),e(...r)};clearTimeout(a),a=setTimeout(s,t)}}function ve(){const e=document.getElementById("nav-menu"),t=document.getElementById("menu-toggle");e&&e.classList.remove("open"),t&&t.setAttribute("aria-expanded","false")}function It(){const e=document.getElementById("menu-toggle"),t=document.getElementById("nav-menu");!e||!t||(e.addEventListener("click",a=>{a.stopPropagation();const o=t.classList.toggle("open");e.setAttribute("aria-expanded",String(o))}),document.addEventListener("click",a=>{t.classList.contains("open")&&!t.contains(a.target)&&ve()}),document.addEventListener("keydown",a=>{a.key==="Escape"&&ve()}))}let M=[],N=[],L=1,Z="dashboard",V=new Set;const xe=new Set,ce=Tt(),J=new Map(ce&&ce.length>0?ce:[]);let F,P,G,K,W,Y,H,R,z;function Nt(){F=document.getElementById("sector-filter"),P=document.getElementById("country-filter"),G=document.getElementById("search-input"),K=document.getElementById("dividend-min"),W=document.getElementById("sort-select"),Y=document.getElementById("table-body"),H=document.getElementById("stats"),R=document.getElementById("pagination"),z=document.getElementById("header-checkbox"),document.querySelectorAll(".nav-tab").forEach(s=>{s.addEventListener("click",n=>{n.preventDefault();const i=s.getAttribute("data-tab");Bt(i),ve()})}),It(),F&&F.addEventListener("change",j),P&&P.addEventListener("change",j),G&&G.addEventListener("input",Lt(j,300)),K&&K.addEventListener("change",j),W&&W.addEventListener("change",j),z&&z.addEventListener("change",()=>{const s=z.checked;Y.querySelectorAll(".row-checkbox").forEach(i=>{i.checked=s,i.dispatchEvent(new Event("change"))})});const t=document.getElementById("select-all"),a=document.getElementById("deselect-all"),o=document.getElementById("export-csv"),r=document.getElementById("export-json");t&&t.addEventListener("click",()=>{N.forEach(s=>V.add(s.symbol)),X(),Q()}),a&&a.addEventListener("click",()=>{V.clear(),X(),Q()}),o&&o.addEventListener("click",Zt),r&&r.addEventListener("click",Xt),Be(),He(),ze(),At(),Kt()}document.addEventListener("DOMContentLoaded",Nt);function Bt(e){Z=e,Be(),He()}function oe(e,t){xe.has(e)||(xe.add(e),t())}function Be(){const e=document.getElementById("dashboard-view"),t=document.getElementById("treemap-view"),a=document.getElementById("heatmap-view"),o=document.getElementById("bubble-chart-view"),r=document.getElementById("dividends-view"),s=document.getElementById("stock-of-day-view"),n=document.getElementById("daily-curiosity-view"),i=document.getElementById("dow-jones-view");switch([e,t,a,o,r,s,n,i].forEach(l=>{l&&(l.style.display="none")}),Z){case"dashboard":e&&(e.style.display="block");break;case"stock-of-day":s&&(s.style.display="block",Ye());break;case"daily-curiosity":n&&(n.style.display="block",oe("daily-curiosity",je));break;case"treemap":t&&(t.style.display="block",oe("treemap",et));break;case"heatmap":a&&(a.style.display="block",oe("heatmap",at));break;case"bubble":o&&(o.style.display="block",Fe());break;case"dividends":r&&(r.style.display="block",Pe());break;case"dow-jones":i&&(i.style.display="block",oe("dow-jones",Ft));break;default:e&&(e.style.display="block")}}function Fe(){const e=document.getElementById("bubble-chart-view");if(!e){console.error("❌ bubble-chart-view não encontrado!");return}e.innerHTML='<div style="text-align: center; padding: 40px;"><p>Carregando gráfico de bolhas...</p></div>',st(M,"bubble-chart-view")}function Pe(){const e=document.getElementById("dividends-view");if(!e){console.error("❌ dividends-view não encontrado!");return}if(M.length===0){e.innerHTML='<div style="text-align: center; padding: 40px;"><p>Carregando dados de dividendos...</p></div>';return}gt(M,"dividends-view")}function Ft(){if(!document.getElementById("dow-jones-view")){console.error("❌ dow-jones-view não encontrado!");return}Et("dow-jones-view")}function He(){document.querySelectorAll(".nav-tab").forEach(t=>{t.classList.remove("active"),t.getAttribute("data-tab")===Z&&t.classList.add("active")})}async function ze(){H&&(H.textContent="Carregando dados...");try{const e=await fetch(`${U}/api/setores`);if(!e.ok)throw new Error("Erro ao buscar setores");const o=((await e.json()).setores||[]).map(async s=>{try{const n=await fetch(`${U}/api/setor/${s}`);if(!n.ok)throw new Error(`HTTP ${n.status}`);const i=await n.json(),d=le.find(p=>p.id===s),l=d?d.name:s;return i.dados&&i.dados.companies&&Array.isArray(i.dados.companies)?{generatedAt:i.dados.generatedAt||null,companies:i.dados.companies.map(p=>({...p,sector:s,sectorName:l}))}:{generatedAt:null,companies:[]}}catch(n){return console.error(`❌ Erro ao carregar ${s}:`,n),{generatedAt:null,companies:[]}}}),r=await Promise.all(o);M=r.flatMap(s=>s.companies),we(r.map(s=>s.generatedAt).filter(Boolean)),F&&(F.innerHTML='<option value="">Todos os Setores</option>',[...new Set(M.map(n=>n.sector))].sort().forEach(n=>{var d;const i=document.createElement("option");i.value=n,i.textContent=((d=le.find(l=>l.id===n))==null?void 0:d.name)||n,F.appendChild(i)})),P&&(P.innerHTML='<option value="">Todos os Países</option>',[...new Set(M.map(n=>Ae(n.headquarters)))].sort().forEach(n=>{const i=document.createElement("option");i.value=n,i.textContent=n,P.appendChild(i)})),j(),Q(),Z==="bubble"&&Fe(),Z==="dividends"&&Pe()}catch(e){console.error("❌ Erro ao carregar dados:",e),H&&(H.textContent="Erro ao carregar dados. Tente novamente."),we([])}}function we(e){const t=document.getElementById("freshness-badge"),a=document.getElementById("freshness-text");if(!a)return;const o=(e||[]).map(d=>new Date(d)).filter(d=>!Number.isNaN(d.getTime()));if(o.length===0){t&&(t.classList.remove("fd-fresh","fd-aging","fd-stale"),t.classList.add("fd-unknown")),a.textContent="Data indisponível";return}const r=new Date(Math.max(...o.map(d=>d.getTime()))),s=Math.floor((Date.now()-r.getTime())/864e5);let n="fd-fresh";s>30?n="fd-stale":s>7&&(n="fd-aging"),t&&(t.classList.remove("fd-fresh","fd-aging","fd-stale","fd-unknown"),t.classList.add(n));const i=r.toLocaleDateString("pt-BR");a.textContent=`Dados de ${i}`,t&&(t.title=`Última atualização dos dados: ${i}`)}function j(){const e=F?F.value:"",t=P?P.value:"",a=G?G.value.toLowerCase():"",o=K&&parseFloat(K.value)||0,r=W?W.value:"symbol-asc";N=M.filter(i=>{const d=!e||i.sector===e,l=!t||Ae(i.headquarters)===t,p=!a||i.symbol.toLowerCase().includes(a)||i.name.toLowerCase().includes(a)||i.subIndustry&&i.subIndustry.toLowerCase().includes(a)||i.headquarters&&i.headquarters.toLowerCase().includes(a),m=!o||(parseFloat(i.dividendYield)||0)>=o;return d&&l&&p&&m});const[s,n]=r.split("-");N.sort((i,d)=>{let l=i[s],p=d[s];if(typeof l=="string"){const b=(l||"").localeCompare(p||"");return n==="asc"?b:-b}const m=parseFloat(l)||0,c=parseFloat(p)||0;return n==="asc"?m-c:c-m}),L=1,X(),Q()}function X(){if(!Y){console.error("❌ tableBody não encontrado!");return}Y.innerHTML="";const e=(L-1)*me,t=e+me;N.slice(e,t).forEach((o,r)=>{const s=V.has(o.symbol),n=u(o.symbol),i=document.createElement("tr");i.innerHTML=`
      <td>
        <input type="checkbox" class="row-checkbox" data-symbol="${n}" 
          ${s?"checked":""}>
      </td>
      <td class="col-index">${e+r+1}</td>
      <td><strong>${u(o.symbol)}</strong></td>
      <td>${u(o.name||"N/A")}</td>
      <td>${u(o.sectorName||o.sector||"N/A")}</td>
      <td>${ie(o.marketCap)}</td>
      <td>${u(o.subIndustry||o.industry||"N/A")}</td>
      <td>${u(o.headquarters||"N/A")}</td>
      <td>${Se(o)}</td>
    `;const d=i.querySelector(".row-checkbox");d.addEventListener("change",()=>{d.checked?V.add(o.symbol):V.delete(o.symbol),Q(),ke()}),Y.appendChild(i)}),ke(),Pt()}function ke(){if(!z||!Y)return;const e=Y.querySelectorAll(".row-checkbox"),t=Array.from(e).filter(a=>a.checked).length;z.checked=e.length>0&&t===e.length,z.indeterminate=t>0&&t<e.length}function Pt(){if(!R)return;R.innerHTML="";const e=Math.ceil(N.length/me),t=document.createElement("button");t.textContent="Anterior",t.disabled=L===1,t.addEventListener("click",()=>{L>1&&(L--,X())}),R.appendChild(t);const a=document.createElement("span");a.textContent=`Página ${L} de ${e}`,R.appendChild(a);const o=document.createElement("button");o.textContent="Próxima",o.disabled=L===e,o.addEventListener("click",()=>{L<e&&(L++,X())}),R.appendChild(o)}function Q(){if(!H)return;const e=N.length,t=V.size,a=N.filter(r=>Number(r.dividendYield)>0),o=a.length>0?(a.reduce((r,s)=>r+Number(s.dividendYield),0)/a.length).toFixed(2):"0.00";H.innerHTML=`Total: ${e} | Selecionadas: ${t} | Yield Médio (pagadoras): ${o}%`}async function Ye(){const e=document.getElementById("stock-of-day-view");if(e){e.innerHTML=`
    <div class="stock-of-day-loading">
      <div class="loading-spinner"></div>
      <p>Analisando o mercado... selecionando a melhor oportunidade de hoje</p>
    </div>
  `;try{if(M.length===0&&await ze(),M.length===0){e.innerHTML=`
        <div class="stock-of-day-error">
          <h3>⚠️ Dados indisponíveis</h3>
          <p>Não foi possível carregar as empresas do S&P 500. Verifique a conexão com o servidor.</p>
          <button class="retry-btn" onclick="loadStockOfDay()">Tentar novamente</button>
        </div>
      `;return}const t=new Date().toISOString().slice(0,10),a=qt(t);if(a){Ce(e,a);return}const o=await Ht();o.primary&&Vt(t,o),Ce(e,o)}catch(t){console.error("Erro ao carregar Ação do Dia:",t),e.innerHTML=`
      <div class="stock-of-day-error">
        <h3>⚠️ Indisponível no momento</h3>
        <p>Não foi possível gerar a análise. Tente novamente mais tarde.</p>
        <button class="retry-btn" onclick="loadStockOfDay()">Tentar novamente</button>
      </div>
    `}}}function Ht(){return new Promise(e=>{setTimeout(()=>{const t=new Date().toISOString().slice(0,10),a=zt(t),o=M.filter(d=>d.marketCap&&d.marketCap>1e9).map(d=>{const l=Yt(d),p=Ot(d.sector),m=(d.dividendYield||0)>2?10:0,c=Math.min(20,Math.log10(d.marketCap/1e9)*5),b=Rt(d),w=l+p+m+c+b;return{...d,score:Math.round(w*100)/100,breakdown:{technical:l,sector:p,dividend:m,liquidity:Math.round(c),volatility:Math.round(b)},rationale:jt(d,l,p,m)}}).sort((d,l)=>l.score-d.score);if(o.length===0){e({date:t,primary:null,alternatives:[],marketContext:$e(),generatedAt:new Date().toISOString()});return}const r=o.slice(0,Math.min(10,o.length)),s=a%r.length,n=r[s],i=r.filter((d,l)=>l!==s).slice(0,3);e({date:t,primary:n,alternatives:i,marketContext:$e(),generatedAt:new Date().toISOString()})},100)})}function zt(e){let t=0;for(let a=0;a<e.length;a++)t=(t<<5)-t+e.charCodeAt(a),t|=0;return Math.abs(t)}function Yt(e){let t=50;const a=e.dividendYield||0;a>4?t+=15:a>2?t+=8:a>0&&(t+=3);const o=e.marketCap||0;o>5e11?t+=10:o>1e11?t+=7:o>5e10?t+=5:o>1e10&&(t+=3);const r=(e.subIndustry||"").toLowerCase();["software","semiconductors","biotechnology","cloud","ai","cybersecurity","renewable"].some(n=>r.includes(n))&&(t+=12);const s=(e.name||"").toLowerCase();return["inc.","corporation","technologies","systems","solutions"].some(n=>s.includes(n))&&(t+=3),Math.min(90,t)}function Ot(e){return{"information-technology":15,"health-care":8,"consumer-discretionary":5,"communication-services":7,industrials:5,financials:3,materials:2,energy:0,utilities:-2,"real-estate":-3,"consumer-staples":1}[e]||0}function Rt(e){const t=e.marketCap||0;return t>2e11?8:t>5e10?12:t>1e10?15:18}function jt(e,t,a,o){const r=[];return t>60&&r.push("Fundamentos técnicos sólidos"),a>10&&r.push(`Setor em momento favorável (${e.sectorName})`),o&&r.push(`Dividend yield atrativo (${(e.dividendYield||0).toFixed(1)}%)`),e.marketCap>1e11&&r.push("Grande capitalização — liquidez e estabilidade"),r.length===0&&r.push("Equilíbrio entre risco e retorno"),r.join(" • ")}function $e(){const e=Math.random()*30+10;return e<15?{level:"Calmo",description:"Baixa volatilidade - ambiente propício para acumulação",class:"calm"}:e<25?{level:"Moderado",description:"Volatilidade normal - seleção seletiva recomendada",class:"moderate"}:{level:"Elevado",description:"Alta volatilidade - foco em qualidade e liquidez",class:"elevated"}}function qt(e){try{const t=localStorage.getItem("sp500-stock-of-day");if(!t)return null;const a=JSON.parse(t);return a.date===e&&a.primary?a:null}catch{return null}}function Vt(e,t){try{localStorage.setItem("sp500-stock-of-day",JSON.stringify(t))}catch{}}function Ce(e,t){const{primary:a,alternatives:o,marketContext:r,generatedAt:s}=t;if(!a){e.innerHTML=`
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
          <span class="market-context ${r.class}">${r.level}</span>
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
            ${Object.entries(a.breakdown).map(([n,i])=>`
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
          ${o.map((n,i)=>`
            <div class="alt-card">
              <span class="alt-rank">${i+2}º</span>
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
        <p class="generated-at">Gerado em ${new Date(s).toLocaleTimeString("pt-BR")} • Baseado em ${M.length} empresas do S&P 500</p>
      </footer>
    </div>
  `}function Ut(e){const t=e.toUpperCase(),a=J.get(t);if(a&&a.triggered){confirm(`${e}: alerta já disparado. Remover?`)&&_t(t);return}const o=prompt(`Alerta de preço para ${e}:
Digite o preço alvo (ex: 150.25):`,a?a.target.toFixed(2):"");if(!o)return;const r=parseFloat(o);if(isNaN(r)||r<=0){alert("Preço inválido");return}const s=confirm(`Alertar quando o preço estiver ACIMA deste valor?
(OK = acima, Cancelar = abaixo)`)?"above":"below";Jt(t,r,s)}function Jt(e,t,a){return!e||typeof t!="number"||!["above","below"].includes(a)?!1:(J.set(e.toUpperCase(),{target:t,direction:a,triggered:!1}),ne(),!0)}function _t(e){J.delete(e.toUpperCase()),ne()}window.loadStockOfDay=Ye;window.openCompanyDetails=Xe;window.setPriceAlertPrompt=Ut;async function Gt(){const e=[];for(const[t,a]of J)if(!a.triggered)try{const o=await De(t),r=o[o.length-1],s=r?Number(r.close):NaN;if(!Number.isFinite(s))continue;(a.direction==="above"&&s>=a.target||a.direction==="below"&&s<=a.target)&&(a.triggered=!0,a.triggeredAt=new Date().toISOString(),a.triggeredPrice=s,e.push(`${t} ($${s.toFixed(2)})`))}catch(o){console.error(`Erro ao verificar ${t}:`,o)}return e.length>0&&(ne(),window.alert(`🔔 Alerta(s) de preço atingido(s): ${e.join(", ")}`)),e}async function Kt(){J.size!==0&&setInterval(async()=>{await Gt(),ne()},6e4)}function Wt(e){return`"${(e==null?"":String(e)).replace(/"/g,'""')}"`}function Zt(){const e=["#","Símbolo","Empresa","Setor","Market Cap","Subindústria","Sede","Dividend Yield"],t=N.map((o,r)=>[r+1,o.symbol,o.name,o.sectorName,ie(o.marketCap),o.subIndustry||o.industry||"N/A",o.headquarters||"N/A",Se(o)]),a=[e,...t].map(o=>o.map(Wt).join(",")).join(`
`);Oe(a,"sp500-export.csv","text/csv")}function Xt(){const e=JSON.stringify(N,null,2);Oe(e,"sp500-export.json","application/json")}function Oe(e,t,a){const o=new Blob([e],{type:a}),r=URL.createObjectURL(o),s=document.createElement("a");s.href=r,s.download=t,document.body.appendChild(s),s.click(),document.body.removeChild(s),URL.revokeObjectURL(r)}
