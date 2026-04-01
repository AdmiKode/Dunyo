import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import { COLORES, ESPACIO, RADIO, SOMBRA_BOTON } from '../../constants/tema'
import ComponentePatron from '../../components/auth/ComponentePatron'
import { verificarPatronNino, registrarEventoAuth } from '../../lib/auth'

type Props = {
  childProfileId: string
  nombreNino: string
  onAccesoOtorgado: () => void
  onNecesitoAyuda: () => void
}

const MENSAJE_BLOQUEO = 'Demasiados intentos. Espera un momento o pide ayuda a un adulto.'
const MENSAJE_ERROR = 'Ese no es el patrón. Intenta de nuevo.'

export default function PantallaAccesoNino({
  childProfileId,
  nombreNino,
  onAccesoOtorgado,
  onNecesitoAyuda,
}: Props) {
  const [error, setError] = useState<string | null>(null)
  const [cargando, setCargando] = useState(false)

  async function manejarPatron(secuencia: number[]) {
    if (cargando) return
    setCargando(true)
    setError(null)
    try {
      const resultado = await verificarPatronNino(childProfileId, secuencia)
      if (resultado === 'ok') {
        await registrarEventoAuth('child_pattern_unlock_success', 'child', childProfileId)
        onAccesoOtorgado()
      } else if (resultado === 'bloqueado') {
        await registrarEventoAuth('child_pattern_unlock_failed', 'child', childProfileId, { motivo: 'bloqueado' })
        setError(MENSAJE_BLOQUEO)
      } else {
        await registrarEventoAuth('child_pattern_unlock_failed', 'child', childProfileId, { motivo: 'patron_incorrecto' })
        setError(MENSAJE_ERROR)
      }
    } catch {
      setError('Algo salió mal. Intenta de nuevo.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.saludo}>Hola, {nombreNino}</Text>

      <ComponentePatron
        titulo="Dibuja tu patrón para entrar"
        subtitulo="Tu espacio te está esperando"
        onPatronCompleto={manejarPatron}
        error={error}
        modo="verificar"
      />

      {/* Necesito ayuda */}
      <TouchableOpacity
        onPress={onNecesitoAyuda}
        style={estilos.botonAyuda}
        activeOpacity={0.7}
      >
        <Text style={estilos.botonAyudaTexto}>Necesito ayuda</Text>
      </TouchableOpacity>
    </View>
  )
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: COLORES.fondo,
    alignItems: 'center',
    paddingTop: ESPACIO.xxl,
    paddingHorizontal: ESPACIO.lg,
  },
  saludo: {
    fontSize: 26,
    color: COLORES.textoPrimario,
    fontFamily: 'CocomatPro',
    marginBottom: ESPACIO.xl,
    textAlign: 'center',
  },
  botonAyuda: {
    marginTop: ESPACIO.xl,
    paddingHorizontal: ESPACIO.lg,
    paddingVertical: ESPACIO.sm + 2,
    borderRadius: RADIO.capsula,
    borderWidth: 1.5,
    borderColor: COLORES.borde,
  },
  botonAyudaTexto: {
    fontSize: 14,
    color: COLORES.textoSecundario,
  },
})
