import React, { useState, useEffect } from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  ScrollView,
} from 'react-native'
import { COLORES, ESPACIO, RADIO } from '../../constants/tema'
import { useAuth } from '../../store/AuthContext'
import { MoodCheckin, SafeAdult } from '../../types/database'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { StackNinoParamList } from '../../navigation/NavegadorNino'
import {
  obtenerCheckinDeHoy, obtenerCheckinsSemanaActual,
  obtenerAdultosSegurosPorNino, COLORES_EMOCION, ETIQUETAS_EMOCION,
} from '../../lib/checkins'
import { calcularELSLocal, interpretarELS, obtenerTopEmocionesDeSemana } from '../../lib/metricas'

type Props = NativeStackScreenProps<StackNinoParamList, 'HomeNino'>

function obtenerSaludo(): string {
  const hora = new Date().getHours()
  if (hora < 12) return 'Buenos dias'
  if (hora < 19) return 'Buenas tardes'
  return 'Buenas noches'
}

// ── BLOQUE 1: Gauge semicircular ELS ────────────────────────────────────────
function GaugeEls({ els, bandaColorHex }: { els: number; bandaColorHex?: string }) {
  const color = bandaColorHex ?? COLORES.arenaCalida
  const pct = Math.max(0, Math.min(100, els))
  return (
    <View style={gaugeE.wrap}>
      <View style={gaugeE.track}>
        <View style={[gaugeE.fill, { width: `${pct}%` as any, backgroundColor: color }]} />
        <View style={gaugeE.inner} />
      </View>
      <Text style={[gaugeE.valor, { color: els > 0 ? color : COLORES.textoSuave }]}>
        {els > 0 ? `${Math.round(els)}` : 'Tu espacio seguro'}
      </Text>
    </View>
  )
}

const gaugeE = StyleSheet.create({
  wrap:  { alignItems: 'center', paddingTop: ESPACIO.md, marginBottom: ESPACIO.lg },
  track: {
    width: 140, height: 70,
    borderTopLeftRadius: 70, borderTopRightRadius: 70,
    backgroundColor: COLORES.borde,
    overflow: 'hidden',
    justifyContent: 'flex-end', alignItems: 'center',
  },
  fill: { position: 'absolute', bottom: 0, left: 0, height: '100%', opacity: 0.7 },
  inner: {
    width: 100, height: 50,
    borderTopLeftRadius: 50, borderTopRightRadius: 50,
    backgroundColor: COLORES.superficie,
    marginBottom: -1,
  },
  valor: { marginTop: ESPACIO.sm, fontSize: 13, fontWeight: '600' },
})

// ── Acciones (BLOQUE 2 — pill scroll) ───────────────────────────────────────
const ACCIONES = [
  { id: 'calmar',   titulo: 'Calmarme',         color: COLORES.azulsuave,    pantalla: 'Calmarme',        activo: true },
  { id: 'desahogo', titulo: 'Desahogarme',       color: COLORES.arenaCalida,  pantalla: 'Desahogarme',     activo: true },
  { id: 'decir',    titulo: 'Ayudame a decirlo', color: COLORES.verdeApagado, pantalla: 'AyudameADecirlo', activo: true },
  { id: 'pensar',   titulo: 'Pensar',            color: COLORES.borde,        pantalla: null,              activo: false },
  { id: 'dormir',   titulo: 'Dormir',            color: COLORES.borde,        pantalla: null,              activo: false },
]

// Helper acción sugerida según banda ELS
function obtenerAccionSugerida(banda: string): { texto: string; pantalla: string | null } {
  switch (banda) {
    case 'bajo':     return { texto: 'Estas tranquilo hoy. Disfruta tu dia',                    pantalla: null }
    case 'leve':     return { texto: 'Prueba 1 minuto de calma cuando quieras',                 pantalla: 'Calmarme' }
    case 'moderado': return { texto: 'Prueba 2 minutos de respiracion',                         pantalla: 'Calmarme' }
    case 'alto':     return { texto: 'Escribir lo que sientes puede ayudarte',                  pantalla: 'Desahogarme' }
    case 'muy_alto': return { texto: 'Puede ser bueno hablar con alguien de confianza',         pantalla: 'AyudameADecirlo' }
    default:         return { texto: 'Cuando quieras, registra como te sientes',                pantalla: null }
  }
}

