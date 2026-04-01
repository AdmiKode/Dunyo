import React, { useState } from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView,
} from 'react-native'
import { COLORES, ESPACIO, RADIO, SOMBRA_CARD, SOMBRA_BOTON } from '../../constants/tema'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { StackNinoParamList } from '../../navigation/NavegadorNino'
import { insertarIntervencion, actualizarIntervencion } from '../../lib/checkins'

type Props = NativeStackScreenProps<StackNinoParamList, 'AyudameADecirlo'>

// Frases sugeridas que el nino puede mostrarle a un adulto
const FRASES = [
  {
    id: 'triste',
    emocion: 'Triste',
    mensaje: 'Me siento triste y necesito que alguien me escuche sin preguntarme muchas cosas.',
    color: COLORES.azulsuave,
  },
  {
    id: 'asustado',
    emocion: 'Asustado',
    mensaje: 'Siento miedo y necesito que este cerca de mi alguien en quien confio.',
    color: '#C5D9EC',
  },
  {
    id: 'enojado',
    emocion: 'Enojado',
    mensaje: 'Estoy enojado y necesito calmarme primero. Despues te cuento.',
    color: '#E8C4B4',
  },
  {
    id: 'confundido',
    emocion: 'Confundido',
    mensaje: 'No entiendo lo que siento. Necesito ayuda para ordenar mis ideas.',
    color: COLORES.verdeApagado,
  },
  {
    id: 'agobiado',
    emocion: 'Agobiado',
    mensaje: 'Siento que tengo mucho encima. Necesito un momento de calma contigo.',
    color: COLORES.arenaCalida,
  },
]

