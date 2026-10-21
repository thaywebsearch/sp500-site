(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))o(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const n of s.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&o(n)}).observe(document,{childList:!0,subtree:!0});function e(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function o(r){if(r.ep)return;r.ep=!0;const s=e(r);fetch(r.href,s)}})();const Je="https://sp500-api.onrender.com",K=Je,ue=[{id:"communication-services",name:"Communication Services"},{id:"consumer-discretionary",name:"Consumer Discretionary"},{id:"consumer-staples",name:"Consumer Staples"},{id:"energy",name:"Energy"},{id:"financials",name:"Financials"},{id:"health-care",name:"Health Care"},{id:"industrials",name:"Industrials"},{id:"information-technology",name:"Information Technology"},{id:"materials",name:"Materials"},{id:"real-estate",name:"Real Estate"},{id:"utilities",name:"Utilities"}];window.API_BASE_URL=K;window.SECTORS=ue;let G=[],f=null,ie=0,ge="",Le="alfabética";async function _e(){try{const t=document.getElementById("daily-curiosity-view");if(!t){console.error("Elemento daily-curiosity-view não encontrado");return}t.innerHTML='<div class="curiosidade-loading">Carregando curiosidade...</div>';const a=await fetch(`${K}/api/curiosidades`);if(!a.ok){console.error(`Erro ao buscar curiosidades: ${a.status}`),t.innerHTML=`<div class="curiosidade-erro">Erro ao carregar curiosidades (${a.status})</div>`;return}const e=await a.json();if(!e.sucesso||!e.dados||!e.dados.curiosidades){console.error("Dados de curiosidades inválidos:",e),t.innerHTML='<div class="curiosidade-erro">Formato de dados inválido</div>';return}if(G=e.dados.curiosidades,ie=e.dados.total||G.length,ge=e.dados.proximaEmpresa||"",Le=e.dados.ordem||"alfabética",G.length===0){t.innerHTML='<div class="curiosidade-erro">Nenhuma curiosidade disponível</div>';return}Xe(),Ze()}catch(t){console.error("Erro ao carregar curiosidades:",t);const a=document.getElementById("daily-curiosity-view");a&&(a.innerHTML=`<div class="curiosidade-erro">Erro ao carregar: ${t.message}</div>`)}}function Xe(){if(G.length===0)return;const t=new Date,a=new Date(t.getFullYear(),t.getMonth(),t.getDate()),o=Math.floor(a.getTime()/864e5)%G.length;f=G[o]}function Ze(){const t=document.getElementById("daily-curiosity-view");if(!t||!f){console.error("View ou curiosidade não encontrada");return}Qe();const a=`
    <div class="curiosidade-container">
      <div class="curiosidade-header">
        <h1>🌟 Curiosidade do Dia</h1>
        <p class="curiosidade-data">${tt()}</p>
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
                ${f.fatos.map(e=>`<li>${e}</li>`).join("")}
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

          ${ie>0?`
            <div class="curiosidade-progresso">
              <div class="progresso-texto">
                <span>Rotatividade diária · ordem ${Le}</span>
                <span>Empresa ${f.posicao} de ${ie}</span>
              </div>
              <div class="progresso-barra">
                <div class="progresso-preenchido" style="width: ${Number(f.posicao)/ie*100}%;"></div>
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
        ${ge?`<p class="curiosidade-proxima">⏭️ Amanhã: ${ge}</p>`:""}
        <p class="curiosidade-dica">💡 Uma empresa diferente a cada dia, em ordem alfabética do S&P 500!</p>
      </div>
    </div>
  `;t.innerHTML=a,window.compartilharCuriosidade=et}function Qe(){if(document.getElementById("curiosidade-styles"))return;const t=document.createElement("style");t.id="curiosidade-styles",t.textContent=`
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
  `,document.head.appendChild(t)}function et(){if(!f)return;const t=(f.fatos||[]).map(e=>`• ${e}`).join(`
`),a=`🌟 Curiosidade do Dia: ${f.empresa} (${f.simbolo})

${f.descricao}

${t}

💡 ${f.insight||""}`;navigator.share?navigator.share({title:`Curiosidade do Dia - ${f.empresa}`,text:a,url:window.location.href}).catch(e=>console.error("Erro ao compartilhar:",e)):navigator.clipboard.writeText(a).then(()=>{alert("Curiosidade copiada para a área de transferência!")}).catch(e=>{alert("Erro ao copiar: "+e)})}function tt(){const t=new Date,a={weekday:"long",year:"numeric",month:"long",day:"numeric"};return t.toLocaleDateString("pt-BR",a)}function de(t){const a=Number(t);return!a||Number.isNaN(a)?"N/A":a>=1e12?`$${(a/1e12).toFixed(3)}T`:a>=1e9?`$${(a/1e9).toFixed(2)}B`:a>=1e6?`$${(a/1e6).toFixed(2)}M`:`$${a.toLocaleString("en-US")}`}function Me(t){if(!t||t.hasDividend==="Não")return"N/A";const a=Number(t.dividendYield);return Number.isFinite(a)?`${a.toFixed(2)}%`:"N/A"}function l(t){return t?String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;"):""}const at=new Set(["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming","D.C."]);function Ie(t){if(!t)return"Desconhecido";const a=String(t).split(",").map(o=>o.trim().replace(/\[\d+\]$/,"")),e=a[a.length-1];return!e||e.toLowerCase()==="none"?"Desconhecido":at.has(e)?"United States":e}async function De(t){try{const a=await fetch(`${K}/api/historico/${t}`);if(!a.ok)throw new Error(`Erro ao buscar histórico de ${t}`);return(await a.json()).registros||[]}catch(a){return console.error(`Erro ao buscar histórico de ${t}:`,a),[]}}const ne=760,pe=320,x={top:28,right:28,bottom:44,left:68};function ot(t){if(!t)return"";const[a,e,o]=t.split("-");return`${o}/${e}/${a.slice(2)}`}function ye(t){return Number.isFinite(t)?t>=100?`$${t.toFixed(0)}`:`$${t.toFixed(2)}`:"—"}function rt(t){const a=t.map(h=>h.close),e=Math.min(...a),o=Math.max(...a),r=o-e||1,s=e-r*.08,n=o+r*.08,i=t.length,d=h=>x.left+h/(i-1)*(ne-x.left-x.right),u=h=>x.top+(1-(h-s)/(n-s))*(pe-x.top-x.bottom);let m=`<svg viewBox="0 0 ${ne} ${pe}" style="width:100%;height:auto;display:block;background:var(--plot-bg);border-radius:8px">`;const p=5;for(let h=0;h<=p;h++){const b=s+(n-s)*h/p,S=u(b);m+=`<line x1="${x.left}" y1="${S.toFixed(1)}" x2="${ne-x.right}" y2="${S.toFixed(1)}" stroke="var(--chart-axis)" stroke-width="1"/>`,m+=`<text x="${x.left-8}" y="${(S+4).toFixed(1)}" text-anchor="end" font-size="11" fill="var(--chart-label)">${ye(b)}</text>`}const c=[];for(let h=0;h<=4;h++)c.push(Math.round((i-1)*h/4));c.forEach(h=>{const b=d(h);m+=`<text x="${b.toFixed(1)}" y="${pe-x.bottom+18}" text-anchor="middle" font-size="11" fill="var(--chart-label)">${ot(t[h].data)}</text>`});const y=t.map((h,b)=>`${d(b).toFixed(1)},${u(h.close).toFixed(1)}`).join(" "),C=`${x.left},${u(s).toFixed(1)} `+y+` ${d(i-1).toFixed(1)},${u(s).toFixed(1)}`;m+=`<polygon points="${C}" fill="rgba(0, 212, 255, 0.08)"/>`,m+=`<polyline points="${y}" fill="none" stroke="var(--accent-cyan)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;const w=t[i-1],v=u(w.close);return m+=`<circle cx="${d(i-1).toFixed(1)}" cy="${v.toFixed(1)}" r="4" fill="var(--accent-cyan)"/>`,m+=`<text x="${ne-x.right}" y="${(v-10).toFixed(1)}" text-anchor="end" font-size="12" font-weight="700" fill="var(--chart-text)">${ye(w.close)}</text>`,m+="</svg>",m}async function st(t,a){var r;(r=document.querySelector(".modal-overlay"))==null||r.remove();const e=document.createElement("div");e.className="modal-overlay";const o=()=>e.remove();e.addEventListener("click",s=>{s.target===e&&o()}),document.addEventListener("keydown",s=>{s.key==="Escape"&&o()}),e.innerHTML=`
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
  `,document.body.appendChild(e),e.querySelector(".modal-close").addEventListener("click",o);try{const s=await De(t),n=e.querySelector("#price-chart-body");if(!s||s.length===0){n.innerHTML=`<p class="modal-error">Nenhum dado de preço disponível para ${l(t)}.</p>`;return}const i=s[0].close,d=s[s.length-1].close,u=(d-i)/i*100,m=u>=0,p=m?"positive":"negative";n.innerHTML=`
      <div class="price-stats">
        <div class="price-stat">
          <span class="price-stat-label">Último</span>
          <strong>${ye(d)}</strong>
        </div>
        <div class="price-stat">
          <span class="price-stat-label">Variação (2a)</span>
          <strong class="${p}">${m?"+":""}${u.toFixed(2)}%</strong>
        </div>
        <div class="price-stat">
          <span class="price-stat-label">Período</span>
          <strong>${s.length} pregões</strong>
        </div>
      </div>
      ${rt(s)}
    `}catch(s){console.error(`Erro ao buscar histórico de ${t}:`,s);const n=e.querySelector("#price-chart-body");n.innerHTML=`<p class="modal-error">Erro ao carregar o histórico de ${l(t)}. Verifique se o backend está online.</p>`}}function T(t,a){return`
    <div class="company-detail">
      <span class="company-detail-label">${t}</span>
      <strong class="company-detail-value">${a}</strong>
    </div>
  `}function nt(t){var s;(s=document.querySelector(".modal-overlay"))==null||s.remove();const a=document.createElement("div");a.className="modal-overlay";const e=()=>a.remove();a.addEventListener("click",n=>{n.target===a&&e()}),document.addEventListener("keydown",n=>{n.key==="Escape"&&e()});const o=t.dividendYield!==null&&t.dividendYield!==void 0?`${t.dividendYield.toFixed(2)}%`:"—",r=de(t.marketCap);a.innerHTML=`
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
          ${T("Empresa",l(t.name||"N/A"))}
          ${T("Setor",l(t.sectorName||t.sector||"N/A"))}
          ${T("Subindústria",l(t.subIndustry||"N/A"))}
          ${T("Sede",l(t.headquarters||"N/A"))}
          ${T("Market Cap",r)}
          ${T("Classificação",l(t.marketCapClassification||"N/A"))}
          ${T("Div. Yield",o)}
          ${T("Paga dividendos",t.hasDividend?l(t.hasDividend):"—")}
          ${T("Data de inclusão",l(t.dateAdded||"N/A"))}
          ${T("CIK",t.cik?l(String(t.cik)):"N/A")}
          ${T("Fundação",l(t.founded||"N/A"))}
        </div>
        <div class="modal-footer">
          <button class="modal-action" id="details-chart-btn">📈 Ver histórico de preços</button>
        </div>
      </div>
    </div>
  `,document.body.appendChild(a),a.querySelector(".modal-close").addEventListener("click",e),a.querySelector("#details-chart-btn").addEventListener("click",()=>{st(t.symbol,t.name)})}function it(t,a){const e=t/a*100;return e>=80?"#ff5252":e>=60?"#ff9800":e>=40?"#ffeb3b":e>=20?"#8bc34a":"#4caf50"}async function ct(){const t=document.getElementById("treemap-view");if(t){t.style.display="flex",t.style.flexDirection="column",t.style.height="100%",t.style.width="100%",t.style.margin="0",t.style.padding="0",t.style.background="var(--bg-primary)",t.innerHTML='<div style="display:flex;align-items:center;justify-content:center;height:100%;width:100%;font-size:14px;color:var(--text-secondary)">Carregando mapa de setores...</div>';try{const o=(await(await fetch(`${window.API_BASE_URL}/api/setores`)).json()).setores||[],r=await Promise.all(o.map(async i=>{var w;const u=await(await fetch(`${window.API_BASE_URL}/api/setor/${i}`)).json(),m=window.SECTORS.find(v=>v.id===i),p=((w=u.dados)==null?void 0:w.companies)||[],c=p.reduce((v,h)=>v+(h.marketCap||0),0),y=p.length>0?p.reduce((v,h)=>v+(h.dividendYield||0),0)/p.length:0,C=p.filter(v=>v.hasDividend==="Sim").length;return{id:i,name:(m==null?void 0:m.name)||i,cap:(c/1e9).toFixed(1),companies:p.length,avgDiv:parseFloat(y.toFixed(2)),withDiv:C,topCompany:p.length>0?p[0].symbol:"N/A"}})),s=Math.max(...r.map(i=>parseFloat(i.cap)));let n=`
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
    `;r.forEach(i=>{const d=it(parseFloat(i.cap),s),u=(parseFloat(i.cap)/s*100).toFixed(1),m=["consumer-staples","communication-services","consumer-discretionary","energy","financials","health-care","industrials","information-technology","materials","real-estate","utilities"].includes(i.id),p=m?new URL(`sector.html?sector=${i.id}`,document.baseURI).href:"#";n+=`
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
        onmouseover="${m?`this.style.borderColor='${d}';this.style.background='rgba(${parseInt(d.slice(1,3),16)},${parseInt(d.slice(3,5),16)},${parseInt(d.slice(5,7),16)},0.05)';this.style.transform='translateY(-4px)';this.style.boxShadow='0 12px 32px ${d}22'`:""}"
        onmouseout="${m?"this.style.borderColor='var(--border)';this.style.background='var(--bg-secondary)';this.style.transform='translateY(0)';this.style.boxShadow='none'":""}"
        onclick="${m?`navigateToSector('${p}', '${i.id}')`:`alert('🔒 O setor \\"${i.name}\\" ainda está em desenvolvimento.\\n\\nApenas Consumer Staples, Communication Services, Consumer Discretionary, Energy, Financials, Health Care, Industrials, Information Technology, Materials, Real Estate e Utilities estão disponíveis por enquanto!')`}"
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
    `,t.innerHTML=n}catch(a){console.error("Erro ao carregar treemap:",a),t.innerHTML='<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--accent-red)">Erro ao carregar mapa de setores</div>'}}}function dt(t,a){if(t==="#"){alert(`🔒 O setor "${a}" ainda está em desenvolvimento.

Apenas Consumer Staples, Communication Services, Consumer Discretionary, Energy, Financials, Health Care, Industrials, Information Technology, Materials, Real Estate e Utilities estão disponíveis por enquanto!`);return}window.open(t,"_blank")}window.navigateToSector=dt;async function lt(){var a;const t=document.getElementById("heatmap-view");if(t){t.style.display="flex",t.style.flexDirection="column",t.style.height="100%",t.style.width="100%",t.style.padding="40px",t.style.boxSizing="border-box",t.style.background="var(--bg-primary)",t.style.overflowY="auto",t.innerHTML='<div style="text-align:center;color:var(--text-secondary)">Carregando heatmap...</div>';try{const r=(await(await fetch(`${window.API_BASE_URL}/api/setores`)).json()).setores||[];let s=`
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
    `;for(const n of r){const d=await(await fetch(`${window.API_BASE_URL}/api/setor/${n}`)).json(),u=window.SECTORS.find(c=>c.id===n),m=((a=d.dados)==null?void 0:a.companies)||[];if(m.length===0)continue;const p=m.sort((c,y)=>(y.marketCap||0)-(c.marketCap||0)).slice(0,4);s+=`
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
      `,p.forEach((c,y)=>{const C=(c.marketCap/1e9).toFixed(2),w=(c.dividendYield||0).toFixed(2);let v="#4caf50";C>500?v="#ff5252":C>200?v="#ff9800":C>100?v="#ffeb3b":C>50&&(v="#8bc34a"),s+=`
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
              ">${c.symbol}</div>
              <div style="
                font-size: 11px;
                background: ${v}22;
                color: ${v};
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
                  color: ${v};
                ">$${C}B</div>
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
    `,t.innerHTML=s}catch(e){console.error("Erro ao carregar heatmap:",e),t.innerHTML=`
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
        ">${e.message}</div>
      </div>
    `}}}const pt={Energy:"#FF6B6B",Materials:"#C92A2A",Industrials:"#FFA94D","Consumer Discretionary":"#FFD43B","Consumer Staples":"#A9E34B","Health Care":"#51CF66",Financials:"#40C057","Information Technology":"#339AF0","Communication Services":"#748FFC",Utilities:"#9775FA","Real Estate":"#DA77F2"};function Re(t){return pt[t]||"#808080"}function be(t){if(!t)return 0;if(typeof t=="number")return t;const e=String(t).toUpperCase().trim().replace(/[$€¥₹]/g,"").trim();return e.includes("T")?parseFloat(e.replace("T",""))*1e12:e.includes("B")?parseFloat(e.replace("B",""))*1e9:e.includes("M")?parseFloat(e.replace("M",""))*1e6:parseFloat(e)||0}function mt(t){if(!t)return 0;if(typeof t=="number")return t;const a=String(t).trim();return parseFloat(a.replace("%",""))||0}function ut(t,a){const e=document.getElementById(a);if(!e){console.error(`❌ Contentor ${a} não encontrado!`);return}e.innerHTML="";const o=t.filter(g=>be(g.marketCap)>0&&g.sectorName).map((g,M)=>({symbol:g.symbol,name:g.name,sector:g.sectorName,marketCap:be(g.marketCap),dividendYield:mt(g.dividendYield),index:M}));if(o.length===0){e.innerHTML="<p>Sem dados disponíveis para o gráfico de bolhas.</p>";return}const r={top:40,right:40,bottom:60,left:60},s=Math.max(window.innerWidth-100,800)-r.left-r.right,n=600-r.top-r.bottom,i=Math.min(...o.map(g=>g.dividendYield)),d=Math.max(...o.map(g=>g.dividendYield)),u=Math.min(...o.map(g=>g.marketCap)),m=Math.max(...o.map(g=>g.marketCap)),p=g=>n-(g-i)/(d-i||1)*n,c=g=>5+(g-u)/(m-u||1)*50,y=(()=>{let g=42;return()=>(g=(g*9301+49297)%233280,g/233280)})(),C=o.map(()=>y()*s),w=document.createElementNS("http://www.w3.org/2000/svg","svg");w.setAttribute("width",s+r.left+r.right),w.setAttribute("height",n+r.top+r.bottom),w.style.cssText="display: block; margin: 20px auto; background: var(--plot-bg); border-radius: 8px;";const v=document.createElementNS("http://www.w3.org/2000/svg","g");v.setAttribute("transform",`translate(${r.left},${r.top})`);for(let g=0;g<=10;g++){const M=g/10*n,se=i+g/10*(d-i),$=document.createElementNS("http://www.w3.org/2000/svg","line");$.setAttribute("x1",0),$.setAttribute("y1",M),$.setAttribute("x2",s),$.setAttribute("y2",M),$.setAttribute("stroke","var(--chart-axis)"),$.setAttribute("stroke-width","1"),$.setAttribute("stroke-dasharray","4"),v.appendChild($);const A=document.createElementNS("http://www.w3.org/2000/svg","text");A.setAttribute("x",-10),A.setAttribute("y",M+5),A.setAttribute("text-anchor","end"),A.setAttribute("font-size","12"),A.setAttribute("fill","var(--chart-label)"),A.textContent=se.toFixed(1)+"%",v.appendChild(A)}const h=document.createElementNS("http://www.w3.org/2000/svg","line");h.setAttribute("x1",0),h.setAttribute("y1",0),h.setAttribute("x2",0),h.setAttribute("y2",n),h.setAttribute("stroke","var(--chart-label)"),h.setAttribute("stroke-width","2"),v.appendChild(h);const b=document.createElementNS("http://www.w3.org/2000/svg","text");b.setAttribute("transform","rotate(-90)"),b.setAttribute("y",-40),b.setAttribute("x",-n/2),b.setAttribute("text-anchor","middle"),b.setAttribute("font-size","14"),b.setAttribute("font-weight","bold"),b.setAttribute("fill","var(--chart-text)"),b.textContent="💵 Dividend Yield (%)",v.appendChild(b);const S=document.createElementNS("http://www.w3.org/2000/svg","line");S.setAttribute("x1",0),S.setAttribute("y1",n),S.setAttribute("x2",s),S.setAttribute("y2",n),S.setAttribute("stroke","var(--chart-label)"),S.setAttribute("stroke-width","2"),v.appendChild(S);const N=document.createElementNS("http://www.w3.org/2000/svg","text");N.setAttribute("x",s/2),N.setAttribute("y",n+45),N.setAttribute("text-anchor","middle"),N.setAttribute("font-size","14"),N.setAttribute("font-weight","bold"),N.setAttribute("fill","var(--chart-text)"),N.textContent="📊 Distribuição Aleatória (cada bolha = empresa)",v.appendChild(N),o.forEach((g,M)=>{const se=C[M],$=p(g.dividendYield),A=c(g.marketCap),Ke=Re(g.sector),k=document.createElementNS("http://www.w3.org/2000/svg","circle");if(k.setAttribute("cx",se),k.setAttribute("cy",$),k.setAttribute("r",A),k.setAttribute("fill",Ke),k.setAttribute("opacity","0.7"),k.setAttribute("stroke","#fff"),k.setAttribute("stroke-width","2"),k.style.cursor="pointer",k.style.transition="all 0.3s ease",k.addEventListener("mouseover",E=>{k.setAttribute("opacity","1"),k.setAttribute("stroke-width","3"),yt(E,g)}),k.addEventListener("mouseout",()=>{k.setAttribute("opacity","0.7"),k.setAttribute("stroke-width","2"),Ne()}),v.appendChild(k),A>15){const E=document.createElementNS("http://www.w3.org/2000/svg","text");E.setAttribute("x",se),E.setAttribute("y",$+5),E.setAttribute("text-anchor","middle"),E.setAttribute("font-size",Math.max(10,A/2)),E.setAttribute("font-weight","bold"),E.setAttribute("fill","#fff"),E.setAttribute("pointer-events","none"),E.textContent=g.symbol.substring(0,3),v.appendChild(E)}}),w.appendChild(v),e.appendChild(w),gt(e,o)}function gt(t,a){const e=document.createElement("div");e.style.cssText=`
    margin: 30px auto;
    max-width: 800px;
    padding: 20px;
    background: var(--surface);
    border-radius: 8px;
    border: 1px solid var(--border);
  `;const o=document.createElement("h3");o.textContent="🫧 Como ler o gráfico",o.style.cssText="margin: 0 0 12px 0; color: var(--text-primary);",e.appendChild(o);const r=document.createElement("div");r.style.cssText="margin-bottom: 16px; font-size: 13px; color: var(--text-secondary); line-height: 1.8;",r.innerHTML=`
    <div><strong>Tamanho da bolha:</strong> Market Cap da empresa (quanto maior, mais valiosa)</div>
    <div><strong>Eixo Y (vertical):</strong> Dividend Yield (mais acima = maior dividendo)</div>
    <div><strong>Eixo X (horizontal):</strong> posição aleatória, apenas para facilitar a visualização</div>
    <div><strong>Cor:</strong> setor da empresa</div>
  `,e.appendChild(r);const s=document.createElement("div");s.textContent="Setores",s.style.cssText="font-size: 13px; font-weight: 600; color: var(--text-primary); margin-bottom: 8px;",e.appendChild(s);const n=new Set(a.map(d=>d.sector)),i=document.createElement("div");i.style.cssText="display: flex; flex-wrap: wrap; gap: 12px;",n.forEach(d=>{const u=document.createElement("div");u.style.cssText="display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text-primary);";const m=document.createElement("span");m.style.cssText=`display: inline-block; width: 14px; height: 14px; border-radius: 50%; background: ${Re(d)};`;const p=document.createElement("span");p.textContent=d,u.appendChild(m),u.appendChild(p),i.appendChild(u)}),e.appendChild(i),t.appendChild(e)}let ce=null;function yt(t,a){Ne();const e=document.createElement("div");e.style.cssText=`
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
  `;const r=t.target.getBoundingClientRect();e.style.left=r.left+10+"px",e.style.top=r.top-10+"px",document.body.appendChild(e),ce=e}function Ne(){ce&&(ce.remove(),ce=null)}function D(t){const a=Number(t&&t.dividendYield);return Number.isFinite(a)&&a>0?a:0}function re(t){return(t||[]).filter(a=>D(a)>0)}function vt(t){const a=re(t);return a.length===0?0:a.reduce((o,r)=>o+D(r),0)/a.length}function ht(t){const a=re(t).map(D).sort((o,r)=>o-r);if(a.length===0)return 0;const e=Math.floor(a.length/2);return a.length%2===0?(a[e-1]+a[e])/2:a[e]}function ft(t){const a=t||[],e=re(a),o=e.map(D);return{total:a.length,payers:e.length,nonPayers:a.length-e.length,payerRatio:a.length>0?e.length/a.length:0,avgYield:vt(a),medianYield:ht(a),maxYield:o.length>0?Math.max(...o):0}}function bt(t,a=15){return re(t).slice().sort((e,o)=>D(o)-D(e)||String(e.symbol).localeCompare(String(o.symbol))).slice(0,a)}const kt=[{label:"0–1%",min:0,max:1},{label:"1–2%",min:1,max:2},{label:"2–3%",min:2,max:3},{label:"3–4%",min:3,max:4},{label:"4–5%",min:4,max:5},{label:"5%+",min:5,max:1/0}];function Ct(t){const a=re(t);return kt.map(e=>({label:e.label,count:a.filter(o=>{const r=D(o);return r>=e.min&&r<e.max}).length}))}function wt(t){const a=new Map;for(const e of t||[]){const o=e.sectorName||e.sector||"N/A";a.has(o)||a.set(o,{sector:o,total:0,payers:0,yieldSum:0});const r=a.get(o);r.total+=1;const s=D(e);s>0&&(r.payers+=1,r.yieldSum+=s)}return Array.from(a.values()).map(e=>({sector:e.sector,total:e.total,payers:e.payers,avgYield:e.payers>0?e.yieldSum/e.payers:0})).sort((e,o)=>o.avgYield-e.avgYield||e.sector.localeCompare(o.sector))}const _=t=>`${Number(t).toFixed(2)}%`,ke=t=>`${(t*100).toFixed(0)}%`;function xt(t,a){const e=document.getElementById(a);if(!e){console.error(`❌ Contentor ${a} não encontrado!`);return}const o=t||[];if(o.length===0){e.innerHTML='<div class="treemap-container"><p>Sem dados disponíveis para o painel de dividendos.</p></div>';return}const r=ft(o),s=bt(o),n=Ct(o),i=wt(o),d=Math.max(1,...n.map(c=>c.count)),u=s.map((c,y)=>`
      <tr class="dividend-row" data-dividend-symbol="${l(c.symbol)}" data-dividend-name="${l(c.name||c.symbol)}">
        <td class="col-index">${y+1}</td>
        <td><strong>${l(c.symbol)}</strong></td>
        <td>${l(c.name||"N/A")}</td>
        <td>${l(c.sectorName||c.sector||"N/A")}</td>
        <td class="dividend-yield">${_(D(c))}</td>
      </tr>`).join(""),m=n.map(c=>`
      <div class="dividend-bucket">
        <span class="dividend-bucket-label">${c.label}</span>
        <div class="dividend-bucket-track">
          <div class="dividend-bucket-fill" style="width: ${c.count/d*100}%"></div>
        </div>
        <span class="dividend-bucket-count">${c.count}</span>
      </div>`).join(""),p=i.map(c=>`
      <tr>
        <td>${l(c.sector)}</td>
        <td class="col-index">${c.payers} / ${c.total}</td>
        <td class="dividend-yield">${_(c.avgYield)}</td>
      </tr>`).join("");e.innerHTML=`
    <div class="dividends-view">
      <header class="treemap-header">
        <h2>💰 Dividendos</h2>
        <p class="subtitle">
          Renda por dividendos no S&amp;P 500 — ${r.payers} de ${r.total} empresas
          pagam dividendos (${ke(r.payerRatio)}).
        </p>
      </header>

      <div class="treemap-stats">
        <div class="stat-card">
          <span class="stat-label">Empresas</span>
          <span class="stat-value">${r.total}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Pagadoras</span>
          <span class="stat-value">${r.payers} (${ke(r.payerRatio)})</span>
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
  `,e.querySelectorAll(".dividend-row").forEach(c=>{c.addEventListener("click",()=>{typeof window.openCompanyDetails=="function"&&window.openCompanyDetails({symbol:c.dataset.dividendSymbol,name:c.dataset.dividendName})})})}const z=[{company:"3M",ticker:"MMM",sector:"Industrials"},{company:"American Express",ticker:"AXP",sector:"Financials"},{company:"Amgen",ticker:"AMGN",sector:"Health Care"},{company:"Apple",ticker:"AAPL",sector:"Information Technology"},{company:"Boeing",ticker:"BA",sector:"Industrials"},{company:"Caterpillar",ticker:"CAT",sector:"Industrials"},{company:"Chevron",ticker:"CVX",sector:"Energy"},{company:"Cisco Systems",ticker:"CSCO",sector:"Information Technology"},{company:"Coca-Cola",ticker:"KO",sector:"Consumer Staples"},{company:"Dow Inc.",ticker:"DOW",sector:"Materials"},{company:"Goldman Sachs",ticker:"GS",sector:"Financials"},{company:"Home Depot",ticker:"HD",sector:"Consumer Discretionary"},{company:"Honeywell",ticker:"HON",sector:"Industrials"},{company:"IBM",ticker:"IBM",sector:"Information Technology"},{company:"Intel",ticker:"INTC",sector:"Information Technology"},{company:"Johnson & Johnson",ticker:"JNJ",sector:"Health Care"},{company:"JPMorgan Chase",ticker:"JPM",sector:"Financials"},{company:"McDonald's",ticker:"MCD",sector:"Consumer Discretionary"},{company:"Merck",ticker:"MRK",sector:"Health Care"},{company:"Microsoft",ticker:"MSFT",sector:"Information Technology"},{company:"Nike",ticker:"NKE",sector:"Consumer Discretionary"},{company:"Procter & Gamble",ticker:"PG",sector:"Consumer Staples"},{company:"Salesforce",ticker:"CRM",sector:"Information Technology"},{company:"The Travelers Companies",ticker:"TRV",sector:"Financials"},{company:"UnitedHealth Group",ticker:"UNH",sector:"Health Care"},{company:"Verizon",ticker:"VZ",sector:"Communication Services"},{company:"Visa",ticker:"V",sector:"Financials"},{company:"Walgreens Boots Alliance",ticker:"WBA",sector:"Consumer Staples"},{company:"Walt Disney",ticker:"DIS",sector:"Communication Services"},{company:"Nvidia",ticker:"NVDA",sector:"Information Technology"}],St={"Communication Services":"#00d4ff","Consumer Discretionary":"#ffab00","Consumer Staples":"#00e676",Energy:"#ff5252",Financials:"#ba68c8","Health Care":"#29b6f6",Industrials:"#ffa726","Information Technology":"#00d4ff",Materials:"#66bb6a","Real Estate":"#ec407a",Utilities:"#42a5f5"};function $t(t){return String(t||"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")}function At(t){return St[t]||"#00d4ff"}function Be(t){return`dow-sector--${$t(t)}`}function Et(t,{search:a="",sector:e=""}={}){const o=String(a).toLowerCase().trim();return(t||[]).filter(r=>{const s=!o||String(r.company).toLowerCase().includes(o)||String(r.ticker).toLowerCase().includes(o),n=!e||r.sector===e;return s&&n})}function Tt(t,a="company"){return[...t||[]].sort((e,o)=>{switch(a){case"ticker":return e.ticker.localeCompare(o.ticker);case"sector":return e.sector.localeCompare(o.sector)||e.company.localeCompare(o.company);default:return e.company.localeCompare(o.company)}})}function Ce(t){return[...new Set((t||[]).map(a=>a.sector))].sort()}function Lt(t){const a=new Map;return(t||[]).forEach(e=>{a.has(e.sector)||a.set(e.sector,[]),a.get(e.sector).push(e.company)}),[...a.entries()].map(([e,o])=>({sector:e,companies:o,count:o.length})).sort((e,o)=>o.count-e.count||e.sector.localeCompare(o.sector))}function Mt(t){return(t||[]).filter(a=>a.sector==="Information Technology").length}function It(t){return`<div class="dow-cards">${(t||[]).map(e=>`
      <article class="dow-card">
        <div class="dow-card-head">
          <h3>${l(e.company)}</h3>
          <span class="dow-ticker">${l(e.ticker)}</span>
        </div>
        <span class="dow-sector ${Be(e.sector)}">${l(e.sector)}</span>
      </article>`).join("")}</div>`}function Dt(t){return`
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
        <td><span class="dow-sector ${Be(e.sector)}">${l(e.sector)}</span></td>
      </tr>`).join("")}</tbody>
      </table>
    </div>`}function Rt(t="dow-jones-view"){const a=document.getElementById(t);if(!a){console.error(`❌ Contentor ${t} não encontrado!`);return}const e={search:"",sector:"",sortBy:"company",view:"cards"},o=Ce(z).length,r=Ce(z).map(c=>`<option value="${l(c)}">${l(c)}</option>`).join(""),s=Lt(z).map(c=>`
      <div class="dow-breakdown-item">
        <div class="dow-breakdown-head" style="color: ${At(c.sector)}">
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
            <span class="dow-stat-value">${z.length}</span>
            <span class="dow-stat-label">Empresas</span>
          </div>
          <div class="dow-stat">
            <span class="dow-stat-value">${o}</span>
            <span class="dow-stat-label">Setores</span>
          </div>
          <div class="dow-stat">
            <span class="dow-stat-value">${Mt(z)}</span>
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
  `;const n=a.querySelector("#dow-results"),i=a.querySelector("#dow-search"),d=a.querySelector("#dow-sector"),u=a.querySelector("#dow-sort"),m=a.querySelectorAll(".dow-view-btn");function p(){const c=Tt(Et(z,{search:e.search,sector:e.sector}),e.sortBy);if(c.length===0){n.innerHTML='<p class="dow-empty">Nenhuma empresa encontrada.</p>';return}n.innerHTML=e.view==="table"?Dt(c):It(c),e.view==="table"&&n.querySelectorAll("th[data-sort]").forEach(y=>{y.addEventListener("click",()=>{e.sortBy=y.dataset.sort,u&&(u.value=e.sortBy),p()})})}i&&i.addEventListener("input",()=>{e.search=i.value,p()}),d&&d.addEventListener("change",()=>{e.sector=d.value,p()}),u&&u.addEventListener("change",()=>{e.sortBy=u.value,p()}),m.forEach(c=>{c.addEventListener("click",()=>{e.view=c.dataset.view,m.forEach(y=>y.classList.toggle("active",y===c)),p()})}),p()}const X=[{company:"American States Water",ticker:"AWR",sector:"Utilities"},{company:"California Water Service",ticker:"CWT",sector:"Utilities"},{company:"Northwest Natural",ticker:"NWN",sector:"Utilities"},{company:"Procter & Gamble",ticker:"PG",sector:"Consumer Defensive"},{company:"Coca-Cola",ticker:"KO",sector:"Consumer Defensive"},{company:"Johnson & Johnson",ticker:"JNJ",sector:"Healthcare"},{company:"Colgate-Palmolive",ticker:"CL",sector:"Consumer Defensive"},{company:"Genuine Parts",ticker:"GPC",sector:"Consumer Cyclical"},{company:"Emerson Electric",ticker:"EMR",sector:"Industrials"},{company:"Dover",ticker:"DOV",sector:"Industrials"},{company:"Lowe's",ticker:"LOW",sector:"Consumer Cyclical"},{company:"Federal Realty",ticker:"FRT",sector:"Real Estate"},{company:"ABM Industries",ticker:"ABM",sector:"Industrials"},{company:"Stepan",ticker:"SCL",sector:"Basic Materials"},{company:"H.B. Fuller",ticker:"FUL",sector:"Basic Materials"},{company:"Universal Corp",ticker:"UVV",sector:"Consumer Defensive"},{company:"Hormel Foods",ticker:"HRL",sector:"Consumer Defensive"},{company:"Kimberly-Clark",ticker:"KMB",sector:"Consumer Defensive"},{company:"Middlesex Water",ticker:"MSEX",sector:"Utilities"},{company:"MSA Safety",ticker:"MSA",sector:"Industrials"},{company:"PPG Industries",ticker:"PPG",sector:"Basic Materials"},{company:"RPM International",ticker:"RPM",sector:"Basic Materials"},{company:"Black Hills",ticker:"BKH",sector:"Utilities"},{company:"National Fuel Gas",ticker:"NFG",sector:"Energy"},{company:"PepsiCo",ticker:"PEP",sector:"Consumer Defensive"},{company:"Altria",ticker:"MO",sector:"Consumer Defensive"},{company:"Stanley Black & Decker",ticker:"SWK",sector:"Industrials"},{company:"Target",ticker:"TGT",sector:"Consumer Cyclical"},{company:"Sysco",ticker:"SYY",sector:"Consumer Defensive"},{company:"Cincinnati Financial",ticker:"CINF",sector:"Financials"},{company:"Tootsie Roll",ticker:"TR",sector:"Consumer Defensive"},{company:"Gorman-Rupp",ticker:"GRC",sector:"Industrials"},{company:"Pentair",ticker:"PNR",sector:"Industrials"},{company:"H2O America",ticker:"HTO",sector:"Utilities"},{company:"MGE Energy",ticker:"MGEE",sector:"Utilities"},{company:"RLI Corp",ticker:"RLI",sector:"Financials"},{company:"S&P Global",ticker:"SPGI",sector:"Financials"},{company:"Automatic Data Processing",ticker:"ADP",sector:"Industrials"}],Nt={"Basic Materials":"#66bb6a","Consumer Cyclical":"#ffab00","Consumer Defensive":"#00e676",Energy:"#ff5252",Financials:"#ba68c8",Healthcare:"#29b6f6",Industrials:"#ffa726","Real Estate":"#ec407a",Utilities:"#42a5f5"};function Bt(t){return String(t||"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")}function Pt(t){return Nt[t]||"#00e676"}function Pe(t){return`dk-sector--${Bt(t)}`}function qt(t,{search:a="",sector:e=""}={}){const o=String(a).toLowerCase().trim();return(t||[]).filter(r=>{const s=!o||String(r.company).toLowerCase().includes(o)||String(r.ticker).toLowerCase().includes(o),n=!e||r.sector===e;return s&&n})}function Ft(t,a="company"){return[...t||[]].sort((e,o)=>{switch(a){case"ticker":return e.ticker.localeCompare(o.ticker);case"sector":return e.sector.localeCompare(o.sector)||e.company.localeCompare(o.company);default:return e.company.localeCompare(o.company)}})}function we(t){return[...new Set((t||[]).map(a=>a.sector))].sort()}function Ht(t){const a=new Map;return(t||[]).forEach(e=>{a.has(e.sector)||a.set(e.sector,[]),a.get(e.sector).push(e.company)}),[...a.entries()].map(([e,o])=>({sector:e,companies:o,count:o.length})).sort((e,o)=>o.count-e.count||e.sector.localeCompare(o.sector))}function Ot(t){return`<div class="dk-cards">${(t||[]).map(e=>`
      <article class="dk-card">
        <div class="dk-card-head">
          <h3>${l(e.company)}</h3>
          <span class="dk-ticker">${l(e.ticker)}</span>
        </div>
        <span class="dk-sector ${Pe(e.sector)}">${l(e.sector)}</span>
        <div class="dk-badge">👑 50+ Anos de Dividendos</div>
      </article>`).join("")}</div>`}function zt(t){return`
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
        <td><span class="dk-sector ${Pe(e.sector)}">${l(e.sector)}</span></td>
      </tr>`).join("")}</tbody>
      </table>
    </div>`}function Yt(t="dividend-kings-view"){const a=document.getElementById(t);if(!a){console.error(`❌ Contentor ${t} não encontrado!`);return}const e={search:"",sector:"",sortBy:"company",view:"cards"},o=we(X).length,r=we(X).map(p=>`<option value="${l(p)}">${l(p)}</option>`).join(""),s=Ht(X).map(p=>`
      <div class="dk-breakdown-item">
        <div class="dk-breakdown-head" style="color: ${Pt(p.sector)}">
          <span>${l(p.sector)}</span>
          <span class="dk-breakdown-count">${p.count}</span>
        </div>
        <p class="dk-breakdown-list">${p.companies.map(c=>l(c)).join(", ")}</p>
      </div>`).join("");a.innerHTML=`
    <div class="dividend-kings-view">
      <header class="dk-header">
        <div class="dk-header-content">
          <h2>Dividend Kings</h2>
          <p>👑 50+ anos de aumento ininterrupto de dividendos</p>
        </div>
        <div class="dk-stats">
          <div class="dk-stat">
            <span class="dk-stat-value">${X.length}</span>
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
  `;const n=a.querySelector("#dk-results"),i=a.querySelector("#dk-search"),d=a.querySelector("#dk-sector"),u=a.querySelector("#dk-sort"),m=()=>{const p=Ft(qt(X,{search:e.search,sector:e.sector}),e.sortBy);if(p.length===0){n.innerHTML='<p class="dk-empty">Nenhuma empresa encontrada.</p>';return}if(e.view==="cards"){n.innerHTML=Ot(p);return}n.innerHTML=zt(p),n.querySelectorAll(".dk-table th[data-sort]").forEach(c=>{c.addEventListener("click",()=>{e.sortBy=c.getAttribute("data-sort"),u&&(u.value=e.sortBy),m()})})};i&&i.addEventListener("input",()=>{e.search=i.value,m()}),d&&d.addEventListener("change",()=>{e.sector=d.value,m()}),u&&u.addEventListener("change",()=>{e.sortBy=u.value,m()}),a.querySelectorAll(".dk-view-btn").forEach(p=>{p.addEventListener("click",()=>{e.view=p.getAttribute("data-view"),a.querySelectorAll(".dk-view-btn").forEach(c=>c.classList.remove("active")),p.classList.add("active"),m()})}),m()}const Y=[{company:"AbbVie",ticker:"ABBV",sector:"Health Care",years:53},{company:"Abbott Laboratories",ticker:"ABT",sector:"Health Care",years:53},{company:"Archer-Daniels-Midland",ticker:"ADM",sector:"Consumer Staples",years:50},{company:"Automatic Data Processing",ticker:"ADP",sector:"Information Technology",years:50},{company:"Aflac",ticker:"AFL",sector:"Financials",years:44},{company:"Albemarle",ticker:"ALB",sector:"Materials",years:31},{company:"Amcor",ticker:"AMCR",sector:"Materials",years:30},{company:"A.O. Smith",ticker:"AOS",sector:"Industrials",years:32},{company:"Air Products & Chemicals",ticker:"APD",sector:"Materials",years:43},{company:"Atmos Energy",ticker:"ATO",sector:"Utilities",years:42},{company:"Becton Dickinson",ticker:"BDX",sector:"Health Care",years:54},{company:"Franklin Resources",ticker:"BEN",sector:"Financials",years:46},{company:"Brown-Forman",ticker:"BF.B",sector:"Consumer Staples",years:41},{company:"Brown & Brown",ticker:"BRO",sector:"Financials",years:32},{company:"Cardinal Health",ticker:"CAH",sector:"Health Care",years:29},{company:"Caterpillar",ticker:"CAT",sector:"Industrials",years:32},{company:"Chubb",ticker:"CB",sector:"Financials",years:32},{company:"Church & Dwight",ticker:"CHD",sector:"Consumer Staples",years:29},{company:"C.H. Robinson",ticker:"CHRW",sector:"Industrials",years:28},{company:"Cincinnati Financial",ticker:"CINF",sector:"Financials",years:65},{company:"Colgate-Palmolive",ticker:"CL",sector:"Consumer Staples",years:62},{company:"Clorox",ticker:"CLX",sector:"Consumer Staples",years:48},{company:"Cintas",ticker:"CTAS",sector:"Industrials",years:43},{company:"Chevron",ticker:"CVX",sector:"Energy",years:38},{company:"Dover",ticker:"DOV",sector:"Industrials",years:70},{company:"Ecolab",ticker:"ECL",sector:"Materials",years:34},{company:"Consolidated Edison",ticker:"ED",sector:"Utilities",years:51},{company:"Emerson Electric",ticker:"EMR",sector:"Industrials",years:69},{company:"Erie Indemnity",ticker:"ERIE",sector:"Financials",years:36},{company:"Eversource Energy",ticker:"ES",sector:"Utilities",years:27},{company:"Essex Property Trust",ticker:"ESS",sector:"Real Estate",years:31},{company:"Expeditors International",ticker:"EXPD",sector:"Industrials",years:29},{company:"Fastenal",ticker:"FAST",sector:"Industrials",years:25},{company:"FactSet Research Systems",ticker:"FDS",sector:"Financials",years:25},{company:"Federal Realty",ticker:"FRT",sector:"Real Estate",years:50},{company:"Genuine Parts",ticker:"GPC",sector:"Consumer Discretionary",years:50},{company:"Grainger",ticker:"GWW",sector:"Industrials",years:40},{company:"Hasbro",ticker:"HAS",sector:"Consumer Discretionary",years:25},{company:"Hormel Foods",ticker:"HRL",sector:"Consumer Staples",years:57},{company:"IBM",ticker:"IBM",sector:"Information Technology",years:29},{company:"Johnson & Johnson",ticker:"JNJ",sector:"Health Care",years:62},{company:"Kimberly-Clark",ticker:"KMB",sector:"Consumer Staples",years:53},{company:"Coca-Cola",ticker:"KO",sector:"Consumer Staples",years:62},{company:"Leggett & Platt",ticker:"LEG",sector:"Consumer Discretionary",years:52},{company:"Linde",ticker:"LIN",sector:"Materials",years:29},{company:"Lowe's",ticker:"LOW",sector:"Consumer Discretionary",years:50},{company:"McDonald's",ticker:"MCD",sector:"Consumer Discretionary",years:47},{company:"Medtronic",ticker:"MDT",sector:"Health Care",years:47},{company:"McCormick",ticker:"MKC",sector:"Consumer Staples",years:37},{company:"3M",ticker:"MMM",sector:"Industrials",years:64},{company:"Nordson",ticker:"NDSN",sector:"Industrials",years:60},{company:"National Fuel Gas",ticker:"NFG",sector:"Energy",years:52},{company:"Nucor",ticker:"NUE",sector:"Materials",years:50},{company:"Realty Income",ticker:"O",sector:"Real Estate",years:30},{company:"PepsiCo",ticker:"PEP",sector:"Consumer Staples",years:51},{company:"Procter & Gamble",ticker:"PG",sector:"Consumer Staples",years:67},{company:"Pentair",ticker:"PNR",sector:"Industrials",years:47},{company:"PPG Industries",ticker:"PPG",sector:"Materials",years:52},{company:"Roper Technologies",ticker:"ROP",sector:"Industrials",years:30},{company:"Republic Services",ticker:"RSG",sector:"Industrials",years:25},{company:"Sherwin-Williams",ticker:"SHW",sector:"Materials",years:45},{company:"Smucker",ticker:"SJM",sector:"Consumer Staples",years:28},{company:"S&P Global",ticker:"SPGI",sector:"Financials",years:50},{company:"Stanley Black & Decker",ticker:"SWK",sector:"Industrials",years:55},{company:"Sysco",ticker:"SYY",sector:"Consumer Staples",years:53},{company:"T. Rowe Price",ticker:"TROW",sector:"Financials",years:36},{company:"VF Corp",ticker:"VFC",sector:"Consumer Discretionary",years:50},{company:"Walgreens Boots Alliance",ticker:"WBA",sector:"Consumer Staples",years:47},{company:"Walmart",ticker:"WMT",sector:"Consumer Staples",years:50},{company:"West Pharmaceutical Services",ticker:"WST",sector:"Health Care",years:30},{company:"Exxon Mobil",ticker:"XOM",sector:"Energy",years:42}],jt={"Consumer Staples":"#00e676","Communication Services":"#00d4ff","Consumer Discretionary":"#ffab00",Energy:"#ff5252",Financials:"#ba68c8","Health Care":"#29b6f6",Industrials:"#ffa726","Information Technology":"#00d4ff",Materials:"#66bb6a","Real Estate":"#ec407a",Utilities:"#42a5f5"};function Vt(t){return String(t||"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")}function Ut(t){return jt[t]||"#ffc107"}function qe(t){return`da-sector--${Vt(t)}`}function Gt(t){return(t||[]).reduce((a,e)=>Math.max(a,Number(e.years)||0),0)}function Wt(t,{search:a="",sector:e="",minYears:o=0}={}){const r=String(a).toLowerCase().trim(),s=Number(o)||0;return(t||[]).filter(n=>{const i=!r||String(n.company).toLowerCase().includes(r)||String(n.ticker).toLowerCase().includes(r),d=!e||n.sector===e,u=(Number(n.years)||0)>=s;return i&&d&&u})}function Kt(t,a="years"){return[...t||[]].sort((e,o)=>{switch(a){case"company":return e.company.localeCompare(o.company);case"ticker":return e.ticker.localeCompare(o.ticker);case"sector":return e.sector.localeCompare(o.sector)||e.company.localeCompare(o.company);case"years":return(o.years||0)-(e.years||0)||e.company.localeCompare(o.company);default:return 0}})}function xe(t){return[...new Set((t||[]).map(a=>a.sector))].sort()}function Jt(t){const a=new Map;return(t||[]).forEach(e=>{a.has(e.sector)||a.set(e.sector,[]),a.get(e.sector).push(e.company)}),[...a.entries()].map(([e,o])=>({sector:e,companies:o,count:o.length})).sort((e,o)=>o.count-e.count||e.sector.localeCompare(o.sector))}function _t(t){return`<div class="da-cards">${(t||[]).map(e=>`
      <article class="da-card">
        <div class="da-card-head">
          <h3>${l(e.company)}</h3>
          <span class="da-ticker">${l(e.ticker)}</span>
        </div>
        <span class="da-sector ${qe(e.sector)}">${l(e.sector)}</span>
        <div class="da-years">🏆 ${l(String(e.years))} Anos de Aumento</div>
      </article>`).join("")}</div>`}function Xt(t){return`
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
        <td><span class="da-sector ${qe(e.sector)}">${l(e.sector)}</span></td>
        <td><strong class="da-years-value">${l(String(e.years))}</strong></td>
      </tr>`).join("")}</tbody>
      </table>
    </div>`}function Zt(t="dividend-aristocrats-view"){const a=document.getElementById(t);if(!a){console.error("❌ dividend-aristocrats-view não encontrado!");return}const e={search:"",sector:"",minYears:0,sortBy:"years",view:"cards"},o=xe(Y).length,r=xe(Y).map(c=>`<option value="${l(c)}">${l(c)}</option>`).join(""),s=Jt(Y).map(c=>`
      <div class="da-breakdown-item">
        <div class="da-breakdown-head" style="color: ${Ut(c.sector)}">
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
            <span class="da-stat-value">${Y.length}</span>
            <span class="da-stat-label">Empresas</span>
          </div>
          <div class="da-stat">
            <span class="da-stat-value">${o}</span>
            <span class="da-stat-label">Setores</span>
          </div>
          <div class="da-stat">
            <span class="da-stat-value">${Gt(Y)}</span>
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
  `;const n=a.querySelector("#da-results"),i=a.querySelector("#da-search"),d=a.querySelector("#da-sector"),u=a.querySelector("#da-min-years"),m=a.querySelector("#da-sort"),p=()=>{const c=Kt(Wt(Y,{search:e.search,sector:e.sector,minYears:e.minYears}),e.sortBy);if(c.length===0){n.innerHTML='<p class="da-empty">Nenhuma empresa encontrada.</p>';return}if(e.view==="cards"){n.innerHTML=_t(c);return}n.innerHTML=Xt(c),n.querySelectorAll(".da-table th[data-sort]").forEach(y=>{y.addEventListener("click",()=>{e.sortBy=y.getAttribute("data-sort"),m&&(m.value=e.sortBy),p()})})};i&&i.addEventListener("input",()=>{e.search=i.value,p()}),d&&d.addEventListener("change",()=>{e.sector=d.value,p()}),u&&u.addEventListener("input",()=>{e.minYears=Number(u.value)||0,p()}),m&&m.addEventListener("change",()=>{e.sortBy=m.value,p()}),a.querySelectorAll(".da-view-btn").forEach(c=>{c.addEventListener("click",()=>{e.view=c.getAttribute("data-view"),a.querySelectorAll(".da-view-btn").forEach(y=>y.classList.remove("active")),c.classList.add("active"),p()})}),p()}const j=[{rank:1,ticker:"NVDA",company:"NVIDIA Corporation",sector:"Technology",weight:13.31,cap:5470,category:"Mega Cap",cumulative:13.31,concentration:"Top 10"},{rank:2,ticker:"AAPL",company:"Apple Inc.",sector:"Technology",weight:11.57,cap:4390,category:"Mega Cap",cumulative:24.88,concentration:"Top 10"},{rank:3,ticker:"MSFT",company:"Microsoft Corporation",sector:"Technology",weight:8.55,cap:3010,category:"Mega Cap",cumulative:33.43,concentration:"Top 10"},{rank:4,ticker:"AMZN",company:"Amazon.com Inc.",sector:"Consumer Discretionary",weight:7.07,cap:2910,category:"Mega Cap",cumulative:40.5,concentration:"Top 10"},{rank:5,ticker:"GOOGL",company:"Alphabet Inc. Class A",sector:"Communication Services",weight:5.75,cap:4880,category:"Mega Cap",cumulative:46.25,concentration:"Top 10"},{rank:6,ticker:"GOOG",company:"Alphabet Inc. Class C",sector:"Communication Services",weight:5.33,cap:4830,category:"Mega Cap",cumulative:51.58,concentration:"Top 10"},{rank:7,ticker:"AVGO",company:"Broadcom Inc.",sector:"Technology",weight:4.6,cap:1970,category:"Mega Cap",cumulative:56.18,concentration:"Top 10"},{rank:8,ticker:"META",company:"Meta Platforms Inc. Class A",sector:"Communication Services",weight:4.58,cap:1570,category:"Mega Cap",cumulative:60.76,concentration:"Top 10"},{rank:9,ticker:"TSLA",company:"Tesla Inc.",sector:"Consumer Discretionary",weight:4.44,cap:1670,category:"Mega Cap",cumulative:65.2,concentration:"Top 10"},{rank:10,ticker:"WMT",company:"Walmart Inc.",sector:"Consumer Staples",weight:3.06,cap:1050,category:"Mega Cap",cumulative:68.26,concentration:"Top 10"},{rank:11,ticker:"ASML",company:"ASML Holding N.V.",sector:"Technology",weight:1.65,cap:609.6,category:"Mega Cap",cumulative:69.91,concentration:"Top 11–25"},{rank:12,ticker:"COST",company:"Costco Wholesale Corporation",sector:"Consumer Staples",weight:1.37,cap:458.3,category:"Mega Cap",cumulative:71.28,concentration:"Top 11–25"},{rank:13,ticker:"MU",company:"Micron Technology Inc.",sector:"Technology",weight:1.3,cap:906.3,category:"Mega Cap",cumulative:72.58,concentration:"Top 11–25"},{rank:14,ticker:"NFLX",company:"Netflix Inc.",sector:"Communication Services",weight:1.25,cap:368.7,category:"Mega Cap",cumulative:73.83,concentration:"Top 11–25"},{rank:15,ticker:"PLTR",company:"Palantir Technologies Inc. Class A",sector:"Technology",weight:1.09,cap:311.8,category:"Mega Cap",cumulative:74.92,concentration:"Top 11–25"},{rank:16,ticker:"AMD",company:"Advanced Micro Devices Inc.",sector:"Technology",weight:1.07,cap:726.4,category:"Mega Cap",cumulative:75.99,concentration:"Top 11–25"},{rank:17,ticker:"CSCO",company:"Cisco Systems Inc.",sector:"Technology",weight:.97,cap:402.4,category:"Mega Cap",cumulative:76.96,concentration:"Top 11–25"},{rank:18,ticker:"AMAT",company:"Applied Materials Inc.",sector:"Technology",weight:.88,cap:346.5,category:"Mega Cap",cumulative:77.84,concentration:"Top 11–25"},{rank:19,ticker:"LRCX",company:"Lam Research Corporation",sector:"Technology",weight:.86,cap:369.5,category:"Mega Cap",cumulative:78.7,concentration:"Top 11–25"},{rank:20,ticker:"INTC",company:"Intel Corporation",sector:"Technology",weight:.76,cap:604.6,category:"Mega Cap",cumulative:79.46,concentration:"Top 11–25"},{rank:21,ticker:"LIN",company:"Linde plc",sector:"Materials",weight:.71,cap:237.3,category:"Mega Cap",cumulative:80.17,concentration:"Top 11–25"},{rank:22,ticker:"TMUS",company:"T-Mobile US Inc.",sector:"Communication Services",weight:.69,cap:205.9,category:"Mega Cap",cumulative:80.86,concentration:"Top 11–25"},{rank:23,ticker:"PEP",company:"PepsiCo Inc.",sector:"Consumer Staples",weight:.65,cap:204,category:"Mega Cap",cumulative:81.51,concentration:"Top 11–25"},{rank:24,ticker:"KLAC",company:"KLA Corporation",sector:"Technology",weight:.62,cap:241.6,category:"Mega Cap",cumulative:82.13,concentration:"Top 11–25"},{rank:25,ticker:"AMGN",company:"Amgen Inc.",sector:"Health Care",weight:.59,cap:181.7,category:"Large Cap",cumulative:82.72,concentration:"Top 11–25"},{rank:26,ticker:"TXN",company:"Texas Instruments Incorporated",sector:"Technology",weight:.56,cap:278.8,category:"Mega Cap",cumulative:83.28,concentration:"Rest (26–100)"},{rank:27,ticker:"GILD",company:"Gilead Sciences Inc.",sector:"Health Care",weight:.54,cap:165.2,category:"Large Cap",cumulative:83.82,concentration:"Rest (26–100)"},{rank:28,ticker:"ISRG",company:"Intuitive Surgical Inc.",sector:"Health Care",weight:.51,cap:153.1,category:"Large Cap",cumulative:84.33,concentration:"Rest (26–100)"},{rank:29,ticker:"ARM",company:"Arm Holdings plc ADR",sector:"Technology",weight:.5,cap:235.4,category:"Mega Cap",cumulative:84.83,concentration:"Rest (26–100)"},{rank:30,ticker:"ADI",company:"Analog Devices Inc.",sector:"Technology",weight:.49,cap:211.1,category:"Mega Cap",cumulative:85.32,concentration:"Rest (26–100)"},{rank:31,ticker:"SHOP",company:"Shopify Inc. Class A",sector:"Consumer Discretionary",weight:.48,cap:123.8,category:"Large Cap",cumulative:85.8,concentration:"Rest (26–100)"},{rank:32,ticker:"PDD",company:"PDD Holdings Inc. ADR",sector:"Consumer Discretionary",weight:.45,cap:141.8,category:"Large Cap",cumulative:86.25,concentration:"Rest (26–100)"},{rank:33,ticker:"HON",company:"Honeywell International Inc.",sector:"Industrials",weight:.45,cap:138.1,category:"Large Cap",cumulative:86.7,concentration:"Rest (26–100)"},{rank:34,ticker:"QCOM",company:"QUALCOMM Incorporated",sector:"Technology",weight:.43,cap:224.7,category:"Mega Cap",cumulative:87.13,concentration:"Rest (26–100)"},{rank:35,ticker:"BKNG",company:"Booking Holdings Inc.",sector:"Consumer Discretionary",weight:.42,cap:120.1,category:"Large Cap",cumulative:87.55,concentration:"Rest (26–100)"},{rank:36,ticker:"APP",company:"AppLovin Corporation Class A",sector:"Technology",weight:.41,cap:152.4,category:"Large Cap",cumulative:87.96,concentration:"Rest (26–100)"},{rank:37,ticker:"PANW",company:"Palo Alto Networks Inc.",sector:"Technology",weight:.4,cap:184.7,category:"Large Cap",cumulative:88.36,concentration:"Rest (26–100)"},{rank:38,ticker:"INTU",company:"Intuit Inc.",sector:"Technology",weight:.36,cap:103.4,category:"Large Cap",cumulative:88.72,concentration:"Rest (26–100)"},{rank:39,ticker:"VRTX",company:"Vertex Pharmaceuticals Incorporated",sector:"Health Care",weight:.36,cap:115,category:"Large Cap",cumulative:89.08,concentration:"Rest (26–100)"},{rank:40,ticker:"SBUX",company:"Starbucks Corporation",sector:"Consumer Discretionary",weight:.32,cap:120.8,category:"Large Cap",cumulative:89.4,concentration:"Rest (26–100)"},{rank:41,ticker:"WDC",company:"Western Digital Corporation",sector:"Technology",weight:.32,cap:170.3,category:"Large Cap",cumulative:89.72,concentration:"Rest (26–100)"},{rank:42,ticker:"CEG",company:"Constellation Energy Corporation",sector:"Utilities",weight:.31,cap:99.3,category:"Large Cap",cumulative:90.03,concentration:"Rest (26–100)"},{rank:43,ticker:"CMCSA",company:"Comcast Corporation Class A",sector:"Communication Services",weight:.31,cap:89.1,category:"Large Cap",cumulative:90.34,concentration:"Rest (26–100)"},{rank:44,ticker:"CRWD",company:"CrowdStrike Holdings Inc. Class A",sector:"Technology",weight:.31,cap:143.2,category:"Large Cap",cumulative:90.65,concentration:"Rest (26–100)"},{rank:45,ticker:"ADBE",company:"Adobe Inc.",sector:"Technology",weight:.3,cap:95.4,category:"Large Cap",cumulative:90.95,concentration:"Rest (26–100)"},{rank:46,ticker:"STX",company:"Seagate Technology Holdings plc",sector:"Technology",weight:.3,cap:183.3,category:"Large Cap",cumulative:91.25,concentration:"Rest (26–100)"},{rank:47,ticker:"MRVL",company:"Marvell Technology Inc.",sector:"Technology",weight:.29,cap:155.6,category:"Large Cap",cumulative:91.54,concentration:"Rest (26–100)"},{rank:48,ticker:"MAR",company:"Marriott International Inc. Class A",sector:"Consumer Discretionary",weight:.27,cap:92.3,category:"Large Cap",cumulative:91.81,concentration:"Rest (26–100)"},{rank:49,ticker:"MELI",company:"MercadoLibre Inc.",sector:"Consumer Discretionary",weight:.27,cap:79.2,category:"Large Cap",cumulative:92.08,concentration:"Rest (26–100)"},{rank:50,ticker:"REGN",company:"Regeneron Pharmaceuticals Inc.",sector:"Health Care",weight:.25,cap:75.5,category:"Large Cap",cumulative:92.33,concentration:"Rest (26–100)"},{rank:51,ticker:"ADP",company:"Automatic Data Processing Inc.",sector:"Technology",weight:.25,cap:83.4,category:"Large Cap",cumulative:92.58,concentration:"Rest (26–100)"},{rank:52,ticker:"CDNS",company:"Cadence Design Systems Inc.",sector:"Technology",weight:.24,cap:97.8,category:"Large Cap",cumulative:92.82,concentration:"Rest (26–100)"},{rank:53,ticker:"ORLY",company:"O'Reilly Automotive Inc.",sector:"Consumer Discretionary",weight:.24,cap:74.3,category:"Large Cap",cumulative:93.06,concentration:"Rest (26–100)"},{rank:54,ticker:"CSX",company:"CSX Corporation",sector:"Industrials",weight:.24,cap:82.5,category:"Large Cap",cumulative:93.3,concentration:"Rest (26–100)"},{rank:55,ticker:"SNPS",company:"Synopsys Inc.",sector:"Technology",weight:.24,cap:97.6,category:"Large Cap",cumulative:93.54,concentration:"Rest (26–100)"},{rank:56,ticker:"ABNB",company:"Airbnb Inc. Class A",sector:"Consumer Discretionary",weight:.24,cap:78.9,category:"Large Cap",cumulative:93.78,concentration:"Rest (26–100)"},{rank:57,ticker:"MDLZ",company:"Mondelez International Inc. Class A",sector:"Consumer Staples",weight:.23,cap:79,category:"Large Cap",cumulative:94.01,concentration:"Rest (26–100)"},{rank:58,ticker:"MNST",company:"Monster Beverage Corporation",sector:"Consumer Staples",weight:.22,cap:84,category:"Large Cap",cumulative:94.23,concentration:"Rest (26–100)"},{rank:59,ticker:"ROST",company:"Ross Stores Inc.",sector:"Consumer Discretionary",weight:.22,cap:68.5,category:"Large Cap",cumulative:94.45,concentration:"Rest (26–100)"},{rank:60,ticker:"AEP",company:"American Electric Power Company Inc.",sector:"Utilities",weight:.22,cap:69.6,category:"Large Cap",cumulative:94.67,concentration:"Rest (26–100)"},{rank:61,ticker:"WBD",company:"Warner Bros. Discovery Inc. Series A",sector:"Communication Services",weight:.22,cap:68.3,category:"Large Cap",cumulative:94.89,concentration:"Rest (26–100)"},{rank:62,ticker:"CTAS",company:"Cintas Corporation",sector:"Industrials",weight:.21,cap:65.4,category:"Large Cap",cumulative:95.1,concentration:"Rest (26–100)"},{rank:63,ticker:"DASH",company:"DoorDash Inc. Class A",sector:"Consumer Discretionary",weight:.2,cap:65,category:"Large Cap",cumulative:95.3,concentration:"Rest (26–100)"},{rank:64,ticker:"PCAR",company:"PACCAR Inc.",sector:"Industrials",weight:.19,cap:58.8,category:"Large Cap",cumulative:95.49,concentration:"Rest (26–100)"},{rank:65,ticker:"FTNT",company:"Fortinet Inc.",sector:"Technology",weight:.19,cap:86.2,category:"Large Cap",cumulative:95.68,concentration:"Rest (26–100)"},{rank:66,ticker:"BKR",company:"Baker Hughes Company Class A",sector:"Energy",weight:.18,cap:64.9,category:"Large Cap",cumulative:95.86,concentration:"Rest (26–100)"},{rank:67,ticker:"MPWR",company:"Monolithic Power Systems Inc.",sector:"Technology",weight:.17,cap:81.1,category:"Large Cap",cumulative:96.03,concentration:"Rest (26–100)"},{rank:68,ticker:"FANG",company:"Diamondback Energy Inc.",sector:"Energy",weight:.17,cap:56.6,category:"Large Cap",cumulative:96.2,concentration:"Rest (26–100)"},{rank:69,ticker:"FAST",company:"Fastenal Company",sector:"Industrials",weight:.17,cap:50.2,category:"Large Cap",cumulative:96.37,concentration:"Rest (26–100)"},{rank:70,ticker:"EA",company:"Electronic Arts Inc.",sector:"Communication Services",weight:.16,cap:50.2,category:"Large Cap",cumulative:96.53,concentration:"Rest (26–100)"},{rank:71,ticker:"ADSK",company:"Autodesk Inc.",sector:"Technology",weight:.16,cap:48.8,category:"Large Cap",cumulative:96.69,concentration:"Rest (26–100)"},{rank:72,ticker:"NXPI",company:"NXP Semiconductors N.V.",sector:"Technology",weight:.15,cap:75.3,category:"Large Cap",cumulative:96.84,concentration:"Rest (26–100)"},{rank:73,ticker:"EXC",company:"Exelon Corporation",sector:"Utilities",weight:.15,cap:45.3,category:"Large Cap",cumulative:96.99,concentration:"Rest (26–100)"},{rank:74,ticker:"XEL",company:"Xcel Energy Inc.",sector:"Utilities",weight:.15,cap:49.9,category:"Large Cap",cumulative:97.14,concentration:"Rest (26–100)"},{rank:75,ticker:"FER",company:"Ferrovial SE",sector:"Utilities",weight:.15,cap:48.7,category:"Large Cap",cumulative:97.29,concentration:"Rest (26–100)"},{rank:76,ticker:"IDXX",company:"IDEXX Laboratories Inc.",sector:"Health Care",weight:.14,cap:41.7,category:"Large Cap",cumulative:97.43,concentration:"Rest (26–100)"},{rank:77,ticker:"ALNY",company:"Alnylam Pharmaceuticals Inc.",sector:"Health Care",weight:.14,cap:38.9,category:"Large Cap",cumulative:97.57,concentration:"Rest (26–100)"},{rank:78,ticker:"MSTR",company:"Strategy Inc.",sector:"Technology",weight:.13,cap:62.4,category:"Large Cap",cumulative:97.7,concentration:"Rest (26–100)"},{rank:79,ticker:"DDOG",company:"Datadog Inc. Class A",sector:"Technology",weight:.13,cap:73.1,category:"Large Cap",cumulative:97.83,concentration:"Rest (26–100)"},{rank:80,ticker:"ODFL",company:"Old Dominion Freight Line Inc.",sector:"Industrials",weight:.13,cap:39.3,category:"Large Cap",cumulative:97.96,concentration:"Rest (26–100)"},{rank:81,ticker:"PYPL",company:"PayPal Holdings Inc.",sector:"Technology",weight:.13,cap:39.9,category:"Large Cap",cumulative:98.09,concentration:"Rest (26–100)"},{rank:82,ticker:"CCEP",company:"Coca-Cola Europacific Partners plc",sector:"Consumer Staples",weight:.13,cap:40.5,category:"Large Cap",cumulative:98.22,concentration:"Rest (26–100)"},{rank:83,ticker:"TRI",company:"Thomson Reuters Corporation",sector:"Technology",weight:.12,cap:35.8,category:"Large Cap",cumulative:98.34,concentration:"Rest (26–100)"},{rank:84,ticker:"TTWO",company:"Take-Two Interactive Software Inc.",sector:"Communication Services",weight:.11,cap:42,category:"Large Cap",cumulative:98.45,concentration:"Rest (26–100)"},{rank:85,ticker:"ROP",company:"Roper Technologies Inc.",sector:"Industrials",weight:.11,cap:31.9,category:"Large Cap",cumulative:98.56,concentration:"Rest (26–100)"},{rank:86,ticker:"MCHP",company:"Microchip Technology Incorporated",sector:"Technology",weight:.11,cap:52.3,category:"Large Cap",cumulative:98.67,concentration:"Rest (26–100)"},{rank:87,ticker:"INSM",company:"Insmed Incorporated",sector:"Health Care",weight:.11,cap:25.6,category:"Large Cap",cumulative:98.78,concentration:"Rest (26–100)"},{rank:88,ticker:"KDP",company:"Keurig Dr Pepper Inc.",sector:"Consumer Staples",weight:.11,cap:39.9,category:"Large Cap",cumulative:98.89,concentration:"Rest (26–100)"},{rank:89,ticker:"AXON",company:"Axon Enterprise Inc.",sector:"Industrials",weight:.11,cap:30.4,category:"Large Cap",cumulative:99,concentration:"Rest (26–100)"},{rank:90,ticker:"WDAY",company:"Workday Inc. Class A",sector:"Technology",weight:.1,cap:29.1,category:"Large Cap",cumulative:99.1,concentration:"Rest (26–100)"},{rank:91,ticker:"PAYX",company:"Paychex Inc.",sector:"Technology",weight:.1,cap:32.2,category:"Large Cap",cumulative:99.2,concentration:"Rest (26–100)"},{rank:92,ticker:"GEHC",company:"GE HealthCare Technologies Inc.",sector:"Health Care",weight:.1,cap:28.2,category:"Large Cap",cumulative:99.3,concentration:"Rest (26–100)"},{rank:93,ticker:"CPRT",company:"Copart Inc.",sector:"Industrials",weight:.1,cap:31.7,category:"Large Cap",cumulative:99.4,concentration:"Rest (26–100)"},{rank:94,ticker:"CTSH",company:"Cognizant Technology Solutions Corporation Class A",sector:"Technology",weight:.09,cap:21.7,category:"Large Cap",cumulative:99.49,concentration:"Rest (26–100)"},{rank:95,ticker:"CHTR",company:"Charter Communications Inc. Class A",sector:"Communication Services",weight:.08,cap:20.2,category:"Large Cap",cumulative:99.57,concentration:"Rest (26–100)"},{rank:96,ticker:"KHC",company:"Kraft Heinz Company",sector:"Consumer Staples",weight:.08,cap:27.5,category:"Large Cap",cumulative:99.65,concentration:"Rest (26–100)"},{rank:97,ticker:"VRSK",company:"Verisk Analytics Inc.",sector:"Technology",weight:.08,cap:21.2,category:"Large Cap",cumulative:99.73,concentration:"Rest (26–100)"},{rank:98,ticker:"DXCM",company:"DexCom Inc.",sector:"Health Care",weight:.08,cap:22.6,category:"Large Cap",cumulative:99.81,concentration:"Rest (26–100)"},{rank:99,ticker:"ZS",company:"Zscaler Inc. Class A",sector:"Technology",weight:.07,cap:24.5,category:"Large Cap",cumulative:99.88,concentration:"Rest (26–100)"},{rank:100,ticker:"TEAM",company:"Atlassian Corporation Class A",sector:"Technology",weight:.06,cap:20.5,category:"Large Cap",cumulative:99.94,concentration:"Rest (26–100)"}],Qt={Technology:"#00d4ff","Communication Services":"#00d4ff","Consumer Discretionary":"#ffab00","Consumer Staples":"#00e676","Health Care":"#29b6f6",Industrials:"#ffa726",Materials:"#66bb6a",Energy:"#ff5252",Utilities:"#42a5f5",Financials:"#ba68c8","Real Estate":"#ec407a"};function ea(t){return String(t||"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")}function ta(t){return Qt[t]||"#00d4ff"}function Fe(t){return`nq-sector--${ea(t)}`}function fe(t){const a=Number(t)||0;return a>=1e3?`$${(a/1e3).toFixed(2)}T`:`$${a.toFixed(1)}B`}function aa(t){return(t||[]).reduce((a,e)=>a+(Number(e.cap)||0),0)}function oa(t){return(t||[]).reduce((a,e)=>a+(Number(e.weight)||0),0)}function ra(t,{search:a="",sector:e="",category:o=""}={}){const r=String(a).toLowerCase().trim();return(t||[]).filter(s=>{const n=!r||String(s.company).toLowerCase().includes(r)||String(s.ticker).toLowerCase().includes(r),i=!e||s.sector===e,d=!o||s.category===o;return n&&i&&d})}function sa(t,a="rank"){return[...t||[]].sort((e,o)=>{switch(a){case"cap":return(o.cap||0)-(e.cap||0);case"weight":return(o.weight||0)-(e.weight||0)||(e.rank||0)-(o.rank||0);case"company":return e.company.localeCompare(o.company);case"ticker":return e.ticker.localeCompare(o.ticker);case"sector":return e.sector.localeCompare(o.sector)||(e.rank||0)-(o.rank||0);case"rank":default:return(e.rank||0)-(o.rank||0)}})}function na(t){return[...new Set((t||[]).map(a=>a.sector))].sort()}function ia(t){const a=new Map;return(t||[]).forEach(e=>{a.has(e.sector)||a.set(e.sector,[]),a.get(e.sector).push(e)}),[...a.entries()].map(([e,o])=>({sector:e,companies:o.map(r=>r.ticker),count:o.length,weight:o.reduce((r,s)=>r+(Number(s.weight)||0),0)})).sort((e,o)=>o.count-e.count||e.sector.localeCompare(o.sector))}function ca(t){return`<div class="nq-cards">${(t||[]).map(e=>`
      <article class="nq-card">
        <div class="nq-card-head">
          <div>
            <span class="nq-rank">#${l(e.rank)}</span>
            <h3>${l(e.company)}</h3>
          </div>
          <span class="nq-ticker">${l(e.ticker)}</span>
        </div>
        <span class="nq-sector ${Fe(e.sector)}">${l(e.sector)}</span>
        <div class="nq-metrics">
          <div class="nq-metric">
            <span class="nq-metric-value">${fe(e.cap)}</span>
            <span class="nq-metric-label">Market Cap</span>
          </div>
          <div class="nq-metric">
            <span class="nq-metric-value">${(Number(e.weight)||0).toFixed(2)}%</span>
            <span class="nq-metric-label">Peso no Índice</span>
          </div>
        </div>
        <span class="nq-cat">${l(e.category)} · ${l(e.concentration)}</span>
      </article>`).join("")}</div>`}function da(t){return`
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
        <td><span class="nq-sector ${Fe(e.sector)}">${l(e.sector)}</span></td>
        <td>${fe(e.cap)}</td>
        <td><strong class="nq-weight">${(Number(e.weight)||0).toFixed(2)}%</strong></td>
        <td>${(Number(e.cumulative)||0).toFixed(2)}%</td>
        <td><span class="nq-cat">${l(e.category)}</span></td>
      </tr>`).join("")}</tbody>
      </table>
    </div>`}function la(t="nasdaq-100-view"){const a=document.getElementById(t);if(!a){console.error(`❌ Contentor ${t} não encontrado!`);return}const e={search:"",sector:"",category:"",sortBy:"rank",view:"cards"},o=na(j).map(p=>`<option value="${l(p)}">${l(p)}</option>`).join(""),r=ia(j).map(p=>`
      <div class="nq-breakdown-item">
        <div class="nq-breakdown-head" style="color: ${ta(p.sector)}">
          <span>${l(p.sector)}</span>
          <span class="nq-breakdown-count">${p.count} · ${p.weight.toFixed(2)}%</span>
        </div>
        <p class="nq-breakdown-list">${p.companies.map(c=>l(c)).join(", ")}</p>
      </div>`).join("");a.innerHTML=`
    <div class="nasdaq-view">
      <header class="nq-header">
        <div class="nq-header-content">
          <h2>Nasdaq-100</h2>
          <p>💻 100 maiores empresas não financeiras da Nasdaq · Snapshot 01/05/2026</p>
        </div>
        <div class="nq-stats">
          <div class="nq-stat">
            <span class="nq-stat-value">${j.length}</span>
            <span class="nq-stat-label">Empresas</span>
          </div>
          <div class="nq-stat">
            <span class="nq-stat-value">${fe(aa(j))}</span>
            <span class="nq-stat-label">Market Cap Total</span>
          </div>
          <div class="nq-stat">
            <span class="nq-stat-value">${oa(j).toFixed(2)}%</span>
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
  `;const s=a.querySelector("#nq-results"),n=a.querySelector("#nq-search"),i=a.querySelector("#nq-sector"),d=a.querySelector("#nq-cap"),u=a.querySelector("#nq-sort"),m=()=>{const p=sa(ra(j,{search:e.search,sector:e.sector,category:e.category}),e.sortBy);if(p.length===0){s.innerHTML='<p class="nq-empty">Nenhuma empresa encontrada.</p>';return}if(e.view==="cards"){s.innerHTML=ca(p);return}s.innerHTML=da(p),s.querySelectorAll(".nq-table th[data-sort]").forEach(c=>{c.addEventListener("click",()=>{e.sortBy=c.getAttribute("data-sort"),u&&(u.value=e.sortBy),m()})})};n&&n.addEventListener("input",()=>{e.search=n.value,m()}),i&&i.addEventListener("change",()=>{e.sector=i.value,m()}),d&&d.addEventListener("change",()=>{e.category=d.value,m()}),u&&u.addEventListener("change",()=>{e.sortBy=u.value,m()}),a.querySelectorAll(".nq-view-btn").forEach(p=>{p.addEventListener("click",()=>{e.view=p.getAttribute("data-view"),a.querySelectorAll(".nq-view-btn").forEach(c=>c.classList.remove("active")),p.classList.add("active"),m()})}),m()}const pa={bullish:{label:"Otimista",cls:"positive"},bearish:{label:"Pessimista",cls:"negative"},neutral:{label:"Neutro",cls:""}};async function ma(t="daily-summary"){const a=document.getElementById(t);if(a){a.innerHTML='<p class="summary-empty">Carregando resumo do dia...</p>';try{const e=await fetch(`${K}/api/resumo-dia`);if(!e.ok)throw new Error(`HTTP ${e.status}`);const o=await e.json();ga(a,o.dados||{})}catch(e){console.error("Erro ao carregar Resumo do Dia:",e),a.innerHTML='<p class="summary-empty">Resumo do dia indisponível no momento.</p>'}}}function He(t){const a=Number(t)||0;return`${a>0?"+":""}${a.toFixed(2)}%`}function ua(t){if(!t)return"";const a=new Date(`${t}T00:00:00`);return Number.isNaN(a.getTime())?"":a.toLocaleDateString("pt-BR")}function Se(t,a){const e=(a||[]).map(o=>`
        <div class="summary-row">
          <span class="mini-symbol">${l(o.symbol||"")}</span>
          <span class="mini-name">${l(o.name||"")}</span>
          <span class="mini-change ${o.changePct>=0?"positive":"negative"}">${He(o.changePct)}</span>
        </div>`).join("");return`
    <div class="summary-list">
      <h4 class="summary-list-title">${t}</h4>
      ${e}
    </div>`}function ga(t,a){const e=a.stats||{},o=pa[a.marketMood]||{label:"—",cls:""},r=ua(a.referenceDate),s=[{label:"Em alta",value:e.gainers??"—",cls:"positive"},{label:"Em baixa",value:e.losers??"—",cls:"negative"},{label:"Estáveis",value:e.neutral??"—",cls:""},{label:"Total",value:e.total??"—",cls:""},{label:"Humor",value:o.label,cls:o.cls}].map(i=>`
      <div class="daily-card ${i.cls}">
        <span class="daily-label">${i.label}</span>
        <span class="daily-value">${i.value}</span>
      </div>`).join(""),n=(a.sectorPerformance||[]).map(i=>`
      <div class="daily-sector-card ${i.avgChangePct>=0?"positive":"negative"}">
        <span class="sector-name">${l(i.name||"")}</span>
        <span class="sector-change">${He(i.avgChangePct)}</span>
      </div>`).join("");t.innerHTML=`
    <header class="daily-summary-header">
      <h2>📊 Resumo do Dia</h2>
      ${r?`<span class="daily-date">Referência: ${r}</span>`:""}
    </header>

    <div class="daily-summary-grid">${s}</div>

    <div class="daily-lists">
      ${Se("🚀 Maiores altas",a.topGainers)}
      ${Se("📉 Maiores baixas",a.topLosers)}
    </div>

    <div class="daily-sectors">
      <h3>📈 Desempenho por setor</h3>
      <div class="daily-sectors-list">${n}</div>
    </div>
  `}const Oe="sp500-price-alerts",ve=50;function ya(){try{const t=localStorage.getItem(Oe);if(!t)return[];const a=JSON.parse(t);return Array.isArray(a)&&a.length>0&&Array.isArray(a[0])?a:Array.isArray(a)&&a.length>0&&typeof a[0]=="object"?a.map(e=>[e.symbol,e]):[]}catch(t){return console.error("Erro ao carregar price alerts:",t),[]}}function le(){try{const t=Array.from(J.entries());localStorage.setItem(Oe,JSON.stringify(t))}catch(t){console.error("Erro ao salvar price alerts:",t)}}function va(t,a){let e;return function(...r){const s=()=>{clearTimeout(e),t(...r)};clearTimeout(e),e=setTimeout(s,a)}}function he(){const t=document.getElementById("nav-menu"),a=document.getElementById("menu-toggle");t&&t.classList.remove("open"),a&&a.setAttribute("aria-expanded","false")}function ha(){const t=document.getElementById("menu-toggle"),a=document.getElementById("nav-menu");!t||!a||(t.addEventListener("click",e=>{e.stopPropagation();const o=a.classList.toggle("open");t.setAttribute("aria-expanded",String(o))}),document.addEventListener("click",e=>{a.classList.contains("open")&&!a.contains(e.target)&&he()}),document.addEventListener("keydown",e=>{e.key==="Escape"&&he()}))}let L=[],R=[],I=1,te="dashboard",W=new Set;const $e=new Set,me=ya(),J=new Map(me&&me.length>0?me:[]);let B,P,Z,Q,ee,O,F,V,H;function fa(){B=document.getElementById("sector-filter"),P=document.getElementById("country-filter"),Z=document.getElementById("search-input"),Q=document.getElementById("dividend-min"),ee=document.getElementById("sort-select"),O=document.getElementById("table-body"),F=document.getElementById("stats"),V=document.getElementById("pagination"),H=document.getElementById("header-checkbox"),document.querySelectorAll(".nav-tab").forEach(s=>{s.addEventListener("click",n=>{n.preventDefault();const i=s.getAttribute("data-tab");ba(i),he()})}),ha(),B&&B.addEventListener("change",U),P&&P.addEventListener("change",U),Z&&Z.addEventListener("input",va(U,300)),Q&&Q.addEventListener("change",U),ee&&ee.addEventListener("change",U),H&&H.addEventListener("change",()=>{const s=H.checked;O.querySelectorAll(".row-checkbox").forEach(i=>{i.checked=s,i.dispatchEvent(new Event("change"))})});const a=document.getElementById("select-all"),e=document.getElementById("deselect-all"),o=document.getElementById("export-csv"),r=document.getElementById("export-json");a&&a.addEventListener("click",()=>{R.forEach(s=>W.add(s.symbol)),ae(),oe()}),e&&e.addEventListener("click",()=>{W.clear(),ae(),oe()}),o&&o.addEventListener("click",Ha),r&&r.addEventListener("click",Oa),ze(),Ve(),Ue(),ma(),qa()}document.addEventListener("DOMContentLoaded",fa);function ba(t){te=t,ze(),Ve()}function q(t,a){$e.has(t)||($e.add(t),a())}function ze(){const t=document.getElementById("dashboard-view"),a=document.getElementById("treemap-view"),e=document.getElementById("heatmap-view"),o=document.getElementById("bubble-chart-view"),r=document.getElementById("dividends-view"),s=document.getElementById("stock-of-day-view"),n=document.getElementById("daily-curiosity-view"),i=document.getElementById("dow-jones-view"),d=document.getElementById("dividend-kings-view"),u=document.getElementById("dividend-aristocrats-view"),m=document.getElementById("nasdaq-100-view");switch([t,a,e,o,r,s,n,i,d,u,m].forEach(c=>{c&&(c.style.display="none")}),te){case"dashboard":t&&(t.style.display="block");break;case"stock-of-day":s&&(s.style.display="block",Ge());break;case"daily-curiosity":n&&(n.style.display="block",q("daily-curiosity",_e));break;case"treemap":a&&(a.style.display="block",q("treemap",ct));break;case"heatmap":e&&(e.style.display="block",q("heatmap",lt));break;case"bubble":o&&(o.style.display="block",Ye());break;case"dividends":r&&(r.style.display="block",je());break;case"dow-jones":i&&(i.style.display="block",q("dow-jones",ka));break;case"dividend-kings":d&&(d.style.display="block",q("dividend-kings",Ca));break;case"dividend-aristocrats":u&&(u.style.display="block",q("dividend-aristocrats",wa));break;case"nasdaq-100":m&&(m.style.display="block",q("nasdaq-100",xa));break;default:t&&(t.style.display="block")}}function Ye(){const t=document.getElementById("bubble-chart-view");if(!t){console.error("❌ bubble-chart-view não encontrado!");return}t.innerHTML='<div style="text-align: center; padding: 40px;"><p>Carregando gráfico de bolhas...</p></div>',ut(L,"bubble-chart-view")}function je(){const t=document.getElementById("dividends-view");if(!t){console.error("❌ dividends-view não encontrado!");return}if(L.length===0){t.innerHTML='<div style="text-align: center; padding: 40px;"><p>Carregando dados de dividendos...</p></div>';return}xt(L,"dividends-view")}function ka(){if(!document.getElementById("dow-jones-view")){console.error("❌ dow-jones-view não encontrado!");return}Rt("dow-jones-view")}function Ca(){if(!document.getElementById("dividend-kings-view")){console.error("❌ dividend-kings-view não encontrado!");return}Yt("dividend-kings-view")}function wa(){if(!document.getElementById("dividend-aristocrats-view")){console.error("❌ dividend-aristocrats-view não encontrado!");return}Zt("dividend-aristocrats-view")}function xa(){if(!document.getElementById("nasdaq-100-view")){console.error("❌ nasdaq-100-view não encontrado!");return}la("nasdaq-100-view")}function Ve(){document.querySelectorAll(".nav-tab").forEach(a=>{a.classList.remove("active"),a.getAttribute("data-tab")===te&&a.classList.add("active")})}async function Ue(){F&&(F.textContent="Carregando dados...");try{const t=await fetch(`${K}/api/setores`);if(!t.ok)throw new Error("Erro ao buscar setores");const o=((await t.json()).setores||[]).map(async s=>{try{const n=await fetch(`${K}/api/setor/${s}`);if(!n.ok)throw new Error(`HTTP ${n.status}`);const i=await n.json(),d=ue.find(m=>m.id===s),u=d?d.name:s;return i.dados&&i.dados.companies&&Array.isArray(i.dados.companies)?{generatedAt:i.dados.generatedAt||null,companies:i.dados.companies.map(m=>({...m,sector:s,sectorName:u}))}:{generatedAt:null,companies:[]}}catch(n){return console.error(`❌ Erro ao carregar ${s}:`,n),{generatedAt:null,companies:[]}}}),r=await Promise.all(o);L=r.flatMap(s=>s.companies),Ae(r.map(s=>s.generatedAt).filter(Boolean)),B&&(B.innerHTML='<option value="">Todos os Setores</option>',[...new Set(L.map(n=>n.sector))].sort().forEach(n=>{var d;const i=document.createElement("option");i.value=n,i.textContent=((d=ue.find(u=>u.id===n))==null?void 0:d.name)||n,B.appendChild(i)})),P&&(P.innerHTML='<option value="">Todos os Países</option>',[...new Set(L.map(n=>Ie(n.headquarters)))].sort().forEach(n=>{const i=document.createElement("option");i.value=n,i.textContent=n,P.appendChild(i)})),U(),oe(),te==="bubble"&&Ye(),te==="dividends"&&je()}catch(t){console.error("❌ Erro ao carregar dados:",t),F&&(F.textContent="Erro ao carregar dados. Tente novamente."),Ae([])}}function Ae(t){const a=document.getElementById("freshness-badge"),e=document.getElementById("freshness-text");if(!e)return;const o=(t||[]).map(d=>new Date(d)).filter(d=>!Number.isNaN(d.getTime()));if(o.length===0){a&&(a.classList.remove("fd-fresh","fd-aging","fd-stale"),a.classList.add("fd-unknown")),e.textContent="Data indisponível";return}const r=new Date(Math.max(...o.map(d=>d.getTime()))),s=Math.floor((Date.now()-r.getTime())/864e5);let n="fd-fresh";s>30?n="fd-stale":s>7&&(n="fd-aging"),a&&(a.classList.remove("fd-fresh","fd-aging","fd-stale","fd-unknown"),a.classList.add(n));const i=r.toLocaleDateString("pt-BR");e.textContent=`Dados de ${i}`,a&&(a.title=`Última atualização dos dados: ${i}`)}function U(){const t=B?B.value:"",a=P?P.value:"",e=Z?Z.value.toLowerCase():"",o=Q&&parseFloat(Q.value)||0,r=ee?ee.value:"symbol-asc";R=L.filter(i=>{const d=!t||i.sector===t,u=!a||Ie(i.headquarters)===a,m=!e||i.symbol.toLowerCase().includes(e)||i.name.toLowerCase().includes(e)||i.subIndustry&&i.subIndustry.toLowerCase().includes(e)||i.headquarters&&i.headquarters.toLowerCase().includes(e),p=!o||(parseFloat(i.dividendYield)||0)>=o;return d&&u&&m&&p});const[s,n]=r.split("-");R.sort((i,d)=>{let u=i[s],m=d[s];if(typeof u=="string"){const y=(u||"").localeCompare(m||"");return n==="asc"?y:-y}const p=parseFloat(u)||0,c=parseFloat(m)||0;return n==="asc"?p-c:c-p}),I=1,ae(),oe()}function ae(){if(!O){console.error("❌ tableBody não encontrado!");return}O.innerHTML="";const t=(I-1)*ve,a=t+ve;R.slice(t,a).forEach((o,r)=>{const s=W.has(o.symbol),n=l(o.symbol),i=document.createElement("tr");i.innerHTML=`
      <td>
        <input type="checkbox" class="row-checkbox" data-symbol="${n}" 
          ${s?"checked":""}>
      </td>
      <td class="col-index">${t+r+1}</td>
      <td><strong>${l(o.symbol)}</strong></td>
      <td>${l(o.name||"N/A")}</td>
      <td>${l(o.sectorName||o.sector||"N/A")}</td>
      <td>${de(o.marketCap)}</td>
      <td>${l(o.subIndustry||o.industry||"N/A")}</td>
      <td>${l(o.headquarters||"N/A")}</td>
      <td>${Me(o)}</td>
    `;const d=i.querySelector(".row-checkbox");d.addEventListener("change",()=>{d.checked?W.add(o.symbol):W.delete(o.symbol),oe(),Ee()}),O.appendChild(i)}),Ee(),Sa()}function Ee(){if(!H||!O)return;const t=O.querySelectorAll(".row-checkbox"),a=Array.from(t).filter(e=>e.checked).length;H.checked=t.length>0&&a===t.length,H.indeterminate=a>0&&a<t.length}function Sa(){if(!V)return;V.innerHTML="";const t=Math.ceil(R.length/ve),a=document.createElement("button");a.textContent="Anterior",a.disabled=I===1,a.addEventListener("click",()=>{I>1&&(I--,ae())}),V.appendChild(a);const e=document.createElement("span");e.textContent=`Página ${I} de ${t}`,V.appendChild(e);const o=document.createElement("button");o.textContent="Próxima",o.disabled=I===t,o.addEventListener("click",()=>{I<t&&(I++,ae())}),V.appendChild(o)}function oe(){if(!F)return;const t=R.length,a=W.size,e=R.filter(r=>Number(r.dividendYield)>0),o=e.length>0?(e.reduce((r,s)=>r+Number(s.dividendYield),0)/e.length).toFixed(2):"0.00";F.innerHTML=`Total: ${t} | Selecionadas: ${a} | Yield Médio (pagadoras): ${o}%`}async function Ge(){const t=document.getElementById("stock-of-day-view");if(t){t.innerHTML=`
    <div class="stock-of-day-loading">
      <div class="loading-spinner"></div>
      <p>Analisando o mercado... selecionando a melhor oportunidade de hoje</p>
    </div>
  `;try{if(L.length===0&&await Ue(),L.length===0){t.innerHTML=`
        <div class="stock-of-day-error">
          <h3>⚠️ Dados indisponíveis</h3>
          <p>Não foi possível carregar as empresas do S&P 500. Verifique a conexão com o servidor.</p>
          <button class="retry-btn" onclick="loadStockOfDay()">Tentar novamente</button>
        </div>
      `;return}const a=new Date().toISOString().slice(0,10),e=Ia(a);if(e){Te(t,e);return}const o=await $a();o.primary&&Da(a,o),Te(t,o)}catch(a){console.error("Erro ao carregar Ação do Dia:",a),t.innerHTML=`
      <div class="stock-of-day-error">
        <h3>⚠️ Indisponível no momento</h3>
        <p>Não foi possível gerar a análise. Tente novamente mais tarde.</p>
        <button class="retry-btn" onclick="loadStockOfDay()">Tentar novamente</button>
      </div>
    `}}}function $a(){return new Promise(t=>{setTimeout(()=>{const a=new Date().toISOString().slice(0,10),e=Aa(a),o=L.filter(d=>d.marketCap&&d.marketCap>1e9).map(d=>{const u=Ea(d),m=Ta(d.sector),p=(d.dividendYield||0)>2?10:0,c=Math.min(20,Math.log10(d.marketCap/1e9)*5),y=La(d),C=u+m+p+c+y;return{...d,score:Math.round(C*100)/100,breakdown:{technical:u,sector:m,dividend:p,liquidity:Math.round(c),volatility:Math.round(y)},rationale:Ma(d,u,m,p)}}).sort((d,u)=>u.score-d.score);if(o.length===0){t({date:a,primary:null,alternatives:[],generatedAt:new Date().toISOString()});return}const r=o.slice(0,Math.min(10,o.length)),s=e%r.length,n=r[s],i=r.filter((d,u)=>u!==s).slice(0,3);t({date:a,primary:n,alternatives:i,generatedAt:new Date().toISOString()})},100)})}function Aa(t){let a=0;for(let e=0;e<t.length;e++)a=(a<<5)-a+t.charCodeAt(e),a|=0;return Math.abs(a)}function Ea(t){let a=50;const e=t.dividendYield||0;e>4?a+=15:e>2?a+=8:e>0&&(a+=3);const o=t.marketCap||0;o>5e11?a+=10:o>1e11?a+=7:o>5e10?a+=5:o>1e10&&(a+=3);const r=(t.subIndustry||"").toLowerCase();["software","semiconductors","biotechnology","cloud","ai","cybersecurity","renewable"].some(n=>r.includes(n))&&(a+=12);const s=(t.name||"").toLowerCase();return["inc.","corporation","technologies","systems","solutions"].some(n=>s.includes(n))&&(a+=3),Math.min(90,a)}function Ta(t){return{"information-technology":15,"health-care":8,"consumer-discretionary":5,"communication-services":7,industrials:5,financials:3,materials:2,energy:0,utilities:-2,"real-estate":-3,"consumer-staples":1}[t]||0}function La(t){const a=t.marketCap||0;return a>2e11?8:a>5e10?12:a>1e10?15:18}function Ma(t,a,e,o){const r=[];return a>60&&r.push("Fundamentos técnicos sólidos"),e>10&&r.push(`Setor em momento favorável (${t.sectorName})`),o&&r.push(`Dividend yield atrativo (${(t.dividendYield||0).toFixed(1)}%)`),t.marketCap>1e11&&r.push("Grande capitalização — liquidez e estabilidade"),r.length===0&&r.push("Equilíbrio entre risco e retorno"),r.join(" • ")}function Ia(t){try{const a=localStorage.getItem("sp500-stock-of-day");if(!a)return null;const e=JSON.parse(a);return e.date===t&&e.primary?e:null}catch{return null}}function Da(t,a){try{localStorage.setItem("sp500-stock-of-day",JSON.stringify(a))}catch{}}function Te(t,a){const{primary:e,alternatives:o,generatedAt:r}=a;if(!e){t.innerHTML=`
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
            ${Object.entries(e.breakdown).map(([s,n])=>`
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
          <p>${e.rationale}</p>
        </div>

        <div class="stock-metrics">
          <div class="metric">
            <span class="metric-label">Market Cap</span>
            <span class="metric-value">${de(e.marketCap)}</span>
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
          ${o.map((s,n)=>`
            <div class="alt-card">
              <span class="alt-rank">${n+2}º</span>
              <div class="alt-info">
                <div class="alt-symbol">${l(s.symbol)}</div>
                <div class="alt-name">${l(s.name)}</div>
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
  `}function Ra(t){const a=t.toUpperCase(),e=J.get(a);if(e&&e.triggered){confirm(`${t}: alerta já disparado. Remover?`)&&Ba(a);return}const o=prompt(`Alerta de preço para ${t}:
Digite o preço alvo (ex: 150.25):`,e?e.target.toFixed(2):"");if(!o)return;const r=parseFloat(o);if(isNaN(r)||r<=0){alert("Preço inválido");return}const s=confirm(`Alertar quando o preço estiver ACIMA deste valor?
(OK = acima, Cancelar = abaixo)`)?"above":"below";Na(a,r,s)}function Na(t,a,e){return!t||typeof a!="number"||!["above","below"].includes(e)?!1:(J.set(t.toUpperCase(),{target:a,direction:e,triggered:!1}),le(),!0)}function Ba(t){J.delete(t.toUpperCase()),le()}window.loadStockOfDay=Ge;window.openCompanyDetails=nt;window.setPriceAlertPrompt=Ra;async function Pa(){const t=[];for(const[a,e]of J)if(!e.triggered)try{const o=await De(a),r=o[o.length-1],s=r?Number(r.close):NaN;if(!Number.isFinite(s))continue;(e.direction==="above"&&s>=e.target||e.direction==="below"&&s<=e.target)&&(e.triggered=!0,e.triggeredAt=new Date().toISOString(),e.triggeredPrice=s,t.push(`${a} ($${s.toFixed(2)})`))}catch(o){console.error(`Erro ao verificar ${a}:`,o)}return t.length>0&&(le(),window.alert(`🔔 Alerta(s) de preço atingido(s): ${t.join(", ")}`)),t}async function qa(){J.size!==0&&setInterval(async()=>{await Pa(),le()},6e4)}function Fa(t){return`"${(t==null?"":String(t)).replace(/"/g,'""')}"`}function Ha(){const t=["#","Símbolo","Empresa","Setor","Market Cap","Subindústria","Sede","Dividend Yield"],a=R.map((o,r)=>[r+1,o.symbol,o.name,o.sectorName,de(o.marketCap),o.subIndustry||o.industry||"N/A",o.headquarters||"N/A",Me(o)]),e=[t,...a].map(o=>o.map(Fa).join(",")).join(`
`);We(e,"sp500-export.csv","text/csv")}function Oa(){const t=JSON.stringify(R,null,2);We(t,"sp500-export.json","application/json")}function We(t,a,e){const o=new Blob([t],{type:e}),r=URL.createObjectURL(o),s=document.createElement("a");s.href=r,s.download=a,document.body.appendChild(s),s.click(),document.body.removeChild(s),URL.revokeObjectURL(r)}
