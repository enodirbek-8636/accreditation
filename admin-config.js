/* =====================================================================
   NQAAE monitoring — ADMIN / ACL backend sozlamalari
   Supabase loyihasi yaratilgach (docs/ADMIN.md) quyidagi ikki qiymatni
   toʻldiring. anonKey — ommaviy (public) kalit; u faqat RLS siyosatlari
   ruxsat bergan maʼlumotni oʻqiy oladi. Parollar hech qayerda saqlanmaydi.
   ===================================================================== */
window.NQAAE_BACKEND = {
  url: '',          // masalan: 'https://xxxxxxxx.supabase.co'
  anonKey: '',      // Supabase → Project Settings → API → anon public
  dataFromBackend: false,   // 2-bosqich: maʼlumotlar toʻplamlari backenddan (datasets jadvali) yuklanadi
  sessionMinutes: 60        // admin sessiyasi harakatsizlikda tugaydi (daqiqa)
};
