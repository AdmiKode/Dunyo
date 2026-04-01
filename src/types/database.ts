export type Database = {
  public: {
    Tables: {
      child_profiles: {
        Row: {
          id: string
          parent_user_id: string
          nombre_display: string
          edad: number | null
          rango_edad: string | null
          grado_escolar: string | null
          companion_type: 'dog' | 'cat'
          theme_palette_id: string | null
          background_style_id: string | null
          refuge_name: string | null
          profile_state: 'active' | 'paused'
          onboarding_completed: boolean
          access_mode: 'pattern'
          pattern_enabled: boolean
          pattern_hash: string | null
          pattern_set_at: string | null
          pattern_updated_at: string | null
          failed_pattern_attempts: number
          pattern_locked_until: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          parent_user_id: string
          nombre_display: string
          edad?: number | null
          rango_edad?: string | null
          grado_escolar?: string | null
          companion_type?: 'dog' | 'cat'
          theme_palette_id?: string | null
          background_style_id?: string | null
          refuge_name?: string | null
          profile_state?: 'active' | 'paused'
          onboarding_completed?: boolean
          access_mode?: 'pattern'
          pattern_enabled?: boolean
          pattern_hash?: string | null
          pattern_set_at?: string | null
          pattern_updated_at?: string | null
          failed_pattern_attempts?: number
          pattern_locked_until?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          parent_user_id?: string
          nombre_display?: string
          edad?: number | null
          rango_edad?: string | null
          grado_escolar?: string | null
          companion_type?: 'dog' | 'cat'
          theme_palette_id?: string | null
          background_style_id?: string | null
          refuge_name?: string | null
          profile_state?: 'active' | 'paused'
          onboarding_completed?: boolean
          access_mode?: 'pattern'
          pattern_enabled?: boolean
          pattern_hash?: string | null
          pattern_set_at?: string | null
          pattern_updated_at?: string | null
          failed_pattern_attempts?: number
          pattern_locked_until?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      child_context: {
        Row: {
          id: string
          child_profile_id: string
          principales_preocupaciones: string[]
          composicion_hogar: string | null
          situacion_familiar: string | null
          horarios_sensibles: string | null
          nota_parental_resumida: string | null
          adults_safe_list: string[]
          updated_at: string
        }
        Insert: {
          id?: string
          child_profile_id: string
          principales_preocupaciones?: string[]
          composicion_hogar?: string | null
          situacion_familiar?: string | null
          horarios_sensibles?: string | null
          nota_parental_resumida?: string | null
          adults_safe_list?: string[]
          updated_at?: string
        }
        Update: {
          id?: string
          child_profile_id?: string
          principales_preocupaciones?: string[]
          composicion_hogar?: string | null
          situacion_familiar?: string | null
          horarios_sensibles?: string | null
          nota_parental_resumida?: string | null
          adults_safe_list?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      parental_consents: {
        Row: {
          id: string
          parent_user_id: string
          child_profile_id: string
          consent_type: string
          verification_method: string
          verified_at: string
          version_privacy_policy: string
          version_terms: string
          status: 'active' | 'revoked'
          revoked_at: string | null
        }
        Insert: {
          id?: string
          parent_user_id: string
          child_profile_id: string
          consent_type: string
          verification_method: string
          verified_at?: string
          version_privacy_policy: string
          version_terms: string
          status?: 'active' | 'revoked'
          revoked_at?: string | null
        }
        Update: {
          id?: string
          parent_user_id?: string
          child_profile_id?: string
          consent_type?: string
          verification_method?: string
          verified_at?: string
          version_privacy_policy?: string
          version_terms?: string
          status?: 'active' | 'revoked'
          revoked_at?: string | null
        }
        Relationships: []
      }
      auth_events: {
        Row: {
          id: string
          child_profile_id: string | null
          parent_user_id: string | null
          event_name: string
          actor_type: 'child' | 'parent' | 'system'
          metadata: Record<string, unknown> | null
          created_at: string
        }
        Insert: {
          id?: string
          child_profile_id?: string | null
          parent_user_id?: string | null
          event_name: string
          actor_type: 'child' | 'parent' | 'system'
          metadata?: Record<string, unknown> | null
          created_at?: string
        }
        Update: never
        Relationships: []
      }
      safe_adults: {
        Row: {
          id: string
          child_profile_id: string
          parent_user_id: string
          nombre: string
          relacion: string
          contacto_info: string | null
          activo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          child_profile_id: string
          parent_user_id: string
          nombre: string
          relacion: string
          contacto_info?: string | null
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          child_profile_id?: string
          parent_user_id?: string
          nombre?: string
          relacion?: string
          contacto_info?: string | null
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      mood_checkins: {
        Row: {
          id: string
          child_profile_id: string
          emotion_primary: EmotionPrimary
          emotion_secondary: string | null
          intensity: number
          intensity_normalized: number
          context_primary: ContextPrimary
          person_id: string | null
          person_label: string | null
          wants_to_talk: boolean
          wants_only_help: boolean
          action_type: ActionType | null
          action_completed: boolean | null
          helpful_score: number | null
          free_text_short: string | null
          ai_emotion_normalized: string | null
          ai_emotion_secondary: string | null
          ai_distress_band: 'low' | 'mid' | 'high' | null
          ai_pattern_hint: string | null
          ai_suggested_intervention: string | null
          ai_share_level: 'private' | 'summary' | 'alert_candidate' | null
          ai_confidence: number | null
          ai_classified_at: string | null
          cluster_key: string | null
          time_band: TimeBand | null
          day_bucket: string | null
          week_bucket: string | null
          month_bucket: string | null
          is_night_distress: boolean
          is_avoidance: boolean
          is_support_request: boolean
          is_high_intensity: boolean
          is_low_helpfulness: boolean
          is_repeat_cluster: boolean
          is_no_idea_pattern: boolean
          is_sensitive_family: boolean
          created_at: string
        }
        Insert: {
          id?: string
          child_profile_id: string
          emotion_primary: EmotionPrimary
          emotion_secondary?: string | null
          intensity: number
          context_primary: ContextPrimary
          person_id?: string | null
          person_label?: string | null
          wants_to_talk?: boolean
          wants_only_help?: boolean
          action_type?: ActionType | null
          action_completed?: boolean | null
          helpful_score?: number | null
          free_text_short?: string | null
          created_at?: string
        }
        Update: {
          action_type?: ActionType | null
          action_completed?: boolean | null
          helpful_score?: number | null
          ai_emotion_normalized?: string | null
          ai_emotion_secondary?: string | null
          ai_distress_band?: 'low' | 'mid' | 'high' | null
          ai_pattern_hint?: string | null
          ai_suggested_intervention?: string | null
          ai_share_level?: 'private' | 'summary' | 'alert_candidate' | null
          ai_confidence?: number | null
          ai_classified_at?: string | null
        }
        Relationships: []
      }
      session_interventions: {
        Row: {
          id: string
          child_profile_id: string
          checkin_id: string | null
          intervention_slug: InterventionSlug
          duracion_segundos: number | null
          completado: boolean
          helpful_score: number | null
          metadata: Record<string, unknown> | null
          day_bucket: string | null
          week_bucket: string | null
          created_at: string
        }
        Insert: {
          id?: string
          child_profile_id: string
          checkin_id?: string | null
          intervention_slug: InterventionSlug
          duracion_segundos?: number | null
          completado?: boolean
          helpful_score?: number | null
          metadata?: Record<string, unknown> | null
          day_bucket?: string | null
          week_bucket?: string | null
          created_at?: string
        }
        Update: {
          completado?: boolean
          helpful_score?: number | null
          duracion_segundos?: number | null
        }
        Relationships: []
      }
      event_features: {
        Row: {
          id: string
          child_profile_id: string
          source_event_id: string
          source_type: string
          occurred_at: string
          emotion_primary: string
          emotion_secondary: string | null
          intensity: number
          context_primary: string | null
          person_id: string | null
          wants_to_talk: boolean
          wants_only_help: boolean
          action_type: string | null
          helpful_score: number | null
          cluster_key: string | null
          time_band: string | null
          day_bucket: string | null
          week_bucket: string | null
          month_bucket: string | null
          is_night_distress: boolean
          is_avoidance: boolean
          is_support_request: boolean
          is_high_intensity: boolean
          is_low_helpfulness: boolean
          is_repeat_cluster: boolean
          is_no_idea_pattern: boolean
          is_sensitive_family: boolean
          created_at: string
        }
        Insert: never
        Update: never
        Relationships: []
      }
      daily_metrics: {
        Row: {
          id: string
          child_profile_id: string
          metric_date: string
          els: number | null
          iti: number | null
          rss: number | null
          cis: number | null
          si: number | null
          evi: number | null
          rew_top_json: RewItem[] | null
          cps_top_json: CpsItem[] | null
          tdm_json: TdmItem[] | null
          hus_json: HusItem[] | null
          event_count: number
          avg_intensity: number | null
          support_request_count: number
          night_event_count: number
          no_talk_count: number
          no_idea_count: number
          avoidance_count: number
          high_intensity_count: number
          top_emotions_json: TopEmotionItem[] | null
          updated_at: string
        }
        Insert: {
          id?: string
          child_profile_id: string
          metric_date: string
          els?: number | null
          iti?: number | null
          rss?: number | null
          cis?: number | null
          si?: number | null
          evi?: number | null
          rew_top_json?: RewItem[] | null
          cps_top_json?: CpsItem[] | null
          tdm_json?: TdmItem[] | null
          hus_json?: HusItem[] | null
          event_count?: number
          avg_intensity?: number | null
          support_request_count?: number
          night_event_count?: number
          no_talk_count?: number
          no_idea_count?: number
          avoidance_count?: number
          high_intensity_count?: number
          top_emotions_json?: TopEmotionItem[] | null
        }
        Update: {
          els?: number | null
          iti?: number | null
          rss?: number | null
          cis?: number | null
          si?: number | null
          evi?: number | null
          rew_top_json?: RewItem[] | null
          cps_top_json?: CpsItem[] | null
          tdm_json?: TdmItem[] | null
          hus_json?: HusItem[] | null
          event_count?: number
          avg_intensity?: number | null
          support_request_count?: number
          night_event_count?: number
          no_talk_count?: number
          no_idea_count?: number
          avoidance_count?: number
          high_intensity_count?: number
          top_emotions_json?: TopEmotionItem[] | null
          updated_at?: string
        }
        Relationships: []
      }
      alert_records: {
        Row: {
          id: string
          child_profile_id: string
          parent_user_id: string
          severity: AlertSeverity
          trigger_rule: string
          status: AlertStatus
          window_start: string
          window_end: string
          metrics_snapshot: Record<string, unknown> | null
          summary_for_parent: string | null
          recommended_action: string | null
          acknowledged_at: string | null
          resolved_at: string | null
          resolution_note: string | null
          cluster_key: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          child_profile_id: string
          parent_user_id: string
          severity: AlertSeverity
          trigger_rule: string
          status?: AlertStatus
          window_start: string
          window_end: string
          metrics_snapshot?: Record<string, unknown> | null
          summary_for_parent?: string | null
          recommended_action?: string | null
          cluster_key?: string | null
        }
        Update: {
          status?: AlertStatus
          acknowledged_at?: string | null
          resolved_at?: string | null
          resolution_note?: string | null
          summary_for_parent?: string | null
          recommended_action?: string | null
        }
        Relationships: []
      }
      report_jobs: {
        Row: {
          id: string
          child_profile_id: string
          parent_user_id: string
          cadence_type: CadenceType
          status: ReportJobStatus
          period_start: string | null
          period_end: string | null
          next_run_at: string
          last_run_at: string | null
          report_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          child_profile_id: string
          parent_user_id: string
          cadence_type: CadenceType
          status?: ReportJobStatus
          period_start?: string | null
          period_end?: string | null
          next_run_at: string
          last_run_at?: string | null
          report_id?: string | null
        }
        Update: {
          status?: ReportJobStatus
          next_run_at?: string
          last_run_at?: string | null
          report_id?: string | null
          period_start?: string | null
          period_end?: string | null
        }
        Relationships: []
      }
      parent_reports: {
        Row: {
          id: string
          child_profile_id: string
          parent_user_id: string
          report_job_id: string | null
          report_type: CadenceType | 'triggered'
          period_start: string
          period_end: string
          state_band: StateBand | null
          has_alert: boolean
          alert_severity: AlertSeverity | 'none' | null
          report_json: ParentReportJson
          els_period: number | null
          si_period: number | null
          cis_period: number | null
          evi_period: number | null
          avg_intensity_period: number | null
          event_count_period: number | null
          generated_by: string
          groq_classified: boolean
          openai_summarized: boolean
          anthropic_audited: boolean
          email_sent_at: string | null
          viewed_at: string | null
          created_at: string
        }
        Insert: never
        Update: {
          viewed_at?: string | null
        }
        Relationships: []
      }
      ai_audit_logs: {
        Row: {
          id: string
          child_profile_id: string | null
          engine_type: AiEngineType
          provider: AiProvider
          model: string
          input_hash: string
          output_json: Record<string, unknown> | null
          risk_level_before: AlertLevel | null
          risk_level_after: AlertLevel | null
          validation_status: AiValidationStatus
          validation_flags: Record<string, unknown> | null
          latency_ms: number | null
          tokens_used: number | null
          cost_usd: number | null
          created_at: string
        }
        Insert: never
        Update: never
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

// ─── Enums / union types ──────────────────────────────────────────────────────

export type EmotionPrimary =
  | 'alegria' | 'calma' | 'miedo' | 'tristeza' | 'enojo'
  | 'confusion' | 'frustracion' | 'verguenza' | 'no_se'

export type ContextPrimary = 'casa' | 'escuela' | 'afuera' | 'coche' | 'online' | 'otro'

export type ActionType =
  | 'calmarme' | 'desahogarme' | 'pensar' | 'dormir' | 'ayudame_a_decirlo' | 'nada' | 'otro'

export type TimeBand = 'early_morning' | 'morning' | 'afternoon' | 'evening' | 'night'

export type InterventionSlug =
  | 'respiracion_478' | 'ayudame_a_decirlo' | 'desahogo_texto' | 'rutina_noche' | 'otro'

export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical'
export type AlertLevel    = 'no_alert' | 'low' | 'medium' | 'high' | 'critical'
export type AlertStatus   = 'active' | 'acknowledged' | 'resolved' | 'dismissed'
export type CadenceType   = 'weekly' | 'biweekly' | 'monthly'
export type ReportJobStatus = 'pending' | 'running' | 'done' | 'failed'
export type StateBand     = 'stable' | 'watch' | 'rising' | 'urgent'
export type AiEngineType  = 'clasificacion' | 'recomendacion' | 'resumen_parental' | 'auditoria_editorial'
export type AiProvider    = 'groq' | 'openai' | 'anthropic'
export type AiValidationStatus = 'pending' | 'approved' | 'flagged' | 'rejected'

// ─── JSON shapes para columnas jsonb ─────────────────────────────────────────

export type RewItem = {
  person_id: string | null
  person_label: string
  rew_score: number
  avg_intensity: number
  event_count: number
}

export type CpsItem = {
  context: string
  cps_score: number
  avg_intensity: number
  event_count: number
}

export type TdmItem = {
  person_id: string | null
  person_label: string
  trust_score: number
  distress_association_score: number
  calm_association_score: number
}

export type HusItem = {
  intervention_slug: string
  hus_score: number
  avg_helpful_score: number
  completion_rate: number
  use_count: number
}

export type TopEmotionItem = {
  emotion: string
  count: number
  avg_intensity: number
}

export type ParentReportJson = {
  report_type: string
  period_start: string
  period_end: string
  state_band: StateBand
  headline: string
  weekly_summary: string
  patterns_detected: {
    pattern_type: string
    label: string
    change: 'up' | 'down' | 'stable'
    strength: number
  }[]
  top_emotions: { emotion: string; share: number; avg_intensity: number }[]
  top_contexts: { context: string; share: number; avg_intensity: number }[]
  top_people: { person_label: string; weight: number; avg_intensity: number }[]
  sensitive_time_bands: { time_band: string; share: number }[]
  helpful_tools: { tool: string; utility_score: number }[]
  avoidance_signals: { suppression_index: number; communication_intent_score: number; note: string }
  conversation_suggestion: string
  what_to_avoid: string[]
  recommended_parent_action: string[]
  watchout: string
  alert_summary: {
    has_alert: boolean
    severity: AlertLevel
    summary: string
    recommended_action: string
  }
}

// ─── Tipos de conveniencia ────────────────────────────────────────────────────

export type ChildProfile = Database['public']['Tables']['child_profiles']['Row']
export type ChildProfileInsert = Database['public']['Tables']['child_profiles']['Insert']
export type ChildContext = Database['public']['Tables']['child_context']['Row']
export type ParentalConsent = Database['public']['Tables']['parental_consents']['Row']
export type AuthEvent = Database['public']['Tables']['auth_events']['Row']
export type SafeAdult = Database['public']['Tables']['safe_adults']['Row']
export type SafeAdultInsert = Database['public']['Tables']['safe_adults']['Insert']
export type MoodCheckin = Database['public']['Tables']['mood_checkins']['Row']
export type MoodCheckinInsert = Database['public']['Tables']['mood_checkins']['Insert']
export type SessionIntervention = Database['public']['Tables']['session_interventions']['Row']
export type SessionInterventionInsert = Database['public']['Tables']['session_interventions']['Insert']
export type DailyMetrics = Database['public']['Tables']['daily_metrics']['Row']
export type AlertRecord = Database['public']['Tables']['alert_records']['Row']
export type ReportJob = Database['public']['Tables']['report_jobs']['Row']
export type ParentReport = Database['public']['Tables']['parent_reports']['Row']
export type AiAuditLog = Database['public']['Tables']['ai_audit_logs']['Row']

export type AuthEventName =
  | 'parent_signup_started'
  | 'parent_signup_completed'
  | 'parent_login_success'
  | 'parent_password_reset_started'
  | 'child_pattern_setup_started'
  | 'child_pattern_setup_completed'
  | 'child_pattern_confirm_failed'
  | 'child_pattern_unlock_success'
  | 'child_pattern_unlock_failed'
  | 'child_pattern_change_started'
  | 'child_pattern_change_completed'
  | 'child_pattern_reset_by_parent'
