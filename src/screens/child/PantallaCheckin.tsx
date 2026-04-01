import React, { useState, useEffect } from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  ScrollView, ActivityIndicator, Alert,
} from 'react-native'
import { COLORES, ESPACIO, RADIO, SOMBRA_CARD, SOMBRA_BOTON } from '../../constants/tema'
import { insertarCheckin, obtenerAdultosSegurosPorNino, COLORES_EMOCION, ETIQUETAS_EMOCION } from '../../lib/checkins'
import { useAuth } from '../../store/AuthContext'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { StackNinoParamList } from '../../navigation/NavegadorNino'
import { SafeAdult, EmotionPrimary, ContextPrimary } from '../../types/database'

type Props = NativeStackScreenProps<StackNinoParamList, 'Checkin'>

// ─── Datos de opciones ────────────────────────────────────

const EMOCIONES_LIST: EmotionPrimary[] = [
  'alegria', 'calma', 'miedo', 'tristeza', 'enojo', 'confusion', 'frustracion', 'verguenza', 'no_se',
]

const LUGARES: { id: ContextPrimary; etiqueta: string }[] = [
  { id: 'casa',    etiqueta: 'En casa' },
  { id: 'escuela', etiqueta: 'En la escuela' },
  { id: 'afuera',  etiqueta: 'Afuera' },
  { id: 'coche',   etiqueta: 'En el coche' },
  { id: 'online',  etiqueta: 'Online' },
  { id: 'otro',    etiqueta: 'Otro lugar' },
]

const TOTAL_PASOS = 4

// ─── Pantalla principal ────────────────────────────────────

