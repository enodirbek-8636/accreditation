-- =====================================================================
-- NQAAE monitoring — ADMIN PANEL / MENYU KOʻRINISHI: Supabase sxemasi
-- Bajarish: Supabase → SQL Editor → ushbu faylni toʻliq ishga tushiring.
-- Autentifikatsiya: Supabase Auth (email + parol). Parollar hech qachon
-- frontendda saqlanmaydi. Admin rollari faqat SQL/dashboard orqali beriladi
-- (ommaviy oʻzini-oʻzi roʻyxatdan oʻtkazish yoʻq).
-- =====================================================================

-- 1. Rollar -----------------------------------------------------------
create table if not exists public.admin_roles (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  role       text not null check (role in ('super_admin','admin','analyst','viewer')),
  created_at timestamptz not null default now()
);
alter table public.admin_roles enable row level security;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admin_roles where user_id = auth.uid() and role in ('super_admin','admin'));
$$;
create or replace function public.my_role()
returns text language sql stable security definer set search_path = public as $$
  select role from public.admin_roles where user_id = auth.uid();
$$;
-- foydalanuvchi faqat oʻz rolini koʻradi; yozish faqat SQL/dashboard orqali
drop policy if exists admin_roles_select_own on public.admin_roles;
create policy admin_roles_select_own on public.admin_roles for select to authenticated using (user_id = auth.uid());

-- 2. Menyu reyestri (barqaror IDlar) ------------------------------------
create table if not exists public.menu_items (
  id            text primary key,
  parent_id     text references public.menu_items(id) on delete cascade,
  item_type     text not null check (item_type in ('main_tab','sub_tab','section')),
  route_key     text,
  display_name  text,
  display_order int not null default 0,
  access_policy text not null default 'public',
  enabled       boolean not null default true,
  updated_at    timestamptz not null default now(),
  updated_by    uuid
);
alter table public.menu_items enable row level security;
drop policy if exists menu_items_read_all on public.menu_items;
create policy menu_items_read_all on public.menu_items for select to anon, authenticated using (true);
drop policy if exists menu_items_write_admin on public.menu_items;
create policy menu_items_write_admin on public.menu_items for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- 3. Eʼlon qilingan konfiguratsiya (versiyalar) ----------------------------
create table if not exists public.menu_config (
  version      bigserial primary key,
  config       jsonb not null,            -- {"items": {"<id>": {"v": false}}}
  is_current   boolean not null default false,
  published_at timestamptz not null default now(),
  published_by uuid,
  note         text
);
create unique index if not exists menu_config_one_current on public.menu_config (is_current) where is_current;
alter table public.menu_config enable row level security;
drop policy if exists menu_config_public_current on public.menu_config;
create policy menu_config_public_current on public.menu_config for select to anon, authenticated using (is_current or public.is_admin());

-- 4. Qoralamalar (har bir admin uchun) ---------------------------------
create table if not exists public.menu_drafts (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  config     jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.menu_drafts enable row level security;
drop policy if exists menu_drafts_owner on public.menu_drafts;
create policy menu_drafts_owner on public.menu_drafts for all to authenticated using (user_id = auth.uid() and public.is_admin()) with check (user_id = auth.uid() and public.is_admin());

-- 5. Audit jurnali --------------------------------------------------------
create table if not exists public.audit_log (
  id             bigserial primary key,
  admin_id       uuid,
  admin_email    text,
  item_id        text,
  old_value      jsonb,
  new_value      jsonb,
  action         text not null,            -- publish | restore | hide | show
  config_version bigint,
  created_at     timestamptz not null default now()
);
alter table public.audit_log enable row level security;
drop policy if exists audit_read_admin on public.audit_log;
create policy audit_read_admin on public.audit_log for select to authenticated using (public.is_admin());
-- yozish faqat publish_config funksiyasi orqali (security definer)

-- 6. Atomik eʼlon qilish ---------------------------------------------------
create or replace function public.publish_config(p_config jsonb, p_note text default null, p_action text default 'publish')
returns bigint language plpgsql security definer set search_path = public as $$
declare v_prev jsonb; v_ver bigint; v_key text; v_old jsonb; v_new jsonb; v_email text;
begin
  if not public.is_admin() then raise exception 'access denied' using errcode = '42501'; end if;
  select config into v_prev from public.menu_config where is_current;
  select email into v_email from auth.users where id = auth.uid();
  update public.menu_config set is_current = false where is_current;
  insert into public.menu_config (config, is_current, published_by, note) values (p_config, true, auth.uid(), p_note) returning version into v_ver;
  -- farqlar audit jurnaliga
  for v_key in select distinct k from (select jsonb_object_keys(coalesce(v_prev->'items','{}'::jsonb)) k union select jsonb_object_keys(coalesce(p_config->'items','{}'::jsonb))) s loop
    v_old := coalesce(v_prev->'items'->v_key, '{"v":true}'::jsonb);
    v_new := coalesce(p_config->'items'->v_key, '{"v":true}'::jsonb);
    if v_old is distinct from v_new then
      insert into public.audit_log (admin_id, admin_email, item_id, old_value, new_value, action, config_version)
      values (auth.uid(), v_email, v_key, v_old, v_new, case when (v_new->>'v')='false' then 'hide' else 'show' end, v_ver);
    end if;
  end loop;
  insert into public.audit_log (admin_id, admin_email, item_id, old_value, new_value, action, config_version)
  values (auth.uid(), v_email, null, v_prev, p_config, p_action, v_ver);
  return v_ver;
end $$;
revoke all on function public.publish_config(jsonb, text, text) from public;
grant execute on function public.publish_config(jsonb, text, text) to authenticated;

-- 7. Maʼlumotlar toʻplamlari (2-bosqich: himoyalangan maʼlumot) -----------
-- Yashirin modulning maʼlumotini haqiqatan himoyalash uchun statik fayllar
-- (data-institutions.js, index.html ichidagi ACCR/APPDATA/KOMPLEKS_RAW)
-- shu jadvalga koʻchiriladi; RLS faqat ommaviy modullarni anon'ga beradi.
create table if not exists public.datasets (
  key        text primary key,            -- raw_data | kompleks | accr | appdata
  module     text not null,               -- tashkilot | kompleks | maxsus
  payload    jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.datasets enable row level security;
create or replace function public.module_public(p_module text)
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce( not ((select config from public.menu_config where is_current) #>> array['items', p_module, 'v'])::boolean = false, true);
$$;
drop policy if exists datasets_read on public.datasets;
create policy datasets_read on public.datasets for select to anon, authenticated using (public.is_admin() or public.module_public(module));
drop policy if exists datasets_write_admin on public.datasets;
create policy datasets_write_admin on public.datasets for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- 8. Boshlangʻich holat: hamma narsa ochiq (joriy ommaviy koʻrinish saqlanadi)
insert into public.menu_config (config, is_current, note)
select '{"items":{}}'::jsonb, true, 'initial: all visible' where not exists (select 1 from public.menu_config);

-- 9. Birinchi administratorni biriktirish (himoyalangan sozlash tartibi):
--    a) Supabase → Authentication → Users → "Add user" (email + parol, email tasdiqlangan).
--    b) Quyidagi satrni oʻz emailingiz bilan bajaring:
-- insert into public.admin_roles (user_id, role)
--   select id, 'super_admin' from auth.users where email = 'admin@example.uz'
--   on conflict (user_id) do update set role = excluded.role;
