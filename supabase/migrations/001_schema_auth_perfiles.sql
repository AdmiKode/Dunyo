-- ============================================================
-- DUNYO — Migración 001: Schema base de auth y perfiles
-- Fecha: 2026-04-01
-- ============================================================

-- Extensiones necesarias
create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────
-- TABLA: child_profiles
-- ─────────────────────────────────────────────
create table if not exists public.child_profiles (
  id                       uuid primary key default gen_random_uuid(),
  parent_user_id           uuid not null references auth.users(id) on delete cascade,
  nombre_display           text not null,
  edad                     integer,
  rango_edad               text,
  grado_escolar            text,
  companion_type           text not null default 'dog' check (companion_type in ('dog', 'cat')),
  theme_palette_id         text,
  background_style_id      text,
  refuge_name              text,
  profile_state            text not null default 'active' check (profile_state in ('active', 'paused')),
  onboarding_completed     boolean not null default false,

  -- Acceso por patrón (nunca almacenar patrón en texto plano)
  access_mode              text not null default 'pattern' check (access_mode = 'pattern'),
  pattern_enabled          boolean not null default true,
  pattern_hash             text,                     -- bcrypt hash del patrón
  pattern_set_at           timestamptz,
  pattern_updated_at       timestamptz,
  failed_pattern_attempts  integer not null default 0,
  pattern_locked_until     timestamptz,

  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- TABLA: child_context
-- ─────────────────────────────────────────────
create table if not exists public.child_context (
  id                            uuid primary key default gen_random_uuid(),
  child_profile_id              uuid not null references public.child_profiles(id) on delete cascade,
  principales_preocupaciones    text[] not null default '{}',
  composicion_hogar             text,
  situacion_familiar            text,
  horarios_sensibles            text,
  nota_parental_resumida        text,
  adults_safe_list              text[] not null default '{}',
  updated_at                    timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- TABLA: parental_consents
-- ─────────────────────────────────────────────
create table if not exists public.parental_consents (
  id                      uuid primary key default gen_random_uuid(),
  parent_user_id          uuid not null references auth.users(id) on delete cascade,
  child_profile_id        uuid not null references public.child_profiles(id) on delete cascade,
  consent_type            text not null,
  verification_method     text not null,
  verified_at             timestamptz not null default now(),
  version_privacy_policy  text not null,
  version_terms           text not null,
  status                  text not null default 'active' check (status in ('active', 'revoked')),
  revoked_at              timestamptz
);

-- ─────────────────────────────────────────────
-- TABLA: auth_events (auditoría)
-- ─────────────────────────────────────────────
create table if not exists public.auth_events (
  id                uuid primary key default gen_random_uuid(),
  child_profile_id  uuid references public.child_profiles(id) on delete set null,
  parent_user_id    uuid references auth.users(id) on delete set null,
  event_name        text not null,
  actor_type        text not null check (actor_type in ('child', 'parent', 'system')),
  metadata          jsonb,
  created_at        timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- TRIGGER: updated_at automático
-- ─────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_child_profiles_updated_at
  before update on public.child_profiles
  for each row execute procedure public.set_updated_at();

create trigger trg_child_context_updated_at
  before update on public.child_context
  for each row execute procedure public.set_updated_at();

-- ─────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────────
alter table public.child_profiles   enable row level security;
alter table public.child_context    enable row level security;
alter table public.parental_consents enable row level security;
alter table public.auth_events       enable row level security;

-- child_profiles: padre solo ve sus hijos
create policy "padre_ve_sus_hijos" on public.child_profiles
  for all using (auth.uid() = parent_user_id);

-- child_context: padre solo ve el contexto de sus hijos
create policy "padre_ve_contexto_de_sus_hijos" on public.child_context
  for all using (
    exists (
      select 1 from public.child_profiles cp
      where cp.id = child_context.child_profile_id
        and cp.parent_user_id = auth.uid()
    )
  );

-- parental_consents: padre solo ve sus consentimientos
create policy "padre_ve_sus_consentimientos" on public.parental_consents
  for all using (auth.uid() = parent_user_id);

-- auth_events: padre solo ve eventos de sus hijos o los suyos
create policy "padre_ve_sus_eventos_auth" on public.auth_events
  for select using (
    auth.uid() = parent_user_id
    or exists (
      select 1 from public.child_profiles cp
      where cp.id = auth_events.child_profile_id
        and cp.parent_user_id = auth.uid()
    )
  );

-- Solo inserción desde el sistema/edge functions para eventos
create policy "sistema_inserta_eventos_auth" on public.auth_events
  for insert with check (true);
