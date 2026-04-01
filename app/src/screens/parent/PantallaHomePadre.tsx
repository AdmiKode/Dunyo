import React, { useState, useEffect } from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Alert,
} from 'react-native'
import { COLORES, ESPACIO, RADIO } from '../../constants/tema'
import { useAuth } from '../../store/AuthContext'
import { obtenerResumenNino, ResumenNino } from '../../lib/metricas'
import { ETIQUETAS_EMOCION } from '../../lib/checkins'
import { EmotionPrimary, ChildProfile } from '../../types/database'

// Días desde una fecha ISO
function diasDesde(fecha: string): number {
  return Math.floor((Date.now() - new Date(fecha).getTime()) / 86400000)
}

// Recomendación semanal basada en el hijo con mayor carga
function calcularRecomendacion(
  perfiles: ChildProfile[],
  resumenes: Record<string, ResumenNino>
): string {
  let maxEls = -1
  let nombreMax = ''
  let bandaMax = ''
  perfiles.forEach(p => {
    const r = resumenes[p.id]
    if (r && r.elsHoy > maxEls) {
      maxEls = r.elsHoy
      nombreMax = p.nombre_display
      bandaMax = r.elsBanda.banda
    }
  })
  if (!nombreMax) return 'Esta semana va bien. Sigue siendo ese adulto seguro en su vida.'
  switch (bandaMax) {
    case 'muy_alto': return `${nombreMax} ha tenido una carga emocional alta. Un momento de atencion hoy puede marcar diferencia.`
    case 'alto':     return `${nombreMax} ha tenido dias intensos. Un abrazo o una pregunta simple puede hacer mucho.`
    case 'moderado': return `${nombreMax} esta procesando algo. Mantente disponible si quiere hablar.`
    default:         return `${nombreMax} va bien esta semana. Sigue siendo ese adulto seguro en su vida.`
  }
}

// ── Mini barra de ELS tipo chart ─────────────────────────────────────────────
function BarraEls({ valor, color }: { valor: number; color: string }) {
  const pct = Math.max(4, Math.min(100, valor))
  return (
    <View style={bar.wrap}>
      <View style={bar.track}>
        <View style={[bar.fill, { width: `${pct}%` as any, backgroundColor: color }]} />
      </View>
      <Text style={[bar.val, { color }]}>{Math.round(valor)}</Text>
    </View>
  )
}
const bar = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', gap: ESPACIO.sm, marginTop: 6 },
  track: {
    flex: 1, height: 10, borderRadius: RADIO.capsula,
    backgroundColor: COLORES.borde, overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: RADIO.capsula },
  val: { fontSize: 13, fontWeight: '700', minWidth: 28, textAlign: 'right' },
})

// ── Semáforo de estado ────────────────────────────────────────────────────────
function Semaforo({ banda, colorHex }: { banda: string; colorHex: string }) {
  const etiquetas: Record<string, string> = {
    bajo: 'Tranquilo',
    leve: 'Leve',
    moderado: 'Moderado',
    alto: 'Intenso',
    muy_alto: 'Atencion',
  }
  return (
    <View style={sem.wrap}>
      <View style={[sem.punto, { backgroundColor: colorHex }]} />
      <Text style={[sem.texto, { color: colorHex }]}>{etiquetas[banda] ?? banda}</Text>
    </View>
  )
}
const sem = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  punto: { width: 10, height: 10, borderRadius: 5 },
  texto: { fontSize: 12, fontWeight: '600', letterSpacing: 0.2 },
})

