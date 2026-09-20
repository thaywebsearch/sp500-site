(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&n(s)}).observe(document,{childList:!0,subtree:!0});function a(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(r){if(r.ep)return;r.ep=!0;const o=a(r);fetch(r.href,o)}})();const H=window.location.hostname==="localhost"?"http://localhost:5001":"https://sp500-site-production.up.railway.app",K=[{id:"communication-services",name:"Communication Services"},{id:"consumer-discretionary",name:"Consumer Discretionary"},{id:"consumer-staples",name:"Consumer Staples"},{id:"energy",name:"Energy"},{id:"financials",name:"Financials"},{id:"health-care",name:"Health Care"},{id:"industrials",name:"Industrials"},{id:"information-technology",name:"Information Technology"},{id:"materials",name:"Materials"},{id:"real-estate",name:"Real Estate"},{id:"utilities",name:"Utilities"}];let q=null;const V=new Map,te=new Map,U=new Map;let O=null;function ue(){return q||(q=(async()=>{const e=await fetch(`${H}/api/setores`);if(!e.ok)throw new Error("Erro ao buscar setores");return(await e.json()).setores||[]})()),q}function fe(e){return V.has(e)||V.set(e,(async()=>{var t,a,n,r;try{const o=await fetch(`${H}/api/setor/${e}`);if(!o.ok)throw new Error(`HTTP ${o.status}`);const s=await o.json(),i=Array.isArray((t=s.dados)==null?void 0:t.companies)?s.dados.companies:[],d=((a=K.find(l=>l.id===e))==null?void 0:a.name)||e;return te.set(e,{lastUpdated:((n=s.dados)==null?void 0:n.liveUpdatedAt)||((r=s.dados)==null?void 0:r.generatedAt)||null}),i.map(l=>({...l,sector:e,sectorName:d}))}catch(o){return console.error(`Erro ao carregar ${e}:`,o),[]}})()),V.get(e)}async function Y(){const e=await ue();return await Promise.all(e.map(async a=>{var o,s;const n=await fe(a),r=((o=K.find(i=>i.id===a))==null?void 0:o.name)||a;return{id:a,name:r,companies:n,lastUpdated:((s=te.get(a))==null?void 0:s.lastUpdated)??null}}))}function he(e){return U.has(e)||U.set(e,(async()=>{const t=await fetch(`${H}/api/historico/${encodeURIComponent(e)}`);if(!t.ok)throw new Error(`HTTP ${t.status}`);return(await t.json()).registros||[]})()),U.get(e)}function ge(){return O||(O=(async()=>{const e=await fetch(`${H}/api/resumo-dia`);if(!e.ok)throw new Error(`HTTP ${e.status}`);return(await e.json()).dados||null})()),O}async function ve(){const e=document.getElementById("treemap-view");if(e){e.style.display="flex",e.style.flexDirection="column",e.style.height="100%",e.style.width="100%",e.style.margin="0",e.style.padding="0",e.style.background="var(--bg-primary)",e.innerHTML='<div style="display:flex;align-items:center;justify-content:center;height:100%;width:100%;font-size:14px;color:var(--text-secondary)">Carregando setores...</div>';try{const t=(await Y()).map(o=>{const s=o.companies,i=s.reduce((l,c)=>l+(c.marketCap||0),0),d=s.length>0?s.reduce((l,c)=>l+(c.dividendYield||0),0)/s.length:0;return{id:o.id,name:o.name,value:i,companies:s.length,avgDiv:parseFloat(d.toFixed(2)),topCompany:s.length>0?s[0].symbol:"N/A"}}),a=t.reduce((o,s)=>o+s.value,0),n=["#00d4ff","#00e676","#ffab00","#ff5252","#8bc34a","#4caf50","#2196f3","#9c27b0","#ff9800","#f44336","#00bcd4"];let r=`
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
    `;t.forEach((o,s)=>{const i=n[s%n.length],d=(o.value/a*100).toFixed(1),l=(o.value/1e9).toFixed(1);r+=`
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
            ">${o.name}</div>
            <div style="
              font-size: 13px;
              color: var(--text-secondary);
            ">${o.companies} empresas</div>
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
              ">${o.topCompany}</div>
            </div>
          </div>
        </div>
      `}),r+="</div>",e.innerHTML=r}catch{e.innerHTML='<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--accent-red)">Erro ao carregar setores</div>'}}}async function ye(){const e=document.getElementById("heatmap-view");if(e){e.style.display="flex",e.style.flexDirection="column",e.style.height="100%",e.style.width="100%",e.style.margin="0",e.style.padding="0",e.style.background="var(--bg-primary)",e.innerHTML='<div style="display:flex;align-items:center;justify-content:center;height:100%;width:100%;font-size:14px;color:var(--text-secondary)">Carregando heatmap...</div>';try{let n=function(s,i){const d=s/i*100;return d>=80?"#ff5252":d>=60?"#ff9800":d>=40?"#ffeb3b":d>=20?"#8bc34a":"#4caf50"};var t=n;const a=(await Y()).map(s=>{const i=[...s.companies].sort((d,l)=>(l.marketCap||0)-(d.marketCap||0)).slice(0,4);return{name:s.name,companies:i}});let r=0;a.forEach(s=>{s.companies.forEach(i=>{i.marketCap>r&&(r=i.marketCap)})});let o=`
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
    `;a.forEach(s=>{o+=`
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
        >${s.name}</div>

        <div style="
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
          align-content: start;
        ">
      `,s.companies.forEach(i=>{const d=n(i.marketCap,r),l=(i.marketCap/1e9).toFixed(2),c=i.dividendYield!==null&&i.dividendYield!==void 0?i.dividendYield.toFixed(2):"—";o+=`
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
                ">${c}</div>
              </div>
            </div>
          </div>
        `}),o+="</div>"}),o+=`
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
    `,e.innerHTML=o}catch(a){console.error("Erro:",a),e.innerHTML='<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--accent-red)">Erro ao carregar heatmap</div>'}}}async function xe(){const e=document.getElementById("bubble-chart-view");if(e){e.style.display="flex",e.style.flexDirection="column",e.style.height="100%",e.style.width="100%",e.style.margin="0",e.style.padding="0",e.style.background="var(--bg-primary)",e.innerHTML='<div style="display:flex;align-items:center;justify-content:center;height:100%;width:100%;font-size:14px;color:var(--text-secondary)">Carregando bubble chart...</div>';try{const t=(await Y()).map(i=>{const d=i.companies,l=d.reduce((u,x)=>u+(x.marketCap||0),0),c=d.length>0?d.reduce((u,x)=>u+(x.dividendYield||0),0)/d.length:0;return{id:i.id,name:i.name,cap:(l/1e9).toFixed(1),companies:d.length,avgDiv:parseFloat(c.toFixed(2)),topCompany:d.length>0?d[0].symbol:"N/A"}}),a=["#00d4ff","#00e676","#ffab00","#ff5252","#8bc34a","#4caf50","#2196f3","#9c27b0","#ff9800","#f44336","#00bcd4"],n=Math.max(...t.map(i=>parseFloat(i.cap))),r=Math.max(...t.map(i=>i.companies));let o='<svg viewBox="0 0 1000 600" style="width:100%;height:100%;border-radius:8px;background:var(--plot-bg)">';o+='<line x1="80" y1="550" x2="950" y2="550" stroke="var(--chart-axis)" stroke-width="2"/>',o+='<line x1="80" y1="550" x2="80" y2="50" stroke="var(--chart-axis)" stroke-width="2"/>',o+='<text x="500" y="590" text-anchor="middle" font-size="12" fill="var(--chart-label)">Market Cap (B$)</text>',o+='<text x="30" y="300" text-anchor="middle" font-size="12" fill="var(--chart-label)" transform="rotate(-90 30 300)">Empresas</text>';for(let i=0;i<=5;i++){const d=80+i*174,l=550-i*100;o+=`<line x1="${d}" y1="545" x2="${d}" y2="555" stroke="var(--chart-axis)" stroke-width="1"/>`,o+=`<line x1="75" y1="${l}" x2="85" y2="${l}" stroke="var(--chart-axis)" stroke-width="1"/>`,o+=`<text x="${d}" y="570" text-anchor="middle" font-size="10" fill="var(--chart-label)">$${(i*n/5).toFixed(0)}B</text>`,o+=`<text x="60" y="${l+4}" text-anchor="end" font-size="10" fill="var(--chart-label)">${Math.round(i*r/5)}</text>`}t.forEach((i,d)=>{const l=a[d%a.length],c=80+parseFloat(i.cap)/n*870,u=550-i.companies/r*500,x=Math.max(15,parseFloat(i.cap)/n*60);o+=`
        <circle 
          cx="${c}" cy="${u}" r="${x}" 
          fill="${l}44" stroke="${l}" stroke-width="2"
          style="cursor:pointer;transition:all 0.3s ease"
          onmouseover="this.setAttribute('r', '${x*1.2}');this.setAttribute('fill', '${l}66')"
          onmouseout="this.setAttribute('r', '${x}');this.setAttribute('fill', '${l}44')"
          data-sector="${i.name}"
          data-cap="${i.cap}"
          data-companies="${i.companies}"
          data-div="${i.avgDiv}"
        />
        <text x="${c}" y="${u-8}" text-anchor="middle" font-size="12" font-weight="600" fill="${l}" style="pointer-events:none">${i.name.split(" ")[0]}</text>
        <text x="${c}" y="${u+8}" text-anchor="middle" font-size="11" fill="var(--chart-text)" style="pointer-events:none">$${i.cap}B</text>
      `}),o+="</svg>";let s=`
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
          ${o}
        </div>

        <div style="
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        ">
    `;t.forEach((i,d)=>{const l=a[d%a.length],c=(parseFloat(i.cap)/n*100).toFixed(1),u=(i.companies/r*100).toFixed(1);s+=`
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
              ">${c}% do máximo</div>
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
              ">${u}% do máximo</div>
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
      `}),s+=`
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
    `,e.innerHTML=s}catch{e.innerHTML='<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--accent-red)">Erro ao carregar bubble chart</div>'}}}function ae(e){return e?e>=1e12?`$${(e/1e12).toFixed(2)}T`:e>=1e9?`$${(e/1e9).toFixed(2)}B`:e>=1e6?`$${(e/1e6).toFixed(2)}M`:`$${e.toLocaleString("en-US")}`:"N/A"}function p(e){return e?String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;"):""}function X(e,t){let a;return(...n)=>{clearTimeout(a),a=setTimeout(()=>e.apply(this,n),t)}}const be=new Set(["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming","D.C."]);function oe(e){if(!e)return"Desconhecido";const t=String(e).split(",").map(n=>n.trim().replace(/\[\d+\]$/,"")),a=t[t.length-1];return!a||a.toLowerCase()==="none"?"Desconhecido":be.has(a)?"United States":a}function $e(e,{sector:t="",search:a="",country:n="",dividendMin:r=""}={}){let o=[...e];const s=a.toLowerCase().trim();if(t&&(o=o.filter(i=>i.sector===t)),n&&(o=o.filter(i=>oe(i.headquarters)===n)),r!==""&&r!==null&&r!==void 0){const i=Number(r);Number.isNaN(i)||(o=o.filter(d=>d.dividendYield!==null&&d.dividendYield!==void 0&&d.dividendYield>=i))}return s&&(o=o.filter(i=>i.symbol.toLowerCase().includes(s)||i.name.toLowerCase().includes(s)||i.subIndustry&&i.subIndustry.toLowerCase().includes(s)||i.headquarters&&i.headquarters.toLowerCase().includes(s))),o}function we(e,t="symbol-asc"){const a=[...e];return a.sort((n,r)=>{switch(t){case"marketCap-desc":return(r.marketCap||0)-(n.marketCap||0);case"marketCap-asc":return(n.marketCap||0)-(r.marketCap||0);case"symbol-asc":return n.symbol.localeCompare(r.symbol);case"name-asc":return n.name.localeCompare(r.name);case"dividendYield-desc":return(r.dividendYield||0)-(n.dividendYield||0);default:return 0}}),a}const I=760,R=320,h={top:28,right:28,bottom:44,left:68};function ke(e){if(!e)return"";const[t,a,n]=e.split("-");return`${n}/${a}/${t.slice(2)}`}function _(e){return Number.isFinite(e)?e>=100?`$${e.toFixed(0)}`:`$${e.toFixed(2)}`:"—"}function Ee(e){const t=e.map(m=>m.close),a=Math.min(...t),n=Math.max(...t),r=n-a||1,o=a-r*.08,s=n+r*.08,i=e.length,d=m=>h.left+m/(i-1)*(I-h.left-h.right),l=m=>h.top+(1-(m-o)/(s-o))*(R-h.top-h.bottom);let c=`<svg viewBox="0 0 ${I} ${R}" style="width:100%;height:auto;display:block;background:var(--plot-bg);border-radius:8px">`;const u=5;for(let m=0;m<=u;m++){const L=o+(s-o)*m/u,j=l(L);c+=`<line x1="${h.left}" y1="${j.toFixed(1)}" x2="${I-h.right}" y2="${j.toFixed(1)}" stroke="var(--chart-axis)" stroke-width="1"/>`,c+=`<text x="${h.left-8}" y="${(j+4).toFixed(1)}" text-anchor="end" font-size="11" fill="var(--chart-label)">${_(L)}</text>`}const x=[];for(let m=0;m<=4;m++)x.push(Math.round((i-1)*m/4));x.forEach(m=>{const L=d(m);c+=`<text x="${L.toFixed(1)}" y="${R-h.bottom+18}" text-anchor="middle" font-size="11" fill="var(--chart-label)">${ke(e[m].data)}</text>`});const W=e.map((m,L)=>`${d(L).toFixed(1)},${l(m.close).toFixed(1)}`).join(" "),me=`${h.left},${l(o).toFixed(1)} `+W+` ${d(i-1).toFixed(1)},${l(o).toFixed(1)}`;c+=`<polygon points="${me}" fill="rgba(0, 212, 255, 0.08)"/>`,c+=`<polyline points="${W}" fill="none" stroke="var(--accent-cyan)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;const J=e[i-1],G=l(J.close);return c+=`<circle cx="${d(i-1).toFixed(1)}" cy="${G.toFixed(1)}" r="4" fill="var(--accent-cyan)"/>`,c+=`<text x="${I-h.right}" y="${(G-10).toFixed(1)}" text-anchor="end" font-size="12" font-weight="700" fill="var(--chart-text)">${_(J.close)}</text>`,c+="</svg>",c}async function ne(e,t){var r;(r=document.querySelector(".modal-overlay"))==null||r.remove();const a=document.createElement("div");a.className="modal-overlay";const n=()=>a.remove();a.addEventListener("click",o=>{o.target===a&&n()}),document.addEventListener("keydown",o=>{o.key==="Escape"&&n()}),a.innerHTML=`
    <div class="modal" role="dialog" aria-label="Histórico de ${p(e)}">
      <div class="modal-header">
        <h2 class="modal-title">
          📈 ${p(e)}
          <span class="modal-subtitle">${p(t||"")}</span>
        </h2>
        <button class="modal-close" aria-label="Fechar">✕</button>
      </div>
      <div class="modal-body" id="price-chart-body">
        <p class="modal-loading">Carregando histórico...</p>
      </div>
    </div>
  `,document.body.appendChild(a),a.querySelector(".modal-close").addEventListener("click",n);try{const o=await he(e),s=a.querySelector("#price-chart-body");if(!o||o.length===0){s.innerHTML=`<p class="modal-error">Nenhum dado de preço disponível para ${p(e)}.</p>`;return}const i=o[0].close,d=o[o.length-1].close,l=(d-i)/i*100,c=l>=0,u=c?"positive":"negative";s.innerHTML=`
      <div class="price-stats">
        <div class="price-stat">
          <span class="price-stat-label">Último</span>
          <strong>${_(d)}</strong>
        </div>
        <div class="price-stat">
          <span class="price-stat-label">Variação (2a)</span>
          <strong class="${u}">${c?"+":""}${l.toFixed(2)}%</strong>
        </div>
        <div class="price-stat">
          <span class="price-stat-label">Período</span>
          <strong>${o.length} pregões</strong>
        </div>
      </div>
      ${Ee(o)}
    `}catch(o){console.error(`Erro ao buscar histórico de ${e}:`,o);const s=a.querySelector("#price-chart-body");s.innerHTML=`<p class="modal-error">Erro ao carregar o histórico de ${p(e)}. Verifique se o backend está online.</p>`}}function y(e,t){return`
    <div class="company-detail">
      <span class="company-detail-label">${e}</span>
      <strong class="company-detail-value">${t}</strong>
    </div>
  `}function ie(e){var o;(o=document.querySelector(".modal-overlay"))==null||o.remove();const t=document.createElement("div");t.className="modal-overlay";const a=()=>t.remove();t.addEventListener("click",s=>{s.target===t&&a()}),document.addEventListener("keydown",s=>{s.key==="Escape"&&a()});const n=e.dividendYield!==null&&e.dividendYield!==void 0?`${e.dividendYield.toFixed(2)}%`:"—",r=ae(e.marketCap);t.innerHTML=`
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
          ${y("Empresa",p(e.name||"N/A"))}
          ${y("Setor",p(e.sectorName||e.sector||"N/A"))}
          ${y("Subindústria",p(e.subIndustry||"N/A"))}
          ${y("Sede",p(e.headquarters||"N/A"))}
          ${y("Market Cap",r)}
          ${y("Classificação",p(e.marketCapClassification||"N/A"))}
          ${y("Div. Yield",n)}
          ${y("Paga dividendos",e.hasDividend?p(e.hasDividend):"—")}
          ${y("Data de inclusão",p(e.dateAdded||"N/A"))}
          ${y("CIK",e.cik?p(String(e.cik)):"N/A")}
          ${y("Fundação",p(e.founded||"N/A"))}
        </div>
        <div class="modal-footer">
          <button class="modal-action" id="details-chart-btn">📈 Ver histórico de preços</button>
        </div>
      </div>
    </div>
  `,document.body.appendChild(t),t.querySelector(".modal-close").addEventListener("click",a),t.querySelector("#details-chart-btn").addEventListener("click",()=>{ne(e.symbol,e.name)})}let C=[],k=[],g=1,M="dashboard";const F=50;let E=new Set,b,$,z,T,A,f,w,D,v;function Ce(){const e=localStorage.getItem("sp500-theme"),t=window.matchMedia("(prefers-color-scheme: light)").matches,a=e||(t?"light":"dark");document.documentElement.setAttribute("data-theme",a);const n=document.getElementById("theme-toggle");n&&(n.textContent=a==="light"?"🌙":"☀️",n.addEventListener("click",()=>{const o=document.documentElement.getAttribute("data-theme")==="light"?"dark":"light";document.documentElement.setAttribute("data-theme",o),localStorage.setItem("sp500-theme",o),n.textContent=o==="light"?"🌙":"☀️"}))}document.addEventListener("DOMContentLoaded",()=>{Ce(),b=document.getElementById("sector-filter"),$=document.getElementById("country-filter"),z=document.getElementById("search-input"),T=document.getElementById("dividend-min"),A=document.getElementById("sort-select"),f=document.getElementById("table-body"),w=document.getElementById("stats"),D=document.getElementById("pagination"),v=document.getElementById("header-checkbox"),document.querySelectorAll(".nav-tab").forEach(r=>{r.addEventListener("click",o=>{Le(o.target.dataset.tab)})}),b&&b.addEventListener("change",S),$&&$.addEventListener("change",S),z&&z.addEventListener("input",X(S,300)),T&&T.addEventListener("input",X(S,300)),A&&A.addEventListener("change",S),v&&v.addEventListener("change",()=>{f.querySelectorAll(".row-checkbox").forEach(o=>{o.checked=v.checked,o.dispatchEvent(new Event("change"))})});const e=document.getElementById("select-all"),t=document.getElementById("deselect-all"),a=document.getElementById("export-csv"),n=document.getElementById("export-json");e&&e.addEventListener("click",()=>{k.forEach(r=>E.add(r.symbol)),B(),P()}),t&&t.addEventListener("click",()=>{E.clear(),B(),P()}),a&&a.addEventListener("click",Ye),n&&n.addEventListener("click",je),re(),se(),Se()});function Le(e){M=e,re(),se()}function re(){const e=document.getElementById("dashboard-view"),t=document.getElementById("treemap-view"),a=document.getElementById("heatmap-view"),n=document.getElementById("bubble-chart-view");e&&(e.style.display="none"),t&&(t.style.display="none"),a&&(a.style.display="none"),n&&(n.style.display="none"),M==="dashboard"?e&&(e.style.display="block"):M==="treemap"?(t&&(t.style.display="block"),ve()):M==="heatmap"?(a&&(a.style.display="block"),ye()):M==="bubble"&&(n&&(n.style.display="block"),xe())}function se(){document.querySelectorAll(".nav-tab").forEach(t=>{t.classList.remove("active"),t.dataset.tab===M&&t.classList.add("active")})}async function Se(){w&&(w.textContent="Carregando dados...");try{const e=await Y();C=e.flatMap(a=>a.companies);const t=document.getElementById("freshness-badge");t&&ee(t,De(e)),Ne(),Fe(),S(),P(),Te()}catch(e){console.error("Erro ao carregar dados:",e),w&&(w.textContent="Erro ao carregar dados. Tente novamente.");const t=document.getElementById("freshness-badge");t&&ee(t,null)}}const Z={bullish:{label:"🚀 Otimista",cls:"mood-up"},bearish:{label:"⚠️ Pessimista",cls:"mood-down"},neutral:{label:"➖ Neutro",cls:"mood-flat"}};function Me(e){const t=String(e||"").split("-");return t.length<3?e||"":`${t[2]}/${t[1]}/${t[0]}`}function de(e){const t=Number(e);return Number.isNaN(t)?"—":`${t>0?"+":""}${t.toFixed(2)}%`}function Q(e){return`
    <div class="summary-row">
      <span class="mini-symbol">${p(e.symbol)}</span>
      <button class="mini-name" data-symbol="${p(e.symbol)}" title="Ver detalhes">${p(e.name)}</button>
      <strong class="mini-change ${e.changePct>=0?"positive":"negative"}">${de(e.changePct)}</strong>
    </div>
  `}function ze(e){const t=Z[e.marketMood]||Z.neutral,a=e.stats||{},n=e.topGainers||[],r=e.topLosers||[],o=e.sectorPerformance||[],s=e.generatedAt?e.generatedAt.split(" ")[1]:"";return`
    <div class="summary-head">
      <div>
        <h2 class="summary-title">🔄 Resumo do Dia</h2>
        <span class="summary-date">Pregão de ${Me(e.referenceDate)} · Atualizado às ${s} UTC</span>
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
        ${n.length?n.map(Q).join(""):'<p class="summary-empty">Sem dados</p>'}
      </div>
      <div class="summary-list">
        <h3 class="summary-list-title negative">▼ Maiores Baixas</h3>
        ${r.length?r.map(Q).join(""):'<p class="summary-empty">Sem dados</p>'}
      </div>
    </div>
    <div class="summary-sectors">
      ${o.map(i=>`
        <span class="sector-chip ${i.avgChangePct>=0?"chip-up":"chip-down"}">
          <span class="sector-chip-name">${p(i.name)}</span>
          <strong>${de(i.avgChangePct)}</strong>
        </span>`).join("")}
    </div>
  `}async function Te(){const e=document.getElementById("daily-summary");if(e)try{const t=await ge();if(!t)throw new Error("Sem dados");e.style.display="",e.innerHTML=ze(t),e.querySelectorAll(".mini-name").forEach(a=>{a.addEventListener("click",()=>{const n=C.find(r=>r.symbol===a.dataset.symbol);n&&ie(n)})})}catch(t){console.error("Resumo do dia indisponível:",t),e.style.display="none"}}const Ae=864e5;function Be(e){if(!e)return null;const t=String(e).trim(),a=t.length===10?new Date(`${t}T00:00:00Z`):new Date(t);return Number.isNaN(a.getTime())?null:a.getTime()}function De(e){let t=null;return e.forEach(a=>{const n=Be(a.lastUpdated);n&&(!t||n>t)&&(t=n)}),t}function Ie(e,t){const a=Math.floor(Math.max(0,t-e)/6e4);if(a<1)return"atualizado agora";if(a<60)return`atualizado há ${a} min`;const n=new Date(e).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"}),r=Math.floor(a/1440);if(r<1)return`atualizado hoje às ${n}`;if(r<2)return`atualizado ontem às ${n}`;const o=new Date(e).toLocaleDateString("pt-BR");return r>=8?`desatualizado há ${r} dias (${o})`:`atualizado há ${r} dias (${o})`}function ee(e,t){const a=e.querySelector("#freshness-text");if(!t){e.className="freshness-badge fd-unknown",a.textContent="sem dados de atualização",e.title="Sem registro de atualização dos dados";return}const n=(Date.now()-t)/Ae;e.className="freshness-badge ",n<2?e.classList.add("fd-fresh"):n<=7?e.classList.add("fd-aging"):e.classList.add("fd-stale"),a.textContent=Ie(t,Date.now()),e.title=`Última atualização dos dados: ${new Date(t).toLocaleString("pt-BR")}`}function Ne(){b&&(b.innerHTML='<option value="">Todos os Setores</option>',K.forEach(e=>{const t=document.createElement("option");t.value=e.id,t.textContent=e.name,b.appendChild(t)}))}function Fe(){if(!$)return;const e=[...new Set(C.map(t=>oe(t.headquarters)))].filter(Boolean).sort((t,a)=>t.localeCompare(a));$.innerHTML='<option value="">Todos os Países</option>',e.forEach(t=>{const a=document.createElement("option");a.value=t,a.textContent=t,$.appendChild(a)})}function S(){const e=(b==null?void 0:b.value)||"",t=($==null?void 0:$.value)||"",a=(z==null?void 0:z.value)||"",n=(T==null?void 0:T.value)||"",r=(A==null?void 0:A.value)||"symbol-asc";k=we($e(C,{sector:e,country:t,search:a,dividendMin:n}),r),g=1,E.clear(),v&&(v.checked=!1),B(),N(),P()}function B(){if(!f)return;const e=(g-1)*F,t=e+F,a=k.slice(e,t);if(a.length===0){f.innerHTML=`
      <tr>
        <td colspan="10" class="table-message" style="color: var(--text-secondary);">
          Nenhuma empresa encontrada
        </td>
      </tr>
    `;return}f.innerHTML=a.map((n,r)=>{const o=e+r+1,s=E.has(n.symbol),i=ae(n.marketCap),d=n.dividendYield!==null&&n.dividendYield!==void 0?`${n.dividendYield.toFixed(2)}%`:"—",l=n.dividendYield!==null&&n.dividendYield!==void 0?"positive":"none";return`
      <tr data-symbol="${n.symbol}" class="${s?"selected":""}">
        <td><input type="checkbox" class="row-checkbox" ${s?"checked":""}></td>
        <td>${o}</td>
        <td class="symbol">${n.symbol}</td>
        <td class="company-name" title="Ver detalhes">${p(n.name)}</td>
        <td>${p(n.sectorName)}</td>
        <td class="market-cap">${i}</td>
        <td>${p(n.subIndustry||"N/A")}</td>
        <td>${p(n.headquarters||"N/A")}</td>
        <td class="dividend ${l}">${d}</td>
        <td><button class="price-btn" data-symbol="${n.symbol}" data-name="${p(n.name)}" title="Ver histórico de preços">📈</button></td>
      </tr>
    `}).join(""),He(),Pe(),le()}function Pe(){f&&f.querySelectorAll(".price-btn").forEach(e=>{e.addEventListener("click",t=>{t.stopPropagation(),ne(e.dataset.symbol,e.dataset.name)})})}function He(){f&&(f.querySelectorAll(".row-checkbox").forEach(e=>{e.addEventListener("change",t=>{const a=t.target.closest("tr"),n=a.dataset.symbol;t.target.checked?(E.add(n),a.classList.add("selected")):(E.delete(n),a.classList.remove("selected")),le()})}),f.querySelectorAll("tr[data-symbol]").forEach(e=>{e.addEventListener("click",t=>{if(t.target.type==="checkbox"||t.target.closest(".price-btn")||t.target.closest(".company-name"))return;const a=e.querySelector(".row-checkbox");a.checked=!a.checked,a.dispatchEvent(new Event("change"))})}),f.querySelectorAll(".company-name").forEach(e=>{e.addEventListener("click",t=>{var r;t.stopPropagation();const a=(r=e.closest("tr"))==null?void 0:r.dataset.symbol;if(!a)return;const n=k.find(o=>o.symbol===a)||C.find(o=>o.symbol===a);n&&ie(n)})}))}function le(){if(!v||!f)return;const e=f.querySelectorAll(".row-checkbox"),t=f.querySelectorAll(".row-checkbox:checked").length;t===0?(v.indeterminate=!1,v.checked=!1):t===e.length?(v.indeterminate=!1,v.checked=!0):v.indeterminate=!0}function N(){var o,s;if(!D)return;const e=Math.ceil(k.length/F);if(e<=1){D.innerHTML="";return}let t="";t+=`<button id="prev-page" ${g===1?"disabled":""}>« Anterior</button>`;const a=5;let n=Math.max(1,g-Math.floor(a/2)),r=Math.min(e,n+a-1);r-n+1<a&&(n=Math.max(1,r-a+1)),n>1&&(t+='<button data-page="1">1</button>',n>2&&(t+='<span class="ellipsis">…</span>'));for(let i=n;i<=r;i++)t+=`<button data-page="${i}" class="${i===g?"active":""}">${i}</button>`;r<e&&(r<e-1&&(t+='<span class="ellipsis">…</span>'),t+=`<button data-page="${e}">${e}</button>`),t+=`<button id="next-page" ${g===e?"disabled":""}>Próxima »</button>`,t+=`<span class="pagination-info">Página ${g} de ${e} (${k.length} empresas)</span>`,D.innerHTML=t,D.querySelectorAll("button[data-page]").forEach(i=>{i.addEventListener("click",()=>{g=parseInt(i.dataset.page),B(),N(),window.scrollTo({top:0,behavior:"smooth"})})}),(o=document.getElementById("prev-page"))==null||o.addEventListener("click",()=>{g>1&&(g--,B(),N(),window.scrollTo({top:0,behavior:"smooth"}))}),(s=document.getElementById("next-page"))==null||s.addEventListener("click",()=>{const i=Math.ceil(k.length/F);g<i&&(g++,B(),N(),window.scrollTo({top:0,behavior:"smooth"}))})}function P(){if(!w)return;const e=C.length,t=k.length,a=E.size;t===e?w.textContent=`${e} empresas no total`:w.textContent=`${t} de ${e} empresas | ${a} selecionada(s)`}function ce(){return C.filter(e=>E.has(e.symbol))}function Ye(){const e=ce();if(e.length===0){alert("Nenhuma empresa selecionada");return}const t=["Símbolo","Empresa","Setor","Subindústria","Sede","Market Cap","Dividend Yield","Data Inclusão","CIK","Fundação"],a=e.map(r=>[r.symbol,`"${r.name}"`,r.sectorName,`"${r.subIndustry||""}"`,`"${r.headquarters||""}"`,r.marketCap||"",r.dividendYield!==null&&r.dividendYield!==void 0?r.dividendYield.toFixed(2):"",r.dateAdded||"",r.cik||"",r.founded||""]),n=[t.join(","),...a.map(r=>r.join(","))].join(`
`);pe(n,"sp500-selecao.csv","text/csv")}function je(){const e=ce();if(e.length===0){alert("Nenhuma empresa selecionada");return}const t=JSON.stringify(e,null,2);pe(t,"sp500-selecao.json","application/json")}function pe(e,t,a){const n=new Blob([e],{type:a}),r=URL.createObjectURL(n),o=document.createElement("a");o.href=r,o.download=t,document.body.appendChild(o),o.click(),document.body.removeChild(o),URL.revokeObjectURL(r)}
