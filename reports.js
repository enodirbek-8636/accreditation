/* =====================================================================
   NQAAE monitoring — AVTOMATLASHTIRILGAN TAHLILIY HISOBOT DVIGATELI
   Yagona hujjat modeli → DOCX (OOXML) · HTML koʻrish (A4) · PDF (chop etish)
   Dizayn standarti: «Сертификатлаш ДЗ 14.10.26_1.docx» dan dasturiy
   ajratib olingan xususiyatlar (RP.DS). Matn va diagrammalar bitta
   hisoblangan koʻrsatkichlar toʻplamidan (RP.calc*) hosil qilinadi.
   ===================================================================== */
(function(){
"use strict";
const RP = window.RP = window.RP || {};

/* ---------- 1. DIZAYN STANDARTI (namunadan ajratilgan) ---------- */
RP.DS = {
  font:'Calibri', fontAlt:'Calibri, "Segoe UI", Arial, sans-serif',
  szBody:30, szSmall:26, szHeader:26,            // yarim punkt: 15 / 13 / 13 pt
  color:{black:'000000', red:'C00000', blue:'0070C0', navy:'1F3864', grey:'595959'},
  boxFill:'E2EFDA', boxFill2:'EAF1DD',
  firstLine:709, lineBody:259, lineBox:252, afterBody:120, afterTitle:200,
  page:{w:11906,h:16838, top:850,right:850,bottom:850,left:1417, header:454, footer:720},
  chartCm:16.5,
  chart:{ red:'#C00000', blue:'#0070C0', navy:'#1F3864', grey:'#D9D9D9', gold:'#FFC000', green:'#2E9E44', greenL:'#9BCB8F', redL:'#E36C6C', redXL:'#F2A8A8', axis:'#7F7F7F', text:'#404040', title:'#1F3864' }
};

/* ---------- 2. TIL YORDAMCHILARI ---------- */
const CYR2LAT = {'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'yo','ж':'j','з':'z','и':'i','й':'y','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f','х':'x','ц':'ts','ч':'ch','ш':'sh','щ':'sh','ъ':'ʼ','ы':'i','ь':'','э':'e','ю':'yu','я':'ya','ў':'oʻ','қ':'q','ғ':'gʻ','ҳ':'h'};
const VOW = 'аеёиоуэюяўАЕЁИОУЭЮЯЎ';
RP.translit = function(s){
  if(!s) return s; let out='';
  for(let i=0;i<s.length;i++){
    const ch=s[i], lo=ch.toLowerCase(), up=ch!==lo;
    let r=CYR2LAT[lo];
    if(r===undefined){ out+=ch; continue; }
    if(lo==='е'){ const prev=i>0?s[i-1]:''; if(i===0 || !/[\p{L}]/u.test(prev) || VOW.includes(prev) || prev==='ъ' || prev==='ь') r='ye'; }
    if(lo==='ц'){ const prev=i>0?s[i-1]:''; if(i===0 || !/[\p{L}]/u.test(prev)) r='s'; }
    if(up){ const next=s[i+1]||''; const nextUp = next && next===next.toUpperCase() && next!==next.toLowerCase(); r = nextUp ? r.toUpperCase() : r.charAt(0).toUpperCase()+r.slice(1); }
    out+=r;
  }
  return out;
};
// lotin yorliq → kirill (asosiy atamalar lugʻati, qolgani — transliteratsiya)
const UZC = {
  "Qoraqalpogʻiston Respublikasi":"Қорақалпоғистон Республикаси","Andijon viloyati":"Андижон вилояти","Buxoro viloyati":"Бухоро вилояти","Fargʻona viloyati":"Фарғона вилояти","Jizzax viloyati":"Жиззах вилояти","Namangan viloyati":"Наманган вилояти","Navoiy viloyati":"Навоий вилояти","Qashqadaryo viloyati":"Қашқадарё вилояти","Samarqand viloyati":"Самарқанд вилояти","Sirdaryo viloyati":"Сирдарё вилояти","Surxondaryo viloyati":"Сурхондарё вилояти","Toshkent viloyati":"Тошкент вилояти","Xorazm viloyati":"Хоразм вилояти","Toshkent shahri":"Тошкент шаҳри",
  "Qoraqalpogʻiston R.":"Қорақалпоғистон Р.","Andijon":"Андижон","Buxoro":"Бухоро","Fargʻona":"Фарғона","Jizzax":"Жиззах","Namangan":"Наманган","Navoiy":"Навоий","Qashqadaryo":"Қашқадарё","Samarqand":"Самарқанд","Sirdaryo":"Сирдарё","Surxondaryo":"Сурхондарё","Toshkent":"Тошкент вил.","Xorazm":"Хоразм","Toshkent sh.":"Тошкент ш.",
  "Oliy taʼlim":"Олий таълим","Kasbiy taʼlim":"Касбий таълим","Oʻrta maxsus taʼlim":"Ўрта махсус таълим","Oliy taʼlimdan keyingi taʼlim":"Олий таълимдан кейинги таълим","Malaka oshirish va qayta tayyorlash":"Малака ошириш ва қайта тайёрлаш","Boshqa":"Бошқа",
  "Oliy ta'lim":"Олий таълим","Kasbiy ta'lim":"Касбий таълим","O'rta maxsus":"Ўрта махсус","Oliy ta'limdan keyingi ta'lim":"Олий таълимдан кейинги таълим",
  "Davlat":"Давлат","Nodavlat":"Нодавлат","Xorijiy":"Хорижий","Aniqlanmagan":"Аниқланмаган",
  "Amalda":"Амалда","Muddati yaqin":"Муддати яқин","Muddati oʻtgan":"Муддати ўтган","Jarayonda":"Жараёнда","Maʼlumot yetarli emas":"Маълумот етарли эмас","Tugatilgan":"Тугатилган",
  "Ariza koʻrib chiqish":"Ариза кўриб чиқиш","Ariza rasmiylashtirish":"Ариза расмийлаштириш","Ichki baholash":"Ички баҳолаш","Tashqi baholash":"Ташқи баҳолаш","Yakunlangan":"Якунланган",
  "Akkreditatsiyadan oʻtgan":"Аккредитациядан ўтган","Akkreditatsiyadan oʻtmagan":"Аккредитациядан ўтмаган","Akkreditatsiyadan oʻtolmagan":"Аккредитациядан ўтолмаган","Oʻtgan":"Ўтган","Oʻtmagan":"Ўтмаган",
  "Bakalavr":"Бакалавр","Magistratura":"Магистратура","Doktorantura":"Докторантура",
  "Biznes, boshqaruv va huquq":"Бизнес, бошқарув ва ҳуқуқ","Muhandislik, ishlov berish va qurilish sohalari":"Муҳандислик, ишлов бериш ва қурилиш соҳалари","Axborot-kommunikatsiya texnologiyalari":"Ахборот-коммуникация технологиялари","Xizmatlar":"Хизматлар","Sanʼat va gumanitar fanlar":"Санъат ва гуманитар фанлар","Taʼlim":"Таълим","Tabiiy fanlar, matematika va statistika":"Табиий фанлар, математика ва статистика","Sogʻliqni saqlash va ijtimoiy taʼminot":"Соғлиқни сақлаш ва ижтимоий таъминот","Qishloq, oʻrmon, baliq xoʻjaligi va veterinariya":"Қишлоқ, ўрмон, балиқ хўжалиги ва ветеринария","Ijtimoiy fanlar, jurnalistika va axborot":"Ижтимоий фанлар, журналистика ва ахборот","Iqtisodiyot fanlari":"Иқтисодиёт фанлари","Pedagogika fanlari":"Педагогика фанлари","Filologiya fanlari":"Филология фанлари","Xorijiy filologiya":"Хорижий филология","Tibbiyot fanlari":"Тиббиёт фанлари","Ijtimoiy-gumanitar fanlar":"Ижтимоий-гуманитар фанлар","Texnika fanlari":"Техника фанлари","Aniq fanlar":"Аниқ фанлар",
  "Kunduzgi":"Кундузги","Sirtqi":"Сиртқи","Kechki":"Кечки","Masofaviy":"Масофавий"
};
const LAT2CYR_PAIRS = [['oʻ','ў'],["o'",'ў'],['o‘','ў'],['gʻ','ғ'],["g'",'ғ'],['g‘','ғ'],['sh','ш'],['ch','ч'],['ng','нг'],['yo','ё'],['yu','ю'],['ya','я'],['ye','е'],['ts','ц'],['ʼ','ъ'],['’','ъ'],["'",'ъ'],['a','а'],['b','б'],['d','д'],['e','е'],['f','ф'],['g','г'],['h','ҳ'],['i','и'],['j','ж'],['k','к'],['l','л'],['m','м'],['n','н'],['o','о'],['p','п'],['q','қ'],['r','р'],['s','с'],['t','т'],['u','у'],['v','в'],['x','х'],['y','й'],['z','з'],['c','к'],['w','в']];
RP.lat2cyr = function(s){
  if(!s) return s; if(UZC[s]) return UZC[s];
  let out='', i=0; const low=s.toLowerCase();
  while(i<s.length){
    let hit=null;
    for(const [l,c] of LAT2CYR_PAIRS){ if(low.startsWith(l,i)){ hit=[l,c]; break; } }
    if(!hit){ out+=s[i]; i++; continue; }
    const seg=s.substr(i,hit[0].length); const up=seg[0]!==seg[0].toLowerCase();
    out += up ? hit[1].charAt(0).toUpperCase()+hit[1].slice(1) : hit[1]; i+=hit[0].length;
  }
  return out;
};
// yorliqni tanlangan tilga (uc/ul/ru/en) oʻtkazish
RP.lbl = function(s, lang){
  if(s==null) return '';
  s=String(s);
  if(lang==='ul') return s;
  if(lang==='uc') return UZC[s] || s;                 // nomlar oʻzgarmaydi (faqat atamalar lugʻati)
  const e = (typeof L10N!=='undefined') ? L10N[s] : null;
  if(e) return lang==='ru' ? (e[0]||s) : (e[1]||s);
  return s;
};
RP.num = function(n, lang){ if(n==null||isNaN(n)) return '0'; const v=Math.round(n); return lang==='en' ? v.toLocaleString('en-GB') : v.toLocaleString('ru-RU').replace(/,/g,' ').replace(/ /g,' '); };
RP.pct = function(v, lang, digits){ const d=digits==null?1:digits; const s=(Math.round((v||0)*Math.pow(10,d))/Math.pow(10,d)).toFixed(d); return lang==='en' ? s : s.replace('.',','); };
RP.date = function(iso, lang){ if(!iso) return '—'; const [y,m,d]=iso.split('-'); return `${d}.${m}.${y}`; };
// S(lang, {uc,ru,en}) — shablon tanlash; ul — kirilldan avtomatik
RP.S = function(lang, o){
  if(lang==='ru') return o.ru!=null?o.ru:o.uc;
  if(lang==='en') return o.en!=null?o.en:o.uc;
  if(lang==='ul') return o.ul!=null?o.ul:RP.translit(o.uc);
  return o.uc;
};
const MONTHS = {uc:['январь','февраль','март','апрель','май','июнь','июль','август','сентябрь','октябрь','ноябрь','декабрь'], ul:['yanvar','fevral','mart','aprel','may','iyun','iyul','avgust','sentabr','oktabr','noyabr','dekabr'], ru:['январь','февраль','март','апрель','май','июнь','июль','август','сентябрь','октябрь','ноябрь','декабрь'], en:['January','February','March','April','May','June','July','August','September','October','November','December']};
RP.month = (ym, lang, short) => { const [y,m]=ym.split('-'); let n=(MONTHS[lang]||MONTHS.uc)[+m-1]; if(short) n=n.slice(0,3); return `${n} ${y}`; };

/* ---------- 3. HUJJAT MODELI (run DSL) ---------- */
// run: {t, b, i, c:'red'|'blue'|'navy'|'black'|'grey', sz:26}
const R = RP.R = {
  t:(s,o)=>Object.assign({t:String(s)},o||{}),
  k:s=>({t:String(s),b:true}),
  r:s=>({t:String(s),b:true,c:'red'}),
  u:s=>({t:String(s),b:true,c:'blue'}),
  n:s=>({t:String(s),b:true,c:'navy'}),
  i:s=>({t:String(s),i:true}),
  // (37,7 фоиз) — kichik kursiv, son qizil, birlik koʻk
  pct:(v,lang,unit)=>[{t:'(',i:true,sz:26},{t:RP.pct(v,lang),i:true,c:'red',sz:26},{t:' ',i:true,sz:26},{t:unit||RP.S(lang,{uc:'фоиз',ru:'%',en:'%'}),i:true,c:'blue',sz:26},{t:')',i:true,sz:26}],
  // 1 125 та — son qizil qalin, birlik koʻk qalin
  nu:(n,lang,unit)=>unit?[{t:RP.num(n,lang),b:true,c:'red'},{t:' '},{t:unit,b:true,c:'blue'}]:[{t:RP.num(n,lang),b:true,c:'red'}],
  // box ichidagi: kursiv kichik; emphasis variantlari
  bi:s=>({t:String(s),b:true,i:true,sz:26}),
  bir:s=>({t:String(s),b:true,i:true,c:'red',sz:26}),
  biu:s=>({t:String(s),b:true,i:true,c:'blue',sz:26}),
  it:s=>({t:String(s),i:true,sz:26})
};
// qulay yigʻuvchi: massivlar ichidagi massivlarni tekislaydi, satrlarni oddiy runga aylantiradi
RP.runs = function(parts){ const out=[]; (function walk(a){ a.forEach(x=>{ if(x==null) return; if(Array.isArray(x)) walk(x); else if(typeof x==='string') out.push({t:x}); else out.push(x); }); })(parts); return out; };
RP.doc = function(meta){ return {meta:meta||{}, blocks:[], charts:0}; };
RP.title = (d, lines) => d.blocks.push({t:'title', lines});
RP.h = (d, num, text) => d.blocks.push({t:'h', num, text});
RP.p = (d, parts, opts) => d.blocks.push(Object.assign({t:'p', runs:RP.runs(Array.isArray(parts)?parts:[parts])}, opts||{}));
RP.np = (d, num, lead, rest) => d.blocks.push({t:'p', runs:RP.runs([R.r(num+'.'), ' ', R.k(lead), rest?' ':'', rest||[]])});   // raqamlangan masala/taklif
RP.box = (d, paras) => d.blocks.push({t:'box', paras:paras.map((p,i)=>RP.runs(i===0?[R.bi(RP.S(d.meta.lang,{uc:'Маълумот учун: ',ru:'Для сведения: ',en:'For reference: '})), p]:[p]))});
RP.chart = (d, opt, hCm, caption) => { d.charts++; d.blocks.push({t:'chart', opt, hCm:hCm||6.5, caption, id:'rpc'+d.charts}); };
RP.table = (d, head, rows, widths, opts) => d.blocks.push(Object.assign({t:'table', head, rows, widths}, opts||{}));
RP.pb = d => d.blocks.push({t:'pb'});
RP.note = (d, parts) => d.blocks.push({t:'p', runs:RP.runs([parts]), small:true, grey:true});

/* ---------- 4. DIAGRAMMALAR (ECharts → PNG, namuna palitrasi) ---------- */
const C = RP.DS.chart;
const F = RP.DS.fontAlt;
RP.chartBase = function(title, sub){
  const t = { show:!!title, text:title||'', subtext:sub||'', left:'center', top:4, textStyle:{color:C.title,fontSize:22,fontWeight:'bold',fontFamily:F}, subtextStyle:{color:C.navy,fontSize:16,fontStyle:'italic',fontFamily:F} };
  return { backgroundColor:'#fff', animation:false, textStyle:{fontFamily:F,color:C.text,fontSize:15}, title:t, grid:{left:12,right:70,top:title?(sub?84:56):16,bottom:12,containLabel:true} };
};
// gorizontal barlar: cats (yuqoridan pastga), vals, {colors, avg, avgLabel, fmt, max}
RP.hbar = function(title, cats, vals, o){
  o=o||{}; const n=cats.length; const base=RP.chartBase(title,o.sub);
  const cols = o.colors || cats.map(()=>C.blue);
  const fmt = o.fmt || (v=>String(v));
  const data = vals.map((v,i)=>({value:v, itemStyle:{color:cols[i]}}));
  const opt = Object.assign(base, {
    xAxis:{type:'value', show:false, max:o.max||null},
    yAxis:{type:'category', inverse:true, data:cats, axisLine:{lineStyle:{color:C.axis,width:2}}, axisTick:{show:false}, axisLabel:{color:C.text,fontSize:15,fontFamily:F, formatter:v=>v.length>34?v.slice(0,33)+'…':v, rich:{}}},
    series:[{type:'bar', data, barWidth:n>10?'62%':'55%', label:{show:true,position:'right',color:'#262626',fontSize:15,fontWeight:o.boldLabel?'bold':'normal',fontFamily:F,formatter:p=>fmt(p.value,p.dataIndex)}}]
  });
  if(o.avg!=null){ opt.series[0].markLine={silent:true,symbol:'none',lineStyle:{color:C.navy,type:'dashed',width:2},label:{show:true,position:'insideEndTop',color:C.navy,fontSize:13,fontFamily:F,formatter:o.avgLabel||''},data:[{xAxis:o.avg}]}; opt.grid.top = Math.max(opt.grid.top, 40); }
  return opt;
};
// halqa (donut)
RP.donut = function(title, items, centerText, centerSub){
  const base=RP.chartBase(title); base.grid=undefined;
  return Object.assign(base, {
    series:[{type:'pie', radius:['52%','78%'], center:['50%','56%'], avoidLabelOverlap:true, data:items.map(it=>({name:it.name,value:it.value,itemStyle:{color:it.color}})),
      label:{show:true,fontFamily:F,fontSize:15,formatter:p=>`{n|${p.name}}\n{v|${p.data.vlabel||p.value}}`,rich:{n:{fontWeight:'bold',fontSize:15,color:C.text,lineHeight:20},v:{fontSize:15,color:'#262626',lineHeight:20}}}, labelLine:{length:14,length2:12,lineStyle:{color:'#9e9e9e'}}, itemStyle:{borderColor:'#fff',borderWidth:2}}],
    graphic:[{type:'text',left:'center',top:'47%',style:{text:centerText||'',fontSize:30,fontWeight:'bold',fill:C.navy,fontFamily:F,textAlign:'center'}},{type:'text',left:'center',top:'60%',style:{text:centerSub||'',fontSize:15,fill:'#595959',fontFamily:F,textAlign:'center'}}]
  });
};
// vertikal ustunlar (guruhli yoki stek)
RP.columns = function(title, cats, series, o){
  o=o||{}; const base=RP.chartBase(title,o.sub); base.grid.right=20; base.grid.bottom=o.legend?40:12;
  const opt = Object.assign(base, {
    legend:o.legend?{bottom:0,icon:'rect',itemWidth:28,itemHeight:12,textStyle:{fontSize:14,fontFamily:F,color:C.text},data:series.map(s=>s.name)}:{show:false},
    xAxis:{type:'category',data:cats,axisLine:{lineStyle:{color:'#262626',width:2}},axisTick:{show:false},axisLabel:{color:C.text,fontSize:14,fontFamily:F,interval:0,rotate:o.rotate||0,formatter:v=>v.length>22?v.slice(0,21)+'…':v}},
    yAxis:{type:'value',show:false},
    series:series.map((s,i)=>({name:s.name,type:'bar',stack:o.stack?'s':null,data:s.data,barMaxWidth:46,itemStyle:{color:s.color},label:{show:true,position:o.stack?'inside':'top',color:o.stack?'#fff':(s.labelColor||'#262626'),fontSize:14,fontWeight:'bold',fontFamily:F,formatter:p=>p.value?(s.fmt?s.fmt(p.value,p.dataIndex):p.value):''}}))
  });
  if(o.stack && o.totals){ opt.series.push({name:'_t',type:'bar',stack:'s',silent:true,data:cats.map(()=>0),itemStyle:{color:'transparent'},label:{show:true,position:'top',color:'#262626',fontSize:14,fontWeight:'bold',fontFamily:F,formatter:p=>o.totals[p.dataIndex]}}); opt.legend.data=series.map(s=>s.name); }
  if(o.line){ opt.yAxis=[{type:'value',show:false},{type:'value',show:false,max:100}]; opt.series.push({name:o.line.name,type:'line',yAxisIndex:1,data:o.line.data,symbol:'circle',symbolSize:12,lineStyle:{color:C.red,width:3},itemStyle:{color:C.red},label:{show:true,position:'top',color:C.red,fontWeight:'bold',fontSize:16,fontFamily:F,formatter:p=>RP.pct(p.value,o.lang)+'%'}}); if(opt.legend.show!==false) opt.legend.data.push(o.line.name); }
  return opt;
};
// gorizontal stek (natijalar: oʻtgan / jarayonda / oʻtmagan)
RP.hstack = function(title, cats, series, totals, o){
  o=o||{}; const base=RP.chartBase(title,o.sub); base.grid.bottom=40; base.grid.right=80;
  return Object.assign(base, {
    legend:{bottom:0,icon:'rect',itemWidth:28,itemHeight:12,textStyle:{fontSize:14,fontFamily:F,color:C.text},data:series.map(s=>s.name)},
    xAxis:{type:'value',show:false},
    yAxis:{type:'category',inverse:true,data:cats,axisLine:{lineStyle:{color:C.axis,width:2}},axisTick:{show:false},axisLabel:{color:C.text,fontSize:15,fontFamily:F,formatter:v=>v.length>34?v.slice(0,33)+'…':v}},
    series:series.map(s=>({name:s.name,type:'bar',stack:'s',data:s.data,barWidth:cats.length>10?'62%':'55%',itemStyle:{color:s.color},label:{show:true,position:'inside',color:'#fff',fontSize:13,fontWeight:'bold',fontFamily:F,formatter:p=>p.value>=(o.minLabel||2)?p.value:''}}))
      .concat([{name:'_t',type:'bar',stack:'s',silent:true,data:cats.map(()=>0),itemStyle:{color:'transparent'},label:{show:true,position:'right',color:'#262626',fontSize:14,fontWeight:'bold',fontFamily:F,formatter:p=>totals[p.dataIndex]}}])
  });
};
RP.renderPNG = async function(opt, wPx, hPx){
  if(typeof echarts==='undefined') return null;
  let div=document.getElementById('rpChartStage');
  if(!div){ div=document.createElement('div'); div.id='rpChartStage'; div.style.cssText='position:fixed;left:-20000px;top:0;width:1650px;height:650px;background:#fff'; document.body.appendChild(div); }
  div.style.width=(wPx||1650)+'px'; div.style.height=(hPx||650)+'px';
  const prevLang = window.I18N ? I18N.lang : null; if(window.I18N) I18N.lang='uz';   // koʻrsatish qatlami aralashmasin
  let url=null;
  try{
    const inst=echarts.init(div,null,{renderer:'canvas',devicePixelRatio:1.5});
    opt.animation=false; inst.setOption(opt,true);
    await new Promise(r=>setTimeout(r,30));
    url=inst.getDataURL({type:'png',pixelRatio:1.5,backgroundColor:'#fff'});   // ≈ 380 dpi (16,5 см)
    inst.dispose();
  }catch(e){ console.error('RP chart', e); }
  if(window.I18N) I18N.lang=prevLang;
  return url;
};
RP.prepareCharts = async function(doc){
  for(const b of doc.blocks){ if(b.t==='chart' && !b.png){ const hPx=Math.round(1650*b.hCm/RP.DS.chartCm); b.png=await RP.renderPNG(b.opt,1650,hPx); b.wPx=1650; b.hPx=hPx; } }
  return doc;
};

/* ---------- 5. DOCX RENDER ---------- */
const X = s => String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
function rpr(r, def){
  def=def||{}; const sz=r.sz||def.sz||RP.DS.szBody; const col=RP.DS.color[r.c||def.c||'black']||RP.DS.color.black;
  return `<w:rPr><w:rFonts w:ascii="${RP.DS.font}" w:hAnsi="${RP.DS.font}" w:cs="${RP.DS.font}" w:eastAsia="${RP.DS.font}"/>${(r.b||def.b)?'<w:b/><w:bCs/>':''}${(r.i||def.i)?'<w:i/><w:iCs/>':''}<w:color w:val="${col}"/><w:sz w:val="${sz}"/><w:szCs w:val="${sz}"/><w:lang w:val="uz-Cyrl-UZ"/></w:rPr>`;
}
const run = (r, def) => `<w:r>${rpr(r,def)}<w:t xml:space="preserve">${X(r.t)}</w:t></w:r>`;
const ppr = o => { o=o||{}; const ind=o.noIndent?'':`<w:ind w:firstLine="${RP.DS.firstLine}"/>`; const sp=`<w:spacing${o.before!=null?` w:before="${o.before}"`:''} w:after="${o.after!=null?o.after:RP.DS.afterBody}" w:line="${o.line||RP.DS.lineBody}" w:lineRule="auto"/>`; const shd=o.fill?`<w:shd w:val="clear" w:color="auto" w:fill="${o.fill}"/>`:''; return `<w:pPr>${o.keepNext?'<w:keepNext/>':''}${o.keepLines?'<w:keepLines/>':''}${o.pageBreakBefore?'<w:pageBreakBefore/>':''}${shd}${sp}${ind}<w:jc w:val="${o.jc||'both'}"/></w:pPr>`; };
function docxBlock(b, ctx){
  const L=ctx.lang;
  if(b.t==='title') return b.lines.map((ln,i)=>`<w:p>${ppr({jc:'center',after:RP.DS.afterTitle,line:240,keepNext:true})}${run({t:ln,b:true})}</w:p>`).join('');
  if(b.t==='h') return `<w:p>${ppr({keepNext:true,before:b.num==='III.'?120:200})}${run({t:b.num+' ',b:true,c:'red'})}${run({t:b.text,b:true,c:'navy'})}</w:p>`;
  if(b.t==='p'){ const def=b.small?{sz:26,i:true,c:b.grey?'grey':'black'}:{}; return `<w:p>${ppr({keepNext:!!b.keepNext,noIndent:!!b.noIndent})}${b.runs.map(r=>run(r,def)).join('')}</w:p>`; }
  if(b.t==='box') return b.paras.map((rs,i)=>`<w:p>${ppr({fill:RP.DS.boxFill,line:RP.DS.lineBox,after:i<b.paras.length-1?0:120,keepNext:i<b.paras.length-1,keepLines:true})}${rs.map(r=>run(r,{sz:26,i:true})).join('')}</w:p>`).join('');
  if(b.t==='chart'){ if(!b.png) return ''; const id=ctx.media.length+1; const b64=b.png.split(',')[1]; ctx.media.push({name:`image${id}.png`, b64}); const rId=`rIdImg${id}`; ctx.rels.push(`<Relationship Id="${rId}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/image${id}.png"/>`);
    const cx=Math.round(RP.DS.chartCm*360000), cy=Math.round(b.hCm*360000);
    const cap = b.caption ? `<w:p>${ppr({jc:'center',noIndent:true,after:0,line:240,keepNext:true})}${run({t:b.caption,b:true,c:'navy',sz:26})}</w:p>` : '';
    return cap+`<w:p>${ppr({jc:'center',noIndent:true,after:120,line:240,keepLines:true})}<w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="${cx}" cy="${cy}"/><wp:effectExtent l="0" t="0" r="0" b="0"/><wp:docPr id="${id}" name="Chart ${id}" descr="${X(b.caption||'chart')}"/><wp:cNvGraphicFramePr><a:graphicFrameLocks noChangeAspect="1"/></wp:cNvGraphicFramePr><a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic><pic:nvPicPr><pic:cNvPr id="${id}" name="image${id}.png"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="${rId}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r></w:p>`; }
  if(b.t==='table'){ const tw=RP.DS.page.w-RP.DS.page.left-RP.DS.page.right; const nc=b.head.length; const widths=b.widths||b.head.map(()=>Math.floor(tw/nc)); const cell=(txt,i,head)=>`<w:tc><w:tcPr><w:tcW w:w="${widths[i]}" w:type="dxa"/>${head?`<w:shd w:val="clear" w:color="auto" w:fill="1F3864"/>`:''}<w:tcMar><w:top w:w="30" w:type="dxa"/><w:bottom w:w="30" w:type="dxa"/><w:left w:w="70" w:type="dxa"/><w:right w:w="70" w:type="dxa"/></w:tcMar><w:vAlign w:val="center"/></w:tcPr><w:p><w:pPr><w:spacing w:after="0" w:line="240" w:lineRule="auto"/><w:jc w:val="${i===0?'left':'center'}"/></w:pPr>${run({t:txt,b:head,c:head?'black':'black',sz:24},head?{}:{})}</w:p></w:tc>`.replace(head?'<w:color w:val="000000"/>':'~~','<w:color w:val="FFFFFF"/>');
    const hrow=`<w:tr><w:trPr><w:tblHeader/><w:cantSplit/></w:trPr>${b.head.map((c,i)=>cell(c,i,true)).join('')}</w:tr>`;
    const rows=b.rows.map(r=>`<w:tr><w:trPr><w:cantSplit/></w:trPr>${r.map((c,i)=>cell(c,i,false)).join('')}</w:tr>`).join('');
    const cap = b.caption?`<w:p>${ppr({keepNext:true,noIndent:true,after:60,line:240})}${run({t:b.caption,b:true,c:'navy',sz:26})}</w:p>`:'';
    return cap+`<w:tbl><w:tblPr><w:tblW w:w="${tw}" w:type="dxa"/><w:tblBorders><w:top w:val="single" w:sz="4" w:color="BFBFBF"/><w:left w:val="single" w:sz="4" w:color="BFBFBF"/><w:bottom w:val="single" w:sz="4" w:color="BFBFBF"/><w:right w:val="single" w:sz="4" w:color="BFBFBF"/><w:insideH w:val="single" w:sz="4" w:color="D9D9D9"/><w:insideV w:val="single" w:sz="4" w:color="D9D9D9"/></w:tblBorders><w:tblLook w:val="04A0"/></w:tblPr><w:tblGrid>${widths.map(w=>`<w:gridCol w:w="${w}"/>`).join('')}</w:tblGrid>${hrow}${rows}</w:tbl><w:p>${ppr({after:60,line:240,noIndent:true})}</w:p>`; }
  if(b.t==='pb') return `<w:p><w:r><w:br w:type="page"/></w:r></w:p>`;
  return '';
}
RP.toDocx = function(doc){
  const ctx={lang:doc.meta.lang, media:[], rels:[]};
  const body = doc.blocks.map(b=>docxBlock(b,ctx)).join('');
  const P=RP.DS.page;
  const sect=`<w:sectPr><w:headerReference w:type="default" r:id="rIdHdr"/><w:pgSz w:w="${P.w}" w:h="${P.h}"/><w:pgMar w:top="${P.top}" w:right="${P.right}" w:bottom="${P.bottom}" w:left="${P.left}" w:header="${P.header}" w:footer="${P.footer}" w:gutter="0"/><w:cols w:space="720"/><w:titlePg/><w:docGrid w:linePitch="360"/></w:sectPr>`;
  const NS='xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"';
  const DOC=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document ${NS}><w:body>${body}${sect}</w:body></w:document>`;
  const HDR=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:hdr ${NS}><w:p><w:pPr><w:jc w:val="center"/><w:spacing w:after="0"/></w:pPr><w:r>${rpr({sz:26})}<w:fldChar w:fldCharType="begin"/></w:r><w:r>${rpr({sz:26})}<w:instrText xml:space="preserve"> PAGE </w:instrText></w:r><w:r>${rpr({sz:26})}<w:fldChar w:fldCharType="separate"/></w:r><w:r>${rpr({sz:26})}<w:t>2</w:t></w:r><w:r>${rpr({sz:26})}<w:fldChar w:fldCharType="end"/></w:r></w:p></w:hdr>`;
  const STYLES=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Calibri" w:eastAsia="Calibri"/><w:sz w:val="30"/><w:szCs w:val="30"/><w:lang w:val="uz-Cyrl-UZ"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="120" w:line="240" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/><w:pPr><w:spacing w:after="120" w:line="240" w:lineRule="auto"/><w:jc w:val="both"/></w:pPr><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Calibri"/><w:sz w:val="30"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="NQAAEBox"><w:name w:val="NQAAE Info Box"/><w:basedOn w:val="Normal"/><w:pPr><w:shd w:val="clear" w:color="auto" w:fill="E2EFDA"/><w:spacing w:line="252" w:lineRule="auto"/><w:ind w:firstLine="709"/></w:pPr><w:rPr><w:i/><w:sz w:val="26"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="NQAAEHeading"><w:name w:val="NQAAE Section Heading"/><w:basedOn w:val="Normal"/><w:pPr><w:keepNext/><w:ind w:firstLine="709"/></w:pPr><w:rPr><w:b/><w:color w:val="1F3864"/></w:rPr></w:style></w:styles>`;
  const CT=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="png" ContentType="image/png"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/word/header1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/></Types>`;
  const RELS=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/></Relationships>`;
  const DOCRELS=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rIdSty" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/><Relationship Id="rIdHdr" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/header" Target="header1.xml"/>${ctx.rels.join('')}</Relationships>`;
  const now=new Date().toISOString().replace(/\.\d+Z$/,'Z');
  const CORE=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>${X(doc.meta.title||'')}</dc:title><dc:creator>NQAAE monitoring</dc:creator><dcterms:created xsi:type="dcterms:W3CDTF">${now}</dcterms:created></cp:coreProperties>`;
  RP._lastXml={doc:DOC, hdr:HDR, rels:DOCRELS, styles:STYLES, media:ctx.media.length};
  const files=[{name:'[Content_Types].xml',data:_sb(CT)},{name:'_rels/.rels',data:_sb(RELS)},{name:'word/document.xml',data:_sb(DOC)},{name:'word/_rels/document.xml.rels',data:_sb(DOCRELS)},{name:'word/styles.xml',data:_sb(STYLES)},{name:'word/header1.xml',data:_sb(HDR)},{name:'docProps/core.xml',data:_sb(CORE)}];
  ctx.media.forEach(m=>{ const bin=atob(m.b64); const u=new Uint8Array(bin.length); for(let i=0;i<bin.length;i++) u[i]=bin.charCodeAt(i); files.push({name:'word/media/'+m.name,data:u}); });
  return _makeZip(files);
};
RP.downloadDocx = function(doc, filename){
  const zip=RP.toDocx(doc); const blob=new Blob([zip],{type:'application/vnd.openxmlformats-officedocument.wordprocessingml.document'});
  const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=filename; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(url),1500);
};

/* ---------- 6. HTML KOʻRISH (A4, namuna tipografiyasi) + PDF ---------- */
const PT = v => (v/20)+'pt';           // yarim punkt → pt emas: sz 30 = 15pt
const sz2pt = sz => (sz/2)+'pt';
function htmlRun(r, def){ def=def||{}; const col='#'+(RP.DS.color[r.c||def.c||'black']||'000000'); const st=`color:${col};font-size:${sz2pt(r.sz||def.sz||30)};${(r.b||def.b)?'font-weight:bold;':''}${(r.i||def.i)?'font-style:italic;':''}`; return `<span style="${st}">${X(r.t)}</span>`; }
function htmlBlock(b){
  if(b.t==='title') return b.lines.map(ln=>`<p class="rp-title">${X(ln)}</p>`).join('');
  if(b.t==='h') return `<p class="rp-h${b.num==='III.'?' rp-h3':''}"><span class="rp-red">${X(b.num)}</span> <span class="rp-navy">${X(b.text)}</span></p>`;
  if(b.t==='p'){ const def=b.small?{sz:26,i:true,c:b.grey?'grey':'black'}:{}; return `<p class="rp-p${b.noIndent?' rp-noind':''}">${b.runs.map(r=>htmlRun(r,def)).join('')}</p>`; }
  if(b.t==='box') return `<div class="rp-box">${b.paras.map(rs=>`<p>${rs.map(r=>htmlRun(r,{sz:26,i:true})).join('')}</p>`).join('')}</div>`;
  if(b.t==='chart') return `<div class="rp-chart">${b.caption?`<div class="rp-cap">${X(b.caption)}</div>`:''}${b.png?`<img src="${b.png}" alt="${X(b.caption||'chart')}" style="width:${RP.DS.chartCm}cm;height:${b.hCm}cm">`:'<div class="rp-nochart">…</div>'}</div>`;
  if(b.t==='table') return `<div class="rp-tbl">${b.caption?`<div class="rp-cap">${X(b.caption)}</div>`:''}<table><thead><tr>${b.head.map(h=>`<th>${X(h)}</th>`).join('')}</tr></thead><tbody>${b.rows.map(r=>`<tr>${r.map((c,i)=>`<td${i===0?' class="l"':''}>${X(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  if(b.t==='pb') return `<div class="rp-pb"></div>`;
  return '';
}
RP.CSS = `
.rp-sheet{font-family:Calibri,"Carlito","Segoe UI",Arial,sans-serif;font-size:15pt;line-height:1.08;color:#000;text-align:justify}
.rp-sheet p{margin:0 0 6pt}
.rp-title{text-align:center;font-weight:bold;margin:0 0 10pt!important;line-height:1.15}
.rp-h{font-weight:bold;text-indent:1.25cm;margin:10pt 0 6pt!important;page-break-after:avoid;break-after:avoid}
.rp-h3{margin-top:6pt!important}
.rp-red{color:#C00000}.rp-navy{color:#1F3864}
.rp-p{text-indent:1.25cm}.rp-noind{text-indent:0}
.rp-box{background:#E2EFDA;padding:4pt 6pt 4pt 0;margin:0 0 6pt;line-height:1.05;page-break-inside:avoid;break-inside:avoid}
.rp-box p{margin:0 0 2pt;text-indent:1.25cm;font-style:italic;font-size:13pt}
.rp-chart{text-align:center;margin:4pt 0 8pt;page-break-inside:avoid;break-inside:avoid}
.rp-chart img{display:block;margin:0 auto}
.rp-cap{font-weight:bold;color:#1F3864;font-size:13pt;text-align:center;margin:0 0 2pt;page-break-after:avoid}
.rp-tbl{margin:4pt 0 10pt;page-break-inside:avoid}
.rp-tbl table{width:100%;border-collapse:collapse;font-size:12pt}
.rp-tbl th{background:#1F3864;color:#fff;font-weight:bold;padding:3pt 5pt;border:1px solid #bfbfbf;text-align:center}
.rp-tbl td{padding:2pt 5pt;border:1px solid #d9d9d9;text-align:center}
.rp-tbl td.l{text-align:left}
.rp-pb{page-break-before:always;break-before:page;height:0}
`;
RP.toHtml = function(doc){ return `<div class="rp-sheet" lang="${doc.meta.lang==='uc'?'uz-Cyrl':doc.meta.lang==='ul'?'uz-Latn':doc.meta.lang}">${doc.blocks.map(htmlBlock).join('')}</div>`; };
RP.pageCSS = `@page{size:A4 portrait;margin:15mm 15mm 15mm 25mm;@top-center{content:counter(page);font-family:Calibri,Arial;font-size:13pt}} @page:first{@top-center{content:none}}`;
RP.openPdf = function(doc){
  const html=RP.toHtml(doc);
  const w=window.open('','_blank'); if(!w){ if(typeof toast==='function') toast('Brauzer yangi oynani blokladi — ruxsat bering'); return false; }
  w.document.write(`<!doctype html><html lang="${doc.meta.lang==='uc'?'uz-Cyrl':'uz'}"><head><meta charset="utf-8"><title>${X(doc.meta.title||'Hisobot')}</title><style>${RP.pageCSS}${RP.CSS} body{margin:0} @media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}} @media screen{body{background:#eee;padding:20px} .rp-sheet{background:#fff;width:170mm;margin:0 auto;padding:15mm 15mm 15mm 25mm;box-shadow:0 2px 12px rgba(0,0,0,.2)}}</style></head><body>${html}<script>window.onload=function(){setTimeout(function(){window.print();},500);};<\/script></body></html>`);
  w.document.close(); return true;
};
// A4 sahifalarga boʻlib koʻrsatish (koʻrish oynasi uchun)
RP.paginate = function(container, doc){
  const PAGE_H = 297, M_T=15, M_B=15, mm = v => v*3.7795275591;  // px/mm (96dpi)
  container.innerHTML='';
  const meas=document.createElement('div'); meas.className='rp-sheet rp-measure'; meas.style.cssText=`position:absolute;left:-30000px;top:0;width:${170}mm;visibility:hidden`; meas.innerHTML=doc.blocks.map(htmlBlock).join(''); document.body.appendChild(meas);
  const els=[...meas.children]; const maxH=mm(PAGE_H-M_T-M_B); let page=null, used=0, n=0;
  const newPage=()=>{ n++; page=document.createElement('div'); page.className='rp-page'; page.innerHTML=`<div class="rp-pn">${n>1?n:''}</div><div class="rp-sheet rp-body"></div>`; container.appendChild(page); used=0; return page.querySelector('.rp-body'); };
  let body=newPage();
  els.forEach(el=>{ const h=el.getBoundingClientRect().height + 8; const isBreak=el.classList.contains('rp-pb'); if(isBreak){ body=newPage(); return; } if(used+h>maxH && used>0){ body=newPage(); } if(el.classList.contains('rp-h')) el.dataset.keep='1'; body.appendChild(el); used+=h; });
  // sarlavha sahifa oxirida qolmasin
  [...container.querySelectorAll('.rp-page')].forEach((pg,i,arr)=>{ const b=pg.querySelector('.rp-body'); const last=b.lastElementChild; if(last && last.classList.contains('rp-h') && arr[i+1]){ arr[i+1].querySelector('.rp-body').insertBefore(last, arr[i+1].querySelector('.rp-body').firstChild); } });
  meas.remove(); return n;
};

/* ---------- 7. MAʼLUMOT TEKSHIRUVI ---------- */
RP.validate = function(){
  const issues=[]; const add=(code, n, detail)=>{ if(n) issues.push({code,n,detail}); };
  try{
    const inst = typeof dbInst==='function' ? dbInst(typeof dbState!=='undefined'?dbState.ref:null) : [];
    const ids={}; let dup=0; inst.forEach(r=>{ if(ids[r.id]) dup++; ids[r.id]=1; }); add('inst.dupId',dup);
    add('inst.noDates', inst.filter(r=>r.status==='nodata').length);
    add('inst.noOwn', inst.filter(r=>r.own==='Aniqlanmagan').length);
    add('inst.noEdu', inst.filter(r=>r.edu==='other').length);
    add('inst.incomplete', inst.filter(r=>!r.liq && r.status!=='progress' && !r.acc && !r.est).length);
  }catch(e){}
  try{
    const K = typeof KOMPLEKS!=='undefined' ? KOMPLEKS : []; const ids={}; let dup=0; K.forEach(r=>{ if(ids[r.app]) dup++; ids[r.app]=1; }); add('k.dupId',dup);
    add('k.noDate', K.filter(r=>!r.cDate).length); add('k.accBefore', K.filter(r=>r.cDate&&r.aDate&&r.aDate<r.cDate).length); add('k.doneNoResult', K.filter(r=>r.stage==='done'&&!r.result).length); add('k.resultNotDone', K.filter(r=>r.stage!=='done'&&r.result).length);
  }catch(e){}
  try{
    const P = typeof PROGRAMS!=='undefined' ? PROGRAMS : []; const A = typeof APPS!=='undefined' ? APPS : [];
    add('p.noLvl', P.filter(p=>!p.lvl).length); add('p.noField', P.filter(p=>!p.field||p.field==='Aniqlanmagan').length); add('p.noOwn', P.filter(p=>!p.own||p.own==='Aniqlanmagan').length);
    const byApp={}; P.forEach(p=>{ byApp[p.app]=(byApp[p.app]||0)+1; }); add('a.countMismatch', A.filter(a=>byApp[a.app]!==a.total).length); add('a.noDate', A.filter(a=>!a.cDate).length);
    add('p.pctCheck', (P.filter(p=>p.status==='passed').length+P.filter(p=>p.status==='failed').length+P.filter(p=>p.status==='inProgress').length)!==P.length?1:0);
  }catch(e){}
  return issues;
};
RP.VALID_T = {
  'inst.dupId':{uc:'Реестрда такрорланган идентификатор',ru:'Повторяющиеся идентификаторы в реестре',en:'Duplicate IDs in the register'},
  'inst.noDates':{uc:'Муддатни ҳисоблаш учун сана мавжуд бўлмаган ташкилотлар',ru:'Организации без дат для расчёта срока',en:'Institutions without dates to calculate the deadline'},
  'inst.noOwn':{uc:'Мулкчилик шакли аниқланмаган ташкилотлар',ru:'Организации без формы собственности',en:'Institutions without ownership classification'},
  'inst.noEdu':{uc:'Таълим тури тоифаланмаган ташкилотлар',ru:'Организации с неопределённым видом образования',en:'Institutions with unclassified education type'},
  'inst.incomplete':{uc:'Ташкил этиш ва аккредитация санаси кўрсатилмаган ёзувлар',ru:'Записи без даты создания и аккредитации',en:'Records without establishment and accreditation dates'},
  'k.dupId':{uc:'Комплекс аризаларда такрорланган рақам',ru:'Повторяющиеся номера комплексных заявок',en:'Duplicate comprehensive application numbers'},
  'k.noDate':{uc:'Ариза берилган санаси йўқ комплекс аризалар',ru:'Комплексные заявки без даты подачи',en:'Comprehensive applications without a submission date'},
  'k.accBefore':{uc:'Қабул санаси ариза санасидан олдин бўлган ёзувлар',ru:'Дата принятия раньше даты подачи',en:'Acceptance date earlier than submission date'},
  'k.doneNoResult':{uc:'«Якунланган» ҳолатида натижаси кўрсатилмаган аризалар',ru:'Заявки «Завершено» без результата',en:'“Completed” applications without a result'},
  'k.resultNotDone':{uc:'Натижаси бор, лекин ҳолати якунланмаган аризалар',ru:'Заявки с результатом, но без статуса «Завершено»',en:'Applications with a result but not marked completed'},
  'p.noLvl':{uc:'Таълим даражаси кўрсатилмаган дастурлар',ru:'Программы без уровня образования',en:'Programmes without education level'},
  'p.noField':{uc:'Билим соҳаси кўрсатилмаган дастурлар',ru:'Программы без области знаний',en:'Programmes without field of study'},
  'p.noOwn':{uc:'Мулкчилик шакли кўрсатилмаган дастурлар',ru:'Программы без формы собственности',en:'Programmes without ownership'},
  'a.countMismatch':{uc:'Ариза бўйича дастурлар сони мос келмайдиган ёзувлар',ru:'Несовпадение числа программ по заявке',en:'Programme count mismatch per application'},
  'a.noDate':{uc:'Санаси йўқ махсус аризалар',ru:'Специальные заявки без даты',en:'Special applications without a date'},
  'p.pctCheck':{uc:'Дастурлар ҳолатлари йиғиндиси жамига тенг эмас',ru:'Сумма статусов программ не равна итогу',en:'Programme status totals do not add up'}
};

/* ---------- 8. SOZLAMALAR ---------- */
RP.cfg = { waitWarn:120, waitCrit:180, gapMin:30, gapMax:40, soonDays:365, smallSample:10, lowCoverageGap:10 };
try{ Object.assign(RP.cfg, JSON.parse(localStorage.getItem('acc.rp.cfg')||'{}')); }catch(e){}
RP.saveCfg = () => { try{ localStorage.setItem('acc.rp.cfg', JSON.stringify(RP.cfg)); }catch(e){} };
})();
