import React, { useState, useEffect, useRef } from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Animated,
} from 'react-native'
import { COLORES, ESPACIO, RADIO, SOMBRA_BOTON } from '../../constants/tema'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { StackNinoParamList } from '../../navigation/NavegadorNino'

type Props = NativeStackScreenProps<StackNinoParamList, 'Calmarme'>

// Ejercicio de respiracion 4-7-8
// Inhalar 4s, sostener 7s, exhalar 8s
const FASES = [
  { etiqueta: 'Inhala', duracion: 4, color: COLORES.azulsuave },
  { etiqueta: 'Sostente', duracion: 7, color: COLORES.arenaCalida },
  { etiqueta: 'Exhala', duracion: 8, color: COLORES.verdeApagado },
]

const DURACIONES_MIN = [
  { etiqueta: '20 seg', ciclos: 1 },
  { etiqueta: '1 min',  ciclos: 3 },
  { etiqueta: '2 min',  ciclos: 6 },
]

export default function PantallaCalmarme({ navigation, route }: Props) {
  const { perfil } = route.params

  const [activo, setActivo] = useState(false)
  const [ciclosObjetivo, setCiclosObjetivo] = useState(3)
  const [ciclosCompletados, setCiclosCompletados] = useState(0)
  const [faseActual, setFaseActual] = useState(0)
  const [segundosFase, setSegundosFase] = useState(0)
  const [listo, setListo] = useState(false)

  const animCirculo = useRef(new Animated.Value(0.6)).current
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  useEffect(() => {
    if (!activo) return
    const fase = FASES[faseActual]

    // Animacion de expansion/contraccion
    Animated.timing(animCirculo, {
      toValue: faseActual === 0 ? 1.0 : faseActual === 2 ? 0.6 : 0.85,
      duration: fase.duracion * 1000,
      useNativeDriver: true,
    }).start()

    let segundos = fase.duracion
    intervalRef.current = setInterval(() => {
      segundos -= 1
      setSegundosFase(segundos)

      if (segundos <= 0) {
        clearInterval(intervalRef.current!)
        const siguienteFase = (faseActual + 1) % FASES.length
        if (siguienteFase === 0) {
          const nuevoCiclos = ciclosCompletados + 1
          setCiclosCompletados(nuevoCiclos)
          if (nuevoCiclos >= ciclosObjetivo) {
            setActivo(false)
            setListo(true)
            return
          }
        }
        setFaseActual(siguienteFase)
        setSegundosFase(FASES[siguienteFase].duracion)
      }
    }, 1000)

    setSegundosFase(fase.duracion)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [activo, faseActual])

  function iniciar() {
    setActivo(true)
    setFaseActual(0)
    setCiclosCompletados(0)
    setListo(false)
    setSegundosFase(FASES[0].duracion)
  }

  function detener() {
    setActivo(false)
    if (intervalRef.current) clearInterval(intervalRef.current)
    animCirculo.setValue(0.6)
    setFaseActual(0)
    setSegundosFase(0)
  }

  const faseDatos = FASES[faseActual]

  return (
    <SafeAreaView style={estilos.contenedor}>
      {/* Encabezado */}
      <View style={estilos.encabezado}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={estilos.botonVolver}>Volver</Text>
        </TouchableOpacity>
        <Text style={estilos.titulo}>Calmarme</Text>
        <View style={{ width: 50 }} />
      </View>

      {/* Selector de duracion */}
      {!activo && !listo && (
        <View style={estilos.selectorDuracion}>
          <Text style={estilos.selectorTitulo}>Cuanto tiempo?</Text>
          <View style={estilos.filaDuraciones}>
            {DURACIONES_MIN.map(d => (
              <TouchableOpacity
                key={d.etiqueta}
                style={[estilos.chipDuracion, d.ciclos === ciclosObjetivo && estilos.chipDuracionActivo]}
                onPress={() => setCiclosObjetivo(d.ciclos)}
              >
                <Text style={[estilos.chipDuracionTexto, d.ciclos === ciclosObjetivo && estilos.chipDuracionTextoActivo]}>
                  {d.etiqueta}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Circulo de respiracion */}
      <View style={estilos.centrado}>
        <Animated.View
          style={[
            estilos.circuloExterno,
            { backgroundColor: activo ? faseDatos.color : COLORES.borde },
            { transform: [{ scale: animCirculo }] },
          ]}
        >
          <View style={estilos.circuloInterno}>
            {activo && (
              <>
                <Text style={estilos.faseTitulo}>{faseDatos.etiqueta}</Text>
                <Text style={estilos.faseSegundos}>{segundosFase}</Text>
              </>
            )}
            {!activo && !listo && (
              <Text style={estilos.circuloTextoReposo}>Respira</Text>
            )}
            {listo && (
              <Text style={estilos.circuloTextoReposo}>Bien hecho</Text>
            )}
          </View>
        </Animated.View>

        {/* Ciclos */}
        {activo && (
          <Text style={estilos.textoCiclos}>
            Ciclo {ciclosCompletados + 1} de {ciclosObjetivo}
          </Text>
        )}
      </View>

      {/* Descripcion del metodo */}
      {!activo && !listo && (
        <View style={estilos.descripcion}>
          <Text style={estilos.descripcionTexto}>
            Inhala 4 segundos, sostente 7, exhala 8.{'\n'}
            Es uno de los metodos de calma mas efectivos.
          </Text>
        </View>
      )}

      {/* Mensaje final */}
      {listo && (
        <View style={estilos.descripcion}>
          <Text style={estilos.descripcionTexto}>
            Completaste {ciclosCompletados} ciclo{ciclosCompletados > 1 ? 's' : ''} de respiracion.{'\n'}
            Tu cuerpo esta mas tranquilo ahora.
          </Text>
        </View>
      )}

      {/* Boton principal */}
      <View style={estilos.pie}>
        {!activo && !listo && (
          <TouchableOpacity style={estilos.botonIniciar} onPress={iniciar}>
            <Text style={estilos.botonIniciarTexto}>Empezar</Text>
          </TouchableOpacity>
        )}

        {activo && (
          <TouchableOpacity style={estilos.botonDetener} onPress={detener}>
            <Text style={estilos.botonDetenerTexto}>Detener</Text>
          </TouchableOpacity>
        )}

        {listo && (
          <>
            <TouchableOpacity style={estilos.botonIniciar} onPress={iniciar}>
              <Text style={estilos.botonIniciarTexto}>Repetir</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={estilos.botonSecundario}
              onPress={() => navigation.navigate('HomeNino', { perfil })}
            >
              <Text style={estilos.botonSecundarioTexto}>Volver a mi refugio</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  )
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: COLORES.fondo },
  encabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ESPACIO.lg,
    paddingTop: ESPACIO.md,
    paddingBottom: ESPACIO.sm,
  },
  botonVolver: { fontSize: 15, color: COLORES.textoSecundario },
  titulo: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORES.textoPrimario,
  },
  selectorDuracion: { paddingHorizontal: ESPACIO.xl, paddingBottom: ESPACIO.lg },
  selectorTitulo: { fontSize: 13, color: COLORES.textoSuave, marginBottom: ESPACIO.sm },
  filaDuraciones: { flexDirection: 'row', gap: ESPACIO.sm },
  chipDuracion: {
    borderRadius: RADIO.capsula,
    paddingHorizontal: ESPACIO.md,
    paddingVertical: ESPACIO.xs + 2,
    borderWidth: 1.5,
    borderColor: COLORES.borde,
  },
  chipDuracionActivo: {
    backgroundColor: COLORES.madretierra,
    borderColor: COLORES.madretierra,
  },
  chipDuracionTexto: { fontSize: 13, color: COLORES.textoSecundario },
  chipDuracionTextoActivo: { color: COLORES.suertedados, fontWeight: '600' },
  centrado: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  circuloExterno: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circuloInterno: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: COLORES.fondo,
    justifyContent: 'center',
    alignItems: 'center',
  },
  faseTitulo: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORES.textoPrimario,
    marginBottom: 4,
  },
  faseSegundos: {
    fontSize: 44,
    fontWeight: '700',
    color: COLORES.textoPrimario,
  },
  circuloTextoReposo: {
    fontSize: 18,
    color: COLORES.textoSuave,
    fontFamily: 'CocoматPro-Regular',
  },
  textoCiclos: {
    fontSize: 13,
    color: COLORES.textoSuave,
    marginTop: ESPACIO.xl,
  },
  descripcion: {
    paddingHorizontal: ESPACIO.xl,
    paddingBottom: ESPACIO.lg,
  },
  descripcionTexto: {
    fontSize: 14,
    color: COLORES.textoSuave,
    lineHeight: 22,
    textAlign: 'center',
  },
  pie: {
    padding: ESPACIO.lg,
    paddingBottom: ESPACIO.xl,
    gap: ESPACIO.sm,
  },
  botonIniciar: {
    backgroundColor: COLORES.madretierra,
    borderRadius: RADIO.capsula,
    paddingVertical: ESPACIO.md,
    alignItems: 'center',
    ...SOMBRA_BOTON,
  },
  botonIniciarTexto: { color: COLORES.suertedados, fontSize: 15, fontWeight: '600' },
  botonDetener: {
    borderRadius: RADIO.capsula,
    paddingVertical: ESPACIO.md,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORES.madretierra,
  },
  botonDetenerTexto: { fontSize: 15, color: COLORES.madretierra },
  botonSecundario: { paddingVertical: ESPACIO.sm, alignItems: 'center' },
  botonSecundarioTexto: { fontSize: 14, color: COLORES.textoSuave },
})