export default function PantallaHomeNino({ navigation, route }: Props) {
  const { perfil } = route.params
  const { salirDeNino } = useAuth()
  const [mostrarConfirmacionSalida, setMostrarConfirmacionSalida] = useState(false)
  const [checkinHoy, setCheckinHoy] = useState<MoodCheckin | null>(null)
  const [checkinsSemana, setCheckinsSemana] = useState<MoodCheckin[]>([])
  const [els, setEls] = useState(0)
  const [bandaEls, setBandaEls] = useState<{ banda: string; colorHex: string; descripcion: string } | null>(null)
  const [adultosSeguro, setAdultosSeguro] = useState<SafeAdult[]>([])

  useEffect(() => {
    obtenerCheckinDeHoy(perfil.id).then(c => setCheckinHoy(c)).catch(() => {})
    obtenerCheckinsSemanaActual(perfil.id).then(cs => {
      setCheckinsSemana(cs)
      const v = calcularELSLocal(cs)
      setEls(v)
      setBandaEls(interpretarELS(v))
    }).catch(() => {})
    obtenerAdultosSegurosPorNino(perfil.id).then(setAdultosSeguro).catch(() => {})
  }, [perfil.id])

  const topEmociones = obtenerTopEmocionesDeSemana(checkinsSemana).slice(0, 4)
  const accionSugerida = bandaEls && els > 0 ? obtenerAccionSugerida(bandaEls.banda) : null

  // BLOQUE 3: personas — adultos seguros o fallback estático
  const PERSONAS_FALLBACK = [
    { id: 'mama',  nombre: 'Mama',  relacion: 'Adulto seguro' },
    { id: 'papa',  nombre: 'Papa',  relacion: 'Adulto seguro' },
    { id: 'amigo', nombre: 'Amigo', relacion: 'Persona cercana' },
  ]
  const personas = adultosSeguro.length > 0 ? adultosSeguro : PERSONAS_FALLBACK

  return (
    <SafeAreaView style={e.raiz}>
      <ScrollView contentContainerStyle={e.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Encabezado ── */}
        <View style={e.header}>
          <View>
            <Text style={e.saludo}>{obtenerSaludo()},</Text>
            <Text style={e.nombre}>{perfil.nombre_display}</Text>
          </View>
          <TouchableOpacity style={e.btnSalir} onPress={() => setMostrarConfirmacionSalida(true)} activeOpacity={0.75}>
            <Text style={e.btnSalirTxt}>Salir</Text>
          </TouchableOpacity>
        </View>

        {/* ── BLOQUE 1: Card ELS ── */}
        <View style={e.cardEls}>
          <GaugeEls els={els} bandaColorHex={bandaEls?.colorHex} />
          {bandaEls && els > 0 && (
            <Text style={[e.bandaTexto, { color: bandaEls.colorHex }]}>
              {bandaEls.descripcion}
            </Text>
          )}
          <Text style={e.cardElsPregunta}>
            {checkinHoy ? 'Registraste como te sientes hoy' : 'Como te sientes ahora?'}
          </Text>
          <TouchableOpacity
            style={e.btnPrimario}
            onPress={() => navigation.navigate('Checkin', { perfil })}
            activeOpacity={0.82}
          >
            <Text style={e.btnPrimarioTxt}>
              {checkinHoy ? 'Registrar de nuevo' : 'Registrar como me siento'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── BLOQUE 2: Quick Actions — pill horizontal scroll ── */}
        <Text style={e.seccion}>Que quieres hacer?</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={e.pillScroll}
          style={e.pillScrollWrap}
        >
          {ACCIONES.map(a => (
            <TouchableOpacity
              key={a.id}
              style={[e.pill, { backgroundColor: a.color }, !a.activo && e.pillInactivo]}
              onPress={() => {
                if (!a.activo) return
                navigation.navigate(a.pantalla as any, { perfil })
              }}
              activeOpacity={a.activo ? 0.8 : 1}
            >
              <Text style={[e.pillTxt, !a.activo && e.pillTxtInactivo]}>{a.titulo}</Text>
              {!a.activo && <Text style={e.pillProximo}>Proximamente</Text>}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── BLOQUE 3: Personas importantes ── */}
        <Text style={e.seccion}>Personas importantes</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={e.personasScroll}
          style={e.pillScrollWrap}
        >
          {personas.map((p: any, i: number) => (
            <TouchableOpacity
              key={p.id ?? i}
              style={e.tarjetaPersona}
              onPress={() => navigation.navigate('AyudameADecirlo', { perfil })}
              activeOpacity={0.82}
            >
              <View style={[
                e.personaAvatar,
                { backgroundColor: i % 2 === 0 ? COLORES.azulsuave : COLORES.arenaCalida },
              ]}>
                <Text style={e.personaInicial}>{p.nombre.charAt(0).toUpperCase()}</Text>
              </View>
              <Text style={e.personaNombre}>{p.nombre.split(' ')[0]}</Text>
              <Text style={e.personaCta}>Hablar con{'\n'}{p.nombre.split(' ')[0]}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── BLOQUE 4: Métricas semanales ── */}
        {topEmociones.length > 0 && (
          <>
            <Text style={e.seccion}>Esta semana</Text>
            <View style={e.cardMetricas}>
              {topEmociones.map(em => {
                const maxCount = topEmociones[0]?.count ?? 1
                const pct = Math.round((em.count / maxCount) * 100)
                const colorEm = (COLORES_EMOCION as any)[em.emotion] ?? COLORES.borde
                return (
                  <View key={em.emotion} style={e.barraFila}>
                    <Text style={e.barraLabel}>
                      {(ETIQUETAS_EMOCION as any)[em.emotion] ?? em.emotion}
                    </Text>
                    <View style={e.barraTrack}>
                      <View style={[e.barraFill, { width: `${pct}%` as any, backgroundColor: colorEm }]} />
                    </View>
                    <Text style={e.barraNum}>{em.count}</Text>
                  </View>
                )
              })}
            </View>
          </>
        )}

        {/* ── BLOQUE 5: Acción sugerida ── */}
        {accionSugerida && (
          <>
            <Text style={e.seccion}>Te sugiero</Text>
            <View style={e.cardSugerencia}>
              <View style={e.sugerenciaLinea} />
              <Text style={e.sugerenciaTxt}>{accionSugerida.texto}</Text>
              {accionSugerida.pantalla && (
                <TouchableOpacity
                  style={e.btnSugerencia}
                  onPress={() => navigation.navigate(accionSugerida.pantalla as any, { perfil })}
                  activeOpacity={0.8}
                >
                  <Text style={e.btnSugerenciaTxt}>Probar ahora</Text>
                </TouchableOpacity>
              )}
            </View>
          </>
        )}

        {/* ── Compañero ── */}
        <View style={e.cardCompanero}>
          <View style={[e.avatar, perfil.companion_type === 'cat' ? e.avatarGato : e.avatarPerro]}>
            <View style={e.avatarOreja1} />
            <View style={e.avatarOreja2} />
            <View style={e.avatarCara} />
          </View>
          <View style={e.companeroInfo}>
            <Text style={e.companeroNombre}>
              Tu {perfil.companion_type === 'dog' ? 'perro' : 'gato'} esta contigo
            </Text>
            <Text style={e.companeroMensaje}>Este es tu refugio. Aqui puedes ser como eres.</Text>
          </View>
        </View>

      </ScrollView>

      {/* ── Modal salida ── */}
      {mostrarConfirmacionSalida && (
        <View style={e.overlay}>
          <View style={e.modal}>
            <Text style={e.modalTitulo}>Salir del refugio?</Text>
            <Text style={e.modalDesc}>Regresaras a la pantalla de inicio.</Text>
            <TouchableOpacity style={e.btnPrimario} onPress={salirDeNino} activeOpacity={0.82}>
              <Text style={e.btnPrimarioTxt}>Si, salir</Text>
            </TouchableOpacity>
            <TouchableOpacity style={e.btnGhost} onPress={() => setMostrarConfirmacionSalida(false)}>
              <Text style={e.btnGhostTxt}>Quedarme</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  )
}

// ── Styles ──────────────────────────────────────────────────────────────────
const e = StyleSheet.create({
  raiz:  { flex: 1, backgroundColor: COLORES.fondo },
  scroll: { padding: ESPACIO.lg, paddingTop: ESPACIO.xl, paddingBottom: 60 },

  // Header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: ESPACIO.xl },
  saludo: { fontSize: 14, color: COLORES.textoSuave, letterSpacing: 0.2 },
  nombre: { fontSize: 30, color: COLORES.textoPrimario, fontFamily: 'CocomatPro', marginTop: 2 },
  btnSalir: {
    paddingHorizontal: ESPACIO.md, paddingVertical: 7,
    borderRadius: RADIO.capsula,
    backgroundColor: COLORES.superficie,
    shadowColor: COLORES.madretierra,
    shadowOffset: { width: 2, height: 3 }, shadowOpacity: 0.12, shadowRadius: 6,
    elevation: 2,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.85)',
  },
  btnSalirTxt: { fontSize: 13, color: COLORES.textoSecundario },

  // BLOQUE 1: Card ELS
  cardEls: {
    borderRadius: RADIO.xl,
    backgroundColor: COLORES.superficie,
    padding: ESPACIO.xl,
    alignItems: 'center',
    marginBottom: ESPACIO.xl,
    shadowColor: COLORES.madretierra,
    shadowOffset: { width: 6, height: 8 }, shadowOpacity: 0.16, shadowRadius: 18,
    elevation: 6,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.85)',
  },
  bandaTexto: { fontSize: 12, fontWeight: '600', marginBottom: ESPACIO.xs, letterSpacing: 0.3 },
  cardElsPregunta: {
    fontSize: 16, color: COLORES.textoPrimario, textAlign: 'center',
    marginBottom: ESPACIO.lg, lineHeight: 24,
  },

  // Botón primario
  btnPrimario: {
    backgroundColor: COLORES.madretierra,
    borderRadius: RADIO.capsula,
    paddingVertical: 13, paddingHorizontal: ESPACIO.xl,
    alignItems: 'center',
    shadowColor: COLORES.madretierra,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10,
    elevation: 4,
    width: '100%',
  },
  btnPrimarioTxt: { color: COLORES.suertedados, fontSize: 15, fontFamily: 'CocomatPro' },

  // Título de sección
  seccion: {
    fontSize: 12, fontFamily: 'CocomatPro', color: COLORES.textoSuave,
    marginBottom: ESPACIO.sm, letterSpacing: 0.8, textTransform: 'uppercase',
  },

  // BLOQUE 2: Pill scroll
  pillScrollWrap: { marginBottom: ESPACIO.xl },
  pillScroll: { paddingRight: ESPACIO.lg, gap: ESPACIO.sm },
  pill: {
    borderRadius: RADIO.capsula,
    paddingHorizontal: ESPACIO.lg,
    paddingVertical: ESPACIO.sm + 4,
    minWidth: 128,
    alignItems: 'center',
    shadowColor: COLORES.madretierra,
    shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 8,
    elevation: 2,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.7)',
  },
  pillInactivo: { opacity: 0.5 },
  pillTxt: { fontSize: 14, fontFamily: 'CocomatPro', color: COLORES.textoPrimario },
  pillTxtInactivo: { color: COLORES.textoSuave },
  pillProximo: { fontSize: 10, color: COLORES.textoSuave, marginTop: 2, letterSpacing: 0.2 },

  // BLOQUE 3: Personas
  personasScroll: { paddingRight: ESPACIO.lg, gap: ESPACIO.md },
  tarjetaPersona: {
    backgroundColor: COLORES.superficie,
    borderRadius: RADIO.xl,
    padding: ESPACIO.md,
    alignItems: 'center',
    width: 106,
    shadowColor: COLORES.madretierra,
    shadowOffset: { width: 4, height: 6 }, shadowOpacity: 0.14, shadowRadius: 12,
    elevation: 3,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.85)',
  },
  personaAvatar: {
    width: 52, height: 52, borderRadius: 26,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: ESPACIO.sm,
  },
  personaInicial: { fontSize: 22, fontFamily: 'CocomatPro', color: COLORES.madretierra },
  personaNombre: { fontSize: 13, fontFamily: 'CocomatPro', color: COLORES.textoPrimario, marginBottom: 4 },
  personaCta: { fontSize: 11, color: COLORES.textoSuave, textAlign: 'center', lineHeight: 15 },

  // BLOQUE 4: Métricas semanales
  cardMetricas: {
    backgroundColor: COLORES.superficie,
    borderRadius: RADIO.xl,
    padding: ESPACIO.lg,
    marginBottom: ESPACIO.xl,
    shadowColor: COLORES.madretierra,
    shadowOffset: { width: 4, height: 6 }, shadowOpacity: 0.14, shadowRadius: 12,
    elevation: 3,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.85)',
    gap: ESPACIO.sm,
  },
  barraFila: { flexDirection: 'row', alignItems: 'center', gap: ESPACIO.sm },
  barraLabel: { fontSize: 12, color: COLORES.textoSecundario, width: 82 },
  barraTrack: { flex: 1, height: 8, borderRadius: RADIO.capsula, backgroundColor: COLORES.borde, overflow: 'hidden' },
  barraFill: { height: '100%', borderRadius: RADIO.capsula },
  barraNum: { fontSize: 12, color: COLORES.textoSuave, width: 20, textAlign: 'right' },

  // BLOQUE 5: Acción sugerida
  cardSugerencia: {
    backgroundColor: COLORES.superficie,
    borderRadius: RADIO.xl,
    padding: ESPACIO.lg,
    marginBottom: ESPACIO.xl,
    shadowColor: COLORES.madretierra,
    shadowOffset: { width: 4, height: 6 }, shadowOpacity: 0.14, shadowRadius: 12,
    elevation: 3,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.85)',
  },
  sugerenciaLinea: { width: 32, height: 3, borderRadius: 2, backgroundColor: COLORES.arenaCalida, marginBottom: ESPACIO.sm },
  sugerenciaTxt: { fontSize: 15, color: COLORES.textoPrimario, lineHeight: 22, marginBottom: ESPACIO.md },
  btnSugerencia: {
    alignSelf: 'flex-start',
    borderRadius: RADIO.capsula,
    paddingHorizontal: ESPACIO.md,
    paddingVertical: 8,
    backgroundColor: COLORES.madretierra,
  },
  btnSugerenciaTxt: { fontSize: 13, color: COLORES.suertedados, fontFamily: 'CocomatPro' },

  // Compañero
  cardCompanero: {
    borderRadius: RADIO.xl,
    backgroundColor: COLORES.superficie,
    padding: ESPACIO.md,
    flexDirection: 'row', alignItems: 'center', gap: ESPACIO.md,
    shadowColor: COLORES.madretierra,
    shadowOffset: { width: 4, height: 6 }, shadowOpacity: 0.14, shadowRadius: 12,
    elevation: 3,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.85)',
  },
  avatar: {
    width: 56, height: 56, borderRadius: 28,
    justifyContent: 'center', alignItems: 'center',
    position: 'relative',
  },
  avatarPerro: { backgroundColor: COLORES.arenaCalida },
  avatarGato:  { backgroundColor: COLORES.azulsuave },
  avatarOreja1: { position: 'absolute', top: 4, left: 8,  width: 12, height: 14, borderRadius: 6, backgroundColor: 'rgba(81,50,41,0.2)' },
  avatarOreja2: { position: 'absolute', top: 4, right: 8, width: 12, height: 14, borderRadius: 6, backgroundColor: 'rgba(81,50,41,0.2)' },
  avatarCara:   { width: 28, height: 20, borderRadius: 14, backgroundColor: 'rgba(81,50,41,0.12)' },
  companeroInfo:    { flex: 1 },
  companeroNombre:  { fontSize: 14, fontFamily: 'CocomatPro', color: COLORES.textoPrimario, marginBottom: 3 },
  companeroMensaje: { fontSize: 12, color: COLORES.textoSuave, lineHeight: 18 },

  // Modal
  overlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(81,50,41,0.3)',
    justifyContent: 'flex-end', padding: ESPACIO.lg,
  },
  modal: {
    backgroundColor: COLORES.fondo, borderRadius: RADIO.xl,
    padding: ESPACIO.xl, gap: ESPACIO.md,
  },
  modalTitulo: { fontSize: 22, fontFamily: 'CocomatPro', color: COLORES.textoPrimario },
  modalDesc:   { fontSize: 14, color: COLORES.textoSuave, marginBottom: ESPACIO.sm },
  btnGhost: { paddingVertical: ESPACIO.sm, alignItems: 'center' },
  btnGhostTxt: { fontSize: 14, color: COLORES.textoSecundario },
})
