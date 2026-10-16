/* =====================================================================
   NQAAE monitoring — maxsus imkoniyatlar (WCAG 2.2 AA yoʻnalishida),
   ovozli oʻqish (Web Speech API) va diagrammalarning muqobil koʻrinishlari
   (jadval / audio). i18n.js dan keyin yuklanadi.
   ===================================================================== */
(function(){
"use strict";
const T = (key) => {
  const e = STR[key]; if(!e) return key;
  const l = (window.I18N ? I18N.lang : 'uz');
  return e[l] || e.uz;
};
const STR = {
  'a11y.btn':      {uz:'Maxsus imkoniyatlar',ru:'Специальные возможности',en:'Accessibility'},
  'a11y.title':    {uz:'Maxsus imkoniyatlar',ru:'Специальные возможности',en:'Accessibility settings'},
  'a11y.font':     {uz:'Shrift oʻlchami',ru:'Размер шрифта',en:'Font size'},
  'a11y.font.dec': {uz:'Kichraytirish',ru:'Уменьшить',en:'Decrease'},
  'a11y.font.def': {uz:'Standart',ru:'По умолчанию',en:'Default'},
  'a11y.font.inc': {uz:'Kattalashtirish',ru:'Увеличить',en:'Increase'},
  'a11y.contrast': {uz:'Kontrast rejimi',ru:'Режим контрастности',en:'Contrast mode'},
  'a11y.c.std':    {uz:'Standart',ru:'Стандарт',en:'Standard'},
  'a11y.c.light':  {uz:'Yuqori kontrast (och)',ru:'Высокий контраст (светлый)',en:'High contrast (light)'},
  'a11y.c.dark':   {uz:'Yuqori kontrast (toʻq)',ru:'Высокий контраст (тёмный)',en:'High contrast (dark)'},
  'a11y.motion':   {uz:'Harakatni kamaytirish',ru:'Уменьшить анимацию',en:'Reduce motion'},
  'a11y.simple':   {uz:'Soddalashtirilgan koʻrinish',ru:'Упрощённый вид',en:'Simplified view'},
  'a11y.simple.d': {uz:'Diagrammalar oʻrniga jadvallar, kamroq bezak',ru:'Таблицы вместо диаграмм, меньше декора',en:'Tables instead of charts, less decoration'},
  'a11y.focus':    {uz:'Fokusni ajratib koʻrsatish',ru:'Подсвечивать фокус',en:'Highlight keyboard focus'},
  'a11y.reset':    {uz:'Sozlamalarni tiklash',ru:'Сбросить настройки',en:'Reset settings'},
  'a11y.close':    {uz:'Yopish',ru:'Закрыть',en:'Close'},
  'a11y.saved':    {uz:'Sozlamalar saqlandi',ru:'Настройки сохранены',en:'Settings saved'},
  'a11y.keys':     {uz:'Klaviatura: Tab — harakat, Enter/Space — tanlash, Esc — yopish',ru:'Клавиатура: Tab — переход, Enter/Space — выбор, Esc — закрыть',en:'Keyboard: Tab — move, Enter/Space — select, Esc — close'},
  'tts.btn':       {uz:'Ovozli oʻqish',ru:'Озвучивание',en:'Audio narration'},
  'tts.summary':   {uz:'Qisqacha audio sharh',ru:'Прослушать краткий обзор',en:'Listen to summary'},
  'tts.play':      {uz:'Tinglash',ru:'Слушать',en:'Listen'},
  'tts.pause':     {uz:'Pauza',ru:'Пауза',en:'Pause'},
  'tts.resume':    {uz:'Davom etish',ru:'Продолжить',en:'Resume'},
  'tts.stop':      {uz:'Toʻxtatish',ru:'Стоп',en:'Stop'},
  'tts.speed':     {uz:'Tezlik',ru:'Скорость',en:'Speed'},
  'tts.voice':     {uz:'Ovoz',ru:'Голос',en:'Voice'},
  'tts.text':      {uz:'Matnni koʻrsatish',ru:'Показать текст',en:'Show text'},
  'tts.novoice':   {uz:'Brauzeringizda tanlangan til uchun ovoz topilmadi. Matnli variant quyida koʻrsatildi.',ru:'В браузере не найден голос для выбранного языка. Ниже показан текстовый вариант.',en:'No voice for the selected language is available in your browser. The text version is shown below.'},
  'tts.unsupported':{uz:'Brauzeringiz ovozli oʻqishni qoʻllab-quvvatlamaydi. Matnli variant koʻrsatildi.',ru:'Браузер не поддерживает синтез речи. Показан текстовый вариант.',en:'Your browser does not support speech synthesis. The text version is shown instead.'},
  'tts.voiceLang': {uz:'Oʻzbek tili uchun ovoz yoʻq — matn koʻrsatildi. Boshqa tildagi ovoz avtomatik ishlatilmaydi.',ru:'Голос для узбекского языка отсутствует — показан текст. Голос другого языка автоматически не используется.',en:'No Uzbek voice available — text shown. A voice in another language is never substituted automatically.'},
  'chart.visual':  {uz:'Diagramma',ru:'Диаграмма',en:'Chart'},
  'chart.table':   {uz:'Jadval',ru:'Таблица',en:'Data table'},
  'chart.audio':   {uz:'Audio sharh',ru:'Аудиообзор',en:'Audio summary'},
  'chart.copy':    {uz:'Nusxalash',ru:'Копировать',en:'Copy'},
  'chart.csv':     {uz:'CSV',ru:'CSV',en:'CSV'},
  'chart.copied':  {uz:'Jadval nusxalandi',ru:'Таблица скопирована',en:'Table copied'},
  'chart.cat':     {uz:'Toifa',ru:'Категория',en:'Category'},
  'chart.value':   {uz:'Qiymat',ru:'Значение',en:'Value'},
  'chart.total':   {uz:'Jami',ru:'Всего',en:'Total'},
  'chart.nodata':  {uz:'Jadval uchun maʼlumot yoʻq',ru:'Нет данных для таблицы',en:'No data for the table'},
  'chart.sort':    {uz:'Saralash uchun bosing',ru:'Нажмите для сортировки',en:'Click to sort'},
  'info':          {uz:'Izoh',ru:'Пояснение',en:'Explanation'}
};
/* -------------------- MAXSUS IMKONIYATLAR -------------------- */
const LS = 'acc.a11y';
const A11Y = {
  prefs: {zoom:1, contrast:'', motion:false, simple:false, focus:false},
  load(){ try{ Object.assign(this.prefs, JSON.parse(localStorage.getItem(LS))||{}); }catch(e){} if(!this.prefs.motion && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) this.prefs.motion=true; },
  save(){ try{ localStorage.setItem(LS, JSON.stringify(this.prefs)); }catch(e){} },
  apply(){
    const h = document.documentElement, p = this.prefs;
    h.classList.toggle('reduce-motion', !!p.motion);
    h.classList.toggle('simple-view', !!p.simple);
    h.classList.toggle('a11y-focus', !!p.focus);
    if(p.contrast) h.setAttribute('data-contrast', p.contrast); else h.removeAttribute('data-contrast');
    document.body.style.zoom = p.zoom!==1 ? String(p.zoom) : '';
    document.querySelectorAll('iframe.embed-frame').forEach(f=>{ try{ if(f.contentWindow) f.contentWindow.postMessage({a11y:{motion:p.motion, contrast:p.contrast, zoom:p.zoom!==1?p.zoom:''}}, '*'); }catch(e){} });
    setTimeout(()=>{ try{ if(typeof charts!=='undefined') Object.values(charts).forEach(c=>c&&c.resize()); if(typeof dbCharts!=='undefined') Object.values(dbCharts).forEach(c=>c&&c.resize()); }catch(e){} }, 80);
    if(p.simple) ChartAlt.simpleMode(true); else ChartAlt.simpleMode(false);
    this.renderPanel();
  },
  set(k, v){ this.prefs[k]=v; this.save(); this.apply(); if(typeof toast==='function') toast(T('a11y.saved')); },
  reset(){ this.prefs={zoom:1, contrast:'', motion:false, simple:false, focus:false}; this.save(); this.apply(); },
  mountButton(){
    const ha = document.querySelector('.header-actions'); if(!ha || document.getElementById('a11yBtn')) return;
    const b = document.createElement('button'); b.className='hbtn'; b.id='a11yBtn'; b.type='button'; b.setAttribute('aria-haspopup','dialog'); b.setAttribute('aria-expanded','false'); b.setAttribute('data-i18n-skip','');
    b.innerHTML = '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="4.5" r="1.8"/><path d="M4 8.5h16M12 8.5v6l-3.5 6M12 14.5l3.5 6"/></svg><span class="a11y-lbl"></span>';
    const ls = document.getElementById('langSwitch'); if(ls && ls.nextSibling) ha.insertBefore(b, ls.nextSibling); else ha.appendChild(b);
    b.onclick = ()=>this.toggle();
    const skip = document.createElement('a'); skip.href='#appMain'; skip.className='skip-link'; skip.id='skipLink'; skip.setAttribute('data-i18n-skip',''); document.body.insertBefore(skip, document.body.firstChild);
    const main = document.getElementById('appMain'); if(main){ main.setAttribute('tabindex','-1'); if(!main.getAttribute('role')) main.setAttribute('role','main'); }
    const panel = document.createElement('div'); panel.id='a11yPanel'; panel.className='a11y-panel'; panel.setAttribute('role','dialog'); panel.setAttribute('aria-modal','false'); panel.setAttribute('data-i18n-skip',''); document.body.appendChild(panel);
    document.addEventListener('keydown', e=>{
      if(e.key==='Escape'){
        if(panel.classList.contains('show')){ this.toggle(false); return; }
        const closers=['#kmClose','#hmClose','#gmClose','#amClose','#spClose','.sp-close','.am-close'];
        for(const sel of closers){ const el=document.querySelector(sel); if(el && el.offsetParent!==null){ el.click(); return; } }
        try{ if(typeof kCloseModal==='function' && document.getElementById('kModal').classList.contains('show')) kCloseModal(); if(typeof hCloseModal==='function' && document.getElementById('hModal').classList.contains('show')) hCloseModal(); if(typeof gCloseModal==='function' && document.getElementById('gModal').classList.contains('show')) gCloseModal(); }catch(err){}
      }
    });
    document.addEventListener('click', e=>{ if(panel.classList.contains('show') && !panel.contains(e.target) && !b.contains(e.target)) this.toggle(false); });
    this.renderPanel();
  },
  toggle(force){
    const panel=document.getElementById('a11yPanel'), b=document.getElementById('a11yBtn');
    const show = force!==undefined ? force : !panel.classList.contains('show');
    panel.classList.toggle('show', show); b.setAttribute('aria-expanded', String(show));
    if(show){ this.renderPanel(); const f=panel.querySelector('button'); if(f) f.focus(); } else b.focus();
  },
  renderPanel(){
    const panel=document.getElementById('a11yPanel'), b=document.getElementById('a11yBtn'); if(!panel||!b) return;
    const p=this.prefs; const lbl=b.querySelector('.a11y-lbl'); if(lbl) lbl.textContent=T('a11y.btn'); b.title=T('a11y.btn'); b.setAttribute('aria-label',T('a11y.btn'));
    const skip=document.getElementById('skipLink'); if(skip) skip.textContent=T('skip');
    const seg=(name,opts,cur)=>`<span class="seg" role="group" aria-label="${name}">${opts.map(o=>`<button type="button" data-k="${o.k}" data-v="${o.v}" aria-pressed="${String(cur)===String(o.v)}" title="${o.t}">${o.l}</button>`).join('')}</span>`;
    const sw=(k,on,label)=>`<button type="button" class="a11y-switch" role="switch" aria-checked="${on}" data-k="${k}" data-v="${!on}" aria-label="${label}"></button>`;
    panel.innerHTML=`<h3>${T('a11y.title')}<button type="button" class="mini-btn" data-act="close" aria-label="${T('a11y.close')}">✕</button></h3>
      <div class="a11y-row"><span>${T('a11y.font')}</span>${seg(T('a11y.font'),[{k:'zoom',v:0.9,l:'A−',t:T('a11y.font.dec')},{k:'zoom',v:1,l:'A',t:T('a11y.font.def')},{k:'zoom',v:1.25,l:'A+',t:T('a11y.font.inc')},{k:'zoom',v:1.5,l:'A++',t:T('a11y.font.inc')+' 150%'},{k:'zoom',v:2,l:'A+++',t:T('a11y.font.inc')+' 200%'}],p.zoom)}</div>
      <div class="a11y-row"><span>${T('a11y.contrast')}</span>${seg(T('a11y.contrast'),[{k:'contrast',v:'',l:T('a11y.c.std'),t:T('a11y.c.std')},{k:'contrast',v:'light',l:'◐',t:T('a11y.c.light')},{k:'contrast',v:'dark',l:'◑',t:T('a11y.c.dark')}],p.contrast)}</div>
      <div class="a11y-row"><span>${T('a11y.motion')}</span>${sw('motion',!!p.motion,T('a11y.motion'))}</div>
      <div class="a11y-row"><span>${T('a11y.simple')}<br><small style="color:var(--c-text-2)">${T('a11y.simple.d')}</small></span>${sw('simple',!!p.simple,T('a11y.simple'))}</div>
      <div class="a11y-row"><span>${T('a11y.focus')}</span>${sw('focus',!!p.focus,T('a11y.focus'))}</div>
      <div class="a11y-row" style="justify-content:space-between"><small style="color:var(--c-text-2)">${T('a11y.keys')}</small><button type="button" class="mini-btn" data-act="reset">${T('a11y.reset')}</button></div>`;
    panel.querySelectorAll('button[data-k]').forEach(btn=>btn.onclick=()=>{ let v=btn.dataset.v; if(btn.dataset.k==='zoom') v=parseFloat(v); else if(v==='true') v=true; else if(v==='false') v=false; this.set(btn.dataset.k, v); });
    panel.querySelector('[data-act="close"]').onclick=()=>this.toggle(false);
    panel.querySelector('[data-act="reset"]').onclick=()=>this.reset();
  }
};
window.A11Y = A11Y;

/* -------------------- OVOZLI OʻQISH (TTS) -------------------- */
const TTS = {
  rate: 1, voiceURI: '', utter: null, state: 'idle',
  supported(){ return 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window; },
  langTag(){ return window.I18N ? I18N.LANGS[I18N.lang].speech : 'uz-UZ'; },
  voices(){ try{ return speechSynthesis.getVoices()||[]; }catch(e){ return []; } },
  voicesFor(){ const tag=this.langTag().toLowerCase(), base=tag.split('-')[0]; const v=this.voices(); const exact=v.filter(x=>(x.lang||'').toLowerCase().replace('_','-')===tag); const loose=v.filter(x=>(x.lang||'').toLowerCase().split(/[-_]/)[0]===base); return exact.length?exact.concat(loose.filter(x=>!exact.includes(x))):loose; },
  load(){ try{ const s=JSON.parse(localStorage.getItem('acc.tts')||'{}'); if(s.rate) this.rate=s.rate; if(s.voiceURI) this.voiceURI=s.voiceURI; }catch(e){} },
  save(){ try{ localStorage.setItem('acc.tts', JSON.stringify({rate:this.rate, voiceURI:this.voiceURI})); }catch(e){} },
  speak(text, box){
    this.stop();
    const out = box ? box.querySelector('.tts-text') : null;
    if(out){ out.textContent = text; out.style.display=''; }
    if(!this.supported()){ this.note(box, T('tts.unsupported')); return false; }
    const vs = this.voicesFor();
    if(!vs.length){ this.note(box, I18N.lang==='uz' ? T('tts.voiceLang') : T('tts.novoice')); return false; }
    const u = new SpeechSynthesisUtterance(text);
    u.lang = this.langTag(); u.rate = this.rate;
    u.voice = vs.find(v=>v.voiceURI===this.voiceURI) || vs[0];
    u.onend = ()=>{ this.state='idle'; this.refresh(box); }; u.onerror = ()=>{ this.state='idle'; this.refresh(box); };
    this.utter = u; this.state='playing'; this.activeBox = box;
    speechSynthesis.speak(u); this.refresh(box); return true;
  },
  pause(){ if(this.supported() && this.state==='playing'){ speechSynthesis.pause(); this.state='paused'; this.refresh(this.activeBox); } },
  resume(){ if(this.supported() && this.state==='paused'){ speechSynthesis.resume(); this.state='playing'; this.refresh(this.activeBox); } },
  stop(){ if(this.supported()){ try{ speechSynthesis.cancel(); }catch(e){} } this.state='idle'; this.refresh(this.activeBox); },
  note(box, msg){ if(!box) { if(typeof toast==='function') toast(msg); return; } let n=box.querySelector('.tts-note'); if(!n){ n=document.createElement('div'); n.className='tts-note'; n.style.cssText='font-size:12px;color:var(--c-failed);margin-top:6px'; box.appendChild(n); } n.textContent=msg; },
  refresh(box){ if(!box) return; const pl=box.querySelector('[data-tts="play"]'), pa=box.querySelector('[data-tts="pause"]'), st=box.querySelector('[data-tts="stop"]'); if(pl) pl.setAttribute('aria-pressed', String(this.state==='playing')); if(pa){ pa.textContent=(this.state==='paused'?'▶ '+T('tts.resume'):'⏸ '+T('tts.pause')); pa.disabled=this.state==='idle'; } if(st) st.disabled=this.state==='idle'; },
  controls(getText, opts){
    opts=opts||{};
    const box=document.createElement('div'); box.className='tts-box'; box.setAttribute('data-i18n-skip','');
    const bar=document.createElement('div'); bar.className='tts-bar'; bar.setAttribute('role','group'); bar.setAttribute('aria-label', T('tts.btn'));
    const mk=(k,txt,title)=>{ const b=document.createElement('button'); b.type='button'; b.className='tts-btn'; b.dataset.tts=k; b.textContent=txt; b.title=title||txt; b.setAttribute('aria-label', title||txt); return b; };
    const play=mk('play','🔊 '+(opts.label||T('tts.play')), opts.label||T('tts.play'));
    const pause=mk('pause','⏸ '+T('tts.pause')); const stop=mk('stop','■ '+T('tts.stop'));
    const speed=document.createElement('select'); speed.className='tts-btn'; speed.setAttribute('aria-label',T('tts.speed')); [0.75,1,1.25,1.5].forEach(r=>{ const o=document.createElement('option'); o.value=r; o.textContent=r+'×'; if(r===this.rate) o.selected=true; speed.appendChild(o); });
    speed.onchange=()=>{ this.rate=parseFloat(speed.value); this.save(); };
    const voice=document.createElement('select'); voice.className='tts-btn'; voice.setAttribute('aria-label',T('tts.voice')); voice.style.maxWidth='160px';
    const fillVoices=()=>{ const vs=this.voicesFor(); voice.innerHTML=''; if(!vs.length){ const o=document.createElement('option'); o.textContent='— '+T('tts.voice')+' —'; voice.appendChild(o); voice.disabled=true; return; } voice.disabled=false; vs.forEach(v=>{ const o=document.createElement('option'); o.value=v.voiceURI; o.textContent=v.name; if(v.voiceURI===this.voiceURI) o.selected=true; voice.appendChild(o); }); };
    fillVoices(); if(this.supported()) speechSynthesis.addEventListener('voiceschanged', fillVoices);
    voice.onchange=()=>{ this.voiceURI=voice.value; this.save(); };
    const txtBtn=mk('text','📄 '+T('tts.text'));
    bar.append(play,pause,stop,speed,voice,txtBtn); box.appendChild(bar);
    const out=document.createElement('div'); out.className='tts-text'; out.style.display='none'; out.setAttribute('aria-live','polite'); box.appendChild(out);
    play.onclick=()=>{ const t=getText(); if(!t) return; this.speak(t, box); };
    pause.onclick=()=>{ if(this.state==='paused') this.resume(); else this.pause(); };
    stop.onclick=()=>this.stop();
    txtBtn.onclick=()=>{ const t=getText(); out.textContent=t; out.style.display = out.style.display==='none' ? '' : 'none'; };
    this.refresh(box);
    return box;
  }
};
window.TTS = TTS;

/* -------------------- BOʻLIM SHARHLARI (joriy maʼlumotdan) -------------------- */
const fN = n => (typeof fmtNum==='function'?fmtNum(n):String(n));
const fP = n => (typeof fmtPct==='function'?fmtPct(n):String(n)+'%');
const L = () => (window.I18N ? I18N.lang : 'uz');
const pick = (uz,ru,en) => ({uz,ru,en})[L()];
const SUMMARY = {
  dashboard(){
    if(typeof dbCompute!=='function') return '';
    const D = (typeof _dbLast!=='undefined' && _dbLast) ? _dbLast : dbCompute();
    const i=D.inst, k=D.komp, m=D.mx, ref=(typeof fmtDate==='function'?fmtDate(dbState.ref):'');
    const parts=[];
    parts.push(pick(`Davlat akkreditatsiyasining umumiy holati, hisobot sanasi ${ref}.`,`Общее состояние государственной аккредитации на отчётную дату ${ref}.`,`Overall state of State Accreditation as of ${ref}.`));
    parts.push(pick(`Reyestrda ${fN(i.total)} ta taʼlim tashkiloti mavjud: ${fN(i.active)} tasida akkreditatsiya amalda (${fP(i.active/i.total*100)}), ${fN(i.overdue)} tasida muddat oʻtgan, ${fN(i.progress)} tasi jarayonda, ${fN(i.soon)} tasining muddati yaqinlashgan.`,
      `В реестре ${fN(i.total)} образовательных организаций: у ${fN(i.active)} аккредитация действует (${fP(i.active/i.total*100)}), у ${fN(i.overdue)} срок истёк, ${fN(i.progress)} в процессе, у ${fN(i.soon)} срок истекает.`,
      `The register contains ${fN(i.total)} educational institutions: ${fN(i.active)} hold a valid accreditation (${fP(i.active/i.total*100)}), ${fN(i.overdue)} have expired, ${fN(i.progress)} are in progress and ${fN(i.soon)} are expiring soon.`));
    parts.push(pick(`Kompleks davlat akkreditatsiyasi boʻyicha ${fN(k.total)} ta ariza qayd etilgan (birlik — ariza): ${fN(k.done)} tasi yakunlangan, shundan ${fN(k.passed)} tasi akkreditatsiyadan oʻtgan, ${fN(k.failed)} tasi oʻtolmagan; ${fN(k.inProgress)} ta ariza jarayonda.`,
      `По комплексной государственной аккредитации зарегистрировано ${fN(k.total)} заявок (единица — заявка): ${fN(k.done)} завершено, из них ${fN(k.passed)} аккредитовано и ${fN(k.failed)} не аккредитовано; ${fN(k.inProgress)} заявок в процессе.`,
      `Comprehensive State Accreditation has ${fN(k.total)} applications on record (unit: application): ${fN(k.done)} completed, of which ${fN(k.passed)} accredited and ${fN(k.failed)} not accredited; ${fN(k.inProgress)} applications are in progress.`));
    parts.push(pick(`Maxsus davlat akkreditatsiyasida ${fN(m.progs)} ta taʼlim dasturi (birlik — dastur) ${fN(m.apps)} ta ariza doirasida koʻrib chiqilmoqda: ${fN(m.passed)} tasi oʻtgan, ${fN(m.failed)} tasi oʻtmagan, ${fN(m.inProgress)} tasi jarayonda.`,
      `В специальной государственной аккредитации рассматривается ${fN(m.progs)} образовательных программ (единица — программа) в рамках ${fN(m.apps)} заявок: ${fN(m.passed)} аккредитовано, ${fN(m.failed)} не аккредитовано, ${fN(m.inProgress)} в процессе.`,
      `Special State Accreditation covers ${fN(m.progs)} educational programmes (unit: programme) within ${fN(m.apps)} applications: ${fN(m.passed)} accredited, ${fN(m.failed)} not accredited and ${fN(m.inProgress)} in progress.`));
    const crit = (k.crit||0)+(m.crit||0);
    if(crit) parts.push(pick(`Kritik kechikishlar: ${fN(crit)} ta ariza (kompleks ${fN(k.crit)}, maxsus ${fN(m.crit)}).`,`Критические задержки: ${fN(crit)} заявок (комплексная ${fN(k.crit)}, специальная ${fN(m.crit)}).`,`Critical delays: ${fN(crit)} applications (comprehensive ${fN(k.crit)}, special ${fN(m.crit)}).`));
    if(i.d30) parts.push(pick(`Keyingi 30 kun ichida ${fN(i.d30)} ta tashkilotning akkreditatsiya muddati tugaydi.`,`В ближайшие 30 дней срок аккредитации истекает у ${fN(i.d30)} организаций.`,`The accreditation of ${fN(i.d30)} institutions expires within the next 30 days.`));
    try{ const st=Object.entries(k.stage).sort((a,b)=>b[1]-a[1])[0]; if(st) parts.push(pick(`Kompleks arizalarning eng koʻp qismi «${K_STAGE[st[0]].label}» holatida — ${fN(st[1])} ta.`,`Больше всего комплексных заявок в статусе «${I18N.tr(K_STAGE[st[0]].label)}» — ${fN(st[1])}.`,`Most comprehensive applications are at the “${I18N.tr(K_STAGE[st[0]].label)}” status — ${fN(st[1])}.`)); }catch(e){}
    return parts.join(' ');
  },
  kompleks(){
    if(typeof kFiltered!=='function') return '';
    const l=kFiltered(), n=l.length||1; const st=k=>l.filter(r=>r.stage===k).length; const done=st('done'), passed=l.filter(r=>r.result==='passed').length, failed=l.filter(r=>r.result==='failed').length, crit=l.filter(r=>kAgeCat(r).k==='crit').length;
    const parts=[];
    parts.push(pick(`Kompleks davlat akkreditatsiyasi: tanlangan filtrlar boʻyicha ${fN(l.length)} ta ariza, ${fN(new Set(l.map(r=>r.hei)).size)} ta taʼlim tashkiloti.`,`Комплексная государственная аккредитация: по выбранным фильтрам ${fN(l.length)} заявок, ${fN(new Set(l.map(r=>r.hei)).size)} образовательных организаций.`,`Comprehensive State Accreditation: ${fN(l.length)} applications and ${fN(new Set(l.map(r=>r.hei)).size)} institutions match the selected filters.`));
    parts.push(pick(`Holatlar boʻyicha: ariza koʻrib chiqishda ${fN(st('review'))}, ariza rasmiylashtirishda ${fN(st('submitted'))}, ichki baholashda ${fN(st('internal'))}, tashqi baholashda ${fN(st('external'))}, yakunlangan ${fN(done)} (${fP(done/n*100)}).`,
      `По статусам: на рассмотрении ${fN(st('review'))}, на оформлении ${fN(st('submitted'))}, внутренняя оценка ${fN(st('internal'))}, внешняя оценка ${fN(st('external'))}, завершено ${fN(done)} (${fP(done/n*100)}).`,
      `By status: ${fN(st('review'))} under review, ${fN(st('submitted'))} being processed, ${fN(st('internal'))} in internal evaluation, ${fN(st('external'))} in external evaluation and ${fN(done)} completed (${fP(done/n*100)}).`));
    if(done) parts.push(pick(`Yakunlanganlardan ${fN(passed)} tasi akkreditatsiyadan oʻtgan, ${fN(failed)} tasi oʻtolmagan.`,`Из завершённых ${fN(passed)} аккредитовано, ${fN(failed)} не аккредитовано.`,`Of the completed applications, ${fN(passed)} were accredited and ${fN(failed)} were not.`));
    if(crit) parts.push(pick(`${fN(crit)} ta ariza ${K_WAIT_CRIT} kundan ortiq kutmoqda — kritik holat.`,`${fN(crit)} заявок ожидают более ${K_WAIT_CRIT} дней — критическое состояние.`,`${fN(crit)} applications have been waiting for more than ${K_WAIT_CRIT} days — critical status.`));
    return parts.join(' ');
  },
  maxsus(){
    if(typeof totals!=='function') return '';
    const t=totals(); const dec=t.progPassed+t.progFailed;
    return pick(`Maxsus davlat akkreditatsiyasi: ${fN(t.appTotal)} ta ariza, shundan ${fN(t.appCompleted)} tasi tugallangan, ${fN(t.appInProgress)} tasi jarayonda. Jami ${fN(t.progTotal)} ta taʼlim dasturi: ${fN(t.progPassed)} tasi akkreditatsiyadan oʻtgan, ${fN(t.progFailed)} tasi oʻtmagan, ${fN(t.progInProgress)} tasi jarayonda. Qaror qabul qilingan dasturlar boʻyicha muvaffaqiyat darajasi ${fP(dec?t.progPassed/dec*100:0)}.`,
      `Специальная государственная аккредитация: ${fN(t.appTotal)} заявок, из них ${fN(t.appCompleted)} завершено и ${fN(t.appInProgress)} в процессе. Всего ${fN(t.progTotal)} образовательных программ: ${fN(t.progPassed)} аккредитовано, ${fN(t.progFailed)} не аккредитовано, ${fN(t.progInProgress)} в процессе. Уровень успешности по программам с принятым решением — ${fP(dec?t.progPassed/dec*100:0)}.`,
      `Special State Accreditation: ${fN(t.appTotal)} applications, of which ${fN(t.appCompleted)} are completed and ${fN(t.appInProgress)} in progress. ${fN(t.progTotal)} educational programmes in total: ${fN(t.progPassed)} accredited, ${fN(t.progFailed)} not accredited and ${fN(t.progInProgress)} in progress. The success rate among decided programmes is ${fP(dec?t.progPassed/dec*100:0)}.`);
  },
  xodim(){
    if(typeof STAFF==='undefined') return '';
    const S=(STAFF.length?STAFF:buildStaff()); const loaded=S.filter(s=>s.hasLoad); const avg=loaded.length?loaded.reduce((a,s)=>a+(s.overall||0),0)/loaded.length:0;
    const cat=k=>loaded.filter(s=>hCategory(s).k===k).length; const crit=loaded.filter(s=>s.critTotal>0).length;
    const top=loaded.slice().sort((a,b)=>(b.overall||0)-(a.overall||0))[0];
    return pick(`Xodimlar dinamikasi: ${fN(S.length)} nafar xodim, shundan ${fN(S.filter(s=>s.hasMx).length)} nafari maxsus, ${fN(S.filter(s=>s.hasKx).length)} nafari kompleks akkreditatsiyada. Oʻrtacha faoliyat balli ${fP(avg)}. Aʼlo — ${fN(cat('alo'))}, barqaror — ${fN(cat('barqaror'))}, nazorat talab etadi — ${fN(cat('nazorat'))}, kritik — ${fN(cat('kritik'))}. ${fN(crit)} nafar xodimda kritik kechikishlar bor.${top?` Eng yuqori ball — ${top.name} (${fP(top.overall)}).`:''}`,
      `Динамика сотрудников: ${fN(S.length)} сотрудников, из них ${fN(S.filter(s=>s.hasMx).length)} в специальной и ${fN(S.filter(s=>s.hasKx).length)} в комплексной аккредитации. Средний балл деятельности ${fP(avg)}. Отлично — ${fN(cat('alo'))}, стабильно — ${fN(cat('barqaror'))}, требует контроля — ${fN(cat('nazorat'))}, критическое состояние — ${fN(cat('kritik'))}. У ${fN(crit)} сотрудников есть критические задержки.${top?` Наивысший балл — ${top.name} (${fP(top.overall)}).`:''}`,
      `Staff performance dynamics: ${fN(S.length)} staff members, of whom ${fN(S.filter(s=>s.hasMx).length)} work in special and ${fN(S.filter(s=>s.hasKx).length)} in comprehensive accreditation. The average performance score is ${fP(avg)}. Excellent — ${fN(cat('alo'))}, stable — ${fN(cat('barqaror'))}, needs attention — ${fN(cat('nazorat'))}, critical — ${fN(cat('kritik'))}. ${fN(crit)} staff members have critical delays.${top?` The highest score is held by ${top.name} (${fP(top.overall)}).`:''}`);
  },
  inst(){
    if(typeof dbCompute!=='function') return '';
    const D=(typeof _dbLast!=='undefined'&&_dbLast)?_dbLast:dbCompute(); const i=D.inst;
    return pick(`Taʼlim tashkilotlari reyestri: ${fN(i.total)} ta tashkilot. Akkreditatsiya amalda — ${fN(i.active)} (${fP(i.active/i.total*100)}), jarayonda — ${fN(i.progress)}, muddati yaqin — ${fN(i.soon)}, muddati oʻtgan — ${fN(i.overdue)}. Keyingi 30 kunda ${fN(i.d30)} ta, 90 kungacha ${fN(i.d30+i.d60+i.d90)} ta tashkilotning muddati tugaydi.`,
      `Реестр образовательных организаций: ${fN(i.total)} организаций. Аккредитация действует — ${fN(i.active)} (${fP(i.active/i.total*100)}), в процессе — ${fN(i.progress)}, срок истекает — ${fN(i.soon)}, срок истёк — ${fN(i.overdue)}. В ближайшие 30 дней срок истекает у ${fN(i.d30)}, в течение 90 дней — у ${fN(i.d30+i.d60+i.d90)} организаций.`,
      `Register of educational institutions: ${fN(i.total)} institutions. Valid accreditation — ${fN(i.active)} (${fP(i.active/i.total*100)}), in progress — ${fN(i.progress)}, expiring soon — ${fN(i.soon)}, expired — ${fN(i.overdue)}. ${fN(i.d30)} institutions expire within 30 days and ${fN(i.d30+i.d60+i.d90)} within 90 days.`);
  }
};
window.SUMMARY = SUMMARY;
const SUMMARY_ANCHORS = [
  {mode:'dashboard', sel:'#dsec-top', fn:'dashboard'},
  {mode:'kompleks', sel:'#ksec-top', fn:'kompleks'},
  {mode:'maxsus', sel:'#sec-top', fn:'maxsus'},
  {mode:'xodim', sel:'#hsec-top', fn:'xodim'},
  {mode:'tashkilot', sel:'#modeTashkilot', fn:'inst', before:true},
  {mode:'grafik', sel:'#modeGrafik', fn:'inst', before:true}
];
function mountSummaries(){
  SUMMARY_ANCHORS.forEach(a=>{
    const el=document.querySelector(a.sel); if(!el || el.__tts) return; el.__tts=true;
    const box=TTS.controls(()=>SUMMARY[a.fn](), {label:T('tts.summary')});
    box.classList.add('tts-summary'); box.style.cssText='margin:0 0 14px';
    if(a.before) el.insertBefore(box, el.firstChild); else el.insertAdjacentElement('afterend', box);
  });
}

/* -------------------- DIAGRAMMA MUQOBILLARI (jadval / audio) -------------------- */
const ChartAlt = {
  inst(id){ try{ if(typeof charts!=='undefined' && charts[id]) return charts[id]; if(typeof dbCharts!=='undefined' && dbCharts[id]) return dbCharts[id]; const el=document.getElementById(id); return el && echarts.getInstanceByDom(el); }catch(e){ return null; } },
  data(id){
    const c=this.inst(id); if(!c||c.isDisposed()) return null; let o; try{ o=c.getOption(); }catch(e){ return null; }
    if(!o || !Array.isArray(o.series)) return null;
    const tr=s=>I18N.tr(String(s));
    const series=(o.series||[]).filter(s=>s && s.name!=='_t' && !s.silent && s.type!=='custom');
    if(!series.length) return null;
    const ax=(o.yAxis||[]).find(a=>a&&a.type==='category'&&Array.isArray(a.data)) || (o.xAxis||[]).find(a=>a&&a.type==='category'&&Array.isArray(a.data));
    const val=d=>{ if(d==null) return null; if(typeof d==='object'){ const v=('value' in d)?d.value:null; return Array.isArray(v)?v[v.length-1]:v; } return d; };
    if(series[0].type==='pie' || series[0].type==='radar' && !ax){
      if(series[0].type==='radar'){ const ind=(o.radar&&o.radar[0]&&o.radar[0].indicator)||[]; const cats=ind.map(i=>tr(i.name)); const cols=series[0].data.map(d=>tr(d.name||'')); const rows=cats.map((c,i)=>[c].concat(series[0].data.map(d=>val({value:(d.value||[])[i]})))); return {cats, cols, rows, unit:''}; }
      const rows=series[0].data.map(d=>[tr(d.name), val(d)]); return {cats:rows.map(r=>r[0]), cols:[T('chart.value')], rows, unit:'', pie:true};
    }
    if(!ax){ // kategoriyasiz (scatter va h.k.)
      const rows=series[0].data.slice(0,200).map((d,i)=>[String(i+1), val(d)]); return {cats:rows.map(r=>r[0]), cols:[tr(series[0].name||T('chart.value'))], rows, unit:''};
    }
    const cats=ax.data.map(x=>tr(typeof x==='object'?x.value:x));
    const cols=series.map(s=>tr(s.name||T('chart.value')));
    const rows=cats.map((c,i)=>[c].concat(series.map(s=>val((s.data||[])[i]))));
    return {cats, cols, rows, unit:''};
  },
  table(id){
    const d=this.data(id); const wrap=document.createElement('div'); wrap.className='chart-table-wrap'; wrap.setAttribute('data-i18n-skip','');
    if(!d){ wrap.textContent=T('chart.nodata'); return wrap; }
    const tbl=document.createElement('table'); tbl.className='chart-table';
    const multi=d.cols.length>1 && !d.pie;
    const head=`<thead><tr><th scope="col" title="${T('chart.sort')}">${T('chart.cat')}</th>${d.cols.map(c=>`<th scope="col" title="${T('chart.sort')}">${c}</th>`).join('')}${multi?`<th scope="col">${T('chart.total')}</th>`:''}</tr></thead>`;
    const fmt=v=>v==null||v===''?'—':(typeof v==='number'?(Number.isInteger(v)?fN(v):String(Math.round(v*10)/10)):String(v));
    const body=()=>`<tbody>${d.rows.map(r=>`<tr><th scope="row">${r[0]}</th>${r.slice(1).map(v=>`<td>${fmt(v)}</td>`).join('')}${multi?`<td><b>${fmt(r.slice(1).reduce((a,v)=>a+(+v||0),0))}</b></td>`:''}</tr>`).join('')}</tbody>`;
    tbl.innerHTML=head+body();
    let sortCol=-1, dir=1;
    tbl.querySelectorAll('thead th').forEach((th,ci)=>{ th.tabIndex=0; const go=()=>{ if(sortCol===ci) dir=-dir; else { sortCol=ci; dir=ci===0?1:-1; } d.rows.sort((a,b)=>{ const x=ci===0?a[0]:(ci<=d.cols.length?(+a[ci]||0):a.slice(1).reduce((s,v)=>s+(+v||0),0)); const y=ci===0?b[0]:(ci<=d.cols.length?(+b[ci]||0):b.slice(1).reduce((s,v)=>s+(+v||0),0)); return (x>y?1:x<y?-1:0)*dir; }); tbl.querySelector('tbody').outerHTML=body(); th.setAttribute('aria-sort', dir>0?'ascending':'descending'); }; th.onclick=go; th.onkeydown=e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); go(); } }; });
    wrap.appendChild(tbl);
    const tools=document.createElement('div'); tools.style.cssText='display:flex;gap:6px;padding:8px';
    const copy=document.createElement('button'); copy.type='button'; copy.className='tts-btn'; copy.textContent='⧉ '+T('chart.copy');
    const csvB=document.createElement('button'); csvB.type='button'; csvB.className='tts-btn'; csvB.textContent='⬇ '+T('chart.csv');
    const toTxt=sep=>[[T('chart.cat')].concat(d.cols)].concat(d.rows.map(r=>r.map(v=>v==null?'':v))).map(r=>r.join(sep)).join('\n');
    copy.onclick=()=>{ const t=toTxt('\t'); (navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(()=>toast(T('chart.copied'))).catch(()=>{ const ta=document.createElement('textarea'); ta.value=t; document.body.appendChild(ta); ta.select(); try{ document.execCommand('copy'); toast(T('chart.copied')); }catch(e){} ta.remove(); }); };
    csvB.onclick=()=>{ const t='﻿'+[[T('chart.cat')].concat(d.cols)].concat(d.rows).map(r=>r.map(v=>'"'+String(v==null?'':v).replace(/"/g,'""')+'"').join(';')).join('\n'); const blob=new Blob([t],{type:'text/csv;charset=utf-8'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=id+'.csv'; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),100); };
    tools.append(copy,csvB); wrap.appendChild(tools);
    return wrap;
  },
  audioText(id, title){
    const d=this.data(id); if(!d||!d.rows.length) return T('chart.nodata');
    const sum=r=>r.slice(1).reduce((a,v)=>a+(+v||0),0);
    const tot=d.rows.map(sum); const all=tot.reduce((a,b)=>a+b,0)||1;
    const iMax=tot.indexOf(Math.max(...tot)), iMin=tot.indexOf(Math.min(...tot.filter(v=>v>0).length?tot.filter(v=>v>0):tot));
    const mx=d.rows[iMax], mn=d.rows[tot.indexOf(Math.min(...tot))];
    const n=d.rows.length, colsTxt=d.cols.length>1?d.cols.join(', '):'';
    const p=pick(
      `«${title}» diagrammasi ${n} ta toifani koʻrsatadi${colsTxt?` (qatorlar: ${colsTxt})`:''}. Eng katta qiymat — ${mx[0]}: ${fN(sum(mx))} (${fP(sum(mx)/all*100)}). Eng kichik — ${mn[0]}: ${fN(sum(mn))} (${fP(sum(mn)/all*100)}). Umumiy yigʻindi ${fN(all)}.`,
      `Диаграмма «${title}» показывает ${n} категорий${colsTxt?` (ряды: ${colsTxt})`:''}. Наибольшее значение — ${mx[0]}: ${fN(sum(mx))} (${fP(sum(mx)/all*100)}). Наименьшее — ${mn[0]}: ${fN(sum(mn))} (${fP(sum(mn)/all*100)}). Общая сумма ${fN(all)}.`,
      `The chart “${title}” shows ${n} categories${colsTxt?` (series: ${colsTxt})`:''}. The largest value is ${mx[0]}: ${fN(sum(mx))} (${fP(sum(mx)/all*100)}). The smallest is ${mn[0]}: ${fN(sum(mn))} (${fP(sum(mn)/all*100)}). The overall total is ${fN(all)}.`);
    let extra='';
    if(d.cols.length>1 && !d.pie){ const colTot=d.cols.map((c,ci)=>d.rows.reduce((a,r)=>a+(+r[ci+1]||0),0)); const top=colTot.indexOf(Math.max(...colTot)); extra=pick(` Qatorlar boʻyicha eng koʻpi — ${d.cols[top]}: ${fN(colTot[top])} (${fP(colTot[top]/all*100)}).`,` По рядам больше всего — ${d.cols[top]}: ${fN(colTot[top])} (${fP(colTot[top]/all*100)}).`,` Among the series, the largest is ${d.cols[top]}: ${fN(colTot[top])} (${fP(colTot[top]/all*100)}).`); }
    return p+extra;
  },
  mount(){
    document.querySelectorAll('.chart[id], .db-chart[id], [data-chart-id]').forEach(el=>{
      if(el.__alt) return;
      const id=el.id || el.dataset.chartId; const panel=el.closest('.panel, .db-panel'); if(!panel) return;
      el.__alt=true;
      const tools=document.createElement('div'); tools.className='chart-tools'; tools.setAttribute('role','tablist'); tools.setAttribute('data-i18n-skip','');
      const titleEl=panel.querySelector('h3, .db-ph, .panel-head h3'); const title=()=>titleEl?titleEl.textContent.trim():id;
      const mk=(k,lbl)=>{ const b=document.createElement('button'); b.type='button'; b.className='tts-btn'; b.dataset.view=k; b.setAttribute('role','tab'); b.textContent=lbl; return b; };
      const bV=mk('visual','📊 '+T('chart.visual')), bT=mk('table','▦ '+T('chart.table')), bA=mk('audio','🔊 '+T('chart.audio'));
      tools.append(bV,bT,bA);
      const alt=document.createElement('div'); alt.className='chart-alt'; alt.style.display='none'; alt.setAttribute('data-i18n-skip','');
      el.insertAdjacentElement('beforebegin', tools); el.insertAdjacentElement('afterend', alt);
      const show=k=>{ [bV,bT,bA].forEach(b=>b.setAttribute('aria-pressed', String(b.dataset.view===k))); alt.innerHTML=''; if(k==='visual'){ el.style.display=''; alt.style.display='none'; const c=this.inst(id); if(c) setTimeout(()=>c.resize(),30); return; } el.style.display='none'; alt.style.display=''; if(k==='table'){ alt.appendChild(this.table(id)); } else { const box=TTS.controls(()=>this.audioText(id,title()), {label:T('chart.audio')}); const txt=document.createElement('div'); txt.className='chart-audio'; txt.textContent=this.audioText(id,title()); alt.appendChild(box); alt.appendChild(txt); } };
      bV.onclick=()=>show('visual'); bT.onclick=()=>show('table'); bA.onclick=()=>show('audio');
      el.__altShow=show; show(A11Y.prefs.simple?'table':'visual');
    });
    this.refreshLabels();
    // koʻrsatkich izohi: title bor KPI kartalariga ⓘ belgisi (sichqoncha va klaviatura uchun)
    document.querySelectorAll('.kpi-card[title]').forEach(c=>{
      if(c.querySelector('.kpi-info')) return;
      const i=document.createElement('button'); i.type='button'; i.className='kpi-info'; i.textContent='ⓘ'; i.setAttribute('aria-label', T('info')); i.title=c.getAttribute('title')||'';
      i.onclick=e=>{ e.stopPropagation(); const t=c.getAttribute('title')||''; if(typeof toast==='function') toast(t); };
      c.appendChild(i);
    });
  },
  refreshLabels(){ document.querySelectorAll('.chart-tools').forEach(t=>{ const m={visual:'📊 '+T('chart.visual'),table:'▦ '+T('chart.table'),audio:'🔊 '+T('chart.audio')}; t.querySelectorAll('button').forEach(b=>b.textContent=m[b.dataset.view]); }); },
  simpleMode(on){ document.querySelectorAll('.chart[id], .db-chart[id]').forEach(el=>{ if(el.__altShow) el.__altShow(on?'table':'visual'); }); },
  refreshOpen(){ document.querySelectorAll('.chart-alt').forEach(alt=>{ if(alt.style.display==='none') return; const el=alt.previousElementSibling; if(!el||!el.__altShow) return; const tools=el.previousElementSibling; const cur=tools&&tools.querySelector('[aria-pressed="true"]'); if(cur) el.__altShow(cur.dataset.view); }); }
};
window.ChartAlt = ChartAlt;

/* -------------------- ISHGA TUSHIRISH -------------------- */
function boot(){
  A11Y.load(); TTS.load();
  A11Y.mountButton(); A11Y.apply();
  mountSummaries();
  setTimeout(()=>ChartAlt.mount(), 400);
  // rejim almashganda / qayta chizilganda jadval va sharhlar yangilansin
  const main=document.getElementById('appMain');
  if(main){ let t=null; new MutationObserver(()=>{ clearTimeout(t); t=setTimeout(()=>{ ChartAlt.mount(); mountSummaries(); }, 250); }).observe(main,{childList:true,subtree:true}); }
  document.addEventListener('i18n:change', ()=>{ A11Y.renderPanel(); ChartAlt.refreshLabels(); setTimeout(()=>ChartAlt.refreshOpen(), 300); document.querySelectorAll('.tts-summary').forEach(b=>{ const p=b.querySelector('[data-tts="play"]'); if(p) p.textContent='🔊 '+T('tts.summary'); const pa=b.querySelector('[data-tts="pause"]'); if(pa) pa.textContent='⏸ '+T('tts.pause'); const st=b.querySelector('[data-tts="stop"]'); if(st) st.textContent='■ '+T('tts.stop'); const tx=b.querySelector('[data-tts="text"]'); if(tx) tx.textContent='📄 '+T('tts.text'); }); });
  window.addEventListener('beforeunload', ()=>TTS.stop());
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', ()=>setTimeout(boot, 50)); else setTimeout(boot, 50);
})();
