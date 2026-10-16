/* =====================================================================
   NQAAE monitoring — ACL yadro mantigʻi (sof funksiyalar; testlanadi)
   Reyestr: {id, parent, type:'main_tab'|'sub_tab'|'section', route, name, order}
   Konfiguratsiya: {version, items:{[id]:{v:boolean}}}  — yoʻq element = koʻrinadi
   ===================================================================== */
(function(root){
"use strict";
const ACLCore = {
  // elementning oʻz holati (standart: ochiq)
  own(cfg, id){ const it = cfg && cfg.items && cfg.items[id]; return !(it && it.v === false); },
  // samarali koʻrinish = oʻzi VA barcha ajdodlari
  effective(cfg, registry, id){
    let cur = registry.byId[id]; if(!cur) return true;
    while(cur){ if(!this.own(cfg, cur.id)) return false; cur = cur.parent ? registry.byId[cur.parent] : null; }
    return true;
  },
  // birinchi koʻrinadigan asosiy boʻlim (tartib boʻyicha)
  firstVisible(cfg, registry){
    const mains = registry.list.filter(x=>x.type==='main_tab').sort((a,b)=>a.order-b.order);
    const hit = mains.find(m=>this.effective(cfg, registry, m.id)); return hit ? hit.id : null;
  },
  // ota yashirilganda bolalar sozlamasi saqlanadi — faqat otaning v maydoni oʻzgaradi
  setVisible(cfg, id, v){
    const next = {version:cfg.version||0, items:Object.assign({}, cfg.items||{})};
    if(v) delete next.items[id]; else next.items[id] = {v:false};
    return next;
  },
  // ikki konfiguratsiya orasidagi farq (eʼlon qilishdan oldingi xulosa va audit uchun)
  diff(prev, next, registry){
    const out = [];
    registry.list.forEach(it=>{
      const a = this.own(prev, it.id), b = this.own(next, it.id);
      if(a!==b) out.push({id:it.id, type:it.type, name:it.name, from:a, to:b});
    });
    return out;
  },
  summary(prev, next, registry){
    const d = this.diff(prev, next, registry);
    return { mainsHidden:d.filter(x=>x.type==='main_tab'&&!x.to).length, mainsShown:d.filter(x=>x.type==='main_tab'&&x.to).length,
             childrenHidden:d.filter(x=>x.type!=='main_tab'&&!x.to).length, childrenShown:d.filter(x=>x.type!=='main_tab'&&x.to).length, changes:d };
  },
  // hisobot modullari ↔ asosiy boʻlimlar bogʻliqligi (eksportlarda cheklov)
  reportScopes(cfg, registry){
    const e = id => this.effective(cfg, registry, id);
    return { inst: e('tashkilot') || e('grafik'), kompleks: e('kompleks'), maxsus: e('maxsus'), xodim: e('xodim'), dashboard: e('dashboard') };
  },
  normalize(cfg){
    const out = {version:(cfg&&cfg.version)||0, items:{}};
    const items = (cfg && cfg.items) || {};
    Object.keys(items).forEach(k=>{ if(items[k] && items[k].v===false) out.items[k]={v:false}; });
    return out;
  },
  equal(a,b){ const ka=Object.keys(this.normalize(a).items).sort(), kb=Object.keys(this.normalize(b).items).sort(); return ka.length===kb.length && ka.every((k,i)=>k===kb[i]); }
};
root.ACLCore = ACLCore;
})(typeof window!=='undefined'?window:globalThis);
