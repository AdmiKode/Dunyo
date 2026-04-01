import React, { useState, useCallback } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native'
import { COLORES, ESPACIO, RADIO, SOMBRA_BOTON } from '../../constants/tema'

// Cuadrícula de 3x3, los puntos se identifican por índice 0-8
const NUM_PUNTOS = 9
const CUADRICULA = 3
const MIN_PUNTOS = 4

type Props = {
  titulo?: string
  subtitulo?: string
  onPatronCompleto: (secuencia: number[]) => void
  error?: string | null
  modo?: 'crear' | 'confirmar' | 'verificar'
}

export default function ComponentePatron({
  titulo = 'Dibuja tu patrón',
  subtitulo = 'Conecta al menos 4 puntos',
  onPatronCompleto,
  error,
  modo = 'verificar',
}: Props) {
  const [secuenciaActual, setSecuenciaActual] = useState<number[]>([])
  const [completado, setCompletado] = useState(false)

  const agregarPunto = useCallback((indice: number) => {
    if (completado) return
    setSecuenciaActual(prev => {
      if (prev.includes(indice)) return prev
      return [...prev, indice]
    })
  }, [completado])

  const confirmarPatron = useCallback(() => {
    if (secuenciaActual.length < MIN_PUNTOS) return
    setCompletado(true)
    onPatronCompleto(secuenciaActual)
    setTimeout(() => {
      setSecuenciaActual([])
      setCompletado(false)
    }, 600)
  }, [secuenciaActual, onPatronCompleto])

  function limpiar() {
    setSecuenciaActual([])
    setCompletado(false)
  }

  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.titulo}>{titulo}</Text>
      <Text style={estilos.subtitulo}>{subtitulo}</Text>

      {/* Cuadrícula de puntos */}
      <View style={estilos.cuadricula}>
        {Array.from({ length: NUM_PUNTOS }).map((_, i) => {
          const seleccionado = secuenciaActual.includes(i)
          const orden = secuenciaActual.indexOf(i) + 1
          return (
            <TouchableOpacity
              key={i}
              style={[estilos.puntoContenedor]}
              onPress={() => agregarPunto(i)}
              activeOpacity={0.7}
            >
              <View style={[
                estilos.punto,
                seleccionado && estilos.puntoSeleccionado,
              ]}>
                {seleccionado && (
                  <Text style={estilos.puntoOrden}>{orden}</Text>
                )}
              </View>
            </TouchableOpacity>
          )
        })}
      </View>

      {/* Error */}
      {error ? (
        <Text style={estilos.textoError}>{error}</Text>
      ) : null}

      {/* Progreso */}
      <Text style={estilos.progreso}>
        {secuenciaActual.length === 0
          ? 'Toca los puntos para dibujar tu patrón'
          : `${secuenciaActual.length} punto${secuenciaActual.length > 1 ? 's' : ''} seleccionado${secuenciaActual.length > 1 ? 's' : ''}`
        }
      </Text>

      {/* Acciones */}
      <View style={estilos.acciones}>
        {secuenciaActual.length > 0 && (
          <TouchableOpacity onPress={limpiar} style={estilos.botonLimpiar}>
            <Text style={estilos.botonLimpiarTexto}>Limpiar</Text>
          </TouchableOpacity>
        )}
        {secuenciaActual.length >= MIN_PUNTOS && (
          <TouchableOpacity
            style={estilos.botonConfirmar}
            onPress={confirmarPatron}
            activeOpacity={0.85}
          >
            <Text style={estilos.botonConfirmarTexto}>
              {modo === 'crear' ? 'Guardar patrón' : modo === 'confirmar' ? 'Confirmar' : 'Entrar'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

const TAMANO_PUNTO = 52

const estilos = StyleSheet.create({
  contenedor: {
    alignItems: 'center',
    paddingVertical: ESPACIO.lg,
  },
  titulo: {
    fontSize: 22,
    color: COLORES.textoPrimario,
    fontFamily: 'CocomatPro',
    marginBottom: ESPACIO.xs,
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 14,
    color: COLORES.textoSecundario,
    marginBottom: ESPACIO.xl,
    textAlign: 'center',
  },
  cuadricula: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: TAMANO_PUNTO * CUADRICULA + ESPACIO.lg * (CUADRICULA - 1),
    gap: ESPACIO.lg,
    marginBottom: ESPACIO.lg,
  },
  puntoContenedor: {
    width: TAMANO_PUNTO,
    height: TAMANO_PUNTO,
    alignItems: 'center',
    justifyContent: 'center',
  },
  punto: {
    width: TAMANO_PUNTO,
    height: TAMANO_PUNTO,
    borderRadius: TAMANO_PUNTO / 2,
    backgroundColor: COLORES.suertedados,
    borderWidth: 2,
    borderColor: COLORES.borde,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORES.madretierra,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  puntoSeleccionado: {
    backgroundColor: COLORES.madretierra,
    borderColor: COLORES.madretierra,
    shadowOpacity: 0.25,
    elevation: 6,
  },
  puntoOrden: {
    color: COLORES.suertedados,
    fontSize: 14,
    fontWeight: '600',
  },
  textoError: {
    fontSize: 13,
    color: COLORES.error,
    marginBottom: ESPACIO.sm,
    textAlign: 'center',
  },
  progreso: {
    fontSize: 13,
    color: COLORES.textoSuave,
    marginBottom: ESPACIO.lg,
    textAlign: 'center',
  },
  acciones: {
    flexDirection: 'row',
    gap: ESPACIO.md,
    alignItems: 'center',
  },
  botonLimpiar: {
    paddingHorizontal: ESPACIO.lg,
    paddingVertical: ESPACIO.sm + 2,
    borderRadius: RADIO.capsula,
    borderWidth: 1.5,
    borderColor: COLORES.borde,
  },
  botonLimpiarTexto: {
    fontSize: 14,
    color: COLORES.textoSecundario,
  },
  botonConfirmar: {
    backgroundColor: COLORES.madretierra,
    paddingHorizontal: ESPACIO.xl,
    paddingVertical: ESPACIO.sm + 2,
    borderRadius: RADIO.capsula,
    ...SOMBRA_BOTON,
  },
  botonConfirmarTexto: {
    fontSize: 14,
    color: COLORES.suertedados,
    fontWeight: '600',
  },
})
