import React, { useState, useRef } from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  TextInput, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native'
import { COLORES, ESPACIO, RADIO } from '../../constants/tema'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { StackNinoParamList } from '../../navigation/NavegadorNino'
import { insertarIntervencion, actualizarIntervencion } from '../../lib/checkins'

type Props = NativeStackScreenProps<StackNinoParamList, 'Desahogarme'>

const MAX_CHARS = 280

export default function PantallaDesahogarme({ navigation, route }: Props) {
  const { perfil } = route.params
  const [texto, setTexto] = useState('')
  const [listo, setListo] = useState(false)
  const [intervencionId, setIntervencionId] = useState<string | null>(null)
  const [ayudoGuardado, setAyudoGuardado] = useState(false)
  const inicioRef = useRef(Date.now())

  function borrarTodo() {
    setTexto('')
  }

  async function terminar() {
    if (texto.trim().length === 0) return
    const duracion = Math.round((Date.now() - inicioRef.current) / 1000)
    try {
      const intervencion = await insertarIntervencion({
        child_profile_id: perfil.id,
        intervention_slug: 'desahogo_texto',
        duracion_segundos: duracion,
        completado: true,
        // El texto NO se guarda nunca — privacidad del niño
      })
      setIntervencionId(intervencion.id)
    } catch {
      // fallo silencioso — no bloquear la experiencia del niño
    }
    // Limpiar inmediatamente por privacidad
    setTexto('')
    setListo(true)
  }

  async function guardarAyudo(puntaje: number) {
    setAyudoGuardado(true)
    if (intervencionId) {
      await actualizarIntervencion(intervencionId, { helpful_score: puntaje }).catch(() => {})
    }
  }

  // ── Segunda fase: helpful score ──────────────────────────────
  if (listo) {
    return (
      <SafeAreaView style={e.raiz}>
        <View style={e.centrado}>
          <View style={e.decoradorListo} />
          <Text style={e.tituloListo}>Lo dijiste.</Text>
          <Text style={e.subtituloListo}>
            Lo que escribiste queda aqui nada mas.{'\n'}Solo para ti.
          </Text>

          {!ayudoGuardado ? (
            <>
              <Text style={e.pregunta}>Escribirlo te ayudo?</Text>
              <View style={e.opcionesRow}>
                {[
                  { label: 'Mucho', score: 3 },
                  { label: 'Un poco', score: 2 },
                  { label: 'No mucho', score: 1 },
                ].map(op => (
                  <TouchableOpacity
                    key={op.label}
                    style={e.opcionBtn}
                    onPress={() => guardarAyudo(op.score)}
                    activeOpacity={0.82}
                  >
                    <Text style={e.opcionTxt}>{op.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          ) : (
            <Text style={e.gracias}>Gracias por contarlo.</Text>
          )}

          <TouchableOpacity
            style={e.btnPrimario}
            onPress={() => navigation.goBack()}
            activeOpacity={0.82}
          >
            <Text style={e.btnPrimTxt}>Volver a mi refugio</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  // ── Primera fase: escribir ───────────────────────────────────
  return (
    <SafeAreaView style={e.raiz}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={e.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={e.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
              <Text style={e.volver}>Volver</Text>
            </TouchableOpacity>
          </View>

          <Text style={e.titulo}>Cuentale a este espacio</Text>
          <Text style={e.subtitulo}>
            Nadie mas va a leer esto.{'\n'}Solo es para ti.
          </Text>

          {/* Card input neumorphic */}
          <View style={e.cardInput}>
            <TextInput
              style={e.input}
              multiline
              value={texto}
              onChangeText={t => setTexto(t.slice(0, MAX_CHARS))}
              placeholder="Escribe lo que sientes..."
              placeholderTextColor={COLORES.textoSuave}
              textAlignVertical="top"
              autoCorrect={false}
              spellCheck={false}
            />
            {/* Contador y borrar */}
            <View style={e.contadorRow}>
              <TouchableOpacity onPress={borrarTodo} activeOpacity={0.7}>
                <Text style={e.borrarTxt}>Borrar todo</Text>
              </TouchableOpacity>
              <View style={[e.contadorPill, texto.length >= MAX_CHARS && e.contadorLleno]}>
                <Text style={[e.contadorTxt, texto.length >= MAX_CHARS && e.contadorLlenoTxt]}>
                  {texto.length}/{MAX_CHARS}
                </Text>
              </View>
            </View>
          </View>

          {/* Botón principal */}
          <TouchableOpacity
            style={[e.btnPrimario, texto.trim().length === 0 && e.btnDesactivado]}
            onPress={terminar}
            activeOpacity={0.82}
            disabled={texto.trim().length === 0}
          >
            <Text style={[e.btnPrimTxt, texto.trim().length === 0 && e.btnDesactivadoTxt]}>
              {texto.trim().length === 0 ? 'Escribe algo primero' : 'Listo, ya lo dije'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const e = StyleSheet.create({
  raiz: { flex: 1, backgroundColor: COLORES.fondo },
  scroll: { padding: ESPACIO.lg, paddingTop: ESPACIO.xl, paddingBottom: 60 },

  header: { marginBottom: ESPACIO.xl },
  volver: { fontSize: 14, color: COLORES.textoSecundario },
  titulo: {
    fontSize: 30,
    fontFamily: 'CocomatPro',
    color: COLORES.textoPrimario,
    lineHeight: 38,
    marginBottom: ESPACIO.sm,
  },
  subtitulo: {
    fontSize: 14,
    color: COLORES.textoSuave,
    lineHeight: 22,
    marginBottom: ESPACIO.xl,
  },

  // Card input neumorphic inset
  cardInput: {
    backgroundColor: COLORES.superficie,
    borderRadius: RADIO.xl,
    padding: ESPACIO.md,
    marginBottom: ESPACIO.xl,
    shadowColor: COLORES.madretierra,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
    minHeight: 220,
  },
  input: {
    minHeight: 180,
    fontSize: 16,
    color: COLORES.textoPrimario,
    lineHeight: 26,
    paddingBottom: ESPACIO.md,
  },
  contadorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: ESPACIO.sm,
    borderTopWidth: 1,
    borderTopColor: COLORES.borde,
  },
  borrarTxt: { fontSize: 13, color: COLORES.textoSuave },
  contadorPill: {
    backgroundColor: COLORES.borde,
    borderRadius: RADIO.capsula,
    paddingHorizontal: ESPACIO.sm,
    paddingVertical: 2,
  },
  contadorLleno: { backgroundColor: COLORES.error },
  contadorTxt: { fontSize: 11, color: COLORES.textoSecundario },
  contadorLlenoTxt: { color: COLORES.suertedados },

  // Botón principal
  btnPrimario: {
    backgroundColor: COLORES.madretierra,
    borderRadius: RADIO.capsula,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: COLORES.madretierra,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    marginBottom: ESPACIO.lg,
  },
  btnDesactivado: {
    backgroundColor: COLORES.borde,
    shadowOpacity: 0,
  },
  btnPrimTxt: {
    color: COLORES.suertedados,
    fontSize: 15,
    fontFamily: 'CocomatPro',
  },
  btnDesactivadoTxt: {
    color: COLORES.textoSuave,
  },

  // Segunda fase
  centrado: {
    flex: 1,
    padding: ESPACIO.xl,
    justifyContent: 'center',
    alignItems: 'center',
    gap: ESPACIO.lg,
    minHeight: 500,
  },
  decoradorListo: {
    width: 48,
    height: 6,
    borderRadius: RADIO.capsula,
    backgroundColor: COLORES.madretierra,
    opacity: 0.4,
  },
  tituloListo: {
    fontSize: 34,
    fontFamily: 'CocomatPro',
    color: COLORES.textoPrimario,
    textAlign: 'center',
  },
  subtituloListo: {
    fontSize: 15,
    color: COLORES.textoSuave,
    textAlign: 'center',
    lineHeight: 24,
  },
  pregunta: {
    fontSize: 17,
    color: COLORES.textoPrimario,
    textAlign: 'center',
    marginTop: ESPACIO.sm,
  },
  opcionesRow: {
    flexDirection: 'row',
    gap: ESPACIO.sm,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  opcionBtn: {
    backgroundColor: COLORES.superficie,
    borderRadius: RADIO.capsula,
    paddingVertical: ESPACIO.sm,
    paddingHorizontal: ESPACIO.md,
    shadowColor: COLORES.madretierra,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: COLORES.borde,
  },
  opcionTxt: { fontSize: 14, color: COLORES.textoPrimario },
  gracias: {
    fontSize: 20,
    fontFamily: 'CocomatPro',
    color: COLORES.madretierra,
    textAlign: 'center',
  },
})
