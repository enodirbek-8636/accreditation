/* =====================================================================
   NQAAE monitoring — MOBIL INTERFEYS MANTIGʻI
   (faqat 1023 px va undan kichik ekranlarda faollashadi; desktopda hech
   narsa oʻzgarmaydi — bir xil maʼlumot, hisob va filtrlar)
   ===================================================================== */
(function(){
"use strict";
const MQ = window.matchMedia('(max-width:1023px)');
const PHONE = window.matchMedia('(max-width:767px)');
const isMobile = () => MQ.matches;
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const T = k => {
  const l = window.I18N ? I18N.lang : 'uz';
  const d = {
    menu:{uz:'Asosiy boʻlimlar',ru:'Основные разделы',en:'Main sections'}, open:{uz:'Menyuni ochish',ru:'Открыть меню',en:'Open menu'}, close:{uz:'Yopish',ru:'Закрыть',en:'Close'},
    more:{uz:'Qoʻshimcha amallar',ru:'Дополнительные действия',en:'More actions'}, filters:{uz:'Filtrlar',ru:'Фильтры',en:'Filters'}, apply:{uz:'Qoʻllash',ru:'Применить',en:'Apply'}, clear:{uz:'Tozalash',ru:'Сбросить',en:'Clear'},
    more2:{uz:'Batafsil ›',ru:'Подробнее ›',en:'Details ›'}, expand:{uz:'Kattalashtirish',ru:'Увеличить',en:'Expand'}, refresh:{uz:'Maʼlumotlarni yangilash',ru:'Обновить данные',en:'Refresh data'}, download:{uz:'Hisobotni yuklab olish',ru:'Скачать отчёт',en:'Download report'}, date:{uz:'Joriy sana',ru:'Текущая дата',en:'Current date'}, sort:{uz:'Saralash:',ru:'Сортировка:',en:'Sort:'}
  }[k]; return d ? (d[l]||d.uz) : k;
};

/* ---------------- 1. Sarlavha: gamburger, qoʻshimcha menyu, tortma ---------------- */
function mountHeader(){
  if(document.getElementById('mBurger')) return;
  const header = $('.app-header'); const left = header && header.querySelector(':scope > div:first-child'); const actions = $('.header-actions');
  if(!header||!actions) return;
  const burger = document.createElement('button'); burger.id='mBurger'; burger.className='m-burger'; burger.type='button'; burger.setAttribute('aria-controls','mainSidebar'); burger.setAttribute('aria-expanded','false'); burger.setAttribute('data-i18n-skip','');
  burger.innerHTML='<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
  left.insertBefore(burger, left.firstChild);
  const more = document.createElement('button'); more.id='mMore'; more.className='m-more'; more.type='button'; more.setAttribute('aria-haspopup','menu'); more.setAttribute('aria-expanded','false'); more.setAttribute('data-i18n-skip','');
  more.innerHTML='<svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="2.2"/><circle cx="12" cy="12" r="2.2"/><circle cx="19" cy="12" r="2.2"/></svg>';
  actions.appendChild(more);
  const scrim = document.createElement('div'); scrim.className='m-scrim'; scrim.id='mScrim'; document.body.appendChild(scrim);
  const menu = document.createElement('div'); menu.className='m-more-menu'; menu.id='mMoreMenu'; menu.setAttribute('role','menu'); menu.setAttribute('data-i18n-skip',''); document.body.appendChild(menu);
  // tortma sarlavhasi
  const sb = $('#mainSidebar');
  if(sb && !sb.querySelector('.m-drawer-head')){ const h=document.createElement('div'); h.className='m-drawer-head'; h.setAttribute('data-i18n-skip',''); h.innerHTML=`<span></span><button type="button" aria-label="${T('close')}">✕</button>`; sb.insertBefore(h, sb.firstChild); h.querySelector('button').onclick=()=>nav(false); }
  const labels = ()=>{ burger.setAttribute('aria-label',T('open')); burger.title=T('open'); more.setAttribute('aria-label',T('more')); more.title=T('more'); const dh=sb&&sb.querySelector('.m-drawer-head span'); if(dh) dh.textContent=T('menu'); };
  labels(); document.addEventListener('i18n:change', ()=>{ labels(); menu.classList.remove('show'); });
  let lastFocus=null;
  function nav(open){
    if(!isMobile()) return;
    document.body.classList.toggle('m-nav-open', open); burger.setAttribute('aria-expanded', String(open));
    if(open){ lastFocus=document.activeElement; setTimeout(()=>{ const f=sb.querySelector('.mode-btn.active')||sb.querySelector('button'); if(f) f.focus(); },60); history.pushState({mNav:1},''); }
    else { if(lastFocus&&lastFocus.focus) lastFocus.focus(); if(history.state&&history.state.mNav) history.back(); }
  }
  window.mNav = nav;
  burger.onclick=()=>nav(!document.body.classList.contains('m-nav-open'));
  scrim.onclick=()=>{ nav(false); closeSheets(); menu.classList.remove('show'); more.setAttribute('aria-expanded','false'); };
  window.addEventListener('popstate', ()=>{ if(document.body.classList.contains('m-nav-open')){ document.body.classList.remove('m-nav-open'); burger.setAttribute('aria-expanded','false'); } closeSheets(); });
  document.addEventListener('keydown', e=>{ if(e.key==='Escape'){ if(document.body.classList.contains('m-nav-open')) nav(false); if(menu.classList.contains('show')){ menu.classList.remove('show'); more.setAttribute('aria-expanded','false'); more.focus(); } closeSheets(); } });
  // boʻlim tanlanganda tortma yopiladi
  if(sb) sb.addEventListener('click', e=>{ const b=e.target.closest('.mode-btn,.nav-item'); if(b && isMobile()) setTimeout(()=>nav(false), 120); });
  // qoʻshimcha menyu
  const item=(label, icon, fn)=>{ const b=document.createElement('button'); b.type='button'; b.setAttribute('role','menuitem'); b.innerHTML=`<span aria-hidden="true">${icon}</span><span>${label}</span>`; b.onclick=()=>{ menu.classList.remove('show'); more.setAttribute('aria-expanded','false'); fn(); }; return b; };
  function buildMenu(){
    menu.innerHTML='';
    const cd=$('#curDate'), ut=$('#updTime'); if(cd){ const m=document.createElement('div'); m.className='m-meta'; m.textContent=`${T('date')}: ${cd.textContent}${ut?' · '+ut.textContent:''}`; menu.appendChild(m); }
    const tb=$('#themeBtn'); if(tb) menu.appendChild(item(tb.textContent.trim(),'◐',()=>tb.click()));
    const fs=$('#fsBtn'); if(fs && document.fullscreenEnabled) menu.appendChild(item(fs.textContent.trim(),'⛶',()=>fs.click()));
    menu.appendChild(item(T('refresh'),'↻',()=>{ try{ if(typeof switchMode==='function') switchMode(state.mode); if(typeof toast==='function') toast(T('refresh')); }catch(e){} }));
    const sep=document.createElement('div'); sep.className='m-sep'; menu.appendChild(sep);
    const dl=document.createElement('div'); dl.className='m-meta'; dl.textContent=T('download'); menu.appendChild(dl);
    const rp=$('#rpBtn'); if(rp) menu.appendChild(item(rp.textContent.trim(),'📑',()=>rp.click()));
    const w=$('#reportWordBtn'); if(w) menu.appendChild(item('Word (.docx)','W',()=>w.click()));
    const p=$('#reportPdfBtn'); if(p) menu.appendChild(item('PDF (.pdf)','⎙',()=>p.click()));
    const xl=$('#dbExcel'); if(xl && state.mode==='dashboard') menu.appendChild(item('Excel (.xlsx)','▦',()=>xl.click()));
    const csv=document.querySelector('#modeKompleks #kExportCsv, #modeXodim #hExportCsv, #modeMaxsus #exportCsv'); const vis=csv && csv.closest('[id^="mode"]') && csv.closest('[id^="mode"]').style.display!=='none'; if(vis) menu.appendChild(item('CSV','⬇',()=>csv.click()));
    const ae=$('#adminEntry'); if(ae){ const sep2=document.createElement('div'); sep2.className='m-sep'; menu.appendChild(sep2); menu.appendChild(item(ae.textContent.trim(),'🔐',()=>ae.click())); }
  }
  more.onclick=()=>{ const show=!menu.classList.contains('show'); if(show) buildMenu(); menu.classList.toggle('show',show); more.setAttribute('aria-expanded',String(show)); if(show){ const f=menu.querySelector('button'); if(f) f.focus(); } };
  document.addEventListener('click', e=>{ if(menu.classList.contains('show') && !menu.contains(e.target) && e.target!==more && !more.contains(e.target)){ menu.classList.remove('show'); more.setAttribute('aria-expanded','false'); } });
}

/* ---------------- 2. Filtrlar: «Filtrlar» tugmasi va pastki varaq ---------------- */
const FILTER_SEL = '#appMain .db-filters, #appMain .refdate-bar, #appMain .filters:not(#compareBar):not(#coordFilters)';
function closeSheets(){ $$('.m-filter-bar.m-open').forEach(b=>b.classList.remove('m-open')); document.body.classList.remove('m-sheet-open'); $$('.m-chart-modal').forEach(m=>m.remove()); }
function activeFilters(bar){
  const out=[];
  bar.querySelectorAll('select').forEach(s=>{ if(s.selectedIndex>0 && s.value!=='' && !/^(all|overall|desc|performanceScore|15|10|20)$/.test(s.value)){ const lbl=s.options[s.selectedIndex].textContent.trim(); if(lbl && !/^(Barchasi|Все|All|Ikkalasi|Оба|Both)/.test(lbl)) out.push(lbl); } });
  bar.querySelectorAll('input[type=text],input[type=search]').forEach(i=>{ if(i.value.trim()) out.push('“'+i.value.trim().slice(0,24)+'”'); });
  bar.querySelectorAll('.chip.active').forEach(c=>{ if(c.dataset.filter && c.dataset.filter!=='all') out.push(c.textContent.trim()); });
  return out;
}
function mountFilters(){
  $$(FILTER_SEL).forEach(bar=>{
    if(bar.__mFilter) return; bar.__mFilter=true; bar.classList.add('m-filter-bar');
    const tg=document.createElement('button'); tg.type='button'; tg.className='m-filter-toggle'; tg.setAttribute('aria-expanded','false'); tg.setAttribute('data-i18n-skip','');
    tg.innerHTML=`<span aria-hidden="true">⚲</span><span class="m-lbl"></span><span class="m-cnt"></span><span class="m-chips"></span>`;
    bar.parentNode.insertBefore(tg, bar);
    const foot=document.createElement('div'); foot.className='m-filter-foot'; foot.setAttribute('data-i18n-skip','');
    foot.innerHTML=`<button type="button" class="m-clear"></button><button type="button" class="m-apply"></button>`;
    bar.appendChild(foot);
    const refresh=()=>{ const act=activeFilters(bar); tg.querySelector('.m-lbl').textContent=T('filters'); tg.querySelector('.m-cnt').textContent=act.length?String(act.length):''; tg.querySelector('.m-chips').innerHTML=act.slice(0,3).map(a=>`<span>${a.replace(/</g,'&lt;')}</span>`).join('')+(act.length>3?`<span>+${act.length-3}</span>`:''); foot.querySelector('.m-clear').textContent='✕ '+T('clear'); foot.querySelector('.m-apply').textContent='✓ '+T('apply'); tg.setAttribute('aria-label', T('filters')+(act.length?` (${act.length})`:'')); };
    const open=on=>{ bar.classList.toggle('m-open',on); document.body.classList.toggle('m-sheet-open',on); tg.setAttribute('aria-expanded',String(on)); if(on){ foot.style.display='flex'; const f=bar.querySelector('select,input'); if(f) setTimeout(()=>f.focus(),60); } else { foot.style.display=''; tg.focus(); refresh(); } };
    tg.onclick=()=>open(!bar.classList.contains('m-open'));
    foot.querySelector('.m-apply').onclick=()=>open(false);
    foot.querySelector('.m-clear').onclick=()=>{ const c=bar.querySelector('#dbClear,#kClear,#hClear,#clearBtn,#appClear,#progClear,.btn-clear'); if(c) c.click(); else { bar.querySelectorAll('select').forEach(s=>{ s.selectedIndex=0; s.dispatchEvent(new Event('change',{bubbles:true})); }); bar.querySelectorAll('input[type=text]').forEach(i=>{ i.value=''; i.dispatchEvent(new Event('input',{bubbles:true})); }); } setTimeout(refresh,150); };
    bar.addEventListener('change', ()=>setTimeout(refresh,50)); bar.addEventListener('input', ()=>setTimeout(refresh,250)); bar.addEventListener('click', e=>{ if(e.target.closest('.chip,.btn-clear,.db-btn')) setTimeout(refresh,120); });
    refresh();
    document.addEventListener('i18n:change', refresh);
  });
}

/* ---------------- 3. Jadvallar → kartalar ---------------- */
function stampTables(){
  if(!PHONE.matches) { $$('#appMain table.m-cards').forEach(t=>t.classList.remove('m-cards')); return; }
  $$('#appMain .table-scroll table, #appMain table#dataTable').forEach(t=>{
    const heads=Array.from(t.querySelectorAll('thead th')).map(th=>th.textContent.replace(/[▲▼↑↓]/g,'').trim());
    if(!heads.length) return;
    t.classList.add('m-cards');
    const first=t.querySelector('thead th'); if(first) first.setAttribute('data-sort-hint', T('sort'));
    t.querySelectorAll('tbody tr').forEach(tr=>{
      const tds=tr.children; for(let i=0;i<tds.length;i++){ if(tds[i].tagName==='TD' && !tds[i].hasAttribute('colspan')) tds[i].setAttribute('data-label', heads[i]||''); }
      if(tr.dataset.app||tr.dataset.gid||tr.dataset.skey||tr.dataset.org||tr.dataset.id||tr.dataset.cid||tr.dataset.key||tr.style.cursor==='pointer'){ tr.classList.add('m-link'); tr.setAttribute('data-more', T('more2')); }
    });
  });
}

/* ---------------- 4. Diagrammalar: mobil sozlamalar va kattalashtirish ---------------- */
function patchCharts(){
  if(typeof echarts==='undefined' || echarts.__mobile) return; echarts.__mobile=true;
  const _init=echarts.init;
  echarts.init=function(){
    const inst=_init.apply(this, arguments); const so=inst.setOption;
    inst.setOption=function(opt){
      try{
        if(PHONE.matches && opt && typeof opt==='object' && !opt.__rp){
          const el=inst.getDom(); const inReport = el && el.id==='rpChartStage';
          if(!inReport){
            opt.textStyle=Object.assign({},opt.textStyle,{fontSize:11});
            const arr=o=>o==null?[]:(Array.isArray(o)?o:[o]);
            arr(opt.legend).forEach(l=>{ if(!l) return; l.type=l.type||'scroll'; l.textStyle=Object.assign({},l.textStyle,{fontSize:10}); l.itemWidth=14; l.itemHeight=9; });
            arr(opt.yAxis).forEach(a=>{ if(a&&a.type==='category'){ a.axisLabel=Object.assign({},a.axisLabel,{fontSize:10,width:96,overflow:'truncate'}); } });
            arr(opt.xAxis).forEach(a=>{ if(a&&a.type==='category'){ a.axisLabel=Object.assign({},a.axisLabel,{fontSize:10,interval:a.axisLabel&&a.axisLabel.interval!=null?a.axisLabel.interval:'auto',hideOverlap:true}); } });
            arr(opt.grid).forEach(g=>{ if(!g) return; if(g.right>90) g.right=70; if(g.left>40) g.left=8; });
            arr(opt.series).forEach(s=>{ if(s&&s.label&&s.label.show){ s.label=Object.assign({},s.label,{fontSize:Math.min(s.label.fontSize||11,11)}); } if(s&&s.type==='pie'&&s.label){ s.label=Object.assign({},s.label,{fontSize:11}); } });
            arr(opt.tooltip).forEach(t=>{ if(t){ t.confine=true; t.triggerOn=t.triggerOn||'mousemove|click'; } });
          }
        }
      }catch(e){}
      return so.apply(inst, arguments);
    };
    return inst;
  };
}
function mountExpand(){
  if(!isMobile()) return;
  $$('#appMain .chart-tools').forEach(tools=>{
    if(tools.querySelector('.m-expand')) return;
    const chartEl=tools.nextElementSibling; if(!chartEl||!chartEl.classList.contains('chart')) return;
    const b=document.createElement('button'); b.type='button'; b.className='tts-btn m-expand'; b.textContent='⤢ '+T('expand'); b.setAttribute('aria-label',T('expand'));
    b.onclick=()=>expandChart(chartEl);
    tools.appendChild(b);
  });
}
function expandChart(el){
  const inst=echarts.getInstanceByDom(el); if(!inst) return;
  const panel=el.closest('.panel'); const title=panel&&panel.querySelector('h3')?panel.querySelector('h3').textContent.trim():'';
  const m=document.createElement('div'); m.className='m-chart-modal'; m.setAttribute('role','dialog'); m.setAttribute('aria-modal','true'); m.setAttribute('data-i18n-skip','');
  m.innerHTML=`<div class="m-ch-head"><h3>${title.replace(/</g,'&lt;')}</h3><button type="button" aria-label="${T('close')}">✕</button></div><div class="m-ch-body"><div class="m-ch-canvas"></div></div>`;
  document.body.appendChild(m); document.body.classList.add('m-sheet-open');
  const canvas=m.querySelector('.m-ch-canvas'); const opt=inst.getOption(); const n=((opt.yAxis&&opt.yAxis[0]&&opt.yAxis[0].data)||[]).length; canvas.style.height=Math.max(window.innerHeight-90, n*34+80)+'px';
  const big=echarts.init(canvas); opt.animation=false; if(opt.grid&&opt.grid[0]){ opt.grid[0].right=Math.min(opt.grid[0].right||20,90); } if(opt.yAxis&&opt.yAxis[0]&&opt.yAxis[0].type==='category'){ opt.yAxis[0].axisLabel=Object.assign({},opt.yAxis[0].axisLabel,{width:150,overflow:'truncate',fontSize:12}); } big.setOption(opt,true);
  const close=()=>{ big.dispose(); m.remove(); document.body.classList.remove('m-sheet-open'); };
  m.querySelector('button').onclick=close; m.querySelector('button').focus();
  const onKey=e=>{ if(e.key==='Escape'){ close(); document.removeEventListener('keydown',onKey); } }; document.addEventListener('keydown',onKey);
  window.addEventListener('resize', ()=>{ try{ big.resize(); }catch(e){} }, {once:true});
}

/* ---------------- 5. Ishga tushirish ---------------- */
function refreshAll(){ mountFilters(); stampTables(); mountExpand(); }
function boot(){
  patchCharts(); mountHeader(); refreshAll();
  const main=document.getElementById('appMain');
  if(main){ let t=null; new MutationObserver(()=>{ clearTimeout(t); t=setTimeout(refreshAll, 200); }).observe(main,{childList:true,subtree:true}); }
  const onChange=()=>{ if(!isMobile()){ document.body.classList.remove('m-nav-open','m-sheet-open'); $$('.m-filter-bar.m-open').forEach(b=>b.classList.remove('m-open')); } refreshAll(); setTimeout(()=>{ try{ Object.values(charts||{}).forEach(c=>c&&c.resize()); if(typeof dbCharts!=='undefined') Object.values(dbCharts).forEach(c=>c&&c.resize()); }catch(e){} },150); };
  MQ.addEventListener ? MQ.addEventListener('change', onChange) : MQ.addListener(onChange);
  PHONE.addEventListener ? PHONE.addEventListener('change', onChange) : PHONE.addListener(onChange);
  window.addEventListener('orientationchange', ()=>setTimeout(onChange, 200));
  document.addEventListener('i18n:change', ()=>setTimeout(()=>{ stampTables(); $$('.m-expand').forEach(b=>{ b.textContent='⤢ '+T('expand'); }); }, 300));
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', ()=>setTimeout(boot,120)); else setTimeout(boot,120);
})();
