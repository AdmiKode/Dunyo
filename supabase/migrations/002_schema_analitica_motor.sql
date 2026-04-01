-- ============================================================
-- DUNYO — Migración 002: Motor analítico completo
-- Fecha: 2026-04-01
-- Cubre: mood_checkins, safe_adults, session_interventions,
--        event_features, daily_metrics, alert_records,
--        parent_reports, report_jobs, ai_audit_logs
-- ============================================================

-- ─────────────────────────────────────────────
-- TABLA: safe_adults
-- Personas de confianza del niño, gestionadas por el padre
-- ─────────────────────────────────────────────
create table if not exists public.safe_adults (
  id                  uuid primary key default gen_random_uuid(),
  child_profile_id    uuid not null references public.child_profiles(id) on delete cascade,
  parent_user_id      uuid not null references auth.users(id) on delete cascade,
  nombre              text not null,
  relacion            text not null,   -- mama, papa, abuela, amigo, profe, otro
  contacto_info       text,            -- solo para uso de los padres, no se muestra al niño
  activo              boolean not null default true,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create trigger trg_safe_adults_updated_at
  before update on public.safe_adults
  for each row execute procedure public.set_updated_at();

-- ─────────────────────────────────────────────
-- TABLA: mood_checkins
-- Registro emocional crudo del niño — núcleo del sistema
-- ─────────────────────────────────────────────
create table if not exists public.mood_checkins (
  id                    uuid primary key default gen_random_uuid(),
  child_profile_id      uuid not null references public.child_profiles(id) on delete cascade,

  -- Datos capturados en el flujo de 4 pasos
  emotion_primary       text not null,       -- alegria, calma, miedo, tristeza, enojo, confusion, frustracion, verguenza, no_se
  emotion_secondary     text,                -- opcional, post-clasificación
  intensity             integer not null check (intensity between 1 and 10),
  intensity_normalized  integer generated always as (intensity * 10) stored,  -- 10–100 para métricas
  context_primary       text not null,       -- casa, escuela, afuera, coche, online, otro
  person_id             uuid references public.safe_adults(id) on delete set null,  -- nullable
  person_label          text,                -- snapshot del nombre en caso de que se borre

  -- Intención de comunicación
  wants_to_talk         boolean not null default false,
  wants_only_help       boolean not null default false,

  -- Acción elegida post-checkin
  action_type           text check (action_type in ('calmarme','desahogarme','pensar','dormir','ayudame_a_decirlo','nada','otro')),
  action_completed      boolean,
  helpful_score         integer check (helpful_score between 0 and 100),

  -- Texto libre corto opcional (máx 280 chars, solo para niño)
  free_text_short       text check (char_length(free_text_short) <= 280),

  -- Clasificación de IA (se llena async tras guardar el registro)
  ai_emotion_normalized   text,
  ai_emotion_secondary    text,
  ai_distress_band        text check (ai_distress_band in ('low','mid','high')),
  ai_pattern_hint         text,
  ai_suggested_intervention text,
  ai_share_level          text check (ai_share_level in ('private','summary','alert_candidate')),
  ai_confidence           numeric(4,2),
  ai_classified_at        timestamptz,

  -- Clustering temporal para métricas
  cluster_key           text,               -- emotion|context|person_id_or_none|time_band
  time_band             text check (time_band in ('early_morning','morning','afternoon','evening','night')),
  day_bucket            date,
  week_bucket           text,               -- YYYY-WW
  month_bucket          text,               -- YYYY-MM

  -- Flags operativas (se calculan al insertar o actualizar)
  is_night_distress       boolean not null default false,
  is_avoidance            boolean not null default false,
  is_support_request      boolean not null default false,
  is_high_intensity       boolean not null default false,
  is_low_helpfulness      boolean not null default false,
  is_repeat_cluster       boolean not null default false,
  is_no_idea_pattern      boolean not null default false,
  is_sensitive_family     boolean not null default false,

  created_at             timestamptz not null default now()
);

-- Índices de uso frecuente en métricas y alertas
create index idx_mood_checkins_child_day    on public.mood_checkins(child_profile_id, day_bucket);
create index idx_mood_checkins_child_week   on public.mood_checkins(child_profile_id, week_bucket);
create index idx_mood_checkins_cluster      on public.mood_checkins(child_profile_id, cluster_key);
create index idx_mood_checkins_distress     on public.mood_checkins(child_profile_id, is_high_intensity, created_at);

-- ─────────────────────────────────────────────
-- TABLA: session_interventions
-- Registro de cada uso de herramienta (Calmarme, etc.)
-- ─────────────────────────────────────────────
create table if not exists public.session_interventions (
  id                  uuid primary key default gen_random_uuid(),
  child_profile_id    uuid not null references public.child_profiles(id) on delete cascade,
  checkin_id          uuid references public.mood_checkins(id) on delete set null,

  intervention_slug   text not null,     -- respiracion_478, ayudame_a_decirlo, desahogo_texto, etc.
  duracion_segundos   integer,
  completado          boolean not null default false,
  helpful_score       integer check (helpful_score between 0 and 100),

  -- Datos extra según tipo
  metadata            jsonb,

  day_bucket          date,
  week_bucket         text,

  created_at          timestamptz not null default now()
);

create index idx_session_interventions_child on public.session_interventions(child_profile_id, day_bucket);

-- ─────────────────────────────────────────────
-- TABLA: event_features
-- Features normalizados derivados de mood_checkins
-- Capa 1 del motor analítico
-- ─────────────────────────────────────────────
create table if not exists public.event_features (
  id                    uuid primary key default gen_random_uuid(),
  child_profile_id      uuid not null references public.child_profiles(id) on delete cascade,
  source_event_id       uuid not null references public.mood_checkins(id) on delete cascade,
  source_type           text not null default 'mood_checkin',

  occurred_at           timestamptz not null,

  emotion_primary       text not null,
  emotion_secondary     text,
  intensity             integer not null,       -- 10–100 (normalizado)

  context_primary       text,
  person_id             uuid references public.safe_adults(id) on delete set null,

  wants_to_talk         boolean not null default false,
  wants_only_help       boolean not null default false,
  action_type           text,
  helpful_score         integer,

  cluster_key           text,
  time_band             text,
  day_bucket            date,
  week_bucket           text,
  month_bucket          text,

  -- Flags
  is_night_distress       boolean not null default false,
  is_avoidance            boolean not null default false,
  is_support_request      boolean not null default false,
  is_high_intensity       boolean not null default false,
  is_low_helpfulness      boolean not null default false,
  is_repeat_cluster       boolean not null default false,
  is_no_idea_pattern      boolean not null default false,
  is_sensitive_family     boolean not null default false,

  created_at             timestamptz not null default now()
);

create index idx_event_features_child_week  on public.event_features(child_profile_id, week_bucket);
create index idx_event_features_cluster     on public.event_features(child_profile_id, cluster_key);

-- ─────────────────────────────────────────────
-- TABLA: daily_metrics
-- Métricas calculadas por día por child_profile
-- Capa 2 del motor analítico
-- ─────────────────────────────────────────────
create table if not exists public.daily_metrics (
  id                    uuid primary key default gen_random_uuid(),
  child_profile_id      uuid not null references public.child_profiles(id) on delete cascade,
  metric_date           date not null,

  -- Métricas principales 0–100
  els                   numeric(5,2),   -- Emotional Load Score
  iti                   numeric(5,2),   -- Intensity Trend Index (puede ser negativo)
  rss                   numeric(5,2),   -- Recovery Speed Score
  cis                   numeric(5,2),   -- Communication Intent Score
  si                    numeric(5,2),   -- Suppression Index
  evi                   numeric(5,2),   -- Emotional Volatility Index

  -- REW: top 3 personas con más peso emocional (JSON array)
  rew_top_json          jsonb,
  -- CPS: top 3 contextos con más presión emocional (JSON array)
  cps_top_json          jsonb,
  -- TDM: confianza y asociación calma/distress por persona (JSON array)
  tdm_json              jsonb,
  -- HUS: utilidad por herramienta (JSON array)
  hus_json              jsonb,

  -- Conteos base para recalcular si es necesario
  event_count           integer not null default 0,
  avg_intensity         numeric(5,2),
  support_request_count integer not null default 0,
  night_event_count     integer not null default 0,
  no_talk_count         integer not null default 0,
  no_idea_count         integer not null default 0,
  avoidance_count       integer not null default 0,
  high_intensity_count  integer not null default 0,

  -- Top emociones del día (JSON array [{emotion, count, avg_intensity}])
  top_emotions_json     jsonb,

  updated_at            timestamptz not null default now(),

  unique(child_profile_id, metric_date)
);

create trigger trg_daily_metrics_updated_at
  before update on public.daily_metrics
  for each row execute procedure public.set_updated_at();

create index idx_daily_metrics_child_date on public.daily_metrics(child_profile_id, metric_date desc);

-- ─────────────────────────────────────────────
-- TABLA: alert_records
-- Alertas generadas por el motor de riesgo
-- ─────────────────────────────────────────────
create table if not exists public.alert_records (
  id                    uuid primary key default gen_random_uuid(),
  child_profile_id      uuid not null references public.child_profiles(id) on delete cascade,
  parent_user_id        uuid not null references auth.users(id) on delete cascade,

  severity              text not null check (severity in ('low','medium','high','critical')),
  trigger_rule          text not null,   -- código de la regla que la disparó (ej: 'ELS_HIGH_7D')
  status                text not null default 'active' check (status in ('active','acknowledged','resolved','dismissed')),

  -- Ventana de datos que la generó
  window_start          timestamptz not null,
  window_end            timestamptz not null,

  -- Métricas snapshot al momento de la alerta
  metrics_snapshot      jsonb,

  -- Texto generado para el padre (auditado por Anthropic para high/critical)
  summary_for_parent    text,
  recommended_action    text,

  -- Seguimiento
  acknowledged_at       timestamptz,
  resolved_at           timestamptz,
  resolution_note       text,

  -- Deduplicación: solo una alerta activa por cluster
  cluster_key           text,

  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create trigger trg_alert_records_updated_at
  before update on public.alert_records
  for each row execute procedure public.set_updated_at();

create index idx_alert_records_active on public.alert_records(child_profile_id, status, severity);
create index idx_alert_records_parent on public.alert_records(parent_user_id, status);

-- ─────────────────────────────────────────────
-- TABLA: report_jobs
-- Programador de reportes parentales
-- ─────────────────────────────────────────────
create table if not exists public.report_jobs (
  id                  uuid primary key default gen_random_uuid(),
  child_profile_id    uuid not null references public.child_profiles(id) on delete cascade,
  parent_user_id      uuid not null references auth.users(id) on delete cascade,

  cadence_type        text not null check (cadence_type in ('weekly','biweekly','monthly')),
  status              text not null default 'pending' check (status in ('pending','running','done','failed')),

  period_start        date,
  period_end          date,
  next_run_at         date not null,
  last_run_at         date,

  report_id           uuid,   -- FK a parent_reports, se llena cuando se genera

  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),

  unique(child_profile_id, cadence_type)
);

create trigger trg_report_jobs_updated_at
  before update on public.report_jobs
  for each row execute procedure public.set_updated_at();

-- ─────────────────────────────────────────────
-- TABLA: parent_reports
-- Reportes parentales generados y entregados
-- ─────────────────────────────────────────────
create table if not exists public.parent_reports (
  id                    uuid primary key default gen_random_uuid(),
  child_profile_id      uuid not null references public.child_profiles(id) on delete cascade,
  parent_user_id        uuid not null references auth.users(id) on delete cascade,
  report_job_id         uuid references public.report_jobs(id) on delete set null,

  report_type           text not null check (report_type in ('weekly','biweekly','monthly','triggered')),
  period_start          date not null,
  period_end            date not null,

  -- Estado del generador
  state_band            text check (state_band in ('stable','watch','rising','urgent')),
  has_alert             boolean not null default false,
  alert_severity        text check (alert_severity in ('none','low','medium','high','critical')),

  -- JSON final validado (schema completo del Orquestador §12)
  report_json           jsonb not null,

  -- Métricas del periodo (redundancia conveniente para queries de panel)
  els_period            numeric(5,2),
  si_period             numeric(5,2),
  cis_period            numeric(5,2),
  evi_period            numeric(5,2),
  avg_intensity_period  numeric(5,2),
  event_count_period    integer,

  -- Trazabilidad de generación
  generated_by          text not null default 'system',  -- system | manual
  groq_classified       boolean not null default false,
  openai_summarized     boolean not null default false,
  anthropic_audited     boolean not null default false,

  -- Entrega
  email_sent_at         timestamptz,
  viewed_at             timestamptz,

  created_at            timestamptz not null default now()
);

create index idx_parent_reports_child on public.parent_reports(child_profile_id, period_end desc);
create index idx_parent_reports_parent on public.parent_reports(parent_user_id, created_at desc);

-- ─────────────────────────────────────────────
-- TABLA: ai_audit_logs
-- Auditoría de todas las llamadas a LLMs
-- ─────────────────────────────────────────────
create table if not exists public.ai_audit_logs (
  id                    uuid primary key default gen_random_uuid(),
  child_profile_id      uuid references public.child_profiles(id) on delete set null,

  engine_type           text not null check (engine_type in ('clasificacion','recomendacion','resumen_parental','auditoria_editorial')),
  provider              text not null check (provider in ('groq','openai','anthropic')),
  model                 text not null,

  -- Nunca guardar el input completo con PII — solo hash para trazabilidad
  input_hash            text not null,        -- SHA-256 del payload enviado
  output_json           jsonb,                -- respuesta estructurada del LLM

  risk_level_before     text check (risk_level_before in ('no_alert','low','medium','high','critical')),
  risk_level_after      text check (risk_level_after in ('no_alert','low','medium','high','critical')),

  validation_status     text not null default 'pending' check (validation_status in ('pending','approved','flagged','rejected')),
  validation_flags      jsonb,               -- flags de Anthropic si aplica

  latency_ms            integer,
  tokens_used           integer,
  cost_usd              numeric(10,6),

  created_at            timestamptz not null default now()
);

create index idx_ai_audit_logs_child   on public.ai_audit_logs(child_profile_id, created_at desc);
create index idx_ai_audit_logs_flagged on public.ai_audit_logs(validation_status) where validation_status in ('flagged','rejected');

-- ─────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────────
alter table public.safe_adults            enable row level security;
alter table public.mood_checkins          enable row level security;
alter table public.session_interventions  enable row level security;
alter table public.event_features         enable row level security;
alter table public.daily_metrics          enable row level security;
alter table public.alert_records          enable row level security;
alter table public.report_jobs            enable row level security;
alter table public.parent_reports         enable row level security;
alter table public.ai_audit_logs          enable row level security;

-- safe_adults: padre ve y gestiona los adultos de sus hijos
create policy "padre_gestiona_adultos_seguros" on public.safe_adults
  for all using (auth.uid() = parent_user_id);

-- mood_checkins: padre ve los check-ins de sus hijos
create policy "padre_ve_checkins_de_sus_hijos" on public.mood_checkins
  for select using (
    exists (
      select 1 from public.child_profiles cp
      where cp.id = mood_checkins.child_profile_id
        and cp.parent_user_id = auth.uid()
    )
  );

-- mood_checkins: inserción solo desde cliente (el niño en sesión del padre)
create policy "cliente_inserta_checkin" on public.mood_checkins
  for insert with check (
    exists (
      select 1 from public.child_profiles cp
      where cp.id = mood_checkins.child_profile_id
        and cp.parent_user_id = auth.uid()
    )
  );

-- session_interventions: mismo patrón
create policy "padre_ve_intervenciones" on public.session_interventions
  for select using (
    exists (
      select 1 from public.child_profiles cp
      where cp.id = session_interventions.child_profile_id
        and cp.parent_user_id = auth.uid()
    )
  );

create policy "cliente_inserta_intervencion" on public.session_interventions
  for insert with check (
    exists (
      select 1 from public.child_profiles cp
      where cp.id = session_interventions.child_profile_id
        and cp.parent_user_id = auth.uid()
    )
  );

-- event_features: solo lectura para el padre, escritura desde edge functions (service role)
create policy "padre_ve_event_features" on public.event_features
  for select using (
    exists (
      select 1 from public.child_profiles cp
      where cp.id = event_features.child_profile_id
        and cp.parent_user_id = auth.uid()
    )
  );

-- daily_metrics: padre lee las métricas de sus hijos
create policy "padre_ve_daily_metrics" on public.daily_metrics
  for select using (
    exists (
      select 1 from public.child_profiles cp
      where cp.id = daily_metrics.child_profile_id
        and cp.parent_user_id = auth.uid()
    )
  );

-- alert_records: padre ve y gestiona sus alertas
create policy "padre_ve_y_gestiona_alertas" on public.alert_records
  for all using (auth.uid() = parent_user_id);

-- report_jobs: padre gestiona sus cadencias
create policy "padre_gestiona_report_jobs" on public.report_jobs
  for all using (auth.uid() = parent_user_id);

-- parent_reports: padre lee sus reportes
create policy "padre_lee_sus_reportes" on public.parent_reports
  for select using (auth.uid() = parent_user_id);

-- ai_audit_logs: padre puede leer logs de sus hijos (transparencia)
create policy "padre_lee_audit_logs_de_sus_hijos" on public.ai_audit_logs
  for select using (
    exists (
      select 1 from public.child_profiles cp
      where cp.id = ai_audit_logs.child_profile_id
        and cp.parent_user_id = auth.uid()
    )
  );

-- ─────────────────────────────────────────────
-- FUNCIÓN: calcular time_band desde timestamp
-- ─────────────────────────────────────────────
create or replace function public.get_time_band(ts timestamptz)
returns text language sql immutable as $$
  select case
    when extract(hour from ts at time zone 'America/Mexico_City') between 5 and 7  then 'early_morning'
    when extract(hour from ts at time zone 'America/Mexico_City') between 8 and 12 then 'morning'
    when extract(hour from ts at time zone 'America/Mexico_City') between 13 and 17 then 'afternoon'
    when extract(hour from ts at time zone 'America/Mexico_City') between 18 and 21 then 'evening'
    else 'night'
  end
$$;

-- ─────────────────────────────────────────────
-- FUNCIÓN: construir cluster_key
-- ─────────────────────────────────────────────
create or replace function public.build_cluster_key(
  emotion text,
  context text,
  person_id uuid
) returns text language sql immutable as $$
  select emotion || '|' || context || '|' || coalesce(person_id::text, 'none')
$$;

-- ─────────────────────────────────────────────
-- TRIGGER: rellenar campos calculados en mood_checkins al insertar
-- ─────────────────────────────────────────────
create or replace function public.fill_checkin_fields()
returns trigger language plpgsql as $$
begin
  -- time_band y buckets temporales
  new.time_band    := public.get_time_band(new.created_at);
  new.day_bucket   := (new.created_at at time zone 'America/Mexico_City')::date;
  new.week_bucket  := to_char(new.created_at at time zone 'America/Mexico_City', 'IYYY-IW');
  new.month_bucket := to_char(new.created_at at time zone 'America/Mexico_City', 'YYYY-MM');
  new.cluster_key  := public.build_cluster_key(new.emotion_primary, new.context_primary, new.person_id);

  -- Flags operativas
  new.is_night_distress  := new.time_band = 'night' and new.intensity_normalized >= 60;
  new.is_avoidance       := (new.wants_to_talk = false and (new.action_type is null or new.action_type = 'nada'));
  new.is_support_request := new.wants_to_talk = true or new.wants_only_help = true;
  new.is_high_intensity  := new.intensity_normalized >= 70;
  new.is_low_helpfulness := new.helpful_score is not null and new.helpful_score < 40;
  new.is_no_idea_pattern := new.emotion_primary = 'no_se';

  -- is_repeat_cluster: si existe un check-in previo en los últimos 7 días con el mismo cluster
  select exists (
    select 1 from public.mood_checkins mc
    where mc.child_profile_id = new.child_profile_id
      and mc.cluster_key = public.build_cluster_key(new.emotion_primary, new.context_primary, new.person_id)
      and mc.created_at >= now() - interval '7 days'
  ) into new.is_repeat_cluster;

  return new;
end;
$$;

create trigger trg_mood_checkins_fill_fields
  before insert on public.mood_checkins
  for each row execute procedure public.fill_checkin_fields();

-- ─────────────────────────────────────────────
-- FUNCIÓN: propagar mood_checkin a event_features
-- ─────────────────────────────────────────────
create or replace function public.propagate_to_event_features()
returns trigger language plpgsql as $$
begin
  insert into public.event_features (
    child_profile_id, source_event_id, source_type,
    occurred_at, emotion_primary, emotion_secondary,
    intensity, context_primary, person_id,
    wants_to_talk, wants_only_help, action_type, helpful_score,
    cluster_key, time_band, day_bucket, week_bucket, month_bucket,
    is_night_distress, is_avoidance, is_support_request,
    is_high_intensity, is_low_helpfulness, is_repeat_cluster,
    is_no_idea_pattern, is_sensitive_family
  ) values (
    new.child_profile_id, new.id, 'mood_checkin',
    new.created_at, new.emotion_primary, new.emotion_secondary,
    new.intensity_normalized, new.context_primary, new.person_id,
    new.wants_to_talk, new.wants_only_help, new.action_type, new.helpful_score,
    new.cluster_key, new.time_band, new.day_bucket, new.week_bucket, new.month_bucket,
    new.is_night_distress, new.is_avoidance, new.is_support_request,
    new.is_high_intensity, new.is_low_helpfulness, new.is_repeat_cluster,
    new.is_no_idea_pattern, new.is_sensitive_family
  );
  return new;
end;
$$;

create trigger trg_mood_checkins_propagate
  after insert on public.mood_checkins
  for each row execute procedure public.propagate_to_event_features();
