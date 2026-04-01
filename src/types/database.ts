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
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

// Tipos de conveniencia para usar en el resto del proyecto
export type ChildProfile = Database['public']['Tables']['child_profiles']['Row']
export type ChildProfileInsert = Database['public']['Tables']['child_profiles']['Insert']
export type ChildContext = Database['public']['Tables']['child_context']['Row']
export type ParentalConsent = Database['public']['Tables']['parental_consents']['Row']
export type AuthEvent = Database['public']['Tables']['auth_events']['Row']

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
