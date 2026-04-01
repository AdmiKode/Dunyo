import { supabase } from '../lib/supabase'
import * as Crypto from 'expo-crypto'

// ─── Auth del padre ──────────────────────────────────────────

export async function registrarPadre(email: string, contrasena: string) {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password: contrasena,
  })
  if (error) throw error
  return data
}

export async function loginPadre(email: string, contrasena: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password: contrasena,
  })
  if (error) throw error
  return data
}

export async function cerrarSesionPadre() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function solicitarResetContrasena(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(
    email.trim().toLowerCase(),
    { redirectTo: 'dunyo://auth/reset' }
  )
  if (error) throw error
}

// ─── Patrón del niño ────────────────────────────────────────

// Convierte la secuencia de índices de puntos en un hash seguro
// La secuencia NUNCA se guarda en texto plano
export async function hashearPatron(secuencia: number[]): Promise<string> {
  const texto = secuencia.join('-')
  const hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    texto
  )
  return hash
}

export async function guardarPatronNino(
  childProfileId: string,
  secuencia: number[]
): Promise<void> {
  const hash = await hashearPatron(secuencia)
  const { error } = await supabase
    .from('child_profiles')
    .update({
      pattern_hash: hash,
      pattern_set_at: new Date().toISOString(),
      pattern_updated_at: new Date().toISOString(),
      failed_pattern_attempts: 0,
      pattern_locked_until: null,
    })
    .eq('id', childProfileId)
  if (error) throw error
}

export async function verificarPatronNino(
  childProfileId: string,
  secuencia: number[]
): Promise<'ok' | 'error' | 'bloqueado'> {
  // Verificar si está bloqueado
  const { data: perfil, error } = await supabase
    .from('child_profiles')
    .select('pattern_hash, failed_pattern_attempts, pattern_locked_until')
    .eq('id', childProfileId)
    .single()

  if (error || !perfil) return 'error'

  // Bloqueo temporal activo
  if (perfil.pattern_locked_until) {
    const bloqueoHasta = new Date(perfil.pattern_locked_until)
    if (bloqueoHasta > new Date()) return 'bloqueado'
  }

  const hashIngresado = await hashearPatron(secuencia)

  if (hashIngresado === perfil.pattern_hash) {
    // Intento correcto: limpiar conteos de fallo
    await supabase
      .from('child_profiles')
      .update({ failed_pattern_attempts: 0, pattern_locked_until: null })
      .eq('id', childProfileId)
    return 'ok'
  }

  // Intento fallido
  const nuevosFallos = (perfil.failed_pattern_attempts ?? 0) + 1
  const actualizacion: Record<string, unknown> = {
    failed_pattern_attempts: nuevosFallos,
  }

  // Después de 5 fallos: bloqueo de 5 minutos
  if (nuevosFallos >= 5) {
    const bloqueo = new Date(Date.now() + 5 * 60 * 1000)
    actualizacion.pattern_locked_until = bloqueo.toISOString()
  }

  await supabase
    .from('child_profiles')
    .update(actualizacion)
    .eq('id', childProfileId)

  return 'error'
}

export async function resetearPatronPorPadre(
  childProfileId: string,
  nuevaSecuencia: number[]
): Promise<void> {
  // Solo se puede llamar si hay sesión activa del padre (RLS lo garantiza)
  const hash = await hashearPatron(nuevaSecuencia)
  const { error } = await supabase
    .from('child_profiles')
    .update({
      pattern_hash: hash,
      pattern_updated_at: new Date().toISOString(),
      failed_pattern_attempts: 0,
      pattern_locked_until: null,
    })
    .eq('id', childProfileId)
  if (error) throw error
}

// ─── Registro de eventos de auth ────────────────────────────

export async function registrarEventoAuth(
  nombreEvento: string,
  actorTipo: 'child' | 'parent' | 'system',
  childProfileId?: string,
  metadata?: Record<string, unknown>
) {
  const { data: { user } } = await supabase.auth.getUser()
  await supabase.from('auth_events').insert({
    event_name: nombreEvento,
    actor_type: actorTipo,
    child_profile_id: childProfileId ?? null,
    parent_user_id: user?.id ?? null,
    metadata: metadata ?? null,
  })
}
