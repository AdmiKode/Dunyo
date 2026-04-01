import { supabase } from './supabase'
import { DailyMetrics, AlertRecord, MoodCheckin, TopEmotionItem } from '../types/database'

// ─── Daily Metrics ────────────────────────────────────────────────────────────

export async function obtenerMetricasUltimos7Dias(
  childProfileId: string
): Promise<DailyMetrics[]> {
  const hace7dias = new Date()
  hace7dias.setDate(hace7dias.getDate() - 6)
  const desde = hace7dias.toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('daily_metrics')
    .select('*')
    .eq('child_profile_id', childProfileId)
    .gte('metric_date', desde)
    .order('metric_date', { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function obtenerMetricasUltimos30Dias(
  childProfileId: string
): Promise<DailyMetrics[]> {
  const hace30dias = new Date()
  hace30dias.setDate(hace30dias.getDate() - 29)
  const desde = hace30dias.toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('daily_metrics')
    .select('*')
    .eq('child_profile_id', childProfileId)
    .gte('metric_date', desde)
    .order('metric_date', { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function obtenerMetricaDeHoy(
  childProfileId: string
): Promise<DailyMetrics | null> {
  const hoy = new Date().toISOString().split('T')[0]
  const { data, error } = await supabase
    .from('daily_metrics')
    .select('*')
    .eq('child_profile_id', childProfileId)
    .eq('metric_date', hoy)
    .maybeSingle()
  if (error) throw error
  return data
}

// ─── Cálculo local de métricas (desde event_features crudos) ─────────────────
// Se usa cuando daily_metrics aún no fue calculado por la edge function
// (la edge function corre en batch nocturno; esto es el cálculo en cliente para el mismo día)

export function calcularELSLocal(checkins: MoodCheckin[]): number {
  const total = checkins.length
  if (total === 0) return 0

  // freq_score
  let freqScore = 0
  if (total === 1) freqScore = 20
  else if (total <= 3) freqScore = 40
  else if (total <= 5) freqScore = 60
  else if (total <= 7) freqScore = 80
  else freqScore = 100

  // avg_intensity (normalizado 10-100)
  const avgIntensity =
    checkins.reduce((s, c) => s + c.intensity_normalized, 0) / total

  // repeat_score: % de checkins que pertenecen al cluster dominante
  const clusterConteo: Record<string, number> = {}
  for (const c of checkins) {
    if (c.cluster_key) {
      clusterConteo[c.cluster_key] = (clusterConteo[c.cluster_key] ?? 0) + 1
    }
  }
  const maxCluster = Math.max(...Object.values(clusterConteo), 0)
  const repeatScore = total > 0 ? (maxCluster / total) * 100 : 0

  // suppression_index local
  const avoidanceCount = checkins.filter(c => c.is_avoidance).length
  const si = total > 0 ? (avoidanceCount / total) * 100 : 0

  // volatility: cambios bruscos de intensidad entre checkins consecutivos
  let totalDelta = 0
  let emotionSwitches = 0
  for (let i = 1; i < checkins.length; i++) {
    totalDelta += Math.abs(checkins[i].intensity_normalized - checkins[i - 1].intensity_normalized)
    if (checkins[i].emotion_primary !== checkins[i - 1].emotion_primary) emotionSwitches++
  }
  const avgDelta = total > 1 ? totalDelta / (total - 1) : 0
  const evi = Math.min(100, Math.round(avgDelta * 0.8 + emotionSwitches * 8))

  const els = Math.round(
    0.30 * freqScore +
    0.30 * avgIntensity +
    0.20 * repeatScore +
    0.10 * si +
    0.10 * evi
  )

  return Math.min(100, Math.max(0, els))
}

export function interpretarELS(els: number): {
  banda: string
  descripcion: string
  colorHex: string
} {
  if (els <= 24)  return { banda: 'bajo',     descripcion: 'Todo tranquilo',      colorHex: '#D7D4B1' }
  if (els <= 49)  return { banda: 'leve',     descripcion: 'Algo en el ambiente', colorHex: '#FCE6B7' }
  if (els <= 69)  return { banda: 'moderado', descripcion: 'Dia intenso',         colorHex: '#E8C4B4' }
  if (els <= 84)  return { banda: 'alto',     descripcion: 'Carga alta',          colorHex: '#D4A898' }
  return           { banda: 'muy_alto',  descripcion: 'Necesita atencion',   colorHex: '#C4907A' }
}

export function calcularSILocal(checkins: MoodCheckin[]): number {
  const total = checkins.length
  if (total === 0) return 0
  return Math.round((checkins.filter(c => c.is_avoidance).length / total) * 100)
}

export function calcularCISLocal(checkins: MoodCheckin[]): number {
  const total = checkins.length
  if (total === 0) return 0
  const talkEvents = checkins.filter(c => c.wants_to_talk).length
  const supportRequests = checkins.filter(c => c.is_support_request).length
  return Math.min(100, Math.round(((talkEvents * 1.0 + supportRequests * 1.2) / total) * 100))
}

export function obtenerTopEmocionesDeSemana(checkins: MoodCheckin[]): TopEmotionItem[] {
  const mapa: Record<string, { count: number; totalIntensity: number }> = {}
  for (const c of checkins) {
    if (!mapa[c.emotion_primary]) mapa[c.emotion_primary] = { count: 0, totalIntensity: 0 }
    mapa[c.emotion_primary].count++
    mapa[c.emotion_primary].totalIntensity += c.intensity_normalized
  }
  return Object.entries(mapa)
    .map(([emotion, d]) => ({
      emotion,
      count: d.count,
      avg_intensity: Math.round(d.totalIntensity / d.count),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4)
}

// ─── Alertas ─────────────────────────────────────────────────────────────────

export async function obtenerAlertasActivas(
  childProfileId: string
): Promise<AlertRecord[]> {
  const { data, error } = await supabase
    .from('alert_records')
    .select('*')
    .eq('child_profile_id', childProfileId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function obtenerAlertasActivasParaPadre(
  parentUserId: string
): Promise<AlertRecord[]> {
  const { data, error } = await supabase
    .from('alert_records')
    .select('*')
    .eq('parent_user_id', parentUserId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function reconocerAlerta(alertaId: string): Promise<void> {
  const { error } = await supabase
    .from('alert_records')
    .update({ status: 'acknowledged', acknowledged_at: new Date().toISOString() })
    .eq('id', alertaId)
  if (error) throw error
}

// ─── Panel de resumen para HomePadre ─────────────────────────────────────────

export type ResumenNino = {
  childProfileId: string
  elsHoy: number
  elsBanda: ReturnType<typeof interpretarELS>
  topEmociones7d: TopEmotionItem[]
  totalCheckins7d: number
  alertasActivas: AlertRecord[]
  siLocal: number
  cisLocal: number
}

export async function obtenerResumenNino(
  childProfileId: string
): Promise<ResumenNino> {
  const hace7dias = new Date()
  hace7dias.setDate(hace7dias.getDate() - 6)
  hace7dias.setHours(0, 0, 0, 0)

  const [checkinsResult, alertasResult] = await Promise.all([
    supabase
      .from('mood_checkins')
      .select('*')
      .eq('child_profile_id', childProfileId)
      .gte('created_at', hace7dias.toISOString())
      .order('created_at', { ascending: true }),
    obtenerAlertasActivas(childProfileId),
  ])

  if (checkinsResult.error) throw checkinsResult.error

  const checkins: MoodCheckin[] = checkinsResult.data ?? []
  const hoy = new Date().toISOString().split('T')[0]
  const checkinsHoy = checkins.filter(c => c.day_bucket === hoy)

  const elsHoy = calcularELSLocal(checkinsHoy.length > 0 ? checkinsHoy : checkins)
  const elsBanda = interpretarELS(elsHoy)

  return {
    childProfileId,
    elsHoy,
    elsBanda,
    topEmociones7d: obtenerTopEmocionesDeSemana(checkins),
    totalCheckins7d: checkins.length,
    alertasActivas: alertasResult,
    siLocal: calcularSILocal(checkins),
    cisLocal: calcularCISLocal(checkins),
  }
}