export default function PantallaCheckin({ navigation, route }: Props) {
  const { perfil } = route.params

  const [paso, setPaso] = useState(0)
  const [emocion, setEmocion] = useState<EmotionPrimary | null>(null)
  const [adultoId, setAdultoId] = useState<string | null>(null)     // null = solo
  const [adultoLabel, setAdultoLabel] = useState<string>('Solo')
  const [lugar, setLugar] = useState<ContextPrimary | null>(null)
  const [intensidad, setIntensidad] = useState(5)
  const [adultosDisponibles, setAdultosDisponibles] = useState<SafeAdult[]>([])
  const [guardando, setGuardando] = useState(false)

  // Cargar adultos seguros del niño al montar
  useEffect(() => {
    obtenerAdultosSegurosPorNino(perfil.id)
      .then(setAdultosDisponibles)
      .catch(() => {}) // lista vacía si falla, no bloquea
  }, [perfil.id])

  function avanzar() { setPaso(p => Math.min(p + 1, TOTAL_PASOS)) }
  function retroceder() { setPaso(p => Math.max(p - 1, 0)) }

  function puedeContinuar() {
    if (paso === 0) return !!emocion
    if (paso === 1) return true    // persona es opcional (puede ser "Solo")
    if (paso === 2) return !!lugar
    if (paso === 3) return true
    return false
  }

  async function guardarCheckin() {
    if (!emocion || !lugar) return
    setGuardando(true)
    try {
      await insertarCheckin({
        child_profile_id: perfil.id,
        emotion_primary: emocion,
        intensity: intensidad,
        context_primary: lugar,
        person_id: adultoId ?? undefined,
        person_label: adultoLabel !== 'Solo' ? adultoLabel : null,
        wants_to_talk: false,
        wants_only_help: false,
      })
      navigation.replace('HomeNino', { perfil })
    } catch (err: any) {
      Alert.alert('No se pudo guardar', err.message ?? 'Intenta de nuevo.')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <SafeAreaView style={estilos.contenedor}>
      {/* Barra de progreso */}
      <View style={estilos.barraPasos}>
        {[0, 1, 2, 3].map(i => (
          <View
            key={i}
            style={[
              estilos.segmentoPaso,
              i <= paso && estilos.segmentoPasoActivo,
            ]}
          />
        ))}
      </View>

      <ScrollView
        contentContainerStyle={estilos.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Paso 0: Emocion */}
        {paso === 0 && (
          <PasoEmocion emocionSeleccionada={emocion} onSeleccionar={setEmocion} />
        )}

        {/* Paso 1: Persona */}
        {paso === 1 && (
          <PasoPersona
            adultosDisponibles={adultosDisponibles}
            adultoIdSeleccionado={adultoId}
            onSeleccionar={(id, label) => { setAdultoId(id); setAdultoLabel(label) }}
          />
        )}

        {/* Paso 2: Lugar */}
        {paso === 2 && (
          <PasoOpciones
            titulo="Donde estas?"
            subtitulo="En este momento"
            opciones={LUGARES}
            seleccion={lugar}
            onSeleccionar={(v) => setLugar(v as ContextPrimary)}
          />
        )}

        {/* Paso 3: Intensidad */}
        {paso === 3 && (
          <PasoIntensidad
            emocion={emocion!}
            intensidad={intensidad}
            onChange={setIntensidad}
          />
        )}
      </ScrollView>

      {/* Acciones de navegacion */}
      <View style={estilos.pie}>
        {paso > 0 && (
          <TouchableOpacity style={estilos.botonAtras} onPress={retroceder}>
            <Text style={estilos.botonAtrasTexto}>Atras</Text>
          </TouchableOpacity>
        )}

        {paso < TOTAL_PASOS - 1 ? (
          <TouchableOpacity
            style={[estilos.botonContinuar, !puedeContinuar() && estilos.botonDesactivado]}
            onPress={avanzar}
            disabled={!puedeContinuar()}
          >
            <Text style={estilos.botonContinuarTexto}>Continuar</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[estilos.botonContinuar, !puedeContinuar() && estilos.botonDesactivado]}
            onPress={guardarCheckin}
            disabled={!puedeContinuar() || guardando}
          >
            {guardando
              ? <ActivityIndicator color={COLORES.suertedados} />
              : <Text style={estilos.botonContinuarTexto}>Listo</Text>
            }
          </TouchableOpacity>
        )}
      </View>

      {/* Cerrar */}
      <TouchableOpacity
        style={estilos.botonCerrar}
        onPress={() => navigation.goBack()}
      >
        <Text style={estilos.botonCerrarTexto}>Cancelar</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

// ─── Subcomponentes de pasos ───────────────────────────────

function PasoEmocion({
  emocionSeleccionada,
  onSeleccionar,
}: {
  emocionSeleccionada: EmotionPrimary | null
  onSeleccionar: (id: EmotionPrimary) => void
}) {
  return (
    <View>
      <Text style={estilos.preguntaTitulo}>Como te sientes ahora?</Text>
      <Text style={estilos.preguntaSubtitulo}>Escoge la que mas se acerca</Text>

      <View style={estilos.gridEmociones}>
        {EMOCIONES_LIST.map(em => (
          <TouchableOpacity
            key={em}
            style={[
              estilos.chipEmocion,
              { backgroundColor: COLORES_EMOCION[em] },
              emocionSeleccionada === em && estilos.chipEmocionActivo,
            ]}
            onPress={() => onSeleccionar(em)}
            activeOpacity={0.8}
          >
            <Text style={[
              estilos.chipEmocionTexto,
              emocionSeleccionada === em && estilos.chipEmocionTextoActivo,
            ]}>
              {ETIQUETAS_EMOCION[em]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}

function PasoPersona({
  adultosDisponibles,
  adultoIdSeleccionado,
  onSeleccionar,
}: {
  adultosDisponibles: SafeAdult[]
  adultoIdSeleccionado: string | null
  onSeleccionar: (id: string | null, label: string) => void
}) {
  // Opcion "Solo" siempre está al principio
  const opciones = [
    { id: null, nombre: 'Solo', relacion: '' },
    ...adultosDisponibles.map(a => ({ id: a.id, nombre: a.nombre, relacion: a.relacion })),
  ]

  return (
    <View>
      <Text style={estilos.preguntaTitulo}>Con quien estas?</Text>
      <Text style={estilos.preguntaSubtitulo}>En este momento</Text>

      <View style={estilos.listaOpciones}>
        {opciones.map(op => (
          <TouchableOpacity
            key={op.id ?? 'solo'}
            style={[
              estilos.filaOpcion,
              adultoIdSeleccionado === op.id && estilos.filaOpcionActiva,
            ]}
            onPress={() => onSeleccionar(op.id, op.nombre)}
            activeOpacity={0.8}
          >
            <View style={[
              estilos.circuloOpcion,
              adultoIdSeleccionado === op.id && estilos.circuloOpcionActivo,
            ]} />
            <View>
              <Text style={[
                estilos.etiquetaOpcion,
                adultoIdSeleccionado === op.id && estilos.etiquetaOpcionActiva,
              ]}>
                {op.nombre}
              </Text>
              {!!op.relacion && (
                <Text style={estilos.relacionTexto}>{op.relacion}</Text>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}

function PasoOpciones({
  titulo,
  subtitulo,
  opciones,
  seleccion,
  onSeleccionar,
}: {
  titulo: string
  subtitulo: string
  opciones: { id: string; etiqueta: string }[]
  seleccion: string | null
  onSeleccionar: (id: string) => void
}) {
  return (
    <View>
      <Text style={estilos.preguntaTitulo}>{titulo}</Text>
      <Text style={estilos.preguntaSubtitulo}>{subtitulo}</Text>

      <View style={estilos.listaOpciones}>
        {opciones.map(op => (
          <TouchableOpacity
            key={op.id}
            style={[
              estilos.filaOpcion,
              seleccion === op.id && estilos.filaOpcionActiva,
            ]}
            onPress={() => onSeleccionar(op.id)}
            activeOpacity={0.8}
          >
            <View style={[
              estilos.circuloOpcion,
              seleccion === op.id && estilos.circuloOpcionActivo,
            ]} />
            <Text style={[
              estilos.etiquetaOpcion,
              seleccion === op.id && estilos.etiquetaOpcionActiva,
            ]}>
              {op.etiqueta}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}

function PasoIntensidad({
  emocion,
  intensidad,
  onChange,
}: {
  emocion: string
  intensidad: number
  onChange: (v: number) => void
}) {
  const nivel = intensidad <= 3 ? 'un poco' : intensidad <= 6 ? 'bastante' : 'mucho'

  return (
    <View>
      <Text style={estilos.preguntaTitulo}>Cuanto sientes eso?</Text>
      <Text style={estilos.preguntaSubtitulo}>Mueve la barra hasta donde describes</Text>

      <View style={estilos.tarjetaIntensidad}>
        <Text style={estilos.intensidadValor}>{intensidad}</Text>
        <Text style={estilos.intensidadDescripcion}>
          Siento {emocion} {nivel}
        </Text>

        <View style={selectorEstilos.fila}>
          {[1,2,3,4,5,6,7,8,9,10].map(n => (
            <TouchableOpacity
              key={n}
              style={[
                selectorEstilos.celda,
                n === intensidad && selectorEstilos.celdaActiva,
              ]}
              onPress={() => onChange(n)}
            >
              <Text style={[
                selectorEstilos.celdaTexto,
                n === intensidad && selectorEstilos.celdaTextoActiva,
              ]}>
                {n}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={estilos.etiquetasSlider}>
          <Text style={estilos.etiquetaSlider}>Poco</Text>
          <Text style={estilos.etiquetaSlider}>Mucho</Text>
        </View>
      </View>
    </View>
  )
}

// ─── Estilos ───────────────────────────────────────────────

const estilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: COLORES.fondo },
  barraPasos: {
    flexDirection: 'row',
    paddingHorizontal: ESPACIO.lg,
    paddingTop: ESPACIO.md,
    gap: ESPACIO.xs,
  },
  segmentoPaso: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORES.borde,
  },
  segmentoPasoActivo: { backgroundColor: COLORES.madretierra },
  scroll: {
    padding: ESPACIO.lg,
    paddingTop: ESPACIO.xl,
    paddingBottom: ESPACIO.xxl,
  },
  preguntaTitulo: {
    fontSize: 26,
    fontFamily: 'CocoматPro-Regular',
    color: COLORES.textoPrimario,
    marginBottom: ESPACIO.xs,
  },
  preguntaSubtitulo: {
    fontSize: 14,
    color: COLORES.textoSuave,
    marginBottom: ESPACIO.xl,
  },
  gridEmociones: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ESPACIO.md,
  },
  chipEmocion: {
    borderRadius: RADIO.capsula,
    paddingHorizontal: ESPACIO.lg,
    paddingVertical: ESPACIO.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  chipEmocionActivo: {
    borderColor: COLORES.madretierra,
  },
  chipEmocionTexto: {
    fontSize: 15,
    color: COLORES.textoSecundario,
    fontWeight: '500',
  },
  chipEmocionTextoActivo: {
    color: COLORES.textoPrimario,
    fontWeight: '700',
  },
  relacionTexto: { fontSize: 11, color: COLORES.textoSuave },
  listaOpciones: { gap: ESPACIO.sm },
  filaOpcion: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORES.superficie,
    borderRadius: RADIO.lg,
    padding: ESPACIO.md,
    gap: ESPACIO.md,
    borderWidth: 2,
    borderColor: 'transparent',
    ...SOMBRA_CARD,
  },
  filaOpcionActiva: {
    borderColor: COLORES.madretierra,
    backgroundColor: COLORES.arenaCalida,
  },
  circuloOpcion: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: COLORES.borde,
  },
  circuloOpcionActivo: {
    backgroundColor: COLORES.madretierra,
    borderColor: COLORES.madretierra,
  },
  etiquetaOpcion: { fontSize: 15, color: COLORES.textoSecundario },
  etiquetaOpcionActiva: { fontWeight: '600', color: COLORES.textoPrimario },
  tarjetaIntensidad: {
    backgroundColor: COLORES.superficie,
    borderRadius: RADIO.xl,
    padding: ESPACIO.xl,
    alignItems: 'center',
    ...SOMBRA_CARD,
  },
  intensidadValor: {
    fontSize: 56,
    fontWeight: '700',
    color: COLORES.textoPrimario,
    lineHeight: 64,
  },
  intensidadDescripcion: {
    fontSize: 15,
    color: COLORES.textoSecundario,
    textAlign: 'center',
    marginTop: ESPACIO.xs,
  },
  etiquetasSlider: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 4,
  },
  etiquetaSlider: { fontSize: 12, color: COLORES.textoSuave },
  pie: {
    flexDirection: 'row',
    padding: ESPACIO.lg,
    gap: ESPACIO.md,
    paddingBottom: ESPACIO.xl,
  },
  botonAtras: {
    flex: 1,
    borderRadius: RADIO.capsula,
    paddingVertical: ESPACIO.md,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORES.borde,
  },
  botonAtrasTexto: { fontSize: 15, color: COLORES.textoSecundario },
  botonContinuar: {
    flex: 2,
    backgroundColor: COLORES.madretierra,
    borderRadius: RADIO.capsula,
    paddingVertical: ESPACIO.md,
    alignItems: 'center',
    ...SOMBRA_BOTON,
  },
  botonDesactivado: { opacity: 0.4 },
  botonContinuarTexto: { color: COLORES.suertedados, fontSize: 15, fontWeight: '600' },
  botonCerrar: {
    position: 'absolute',
    top: ESPACIO.md,
    right: ESPACIO.lg,
    padding: ESPACIO.sm,
  },
  botonCerrarTexto: { fontSize: 14, color: COLORES.textoSuave },
})

const selectorEstilos = StyleSheet.create({
  fila: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ESPACIO.xs,
    justifyContent: 'center',
    marginTop: ESPACIO.md,
    marginBottom: ESPACIO.sm,
  },
  celda: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORES.borde,
    justifyContent: 'center',
    alignItems: 'center',
  },
  celdaActiva: {
    backgroundColor: COLORES.madretierra,
  },
  celdaTexto: { fontSize: 14, color: COLORES.textoSecundario, fontWeight: '500' },
  celdaTextoActiva: { color: COLORES.suertedados, fontWeight: '700' },
})