// ── Avatar del niño ───────────────────────────────────────────────────────────
function AvatarNino({ nombre, tipo }: { nombre: string; tipo?: string }) {
  const fondo = tipo === 'cat' ? COLORES.azulsuave : COLORES.arenaCalida
  return (
    <View style={[av.wrap, { backgroundColor: fondo }]}>
      {tipo === 'cat' ? (
        <><View style={av.orejaL} /><View style={av.orejaR} /></>
      ) : (
        <><View style={av.dogL} /><View style={av.dogR} /></>
      )}
      <View style={av.cara}>
        <Text style={av.inicial}>{nombre.charAt(0).toUpperCase()}</Text>
      </View>
    </View>
  )
}
const av = StyleSheet.create({
  wrap: {
    width: 64, height: 64, borderRadius: 32,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: COLORES.madretierra,
    shadowOffset: { width: 4, height: 4 }, shadowOpacity: 0.18, shadowRadius: 8,
    elevation: 3,
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.7)',
  },
  orejaL: { position: 'absolute', top: 3, left: 8, width: 14, height: 14, borderRadius: 3, backgroundColor: 'rgba(81,50,41,0.22)', transform: [{ rotate: '25deg' }] },
  orejaR: { position: 'absolute', top: 3, right: 8, width: 14, height: 14, borderRadius: 3, backgroundColor: 'rgba(81,50,41,0.22)', transform: [{ rotate: '-25deg' }] },
  dogL: { position: 'absolute', top: 6, left: 5, width: 16, height: 22, borderRadius: 8, backgroundColor: 'rgba(81,50,41,0.2)' },
  dogR: { position: 'absolute', top: 6, right: 5, width: 16, height: 22, borderRadius: 8, backgroundColor: 'rgba(81,50,41,0.2)' },
  cara: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(81,50,41,0.1)', alignItems: 'center', justifyContent: 'center' },
  inicial: { fontSize: 18, fontFamily: 'CocomatPro', color: COLORES.madretierra },
})

// ── Card hijo ─────────────────────────────────────────────────────────────────
function CardHijo({
  perfil, resumen, onEntrar,
}: {
  perfil: ChildProfile
  resumen?: ResumenNino
  onEntrar: () => void
}) {
  const diasCambioPatron = perfil.pattern_updated_at ? diasDesde(perfil.pattern_updated_at) : null
  const patronActualizado = diasCambioPatron !== null && diasCambioPatron <= 7

  return (
    <View style={card.wrap}>
      {/* Franja de color del compañero */}
      <View style={[card.franja, { backgroundColor: perfil.companion_type === 'cat' ? COLORES.azulsuave : COLORES.arenaCalida }]} />

      {/* Cabecera */}
      <View style={card.cabecera}>
        <AvatarNino nombre={perfil.nombre_display} tipo={perfil.companion_type} />
        <View style={card.info}>
          <Text style={card.nombre}>{perfil.nombre_display}</Text>
          {perfil.edad ? <Text style={card.edad}>{perfil.edad} anos</Text> : null}
          {/* Semáforo de estado */}
          {resumen ? (
            <Semaforo banda={resumen.elsBanda.banda} colorHex={resumen.elsBanda.colorHex} />
          ) : null}
        </View>
        <TouchableOpacity style={card.btnRefugio} onPress={onEntrar} activeOpacity={0.82}>
          <Text style={card.btnRefugioTxt}>
            {perfil.pattern_hash ? 'Refugio' : 'Primera vez'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Cambio de patrón reciente */}
      {patronActualizado && (
        <View style={card.patronBadge}>
          <Text style={card.patronBadgeTxt}>
            Patron actualizado hace {diasCambioPatron === 0 ? 'hoy' : `${diasCambioPatron} dia${diasCambioPatron > 1 ? 's' : ''}`}
          </Text>
        </View>
      )}

      {/* Métricas */}
      {resumen ? (
        <View style={card.metricas}>
          {/* ELS barra */}
          <View style={card.metricaFila}>
            <Text style={card.metricaLabel}>Nivel emocional</Text>
            <BarraEls valor={resumen.elsHoy} color={resumen.elsBanda.colorHex} />
          </View>

          <View style={card.divider} />

          {/* Stats */}
          <View style={card.estadRow}>
            <View style={card.stat}>
              <Text style={card.statNum}>{resumen.totalCheckins7d}</Text>
              <Text style={card.statLbl}>registros{'\n'}semana</Text>
            </View>
            {resumen.topEmociones7d.length > 0 && (
              <View style={card.stat}>
                <Text style={card.statNum}>
                  {ETIQUETAS_EMOCION[resumen.topEmociones7d[0].emotion as EmotionPrimary]}
                </Text>
                <Text style={card.statLbl}>mas{'\n'}frecuente</Text>
              </View>
            )}
            {resumen.alertasActivas.length > 0 && (
              <View style={[card.stat, card.statAlerta]}>
                <Text style={[card.statNum, { color: COLORES.error }]}>
                  {resumen.alertasActivas.length}
                </Text>
                <Text style={[card.statLbl, { color: COLORES.error }]}>
                  alerta{resumen.alertasActivas.length > 1 ? 's' : ''}
                </Text>
              </View>
            )}
          </View>
        </View>
      ) : (
        <View style={card.metricas}>
          <Text style={card.sinDatos}>Sin registros esta semana</Text>
        </View>
      )}
    </View>
  )
}

