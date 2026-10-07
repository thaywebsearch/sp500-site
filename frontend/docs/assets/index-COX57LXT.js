(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))a(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const i of r.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&a(i)}).observe(document,{childList:!0,subtree:!0});function o(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function a(s){if(s.ep)return;s.ep=!0;const r=o(s);fetch(s.href,r)}})();const Z=window.location.hostname,Y=Z==="localhost"||Z==="127.0.0.1"?"http://localhost:5001":"https://sp500-site-production.up.railway.app",J=[{id:"communication-services",name:"Communication Services"},{id:"consumer-discretionary",name:"Consumer Discretionary"},{id:"consumer-staples",name:"Consumer Staples"},{id:"energy",name:"Energy"},{id:"financials",name:"Financials"},{id:"health-care",name:"Health Care"},{id:"industrials",name:"Industrials"},{id:"information-technology",name:"Information Technology"},{id:"materials",name:"Materials"},{id:"real-estate",name:"Real Estate"},{id:"utilities",name:"Utilities"}];window.API_BASE_URL=Y;window.SECTORS=J;console.log("✅ Configuração global carregada:",Y);let N=[],g=null;async function ce(){try{const e=document.getElementById("daily-curiosity-view");if(!e){console.error("Elemento daily-curiosity-view não encontrado");return}e.innerHTML='<div class="curiosidade-loading">Carregando curiosidade...</div>';const t=await fetch(`${Y}/api/curiosidades`);if(!t.ok){console.error(`Erro ao buscar curiosidades: ${t.status}`),e.innerHTML=`<div class="curiosidade-erro">Erro ao carregar curiosidades (${t.status})</div>`;return}const o=await t.json();if(!o.sucesso||!o.dados||!o.dados.curiosidades){console.error("Dados de curiosidades inválidos:",o),e.innerHTML='<div class="curiosidade-erro">Formato de dados inválido</div>';return}if(N=o.dados.curiosidades,N.length===0){e.innerHTML='<div class="curiosidade-erro">Nenhuma curiosidade disponível</div>';return}le(),pe()}catch(e){console.error("Erro ao carregar curiosidades:",e);const t=document.getElementById("daily-curiosity-view");t&&(t.innerHTML=`<div class="curiosidade-erro">Erro ao carregar: ${e.message}</div>`)}}function le(){if(N.length===0)return;const t=new Date().getDate(),o=(t-1)%N.length;g=N[o],console.log(`Curiosidade do dia ${t}: ${g==null?void 0:g.empresa}`)}function pe(){const e=document.getElementById("daily-curiosity-view");if(!e||!g){console.error("View ou curiosidade não encontrada");return}ue();const t=`
    <div class="curiosidade-container">
      <div class="curiosidade-header">
        <h1>🌟 Curiosidade do Dia</h1>
        <p class="curiosidade-data">${ge()}</p>
      </div>

      <div class="curiosidade-card">
        <div class="curiosidade-simbolo">
          <span class="simbolo-badge">${g.simbolo}</span>
          <span class="posicao-badge">#${g.posicao}</span>
        </div>

        <div class="curiosidade-conteudo">
          <h2 class="curiosidade-empresa">${g.empresa}</h2>
          <p class="curiosidade-setor">
            <strong>Setor:</strong> ${g.setor||"N/A"}
          </p>

          <div class="curiosidade-titulo">
            <h3>${g.titulo}</h3>
          </div>

          <div class="curiosidade-descricao">
            <p>${g.descricao}</p>
          </div>

          ${g.fatos&&g.fatos.length>0?`
            <div class="curiosidade-fatos">
              <h4>📊 Fatos Interessantes:</h4>
              <ul>
                ${g.fatos.map(o=>`<li>${o}</li>`).join("")}
              </ul>
            </div>
          `:""}

          ${g.dividendYield?`
            <div class="curiosidade-dados">
              <p><strong>Dividend Yield:</strong> ${g.dividendYield}</p>
            </div>
          `:""}

          ${g.marketCap?`
            <div class="curiosidade-dados">
              <p><strong>Market Cap:</strong> ${g.marketCap}</p>
            </div>
          `:""}

          ${g.insight?`
            <div class="curiosidade-insight">
              <p><em>💡 ${g.insight}</em></p>
            </div>
          `:""}

          <div class="curiosidade-acoes">
            <button class="btn-compartilhar" onclick="compartilharCuriosidade()">
              📤 Compartilhar
            </button>
            ${g.link?`
              <a href="${g.link}" target="_blank" class="btn-saibamais">
                🔗 Saiba Mais
              </a>
            `:""}
          </div>
        </div>
      </div>

      <div class="curiosidade-footer">
        <p>Curiosidade de ${g.empresa} - Atualizado em ${g.dataAdicao||"N/A"}</p>
        <p class="curiosidade-dica">💡 Uma curiosidade diferente a cada dia do mês!</p>
      </div>
    </div>
  `;e.innerHTML=t,window.compartilharCuriosidade=me}function ue(){if(document.getElementById("curiosidade-styles"))return;const e=document.createElement("style");e.id="curiosidade-styles",e.textContent=`
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
  `,document.head.appendChild(e)}function me(){if(!g)return;const e=`🌟 Curiosidade do Dia: ${g.empresa}

${g.descricao}

Símbolo: ${g.simbolo}`;navigator.share?navigator.share({title:`Curiosidade do Dia - ${g.empresa}`,text:e,url:window.location.href}).catch(t=>console.log("Erro ao compartilhar:",t)):navigator.clipboard.writeText(e).then(()=>{alert("Curiosidade copiada para a área de transferência!")}).catch(t=>{alert("Erro ao copiar: "+t)})}function ge(){const e=new Date,t={weekday:"long",year:"numeric",month:"long",day:"numeric"};return e.toLocaleDateString("pt-BR",t)}function ve(e){return e?e>=1e12?`$${(e/1e12).toFixed(2)}T`:e>=1e9?`$${(e/1e9).toFixed(2)}B`:e>=1e6?`$${(e/1e6).toFixed(2)}M`:`$${e.toLocaleString("en-US")}`:"N/A"}function v(e){return e?String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;"):""}async function fe(e){try{const t=await fetch(`/api/historico/${e}`);if(!t.ok)throw new Error(`Erro ao buscar histórico de ${e}`);return(await t.json()).registros||[]}catch(t){return console.error(`Erro ao buscar histórico de ${e}:`,t),[]}}const U=760,V=320,y={top:28,right:28,bottom:44,left:68};function he(e){if(!e)return"";const[t,o,a]=e.split("-");return`${a}/${o}/${t.slice(2)}`}function G(e){return Number.isFinite(e)?e>=100?`$${e.toFixed(0)}`:`$${e.toFixed(2)}`:"—"}function be(e){const t=e.map(h=>h.close),o=Math.min(...t),a=Math.max(...t),s=a-o||1,r=o-s*.08,i=a+s*.08,d=e.length,l=h=>y.left+h/(d-1)*(U-y.left-y.right),n=h=>y.top+(1-(h-r)/(i-r))*(V-y.top-y.bottom);let p=`<svg viewBox="0 0 ${U} ${V}" style="width:100%;height:auto;display:block;background:var(--plot-bg);border-radius:8px">`;const c=5;for(let h=0;h<=c;h++){const x=r+(i-r)*h/c,D=n(x);p+=`<line x1="${y.left}" y1="${D.toFixed(1)}" x2="${U-y.right}" y2="${D.toFixed(1)}" stroke="var(--chart-axis)" stroke-width="1"/>`,p+=`<text x="${y.left-8}" y="${(D+4).toFixed(1)}" text-anchor="end" font-size="11" fill="var(--chart-label)">${G(x)}</text>`}const u=[];for(let h=0;h<=4;h++)u.push(Math.round((d-1)*h/4));u.forEach(h=>{const x=l(h);p+=`<text x="${x.toFixed(1)}" y="${V-y.bottom+18}" text-anchor="middle" font-size="11" fill="var(--chart-label)">${he(e[h].data)}</text>`});const m=e.map((h,x)=>`${l(x).toFixed(1)},${n(h.close).toFixed(1)}`).join(" "),f=`${y.left},${n(r).toFixed(1)} `+m+` ${l(d-1).toFixed(1)},${n(r).toFixed(1)}`;p+=`<polygon points="${f}" fill="rgba(0, 212, 255, 0.08)"/>`,p+=`<polyline points="${m}" fill="none" stroke="var(--accent-cyan)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;const $=e[d-1],b=n($.close);return p+=`<circle cx="${l(d-1).toFixed(1)}" cy="${b.toFixed(1)}" r="4" fill="var(--accent-cyan)"/>`,p+=`<text x="${U-y.right}" y="${(b-10).toFixed(1)}" text-anchor="end" font-size="12" font-weight="700" fill="var(--chart-text)">${G($.close)}</text>`,p+="</svg>",p}async function xe(e,t){var s;(s=document.querySelector(".modal-overlay"))==null||s.remove();const o=document.createElement("div");o.className="modal-overlay";const a=()=>o.remove();o.addEventListener("click",r=>{r.target===o&&a()}),document.addEventListener("keydown",r=>{r.key==="Escape"&&a()}),o.innerHTML=`
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
  `,document.body.appendChild(o),o.querySelector(".modal-close").addEventListener("click",a);try{const r=await fe(e),i=o.querySelector("#price-chart-body");if(!r||r.length===0){i.innerHTML=`<p class="modal-error">Nenhum dado de preço disponível para ${v(e)}.</p>`;return}const d=r[0].close,l=r[r.length-1].close,n=(l-d)/d*100,p=n>=0,c=p?"positive":"negative";i.innerHTML=`
      <div class="price-stats">
        <div class="price-stat">
          <span class="price-stat-label">Último</span>
          <strong>${G(l)}</strong>
        </div>
        <div class="price-stat">
          <span class="price-stat-label">Variação (2a)</span>
          <strong class="${c}">${p?"+":""}${n.toFixed(2)}%</strong>
        </div>
        <div class="price-stat">
          <span class="price-stat-label">Período</span>
          <strong>${r.length} pregões</strong>
        </div>
      </div>
      ${be(r)}
    `}catch(r){console.error(`Erro ao buscar histórico de ${e}:`,r);const i=o.querySelector("#price-chart-body");i.innerHTML=`<p class="modal-error">Erro ao carregar o histórico de ${v(e)}. Verifique se o backend está online.</p>`}}function w(e,t){return`
    <div class="company-detail">
      <span class="company-detail-label">${e}</span>
      <strong class="company-detail-value">${t}</strong>
    </div>
  `}function ye(e){var r;(r=document.querySelector(".modal-overlay"))==null||r.remove();const t=document.createElement("div");t.className="modal-overlay";const o=()=>t.remove();t.addEventListener("click",i=>{i.target===t&&o()}),document.addEventListener("keydown",i=>{i.key==="Escape"&&o()});const a=e.dividendYield!==null&&e.dividendYield!==void 0?`${e.dividendYield.toFixed(2)}%`:"—",s=ve(e.marketCap);t.innerHTML=`
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
          ${w("Div. Yield",a)}
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
  `,document.body.appendChild(t),t.querySelector(".modal-close").addEventListener("click",o),t.querySelector("#details-chart-btn").addEventListener("click",()=>{xe(e.symbol,e.name)})}async function $e(){const e=document.getElementById("treemap-view");if(e){e.style.display="flex",e.style.flexDirection="column",e.style.height="100%",e.style.width="100%",e.style.margin="0",e.style.padding="0",e.style.background="var(--bg-primary)",e.innerHTML='<div style="display:flex;align-items:center;justify-content:center;height:100%;width:100%;font-size:14px;color:var(--text-secondary)">Carregando mapa de setores...</div>';try{let i=function(n,p){const c=n/p*100;return c>=80?"#ff5252":c>=60?"#ff9800":c>=40?"#ffeb3b":c>=20?"#8bc34a":"#4caf50"};var t=i;const s=(await(await fetch(`${window.API_BASE_URL}/api/setores`)).json()).setores||[],r=await Promise.all(s.map(async n=>{var h;const c=await(await fetch(`${window.API_BASE_URL}/api/setor/${n}`)).json(),u=window.SECTORS.find(x=>x.id===n),m=((h=c.dados)==null?void 0:h.companies)||[],f=m.reduce((x,D)=>x+(D.marketCap||0),0),$=m.length>0?m.reduce((x,D)=>x+(D.dividendYield||0),0)/m.length:0,b=m.filter(x=>x.hasDividend==="Sim").length;return{id:n,name:(u==null?void 0:u.name)||n,cap:(f/1e9).toFixed(1),companies:m.length,avgDiv:parseFloat($.toFixed(2)),withDiv:b,topCompany:m.length>0?m[0].symbol:"N/A"}})),d=Math.max(...r.map(n=>parseFloat(n.cap)));let l=`
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
    `;r.forEach(n=>{const p=i(parseFloat(n.cap),d),c=(parseFloat(n.cap)/d*100).toFixed(1),u=["consumer-staples","communication-services","consumer-discretionary","energy","financials","health-care","industrials","information-technology","materials","real-estate","utilities"].includes(n.id),m=u?`/sectors/${n.id}.html`:"#";l+=`
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
        onclick="${u?`navigateToSector('${m}', '${n.id}')`:`alert('🔒 O setor \\"${n.name}\\" ainda está em desenvolvimento.\\n\\nApenas Consumer Staples, Communication Services, Consumer Discretionary, Energy, Financials, Health Care, Industrials, Information Technology, Materials, Real Estate e Utilities estão disponíveis por enquanto!')`}"
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
    `,e.innerHTML=l}catch(o){console.error("Erro ao carregar treemap:",o),e.innerHTML='<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--accent-red)">Erro ao carregar mapa de setores</div>'}}}function we(e,t){if(e==="#"){alert(`🔒 O setor "${t}" ainda está em desenvolvimento.

Apenas Consumer Staples, Communication Services, Consumer Discretionary, Energy, Financials, Health Care, Industrials, Information Technology, Materials, Real Estate e Utilities estão disponíveis por enquanto!`);return}window.open(e,"_blank")}window.navigateToSector=we;async function ke(){var t;const e=document.getElementById("heatmap-view");if(e){e.style.display="flex",e.style.flexDirection="column",e.style.height="100%",e.style.width="100%",e.style.padding="40px",e.style.boxSizing="border-box",e.style.background="var(--bg-primary)",e.style.overflowY="auto",e.innerHTML='<div style="text-align:center;color:var(--text-secondary)">Carregando heatmap...</div>';try{const s=(await(await fetch(`${window.API_BASE_URL}/api/setores`)).json()).setores||[];let r=`
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
    `;for(const i of s){const l=await(await fetch(`${window.API_BASE_URL}/api/setor/${i}`)).json(),n=window.SECTORS.find(u=>u.id===i),p=((t=l.dados)==null?void 0:t.companies)||[];if(p.length===0)continue;const c=p.sort((u,m)=>(m.marketCap||0)-(u.marketCap||0)).slice(0,4);r+=`
        <div style="margin-bottom: 40px;">
          <h3 style="
            font-size: 16px;
            margin: 0 0 20px 0;
            color: var(--text-primary);
            font-weight: 600;
          ">${(n==null?void 0:n.name)||i}</h3>

          <div style="
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 16px;
          ">
      `,c.forEach((u,m)=>{const f=(u.marketCap/1e9).toFixed(2),$=(u.dividendYield||0).toFixed(2);let b="#4caf50";f>500?b="#ff5252":f>200?b="#ff9800":f>100?b="#ffeb3b":f>50&&(b="#8bc34a"),r+=`
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
                #${m+1}
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
    `}}}async function Ce(){var t;const e=document.getElementById("bubble-chart-view");if(e){e.style.display="flex",e.style.flexDirection="column",e.style.height="100%",e.style.width="100%",e.style.padding="40px",e.style.boxSizing="border-box",e.style.background="var(--bg-primary)",e.style.overflowY="auto",e.innerHTML='<div style="text-align:center;color:var(--text-secondary)">Carregando bubble chart...</div>';try{const s=(await(await fetch(`${window.API_BASE_URL}/api/setores`)).json()).setores||[];let r=[];for(const c of s){const m=await(await fetch(`${window.API_BASE_URL}/api/setor/${c}`)).json(),f=window.SECTORS.find(b=>b.id===c);(((t=m.dados)==null?void 0:t.companies)||[]).forEach(b=>{r.push({...b,sectorName:(f==null?void 0:f.name)||c,sectorId:c})})}const i=r.sort((c,u)=>(u.marketCap||0)-(c.marketCap||0)).slice(0,30);let d=`
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
    `;const l={"communication-services":"#00d4ff","consumer-discretionary":"#00e676","consumer-staples":"#ffab00",energy:"#ff5252",financials:"#ba68c8","health-care":"#29b6f6",industrials:"#66bb6a","information-technology":"#ffa726",materials:"#ab47bc","real-estate":"#ec407a",utilities:"#26a69a"},n=Math.max(...i.map(c=>c.marketCap||0)),p=Math.max(...i.map(c=>c.dividendYield||0),5);i.forEach((c,u)=>{const m=(c.marketCap||0)/n*800+50,f=550-(c.dividendYield||0)/p*500,$=Math.sqrt((c.marketCap||0)/1e8)+10,b=l[c.sectorId]||"#00d4ff";d+=`
        <circle
          cx="${m}"
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
          x="${m}"
          y="${f+4}"
          text-anchor="middle"
          font-size="11"
          fill="var(--text-primary)"
          font-weight="700"
          pointer-events="none"
        >${c.symbol}</text>
      `}),d+=`
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
    `,window.SECTORS.forEach(c=>{const u=l[c.id]||"#00d4ff",m=i.filter(f=>f.sectorId===c.id).length;m>0&&(d+=`
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
                ${m} empresa${m>1?"s":""}
              </div>
            </div>
          </div>
        `)}),d+=`
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
    `,e.innerHTML=d}catch(o){console.error("Erro ao carregar bubble chart:",o),e.innerHTML=`
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
        ">${o.message}</div>
      </div>
    `}}}const ee="sp500-watchlist",te="sp500-price-alerts",K=50;function Ee(){try{const e=localStorage.getItem(ee);return e?JSON.parse(e):[]}catch(e){return console.error("Erro ao carregar watchlist:",e),[]}}function Se(){try{localStorage.setItem(ee,JSON.stringify([...C]))}catch(e){console.error("Erro ao salvar watchlist:",e)}}function Ae(){try{const e=localStorage.getItem(te);if(!e)return[];const t=JSON.parse(e);return Array.isArray(t)&&t.length>0&&Array.isArray(t[0])?t:Array.isArray(t)&&t.length>0&&typeof t[0]=="object"?t.map(o=>[o.symbol,o]):[]}catch(e){return console.error("Erro ao carregar price alerts:",e),[]}}function X(){try{const e=Array.from(F.entries());localStorage.setItem(te,JSON.stringify(e))}catch(e){console.error("Erro ao salvar price alerts:",e)}}function Me(e,t){let o;return function(...s){const r=()=>{clearTimeout(o),e(...s)};clearTimeout(o),o=setTimeout(r,t)}}let S=[],k=[],E=1,j="dashboard",z=new Set;const C=new Set(Ee()||[]),W=Ae(),F=new Map(W&&W.length>0?W:[]);let A,L,P,H,O,B,M,T,_;document.addEventListener("DOMContentLoaded",()=>{console.log("🚀 Inicializando dashboard..."),A=document.getElementById("sector-filter"),L=document.getElementById("country-filter"),P=document.getElementById("search-input"),H=document.getElementById("dividend-min"),O=document.getElementById("sort-select"),B=document.getElementById("table-body"),M=document.getElementById("stats"),T=document.getElementById("pagination"),_=document.getElementById("header-checkbox"),console.log("📍 Elementos encontrados:",{sectorFilter:!!A,tableBody:!!B,statsEl:!!M,paginationEl:!!T});const e=document.querySelectorAll(".nav-tab");console.log(`📌 Encontradas ${e.length} abas`),e.forEach(r=>{r.addEventListener("click",i=>{i.preventDefault();const d=r.getAttribute("data-tab");console.log(`🔀 Navegando para: ${d}`),Le(d)})}),A&&A.addEventListener("change",I),L&&L.addEventListener("change",I),P&&P.addEventListener("input",Me(I,300)),H&&H.addEventListener("change",I),O&&O.addEventListener("change",I),_&&_.addEventListener("change",()=>{B.querySelectorAll(".row-checkbox").forEach(i=>{i.checked=_.checked,i.dispatchEvent(new Event("change"))})});const t=document.getElementById("select-all"),o=document.getElementById("deselect-all"),a=document.getElementById("export-csv"),s=document.getElementById("export-json");t&&t.addEventListener("click",()=>{k.forEach(r=>z.add(r.symbol)),R(),q()}),o&&o.addEventListener("click",()=>{z.clear(),R(),q()}),a&&a.addEventListener("click",_e),s&&s.addEventListener("click",Ve),console.log("✅ Event listeners registrados"),oe(),ae(),re(),se(),Ue(),console.log("✅ Dashboard inicializado com sucesso!")});function Le(e){console.log(`📍 Mudando aba para: ${e}`),j=e,oe(),ae()}function oe(){console.log(`🎨 Atualizando UI para: ${j}`);const e=document.getElementById("dashboard-view"),t=document.getElementById("treemap-view"),o=document.getElementById("heatmap-view"),a=document.getElementById("bubble-chart-view"),s=document.getElementById("watchlist-view"),r=document.getElementById("stock-of-day-view"),i=document.getElementById("daily-curiosity-view");switch([e,t,o,a,s,r,i].forEach(l=>{l&&(l.style.display="none")}),j){case"dashboard":e&&(e.style.display="block");break;case"stock-of-day":r&&(r.style.display="block",ne());break;case"daily-curiosity":i&&(i.style.display="block",ce());break;case"treemap":t&&(t.style.display="block",$e());break;case"heatmap":o&&(o.style.display="block",ke());break;case"bubble":a&&(a.style.display="block",Ce());break;case"watchlist":s&&(s.style.display="block",Te());break;default:e&&(e.style.display="block")}}function ae(){document.querySelectorAll(".nav-tab").forEach(t=>{t.classList.remove("active"),t.getAttribute("data-tab")===j&&(t.classList.add("active"),console.log(`✅ Aba ativa: ${j}`))})}async function re(){console.log("📊 Carregando dados do dashboard..."),M&&(M.textContent="Carregando dados...");try{const e=await fetch(`${Y}/api/setores`);if(!e.ok)throw new Error("Erro ao buscar setores");const o=(await e.json()).setores||[];console.log(`🔄 Carregando ${o.length} setores...`);const a=o.map(async r=>{try{const i=await fetch(`${Y}/api/setor/${r}`);if(!i.ok)throw new Error(`HTTP ${i.status}`);const d=await i.json(),l=J.find(p=>p.id===r),n=l?l.name:r;return d.dados&&d.dados.companies&&Array.isArray(d.dados.companies)?d.dados.companies.map(p=>({...p,sector:r,sectorName:n})):[]}catch(i){return console.error(`❌ Erro ao carregar ${r}:`,i),[]}});S=(await Promise.all(a)).flat(),console.log(`✅ ${S.length} empresas carregadas`),A&&(A.innerHTML='<option value="">Todos os Setores</option>',[...new Set(S.map(i=>i.sector))].sort().forEach(i=>{var l;const d=document.createElement("option");d.value=i,d.textContent=((l=J.find(n=>n.id===i))==null?void 0:l.name)||i,A.appendChild(d)})),L&&(L.innerHTML='<option value="">Todos os Países</option>',[...new Set(S.map(i=>i.location||i.country||"N/A"))].sort().forEach(i=>{const d=document.createElement("option");d.value=i,d.textContent=i,L.appendChild(d)})),I(),q()}catch(e){console.error("❌ Erro ao carregar dados:",e),M&&(M.textContent="Erro ao carregar dados. Tente novamente.")}}function I(){const e=A?A.value:"",t=L?L.value:"",o=P?P.value.toLowerCase():"",a=H&&parseFloat(H.value)||0,s=O?O.value:"symbol-asc";k=S.filter(d=>{const l=!e||d.sector===e,n=!t||(d.location||d.country||"N/A")===t,p=!o||d.symbol.toLowerCase().includes(o)||d.name.toLowerCase().includes(o),c=!a||(parseFloat(d.dividendYield)||0)>=a;return l&&n&&p&&c});const[r,i]=s.split("-");k.sort((d,l)=>{let n=d[r],p=l[r];if(typeof n=="string"){const m=(n||"").localeCompare(p||"");return i==="asc"?m:-m}const c=parseFloat(n)||0,u=parseFloat(p)||0;return i==="asc"?c-u:u-c}),E=1,R(),q()}function R(){if(!B){console.error("❌ tableBody não encontrado!");return}B.innerHTML="";const e=(E-1)*K,t=e+K,o=k.slice(e,t);console.log(`📋 Renderizando ${o.length} empresas (página ${E})`),o.forEach((a,s)=>{const r=z.has(a.symbol),i=document.createElement("tr");i.innerHTML=`
      <td>
        <input type="checkbox" class="row-checkbox" data-symbol="${a.symbol}" 
          ${r?"checked":""}>
      </td>
      <td class="col-index">${e+s+1}</td>
      <td><strong>${a.symbol}</strong></td>
      <td>${a.name||"N/A"}</td>
      <td>${a.sectorName||a.sector||"N/A"}</td>
      <td>${a.marketCap?a.marketCap:"N/A"}</td>
      <td>${a.subindustry||a.industry||"N/A"}</td>
      <td>${a.location||a.country||"N/A"}</td>
      <td>${a.dividendYield?parseFloat(a.dividendYield).toFixed(2)+"%":"N/A"}</td>
      <td>
        <button class="btn-watchlist" data-symbol="${a.symbol}" title="Adicionar à watchlist">
          ${C.has(a.symbol)?"★":"☆"}
        </button>
      </td>
    `;const d=i.querySelector(".row-checkbox");d.addEventListener("change",()=>{d.checked?z.add(a.symbol):z.delete(a.symbol),q()});const l=i.querySelector(".btn-watchlist");l.addEventListener("click",()=>{ie(a.symbol),l.textContent=C.has(a.symbol)?"★":"☆",se()}),B.appendChild(i)}),console.log(`✅ ${o.length} linhas renderizadas`),De()}function De(){if(!T)return;T.innerHTML="";const e=Math.ceil(k.length/K),t=document.createElement("button");t.textContent="Anterior",t.disabled=E===1,t.addEventListener("click",()=>{E>1&&(E--,R())}),T.appendChild(t);const o=document.createElement("span");o.textContent=`Página ${E} de ${e}`,T.appendChild(o);const a=document.createElement("button");a.textContent="Próxima",a.disabled=E===e,a.addEventListener("click",()=>{E<e&&(E++,R())}),T.appendChild(a)}function q(){if(!M)return;const e=k.length,t=z.size,o=k.length>0?(k.reduce((a,s)=>a+(parseFloat(s.dividendYield)||0),0)/k.length).toFixed(2):0;M.innerHTML=`Total: ${e} | Selecionadas: ${t} | Dividend Yield Médio: ${o}%`}function ie(e){C.has(e)?C.delete(e):C.add(e),Se()}function se(){const e=document.querySelector("[data-watchlist-count]");e&&(e.textContent=C.size,console.log(`🌟 Watchlist atualizada: ${C.size} empresas`))}async function Te(){const e=document.getElementById("watchlist-view");if(!e)return;const t=S.filter(a=>C.has(a.symbol));if(t.length===0){e.innerHTML="<p>Nenhuma empresa na watchlist.</p>";return}let o='<table class="watchlist-table"><thead><tr><th>#</th><th>Símbolo</th><th>Nome</th><th>Setor</th><th>Dividend Yield</th><th>Market Cap</th></tr></thead><tbody>';t.forEach((a,s)=>{o+=`<tr>
      <td>${s+1}</td>
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
  `;try{S.length===0&&await re();const t=new Date().toISOString().slice(0,10),o=Oe(t);if(o){Q(e,o);return}const a=await Ie();Ye(t,a),Q(e,a)}catch(t){console.error("Erro ao carregar Ação do Dia:",t),e.innerHTML=`
      <div class="stock-of-day-error">
        <h3>⚠️ Indisponível no momento</h3>
        <p>Não foi possível gerar a análise. Tente novamente mais tarde.</p>
        <button class="retry-btn" onclick="loadStockOfDay()">Tentar novamente</button>
      </div>
    `}}}function Ie(){return new Promise(e=>{setTimeout(()=>{const t=new Date().toISOString().slice(0,10),o=ze(t),a=S.filter(l=>l.marketCap&&l.marketCap>1e9).map(l=>{const n=Be(l),p=Fe(l.sector),c=C.has(l.symbol)?15:0,u=(l.dividendYield||0)>2?10:0,m=Math.min(20,Math.log10(l.marketCap/1e9)*5),f=Ne(l),$=n+p+c+u+m+f;return{...l,score:Math.round($*100)/100,breakdown:{technical:n,sector:p,watchlist:c,dividend:u,liquidity:Math.round(m),volatility:Math.round(f)},rationale:Pe(l,n,p,c,u)}}).sort((l,n)=>n.score-l.score),s=a.slice(0,Math.min(10,a.length)),r=o%s.length,i=s[r],d=s.filter((l,n)=>n!==r).slice(0,3);e({date:t,primary:i,alternatives:d,marketContext:He(),generatedAt:new Date().toISOString()})},100)})}function ze(e){let t=0;for(let o=0;o<e.length;o++)t=(t<<5)-t+e.charCodeAt(o),t|=0;return Math.abs(t)}function Be(e){let t=50;const o=e.dividendYield||0;o>4?t+=15:o>2?t+=8:o>0&&(t+=3);const a=e.marketCap||0;a>5e11?t+=10:a>1e11?t+=7:a>5e10?t+=5:a>1e10&&(t+=3);const s=(e.subIndustry||"").toLowerCase();["software","semiconductors","biotechnology","cloud","ai","cybersecurity","renewable"].some(i=>s.includes(i))&&(t+=12);const r=(e.name||"").toLowerCase();return["inc.","corporation","technologies","systems","solutions"].some(i=>r.includes(i))&&(t+=3),Math.min(90,t)}function Fe(e){return{"information-technology":15,"health-care":8,"consumer-discretionary":5,"communication-services":7,industrials:5,financials:3,materials:2,energy:0,utilities:-2,"real-estate":-3,"consumer-staples":1}[e]||0}function Ne(e){const t=e.marketCap||0;return t>2e11?8:t>5e10?12:t>1e10?15:18}function Pe(e,t,o,a,s){const r=[];return t>60&&r.push("Fundamentos técnicos sólidos"),o>10&&r.push(`Setor em momento favorável (${e.sectorName})`),a&&r.push("Está na sua watchlist pessoal"),s&&r.push(`Dividend yield atrativo (${(e.dividendYield||0).toFixed(1)}%)`),e.marketCap>1e11&&r.push("Grande capitalização — liquidez e estabilidade"),r.length===0&&r.push("Equilíbrio entre risco e retorno"),r.join(" • ")}function He(){const e=Math.random()*30+10;return e<15?{level:"Calmo",description:"Baixa volatilidade - ambiente propício para acumulação",class:"calm"}:e<25?{level:"Moderado",description:"Volatilidade normal - seleção seletiva recomendada",class:"moderate"}:{level:"Elevado",description:"Alta volatilidade - foco em qualidade e liquidez",class:"elevated"}}function Oe(e){try{const t=localStorage.getItem("sp500-stock-of-day");if(!t)return null;const o=JSON.parse(t);return o.date===e?o:null}catch{return null}}function Ye(e,t){try{localStorage.setItem("sp500-stock-of-day",JSON.stringify(t))}catch{}}function Q(e,t){const{primary:o,alternatives:a,marketContext:s,generatedAt:r}=t;if(!o){e.innerHTML='<div class="stock-of-day-error"><p>Sem dados suficientes</p></div>';return}e.innerHTML=`
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
            ${Object.entries(o.breakdown).map(([i,d])=>`
              <div class="score-bar">
                <span class="bar-label">${i}</span>
                <div class="bar-track"><div class="bar-fill" style="width: ${Math.min(100,d*2)}%"></div></div>
                <span class="bar-value">${d}</span>
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
            <span class="metric-value">${v(o.sectorName||o.sector)}</span>
          </div>
          <div class="metric">
            <span class="metric-label">Sub-setor</span>
            <span class="metric-value">${v(o.subIndustry||"N/A")}</span>
          </div>
        </div>

        <div class="stock-actions">
          <button class="action-btn primary" onclick="toggleWatchlist('${o.symbol}'); loadStockOfDay();">
            ${C.has(o.symbol)?"★ Remover da Watchlist":"☆ Adicionar à Watchlist"}
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
          ${a.map((i,d)=>`
            <div class="alt-card">
              <span class="alt-rank">${d+2}º</span>
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
  `}function je(e){const t=e.toUpperCase(),o=F.get(t);if(o&&o.triggered){confirm(`${e}: alerta já disparado. Remover?`)&&qe(t);return}const a=prompt(`Alerta de preço para ${e}:
Digite o preço alvo (ex: 150.25):`,o?o.target.toFixed(2):"");if(!a)return;const s=parseFloat(a);if(isNaN(s)||s<=0){alert("Preço inválido");return}const r=confirm(`Alertar quando o preço estiver ACIMA deste valor?
(OK = acima, Cancelar = abaixo)`)?"above":"below";Re(t,s,r)}function Re(e,t,o){return!e||typeof t!="number"||!["above","below"].includes(o)?!1:(F.set(e.toUpperCase(),{target:t,direction:o,triggered:!1}),X(),!0)}function qe(e){F.delete(e.toUpperCase()),X()}window.loadStockOfDay=ne;window.toggleWatchlist=ie;window.openCompanyDetails=ye;window.setPriceAlertPrompt=je;async function Ue(){F.size!==0&&setInterval(async()=>{for(const[e,t]of F)t.triggered;X()},6e4)}function _e(){const e=["#","Símbolo","Empresa","Setor","Market Cap","Subindústria","Sede","Dividend Yield"],t=k.map((a,s)=>[s+1,a.symbol,a.name,a.sectorName,a.marketCap,a.subindustry||a.industry||"N/A",a.location||a.country||"N/A",a.dividendYield||"N/A"]),o=[e,...t].map(a=>a.map(s=>`"${s}"`).join(",")).join(`
`);de(o,"sp500-export.csv","text/csv")}function Ve(){const e=JSON.stringify(k,null,2);de(e,"sp500-export.json","application/json")}function de(e,t,o){const a=new Blob([e],{type:o}),s=URL.createObjectURL(a),r=document.createElement("a");r.href=s,r.download=t,document.body.appendChild(r),r.click(),document.body.removeChild(r),URL.revokeObjectURL(s)}console.log("✅ main.js (10 colunas) carregado com sucesso!");
