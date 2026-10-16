/* =====================================================================
   NQAAE monitoring — ADMIN / ACL backend sozlamalari
   anonKey (publishable) — ommaviy kalit; u faqat RLS siyosatlari
   ruxsat bergan maʼlumotni oʻqiy oladi. Parollar hech qayerda saqlanmaydi.
   Secret / service_role kalit bu yerga HECH QACHON yozilmaydi.
   ===================================================================== */
window.NQAAE_BACKEND = {
  url: 'https://qsuzyskaujtfyhjzqqdg.supabase.co',
  anonKey: 'sb_publishable_mAhVuwI3Gor472xS1gGeaQ_6d2qKoPt',
  dataFromBackend: false,   // 2-bosqich: maʼlumotlar toʻplamlari backenddan (datasets jadvali) yuklanadi
  sessionMinutes: 60        // admin sessiyasi harakatsizlikda tugaydi (daqiqa)
};
