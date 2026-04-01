import React, { useState } from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  ScrollView, ActivityIndicator, Alert,
} from 'react-native'
import { COLORES, ESPACIO, RADIO, SOMBRA_CARD, SOMBRA_BOTON } from '../../constants/tema'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../store/AuthContext'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { StackNinoParamList } from '../../navigation/NavegadorNino'

type Props = NativeStackScreenProps<StackNinoParamList, 'Checkin'>

// ─── Datos de opciones ────────────────────────────────────

const EMOCIONES = [
  { id: 'alegria',    etiqueta: 'Alegria',    color: COLORES.arenaCalida },
  { id: 'calma',      etiqueta: 'Calma',      color: COLORES.verdeApagado },
  { id: 'miedo',      etiqueta: 'Miedo',      color: COLORES.azulsuave },
  { id: 'tristeza',   etiqueta: 'Tristeza',   color: '#C5D9EC' },
  { id: 'enojo',      etiqueta: 'Enojo',      color: '#E8C4B4' },
  { id: 'confusion',  etiqueta: 'Confusion',  color: COLORES.borde },
]

const PERSONAS = [
  { id: 'solo',    etiqueta: 'Solo' },
  { id: 'familia', etiqueta: 'Con familia' },
  { id: 'amigos',  etiqueta: 'Con amigos' },
  { id: 'profe',   etiqueta: 'Con mi profe' },
  { id: 'otro',    etiqueta: 'Con alguien mas' },
]

const LUGARES = [
  { id: 'casa',    etiqueta: 'En casa' },
  { id: 'escuela', etiqueta: 'En la escuela' },
  { id: 'afuera',  etiqueta: 'Afuera' },
  { id: 'coche',   etiqueta: 'En el coche' },
  { id: 'otro',    etiqueta: 'Otro lugar' },
]

const TOTAL_PASOS = 4

// ─── Pantalla principal ────────────────────────────────────

export default function PantallaCheckin({ navigation, route }: Props) {
  const { perfil } = route.params
  const { sesionPadre } = useAuth()

  const [paso, setPaso] = useState(0)
  const [emocion, setEmocion] = useState<string | null>(null)
  const [persona, setPersona] = useState<string | null>(null)
  const [lugar, setLugar] = useState<string | null>(null)
  const [intensidad, setIntensidad] = useState(5)
  const [guardando, setGuardando] = useState(false)

  function avanzar() { setPaso(p => Math.min(p + 1, TOTAL_PASOS)) }
  function retroceder() { setPaso(p => Math.max(p - 1, 0)) }

  function puedeContinuar() {
    if (paso === 0) return !!emocion
    if (paso === 1) return !!persona
    if (paso === 2) return !!lugar
    if (paso === 3) return true // intensidad siempre tiene valor
    return false
  }

  async function guardarCheckin() {
    if (!emocion || !persona || !lugar || !sesionPadre) return
    setGuardando(true)
    try {
      // Guardar en child_context (actualizar o insertar)
      // Se guarda como evento de check-in en auth_events
      await supabase.from('auth_events').insert({
        event_name: 'child_checkin',
        actor_type: 'child',
        child_profile_id: perfil.id,
        parent_user_id: sesionPadre.user.id,
        metadata: {
          emocion,
          persona,
          lugar,
          intensidad,
          timestamp: new Date().toISOString(),
        },
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
          <PasoOpciones
            titulo="Con quien estas?"
            subtitulo="En este momento"
            opciones={PERSONAS}
            seleccion={persona}
            onSeleccionar={setPersona}
          />
        )}

        {/* Paso 2: Lugar */}
        {paso === 2 && (
          <PasoOpciones
            titulo="Donde estas?"
            subtitulo="En este momento"
            opciones={LUGARES}
            seleccion={lugar}
            onSeleccionar={setLugar}
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
  emocionSeleccionada: string | null
  onSeleccionar: (id: string) => void
}) {
  return (
    <View>
      <Text style={estilos.preguntaTitulo}>Como te sientes ahora?</Text>
      <Text style={estilos.preguntaSubtitulo}>Escoge la que mas se acerca</Text>

      <View style={estilos.gridEmociones}>
        {EMOCIONES.map(em => (
          <TouchableOpacity
            key={em.id}
            style={[
              estilos.chipEmocion,
              { backgroundColor: em.color },
              emocionSeleccionada === em.id && estilos.chipEmocionActivo,
            ]}
            onPress={() => onSeleccionar(em.id)}
            activeOpacity={0.8}
          >
            <Text style={[
              estilos.chipEmocionTexto,
              emocionSeleccionada === em.id && estilos.chipEmocionTextoActivo,
            ]}>
              {em.etiqueta}
            </Text>
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
