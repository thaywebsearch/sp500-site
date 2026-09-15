(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))a(t);new MutationObserver(t=>{for(const n of t)if(n.type==="childList")for(const s of n.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&a(s)}).observe(document,{childList:!0,subtree:!0});function r(t){const n={};return t.integrity&&(n.integrity=t.integrity),t.referrerPolicy&&(n.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?n.credentials="include":t.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function a(t){if(t.ep)return;t.ep=!0;const n=r(t);fetch(t.href,n)}})();const w=window.location.hostname==="localhost"?"http://localhost:5001":"https://sp500-site-production.up.railway.app",j=[{id:"communication-services",name:"Communication Services"},{id:"consumer-discretionary",name:"Consumer Discretionary"},{id:"consumer-staples",name:"Consumer Staples"},{id:"energy",name:"Energy"},{id:"financials",name:"Financials"},{id:"health-care",name:"Health Care"},{id:"industrials",name:"Industrials"},{id:"information-technology",name:"Information Technology"},{id:"materials",name:"Materials"},{id:"real-estate",name:"Real Estate"},{id:"utilities",name:"Utilities"}];async function _(){const e=document.getElementById("treemap-view");if(e){e.style.display="flex",e.style.flexDirection="column",e.style.height="100%",e.style.width="100%",e.style.margin="0",e.style.padding="0",e.style.background="var(--bg-primary)",e.innerHTML='<div style="display:flex;align-items:center;justify-content:center;height:100%;width:100%;font-size:14px;color:var(--text-secondary)">Carregando setores...</div>';try{const a=(await(await fetch(`${w}/api/setores`)).json()).setores||[],t=await Promise.all(a.map(async c=>{var u;const l=await(await fetch(`${w}/api/setor/${c}`)).json(),i=j.find(k=>k.id===c),p=((u=l.dados)==null?void 0:u.companies)||[],f=p.reduce((k,T)=>k+(T.marketCap||0),0),x=p.length>0?p.reduce((k,T)=>k+(T.dividendYield||0),0)/p.length:0;return{id:c,name:(i==null?void 0:i.name)||c,value:f,companies:p.length,avgDiv:parseFloat(x.toFixed(2)),topCompany:p.length>0?p[0].symbol:"N/A"}})),n=t.reduce((c,m)=>c+m.value,0),s=["#00d4ff","#00e676","#ffab00","#ff5252","#8bc34a","#4caf50","#2196f3","#9c27b0","#ff9800","#f44336","#00bcd4"];let d=`
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
    `;t.forEach((c,m)=>{const l=s[m%s.length],i=(c.value/n*100).toFixed(1),p=(c.value/1e9).toFixed(1);d+=`
        <div style="
          background: linear-gradient(135deg, ${l}22 0%, ${l}11 100%);
          border: 1px solid ${l}33;
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
        onmouseover="this.style.transform='translateY(-4px)';this.style.boxShadow='0 8px 24px ${l}22'"
        onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='none'"
        >
          <div>
            <div style="
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 1px;
              color: ${l};
              font-weight: 600;
              margin-bottom: 8px;
            ">${i}%</div>
            <div style="
              font-size: 18px;
              font-weight: 600;
              color: var(--text-primary);
              margin-bottom: 4px;
            ">${c.name}</div>
            <div style="
              font-size: 13px;
              color: var(--text-secondary);
            ">${c.companies} empresas</div>
          </div>
          
          <div style="
            border-top: 1px solid ${l}22;
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
                color: ${l};
              ">$${p}B</div>
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
              ">${c.topCompany}</div>
            </div>
          </div>
        </div>
      `}),d+="</div>",e.innerHTML=d}catch{e.innerHTML='<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--accent-red)">Erro ao carregar setores</div>'}}}async function K(){const e=document.getElementById("heatmap-view");if(e){e.style.display="flex",e.style.flexDirection="column",e.style.height="100%",e.style.width="100%",e.style.margin="0",e.style.padding="0",e.style.background="var(--bg-primary)",e.innerHTML='<div style="display:flex;align-items:center;justify-content:center;height:100%;width:100%;font-size:14px;color:var(--text-secondary)">Carregando heatmap...</div>';try{let s=function(i,p){const f=i/p*100;return f>=80?"#ff5252":f>=60?"#ff9800":f>=40?"#ffeb3b":f>=20?"#8bc34a":"#4caf50"};var o=s;const t=(await(await fetch(`${w}/api/setores`)).json()).setores||[],n=await Promise.all(t.map(async i=>{var N;const f=await(await fetch(`${w}/api/setor/${i}`)).json(),x=j.find(E=>E.id===i),u=((N=f.dados)==null?void 0:N.companies)||[],k=u.reduce((E,Y)=>E+(Y.marketCap||0),0),T=u.length>0?u.reduce((E,Y)=>E+(Y.dividendYield||0),0)/u.length:0,J=u.filter(E=>E.hasDividend==="Sim").length;return{name:(x==null?void 0:x.name)||i,cap:(k/1e9).toFixed(1),companies:u.length,avgDiv:parseFloat(T.toFixed(2)),withDiv:J}})),d=Math.max(...n.map(i=>parseFloat(i.cap))),c=Math.max(...n.map(i=>i.avgDiv)),m=Math.max(...n.map(i=>i.companies));let l=`
      <div style="
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%;
        padding: 40px;
        box-sizing: border-box;
        overflow-y: auto;
      ">
        <div style="
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
          gap: 12px;
          margin-bottom: 20px;
        ">
          <div style="
            padding: 16px;
            background: rgba(0, 212, 255, 0.1);
            border: 1px solid rgba(0, 212, 255, 0.2);
            border-radius: 8px;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: var(--accent-cyan);
            font-weight: 600;
          ">Setor</div>
          <div style="
            padding: 16px;
            background: rgba(0, 212, 255, 0.1);
            border: 1px solid rgba(0, 212, 255, 0.2);
            border-radius: 8px;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: var(--accent-cyan);
            font-weight: 600;
            text-align: center;
          ">Market Cap (B)</div>
          <div style="
            padding: 16px;
            background: rgba(0, 212, 255, 0.1);
            border: 1px solid rgba(0, 212, 255, 0.2);
            border-radius: 8px;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: var(--accent-cyan);
            font-weight: 600;
            text-align: center;
          ">Empresas</div>
          <div style="
            padding: 16px;
            background: rgba(0, 212, 255, 0.1);
            border: 1px solid rgba(0, 212, 255, 0.2);
            border-radius: 8px;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: var(--accent-cyan);
            font-weight: 600;
            text-align: center;
          ">Avg Div %</div>
          <div style="
            padding: 16px;
            background: rgba(0, 212, 255, 0.1);
            border: 1px solid rgba(0, 212, 255, 0.2);
            border-radius: 8px;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: var(--accent-cyan);
            font-weight: 600;
            text-align: center;
          ">Com Div</div>
        </div>
        
        <div style="
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
          gap: 12px;
          flex: 1;
        ">
    `;n.forEach(i=>{const p=s(parseFloat(i.cap),d),f=s(i.companies,m),x=s(i.avgDiv,c),u=s(i.withDiv,i.companies);l+=`
        <div style="
          padding: 16px;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 8px;
          display: flex;
          align-items: center;
          color: var(--text-primary);
          font-weight: 500;
          font-size: 14px;
          transition: all 0.3s ease;
          cursor: pointer;
        "
        onmouseover="this.style.borderColor='var(--accent-cyan)';this.style.background='rgba(0,212,255,0.05)'"
        onmouseout="this.style.borderColor='var(--border)';this.style.background='var(--bg-secondary)'"
        >${i.name}</div>
        
        <div style="
          padding: 16px;
          background: ${p}22;
          border: 1px solid ${p}44;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${p};
          font-weight: 700;
          font-size: 16px;
          transition: all 0.3s ease;
          cursor: pointer;
        "
        onmouseover="this.style.boxShadow='0 0 16px ${p}44';this.style.transform='scale(1.05)'"
        onmouseout="this.style.boxShadow='none';this.style.transform='scale(1)'"
        >$${i.cap}</div>
        
        <div style="
          padding: 16px;
          background: ${f}22;
          border: 1px solid ${f}44;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${f};
          font-weight: 700;
          font-size: 16px;
          transition: all 0.3s ease;
          cursor: pointer;
        "
        onmouseover="this.style.boxShadow='0 0 16px ${f}44';this.style.transform='scale(1.05)'"
        onmouseout="this.style.boxShadow='none';this.style.transform='scale(1)'"
        >${i.companies}</div>
        
        <div style="
          padding: 16px;
          background: ${x}22;
          border: 1px solid ${x}44;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${x};
          font-weight: 700;
          font-size: 16px;
          transition: all 0.3s ease;
          cursor: pointer;
        "
        onmouseover="this.style.boxShadow='0 0 16px ${x}44';this.style.transform='scale(1.05)'"
        onmouseout="this.style.boxShadow='none';this.style.transform='scale(1)'"
        >${i.avgDiv}%</div>
        
        <div style="
          padding: 16px;
          background: ${u}22;
          border: 1px solid ${u}44;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${u};
          font-weight: 700;
          font-size: 16px;
          transition: all 0.3s ease;
          cursor: pointer;
        "
        onmouseover="this.style.boxShadow='0 0 16px ${u}44';this.style.transform='scale(1.05)'"
        onmouseout="this.style.boxShadow='none';this.style.transform='scale(1)'"
        >${i.withDiv}/${i.companies}</div>
      `}),l+=`
        </div>
        
        <div style="
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 16px;
          margin-top: 40px;
          padding-top: 40px;
          border-top: 1px solid var(--border);
        ">
          <div style="text-align: center;">
            <div style="width: 24px; height: 24px; background: #4caf50; border-radius: 4px; margin: 0 auto 8px;"></div>
            <div style="font-size: 12px; color: var(--text-secondary);">Baixo (&lt;20%)</div>
          </div>
          <div style="text-align: center;">
            <div style="width: 24px; height: 24px; background: #8bc34a; border-radius: 4px; margin: 0 auto 8px;"></div>
            <div style="font-size: 12px; color: var(--text-secondary);">Baixo-Médio (20-40%)</div>
          </div>
          <div style="text-align: center;">
            <div style="width: 24px; height: 24px; background: #ffeb3b; border-radius: 4px; margin: 0 auto 8px;"></div>
            <div style="font-size: 12px; color: var(--text-secondary);">Médio (40-60%)</div>
          </div>
          <div style="text-align: center;">
            <div style="width: 24px; height: 24px; background: #ff9800; border-radius: 4px; margin: 0 auto 8px;"></div>
            <div style="font-size: 12px; color: var(--text-secondary);">Alto (60-80%)</div>
          </div>
          <div style="text-align: center;">
            <div style="width: 24px; height: 24px; background: #ff5252; border-radius: 4px; margin: 0 auto 8px;"></div>
            <div style="font-size: 12px; color: var(--text-secondary);">Muito Alto (&gt;80%)</div>
          </div>
        </div>
      </div>
    `,e.innerHTML=l}catch{e.innerHTML='<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--accent-red)">Erro ao carregar heatmap</div>'}}}async function G(){const e=document.getElementById("bubble-chart-view");if(e){e.innerHTML='<div class="loading"><div class="spinner"></div><p>Carregando...</p></div>';try{const a=(await(await fetch(`${w}/api/setores`)).json()).setores||[],t=await Promise.all(a.map(async n=>{var l;const d=await(await fetch(`${w}/api/setor/${n}`)).json(),c=j.find(i=>i.id===n),m=((l=d.dados)==null?void 0:l.companies)||[];return{name:(c==null?void 0:c.name)||n,cap:m.reduce((i,p)=>i+(p.marketCap||0),0)/1e9,count:m.length,color:Math.random()*16777215}}));e.innerHTML='<div class="bubble-chart-container"><h2>🫧 Bubble Chart</h2><div style="padding:20px;background:var(--bg-secondary);border-radius:8px">'+t.map(n=>`<div style="padding:10px;margin:5px;background:#${Math.floor(n.color).toString(16).padStart(6,"0")};color:white;border-radius:4px">${n.name}: $${n.cap.toFixed(1)}B (${n.count} empresas)</div>`).join("")+"</div></div>"}catch(o){e.innerHTML="Erro ao carregar: "+o.message}}}function Z(e){return e?e>=1e12?`$${(e/1e12).toFixed(2)}T`:e>=1e9?`$${(e/1e9).toFixed(2)}B`:e>=1e6?`$${(e/1e6).toFixed(2)}M`:`$${e.toLocaleString("en-US")}`:"N/A"}function z(e){return e?String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;"):""}function Q(e,o){let r;return(...a)=>{clearTimeout(r),r=setTimeout(()=>e.apply(this,a),o)}}function W(e,{sector:o="",search:r=""}={}){let a=[...e];const t=r.toLowerCase().trim();return o&&(a=a.filter(n=>n.sector===o)),t&&(a=a.filter(n=>n.symbol.toLowerCase().includes(t)||n.name.toLowerCase().includes(t)||n.subIndustry&&n.subIndustry.toLowerCase().includes(t)||n.headquarters&&n.headquarters.toLowerCase().includes(t))),a}function X(e,o="symbol-asc"){const r=[...e];return r.sort((a,t)=>{switch(o){case"marketCap-desc":return(t.marketCap||0)-(a.marketCap||0);case"marketCap-asc":return(a.marketCap||0)-(t.marketCap||0);case"symbol-asc":return a.symbol.localeCompare(t.symbol);case"name-asc":return a.name.localeCompare(t.name);case"dividendYield-desc":return(t.dividendYield||0)-(a.dividendYield||0);default:return 0}}),r}let H=[],C=[],g=1,L="dashboard";const F=50;let $=new Set,y,S,B,v,b,I,h;document.addEventListener("DOMContentLoaded",()=>{y=document.getElementById("sector-filter"),S=document.getElementById("search-input"),B=document.getElementById("sort-select"),v=document.getElementById("table-body"),b=document.getElementById("stats"),I=document.getElementById("pagination"),h=document.getElementById("header-checkbox"),document.querySelectorAll(".nav-tab").forEach(t=>{t.addEventListener("click",n=>{ee(n.target.dataset.tab)})}),y&&y.addEventListener("change",A),S&&S.addEventListener("input",Q(A,300)),B&&B.addEventListener("change",A),h&&h.addEventListener("change",()=>{v.querySelectorAll(".row-checkbox").forEach(n=>{n.checked=h.checked,n.dispatchEvent(new Event("change"))})});const e=document.getElementById("select-all"),o=document.getElementById("deselect-all"),r=document.getElementById("export-csv"),a=document.getElementById("export-json");e&&e.addEventListener("click",()=>{C.forEach(t=>$.add(t.symbol)),M(),P()}),o&&o.addEventListener("click",()=>{$.clear(),M(),P()}),r&&r.addEventListener("click",ne),a&&a.addEventListener("click",re),q(),O(),te()});function ee(e){L=e,q(),O()}function q(){const e=document.getElementById("dashboard-view"),o=document.getElementById("treemap-view"),r=document.getElementById("heatmap-view"),a=document.getElementById("bubble-chart-view");e&&(e.style.display="none"),o&&(o.style.display="none"),r&&(r.style.display="none"),a&&(a.style.display="none"),L==="dashboard"?e&&(e.style.display="block"):L==="treemap"?(o&&(o.style.display="block"),_()):L==="heatmap"?(r&&(r.style.display="block"),K()):L==="bubble"&&(a&&(a.style.display="block"),G())}function O(){document.querySelectorAll(".nav-tab").forEach(o=>{o.classList.remove("active"),o.dataset.tab===L&&o.classList.add("active")})}async function te(){b&&(b.textContent="Carregando dados...");try{const e=await fetch(`${w}/api/setores`);if(!e.ok)throw new Error("Erro ao buscar setores");const a=((await e.json()).setores||[]).map(async n=>{try{const s=await fetch(`${w}/api/setor/${n}`);if(!s.ok)throw new Error(`HTTP ${s.status}`);const d=await s.json(),c=j.find(l=>l.id===n),m=c?c.name:n;return d.dados&&d.dados.companies&&Array.isArray(d.dados.companies)?d.dados.companies.map(l=>({...l,sector:n,sectorName:m})):[]}catch(s){return console.error(`Erro ao carregar ${n}:`,s),[]}});H=(await Promise.all(a)).flat(),oe(),A(),P()}catch(e){console.error("Erro ao carregar dados:",e),b&&(b.textContent="Erro ao carregar dados. Tente novamente.")}}function oe(){y&&(y.innerHTML='<option value="">Todos os Setores</option>',j.forEach(e=>{const o=document.createElement("option");o.value=e.id,o.textContent=e.name,y.appendChild(o)}))}function A(){const e=(y==null?void 0:y.value)||"",o=(S==null?void 0:S.value)||"",r=(B==null?void 0:B.value)||"symbol-asc";C=X(W(H,{sector:e,search:o}),r),g=1,$.clear(),h&&(h.checked=!1),M(),D(),P()}function M(){if(!v)return;const e=(g-1)*F,o=e+F,r=C.slice(e,o);if(r.length===0){v.innerHTML=`
      <tr>
        <td colspan="9" style="text-align: center; padding: 3rem; color: var(--text-muted);">
          Nenhuma empresa encontrada
        </td>
      </tr>
    `;return}v.innerHTML=r.map((a,t)=>{const n=e+t+1,s=$.has(a.symbol),d=Z(a.marketCap),c=a.dividendYield!==null&&a.dividendYield!==void 0?`${a.dividendYield.toFixed(2)}%`:"—",m=a.dividendYield!==null&&a.dividendYield!==void 0?"positive":"none";return`
      <tr data-symbol="${a.symbol}" class="${s?"selected":""}">
        <td><input type="checkbox" class="row-checkbox" ${s?"checked":""}></td>
        <td>${n}</td>
        <td class="symbol">${a.symbol}</td>
        <td>${z(a.name)}</td>
        <td>${z(a.sectorName)}</td>
        <td class="market-cap">${d}</td>
        <td>${z(a.subIndustry||"N/A")}</td>
        <td>${z(a.headquarters||"N/A")}</td>
        <td class="dividend ${m}">${c}</td>
      </tr>
    `}).join(""),ae(),R()}function ae(){v&&(v.querySelectorAll(".row-checkbox").forEach(e=>{e.addEventListener("change",o=>{const r=o.target.closest("tr"),a=r.dataset.symbol;o.target.checked?($.add(a),r.classList.add("selected")):($.delete(a),r.classList.remove("selected")),R()})}),v.querySelectorAll("tr[data-symbol]").forEach(e=>{e.addEventListener("click",o=>{if(o.target.type==="checkbox")return;const r=e.querySelector(".row-checkbox");r.checked=!r.checked,r.dispatchEvent(new Event("change"))})}))}function R(){if(!h||!v)return;const e=v.querySelectorAll(".row-checkbox"),o=v.querySelectorAll(".row-checkbox:checked").length;o===0?(h.indeterminate=!1,h.checked=!1):o===e.length?(h.indeterminate=!1,h.checked=!0):h.indeterminate=!0}function D(){var n,s;if(!I)return;const e=Math.ceil(C.length/F);if(e<=1){I.innerHTML="";return}let o="";o+=`<button id="prev-page" ${g===1?"disabled":""}>« Anterior</button>`;const r=5;let a=Math.max(1,g-Math.floor(r/2)),t=Math.min(e,a+r-1);t-a+1<r&&(a=Math.max(1,t-r+1)),a>1&&(o+='<button data-page="1">1</button>',a>2&&(o+='<span class="ellipsis">…</span>'));for(let d=a;d<=t;d++)o+=`<button data-page="${d}" class="${d===g?"active":""}">${d}</button>`;t<e&&(t<e-1&&(o+='<span class="ellipsis">…</span>'),o+=`<button data-page="${e}">${e}</button>`),o+=`<button id="next-page" ${g===e?"disabled":""}>Próxima »</button>`,o+=`<span class="pagination-info">Página ${g} de ${e} (${C.length} empresas)</span>`,I.innerHTML=o,I.querySelectorAll("button[data-page]").forEach(d=>{d.addEventListener("click",()=>{g=parseInt(d.dataset.page),M(),D(),window.scrollTo({top:0,behavior:"smooth"})})}),(n=document.getElementById("prev-page"))==null||n.addEventListener("click",()=>{g>1&&(g--,M(),D(),window.scrollTo({top:0,behavior:"smooth"}))}),(s=document.getElementById("next-page"))==null||s.addEventListener("click",()=>{const d=Math.ceil(C.length/F);g<d&&(g++,M(),D(),window.scrollTo({top:0,behavior:"smooth"}))})}function P(){if(!b)return;const e=H.length,o=C.length,r=$.size;o===e?b.textContent=`${e} empresas no total`:b.textContent=`${o} de ${e} empresas | ${r} selecionada(s)`}function V(){return H.filter(e=>$.has(e.symbol))}function ne(){const e=V();if(e.length===0){alert("Nenhuma empresa selecionada");return}const o=["Símbolo","Empresa","Setor","Subindústria","Sede","Market Cap","Dividend Yield","Data Inclusão","CIK","Fundação"],r=e.map(t=>[t.symbol,`"${t.name}"`,t.sectorName,`"${t.subIndustry||""}"`,`"${t.headquarters||""}"`,t.marketCap||"",t.dividendYield!==null&&t.dividendYield!==void 0?t.dividendYield.toFixed(2):"",t.dateAdded||"",t.cik||"",t.founded||""]),a=[o.join(","),...r.map(t=>t.join(","))].join(`
`);U(a,"sp500-selecao.csv","text/csv")}function re(){const e=V();if(e.length===0){alert("Nenhuma empresa selecionada");return}const o=JSON.stringify(e,null,2);U(o,"sp500-selecao.json","application/json")}function U(e,o,r){const a=new Blob([e],{type:r}),t=URL.createObjectURL(a),n=document.createElement("a");n.href=t,n.download=o,document.body.appendChild(n),n.click(),document.body.removeChild(n),URL.revokeObjectURL(t)}
