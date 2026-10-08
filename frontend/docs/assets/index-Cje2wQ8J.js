(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))o(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const i of r.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&o(i)}).observe(document,{childList:!0,subtree:!0});function a(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(s){if(s.ep)return;s.ep=!0;const r=a(s);fetch(s.href,r)}})();const te=window.location.hostname,Y=te==="localhost"||te==="127.0.0.1"?"http://localhost:5001":"https://sp500-site-production.up.railway.app",K=[{id:"communication-services",name:"Communication Services"},{id:"consumer-discretionary",name:"Consumer Discretionary"},{id:"consumer-staples",name:"Consumer Staples"},{id:"energy",name:"Energy"},{id:"financials",name:"Financials"},{id:"health-care",name:"Health Care"},{id:"industrials",name:"Industrials"},{id:"information-technology",name:"Information Technology"},{id:"materials",name:"Materials"},{id:"real-estate",name:"Real Estate"},{id:"utilities",name:"Utilities"}];window.API_BASE_URL=Y;window.SECTORS=K;console.log("✅ Configuração global carregada:",Y);let z=[],m=null,W=0,X="",re="alfabética";async function ve(){try{const e=document.getElementById("daily-curiosity-view");if(!e){console.error("Elemento daily-curiosity-view não encontrado");return}e.innerHTML='<div class="curiosidade-loading">Carregando curiosidade...</div>';const t=await fetch(`${Y}/api/curiosidades`);if(!t.ok){console.error(`Erro ao buscar curiosidades: ${t.status}`),e.innerHTML=`<div class="curiosidade-erro">Erro ao carregar curiosidades (${t.status})</div>`;return}const a=await t.json();if(!a.sucesso||!a.dados||!a.dados.curiosidades){console.error("Dados de curiosidades inválidos:",a),e.innerHTML='<div class="curiosidade-erro">Formato de dados inválido</div>';return}if(z=a.dados.curiosidades,W=a.dados.total||z.length,X=a.dados.proximaEmpresa||"",re=a.dados.ordem||"alfabética",z.length===0){e.innerHTML='<div class="curiosidade-erro">Nenhuma curiosidade disponível</div>';return}fe(),he()}catch(e){console.error("Erro ao carregar curiosidades:",e);const t=document.getElementById("daily-curiosity-view");t&&(t.innerHTML=`<div class="curiosidade-erro">Erro ao carregar: ${e.message}</div>`)}}function fe(){if(z.length===0)return;const e=new Date,t=new Date(e.getFullYear(),e.getMonth(),e.getDate()),o=Math.floor(t.getTime()/864e5)%z.length;m=z[o],console.log(`Curiosidade do dia: ${m==null?void 0:m.empresa}`)}function he(){const e=document.getElementById("daily-curiosity-view");if(!e||!m){console.error("View ou curiosidade não encontrada");return}be();const t=`
    <div class="curiosidade-container">
      <div class="curiosidade-header">
        <h1>🌟 Curiosidade do Dia</h1>
        <p class="curiosidade-data">${ye()}</p>
      </div>

      <div class="curiosidade-card">
        <div class="curiosidade-simbolo">
          <span class="simbolo-badge">${m.simbolo}</span>
          <span class="posicao-badge">#${m.posicao}</span>
        </div>

        <div class="curiosidade-conteudo">
          <h2 class="curiosidade-empresa">${m.empresa}</h2>
          <p class="curiosidade-setor">
            <strong>Setor:</strong> ${m.setor||"N/A"}
          </p>

          <div class="curiosidade-titulo">
            <h3>${m.titulo}</h3>
          </div>

          <div class="curiosidade-descricao">
            <p>${m.descricao}</p>
          </div>

          ${m.fatos&&m.fatos.length>0?`
            <div class="curiosidade-fatos">
              <h4>📊 Fatos Interessantes:</h4>
              <ul>
                ${m.fatos.map(a=>`<li>${a}</li>`).join("")}
              </ul>
            </div>
          `:""}

          ${m.dividendYield?`
            <div class="curiosidade-dados">
              <p><strong>Dividend Yield:</strong> ${m.dividendYield}</p>
            </div>
          `:""}

          ${m.marketCap?`
            <div class="curiosidade-dados">
              <p><strong>Market Cap:</strong> ${m.marketCap}</p>
            </div>
          `:""}

          ${m.insight?`
            <div class="curiosidade-insight">
              <p><em>💡 ${m.insight}</em></p>
            </div>
          `:""}

          ${W>0?`
            <div class="curiosidade-progresso">
              <div class="progresso-texto">
                <span>Rotatividade diária · ordem ${re}</span>
                <span>Empresa ${m.posicao} de ${W}</span>
              </div>
              <div class="progresso-barra">
                <div class="progresso-preenchido" style="width: ${Number(m.posicao)/W*100}%;"></div>
              </div>
            </div>
          `:""}

          <div class="curiosidade-acoes">
            <button class="btn-compartilhar" onclick="compartilharCuriosidade()">
              📤 Compartilhar
            </button>
            ${m.link?`
              <a href="${m.link}" target="_blank" class="btn-saibamais">
                🔗 Saiba Mais
              </a>
            `:""}
          </div>
        </div>
      </div>

      <div class="curiosidade-footer">
        <p>Curiosidade de ${m.empresa} - Atualizado em ${m.dataAdicao||"N/A"}</p>
        ${X?`<p class="curiosidade-proxima">⏭️ Amanhã: ${X}</p>`:""}
        <p class="curiosidade-dica">💡 Uma empresa diferente a cada dia, em ordem alfabética do S&P 500!</p>
      </div>
    </div>
  `;e.innerHTML=t,window.compartilharCuriosidade=xe}function be(){if(document.getElementById("curiosidade-styles"))return;const e=document.createElement("style");e.id="curiosidade-styles",e.textContent=`
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
  `,document.head.appendChild(e)}function xe(){if(!m)return;const e=(m.fatos||[]).map(a=>`• ${a}`).join(`
`),t=`🌟 Curiosidade do Dia: ${m.empresa} (${m.simbolo})

${m.descricao}

${e}

💡 ${m.insight||""}`;navigator.share?navigator.share({title:`Curiosidade do Dia - ${m.empresa}`,text:t,url:window.location.href}).catch(a=>console.log("Erro ao compartilhar:",a)):navigator.clipboard.writeText(t).then(()=>{alert("Curiosidade copiada para a área de transferência!")}).catch(a=>{alert("Erro ao copiar: "+a)})}function ye(){const e=new Date,t={weekday:"long",year:"numeric",month:"long",day:"numeric"};return e.toLocaleDateString("pt-BR",t)}function U(e){const t=Number(e);return!t||Number.isNaN(t)?"N/A":t>=1e12?`$${(t/1e12).toFixed(3)}T`:t>=1e9?`$${(t/1e9).toFixed(2)}B`:t>=1e6?`$${(t/1e6).toFixed(2)}M`:`$${t.toLocaleString("en-US")}`}function v(e){return e?String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;"):""}const $e=new Set(["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming","D.C."]);function ie(e){if(!e)return"Desconhecido";const t=String(e).split(",").map(o=>o.trim().replace(/\[\d+\]$/,"")),a=t[t.length-1];return!a||a.toLowerCase()==="none"?"Desconhecido":$e.has(a)?"United States":a}async function we(e){try{const t=await fetch(`/api/historico/${e}`);if(!t.ok)throw new Error(`Erro ao buscar histórico de ${e}`);return(await t.json()).registros||[]}catch(t){return console.error(`Erro ao buscar histórico de ${e}:`,t),[]}}const V=760,J=320,y={top:28,right:28,bottom:44,left:68};function ke(e){if(!e)return"";const[t,a,o]=e.split("-");return`${o}/${a}/${t.slice(2)}`}function Z(e){return Number.isFinite(e)?e>=100?`$${e.toFixed(0)}`:`$${e.toFixed(2)}`:"—"}function Ce(e){const t=e.map(h=>h.close),a=Math.min(...t),o=Math.max(...t),s=o-a||1,r=a-s*.08,i=o+s*.08,n=e.length,l=h=>y.left+h/(n-1)*(V-y.left-y.right),d=h=>y.top+(1-(h-r)/(i-r))*(J-y.top-y.bottom);let p=`<svg viewBox="0 0 ${V} ${J}" style="width:100%;height:auto;display:block;background:var(--plot-bg);border-radius:8px">`;const c=5;for(let h=0;h<=c;h++){const x=r+(i-r)*h/c,L=d(x);p+=`<line x1="${y.left}" y1="${L.toFixed(1)}" x2="${V-y.right}" y2="${L.toFixed(1)}" stroke="var(--chart-axis)" stroke-width="1"/>`,p+=`<text x="${y.left-8}" y="${(L+4).toFixed(1)}" text-anchor="end" font-size="11" fill="var(--chart-label)">${Z(x)}</text>`}const u=[];for(let h=0;h<=4;h++)u.push(Math.round((n-1)*h/4));u.forEach(h=>{const x=l(h);p+=`<text x="${x.toFixed(1)}" y="${J-y.bottom+18}" text-anchor="middle" font-size="11" fill="var(--chart-label)">${ke(e[h].data)}</text>`});const g=e.map((h,x)=>`${l(x).toFixed(1)},${d(h.close).toFixed(1)}`).join(" "),f=`${y.left},${d(r).toFixed(1)} `+g+` ${l(n-1).toFixed(1)},${d(r).toFixed(1)}`;p+=`<polygon points="${f}" fill="rgba(0, 212, 255, 0.08)"/>`,p+=`<polyline points="${g}" fill="none" stroke="var(--accent-cyan)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;const $=e[n-1],b=d($.close);return p+=`<circle cx="${l(n-1).toFixed(1)}" cy="${b.toFixed(1)}" r="4" fill="var(--accent-cyan)"/>`,p+=`<text x="${V-y.right}" y="${(b-10).toFixed(1)}" text-anchor="end" font-size="12" font-weight="700" fill="var(--chart-text)">${Z($.close)}</text>`,p+="</svg>",p}async function Ee(e,t){var s;(s=document.querySelector(".modal-overlay"))==null||s.remove();const a=document.createElement("div");a.className="modal-overlay";const o=()=>a.remove();a.addEventListener("click",r=>{r.target===a&&o()}),document.addEventListener("keydown",r=>{r.key==="Escape"&&o()}),a.innerHTML=`
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
  `,document.body.appendChild(a),a.querySelector(".modal-close").addEventListener("click",o);try{const r=await we(e),i=a.querySelector("#price-chart-body");if(!r||r.length===0){i.innerHTML=`<p class="modal-error">Nenhum dado de preço disponível para ${v(e)}.</p>`;return}const n=r[0].close,l=r[r.length-1].close,d=(l-n)/n*100,p=d>=0,c=p?"positive":"negative";i.innerHTML=`
      <div class="price-stats">
        <div class="price-stat">
          <span class="price-stat-label">Último</span>
          <strong>${Z(l)}</strong>
        </div>
        <div class="price-stat">
          <span class="price-stat-label">Variação (2a)</span>
          <strong class="${c}">${p?"+":""}${d.toFixed(2)}%</strong>
        </div>
        <div class="price-stat">
          <span class="price-stat-label">Período</span>
          <strong>${r.length} pregões</strong>
        </div>
      </div>
      ${Ce(r)}
    `}catch(r){console.error(`Erro ao buscar histórico de ${e}:`,r);const i=a.querySelector("#price-chart-body");i.innerHTML=`<p class="modal-error">Erro ao carregar o histórico de ${v(e)}. Verifique se o backend está online.</p>`}}function w(e,t){return`
    <div class="company-detail">
      <span class="company-detail-label">${e}</span>
      <strong class="company-detail-value">${t}</strong>
    </div>
  `}function Se(e){var r;(r=document.querySelector(".modal-overlay"))==null||r.remove();const t=document.createElement("div");t.className="modal-overlay";const a=()=>t.remove();t.addEventListener("click",i=>{i.target===t&&a()}),document.addEventListener("keydown",i=>{i.key==="Escape"&&a()});const o=e.dividendYield!==null&&e.dividendYield!==void 0?`${e.dividendYield.toFixed(2)}%`:"—",s=U(e.marketCap);t.innerHTML=`
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
          ${w("Empresa",v(e.name||"N/A"))}
          ${w("Setor",v(e.sectorName||e.sector||"N/A"))}
          ${w("Subindústria",v(e.subIndustry||"N/A"))}
          ${w("Sede",v(e.headquarters||"N/A"))}
          ${w("Market Cap",s)}
          ${w("Classificação",v(e.marketCapClassification||"N/A"))}
          ${w("Div. Yield",o)}
          ${w("Paga dividendos",e.hasDividend?v(e.hasDividend):"—")}
          ${w("Data de inclusão",v(e.dateAdded||"N/A"))}
          ${w("CIK",e.cik?v(String(e.cik)):"N/A")}
          ${w("Fundação",v(e.founded||"N/A"))}
        </div>
        <div class="modal-footer">
          <button class="modal-action" id="details-chart-btn">📈 Ver histórico de preços</button>
        </div>
      </div>
    </div>
  `,document.body.appendChild(t),t.querySelector(".modal-close").addEventListener("click",a),t.querySelector("#details-chart-btn").addEventListener("click",()=>{Ee(e.symbol,e.name)})}async function Ae(){const e=document.getElementById("treemap-view");if(e){e.style.display="flex",e.style.flexDirection="column",e.style.height="100%",e.style.width="100%",e.style.margin="0",e.style.padding="0",e.style.background="var(--bg-primary)",e.innerHTML='<div style="display:flex;align-items:center;justify-content:center;height:100%;width:100%;font-size:14px;color:var(--text-secondary)">Carregando mapa de setores...</div>';try{let i=function(d,p){const c=d/p*100;return c>=80?"#ff5252":c>=60?"#ff9800":c>=40?"#ffeb3b":c>=20?"#8bc34a":"#4caf50"};var t=i;const s=(await(await fetch(`${window.API_BASE_URL}/api/setores`)).json()).setores||[],r=await Promise.all(s.map(async d=>{var h;const c=await(await fetch(`${window.API_BASE_URL}/api/setor/${d}`)).json(),u=window.SECTORS.find(x=>x.id===d),g=((h=c.dados)==null?void 0:h.companies)||[],f=g.reduce((x,L)=>x+(L.marketCap||0),0),$=g.length>0?g.reduce((x,L)=>x+(L.dividendYield||0),0)/g.length:0,b=g.filter(x=>x.hasDividend==="Sim").length;return{id:d,name:(u==null?void 0:u.name)||d,cap:(f/1e9).toFixed(1),companies:g.length,avgDiv:parseFloat($.toFixed(2)),withDiv:b,topCompany:g.length>0?g[0].symbol:"N/A"}})),n=Math.max(...r.map(d=>parseFloat(d.cap)));let l=`
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
    `;r.forEach(d=>{const p=i(parseFloat(d.cap),n),c=(parseFloat(d.cap)/n*100).toFixed(1),u=["consumer-staples","communication-services","consumer-discretionary","energy","financials","health-care","industrials","information-technology","materials","real-estate","utilities"].includes(d.id),g=u?`/sectors/${d.id}.html`:"#";l+=`
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
        onmouseover="${u?`this.style.borderColor='${p}';this.style.background='rgba(${parseInt(p.slice(1,3),16)},${parseInt(p.slice(3,5),16)},${parseInt(p.slice(5,7),16)},0.05)';this.style.transform='translateY(-4px)';this.style.boxShadow='0 12px 32px ${p}22'`:""}"
        onmouseout="${u?"this.style.borderColor='var(--border)';this.style.background='var(--bg-secondary)';this.style.transform='translateY(0)';this.style.boxShadow='none'":""}"
        onclick="${u?`navigateToSector('${g}', '${d.id}')`:`alert('🔒 O setor \\"${d.name}\\" ainda está em desenvolvimento.\\n\\nApenas Consumer Staples, Communication Services, Consumer Discretionary, Energy, Financials, Health Care, Industrials, Information Technology, Materials, Real Estate e Utilities estão disponíveis por enquanto!')`}"
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
              background: ${p}22;
              border: 1px solid ${p}44;
              padding: 8px 12px;
              border-radius: 6px;
              font-size: 13px;
              font-weight: 700;
              color: ${p};
              text-align: center;
            ">
              ${c}%
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
                width: ${c}%;
                height: 100%;
                background: linear-gradient(90deg, ${p}44, ${p});
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
                color: ${p};
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
      `}),l+=`
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
    `,e.innerHTML=l}catch(a){console.error("Erro ao carregar treemap:",a),e.innerHTML='<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--accent-red)">Erro ao carregar mapa de setores</div>'}}}function Me(e,t){if(e==="#"){alert(`🔒 O setor "${t}" ainda está em desenvolvimento.

Apenas Consumer Staples, Communication Services, Consumer Discretionary, Energy, Financials, Health Care, Industrials, Information Technology, Materials, Real Estate e Utilities estão disponíveis por enquanto!`);return}window.open(e,"_blank")}window.navigateToSector=Me;async function De(){var t;const e=document.getElementById("heatmap-view");if(e){e.style.display="flex",e.style.flexDirection="column",e.style.height="100%",e.style.width="100%",e.style.padding="40px",e.style.boxSizing="border-box",e.style.background="var(--bg-primary)",e.style.overflowY="auto",e.innerHTML='<div style="text-align:center;color:var(--text-secondary)">Carregando heatmap...</div>';try{const s=(await(await fetch(`${window.API_BASE_URL}/api/setores`)).json()).setores||[];let r=`
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
    `;for(const i of s){const l=await(await fetch(`${window.API_BASE_URL}/api/setor/${i}`)).json(),d=window.SECTORS.find(u=>u.id===i),p=((t=l.dados)==null?void 0:t.companies)||[];if(p.length===0)continue;const c=p.sort((u,g)=>(g.marketCap||0)-(u.marketCap||0)).slice(0,4);r+=`
        <div style="margin-bottom: 40px;">
          <h3 style="
            font-size: 16px;
            margin: 0 0 20px 0;
            color: var(--text-primary);
            font-weight: 600;
          ">${(d==null?void 0:d.name)||i}</h3>

          <div style="
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 16px;
          ">
      `,c.forEach((u,g)=>{const f=(u.marketCap/1e9).toFixed(2),$=(u.dividendYield||0).toFixed(2);let b="#4caf50";f>500?b="#ff5252":f>200?b="#ff9800":f>100?b="#ffeb3b":f>50&&(b="#8bc34a"),r+=`
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
              ">${u.symbol}</div>
              <div style="
                font-size: 11px;
                background: ${b}22;
                color: ${b};
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
              ${u.name}
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
                ">$${f}B</div>
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
    `}}}async function Le(){var t;const e=document.getElementById("bubble-chart-view");if(e){e.style.display="flex",e.style.flexDirection="column",e.style.height="100%",e.style.width="100%",e.style.padding="40px",e.style.boxSizing="border-box",e.style.background="var(--bg-primary)",e.style.overflowY="auto",e.innerHTML='<div style="text-align:center;color:var(--text-secondary)">Carregando bubble chart...</div>';try{const s=(await(await fetch(`${window.API_BASE_URL}/api/setores`)).json()).setores||[];let r=[];for(const c of s){const g=await(await fetch(`${window.API_BASE_URL}/api/setor/${c}`)).json(),f=window.SECTORS.find(b=>b.id===c);(((t=g.dados)==null?void 0:t.companies)||[]).forEach(b=>{r.push({...b,sectorName:(f==null?void 0:f.name)||c,sectorId:c})})}const i=r.sort((c,u)=>(u.marketCap||0)-(c.marketCap||0)).slice(0,30);let n=`
      <div>
        <h2 style="
          margin: 0 0 8px 0;
          font-size: 24px;
          color: var(--text-primary);
          font-weight: 600;
        ">🫧 Bubble Chart - Top 30 Empresas</h2>
        <p style="
          margin: 0 0 40px 0;
          font-size: 13px;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 1px;
        ">Tamanho da bolha = Market Cap | Cor = Setor | Posição Y = Dividend Yield</p>
      </div>

      <div style="
        width: 100%;
        height: 600px;
        background: rgba(26, 26, 46, 0.5);
        border: 1px solid var(--border);
        border-radius: 12px;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        margin-bottom: 40px;
      ">
        <svg style="width: 100%; height: 100%;">
    `;const l={"communication-services":"#00d4ff","consumer-discretionary":"#00e676","consumer-staples":"#ffab00",energy:"#ff5252",financials:"#ba68c8","health-care":"#29b6f6",industrials:"#66bb6a","information-technology":"#ffa726",materials:"#ab47bc","real-estate":"#ec407a",utilities:"#26a69a"},d=Math.max(...i.map(c=>c.marketCap||0)),p=Math.max(...i.map(c=>c.dividendYield||0),5);i.forEach((c,u)=>{const g=(c.marketCap||0)/d*800+50,f=550-(c.dividendYield||0)/p*500,$=Math.sqrt((c.marketCap||0)/1e8)+10,b=l[c.sectorId]||"#00d4ff";n+=`
        <circle
          cx="${g}"
          cy="${f}"
          r="${$}"
          fill="${b}"
          opacity="0.6"
          stroke="var(--border)"
          stroke-width="1"
          style="cursor: pointer; transition: all 0.3s ease;"
          onmouseover="this.setAttribute('opacity', '0.9'); this.setAttribute('stroke-width', '2');"
          onmouseout="this.setAttribute('opacity', '0.6'); this.setAttribute('stroke-width', '1');"
          title="${c.symbol} - ${c.name}
Market Cap: $${(c.marketCap/1e9).toFixed(2)}B
Dividend: ${(c.dividendYield||0).toFixed(2)}%
Setor: ${c.sectorName}"
        />
        <text
          x="${g}"
          y="${f+4}"
          text-anchor="middle"
          font-size="11"
          fill="var(--text-primary)"
          font-weight="700"
          pointer-events="none"
        >${c.symbol}</text>
      `}),n+=`
          <!-- Eixo X (Market Cap) -->
          <line x1="50" y1="550" x2="850" y2="550" stroke="var(--border)" stroke-width="1"/>
          <text x="450" y="580" text-anchor="middle" font-size="12" fill="var(--text-secondary)">Market Cap →</text>

          <!-- Eixo Y (Dividend) -->
          <line x1="50" y1="50" x2="50" y2="550" stroke="var(--border)" stroke-width="1"/>
          <text x="20" y="300" text-anchor="middle" font-size="12" fill="var(--text-secondary)" transform="rotate(-90 20 300)">Dividend Yield →</text>
        </svg>
      </div>

      <div style="
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 12px;
        margin-bottom: 40px;
      ">
    `,window.SECTORS.forEach(c=>{const u=l[c.id]||"#00d4ff",g=i.filter(f=>f.sectorId===c.id).length;g>0&&(n+=`
          <div style="
            padding: 12px;
            background: rgba(26, 26, 46, 0.5);
            border: 1px solid var(--border);
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 12px;
          ">
            <div style="
              width: 16px;
              height: 16px;
              background: ${u};
              border-radius: 50%;
              flex-shrink: 0;
            "></div>
            <div>
              <div style="font-size: 12px; color: var(--text-primary); font-weight: 600;">
                ${c.name}
              </div>
              <div style="font-size: 10px; color: var(--text-secondary);">
                ${g} empresa${g>1?"s":""}
              </div>
            </div>
          </div>
        `)}),n+=`
      </div>

      <div style="
        padding: 20px;
        background: rgba(26, 26, 46, 0.5);
        border: 1px solid var(--border);
        border-radius: 12px;
      ">
        <h3 style="
          margin: 0 0 12px 0;
          font-size: 13px;
          color: var(--text-primary);
          text-transform: uppercase;
          letter-spacing: 1px;
        ">💡 Como Ler o Bubble Chart:</h3>
        <ul style="
          margin: 0;
          padding-left: 20px;
          font-size: 12px;
          color: var(--text-secondary);
          line-height: 1.8;
        ">
          <li><strong>Tamanho da Bolha:</strong> Market Cap (maior = mais valioso)</li>
          <li><strong>Posição Horizontal:</strong> Market Cap (à direita = maior)</li>
          <li><strong>Posição Vertical:</strong> Dividend Yield (acima = maior dividendo)</li>
          <li><strong>Cor:</strong> Representa o setor da empresa</li>
        </ul>
      </div>
    `,e.innerHTML=n}catch(a){console.error("Erro ao carregar bubble chart:",a),e.innerHTML=`
      <div style="
        text-align: center;
        color: var(--accent-red);
        padding: 40px;
      ">
        ❌ Erro ao carregar bubble chart
        <div style="
          font-size: 12px;
          color: var(--text-secondary);
          margin-top: 10px;
        ">${a.message}</div>
      </div>
    `}}}const se="sp500-watchlist",ne="sp500-price-alerts",Q=50;function Ie(){try{const e=localStorage.getItem(se);return e?JSON.parse(e):[]}catch(e){return console.error("Erro ao carregar watchlist:",e),[]}}function Te(){try{localStorage.setItem(se,JSON.stringify([...C]))}catch(e){console.error("Erro ao salvar watchlist:",e)}}function ze(){try{const e=localStorage.getItem(ne);if(!e)return[];const t=JSON.parse(e);return Array.isArray(t)&&t.length>0&&Array.isArray(t[0])?t:Array.isArray(t)&&t.length>0&&typeof t[0]=="object"?t.map(a=>[a.symbol,a]):[]}catch(e){return console.error("Erro ao carregar price alerts:",e),[]}}function ee(){try{const e=Array.from(F.entries());localStorage.setItem(ne,JSON.stringify(e))}catch(e){console.error("Erro ao salvar price alerts:",e)}}function Ne(e,t){let a;return function(...s){const r=()=>{clearTimeout(a),e(...s)};clearTimeout(a),a=setTimeout(r,t)}}let S=[],k=[],E=1,q="dashboard",N=new Set;const C=new Set(Ie()||[]),G=ze(),F=new Map(G&&G.length>0?G:[]);let A,D,P,H,O,B,M,I,_;document.addEventListener("DOMContentLoaded",()=>{console.log("🚀 Inicializando dashboard..."),A=document.getElementById("sector-filter"),D=document.getElementById("country-filter"),P=document.getElementById("search-input"),H=document.getElementById("dividend-min"),O=document.getElementById("sort-select"),B=document.getElementById("table-body"),M=document.getElementById("stats"),I=document.getElementById("pagination"),_=document.getElementById("header-checkbox"),console.log("📍 Elementos encontrados:",{sectorFilter:!!A,tableBody:!!B,statsEl:!!M,paginationEl:!!I});const e=document.querySelectorAll(".nav-tab");console.log(`📌 Encontradas ${e.length} abas`),e.forEach(r=>{r.addEventListener("click",i=>{i.preventDefault();const n=r.getAttribute("data-tab");console.log(`🔀 Navegando para: ${n}`),Be(n)})}),A&&A.addEventListener("change",T),D&&D.addEventListener("change",T),P&&P.addEventListener("input",Ne(T,300)),H&&H.addEventListener("change",T),O&&O.addEventListener("change",T),_&&_.addEventListener("change",()=>{B.querySelectorAll(".row-checkbox").forEach(i=>{i.checked=_.checked,i.dispatchEvent(new Event("change"))})});const t=document.getElementById("select-all"),a=document.getElementById("deselect-all"),o=document.getElementById("export-csv"),s=document.getElementById("export-json");t&&t.addEventListener("click",()=>{k.forEach(r=>N.add(r.symbol)),R(),j()}),a&&a.addEventListener("click",()=>{N.clear(),R(),j()}),o&&o.addEventListener("click",Ke),s&&s.addEventListener("click",Xe),console.log("✅ Event listeners registrados"),de(),ce(),le(),ue(),Ge(),console.log("✅ Dashboard inicializado com sucesso!")});function Be(e){console.log(`📍 Mudando aba para: ${e}`),q=e,de(),ce()}function de(){console.log(`🎨 Atualizando UI para: ${q}`);const e=document.getElementById("dashboard-view"),t=document.getElementById("treemap-view"),a=document.getElementById("heatmap-view"),o=document.getElementById("bubble-chart-view"),s=document.getElementById("watchlist-view"),r=document.getElementById("stock-of-day-view"),i=document.getElementById("daily-curiosity-view");switch([e,t,a,o,s,r,i].forEach(l=>{l&&(l.style.display="none")}),q){case"dashboard":e&&(e.style.display="block");break;case"stock-of-day":r&&(r.style.display="block",me());break;case"daily-curiosity":i&&(i.style.display="block",ve());break;case"treemap":t&&(t.style.display="block",Ae());break;case"heatmap":a&&(a.style.display="block",De());break;case"bubble":o&&(o.style.display="block",Le());break;case"watchlist":s&&(s.style.display="block",Pe());break;default:e&&(e.style.display="block")}}function ce(){document.querySelectorAll(".nav-tab").forEach(t=>{t.classList.remove("active"),t.getAttribute("data-tab")===q&&(t.classList.add("active"),console.log(`✅ Aba ativa: ${q}`))})}async function le(){console.log("📊 Carregando dados do dashboard..."),M&&(M.textContent="Carregando dados...");try{const e=await fetch(`${Y}/api/setores`);if(!e.ok)throw new Error("Erro ao buscar setores");const a=(await e.json()).setores||[];console.log(`🔄 Carregando ${a.length} setores...`);const o=a.map(async r=>{try{const i=await fetch(`${Y}/api/setor/${r}`);if(!i.ok)throw new Error(`HTTP ${i.status}`);const n=await i.json(),l=K.find(p=>p.id===r),d=l?l.name:r;return n.dados&&n.dados.companies&&Array.isArray(n.dados.companies)?n.dados.companies.map(p=>({...p,sector:r,sectorName:d})):[]}catch(i){return console.error(`❌ Erro ao carregar ${r}:`,i),[]}});S=(await Promise.all(o)).flat(),console.log(`✅ ${S.length} empresas carregadas`),A&&(A.innerHTML='<option value="">Todos os Setores</option>',[...new Set(S.map(i=>i.sector))].sort().forEach(i=>{var l;const n=document.createElement("option");n.value=i,n.textContent=((l=K.find(d=>d.id===i))==null?void 0:l.name)||i,A.appendChild(n)})),D&&(D.innerHTML='<option value="">Todos os Países</option>',[...new Set(S.map(i=>ie(i.headquarters)))].sort().forEach(i=>{const n=document.createElement("option");n.value=i,n.textContent=i,D.appendChild(n)})),T(),j()}catch(e){console.error("❌ Erro ao carregar dados:",e),M&&(M.textContent="Erro ao carregar dados. Tente novamente.")}}function T(){const e=A?A.value:"",t=D?D.value:"",a=P?P.value.toLowerCase():"",o=H&&parseFloat(H.value)||0,s=O?O.value:"symbol-asc";k=S.filter(n=>{const l=!e||n.sector===e,d=!t||ie(n.headquarters)===t,p=!a||n.symbol.toLowerCase().includes(a)||n.name.toLowerCase().includes(a)||n.subIndustry&&n.subIndustry.toLowerCase().includes(a)||n.headquarters&&n.headquarters.toLowerCase().includes(a),c=!o||(parseFloat(n.dividendYield)||0)>=o;return l&&d&&p&&c});const[r,i]=s.split("-");k.sort((n,l)=>{let d=n[r],p=l[r];if(typeof d=="string"){const g=(d||"").localeCompare(p||"");return i==="asc"?g:-g}const c=parseFloat(d)||0,u=parseFloat(p)||0;return i==="asc"?c-u:u-c}),E=1,R(),j()}function R(){if(!B){console.error("❌ tableBody não encontrado!");return}B.innerHTML="";const e=(E-1)*Q,t=e+Q,a=k.slice(e,t);console.log(`📋 Renderizando ${a.length} empresas (página ${E})`),a.forEach((o,s)=>{const r=N.has(o.symbol),i=document.createElement("tr");i.innerHTML=`
      <td>
        <input type="checkbox" class="row-checkbox" data-symbol="${o.symbol}" 
          ${r?"checked":""}>
      </td>
      <td class="col-index">${e+s+1}</td>
      <td><strong>${o.symbol}</strong></td>
      <td>${o.name||"N/A"}</td>
      <td>${o.sectorName||o.sector||"N/A"}</td>
      <td>${U(o.marketCap)}</td>
      <td>${o.subIndustry||o.industry||"N/A"}</td>
      <td>${o.headquarters||"N/A"}</td>
      <td>${o.dividendYield?parseFloat(o.dividendYield).toFixed(2)+"%":"N/A"}</td>
      <td>
        <button class="btn-watchlist" data-symbol="${o.symbol}" title="Adicionar à watchlist">
          ${C.has(o.symbol)?"★":"☆"}
        </button>
      </td>
    `;const n=i.querySelector(".row-checkbox");n.addEventListener("change",()=>{n.checked?N.add(o.symbol):N.delete(o.symbol),j()});const l=i.querySelector(".btn-watchlist");l.addEventListener("click",()=>{pe(o.symbol),l.textContent=C.has(o.symbol)?"★":"☆",ue()}),B.appendChild(i)}),console.log(`✅ ${a.length} linhas renderizadas`),Fe()}function Fe(){if(!I)return;I.innerHTML="";const e=Math.ceil(k.length/Q),t=document.createElement("button");t.textContent="Anterior",t.disabled=E===1,t.addEventListener("click",()=>{E>1&&(E--,R())}),I.appendChild(t);const a=document.createElement("span");a.textContent=`Página ${E} de ${e}`,I.appendChild(a);const o=document.createElement("button");o.textContent="Próxima",o.disabled=E===e,o.addEventListener("click",()=>{E<e&&(E++,R())}),I.appendChild(o)}function j(){if(!M)return;const e=k.length,t=N.size,a=k.length>0?(k.reduce((o,s)=>o+(parseFloat(s.dividendYield)||0),0)/k.length).toFixed(2):0;M.innerHTML=`Total: ${e} | Selecionadas: ${t} | Dividend Yield Médio: ${a}%`}function pe(e){C.has(e)?C.delete(e):C.add(e),Te()}function ue(){const e=document.querySelector("[data-watchlist-count]");e&&(e.textContent=C.size,console.log(`🌟 Watchlist atualizada: ${C.size} empresas`))}async function Pe(){const e=document.getElementById("watchlist-view");if(!e)return;const t=S.filter(o=>C.has(o.symbol));if(t.length===0){e.innerHTML="<p>Nenhuma empresa na watchlist.</p>";return}let a='<table class="watchlist-table"><thead><tr><th>#</th><th>Símbolo</th><th>Nome</th><th>Setor</th><th>Dividend Yield</th><th>Market Cap</th></tr></thead><tbody>';t.forEach((o,s)=>{a+=`<tr>
      <td>${s+1}</td>
      <td><strong>${o.symbol}</strong></td>
      <td>${o.name}</td>
      <td>${o.sectorName||"N/A"}</td>
      <td>${o.dividendYield?parseFloat(o.dividendYield).toFixed(2)+"%":"N/A"}</td>
      <td>${U(o.marketCap)}</td>
    </tr>`}),a+="</tbody></table>",e.innerHTML=a}async function me(){const e=document.getElementById("stock-of-day-view");if(e){e.innerHTML=`
    <div class="stock-of-day-loading">
      <div class="loading-spinner"></div>
      <p>Analisando o mercado... selecionando a melhor oportunidade de hoje</p>
    </div>
  `;try{if(S.length===0&&await le(),S.length===0){e.innerHTML=`
        <div class="stock-of-day-error">
          <h3>⚠️ Dados indisponíveis</h3>
          <p>Não foi possível carregar as empresas do S&P 500. Verifique a conexão com o servidor.</p>
          <button class="retry-btn" onclick="loadStockOfDay()">Tentar novamente</button>
        </div>
      `;return}const t=new Date().toISOString().slice(0,10),a=Ue(t);if(a){oe(e,a);return}const o=await He();o.primary&&Ve(t,o),oe(e,o)}catch(t){console.error("Erro ao carregar Ação do Dia:",t),e.innerHTML=`
      <div class="stock-of-day-error">
        <h3>⚠️ Indisponível no momento</h3>
        <p>Não foi possível gerar a análise. Tente novamente mais tarde.</p>
        <button class="retry-btn" onclick="loadStockOfDay()">Tentar novamente</button>
      </div>
    `}}}function He(){return new Promise(e=>{setTimeout(()=>{const t=new Date().toISOString().slice(0,10),a=Oe(t),o=S.filter(l=>l.marketCap&&l.marketCap>1e9).map(l=>{const d=Ye(l),p=qe(l.sector),c=C.has(l.symbol)?15:0,u=(l.dividendYield||0)>2?10:0,g=Math.min(20,Math.log10(l.marketCap/1e9)*5),f=Re(l),$=d+p+c+u+g+f;return{...l,score:Math.round($*100)/100,breakdown:{technical:d,sector:p,watchlist:c,dividend:u,liquidity:Math.round(g),volatility:Math.round(f)},rationale:je(l,d,p,c,u)}}).sort((l,d)=>d.score-l.score);if(o.length===0){e({date:t,primary:null,alternatives:[],marketContext:ae(),generatedAt:new Date().toISOString()});return}const s=o.slice(0,Math.min(10,o.length)),r=a%s.length,i=s[r],n=s.filter((l,d)=>d!==r).slice(0,3);e({date:t,primary:i,alternatives:n,marketContext:ae(),generatedAt:new Date().toISOString()})},100)})}function Oe(e){let t=0;for(let a=0;a<e.length;a++)t=(t<<5)-t+e.charCodeAt(a),t|=0;return Math.abs(t)}function Ye(e){let t=50;const a=e.dividendYield||0;a>4?t+=15:a>2?t+=8:a>0&&(t+=3);const o=e.marketCap||0;o>5e11?t+=10:o>1e11?t+=7:o>5e10?t+=5:o>1e10&&(t+=3);const s=(e.subIndustry||"").toLowerCase();["software","semiconductors","biotechnology","cloud","ai","cybersecurity","renewable"].some(i=>s.includes(i))&&(t+=12);const r=(e.name||"").toLowerCase();return["inc.","corporation","technologies","systems","solutions"].some(i=>r.includes(i))&&(t+=3),Math.min(90,t)}function qe(e){return{"information-technology":15,"health-care":8,"consumer-discretionary":5,"communication-services":7,industrials:5,financials:3,materials:2,energy:0,utilities:-2,"real-estate":-3,"consumer-staples":1}[e]||0}function Re(e){const t=e.marketCap||0;return t>2e11?8:t>5e10?12:t>1e10?15:18}function je(e,t,a,o,s){const r=[];return t>60&&r.push("Fundamentos técnicos sólidos"),a>10&&r.push(`Setor em momento favorável (${e.sectorName})`),o&&r.push("Está na sua watchlist pessoal"),s&&r.push(`Dividend yield atrativo (${(e.dividendYield||0).toFixed(1)}%)`),e.marketCap>1e11&&r.push("Grande capitalização — liquidez e estabilidade"),r.length===0&&r.push("Equilíbrio entre risco e retorno"),r.join(" • ")}function ae(){const e=Math.random()*30+10;return e<15?{level:"Calmo",description:"Baixa volatilidade - ambiente propício para acumulação",class:"calm"}:e<25?{level:"Moderado",description:"Volatilidade normal - seleção seletiva recomendada",class:"moderate"}:{level:"Elevado",description:"Alta volatilidade - foco em qualidade e liquidez",class:"elevated"}}function Ue(e){try{const t=localStorage.getItem("sp500-stock-of-day");if(!t)return null;const a=JSON.parse(t);return a.date===e&&a.primary?a:null}catch{return null}}function Ve(e,t){try{localStorage.setItem("sp500-stock-of-day",JSON.stringify(t))}catch{}}function oe(e,t){const{primary:a,alternatives:o,marketContext:s,generatedAt:r}=t;if(!a){e.innerHTML=`
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
          <div class="stock-symbol">${v(a.symbol)}</div>
          <div class="stock-name">${v(a.name)}</div>
          <div class="stock-sector">${v(a.sectorName||a.sector)}</div>
        </div>

        <div class="stock-score">
          <div class="score-circle" style="--score: ${a.score}">
            <span class="score-value">${a.score}</span>
            <span class="score-label">/ 100</span>
          </div>
          <div class="score-breakdown">
            ${Object.entries(a.breakdown).map(([i,n])=>`
              <div class="score-bar">
                <span class="bar-label">${i}</span>
                <div class="bar-track"><div class="bar-fill" style="width: ${Math.min(100,n*2)}%"></div></div>
                <span class="bar-value">${n}</span>
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
            <span class="metric-value">${U(a.marketCap)}</span>
          </div>
          <div class="metric">
            <span class="metric-label">Div. Yield</span>
            <span class="metric-value">${(a.dividendYield||0).toFixed(2)}%</span>
          </div>
          <div class="metric">
            <span class="metric-label">Setor</span>
            <span class="metric-value">${v(a.sectorName||a.sector)}</span>
          </div>
          <div class="metric">
            <span class="metric-label">Sub-setor</span>
            <span class="metric-value">${v(a.subIndustry||"N/A")}</span>
          </div>
        </div>

        <div class="stock-actions">
          <button class="action-btn primary" onclick="toggleWatchlist('${a.symbol}'); loadStockOfDay();">
            ${C.has(a.symbol)?"★ Remover da Watchlist":"☆ Adicionar à Watchlist"}
          </button>
          <button class="action-btn secondary" onclick="openCompanyDetails({symbol:'${a.symbol}',name:'${v(a.name).replace(/'/g,"\\'")}'})">
            📈 Ver Detalhes
          </button>
          <button class="action-btn ghost" onclick="setPriceAlertPrompt('${a.symbol}')">🔔 Criar Alerta</button>
        </div>
      </div>

      <section class="stock-alternatives">
        <h3>🥈 Menções Honrosas</h3>
        <div class="alternatives-grid">
          ${o.map((i,n)=>`
            <div class="alt-card">
              <span class="alt-rank">${n+2}º</span>
              <div class="alt-info">
                <div class="alt-symbol">${v(i.symbol)}</div>
                <div class="alt-name">${v(i.name)}</div>
              </div>
              <div class="alt-score">${i.score}</div>
            </div>
          `).join("")}
        </div>
      </section>

      <footer class="stock-disclaimer">
        <p><strong>⚠️ Disclaimer:</strong> Esta análise é gerada algoritmicamente com base em dados públicos e heurísticas quantitativas. Não constitui recomendação de investimento. Faça sua própria pesquisa (DYOR).</p>
        <p class="generated-at">Gerado em ${new Date(r).toLocaleTimeString("pt-BR")} • Baseado em ${S.length} empresas do S&P 500</p>
      </footer>
    </div>
  `}function _e(e){const t=e.toUpperCase(),a=F.get(t);if(a&&a.triggered){confirm(`${e}: alerta já disparado. Remover?`)&&Je(t);return}const o=prompt(`Alerta de preço para ${e}:
Digite o preço alvo (ex: 150.25):`,a?a.target.toFixed(2):"");if(!o)return;const s=parseFloat(o);if(isNaN(s)||s<=0){alert("Preço inválido");return}const r=confirm(`Alertar quando o preço estiver ACIMA deste valor?
(OK = acima, Cancelar = abaixo)`)?"above":"below";We(t,s,r)}function We(e,t,a){return!e||typeof t!="number"||!["above","below"].includes(a)?!1:(F.set(e.toUpperCase(),{target:t,direction:a,triggered:!1}),ee(),!0)}function Je(e){F.delete(e.toUpperCase()),ee()}window.loadStockOfDay=me;window.toggleWatchlist=pe;window.openCompanyDetails=Se;window.setPriceAlertPrompt=_e;async function Ge(){F.size!==0&&setInterval(async()=>{for(const[e,t]of F)t.triggered;ee()},6e4)}function Ke(){const e=["#","Símbolo","Empresa","Setor","Market Cap","Subindústria","Sede","Dividend Yield"],t=k.map((o,s)=>[s+1,o.symbol,o.name,o.sectorName,U(o.marketCap),o.subIndustry||o.industry||"N/A",o.headquarters||"N/A",o.dividendYield||"N/A"]),a=[e,...t].map(o=>o.map(s=>`"${s}"`).join(",")).join(`
`);ge(a,"sp500-export.csv","text/csv")}function Xe(){const e=JSON.stringify(k,null,2);ge(e,"sp500-export.json","application/json")}function ge(e,t,a){const o=new Blob([e],{type:a}),s=URL.createObjectURL(o),r=document.createElement("a");r.href=s,r.download=t,document.body.appendChild(r),r.click(),document.body.removeChild(r),URL.revokeObjectURL(s)}console.log("✅ main.js (10 colunas) carregado com sucesso!");