const card = StyleSheet.create({
  wrap: {
    backgroundColor: COLORES.superficie,
    borderRadius: RADIO.xl,
    marginBottom: ESPACIO.xl,
    overflow: 'hidden',
    shadowColor: COLORES.madretierra,
    shadowOffset: { width: 6, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 18,
    elevation: 6,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.85)',
  },
  franja: { height: 6, width: '100%' },
  cabecera: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESPACIO.md,
    padding: ESPACIO.lg,
    paddingBottom: ESPACIO.md,
  },
  info: { flex: 1, gap: 3 },
  nombre: { fontSize: 22, fontFamily: 'CocomatPro', color: COLORES.textoPrimario },
  edad: { fontSize: 13, color: COLORES.textoSuave },
  btnRefugio: {
    backgroundColor: COLORES.madretierra,
    borderRadius: RADIO.capsula,
    paddingHorizontal: ESPACIO.md,
    paddingVertical: 9,
    shadowColor: COLORES.madretierra,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  btnRefugioTxt: { fontSize: 13, color: COLORES.suertedados, fontFamily: 'CocomatPro' },
  // Cambio de patrón
  patronBadge: {
    marginHorizontal: ESPACIO.lg,
    marginBottom: ESPACIO.sm,
    backgroundColor: COLORES.arenaCalida,
    borderRadius: RADIO.capsula,
    paddingHorizontal: ESPACIO.md,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  patronBadgeTxt: { fontSize: 11, color: COLORES.textoPrimario, letterSpacing: 0.2 },
  // Métricas
  metricas: { paddingHorizontal: ESPACIO.lg, paddingBottom: ESPACIO.lg },
  metricaFila: { marginBottom: ESPACIO.sm },
  metricaLabel: { fontSize: 12, color: COLORES.textoSuave, letterSpacing: 0.2 },
  divider: { height: 1, backgroundColor: COLORES.borde, marginVertical: ESPACIO.md },
  estadRow: { flexDirection: 'row', gap: ESPACIO.xl },
  stat: { alignItems: 'flex-start' },
  statAlerta: {},
  statNum: { fontSize: 20, fontFamily: 'CocomatPro', color: COLORES.textoPrimario, lineHeight: 24 },
  statLbl: { fontSize: 11, color: COLORES.textoSuave, lineHeight: 15 },
  sinDatos: { fontSize: 13, color: COLORES.textoSuave, textAlign: 'center', paddingVertical: ESPACIO.sm },
})

// ── Pantalla principal ────────────────────────────────────────────────────────
export default function PantallaHomePadre({ navigation }: any) {
  const { perfilesHijos, padre, cerrarSesionPadre, activarNino } = useAuth()
  const [resumenes, setResumenes] = useState<Record<string, ResumenNino>>({})

  useEffect(() => {
    if (perfilesHijos.length === 0) return
    perfilesHijos.forEach(p => {
      obtenerResumenNino(p.id)
        .then(r => setResumenes(prev => ({ ...prev, [p.id]: r })))
        .catch(() => {})
    })
  }, [perfilesHijos.map(p => p.id).join(',')])

  const sinHijos = perfilesHijos.length === 0
  const nombrePadre = padre?.email?.split('@')[0] ?? 'hola'
  const recomendacion = calcularRecomendacion(perfilesHijos, resumenes)

  async function manejarCerrarSesion() {
    Alert.alert('Cerrar sesion', 'Seguro que quieres salir?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Salir', style: 'destructive', onPress: cerrarSesionPadre },
    ])
  }

  return (
    <SafeAreaView style={e.raiz}>
      <ScrollView
        contentContainerStyle={e.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Encabezado ── */}
        <View style={e.header}>
          <View style={e.headerTexto}>
            <Text style={e.bienvenida}>Tu panel</Text>
            <Text style={e.nombrePadre}>{nombrePadre}</Text>
          </View>
          <TouchableOpacity style={e.btnSalir} onPress={manejarCerrarSesion} activeOpacity={0.75}>
            <Text style={e.btnSalirTxt}>Salir</Text>
          </TouchableOpacity>
        </View>

        {/* ── Sección hijos ── */}
        <Text style={e.seccion}>
          {sinHijos ? 'Agrega a tu hijo para comenzar' : 'Tus hijos'}
        </Text>

        {perfilesHijos.map(perfil => (
          <CardHijo
            key={perfil.id}
            perfil={perfil}
            resumen={resumenes[perfil.id]}
            onEntrar={() => activarNino(perfil)}
          />
        ))}

        {/* ── Recomendación semanal ── */}
        {!sinHijos && (
          <>
            <Text style={e.seccion}>Recomendacion semanal</Text>
            <View style={e.cardRecomendacion}>
              <View style={e.recomDecorLinea} />
              <Text style={e.recomTexto}>{recomendacion}</Text>
            </View>
          </>
        )}

        {/* ── Agregar hijo ── */}
        <TouchableOpacity
          style={e.btnAgregar}
          onPress={() => navigation.navigate('CrearHijo')}
          activeOpacity={0.85}
        >
          <Text style={e.btnAgregarTxt}>
            {sinHijos ? 'Agregar a mi hijo' : '+ Agregar otro hijo'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const e = StyleSheet.create({
  raiz: { flex: 1, backgroundColor: COLORES.fondo },
  scroll: { padding: ESPACIO.lg, paddingTop: ESPACIO.lg, paddingBottom: 60 },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: ESPACIO.xl,
    paddingTop: ESPACIO.md,
  },
  headerTexto: { gap: 2 },
  bienvenida: { fontSize: 14, color: COLORES.textoSuave, letterSpacing: 0.3 },
  nombrePadre: {
    fontSize: 34,
    fontFamily: 'CocomatPro',
    color: COLORES.textoPrimario,
    textTransform: 'capitalize',
  },
  btnSalir: {
    backgroundColor: COLORES.superficie,
    borderRadius: RADIO.capsula,
    paddingHorizontal: ESPACIO.md,
    paddingVertical: 8,
    shadowColor: COLORES.madretierra,
    shadowOffset: { width: 3, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  btnSalirTxt: { fontSize: 13, color: COLORES.textoSecundario },

  // Sección título
  seccion: {
    fontSize: 12,
    color: COLORES.textoSuave,
    letterSpacing: 0.8,
    marginBottom: ESPACIO.md,
    textTransform: 'uppercase',
    fontFamily: 'CocomatPro',
  },

  // Recomendación semanal
  cardRecomendacion: {
    backgroundColor: COLORES.superficie,
    borderRadius: RADIO.xl,
    padding: ESPACIO.lg,
    marginBottom: ESPACIO.xl,
    shadowColor: COLORES.madretierra,
    shadowOffset: { width: 6, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.85)',
  },
  recomDecorLinea: {
    width: 32, height: 3, borderRadius: 2,
    backgroundColor: COLORES.arenaCalida,
    marginBottom: ESPACIO.sm,
  },
  recomTexto: {
    fontSize: 15,
    color: COLORES.textoPrimario,
    lineHeight: 24,
  },

  // Agregar hijo
  btnAgregar: {
    backgroundColor: COLORES.madretierra,
    borderRadius: RADIO.capsula,
    paddingVertical: 15,
    alignItems: 'center',
    shadowColor: COLORES.madretierra,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.32,
    shadowRadius: 14,
    elevation: 5,
  },
  btnAgregarTxt: {
    color: COLORES.suertedados,
    fontSize: 15,
    fontFamily: 'CocomatPro',
  },
})

