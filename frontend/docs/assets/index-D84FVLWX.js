(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))o(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const r of n.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&o(r)}).observe(document,{childList:!0,subtree:!0});function a(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerPolicy&&(n.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?n.credentials="include":s.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function o(s){if(s.ep)return;s.ep=!0;const n=a(s);fetch(s.href,n)}})();const H=window.location.hostname==="localhost"?"http://localhost:5001":"https://sp500-site-production.up.railway.app",ee=[{id:"communication-services",name:"Communication Services"},{id:"consumer-discretionary",name:"Consumer Discretionary"},{id:"consumer-staples",name:"Consumer Staples"},{id:"energy",name:"Energy"},{id:"financials",name:"Financials"},{id:"health-care",name:"Health Care"},{id:"industrials",name:"Industrials"},{id:"information-technology",name:"Information Technology"},{id:"materials",name:"Materials"},{id:"real-estate",name:"Real Estate"},{id:"utilities",name:"Utilities"}];let q=null;const me=new Map,V=new Map;let R=null,U=null;function ue(){return q||(q=(async()=>{const e=await fetch(`${H}/api/setores`);if(!e.ok)throw new Error(`HTTP ${e.status}`);return(await e.json()).setores||[]})()),q}async function Y(){const e=await ue();return await Promise.all(e.map(async a=>{var n,r;const o=await fetchSector(a),s=((n=ee.find(i=>i.id===a))==null?void 0:n.name)||a;return{id:a,name:s,companies:o,lastUpdated:((r=me.get(a))==null?void 0:r.lastUpdated)??null}}))}function fe(e){return V.has(e)||V.set(e,(async()=>{const t=await fetch(`${H}/api/historico/${encodeURIComponent(e)}`);if(!t.ok)throw new Error(`HTTP ${t.status}`);return(await t.json()).registros||[]})()),V.get(e)}function he(){return R||(R=(async()=>{const e=await fetch(`${H}/api/resumo-dia`);if(!e.ok)throw new Error(`HTTP ${e.status}`);return(await e.json()).dados||null})()),R}function ve(){return U||(U=(async()=>{const e=await fetch(`${H}/api/calendario-dividendos`);if(!e.ok)throw new Error(`HTTP ${e.status}`);return(await e.json()).dados||null})()),U}async function ge(){const e=document.getElementById("treemap-view");if(e){e.style.display="flex",e.style.flexDirection="column",e.style.height="100%",e.style.width="100%",e.style.margin="0",e.style.padding="0",e.style.background="var(--bg-primary)",e.innerHTML='<div style="display:flex;align-items:center;justify-content:center;height:100%;width:100%;font-size:14px;color:var(--text-secondary)">Carregando setores...</div>';try{const t=(await Y()).map(n=>{const r=n.companies,i=r.reduce((l,p)=>l+(p.marketCap||0),0),d=r.length>0?r.reduce((l,p)=>l+(p.dividendYield||0),0)/r.length:0;return{id:n.id,name:n.name,value:i,companies:r.length,avgDiv:parseFloat(d.toFixed(2)),topCompany:r.length>0?r[0].symbol:"N/A"}}),a=t.reduce((n,r)=>n+r.value,0),o=["#00d4ff","#00e676","#ffab00","#ff5252","#8bc34a","#4caf50","#2196f3","#9c27b0","#ff9800","#f44336","#00bcd4"];let s=`
      <div style="
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 12px;
        padding: 40px;
        height: 100%;
        width: 100%;
        box-sizing: border-box;
        overflow-y: auto;
        align-content: start;
      ">
    `;t.forEach((n,r)=>{const i=o[r%o.length],d=(n.value/a*100).toFixed(1),l=(n.value/1e9).toFixed(1);s+=`
        <div style="
          background: linear-gradient(135deg, ${i}22 0%, ${i}11 100%);
          border: 1px solid ${i}33;
          border-radius: 12px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 200px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-sizing: border-box;
        "
        onmouseover="this.style.transform='translateY(-4px)';this.style.boxShadow='0 8px 24px ${i}22'"
        onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='none'"
        >
          <div>
            <div style="
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 1px;
              color: ${i};
              font-weight: 600;
              margin-bottom: 8px;
            ">${d}%</div>
            <div style="
              font-size: 18px;
              font-weight: 600;
              color: var(--text-primary);
              margin-bottom: 4px;
            ">${n.name}</div>
            <div style="
              font-size: 13px;
              color: var(--text-secondary);
            ">${n.companies} empresas</div>
          </div>
          
          <div style="
            border-top: 1px solid ${i}22;
            padding-top: 16px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
          ">
            <div>
              <div style="
                font-size: 11px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                color: var(--text-secondary);
                margin-bottom: 4px;
              ">Market Cap</div>
              <div style="
                font-size: 16px;
                font-weight: 700;
                color: ${i};
              ">$${l}B</div>
            </div>
            <div>
              <div style="
                font-size: 11px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                color: var(--text-secondary);
                margin-bottom: 4px;
              ">Top</div>
              <div style="
                font-size: 16px;
                font-weight: 700;
                color: var(--text-primary);
              ">${n.topCompany}</div>
            </div>
          </div>
        </div>
      `}),s+="</div>",e.innerHTML=s}catch{e.innerHTML='<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--accent-red)">Erro ao carregar setores</div>'}}}async function ye(){const e=document.getElementById("heatmap-view");if(e){e.style.display="flex",e.style.flexDirection="column",e.style.height="100%",e.style.width="100%",e.style.margin="0",e.style.padding="0",e.style.background="var(--bg-primary)",e.innerHTML='<div style="display:flex;align-items:center;justify-content:center;height:100%;width:100%;font-size:14px;color:var(--text-secondary)">Carregando heatmap...</div>';try{let o=function(r,i){const d=r/i*100;return d>=80?"#ff5252":d>=60?"#ff9800":d>=40?"#ffeb3b":d>=20?"#8bc34a":"#4caf50"};var t=o;const a=(await Y()).map(r=>{const i=[...r.companies].sort((d,l)=>(l.marketCap||0)-(d.marketCap||0)).slice(0,4);return{name:r.name,companies:i}});let s=0;a.forEach(r=>{r.companies.forEach(i=>{i.marketCap>s&&(s=i.marketCap)})});let n=`
      <div style="
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%;
        padding: 40px;
        box-sizing: border-box;
        overflow-y: auto;
        gap: 24px;
      ">
        <div>
          <h2 style="
            margin: 0 0 8px 0;
            font-size: 24px;
            color: var(--text-primary);
            font-weight: 600;
          ">🔥 Heatmap - Top 4 Empresas por Setor</h2>
          <p style="
            margin: 0;
            font-size: 13px;
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: 1px;
          ">Market Cap | Cores indicam força relativa do mercado</p>
        </div>

        <div style="
          display: grid;
          grid-template-columns: 200px 1fr;
          gap: 20px;
          flex: 1;
        ">
    `;a.forEach(r=>{n+=`
        <div style="
          padding: 20px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          word-wrap: break-word;
          min-height: 160px;
        "
        onmouseover="this.style.borderColor='var(--accent-cyan)';this.style.background='rgba(0,212,255,0.05)'"
        onmouseout="this.style.borderColor='var(--border)';this.style.background='var(--surface)'"
        >${r.name}</div>

        <div style="
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
          align-content: start;
        ">
      `,r.companies.forEach(i=>{const d=o(i.marketCap,s),l=(i.marketCap/1e9).toFixed(2),p=i.dividendYield!==null&&i.dividendYield!==void 0?i.dividendYield.toFixed(2):"—";n+=`
          <div style="
            background: ${d}22;
            border: 1px solid ${d}44;
            border-radius: 8px;
            padding: 16px;
            transition: all 0.3s ease;
            cursor: pointer;
            min-height: 140px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          "
          onmouseover="
            this.style.borderColor='${d}';
            this.style.background='${d}44';
            this.style.transform='translateY(-4px)';
            this.style.boxShadow='0 12px 32px ${d}33';
          "
          onmouseout="
            this.style.borderColor='${d}44';
            this.style.background='${d}22';
            this.style.transform='translateY(0)';
            this.style.boxShadow='none';
          "
          title="${i.name}"
          >
            <div>
              <div style="
                font-size: 13px;
                font-weight: 700;
                color: ${d};
                margin-bottom: 4px;
              ">${i.symbol}</div>
              <div style="
                font-size: 11px;
                color: var(--text-secondary);
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              ">${i.name}</div>
            </div>

            <div style="
              border-top: 1px solid ${d}33;
              padding-top: 12px;
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 8px;
              margin-top: 12px;
            ">
              <div>
                <div style="
                  font-size: 10px;
                  text-transform: uppercase;
                  letter-spacing: 0.5px;
                  color: var(--text-secondary);
                  margin-bottom: 3px;
                ">Market Cap</div>
                <div style="
                  font-size: 14px;
                  font-weight: 700;
                  color: ${d};
                ">$${l}B</div>
              </div>
              <div>
                <div style="
                  font-size: 10px;
                  text-transform: uppercase;
                  letter-spacing: 0.5px;
                  color: var(--text-secondary);
                  margin-bottom: 3px;
                ">Div %</div>
                <div style="
                  font-size: 14px;
                  font-weight: 700;
                  color: var(--text-primary);
                ">${p}</div>
              </div>
            </div>
          </div>
        `}),n+="</div>"}),n+=`
        </div>

        <div style="
          padding: 24px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
        ">
          <h3 style="
            margin: 0 0 16px 0;
            font-size: 14px;
            color: var(--text-primary);
            text-transform: uppercase;
            letter-spacing: 1px;
          ">📊 Legenda de Cores</h3>
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
    `,e.innerHTML=n}catch(a){console.error("Erro:",a),e.innerHTML='<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--accent-red)">Erro ao carregar heatmap</div>'}}}async function xe(){const e=document.getElementById("bubble-chart-view");if(e){e.style.display="flex",e.style.flexDirection="column",e.style.height="100%",e.style.width="100%",e.style.margin="0",e.style.padding="0",e.style.background="var(--bg-primary)",e.innerHTML='<div style="display:flex;align-items:center;justify-content:center;height:100%;width:100%;font-size:14px;color:var(--text-secondary)">Carregando bubble chart...</div>';try{const t=(await Y()).map(i=>{const d=i.companies,l=d.reduce((m,h)=>m+(h.marketCap||0),0),p=d.length>0?d.reduce((m,h)=>m+(h.dividendYield||0),0)/d.length:0;return{id:i.id,name:i.name,cap:(l/1e9).toFixed(1),companies:d.length,avgDiv:parseFloat(p.toFixed(2)),topCompany:d.length>0?d[0].symbol:"N/A"}}),a=["#00d4ff","#00e676","#ffab00","#ff5252","#8bc34a","#4caf50","#2196f3","#9c27b0","#ff9800","#f44336","#00bcd4"],o=Math.max(...t.map(i=>parseFloat(i.cap))),s=Math.max(...t.map(i=>i.companies));let n='<svg viewBox="0 0 1000 600" style="width:100%;height:100%;border-radius:8px;background:var(--plot-bg)">';n+='<line x1="80" y1="550" x2="950" y2="550" stroke="var(--chart-axis)" stroke-width="2"/>',n+='<line x1="80" y1="550" x2="80" y2="50" stroke="var(--chart-axis)" stroke-width="2"/>',n+='<text x="500" y="590" text-anchor="middle" font-size="12" fill="var(--chart-label)">Market Cap (B$)</text>',n+='<text x="30" y="300" text-anchor="middle" font-size="12" fill="var(--chart-label)" transform="rotate(-90 30 300)">Empresas</text>';for(let i=0;i<=5;i++){const d=80+i*174,l=550-i*100;n+=`<line x1="${d}" y1="545" x2="${d}" y2="555" stroke="var(--chart-axis)" stroke-width="1"/>`,n+=`<line x1="75" y1="${l}" x2="85" y2="${l}" stroke="var(--chart-axis)" stroke-width="1"/>`,n+=`<text x="${d}" y="570" text-anchor="middle" font-size="10" fill="var(--chart-label)">$${(i*o/5).toFixed(0)}B</text>`,n+=`<text x="60" y="${l+4}" text-anchor="end" font-size="10" fill="var(--chart-label)">${Math.round(i*s/5)}</text>`}t.forEach((i,d)=>{const l=a[d%a.length],p=80+parseFloat(i.cap)/o*870,m=550-i.companies/s*500,h=Math.max(15,parseFloat(i.cap)/o*60);n+=`
        <circle 
          cx="${p}" cy="${m}" r="${h}" 
          fill="${l}44" stroke="${l}" stroke-width="2"
          style="cursor:pointer;transition:all 0.3s ease"
          onmouseover="this.setAttribute('r', '${h*1.2}');this.setAttribute('fill', '${l}66')"
          onmouseout="this.setAttribute('r', '${h}');this.setAttribute('fill', '${l}44')"
          data-sector="${i.name}"
          data-cap="${i.cap}"
          data-companies="${i.companies}"
          data-div="${i.avgDiv}"
        />
        <text x="${p}" y="${m-8}" text-anchor="middle" font-size="12" font-weight="600" fill="${l}" style="pointer-events:none">${i.name.split(" ")[0]}</text>
        <text x="${p}" y="${m+8}" text-anchor="middle" font-size="11" fill="var(--chart-text)" style="pointer-events:none">$${i.cap}B</text>
      `}),n+="</svg>";let r=`
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
          ">🫧 Bubble Chart 3D - SP500</h2>
          <p style="
            margin: 0;
            font-size: 13px;
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: 1px;
          ">Eixo X: Market Cap | Eixo Y: Nº de Empresas | Tamanho: Proporção de Peso</p>
        </div>

        <div style="
          flex: 1;
          border: 1px solid var(--border);
          border-radius: 12px;
          background: var(--surface);
          padding: 20px;
          min-height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          ${n}
        </div>

        <div style="
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        ">
    `;t.forEach((i,d)=>{const l=a[d%a.length],p=(parseFloat(i.cap)/o*100).toFixed(1),m=(i.companies/s*100).toFixed(1);r+=`
        <div style="
          background: linear-gradient(135deg, ${l}22 0%, ${l}11 100%);
          border: 1px solid ${l}33;
          border-radius: 12px;
          padding: 20px;
          transition: all 0.3s ease;
          cursor: pointer;
        "
        onmouseover="
          this.style.borderColor='${l}';
          this.style.background='linear-gradient(135deg, ${l}33 0%, ${l}22 100%)';
          this.style.transform='translateY(-4px)';
          this.style.boxShadow='0 12px 32px ${l}22';
        "
        onmouseout="
          this.style.borderColor='${l}33';
          this.style.background='linear-gradient(135deg, ${l}22 0%, ${l}11 100%)';
          this.style.transform='translateY(0)';
          this.style.boxShadow='none';
        "
        >
          <div style="
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 16px;
          ">
            <div style="
              width: 16px;
              height: 16px;
              background: ${l};
              border-radius: 50%;
              flex-shrink: 0;
            "></div>
            <div style="
              font-size: 16px;
              font-weight: 600;
              color: var(--text-primary);
            ">${i.name}</div>
          </div>

          <div style="
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin-bottom: 16px;
          ">
            <div>
              <div style="
                font-size: 11px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                color: var(--text-secondary);
                margin-bottom: 4px;
              ">Market Cap</div>
              <div style="
                font-size: 18px;
                font-weight: 700;
                color: ${l};
              ">$${i.cap}B</div>
              <div style="
                font-size: 10px;
                color: var(--text-secondary);
                margin-top: 4px;
              ">${p}% do máximo</div>
            </div>

            <div>
              <div style="
                font-size: 11px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                color: var(--text-secondary);
                margin-bottom: 4px;
              ">Empresas</div>
              <div style="
                font-size: 18px;
                font-weight: 700;
                color: var(--text-primary);
              ">${i.companies}</div>
              <div style="
                font-size: 10px;
                color: var(--text-secondary);
                margin-top: 4px;
              ">${m}% do máximo</div>
            </div>
          </div>

          <div style="
            border-top: 1px solid ${l}22;
            padding-top: 12px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
          ">
            <div>
              <div style="
                font-size: 11px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                color: var(--text-secondary);
                margin-bottom: 4px;
              ">Avg Dividend</div>
              <div style="
                font-size: 16px;
                font-weight: 700;
                color: ${l};
              ">${i.avgDiv}%</div>
            </div>

            <div>
              <div style="
                font-size: 11px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                color: var(--text-secondary);
                margin-bottom: 4px;
              ">Top Company</div>
              <div style="
                font-size: 16px;
                font-weight: 700;
                color: var(--text-primary);
              ">${i.topCompany}</div>
            </div>
          </div>
        </div>
      `}),r+=`
        </div>

        <div style="
          padding: 24px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
        ">
          <h3 style="
            margin: 0 0 16px 0;
            font-size: 14px;
            color: var(--text-primary);
            text-transform: uppercase;
            letter-spacing: 1px;
          ">💡 Como Ler</h3>
          <div style="
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            font-size: 13px;
            color: var(--text-secondary);
            line-height: 1.6;
          ">
            <div>
              <strong style="color: var(--accent-cyan)">Eixo X (Horizontal):</strong> Representa o Market Cap de cada setor. Setores mais à direita têm maior capitalização de mercado.
            </div>
            <div>
              <strong style="color: var(--accent-green)">Eixo Y (Vertical):</strong> Representa o número de empresas em cada setor. Setores mais acima têm mais empresas.
            </div>
            <div>
              <strong style="color: var(--accent-amber)">Tamanho da Bolha:</strong> Quanto maior a bolha, maior o peso relativo do setor no índice SP500.
            </div>
            <div>
              <strong style="color: var(--text-primary)">Hover Interativo:</strong> Passe o mouse sobre as bolhas e cards para ver mais detalhes e animações.
            </div>
          </div>
        </div>
      </div>
    `,e.innerHTML=r}catch{e.innerHTML='<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--accent-red)">Erro ao carregar bubble chart</div>'}}}function te(e){return e?e>=1e12?`$${(e/1e12).toFixed(2)}T`:e>=1e9?`$${(e/1e9).toFixed(2)}B`:e>=1e6?`$${(e/1e6).toFixed(2)}M`:`$${e.toLocaleString("en-US")}`:"N/A"}function c(e){return e?String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;"):""}function J(e,t){let a;return(...o)=>{clearTimeout(a),a=setTimeout(()=>e.apply(this,o),t)}}const be=new Set(["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming","D.C."]);function ae(e){if(!e)return"Desconhecido";const t=String(e).split(",").map(o=>o.trim().replace(/\[\d+\]$/,"")),a=t[t.length-1];return!a||a.toLowerCase()==="none"?"Desconhecido":be.has(a)?"United States":a}function $e(e,{sector:t="",search:a="",country:o="",dividendMin:s=""}={}){let n=[...e];const r=a.toLowerCase().trim();if(t&&(n=n.filter(i=>i.sector===t)),o&&(n=n.filter(i=>ae(i.headquarters)===o)),s!==""&&s!==null&&s!==void 0){const i=Number(s);Number.isNaN(i)||(n=n.filter(d=>d.dividendYield!==null&&d.dividendYield!==void 0&&d.dividendYield>=i))}return r&&(n=n.filter(i=>i.symbol.toLowerCase().includes(r)||i.name.toLowerCase().includes(r)||i.subIndustry&&i.subIndustry.toLowerCase().includes(r)||i.headquarters&&i.headquarters.toLowerCase().includes(r))),n}function we(e,t="symbol-asc"){const a=[...e];return a.sort((o,s)=>{switch(t){case"marketCap-desc":return(s.marketCap||0)-(o.marketCap||0);case"marketCap-asc":return(o.marketCap||0)-(s.marketCap||0);case"symbol-asc":return o.symbol.localeCompare(s.symbol);case"name-asc":return o.name.localeCompare(s.name);case"dividendYield-desc":return(s.dividendYield||0)-(o.dividendYield||0);default:return 0}}),a}const N=760,O=320,v={top:28,right:28,bottom:44,left:68};function ke(e){if(!e)return"";const[t,a,o]=e.split("-");return`${o}/${a}/${t.slice(2)}`}function W(e){return Number.isFinite(e)?e>=100?`$${e.toFixed(0)}`:`$${e.toFixed(2)}`:"—"}function Ce(e){const t=e.map(u=>u.close),a=Math.min(...t),o=Math.max(...t),s=o-a||1,n=a-s*.08,r=o+s*.08,i=e.length,d=u=>v.left+u/(i-1)*(N-v.left-v.right),l=u=>v.top+(1-(u-n)/(r-n))*(O-v.top-v.bottom);let p=`<svg viewBox="0 0 ${N} ${O}" style="width:100%;height:auto;display:block;background:var(--plot-bg);border-radius:8px">`;const m=5;for(let u=0;u<=m;u++){const S=n+(r-n)*u/m,j=l(S);p+=`<line x1="${v.left}" y1="${j.toFixed(1)}" x2="${N-v.right}" y2="${j.toFixed(1)}" stroke="var(--chart-axis)" stroke-width="1"/>`,p+=`<text x="${v.left-8}" y="${(j+4).toFixed(1)}" text-anchor="end" font-size="11" fill="var(--chart-label)">${W(S)}</text>`}const h=[];for(let u=0;u<=4;u++)h.push(Math.round((i-1)*u/4));h.forEach(u=>{const S=d(u);p+=`<text x="${S.toFixed(1)}" y="${O-v.bottom+18}" text-anchor="middle" font-size="11" fill="var(--chart-label)">${ke(e[u].data)}</text>`});const _=e.map((u,S)=>`${d(S).toFixed(1)},${l(u.close).toFixed(1)}`).join(" "),pe=`${v.left},${l(n).toFixed(1)} `+_+` ${d(i-1).toFixed(1)},${l(n).toFixed(1)}`;p+=`<polygon points="${pe}" fill="rgba(0, 212, 255, 0.08)"/>`,p+=`<polyline points="${_}" fill="none" stroke="var(--accent-cyan)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;const K=e[i-1],G=l(K.close);return p+=`<circle cx="${d(i-1).toFixed(1)}" cy="${G.toFixed(1)}" r="4" fill="var(--accent-cyan)"/>`,p+=`<text x="${N-v.right}" y="${(G-10).toFixed(1)}" text-anchor="end" font-size="12" font-weight="700" fill="var(--chart-text)">${W(K.close)}</text>`,p+="</svg>",p}async function ne(e,t){var s;(s=document.querySelector(".modal-overlay"))==null||s.remove();const a=document.createElement("div");a.className="modal-overlay";const o=()=>a.remove();a.addEventListener("click",n=>{n.target===a&&o()}),document.addEventListener("keydown",n=>{n.key==="Escape"&&o()}),a.innerHTML=`
    <div class="modal" role="dialog" aria-label="Histórico de ${c(e)}">
      <div class="modal-header">
        <h2 class="modal-title">
          📈 ${c(e)}
          <span class="modal-subtitle">${c(t||"")}</span>
        </h2>
        <button class="modal-close" aria-label="Fechar">✕</button>
      </div>
      <div class="modal-body" id="price-chart-body">
        <p class="modal-loading">Carregando histórico...</p>
      </div>
    </div>
  `,document.body.appendChild(a),a.querySelector(".modal-close").addEventListener("click",o);try{const n=await fe(e),r=a.querySelector("#price-chart-body");if(!n||n.length===0){r.innerHTML=`<p class="modal-error">Nenhum dado de preço disponível para ${c(e)}.</p>`;return}const i=n[0].close,d=n[n.length-1].close,l=(d-i)/i*100,p=l>=0,m=p?"positive":"negative";r.innerHTML=`
      <div class="price-stats">
        <div class="price-stat">
          <span class="price-stat-label">Último</span>
          <strong>${W(d)}</strong>
        </div>
        <div class="price-stat">
          <span class="price-stat-label">Variação (2a)</span>
          <strong class="${m}">${p?"+":""}${l.toFixed(2)}%</strong>
        </div>
        <div class="price-stat">
          <span class="price-stat-label">Período</span>
          <strong>${n.length} pregões</strong>
        </div>
      </div>
      ${Ce(n)}
    `}catch(n){console.error(`Erro ao buscar histórico de ${e}:`,n);const r=a.querySelector("#price-chart-body");r.innerHTML=`<p class="modal-error">Erro ao carregar o histórico de ${c(e)}. Verifique se o backend está online.</p>`}}function x(e,t){return`
    <div class="company-detail">
      <span class="company-detail-label">${e}</span>
      <strong class="company-detail-value">${t}</strong>
    </div>
  `}function ie(e){var n;(n=document.querySelector(".modal-overlay"))==null||n.remove();const t=document.createElement("div");t.className="modal-overlay";const a=()=>t.remove();t.addEventListener("click",r=>{r.target===t&&a()}),document.addEventListener("keydown",r=>{r.key==="Escape"&&a()});const o=e.dividendYield!==null&&e.dividendYield!==void 0?`${e.dividendYield.toFixed(2)}%`:"—",s=te(e.marketCap);t.innerHTML=`
    <div class="modal" role="dialog" aria-label="Detalhes de ${c(e.symbol)}">
      <div class="modal-header">
        <h2 class="modal-title">
          💼 ${c(e.symbol)}
          <span class="modal-subtitle">${c(e.name||"")}</span>
        </h2>
        <button class="modal-close" aria-label="Fechar">✕</button>
      </div>
      <div class="modal-body">
        <div class="company-details-grid">
          ${x("Empresa",c(e.name||"N/A"))}
          ${x("Setor",c(e.sectorName||e.sector||"N/A"))}
          ${x("Subindústria",c(e.subIndustry||"N/A"))}
          ${x("Sede",c(e.headquarters||"N/A"))}
          ${x("Market Cap",s)}
          ${x("Classificação",c(e.marketCapClassification||"N/A"))}
          ${x("Div. Yield",o)}
          ${x("Paga dividendos",e.hasDividend?c(e.hasDividend):"—")}
          ${x("Data de inclusão",c(e.dateAdded||"N/A"))}
          ${x("CIK",e.cik?c(String(e.cik)):"N/A")}
          ${x("Fundação",c(e.founded||"N/A"))}
        </div>
        <div class="modal-footer">
          <button class="modal-action" id="details-chart-btn">📈 Ver histórico de preços</button>
        </div>
      </div>
    </div>
  `,document.body.appendChild(t),t.querySelector(".modal-close").addEventListener("click",a),t.querySelector("#details-chart-btn").addEventListener("click",()=>{ne(e.symbol,e.name)})}let E=[],k=[],g=1,M="dashboard";const F=50;let C=new Set,b,$,T,D,z,f,w,B,y;function Ee(){const e=localStorage.getItem("sp500-theme"),t=window.matchMedia("(prefers-color-scheme: light)").matches,a=e||(t?"light":"dark");document.documentElement.setAttribute("data-theme",a);const o=document.getElementById("theme-toggle");o&&(o.textContent=a==="light"?"🌙":"☀️",o.addEventListener("click",()=>{const n=document.documentElement.getAttribute("data-theme")==="light"?"dark":"light";document.documentElement.setAttribute("data-theme",n),localStorage.setItem("sp500-theme",n),o.textContent=n==="light"?"🌙":"☀️"}))}document.addEventListener("DOMContentLoaded",()=>{Ee(),b=document.getElementById("sector-filter"),$=document.getElementById("country-filter"),T=document.getElementById("search-input"),D=document.getElementById("dividend-min"),z=document.getElementById("sort-select"),f=document.getElementById("table-body"),w=document.getElementById("stats"),B=document.getElementById("pagination"),y=document.getElementById("header-checkbox"),document.querySelectorAll(".nav-tab").forEach(s=>{s.addEventListener("click",n=>{Se(n.target.dataset.tab)})}),b&&b.addEventListener("change",L),$&&$.addEventListener("change",L),T&&T.addEventListener("input",J(L,300)),D&&D.addEventListener("input",J(L,300)),z&&z.addEventListener("change",L),y&&y.addEventListener("change",()=>{f.querySelectorAll(".row-checkbox").forEach(n=>{n.checked=y.checked,n.dispatchEvent(new Event("change"))})});const e=document.getElementById("select-all"),t=document.getElementById("deselect-all"),a=document.getElementById("export-csv"),o=document.getElementById("export-json");e&&e.addEventListener("click",()=>{k.forEach(s=>C.add(s.symbol)),A(),P()}),t&&t.addEventListener("click",()=>{C.clear(),A(),P()}),a&&a.addEventListener("click",We),o&&o.addEventListener("click",_e),oe(),se(),Le()});function Se(e){M=e,oe(),se()}function oe(){const e=document.getElementById("dashboard-view"),t=document.getElementById("treemap-view"),a=document.getElementById("heatmap-view"),o=document.getElementById("bubble-chart-view");e&&(e.style.display="none"),t&&(t.style.display="none"),a&&(a.style.display="none"),o&&(o.style.display="none"),M==="dashboard"?e&&(e.style.display="block"):M==="treemap"?(t&&(t.style.display="block"),ge()):M==="heatmap"?(a&&(a.style.display="block"),ye()):M==="bubble"&&(o&&(o.style.display="block"),xe())}function se(){document.querySelectorAll(".nav-tab").forEach(t=>{t.classList.remove("active"),t.dataset.tab===M&&t.classList.add("active")})}async function Le(){w&&(w.textContent="Carregando dados...");try{const e=await Y();E=e.flatMap(a=>a.companies);const t=document.getElementById("freshness-badge");t&&Q(t,je(e)),Ve(),Re(),L(),P(),De(),Pe()}catch(e){console.error("Erro ao carregar dados:",e),w&&(w.textContent="Erro ao carregar dados. Tente novamente.");const t=document.getElementById("freshness-badge");t&&Q(t,null)}}const X={bullish:{label:"🚀 Otimista",cls:"mood-up"},bearish:{label:"⚠️ Pessimista",cls:"mood-down"},neutral:{label:"➖ Neutro",cls:"mood-flat"}};function Me(e){const t=String(e||"").split("-");return t.length<3?e||"":`${t[2]}/${t[1]}/${t[0]}`}function re(e){const t=Number(e);return Number.isNaN(t)?"—":`${t>0?"+":""}${t.toFixed(2)}%`}function Z(e){return`
    <div class="summary-row">
      <span class="mini-symbol">${c(e.symbol)}</span>
      <button class="mini-name" data-symbol="${c(e.symbol)}" title="Ver detalhes">${c(e.name)}</button>
      <strong class="mini-change ${e.changePct>=0?"positive":"negative"}">${re(e.changePct)}</strong>
    </div>
  `}function Te(e){const t=X[e.marketMood]||X.neutral,a=e.stats||{},o=e.topGainers||[],s=e.topLosers||[],n=e.sectorPerformance||[],r=e.generatedAt?e.generatedAt.split(" ")[1]:"";return`
    <div class="summary-head">
      <div>
        <h2 class="summary-title">🔄 Resumo do Dia</h2>
        <span class="summary-date">Pregão de ${Me(e.referenceDate)} · Atualizado às ${r} UTC</span>
      </div>
      <span class="summary-mood ${t.cls}">${t.label}</span>
    </div>
    <div class="summary-stats">
      <span class="summary-stat"><strong class="positive">▲ ${a.gainers??0}</strong> altas</span>
      <span class="summary-stat"><strong class="negative">▼ ${a.losers??0}</strong> baixas</span>
      <span class="summary-stat"><strong>➖ ${a.neutral??0}</strong> neutras</span>
      <span class="summary-stat"><strong>${a.total??0}</strong> empresas</span>
    </div>
    <div class="summary-grid">
      <div class="summary-list">
        <h3 class="summary-list-title positive">▲ Maiores Altas</h3>
        ${o.length?o.map(Z).join(""):'<p class="summary-empty">Sem dados</p>'}
      </div>
      <div class="summary-list">
        <h3 class="summary-list-title negative">▼ Maiores Baixas</h3>
        ${s.length?s.map(Z).join(""):'<p class="summary-empty">Sem dados</p>'}
      </div>
    </div>
    <div class="summary-sectors">
      ${n.map(i=>`
        <span class="sector-chip ${i.avgChangePct>=0?"chip-up":"chip-down"}">
          <span class="sector-chip-name">${c(i.name)}</span>
          <strong>${re(i.avgChangePct)}</strong>
        </span>`).join("")}
    </div>
  `}async function De(){const e=document.getElementById("daily-summary");if(e)try{const t=await he();if(!t)throw new Error("Sem dados");e.style.display="",e.innerHTML=Te(t),e.querySelectorAll(".mini-name").forEach(a=>{a.addEventListener("click",()=>{const o=E.find(s=>s.symbol===a.dataset.symbol);o&&ie(o)})})}catch(t){console.error("Resumo do dia indisponível:",t),e.style.display="none"}}function ze(e){if(!e)return"—";const t=String(e).split("-");return t.length!==3?String(e):`${t[2]}/${t[1]}/${t[0]}`}function Ae(e){return{mensal:"Mensal",trimestral:"Trimestral",semestral:"Semestral",anual:"Anual",indefinida:"Sem cadência"}[e]||String(e||"—")}function Be(e){return{mensal:"dividend-cadence monthly",trimestral:"dividend-cadence quarterly",semestral:"dividend-cadence semiannual",anual:"dividend-cadence annual",indefinida:"dividend-cadence unknown"}[e]||"dividend-cadence unknown"}function Ne(e){const t=Number(e);return Number.isFinite(t)?t.toLocaleString("pt-BR",{style:"currency",currency:"BRL"}):"—"}function Ie(e,t){if(!(e!=null&&e.nextEstimatedDate))return!1;const a=String(e.nextEstimatedDate).split("-");if(a.length!==3)return!1;const o=new Date(Date.UTC(a[0],a[1]-1,a[2])),s=new Date,n=Math.floor((o.getTime()-Date.UTC(s.getUTCFullYear(),s.getUTCMonth(),s.getUTCDate()))/864e5);return n>=0&&n<=Number(t)}function Fe(e){const t=Number(e==null?void 0:e.horizonDays)||90,o=(Array.isArray(e==null?void 0:e.events)?e.events:[]).filter(r=>Ie(r,t));if(o.length===0)return`
      <p class="dividend-empty">
        Nenhum dividendo estimado nos próximos ${t} dias.
      </p>`;const s=new Map;o.forEach(r=>{const i=r.nextEstimatedDate||"sem-data";s.has(i)||s.set(i,[]),s.get(i).push(r)});const n=[...s.entries()].sort((r,i)=>r[0]==="sem-data"?1:i[0]==="sem-data"?-1:r[0].localeCompare(i[0])).map(([r,i])=>{var p;const d=r==="sem-data"?"Data ainda não estimada":`${ze(r)} · em ${((p=i[0])==null?void 0:p.daysAhead)??"?"} dia(s)`,l=i.map(m=>{const h=m.nextEstimatedAmount??m.lastAmount??null;return`
            <div class="dividend-event">
              <button
                type="button"
                class="dividend-open"
                data-symbol="${c(m.symbol)}"
                title="Ver detalhes de ${c(m.name)}"
              >
                <strong class="dividend-symbol">${c(m.symbol)}</strong>
                <span class="dividend-name">${c(m.name)}</span>
              </button>
              <span class="dividend-cadence ${Be(m.cadence)}">
                ${Ae(m.cadence)}
              </span>
              <strong class="dividend-amount">${Ne(h)}</strong>
            </div>`}).join("");return`
        <div class="dividend-day">
          <h4 class="dividend-day-head">📅 ${d}</h4>
          <div class="dividend-day-list">${l}</div>
        </div>`}).join("");return`
    <div class="dividend-calendar">
      <div class="dividend-head">
        <h3>📅 Próximos Dividendos</h3>
        <span class="dividend-horizon">horizonte: ${t} dias · ${o.length} evento(s)</span>
      </div>
      <div class="dividend-body">${n}</div>
      ${e!=null&&e.generatedAt?`<p class="dividend-ref">Gerado em ${c(e.generatedAt)}</p>`:""}
    </div>`}async function Pe(){const e=document.getElementById("dividend-calendar");if(e)try{const t=await ve();if(!t)throw new Error("Sem dados");e.style.display="",e.innerHTML=Fe(t)}catch(t){console.error("Calendário de dividendos indisponível:",t),e.style.display="none"}}const He=864e5;function Ye(e){if(!e)return null;const t=String(e).trim(),a=t.length===10?new Date(`${t}T00:00:00Z`):new Date(t);return Number.isNaN(a.getTime())?null:a.getTime()}function je(e){let t=null;return e.forEach(a=>{const o=Ye(a.lastUpdated);o&&(!t||o>t)&&(t=o)}),t}function qe(e,t){const a=Math.floor(Math.max(0,t-e)/6e4);if(a<1)return"atualizado agora";if(a<60)return`atualizado há ${a} min`;const o=new Date(e).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"}),s=Math.floor(a/1440);if(s<1)return`atualizado hoje às ${o}`;if(s<2)return`atualizado ontem às ${o}`;const n=new Date(e).toLocaleDateString("pt-BR");return s>=8?`desatualizado há ${s} dias (${n})`:`atualizado há ${s} dias (${n})`}function Q(e,t){const a=e.querySelector("#freshness-text");if(!t){e.className="freshness-badge fd-unknown",a.textContent="sem dados de atualização",e.title="Sem registro de atualização dos dados";return}const o=(Date.now()-t)/He;e.className="freshness-badge ",o<2?e.classList.add("fd-fresh"):o<=7?e.classList.add("fd-aging"):e.classList.add("fd-stale"),a.textContent=qe(t,Date.now()),e.title=`Última atualização dos dados: ${new Date(t).toLocaleString("pt-BR")}`}function Ve(){b&&(b.innerHTML='<option value="">Todos os Setores</option>',ee.forEach(e=>{const t=document.createElement("option");t.value=e.id,t.textContent=e.name,b.appendChild(t)}))}function Re(){if(!$)return;const e=[...new Set(E.map(t=>ae(t.headquarters)))].filter(Boolean).sort((t,a)=>t.localeCompare(a));$.innerHTML='<option value="">Todos os Países</option>',e.forEach(t=>{const a=document.createElement("option");a.value=t,a.textContent=t,$.appendChild(a)})}function L(){const e=(b==null?void 0:b.value)||"",t=($==null?void 0:$.value)||"",a=(T==null?void 0:T.value)||"",o=(D==null?void 0:D.value)||"",s=(z==null?void 0:z.value)||"symbol-asc";k=we($e(E,{sector:e,country:t,search:a,dividendMin:o}),s),g=1,C.clear(),y&&(y.checked=!1),A(),I(),P()}function A(){if(!f)return;const e=(g-1)*F,t=e+F,a=k.slice(e,t);if(a.length===0){f.innerHTML=`
      <tr>
        <td colspan="10" class="table-message" style="color: var(--text-secondary);">
          Nenhuma empresa encontrada
        </td>
      </tr>
    `;return}f.innerHTML=a.map((o,s)=>{const n=e+s+1,r=C.has(o.symbol),i=te(o.marketCap),d=o.dividendYield!==null&&o.dividendYield!==void 0?`${o.dividendYield.toFixed(2)}%`:"—",l=o.dividendYield!==null&&o.dividendYield!==void 0?"positive":"none";return`
      <tr data-symbol="${o.symbol}" class="${r?"selected":""}">
        <td><input type="checkbox" class="row-checkbox" ${r?"checked":""}></td>
        <td>${n}</td>
        <td class="symbol">${o.symbol}</td>
        <td class="company-name" title="Ver detalhes">${c(o.name)}</td>
        <td>${c(o.sectorName)}</td>
        <td class="market-cap">${i}</td>
        <td>${c(o.subIndustry||"N/A")}</td>
        <td>${c(o.headquarters||"N/A")}</td>
        <td class="dividend ${l}">${d}</td>
        <td><button class="price-btn" data-symbol="${o.symbol}" data-name="${c(o.name)}" title="Ver histórico de preços">📈</button></td>
      </tr>
    `}).join(""),Oe(),Ue(),de()}function Ue(){f&&f.querySelectorAll(".price-btn").forEach(e=>{e.addEventListener("click",t=>{t.stopPropagation(),ne(e.dataset.symbol,e.dataset.name)})})}function Oe(){f&&(f.querySelectorAll(".row-checkbox").forEach(e=>{e.addEventListener("change",t=>{const a=t.target.closest("tr"),o=a.dataset.symbol;t.target.checked?(C.add(o),a.classList.add("selected")):(C.delete(o),a.classList.remove("selected")),de()})}),f.querySelectorAll("tr[data-symbol]").forEach(e=>{e.addEventListener("click",t=>{if(t.target.type==="checkbox"||t.target.closest(".price-btn")||t.target.closest(".company-name"))return;const a=e.querySelector(".row-checkbox");a.checked=!a.checked,a.dispatchEvent(new Event("change"))})}),f.querySelectorAll(".company-name").forEach(e=>{e.addEventListener("click",t=>{var s;t.stopPropagation();const a=(s=e.closest("tr"))==null?void 0:s.dataset.symbol;if(!a)return;const o=k.find(n=>n.symbol===a)||E.find(n=>n.symbol===a);o&&ie(o)})}))}function de(){if(!y||!f)return;const e=f.querySelectorAll(".row-checkbox"),t=f.querySelectorAll(".row-checkbox:checked").length;t===0?(y.indeterminate=!1,y.checked=!1):t===e.length?(y.indeterminate=!1,y.checked=!0):y.indeterminate=!0}function I(){var n,r;if(!B)return;const e=Math.ceil(k.length/F);if(e<=1){B.innerHTML="";return}let t="";t+=`<button id="prev-page" ${g===1?"disabled":""}>« Anterior</button>`;const a=5;let o=Math.max(1,g-Math.floor(a/2)),s=Math.min(e,o+a-1);s-o+1<a&&(o=Math.max(1,s-a+1)),o>1&&(t+='<button data-page="1">1</button>',o>2&&(t+='<span class="ellipsis">…</span>'));for(let i=o;i<=s;i++)t+=`<button data-page="${i}" class="${i===g?"active":""}">${i}</button>`;s<e&&(s<e-1&&(t+='<span class="ellipsis">…</span>'),t+=`<button data-page="${e}">${e}</button>`),t+=`<button id="next-page" ${g===e?"disabled":""}>Próxima »</button>`,t+=`<span class="pagination-info">Página ${g} de ${e} (${k.length} empresas)</span>`,B.innerHTML=t,B.querySelectorAll("button[data-page]").forEach(i=>{i.addEventListener("click",()=>{g=parseInt(i.dataset.page),A(),I(),window.scrollTo({top:0,behavior:"smooth"})})}),(n=document.getElementById("prev-page"))==null||n.addEventListener("click",()=>{g>1&&(g--,A(),I(),window.scrollTo({top:0,behavior:"smooth"}))}),(r=document.getElementById("next-page"))==null||r.addEventListener("click",()=>{const i=Math.ceil(k.length/F);g<i&&(g++,A(),I(),window.scrollTo({top:0,behavior:"smooth"}))})}function P(){if(!w)return;const e=E.length,t=k.length,a=C.size;t===e?w.textContent=`${e} empresas no total`:w.textContent=`${t} de ${e} empresas | ${a} selecionada(s)`}function le(){return E.filter(e=>C.has(e.symbol))}function We(){const e=le();if(e.length===0){alert("Nenhuma empresa selecionada");return}const t=["Símbolo","Empresa","Setor","Subindústria","Sede","Market Cap","Dividend Yield","Data Inclusão","CIK","Fundação"],a=e.map(s=>[s.symbol,`"${s.name}"`,s.sectorName,`"${s.subIndustry||""}"`,`"${s.headquarters||""}"`,s.marketCap||"",s.dividendYield!==null&&s.dividendYield!==void 0?s.dividendYield.toFixed(2):"",s.dateAdded||"",s.cik||"",s.founded||""]),o=[t.join(","),...a.map(s=>s.join(","))].join(`
`);ce(o,"sp500-selecao.csv","text/csv")}function _e(){const e=le();if(e.length===0){alert("Nenhuma empresa selecionada");return}const t=JSON.stringify(e,null,2);ce(t,"sp500-selecao.json","application/json")}function ce(e,t,a){const o=new Blob([e],{type:a}),s=URL.createObjectURL(o),n=document.createElement("a");n.href=s,n.download=t,document.body.appendChild(n),n.click(),document.body.removeChild(n),URL.revokeObjectURL(s)}
