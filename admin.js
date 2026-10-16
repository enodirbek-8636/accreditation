/* =====================================================================
   NQAAE monitoring — ADMIN PANEL va MENYU KOʻRINISHI (ACL)
   - Reyestr: DOM dagi asosiy boʻlimlar (.mode-group) va ichki boʻlimlar
     (.nav-item[data-target], embed-nav darajalari, .section-title[id])
   - Konfiguratsiya: Supabase (menu_config.is_current) — barcha qurilmalar uchun
     bitta eʼlon qilingan holat; oxirgi muvaffaqiyatli nusxa kesh sifatida.
   - Nazorat: navigatsiya + marshrut (switchMode, dbGo, dbOpenInst) + eksportlar.
   - Admin: Supabase Auth (email/parol), rol admin_roles jadvalidan (server tomoni).
   ===================================================================== */
(function(){
"use strict";
const CFG = window.NQAAE_BACKEND || {};
const CORE = window.ACLCore;
const $ = s=>document.querySelector(s), $$ = s=>Array.from(document.querySelectorAll(s));
const LS_CACHE = 'acl.published.cache';
const T = k => { const l = window.I18N ? I18N.lang : 'uz'; const d = {
  entry:{uz:'Admin kirish',ru:'Вход для администратора',en:'Admin sign-in'}, panel:{uz:'ADMIN PANEL — MENYULARNI BOSHQARISH',ru:'ПАНЕЛЬ АДМИНИСТРАТОРА — УПРАВЛЕНИЕ МЕНЮ',en:'ADMIN PANEL — MENU MANAGEMENT'},
  login:{uz:'Login yoki email',ru:'Логин или email',en:'Login or email'}, pass:{uz:'Parol',ru:'Пароль',en:'Password'}, signin:{uz:'Kirish',ru:'Войти',en:'Sign in'}, signout:{uz:'Chiqish',ru:'Выйти',en:'Sign out'}, reset:{uz:'Parolni tiklash',ru:'Сбросить пароль',en:'Reset password'},
  resetSent:{uz:'Parolni tiklash havolasi emailga yuborildi',ru:'Ссылка для сброса пароля отправлена на email',en:'Password reset link sent to your email'}, noBackend:{uz:'Admin tizimi uchun backend (Supabase) hali sozlanmagan. docs/ADMIN.md boʻyicha loyiha yarating va admin-config.js ga URL va anon kalitni kiriting.',ru:'Backend (Supabase) для админ-системы ещё не настроен. Создайте проект по docs/ADMIN.md и укажите URL и anon-ключ в admin-config.js.',en:'The admin backend (Supabase) is not configured yet. Create the project as described in docs/ADMIN.md and set the URL and anon key in admin-config.js.'},
  badCred:{uz:'Login yoki parol notoʻgʻri',ru:'Неверный логин или пароль',en:'Invalid login or password'}, notAdmin:{uz:'Ushbu hisobga administrator huquqi berilmagan',ru:'Этой учётной записи не назначена роль администратора',en:'This account has no administrator role'}, locked:{uz:'Koʻp urinish. Iltimos, 1 daqiqa kuting.',ru:'Слишком много попыток. Подождите 1 минуту.',en:'Too many attempts. Please wait 1 minute.'},
  open:{uz:'Ochiq',ru:'Открыто',en:'Open'}, closed:{uz:'Yopiq',ru:'Закрыто',en:'Closed'}, save:{uz:'Saqlash',ru:'Сохранить',en:'Save'}, publish:{uz:'Oʻzgarishlarni eʼlon qilish',ru:'Опубликовать изменения',en:'Publish changes'}, cancel:{uz:'Bekor qilish',ru:'Отменить',en:'Cancel'}, preview:{uz:'Foydalanuvchi koʻrinishi',ru:'Вид пользователя',en:'Public view'}, previewBtn:{uz:'Foydalanuvchi koʻrinishini tekshirish',ru:'Проверить вид пользователя',en:'Check public view'}, back:{uz:'Admin panelga qaytish',ru:'Вернуться в админ-панель',en:'Back to admin panel'}, history:{uz:'Oʻzgarishlar tarixi',ru:'История изменений',en:'Change history'}, restore:{uz:'Ushbu versiyani tiklash',ru:'Восстановить эту версию',en:'Restore this version'}, restorePrev:{uz:'Oldingi konfiguratsiyani tiklash',ru:'Восстановить предыдущую конфигурацию',en:'Restore previous configuration'},
  search:{uz:'Menyu elementini qidirish…',ru:'Поиск пункта меню…',en:'Search menu items…'}, expandAll:{uz:'Hammasini ochish',ru:'Развернуть всё',en:'Expand all'}, collapseAll:{uz:'Hammasini yigʻish',ru:'Свернуть всё',en:'Collapse all'}, draftSaved:{uz:'Qoralama saqlandi',ru:'Черновик сохранён',en:'Draft saved'}, published:{uz:'Oʻzgarishlar eʼlon qilindi (versiya #)',ru:'Изменения опубликованы (версия #)',en:'Changes published (version #)'}, noChanges:{uz:'Oʻzgarish yoʻq',ru:'Изменений нет',en:'No changes'},
  confirm:{uz:'Eʼlon qilinsinmi? Yopiladi: # ta asosiy boʻlim, # ta ichki boʻlim. Ochiladi: # ta asosiy boʻlim, # ta ichki boʻlim.',ru:'Опубликовать? Будет скрыто: # главных вкладок, # разделов. Будет открыто: # главных вкладок, # разделов.',en:'Publish? Hidden: # main tabs, # sections. Shown: # main tabs, # sections.'}, allHidden:{uz:'Diqqat: barcha asosiy boʻlimlar yopilmoqda — foydalanuvchilar hech qanday boʻlim koʻrmaydi.',ru:'Внимание: закрываются все главные вкладки — пользователи не увидят ни одного раздела.',en:'Warning: all main tabs are being closed — public users will see no sections.'},
  adminBadge:{uz:'ADMIN rejimi — yopiq boʻlimlar ham koʻrsatilmoqda',ru:'Режим ADMIN — показаны и закрытые разделы',en:'ADMIN mode — closed sections are shown too'}, hiddenTag:{uz:'Yopiq (faqat admin koʻradi)',ru:'Закрыто (видит только админ)',en:'Closed (admin only)'}, previewBanner:{uz:'Foydalanuvchi koʻrinishi — qoralama sozlamalar (eʼlon qilinmagan)',ru:'Вид пользователя — черновые настройки (не опубликовано)',en:'Public view — draft settings (not published)'},
  unavailable:{uz:'Ushbu boʻlim hozircha ochiq emas.',ru:'Этот раздел сейчас недоступен.',en:'This section is currently unavailable.'}, cfgUnavailable:{uz:'Konfiguratsiya xizmati vaqtincha mavjud emas. Qayta urinib koʻring.',ru:'Сервис конфигурации временно недоступен. Повторите попытку.',en:'The configuration service is temporarily unavailable. Please retry.'}, retry:{uz:'Qayta urinish',ru:'Повторить',en:'Retry'}, denied:{uz:'Ruxsat yoʻq: boʻlim yopiq',ru:'Доступ запрещён: раздел закрыт',en:'Access denied: section is closed'}, exportDenied:{uz:'Eksport cheklangan: yopiq modullar hisobotga kiritilmaydi',ru:'Экспорт ограничен: закрытые модули не включаются в отчёт',en:'Export restricted: closed modules are not included'},
  lastMod:{uz:'Oxirgi oʻzgarish',ru:'Последнее изменение',en:'Last modified'}, version:{uz:'Versiya',ru:'Версия',en:'Version'}, current:{uz:'joriy',ru:'текущая',en:'current'}, by:{uz:'kim',ru:'кто',en:'by'}, mainTab:{uz:'Asosiy boʻlim',ru:'Главная вкладка',en:'Main tab'}, sub:{uz:'Ichki boʻlim',ru:'Раздел',en:'Section'}, role:{uz:'Rol',ru:'Роль',en:'Role'}, sessionEnd:{uz:'Sessiya muddati tugadi. Qayta kiring.',ru:'Сессия истекла. Войдите снова.',en:'Session expired. Please sign in again.'}, policyNote:{uz:'Dashboard ichidagi yigʻma koʻrsatkichlar alohida boshqariladi: tegishli modul yopilganda ham ularni ochiq qoldirish yoki yopish adminning qaroridir.',ru:'Сводные показатели на Dashboard управляются отдельно: при закрытии модуля администратор решает, оставить их открытыми или закрыть.',en:'Aggregate indicators on the Dashboard are managed separately: when a module is closed, the administrator decides whether to keep them public.'}
}[k]; return d?(d[l]||d.uz):k; };

/* ---------------- 1. Reyestr ---------------- */
const REG = {list:[], byId:{}};
function buildRegistry(){
  REG.list=[]; REG.byId={};
  const add=(it)=>{ if(REG.byId[it.id]) return; REG.list.push(it); REG.byId[it.id]=it; };
  $$('.main-sidebar .mode-group[data-mode]').forEach((g,i)=>{
    const mode=g.dataset.mode; const btn=g.querySelector('.mode-btn'); const name=btn?btn.textContent.trim():mode;
    add({id:mode, parent:null, type:'main_tab', route:mode, name, order:i, el:g});
    let o=0;
    g.querySelectorAll('.section-nav .nav-item').forEach(n=>{
      if(n.dataset.target){ add({id:n.dataset.target, parent:mode, type:'sub_tab', route:n.dataset.target, name:n.textContent.trim(), order:o++, el:n}); }
      else if(n.dataset.level!==undefined){ const slug=(n.dataset.level||'all').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''); add({id:`${mode}.lvl.${slug}`, parent:mode, type:'sub_tab', route:n.dataset.level, name:n.textContent.trim(), order:o++, el:n}); }
    });
    // navigatsiyada boʻlmagan boʻlim sarlavhalari ham boshqariladi
    const panel=document.querySelector(({dashboard:'#modeDashboard',kompleks:'#modeKompleks',maxsus:'#modeMaxsus',xodim:'#modeXodim'})[mode]||'#none');
    if(panel) panel.querySelectorAll('.section-title[id]').forEach(st=>{ if(!REG.byId[st.id]) add({id:st.id, parent:mode, type:'section', route:st.id, name:st.textContent.trim(), order:o++, el:null}); });
  });
  // boʻlim bloklarini belgilash: section-title dan keyingi barcha elementlar keyingi sarlavhagacha
  ['#modeDashboard','#modeKompleks','#modeMaxsus','#modeXodim'].forEach(sel=>{ const p=$(sel); if(!p) return; let cur=null; Array.from(p.children).forEach(ch=>{ if(ch.classList.contains('section-title')&&ch.id){ cur=ch.id; } if(cur) ch.setAttribute('data-sec',cur); }); });
}

/* ---------------- 2. Holat ---------------- */
const ST = { published:{version:0,items:{}}, draft:null, admin:null, role:null, preview:false, ready:false, backend:false, sb:null, failed:false };
window.ACL = { state:ST, registry:REG, T, apply:()=>applyACL() };
const effectiveCfg = () => ST.preview && ST.draft ? ST.draft : ST.published;
ACL.visible = id => (ST.admin && !ST.preview) ? true : CORE.effective(effectiveCfg(), REG, id);
ACL.publicVisible = id => CORE.effective(effectiveCfg(), REG, id);
ACL.scopes = () => CORE.reportScopes((ST.admin&&!ST.preview)?{items:{}}:effectiveCfg(), REG);

/* ---------------- 3. Qoʻllash ---------------- */
function applyACL(){
  if(!ST.ready) return;
  const adminView = ST.admin && !ST.preview;
  document.documentElement.classList.toggle('acl-admin', !!adminView);
  REG.list.forEach(it=>{
    const pub = CORE.effective(effectiveCfg(), REG, it.id);
    const hide = !pub && !adminView;
    if(it.type==='main_tab'){
      it.el.classList.toggle('acl-hidden', hide); it.el.classList.toggle('acl-closed', !pub);
      const panel=$(({dashboard:'#modeDashboard',tashkilot:'#modeTashkilot',grafik:'#modeGrafik',kompleks:'#modeKompleks',maxsus:'#modeMaxsus',xodim:'#modeXodim'})[it.id]||'#none');
      if(panel){ panel.classList.toggle('acl-closed', !pub); }
    } else {
      if(it.el){ it.el.classList.toggle('acl-hidden', hide); it.el.classList.toggle('acl-closed', !pub); }
      if(it.type!=='sub_tab' || it.el && it.el.dataset.target){ $$(`[data-sec="${CSS.escape(it.id)}"]`).forEach(b=>{ b.classList.toggle('acl-hidden', hide); b.classList.toggle('acl-closed', !pub); }); }
    }
  });
  // yashirin embed darajalari: tanlangan daraja yopiq boʻlsa — «Barcha» ga qaytish
  ['tashkilot','grafik'].forEach(m=>{ const act=$(`.mode-group[data-mode="${m}"] .embed-nav .nav-item.active`); if(act && act.classList.contains('acl-hidden')){ const first=$(`.mode-group[data-mode="${m}"] .embed-nav .nav-item:not(.acl-hidden)`); if(first && typeof syncEmbedNav==='function'){ syncEmbedNav(m, first.dataset.level||''); const f=$(({tashkilot:'#frameTashkilot',grafik:'#frameGrafik'})[m]); if(f&&f.src) f.src=embedSrc(m)+'&r='+Date.now(); } } });
  // joriy boʻlim yopilgan boʻlsa — birinchi ochiq boʻlimga
  const cur = (typeof state!=='undefined') ? state.mode : null;
  if(cur && !ACL.visible(cur)){ const first=CORE.firstVisible(effectiveCfg(), REG); if(first) window.switchMode(first); else showUnavailable(); }
  else hideUnavailable();
  // yopiq boʻlim ichida admin koʻrsatkichi
  $$('.acl-tag').forEach(e=>e.remove());
  if(adminView){ $$('.section-title.acl-closed, .mode-btn').forEach(el=>{ const g=el.closest('.mode-group'); const closed = el.classList.contains('section-title') ? true : (g && g.classList.contains('acl-closed')); if(closed){ const t=document.createElement('span'); t.className='acl-tag'; t.textContent=T('hiddenTag'); el.appendChild(t); } }); }
  updateBanner(); updateReportUI();
  document.dispatchEvent(new CustomEvent('acl:applied'));
}
function showUnavailable(){ let u=$('#aclUnavailable'); if(!u){ u=document.createElement('div'); u.id='aclUnavailable'; u.className='panel'; u.setAttribute('data-i18n-skip',''); $('#appMain').appendChild(u); } u.innerHTML=`<div class="acl-empty"><div class="acl-empty-ic">🔒</div><div>${T('unavailable')}</div></div>`; u.style.display=''; Object.values(window.MODE_PANELS||{}).forEach(sel=>{ const p=$(sel); if(p) p.style.display='none'; }); }
function hideUnavailable(){ const u=$('#aclUnavailable'); if(u) u.style.display='none'; }
function updateBanner(){
  let b=$('#aclBanner'); if(!b){ b=document.createElement('div'); b.id='aclBanner'; b.setAttribute('data-i18n-skip',''); document.body.insertBefore(b, document.body.firstChild); }
  if(ST.preview){ b.className='acl-banner preview'; b.innerHTML=`<span>👁 ${T('previewBanner')}</span><button type="button" class="hbtn" id="aclBackBtn">${T('back')}</button>`; b.style.display='flex'; $('#aclBackBtn').onclick=()=>{ ST.preview=false; applyACL(); UI.open(); }; }
  else if(ST.admin){ b.className='acl-banner admin'; b.innerHTML=`<span>🛡 ${T('adminBadge')} · ${ST.admin.email} (${ST.role})</span><span class="acl-banner-btns"><button type="button" class="hbtn" id="aclPanelBtn">${T('panel').split('—')[0].trim()}</button><button type="button" class="hbtn" id="aclOutBtn">${T('signout')}</button></span>`; b.style.display='flex'; $('#aclPanelBtn').onclick=()=>UI.open(); $('#aclOutBtn').onclick=()=>AUTH.signOut(); }
  else b.style.display='none';
}

/* ---------------- 4. Marshrut va eksport nazorati ---------------- */
function guardRoutes(){
  const _sm = window.switchMode;
  window.switchMode = function(m){
    if(ST.ready && !ACL.visible(m)){ const first=CORE.firstVisible(effectiveCfg(), REG); if(typeof toast==='function') toast(T('denied')); if(first && first!==m) return _sm(first); showUnavailable(); return; }
    hideUnavailable(); return _sm.apply(this, arguments);
  };
  if(typeof window.dbOpenInst==='function'){ const o=window.dbOpenInst; window.dbOpenInst=function(page, params){ const m=page==='timeline'?'grafik':'tashkilot'; if(ST.ready && !ACL.visible(m)){ toast(T('denied')); return; } return o.apply(this, arguments); }; }
  if(typeof window.dbGo==='function'){ const o=window.dbGo; window.dbGo=function(what){ const m = /^inst-/.test(what)?'tashkilot':/^komp-/.test(what)?'kompleks':/^mx-/.test(what)?'maxsus':null; if(m && ST.ready && !ACL.visible(m)){ toast(T('denied')); return; } return o.apply(this, arguments); }; }
  if(typeof window.loadEmbed==='function'){ const o=window.loadEmbed; window.loadEmbed=function(m){ if(ST.ready && !ACL.visible(m)) return; return o.apply(this, arguments); }; }
  // hisobotlar: yopiq modullar chiqarib tashlanadi
  if(typeof window.buildReportBody==='function'){ const o=window.buildReportBody; window.buildReportBody=function(scope){ const sc=ACL.scopes(); if(scope!=='all' && sc[scope]===false){ toast(T('exportDenied')); return ''; } if(scope==='all'){ const parts=[]; const xml=o('all'); if(sc.kompleks && sc.maxsus && sc.xodim) return xml; let body=''; const titleMap={all:'Davlat akkreditatsiyasi monitoringi — tahliliy hisobot'}; body+=docTitle(titleMap.all, `Taʼlim sifatini taʼminlash milliy agentligi · tayyorlangan sana: ${_dstr()}`); if(sc.maxsus) body+=reportMaxsus(); if(sc.kompleks) body+=reportKompleks(); if(sc.xodim) body+=reportXodim(); toast(T('exportDenied')); return body; } return o.apply(this, arguments); }; }
  if(typeof window.dbReportData==='function'){ const o=window.dbReportData; window.dbReportData=function(){ const R=o.apply(this, arguments); const sc=ACL.scopes(); if(!sc.inst){ R.regs=[]; R.edus=[]; R.years=[]; R.kpi=R.kpi.filter(k=>!/tashkilot/i.test(k[2])); } if(!sc.kompleks){ R.stages=[]; R.kpi=R.kpi.filter(k=>!/^Kompleks/.test(k[0])); R.recon=R.recon.filter(r=>!/^Kompleks/.test(r[0])); } if(!sc.maxsus){ R.kpi=R.kpi.filter(k=>!/^Maxsus/.test(k[0])); R.recon=R.recon.filter(r=>!/^Maxsus/.test(r[0])); } return R; }; }
  if(window.RP && typeof RP.generate==='function'){ const o=RP.generate; RP.generate=async function(f){ const sc=ACL.scopes(); const need={r1:sc.inst,r2:sc.kompleks,r3:sc.maxsus,all:(sc.inst||sc.kompleks||sc.maxsus)}; if(f && need[f.type]===false){ throw new Error(T('exportDenied')); } if(f && f.type==='all' && !(sc.inst&&sc.kompleks&&sc.maxsus)){ const doc=await o.call(this, f); return doc; } return o.apply(this, arguments); }; }
  // Umumlashtirilgan hisobotda yopiq modul boʻlimlari chiqarilmaydi
  if(window.RP){ ['buildR1','buildR2','buildR3'].forEach((fn,i)=>{ const o=RP[fn]; if(!o) return; RP[fn]=function(f,doc,part){ const sc=ACL.scopes(); const ok=[sc.inst,sc.kompleks,sc.maxsus][i]; if(!ok){ const d=doc||RP.doc({lang:f.lang,title:''}); if(part){ RP.h(d, part, RP.S(f.lang,{uc:'Боʻлим ёпиқ',ru:'Раздел закрыт',en:'Section closed'})); RP.p(d,[RP.S(f.lang,{uc:'Ушбу модул маълумотлари оммавий эълон қилинмаган.',ru:'Данные этого модуля не опубликованы для общего доступа.',en:'Data of this module is not published for public access.'})]); } return d; } return o.apply(this, arguments); }; }); }
}
function updateReportUI(){
  const sc=ACL.scopes();
  const sel=$('#rp_type'); if(sel){ [...sel.options].forEach(op=>{ const ok={r1:sc.inst,r2:sc.kompleks,r3:sc.maxsus,all:true}[op.value]; op.disabled=!ok; op.hidden=!ok; }); if(sel.options[sel.selectedIndex] && sel.options[sel.selectedIndex].disabled){ sel.value='all'; sel.dispatchEvent(new Event('change')); } }
  ['dbWord','dbPdf','dbExcel','reportWordBtn','reportPdfBtn'].forEach(id=>{ const b=$('#'+id); if(!b) return; const anyPublic = sc.inst||sc.kompleks||sc.maxsus||sc.xodim; b.disabled=!anyPublic; });
}

/* ---------------- 5. Backend (Supabase) ---------------- */
const BE = {
  configured(){ return !!(CFG.url && CFG.anonKey); },
  async client(){
    if(ST.sb) return ST.sb;
    if(!this.configured()) return null;
    if(!window.supabase){ await new Promise((res,rej)=>{ const s=document.createElement('script'); s.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.min.js'; s.onload=res; s.onerror=()=>rej(new Error('supabase-js load failed')); document.head.appendChild(s); }); }
    ST.sb = window.supabase.createClient(CFG.url, CFG.anonKey, {auth:{persistSession:true, autoRefreshToken:true, detectSessionInUrl:true}});
    return ST.sb;
  },
  async loadPublished(){
    const sb=await this.client(); if(!sb) return null;
    const {data,error}=await sb.from('menu_config').select('version,config,published_at,published_by,note').eq('is_current',true).maybeSingle();
    if(error) throw error; if(!data) return {version:0,items:{}};
    return Object.assign({version:data.version, published_at:data.published_at, note:data.note}, CORE.normalize(data.config));
  },
  async history(){ const sb=await this.client(); const {data,error}=await sb.from('menu_config').select('version,config,is_current,published_at,note,published_by').order('version',{ascending:false}).limit(30); if(error) throw error; return data; },
  async audit(){ const sb=await this.client(); const {data,error}=await sb.from('audit_log').select('*').order('created_at',{ascending:false}).limit(100); if(error) throw error; return data; },
  async publish(cfg, note, action){ const sb=await this.client(); const {data,error}=await sb.rpc('publish_config',{p_config:{items:CORE.normalize(cfg).items}, p_note:note||null, p_action:action||'publish'}); if(error) throw error; return data; },
  async saveDraft(cfg){ const sb=await this.client(); const {error}=await sb.from('menu_drafts').upsert({user_id:ST.admin.id, config:{items:CORE.normalize(cfg).items}, updated_at:new Date().toISOString()}); if(error) throw error; },
  async loadDraft(){ const sb=await this.client(); const {data}=await sb.from('menu_drafts').select('config,updated_at').eq('user_id',ST.admin.id).maybeSingle(); return data?CORE.normalize(data.config):null; },
  async syncRegistry(){ try{ const sb=await this.client(); const rows=REG.list.map(it=>({id:it.id,parent_id:it.parent,item_type:it.type,route_key:String(it.route),display_name:it.name,display_order:it.order,updated_by:ST.admin.id})); await sb.from('menu_items').upsert(rows,{onConflict:'id'}); }catch(e){ console.warn('menu_items sync', e.message); } }
};

/* ---------------- 6. Autentifikatsiya ---------------- */
const AUTH = {
  fails:0, lockUntil:0, timer:null,
  async init(){ const sb=await BE.client(); if(!sb) return; const {data}=await sb.auth.getSession(); if(data&&data.session) await this.afterLogin(data.session.user); sb.auth.onAuthStateChange((ev,sess)=>{ if(ev==='SIGNED_OUT'){ this.clear(); } }); },
  async signIn(email, pass){
    if(Date.now()<this.lockUntil) throw new Error(T('locked'));
    const sb=await BE.client(); const {data,error}=await sb.auth.signInWithPassword({email, password:pass});
    if(error){ this.fails++; if(this.fails>=5){ this.lockUntil=Date.now()+60000; this.fails=0; } throw new Error(T('badCred')); }
    this.fails=0; await this.afterLogin(data.user);
  },
  async afterLogin(user){
    const sb=await BE.client(); const {data:role}=await sb.rpc('my_role');
    if(!role || !['super_admin','admin'].includes(role)){ await sb.auth.signOut(); throw new Error(T('notAdmin')); }
    ST.admin=user; ST.role=role; this.touch(); ['click','keydown','touchstart'].forEach(ev=>document.addEventListener(ev, ()=>this.touch(), {passive:true}));
    BE.syncRegistry(); ST.draft = (await BE.loadDraft()) || CORE.normalize(ST.published); applyACL();
  },
  touch(){ clearTimeout(this.timer); const min=CFG.sessionMinutes||60; this.timer=setTimeout(()=>{ if(ST.admin){ this.signOut(); toast(T('sessionEnd')); } }, min*60000); },
  async signOut(){ const sb=await BE.client(); if(sb) await sb.auth.signOut(); this.clear(); },
  clear(){ ST.admin=null; ST.role=null; ST.preview=false; ST.draft=null; clearTimeout(this.timer); const m=$('#adminModal'); if(m) m.remove(); applyACL(); },
  async reset(email){ const sb=await BE.client(); const {error}=await sb.auth.resetPasswordForEmail(email,{redirectTo:location.href.split('?')[0]}); if(error) throw error; }
};
window.ACL.auth=AUTH;

/* ---------------- 7. UI: kirish va panel ---------------- */
const UI = {
  loginModal(){
    let m=$('#adminModal'); if(m) m.remove();
    m=document.createElement('div'); m.id='adminModal'; m.className='acl-modal'; m.setAttribute('role','dialog'); m.setAttribute('aria-modal','true'); m.setAttribute('data-i18n-skip','');
    if(!BE.configured()){ m.innerHTML=`<div class="acl-card"><h3>${T('entry')}<button type="button" class="mini-btn acl-x" aria-label="×">✕</button></h3><p class="acl-note">${T('noBackend')}</p></div>`; document.body.appendChild(m); m.querySelector('.acl-x').onclick=()=>m.remove(); return; }
    m.innerHTML=`<form class="acl-card" autocomplete="on"><h3>${T('entry')}<button type="button" class="mini-btn acl-x" aria-label="×">✕</button></h3>
      <label>${T('login')}<input type="email" name="email" required autocomplete="username"></label>
      <label>${T('pass')}<input type="password" name="password" required autocomplete="current-password" minlength="6"></label>
      <div class="acl-err" aria-live="polite"></div>
      <div class="acl-actions"><button type="submit" class="hbtn acl-primary">${T('signin')}</button><button type="button" class="hbtn acl-reset">${T('reset')}</button></div></form>`;
    document.body.appendChild(m); m.querySelector('.acl-x').onclick=()=>m.remove(); m.querySelector('input').focus();
    m.addEventListener('keydown',e=>{ if(e.key==='Escape') m.remove(); });
    const err=m.querySelector('.acl-err'); const form=m.querySelector('form');
    form.onsubmit=async e=>{ e.preventDefault(); err.textContent=''; const b=form.querySelector('[type=submit]'); b.disabled=true; try{ await AUTH.signIn(form.email.value.trim(), form.password.value); m.remove(); this.open(); }catch(ex){ err.textContent=ex.message||String(ex); } b.disabled=false; };
    m.querySelector('.acl-reset').onclick=async()=>{ const em=form.email.value.trim(); if(!em){ err.textContent=T('login'); return; } try{ await AUTH.reset(em); err.textContent=T('resetSent'); }catch(ex){ err.textContent=ex.message; } };
  },
  open(){
    if(!ST.admin){ this.loginModal(); return; }
    if(!ST.draft) ST.draft=CORE.normalize(ST.published);
    let m=$('#adminPanel'); if(m) m.remove();
    m=document.createElement('div'); m.id='adminPanel'; m.className='acl-modal'; m.setAttribute('role','dialog'); m.setAttribute('aria-modal','true'); m.setAttribute('data-i18n-skip','');
    m.innerHTML=`<div class="acl-panel"><div class="acl-head"><h3>${T('panel')}</h3><div class="acl-head-r"><span class="acl-user">${ST.admin.email} · ${T('role')}: ${ST.role} · ${T('version')}: ${ST.published.version||0}</span><button type="button" class="mini-btn acl-x" aria-label="×">✕</button></div></div>
      <div class="acl-tools"><input type="search" class="acl-search" placeholder="${T('search')}" aria-label="${T('search')}"><button type="button" class="mini-btn" data-act="expand">${T('expandAll')}</button><button type="button" class="mini-btn" data-act="collapse">${T('collapseAll')}</button><button type="button" class="mini-btn" data-act="history">🕘 ${T('history')}</button></div>
      <p class="acl-note">${T('policyNote')}</p>
      <div class="acl-tree"></div>
      <div class="acl-foot"><span class="acl-status"></span><div class="acl-foot-btns"><button type="button" class="hbtn" data-act="preview">👁 ${T('previewBtn')}</button><button type="button" class="hbtn" data-act="save">${T('save')}</button><button type="button" class="hbtn" data-act="cancel">${T('cancel')}</button><button type="button" class="hbtn acl-primary" data-act="publish">${T('publish')}</button></div></div></div>`;
    document.body.appendChild(m);
    m.querySelector('.acl-x').onclick=()=>m.remove(); m.addEventListener('keydown',e=>{ if(e.key==='Escape') m.remove(); });
    this.renderTree(m); this.status(m);
    m.querySelector('.acl-search').oninput=e=>{ const q=e.target.value.toLowerCase(); m.querySelectorAll('.acl-row').forEach(r=>{ r.style.display = !q || r.dataset.name.includes(q) ? '' : 'none'; }); if(q) m.querySelectorAll('.acl-group').forEach(g=>g.classList.add('open')); };
    m.querySelector('[data-act="expand"]').onclick=()=>m.querySelectorAll('.acl-group').forEach(g=>g.classList.add('open'));
    m.querySelector('[data-act="collapse"]').onclick=()=>m.querySelectorAll('.acl-group').forEach(g=>g.classList.remove('open'));
    m.querySelector('[data-act="history"]').onclick=()=>this.history();
    m.querySelector('[data-act="preview"]').onclick=()=>{ ST.preview=true; m.remove(); applyACL(); window.scrollTo(0,0); };
    m.querySelector('[data-act="save"]').onclick=async()=>{ try{ await BE.saveDraft(ST.draft); toast(T('draftSaved')); this.status(m); }catch(e){ toast(e.message); } };
    m.querySelector('[data-act="cancel"]').onclick=()=>{ ST.draft=CORE.normalize(ST.published); this.renderTree(m); this.status(m); };
    m.querySelector('[data-act="publish"]').onclick=()=>this.publish(m);
  },
  renderTree(m){
    const tree=m.querySelector('.acl-tree'); tree.innerHTML='';
    const mains=REG.list.filter(x=>x.type==='main_tab').sort((a,b)=>a.order-b.order);
    const row=(it,depth)=>{ const own=CORE.own(ST.draft,it.id); const eff=CORE.effective(ST.draft,REG,it.id); const pubOwn=CORE.own(ST.published,it.id); const changed=own!==pubOwn; return `<div class="acl-row d${depth}${changed?' changed':''}" data-id="${it.id}" data-name="${(it.name+' '+it.id).toLowerCase()}"><span class="acl-name">${it.name}<small>${it.type==='main_tab'?T('mainTab'):T('sub')} · ${it.id}</small></span><span class="acl-eff ${eff?'on':'off'}">${eff?T('open'):T('closed')}</span><button type="button" class="acl-switch" role="switch" aria-checked="${own}" aria-label="${it.name}"><span class="acl-knob"></span><span class="acl-sw-lbl">${own?'ON':'OFF'}</span></button></div>`; };
    mains.forEach(mt=>{ const kids=REG.list.filter(x=>x.parent===mt.id).sort((a,b)=>a.order-b.order); const g=document.createElement('div'); g.className='acl-group open'; g.innerHTML=`<div class="acl-group-head"><button type="button" class="acl-caret" aria-label="▾">▾</button>${row(mt,0)}</div><div class="acl-kids">${kids.map(k=>row(k,1)).join('')}</div>`; tree.appendChild(g); g.querySelector('.acl-caret').onclick=()=>g.classList.toggle('open'); });
    tree.querySelectorAll('.acl-switch').forEach(sw=>sw.onclick=()=>{ const id=sw.closest('.acl-row').dataset.id; const cur=CORE.own(ST.draft,id); ST.draft=CORE.setVisible(ST.draft,id,!cur); this.renderTree(m); this.status(m); });
  },
  status(m){ const s=CORE.summary(ST.published, ST.draft, REG); const el=m.querySelector('.acl-status'); el.textContent = s.changes.length ? `${s.changes.length} ${T('noChanges').includes('yoʻq')?'ta oʻzgarish':'changes'} · ${T('closed')}: ${s.mainsHidden}/${s.childrenHidden} · ${T('open')}: ${s.mainsShown}/${s.childrenShown}` : T('noChanges'); },
  async publish(m){
    const s=CORE.summary(ST.published, ST.draft, REG);
    if(!s.changes.length){ toast(T('noChanges')); return; }
    let msg=T('confirm'); [s.mainsHidden,s.childrenHidden,s.mainsShown,s.childrenShown].forEach(n=>{ msg=msg.replace('#',String(n)); });
    if(!CORE.firstVisible(ST.draft, REG)) msg += '\n\n'+T('allHidden');
    if(!confirm(msg)) return;
    try{ const v=await BE.publish(ST.draft, `publish by ${ST.admin.email}`, 'publish'); ST.published=Object.assign({version:v}, CORE.normalize(ST.draft)); cache(ST.published); ST.preview=false; toast(T('published').replace('#',v)); applyACL(); this.renderTree(m); this.status(m); m.querySelector('.acl-user').textContent=`${ST.admin.email} · ${T('role')}: ${ST.role} · ${T('version')}: ${v}`; }catch(e){ toast((e.message||e)); }
  },
  async history(){
    let h=$('#adminHistory'); if(h) h.remove();
    h=document.createElement('div'); h.id='adminHistory'; h.className='acl-modal'; h.setAttribute('data-i18n-skip',''); h.innerHTML=`<div class="acl-panel"><div class="acl-head"><h3>${T('history')}</h3><button type="button" class="mini-btn acl-x">✕</button></div><div class="acl-hist">…</div></div>`; document.body.appendChild(h); h.querySelector('.acl-x').onclick=()=>h.remove();
    try{ const [vers,audit]=await Promise.all([BE.history(), BE.audit()]); const box=h.querySelector('.acl-hist');
      box.innerHTML=`<table class="acl-table"><thead><tr><th>${T('version')}</th><th>${T('lastMod')}</th><th>${T('by')}</th><th></th><th></th></tr></thead><tbody>${vers.map(v=>`<tr><td>#${v.version}${v.is_current?' <b>('+T('current')+')</b>':''}</td><td>${new Date(v.published_at).toLocaleString()}</td><td>${v.note||''}</td><td>${Object.keys(v.config.items||{}).length} ${T('closed').toLowerCase()}</td><td>${v.is_current?'':`<button type="button" class="mini-btn" data-restore="${v.version}">${T('restore')}</button>`}</td></tr>`).join('')}</tbody></table>
        <h4 style="margin:14px 0 6px">Audit</h4><div class="acl-audit">${audit.map(a=>`<div class="acl-audit-row"><span>${new Date(a.created_at).toLocaleString()}</span><span>${a.admin_email||a.admin_id||''}</span><span><b>${a.action}</b> ${a.item_id?('· '+(REG.byId[a.item_id]?REG.byId[a.item_id].name:a.item_id)):''}</span><span>v${a.config_version||''}</span></div>`).join('')||'—'}</div>`;
      box.querySelectorAll('[data-restore]').forEach(b=>b.onclick=async()=>{ const v=vers.find(x=>String(x.version)===b.dataset.restore); if(!v||!confirm(T('restore')+` #${v.version}?`)) return; try{ const nv=await BE.publish(CORE.normalize(v.config), `restore of #${v.version}`, 'restore'); ST.published=Object.assign({version:nv}, CORE.normalize(v.config)); ST.draft=CORE.normalize(ST.published); cache(ST.published); toast(T('published').replace('#',nv)); applyACL(); h.remove(); const p=$('#adminPanel'); if(p){ this.renderTree(p); this.status(p); } }catch(e){ toast(e.message); } });
    }catch(e){ h.querySelector('.acl-hist').textContent=e.message; }
  }
};
window.ACL.ui=UI;
function cache(cfg){ try{ localStorage.setItem(LS_CACHE, JSON.stringify({version:cfg.version, items:cfg.items, at:Date.now()})); }catch(e){} }

/* ---------------- 8. Ishga tushirish ---------------- */
function mountEntry(){
  if($('#adminEntry')) return;
  const f=document.createElement('footer'); f.className='app-footer'; f.setAttribute('data-i18n-skip',''); f.innerHTML=`<span>© NQAAE · ${new Date().getFullYear()}</span><button type="button" id="adminEntry" class="acl-entry">🔐 <span>${T('entry')}</span></button>`;
  const layout=$('.app-layout'); (layout?layout.parentNode:document.body).insertBefore(f, layout?layout.nextSibling:null);
  $('#adminEntry').onclick=()=>UI.open();
  document.addEventListener('i18n:change',()=>{ const s=$('#adminEntry span'); if(s) s.textContent=T('entry'); updateBanner(); });
}
function loadingState(on){ document.documentElement.classList.toggle('acl-loading', on); }
async function boot(){
  buildRegistry(); mountEntry(); guardRoutes();
  loadingState(true);
  if(!BE.configured()){ ST.backend=false; ST.published={version:0,items:{}}; ST.ready=true; loadingState(false); applyACL(); return; }
  ST.backend=true;
  try{ const cfg=await BE.loadPublished(); ST.published=cfg; cache(cfg); ST.failed=false; }
  catch(e){ console.warn('ACL config load failed', e); let c=null; try{ c=JSON.parse(localStorage.getItem(LS_CACHE)); }catch(x){} if(c && c.items){ ST.published={version:c.version||0, items:c.items}; } else { ST.failed=true; ST.published={version:0, items:Object.fromEntries(REG.list.filter(x=>x.type==='main_tab').map(x=>[x.id,{v:false}]))}; } }
  ST.ready=true; loadingState(false); applyACL();
  if(ST.failed){ const u=$('#aclUnavailable'); if(u) u.innerHTML=`<div class="acl-empty"><div class="acl-empty-ic">⚠</div><div>${T('cfgUnavailable')}</div><button type="button" class="hbtn" onclick="location.reload()">${T('retry')}</button></div>`; }
  try{ await AUTH.init(); }catch(e){ console.warn('auth init', e); }
  // real vaqtda yangilanish: boshqa admin eʼlon qilsa — barcha ochiq sahifalar yangilanadi
  try{ const sb=await BE.client(); sb.channel('menu_config').on('postgres_changes',{event:'*',schema:'public',table:'menu_config'}, async()=>{ try{ const cfg=await BE.loadPublished(); if(!CORE.equal(cfg, ST.published) || cfg.version!==ST.published.version){ ST.published=cfg; cache(cfg); if(!ST.preview) applyACL(); } }catch(e){} }).subscribe(); }catch(e){}
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', ()=>setTimeout(boot, 150)); else setTimeout(boot, 150);
})();
