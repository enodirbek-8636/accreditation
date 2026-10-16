/* =====================================================================
   NQAAE monitoring — i18n yadrosi (uz / ru / en)
   - Lugʻat: locales.js (L10N: "uz matn" → ["ru","en"], # = son oʻrni)
   - Asl kod oʻzbek tilida matn chiqaradi; ushbu modul DOM, ECharts, hisobot,
     CSV va bildirishnomalarni koʻrsatish paytida tarjima qiladi.
   - Hisob-kitob mantigʻi va maʼlumotlar oʻzgartirilmaydi.
   ===================================================================== */
(function(){
"use strict";
const LS_LANG = 'acc.ui.lang';
const LANGS = {
  uz:{code:'UZ', name:'Oʻzbekcha', html:'uz-Latn', speech:'uz-UZ', embed:'ul', locale:'uz-Latn-UZ'},
  ru:{code:'RU', name:'Русский',   html:'ru',      speech:'ru-RU', embed:'ru', locale:'ru-RU'},
  en:{code:'EN', name:'English',   html:'en-GB',   speech:'en-GB', embed:'en', locale:'en-GB'}
};
const D = (typeof L10N!=='undefined') ? L10N : {};
/* yangi interfeys elementlari uchun 3 tilli satrlar */
const UI = {
  'lang.switch':   {uz:'Interfeys tili',ru:'Язык интерфейса',en:'Interface language'},
  'lang.uz':       {uz:'Oʻzbek tili (lotin)',ru:'Узбекский язык (латиница)',en:'Uzbek (Latin)'},
  'lang.ru':       {uz:'Rus tili',ru:'Русский язык',en:'Russian'},
  'lang.en':       {uz:'Ingliz tili',ru:'Английский язык',en:'English'},
  'lang.changed':  {uz:'Til oʻzgartirildi: Oʻzbekcha',ru:'Язык изменён: Русский',en:'Language changed: English'},
  'skip':          {uz:'Asosiy mazmunga oʻtish',ru:'Перейти к основному содержимому',en:'Skip to main content'},
  'theme.dark':    {uz:'Tungi',ru:'Тёмная',en:'Dark'},
  'theme.light':   {uz:'Kunduzgi',ru:'Светлая',en:'Light'}
};
/* son belgisi: 16.10.2026 · 1 125 · 83.6% · 12:30 — lekin ". " (gap oxiri) orqali qoʻshilib ketmaydi */
const NUM_RE = /\d+(?:[.,:]\d+)*(?:[\s  ]\d{3}(?!\d))*/g;
const NAME_RE = /\b\p{Lu}[\p{L}ʻʼ’'`-]+ \p{Lu}(?:[\p{L}ʻʼ’'`-]+|\.)/gu;

const I18N = {
  lang: 'uz',
  LANGS, UI,
  _rev: new Map(),          // tarjima → asl (diagramma hodisalari uchun)
  _frag: null,              // fragment kalitlari (uzunligi boʻyicha saralangan)
  _cache: new Map(),
  init(){
    let l = null;
    try{ l = localStorage.getItem(LS_LANG); }catch(e){}
    if(!l || !LANGS[l]){
      const nav = (navigator.language||'').toLowerCase();
      l = nav.startsWith('ru') ? 'ru' : (nav.startsWith('en') ? 'en' : 'uz');
    }
    this.lang = l;
    this._normalizeDict();
    this._buildFrag();
    document.documentElement.lang = LANGS[l].html;
  },
  /* lugʻat kalitlari va qiymatlaridagi sonlarni # bilan almashtirish (yozuvda son qolib ketgan boʻlsa) */
  _normalizeDict(){
    const cnt = s => (s.match(NUM_RE)||[]).length;
    Object.keys(D).forEach(k=>{
      if(!/\d/.test(k)) return;
      const nk = k.replace(NUM_RE,'#'), n = cnt(k);
      const v = D[k].map(x=> (typeof x==='string' && cnt(x)===n) ? x.replace(NUM_RE,'#') : x);
      if(!D[nk]) D[nk] = v;
      if(nk!==k) delete D[k];
    });
  },
  ui(key){ const e=UI[key]; return e ? (e[this.lang]||e.uz) : key; },
  /* ---- asosiy tarjima ---- */
  tr(s){
    if(this.lang==='uz' || s==null) return s;
    if(typeof s!=='string') return s;
    if(!/[A-Za-zʻʼ]/.test(s)) return s;             // harfsiz (faqat son) — tegilmaydi
    const ck = this.lang+'\u0001'+s;
    const c = this._cache.get(ck); if(c!==undefined) return c;
    const m = /^(\s*)([\s\S]*?)(\s*)$/.exec(s);
    const core = m[2]; if(!core){ return s; }
    let out = this._trCore(core);
    out = m[1] + out + m[3];
    if(this._cache.size>20000) this._cache.clear();
    this._cache.set(ck, out);
    if(out!==s) this._rev.set(out.trim(), core);
    return out;
  },
  _lookup(core){
    const toks = []; const key = core.replace(/\s+/g,' ').replace(NUM_RE, t=>{ toks.push(t); return '#'; });
    let e = D[key], pre='', post='', ntoks=null;
    const withNames = k => {   // «iqtibos» va Familiya Ism koʻrinishidagi nomlar — @ oʻrin egallovchi
      const nt = [];
      const k2 = k.replace(/«([^»]+)»/g, (m,q)=>{ nt.push(this.tr(q)); return '«@»'; })
                  .replace(NAME_RE, m=>{ nt.push(m); return '@'; });
      return (k2!==k && D[k2]) ? {e:D[k2], nt} : null;
    };
    if(!e){ const r = withNames(key); if(r){ e=r.e; ntoks=r.nt; } }
    if(!e){   // chetki tinish belgilarisiz urinib koʻramiz ("Oʻtgan:", "(jami)", "· Koordinator:")
      const pm = /^([\s·—–\-:;,.()«»"'…]*)([\s\S]*?)([\s·—–\-:;,.()«»"'…]*)$/.exec(key);
      if(pm && pm[2] && pm[2]!==key){
        e = D[pm[2]]; pre=pm[1]; post=pm[3];
        if(!e){ const r = withNames(pm[2]); if(r){ e=r.e; ntoks=r.nt; } }
      }
    }
    if(!e) return null;
    const v = this.lang==='ru' ? e[0] : e[1]; if(v==null) return null;
    let i = 0, j = 0;
    const out = v.replace(/#(\d+)?|@/g, (m,n)=> m==='@' ? (ntoks ? (ntoks[j++]??'') : '@') : (n ? (toks[+n-1]??'') : (toks[i++]??'')));
    return pre + out + post;
  },
  _trCore(core){
    const d = this._lookup(core); if(d!==null) return d;
    // boʻlaklarga ajratish: ajratuvchilar saqlanadi
    const SEP = /(\s·\s|\s\|\s|\s—\s|\s–\s|:\s|;\s|\s→\s|\(|\)|«|»|\s\/\s|<br\s*\/?>|\n)/;
    const parts = core.split(SEP);
    if(parts.length>1){
      let changed=false;
      const res = parts.map((p,i)=>{ if(i%2===1) return p; if(!p.trim()) return p; const t=this._lookup(p.trim()); if(t!==null){ changed=true; return p.replace(p.trim(), ()=>t); } return p; }).join('');
      if(changed) return this._fragments(res);
    }
    return this._fragments(core);
  },
  _buildFrag(){
    this._frag = Object.keys(D).filter(k=>k.length>=8 && !k.includes('#')).sort((a,b)=>b.length-a.length)
      .map(k=>({k, re:new RegExp('(^|[^\\p{L}])('+k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')(?![\\p{L}])','u')}));
  },
  _fragments(text){
    // eng uzun kalitlar boʻyicha almashtirish (faqat soʻz chegarasida)
    if(!this._frag) this._buildFrag();
    // muassasa / dastur nomlari tarjima qilinmaydi
    if(/\b(universitet\w*|institut\w*|akademiya\w*|litsey\w*|texnikum\w*|maktab\w*|kollej\w*|markaz\w*|filial\w*|university|institute|academy|college|school)\b/i.test(text)) return text;
    let out = text, guard = 0;
    for(const f of this._frag){
      if(out.length<f.k.length) continue;
      if(!out.includes(f.k)) continue;
      const e = D[f.k]; const v = this.lang==='ru'?e[0]:e[1]; if(v==null) continue;
      out = out.replace(f.re, (m,pre)=>pre+v);
      if(++guard>40) break;
    }
    return out;
  },
  untr(s){ if(this.lang==='uz'||typeof s!=='string') return s; return this._rev.get(String(s).trim()) ?? s; },
  trHtml(html){
    if(this.lang==='uz'||typeof html!=='string') return html;
    return html.split(/(<[^>]+>)/).map(p=>p.startsWith('<')?p:this.tr(p)).join('');
  },
  trRich(s){   // echarts rich-label: {x|matn}
    if(this.lang==='uz'||typeof s!=='string') return s;
    if(!s.includes('{')) return this.tr(s);
    return s.replace(/\{([a-zA-Z0-9_]+)\|([^}]*)\}/g, (m,st,txt)=>'{'+st+'|'+this.tr(txt)+'}');
  },
  /* ---- son va sana formati ---- */
  num(n){
    if(n==null||isNaN(n)) return '0';
    const v = Math.round(n);
    if(this.lang==='en') return v.toLocaleString('en-GB');
    return v.toLocaleString('ru-RU').replace(/,/g,' ');
  },
  pct(n){ const v=(Math.round(n*10)/10).toFixed(1); return (this.lang==='ru'?v.replace('.',','):v)+'%'; },
  /* ---- tilni oʻzgartirish ---- */
  set(l, opts){
    if(!LANGS[l]) return;
    const prev = this.lang;
    this.lang = l; this._cache.clear();
    try{ localStorage.setItem(LS_LANG, l); localStorage.setItem('acc.lang', LANGS[l].embed); }catch(e){}
    document.documentElement.lang = LANGS[l].html;
    this.renderSwitcher();
    this.applyDom(document.body, true);
    this.syncEmbeds();
    if(prev!==l) this.rerender();
    if(!(opts&&opts.silent) && typeof toast==='function') toast(this.ui('lang.changed'));
    document.dispatchEvent(new CustomEvent('i18n:change',{detail:{lang:l}}));
  },
  rerender(){
    try{ if(typeof setDate==='function') setDate(); }catch(e){}
    try{
      const m = (typeof state!=='undefined') ? state.mode : null;
      if(typeof charts!=='undefined') Object.values(charts).forEach(c=>c&&c.resize());
      if(m==='kompleks' && typeof kRenderSection==='function') kRenderSection();
      else if(m==='xodim' && typeof hRenderSection==='function'){ STAFF = buildStaff(); hRenderSection(); }
      else if(m==='dashboard' && typeof dbRender==='function') dbRender();
      else if(m==='maxsus'){ if(typeof renderAll==='function') renderAll(); if(typeof renderAppSection==='function') renderAppSection(); }
      if(typeof applyTheme==='function'){ const tt=document.getElementById('themeTxt'); if(tt) tt.textContent = (state.theme==='dark'?'Kunduzgi':'Tungi'); }
    }catch(e){ console.warn('i18n rerender', e); }
  },
  syncEmbeds(){
    const emb = LANGS[this.lang].embed;
    document.querySelectorAll('iframe.embed-frame').forEach(f=>{
      if(f.src && f.contentWindow){ try{ f.contentWindow.postMessage({lang:emb}, '*'); }catch(e){} }
    });
  },
  /* ---- DOM ---- */
  _ATTRS: ['placeholder','title','aria-label','alt'],
  _skipEl(el){
    if(!el) return true;
    const t = el.tagName; if(t==='SCRIPT'||t==='STYLE'||t==='NOSCRIPT'||t==='TEXTAREA') return true;
    if(el.closest && el.closest('[data-i18n-skip],.cell-name,.am-title,.am-sub,#infoTip')) return true;
    return false;
  },
  _txt(node){
    const p = node.parentElement; if(this._skipEl(p)) return;
    if(p.__rvRaf) return;                                          // sanoq animatsiyasi davomida
    const cur = node.nodeValue;
    if(node.__i18nSet!==undefined && node.__i18nSet===cur){        // oʻzimiz yozgan
      if(this.lang==='uz'){ if(node.__uz!==undefined && cur!==node.__uz){ node.__i18nSet=node.__uz; node.nodeValue=node.__uz; } return; }
      const t=this.tr(node.__uz); if(t!==cur){ node.__i18nSet=t; node.nodeValue=t; } return;
    }
    node.__uz = cur;                                               // ilova yozgan asl matn
    if(!/[A-Za-zʻʼ]/.test(cur)) { node.__i18nSet=cur; return; }
    const t = this.tr(cur);
    node.__i18nSet = t;
    if(t!==cur) node.nodeValue = t;
  },
  _attrs(el){
    if(this._skipEl(el)) return;
    for(const a of this._ATTRS){
      if(!el.hasAttribute(a)) continue;
      const cur = el.getAttribute(a);
      const key = '__uz_'+a;
      if(el[key]===undefined || el['__set_'+a]!==cur) el[key]=cur;
      const t = this.lang==='uz' ? el[key] : this.tr(el[key]);
      if(t!==cur){ el.setAttribute(a,t); }
      el['__set_'+a]=t;
    }
  },
  applyDom(root, force){
    if(!root) return;
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT|NodeFilter.SHOW_ELEMENT);
    let n;
    if(root.nodeType===1) this._attrs(root);
    while((n=w.nextNode())){
      if(n.nodeType===3) this._txt(n); else this._attrs(n);
    }
  },
  observe(){
    const mo = new MutationObserver(muts=>{
      for(const m of muts){
        if(m.type==='characterData'){ this._txt(m.target); }
        else if(m.type==='attributes'){ this._attrs(m.target); }
        else m.addedNodes.forEach(nd=>{ if(nd.nodeType===3) this._txt(nd); else if(nd.nodeType===1) this.applyDom(nd); });
      }
    });
    mo.observe(document.body, {childList:true, subtree:true, characterData:true, attributes:true, attributeFilter:this._ATTRS});
  },
  /* ---- til tanlagich ---- */
  flag(l){
    if(l==='uz') return '<svg viewBox="0 0 24 16" aria-hidden="true"><rect width="24" height="16" fill="#1eb53a"/><rect width="24" height="10.6" fill="#fff"/><rect width="24" height="5.3" fill="#0099b5"/><rect y="5.1" width="24" height=".6" fill="#ce1126"/><rect y="10.3" width="24" height=".6" fill="#ce1126"/><circle cx="4.4" cy="2.7" r="1.7" fill="#fff"/><circle cx="5" cy="2.5" r="1.5" fill="#0099b5"/></svg>';
    if(l==='ru') return '<svg viewBox="0 0 24 16" aria-hidden="true"><rect width="24" height="16" fill="#d52b1e"/><rect width="24" height="10.6" fill="#0039a6"/><rect width="24" height="5.3" fill="#fff"/></svg>';
    return '<svg viewBox="0 0 24 16" aria-hidden="true"><rect width="24" height="16" fill="#012169"/><path d="M0 0l24 16M24 0L0 16" stroke="#fff" stroke-width="3"/><path d="M0 0l24 16M24 0L0 16" stroke="#C8102E" stroke-width="1.2"/><path d="M12 0v16M0 8h24" stroke="#fff" stroke-width="5"/><path d="M12 0v16M0 8h24" stroke="#C8102E" stroke-width="3"/></svg>';
  },
  renderSwitcher(){
    let box = document.getElementById('langSwitch');
    if(!box){
      box = document.createElement('div'); box.id='langSwitch'; box.className='lang-switch'; box.setAttribute('role','group');
      const ha = document.querySelector('.header-actions'); if(ha) ha.insertBefore(box, ha.firstChild); else document.body.appendChild(box);
    }
    box.setAttribute('aria-label', this.ui('lang.switch')); box.setAttribute('data-i18n-skip','');
    box.innerHTML = ['uz','ru','en'].map(l=>`<button type="button" class="lang-btn${l===this.lang?' active':''}" data-lang="${l}" aria-pressed="${l===this.lang}" aria-label="${this.ui('lang.'+l)}" title="${LANGS[l].name}" lang="${LANGS[l].html}">${this.flag(l)}<span class="lang-code">${LANGS[l].code}</span><span class="sr-only"> — ${LANGS[l].name}</span></button>`).join('');
    box.querySelectorAll('.lang-btn').forEach(b=>b.onclick=()=>this.set(b.dataset.lang));
  },
  /* ---- ECharts: koʻrsatish vaqtida tarjima ---- */
  patchECharts(){
    if(typeof echarts==='undefined' || echarts.__i18n) return;
    echarts.__i18n = true;
    const self = this;
    const asArr = o => o==null ? [] : (Array.isArray(o)?o:[o]);
    const wrapFmt = (f, kind) => {
      if(f && f.__i18n) return f;
      let w;
      if(typeof f==='function'){
        w = function(){ const r=f.apply(this, arguments); return typeof r==='string' ? (kind==='html'?self.trHtml(r):self.trRich(r)) : r; };
      } else if(kind==='axis'){
        w = function(v){ return self.trRich(String(v)); };
      } else if(kind==='legend'){
        w = function(name){ return self.tr(name); };
      } else return f;
      w.__i18n = true; return w;
    };
    const defaultTip = function(p){
      const fmtV = v => (v==null?'—':(Array.isArray(v)?v.join(', '):v));
      if(Array.isArray(p)){
        const head = p.length ? self.tr(String(p[0].axisValueLabel ?? p[0].axisValue ?? p[0].name ?? '')) : '';
        return `<b>${head}</b><br/>`+p.filter(x=>x.value!=null && x.seriesName!=='_t').map(x=>`${x.marker||''} ${self.tr(x.seriesName||'')}: <b>${fmtV(x.value)}</b>`).join('<br/>');
      }
      const nm = self.tr(p.name||''), sn = self.tr(p.seriesName||'');
      return `${p.marker||''} ${sn?sn+'<br/>':''}${nm}: <b>${fmtV(p.value)}</b>${p.percent!=null?` (${p.percent}%)`:''}`;
    };
    const patchOpt = opt => {
      if(!opt || typeof opt!=='object') return opt;
      try{
        asArr(opt.legend).forEach(l=>{ if(l) l.formatter = wrapFmt(l.formatter,'legend'); });
        ['xAxis','yAxis','radiusAxis','angleAxis'].forEach(k=>asArr(opt[k]).forEach(a=>{
          if(!a) return;
          if(a.type==='category' || Array.isArray(a.data)){ a.axisLabel = a.axisLabel||{}; a.axisLabel.formatter = wrapFmt(a.axisLabel.formatter,'axis'); }
          if(typeof a.name==='string') a.name = self.tr(a.name);
        }));
        asArr(opt.tooltip).forEach(t=>{ if(!t) return; if(typeof t.formatter==='function') t.formatter = wrapFmt(t.formatter,'html'); else if(t.formatter==null && t.show!==false) { t.formatter = defaultTip; t.formatter.__i18n=true; } });
        asArr(opt.series).forEach(s=>{
          if(!s) return;
          if(s.label){ if(typeof s.label.formatter==='function') s.label.formatter = wrapFmt(s.label.formatter,'rich'); else if(s.type==='pie' && s.label.show!==false && s.label.formatter==null){ s.label.formatter = p=>self.tr(p.name); s.label.formatter.__i18n=true; } }
          if(s.markLine && Array.isArray(s.markLine.data)) s.markLine.data.forEach(d=>{ if(d&&d.label&&typeof d.label.formatter==='string') d.label.formatter=self.tr(d.label.formatter); if(d&&typeof d.name==='string') d.name=self.tr(d.name); });
          if(s.type==='gauge' && s.detail && typeof s.detail.formatter==='function') s.detail.formatter = wrapFmt(s.detail.formatter,'rich');
          if(s.tooltip && typeof s.tooltip.formatter==='function') s.tooltip.formatter = wrapFmt(s.tooltip.formatter,'html');
        });
        asArr(opt.radar).forEach(r=>{ if(r&&Array.isArray(r.indicator)) r.indicator.forEach(i=>{ if(i&&typeof i.name==='string') i.name=self.tr(i.name); }); });
        asArr(opt.title).forEach(t=>{ if(!t) return; if(typeof t.text==='string') t.text=self.tr(t.text); if(typeof t.subtext==='string') t.subtext=self.tr(t.subtext); });
        if(window.A11Y && A11Y.prefs && A11Y.prefs.motion){ opt.animation = false; }
      }catch(e){ console.warn('i18n echarts', e); }
      return opt;
    };
    const _init = echarts.init;
    echarts.init = function(){
      const inst = _init.apply(this, arguments);
      const so = inst.setOption;
      inst.setOption = function(opt){ const args=Array.prototype.slice.call(arguments); args[0]=patchOpt(opt); return so.apply(inst, args); };
      return inst;
    };
  }
};
window.I18N = I18N;

/* ---- ilova funksiyalarini oʻrash (tarjima qatlamлари) ---- */
function patchApp(){
  if(typeof toast==='function' && !toast.__i18n){ const o=toast; window.toast=function(m){ return o(I18N.tr(m)); }; window.toast.__i18n=true; }
  if(typeof _xml==='function' && !_xml.__i18n){ const o=_xml; window._xml=function(s){ return o(I18N.tr(s)); }; window._xml.__i18n=true; }
  if(typeof downloadFile==='function' && !downloadFile.__i18n){
    const o=downloadFile;
    window.downloadFile=function(content,name,type){
      if(I18N.lang!=='uz' && typeof content==='string' && /csv/.test(type||'')){
        content = content.split('\n').map(line=>line.replace(/"((?:[^"]|"")*)"/g,(m,c)=>'"'+I18N.tr(c.replace(/""/g,'"')).replace(/"/g,'""')+'"')).join('\n');
      }
      return o(content,name,type);
    }; window.downloadFile.__i18n=true;
  }
}

I18N.init();
I18N.patchECharts();
patchApp();
document.addEventListener('DOMContentLoaded', ()=>{
  I18N.renderSwitcher();
  I18N.applyDom(document.body, true);
  I18N.observe();
  if(I18N.lang!=='uz') setTimeout(()=>I18N.rerender(), 120);
});
})();
