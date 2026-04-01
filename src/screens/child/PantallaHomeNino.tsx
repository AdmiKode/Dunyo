import React, { useState, useRef, useEffect } from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  ScrollView, Animated,
} from 'react-native'
import { COLORES, ESPACIO, RADIO, SOMBRA_CARD, SOMBRA_BOTON } from '../../constants/tema'
import { useAuth } from '../../store/AuthContext'
import { MoodCheckin } from '../../types/database'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { StackNinoParamList } from '../../navigation/NavegadorNino'
import { obtenerCheckinDeHoy, obtenerCheckinsSemanaActual } from '../../lib/checkins'
import { calcularELSLocal, interpretarELS, obtenerTopEmocionesDeSemana } from '../../lib/metricas'

type Props = NativeStackScreenProps<StackNinoParamList, 'HomeNino'>

// Saludo según la hora
function obtenerSaludo(): string {
  const hora = new Date().getHours()
  if (hora < 12) return 'Buenos dias'
  if (hora < 19) return 'Buenas tardes'
  return 'Buenas noches'
}

export default function PantallaHomeNino({ navigation, route }: Props) {
  const { perfil } = route.params
  const { salirDeNino } = useAuth()
  const [mostrarConfirmacionSalida, setMostrarConfirmacionSalida] = useState(false)
  const [checkinHoy, setCheckinHoy] = useState<MoodCheckin | null>(null)
  const [checkins7d, setCheckins7d] = useState<MoodCheckin[]>([])
  const [els, setEls] = useState(0)
  const [bandaEls, setBandaEls] = useState<{ banda: string; colorHex: string; descripcion: string } | null>(null)

  useEffect(() => {
    obtenerCheckinDeHoy(perfil.id)
      .then(c => setCheckinHoy(c))
      .catch(() => {})

    obtenerCheckinsSemanaActual(perfil.id)
      .then(cs => {
        setCheckins7d(cs)
        const elsCalc = calcularELSLocal(cs)
        setEls(elsCalc)
        setBandaEls(interpretarELS(elsCalc))
      })
      .catch(() => {})
  }, [perfil.id])

  return (
    <SafeAreaView style={estilos.contenedor}>
      <ScrollView
        contentContainerStyle={estilos.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Encabezado */}
        <View style={estilos.encabezado}>
          <View>
            <Text style={estilos.saludo}>{obtenerSaludo()},</Text>
            <Text style={estilos.nombre}>{perfil.nombre_display}</Text>
          </View>

          <TouchableOpacity
            style={estilos.botonSalir}
            onPress={() => setMostrarConfirmacionSalida(true)}
          >
            <Text style={estilos.botonSalirTexto}>Salir</Text>
          </TouchableOpacity>
        </View>

        {/* Tarjeta principal — estado emocional */}
        <View style={estilos.tarjetaEstado}>
          <GaugeEls els={els} bandaColorHex={bandaEls?.colorHex} />
          <Text style={estilos.estadoPregunta}>
            {checkinHoy ? 'Has registrado como te sientes hoy' : 'Como te sientes ahora?'}
          </Text>
          <TouchableOpacity
            style={estilos.botonCheckin}
            onPress={() => navigation.navigate('Checkin', { perfil })}
            activeOpacity={0.85}
          >
            <Text style={estilos.botonCheckinTexto}>
              {checkinHoy ? 'Registrar otra vez' : 'Registrar como me siento'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Acciones rapidas */}
        <Text style={estilos.seccionTitulo}>Que quieres hacer?</Text>
        <View style={estilos.gridAcciones}>
          {ACCIONES.map(accion => (
            <TouchableOpacity
              key={accion.id}
              style={[estilos.tarjetaAccion, { backgroundColor: accion.color }]}
              onPress={() => navigation.navigate(accion.pantalla as any, { perfil })}
              activeOpacity={0.82}
            >
              <View style={estilos.tarjetaAccionLinea} />
              <Text style={estilos.tarjetaAccionTitulo}>{accion.titulo}</Text>
              <Text style={estilos.tarjetaAccionDescripcion}>{accion.descripcion}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Companero */}
        <View style={estilos.tarjetaCompanero}>
          <View style={[
            estilos.iconoCompanero,
            perfil.companion_type === 'cat' && estilos.iconoCompaneroGato,
          ]}>
            <Text style={estilos.iconoCompaneroLetra}>
              {perfil.companion_type === 'dog' ? 'P' : 'G'}
            </Text>
          </View>
          <View style={estilos.infoCompanero}>
            <Text style={estilos.companeroNombre}>
              Tu {perfil.companion_type === 'dog' ? 'perro' : 'gato'} esta contigo
            </Text>
            <Text style={estilos.companeroMensaje}>
              Este es tu refugio. Aqui puedes ser como eres.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Modal de confirmacion de salida */}
      {mostrarConfirmacionSalida && (
        <View style={estilos.modalOverlay}>
          <View style={estilos.modal}>
            <Text style={estilos.modalTitulo}>Salir del refugio?</Text>
            <Text style={estilos.modalSubtitulo}>
              Regresaras a la pantalla de seleccion de perfil.
            </Text>
            <TouchableOpacity
              style={estilos.modalBotonPrincipal}
              onPress={salirDeNino}
            >
              <Text style={estilos.modalBotonPrincipalTexto}>Si, salir</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={estilos.modalBotonCancelar}
              onPress={() => setMostrarConfirmacionSalida(false)}
            >
              <Text style={estilos.modalBotonCancelarTexto}>Quedarme</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  )
}

// Gauge con ELS real — arco semicircular cuyo relleno proporcional indica la banda
function GaugeEls({ els, bandaColorHex }: { els: number; bandaColorHex?: string }) {
  const color = bandaColorHex ?? COLORES.arenaCalida
  // El arco relleno es proporcional al ELS (0-100 → 0-100% del ancho del semicirculo)
  const pct = Math.max(0, Math.min(100, els))
  return (
    <View style={gaugeEstilos.contenedor}>
      <View style={gaugeEstilos.arco}>
        <View style={[gaugeEstilos.arcoRelleno, { width: `${pct}%`, backgroundColor: color }]} />
        <View style={gaugeEstilos.arcoInterior} />
      </View>
      {els > 0 ? (
        <Text style={[gaugeEstilos.texto, { color }]}>{Math.round(els)}</Text>
      ) : (
        <Text style={gaugeEstilos.texto}>Tu espacio seguro</Text>
      )}
    </View>
  )
}

const gaugeEstilos = StyleSheet.create({
  contenedor: { alignItems: 'center', marginBottom: ESPACIO.md, paddingTop: ESPACIO.md },
  arco: {
    width: 120,
    height: 60,
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    backgroundColor: COLORES.borde,
    borderWidth: 2,
    borderBottomWidth: 0,
    borderColor: COLORES.borde,
    justifyContent: 'flex-end',
    alignItems: 'center',
    overflow: 'hidden',
  },
  arcoRelleno: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: '100%',
    opacity: 0.6,
  },
  arcoInterior: {
    width: 80,
    height: 40,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    backgroundColor: COLORES.fondo,
    marginBottom: -1,
  },
  texto: { fontSize: 13, color: COLORES.textoSuave, marginTop: ESPACIO.sm, fontWeight: '600' },
})

const ACCIONES = [
  {
    id: 'calmar',
    titulo: 'Calmarme',
    descripcion: 'Respiracion y calma',
    color: COLORES.azulsuave,
    pantalla: 'Calmarme',
  },
  {
    id: 'decir',
    titulo: 'Ayudame a decirlo',
    descripcion: 'Hablar con alguien',
    color: COLORES.arenaCalida,
    pantalla: 'AyudameADecirlo',
  },
]

const estilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: COLORES.fondo },
  scroll: { padding: ESPACIO.lg, paddingTop: ESPACIO.xl, paddingBottom: ESPACIO.xxl },
  encabezado: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: ESPACIO.xl,
  },
  saludo: { fontSize: 14, color: COLORES.textoSuave },
  nombre: {
    fontSize: 28,
    color: COLORES.textoPrimario,
    fontFamily: 'CocoматPro-Regular',
  },
  botonSalir: {
    paddingHorizontal: ESPACIO.md,
    paddingVertical: ESPACIO.xs + 2,
    borderRadius: RADIO.capsula,
    borderWidth: 1.5,
    borderColor: COLORES.borde,
  },
  botonSalirTexto: { fontSize: 13, color: COLORES.textoSecundario },
  tarjetaEstado: {
    backgroundColor: COLORES.superficie,
    borderRadius: RADIO.xl,
    padding: ESPACIO.lg,
    alignItems: 'center',
    marginBottom: ESPACIO.xl,
    ...SOMBRA_CARD,
  },
  estadoPregunta: {
    fontSize: 16,
    color: COLORES.textoPrimario,
    fontWeight: '500',
    marginBottom: ESPACIO.md,
    textAlign: 'center',
  },
  botonCheckin: {
    backgroundColor: COLORES.madretierra,
    borderRadius: RADIO.capsula,
    paddingVertical: ESPACIO.sm + 2,
    paddingHorizontal: ESPACIO.xl,
    ...SOMBRA_BOTON,
  },
  botonCheckinTexto: {
    color: COLORES.suertedados,
    fontSize: 14,
    fontWeight: '600',
  },
  seccionTitulo: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORES.textoPrimario,
    marginBottom: ESPACIO.md,
  },
  gridAcciones: {
    flexDirection: 'row',
    gap: ESPACIO.md,
    marginBottom: ESPACIO.xl,
  },
  tarjetaAccion: {
    flex: 1,
    borderRadius: RADIO.xl,
    padding: ESPACIO.md,
    minHeight: 110,
    justifyContent: 'flex-end',
    ...SOMBRA_CARD,
  },
  tarjetaAccionLinea: {
    position: 'absolute',
    top: ESPACIO.md,
    left: ESPACIO.md,
    width: 20,
    height: 3,
    borderRadius: 2,
    backgroundColor: COLORES.madretierraAlpha,
  },
  tarjetaAccionTitulo: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORES.textoPrimario,
    marginBottom: 2,
  },
  tarjetaAccionDescripcion: {
    fontSize: 12,
    color: COLORES.textoSecundario,
  },
  tarjetaCompanero: {
    backgroundColor: COLORES.superficie,
    borderRadius: RADIO.xl,
    padding: ESPACIO.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESPACIO.md,
    ...SOMBRA_CARD,
  },
  iconoCompanero: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORES.arenaCalida,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconoCompaneroGato: { backgroundColor: COLORES.azulsuave },
  iconoCompaneroLetra: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORES.textoPrimario,
  },
  infoCompanero: { flex: 1 },
  companeroNombre: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORES.textoPrimario,
    marginBottom: 2,
  },
  companeroMensaje: { fontSize: 12, color: COLORES.textoSuave, lineHeight: 18 },
  // Modal
  modalOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(81, 50, 41, 0.35)',
    justifyContent: 'flex-end',
    padding: ESPACIO.lg,
  },
  modal: {
    backgroundColor: COLORES.fondo,
    borderRadius: RADIO.xl,
    padding: ESPACIO.xl,
    gap: ESPACIO.sm,
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORES.textoPrimario,
    marginBottom: 4,
  },
  modalSubtitulo: { fontSize: 14, color: COLORES.textoSuave, marginBottom: ESPACIO.md },
  modalBotonPrincipal: {
    backgroundColor: COLORES.madretierra,
    borderRadius: RADIO.capsula,
    paddingVertical: ESPACIO.md,
    alignItems: 'center',
  },
  modalBotonPrincipalTexto: { color: COLORES.suertedados, fontSize: 15, fontWeight: '600' },
  modalBotonCancelar: { paddingVertical: ESPACIO.sm, alignItems: 'center' },
  modalBotonCancelarTexto: { fontSize: 14, color: COLORES.textoSecundario },
})
