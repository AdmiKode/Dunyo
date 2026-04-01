import { supabase } from './supabase'
import {
  MoodCheckinInsert, MoodCheckin, SafeAdult, SafeAdultInsert,
  SessionInterventionInsert, SessionIntervention, EmotionPrimary, ContextPrimary, ActionType,
} from '../types/database'

// ─── Safe Adults ─────────────────────────────────────────────────────────────

export async function obtenerAdultosSegurosPorNino(childProfileId: string): Promise<SafeAdult[]> {
  const { data, error } = await supabase
    .from('safe_adults')
    .select('*')
    .eq('child_profile_id', childProfileId)
    .eq('activo', true)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function crearAdultoSeguro(adulto: SafeAdultInsert): Promise<SafeAdult> {
  const { data, error } = await supabase
    .from('safe_adults')
    .insert(adulto)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function eliminarAdultoSeguro(id: string): Promise<void> {
  const { error } = await supabase
    .from('safe_adults')
    .update({ activo: false })
    .eq('id', id)
  if (error) throw error
}

// ─── Mood Checkins ────────────────────────────────────────────────────────────

export async function insertarCheckin(
  checkin: MoodCheckinInsert
): Promise<MoodCheckin> {
  const { data, error } = await supabase
    .from('mood_checkins')
    .insert(checkin)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function actualizarCheckinAccion(
  checkinId: string,
  accion: {
    action_type?: ActionType
    action_completed?: boolean
    helpful_score?: number
  }
): Promise<void> {
  const { error } = await supabase
    .from('mood_checkins')
    .update(accion)
    .eq('id', checkinId)
  if (error) throw error
}

export async function obtenerUltimosCheckins(
  childProfileId: string,
  limite = 10
): Promise<MoodCheckin[]> {
  const { data, error } = await supabase
    .from('mood_checkins')
    .select('*')
    .eq('child_profile_id', childProfileId)
    .order('created_at', { ascending: false })
    .limit(limite)
  if (error) throw error
  return data ?? []
}

export async function obtenerCheckinsDeSemana(
  childProfileId: string,
  weekBucket: string
): Promise<MoodCheckin[]> {
  const { data, error } = await supabase
    .from('mood_checkins')
    .select('*')
    .eq('child_profile_id', childProfileId)
    .eq('week_bucket', weekBucket)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data ?? []
}

// ─── Session Interventions ───────────────────────────────────────────────────

export async function insertarIntervencion(
  intervencion: SessionInterventionInsert
): Promise<SessionIntervention> {
  const hoy = new Date()
  const dayBucket = hoy.toISOString().split('T')[0]
  const year = hoy.getFullYear()
  const startOfYear = new Date(year, 0, 1)
  const semana = Math.ceil(
    ((hoy.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7
  )
  const weekBucket = `${year}-${String(semana).padStart(2, '0')}`

  const { data, error } = await supabase
    .from('session_interventions')
    .insert({ ...intervencion, day_bucket: dayBucket, week_bucket: weekBucket })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function actualizarIntervencion(
  id: string,
  datos: { completado?: boolean; helpful_score?: number; duracion_segundos?: number }
): Promise<void> {
  const { error } = await supabase
    .from('session_interventions')
    .update(datos)
    .eq('id', id)
  if (error) throw error
}

// ─── Helpers de UI ───────────────────────────────────────────────────────────

// Obtiene el último check-in del día actual para mostrar en Home
export async function obtenerCheckinDeHoy(
  childProfileId: string
): Promise<MoodCheckin | null> {
  const hoy = new Date().toISOString().split('T')[0]
  const { data, error } = await supabase
    .from('mood_checkins')
    .select('*')
    .eq('child_profile_id', childProfileId)
    .eq('day_bucket', hoy)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error) throw error
  return data
}

// Obtiene los últimos 7 días de check-ins para la gráfica semanal
export async function obtenerCheckinsSemanaActual(
  childProfileId: string
): Promise<MoodCheckin[]> {
  const hace7dias = new Date()
  hace7dias.setDate(hace7dias.getDate() - 6)
  hace7dias.setHours(0, 0, 0, 0)

  const { data, error } = await supabase
    .from('mood_checkins')
    .select('id, emotion_primary, intensity_normalized, day_bucket, time_band, created_at')
    .eq('child_profile_id', childProfileId)
    .gte('created_at', hace7dias.toISOString())
    .order('created_at', { ascending: true })
  if (error) throw error
  return (data ?? []) as MoodCheckin[]
}

// ─── Colores y etiquetas de emociones ────────────────────────────────────────

export const COLORES_EMOCION: Record<EmotionPrimary, string> = {
  alegria:    '#FCE6B7',
  calma:      '#D7D4B1',
  miedo:      '#D8EBF9',
  tristeza:   '#C5D9EC',
  enojo:      '#E8C4B4',
  confusion:  '#D9D5C2',
  frustracion:'#E4C9B8',
  verguenza:  '#DDD0C8',
  no_se:      '#EDEAE0',
}

export const ETIQUETAS_EMOCION: Record<EmotionPrimary, string> = {
  alegria:    'Alegria',
  calma:      'Calma',
  miedo:      'Miedo',
  tristeza:   'Tristeza',
  enojo:      'Enojo',
  confusion:  'Confusion',
  frustracion:'Frustracion',
  verguenza:  'Verguenza',
  no_se:      'No se que siento',
}

export const ETIQUETAS_CONTEXTO: Record<ContextPrimary, string> = {
  casa:     'Casa',
  escuela:  'Escuela',
  afuera:   'Afuera',
  coche:    'En el coche',
  online:   'Online',
  otro:     'Otro lugar',
}