export default function PantallaAyudameADecirlo({ navigation, route }: Props) {
  const { perfil } = route.params
  const [faseSeleccionada, setFraseSeleccionada] = useState<string | null>(null)
  const [intervencionId, setIntervencionId] = useState<string | null>(null)
  const [ayudoGuardado, setAyudoGuardado] = useState(false)

  function seleccionarFrase(id: string) {
    setFraseSeleccionada(id)
    setAyudoGuardado(false)
    // Guardar intervención al mostrar la frase al adulto
    insertarIntervencion({
      child_profile_id: perfil.id,
      intervention_slug: 'ayudame_a_decirlo',
      completado: true,
    })
      .then(intervencion => setIntervencionId(intervencion.id))
      .catch(() => {})
  }

  async function guardarAyudo(puntaje: number) {
    setAyudoGuardado(true)
    if (intervencionId) {
      await actualizarIntervencion(intervencionId, { helpful_score: puntaje }).catch(() => {})
    }
  }

  const fraseActual = FRASES.find(f => f.id === faseSeleccionada)

  if (fraseActual) {
    return (
      <SafeAreaView style={estilos.contenedor}>
        <View style={estilos.cuerpoFrase}>
          {/* Tarjeta de mensaje para mostrar al adulto */}
          <View style={[estilos.tarjetaMensaje, { backgroundColor: fraseActual.color }]}>
            <Text style={estilos.instruccionAdulto}>
              Muestra esta pantalla a alguien de confianza
            </Text>
            <View style={estilos.lineaSeparadora} />
            <Text style={estilos.mensajeParaAdulto}>{fraseActual.mensaje}</Text>
            <Text style={estilos.nombreNino}>— {perfil.nombre_display}</Text>
          </View>

          <Text style={estilos.ayudaTexto}>
            Puedes mostrarle esto a un adulto de confianza cuando no puedas decirlo con palabras.
          </Text>

          <View style={estilos.botonesAccion}>
            <TouchableOpacity
              style={estilos.botonOtraFrase}
              onPress={() => setFraseSeleccionada(null)}
            >
              <Text style={estilos.botonOtraFraseTexto}>Elegir otra frase</Text>
            </TouchableOpacity>

            {/* Pregunta helpful_score */}
            {!ayudoGuardado ? (
              <View style={estilos.preguntaAyudo}>
                <Text style={estilos.preguntaAyudoTitulo}>Los ayudo a entenderte?</Text>
                <View style={estilos.filaAyudo}>
                  {[{ etiqueta: 'Mucho', valor: 10 }, { etiqueta: 'Un poco', valor: 5 }, { etiqueta: 'No mucho', valor: 2 }].map(op => (
                    <TouchableOpacity
                      key={op.valor}
                      style={estilos.chipAyudo}
                      onPress={() => guardarAyudo(op.valor)}
                      activeOpacity={0.8}
                    >
                      <Text style={estilos.chipAyudoTexto}>{op.etiqueta}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ) : (
              <Text style={estilos.ayudoConfirmado}>Gracias por contarnos</Text>
            )}

            <TouchableOpacity
              style={estilos.botonVolver}
              onPress={() => navigation.navigate('HomeNino', { perfil })}
            >
              <Text style={estilos.botonVolverTexto}>Volver a mi refugio</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={estilos.contenedor}>
      {/* Encabezado */}
      <View style={estilos.encabezado}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={estilos.botonAtrasTexto}>Volver</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={estilos.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={estilos.titulo}>Ayudame a decirlo</Text>
        <Text style={estilos.subtitulo}>
          A veces las palabras no salen. Elige como te sientes y te ayudamos a decirlo.
        </Text>

        <View style={estilos.listaFrases}>
          {FRASES.map(frase => (
            <TouchableOpacity
              key={frase.id}
              style={[estilos.tarjetaFrase, { backgroundColor: frase.color }]}
              onPress={() => seleccionarFrase(frase.id)}
              activeOpacity={0.82}
            >
              <Text style={estilos.emocionEtiqueta}>{frase.emocion}</Text>
              <Text style={estilos.frasePreview} numberOfLines={2}>
                {frase.mensaje}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: COLORES.fondo },
  encabezado: {
    paddingHorizontal: ESPACIO.lg,
    paddingTop: ESPACIO.md,
    paddingBottom: ESPACIO.sm,
  },
  botonAtrasTexto: { fontSize: 15, color: COLORES.textoSecundario },
  scroll: {
    padding: ESPACIO.lg,
    paddingTop: ESPACIO.sm,
    paddingBottom: ESPACIO.xxl,
  },
  titulo: {
    fontSize: 30,
    fontFamily: 'CocoматPro-Regular',
    color: COLORES.textoPrimario,
    marginBottom: ESPACIO.sm,
  },
  subtitulo: {
    fontSize: 14,
    color: COLORES.textoSuave,
    lineHeight: 22,
    marginBottom: ESPACIO.xl,
  },
  listaFrases: { gap: ESPACIO.md },
  tarjetaFrase: {
    borderRadius: RADIO.xl,
    padding: ESPACIO.lg,
    ...SOMBRA_CARD,
  },
  emocionEtiqueta: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORES.textoPrimario,
    marginBottom: ESPACIO.xs,
  },
  frasePreview: {
    fontSize: 13,
    color: COLORES.textoSecundario,
    lineHeight: 20,
  },
  // Pantalla de frase seleccionada
  cuerpoFrase: {
    flex: 1,
    padding: ESPACIO.xl,
    justifyContent: 'center',
    gap: ESPACIO.xl,
  },
  tarjetaMensaje: {
    borderRadius: RADIO.xl,
    padding: ESPACIO.xl,
    ...SOMBRA_CARD,
  },
  instruccionAdulto: {
    fontSize: 11,
    color: COLORES.textoSuave,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: ESPACIO.md,
  },
  lineaSeparadora: {
    height: 1,
    backgroundColor: COLORES.borde,
    marginBottom: ESPACIO.md,
  },
  mensajeParaAdulto: {
    fontSize: 20,
    fontFamily: 'CocoматPro-Regular',
    color: COLORES.textoPrimario,
    lineHeight: 30,
    marginBottom: ESPACIO.md,
  },
  nombreNino: {
    fontSize: 14,
    color: COLORES.textoSecundario,
    fontStyle: 'italic',
  },
  ayudaTexto: {
    fontSize: 13,
    color: COLORES.textoSuave,
    textAlign: 'center',
    lineHeight: 20,
  },
  botonesAccion: { gap: ESPACIO.sm },
  botonOtraFrase: {
    backgroundColor: COLORES.madretierra,
    borderRadius: RADIO.capsula,
    paddingVertical: ESPACIO.md,
    alignItems: 'center',
    ...SOMBRA_BOTON,
  },
  botonOtraFraseTexto: { color: COLORES.suertedados, fontSize: 15, fontWeight: '600' },
  botonVolver: { paddingVertical: ESPACIO.sm, alignItems: 'center' },
  botonVolverTexto: { fontSize: 14, color: COLORES.textoSuave },
  preguntaAyudo: { marginTop: ESPACIO.lg },
  preguntaAyudoTitulo: { fontSize: 14, color: COLORES.textoSuave, marginBottom: ESPACIO.sm, textAlign: 'center' },
  filaAyudo: { flexDirection: 'row', justifyContent: 'center', gap: ESPACIO.sm },
  chipAyudo: {
    borderRadius: RADIO.capsula,
    paddingHorizontal: ESPACIO.md,
    paddingVertical: ESPACIO.xs + 2,
    borderWidth: 1.5,
    borderColor: COLORES.borde,
  },
  chipAyudoTexto: { fontSize: 13, color: COLORES.textoSecundario },
  ayudoConfirmado: { fontSize: 13, color: COLORES.textoSuave, textAlign: 'center', marginTop: ESPACIO.md },
})
