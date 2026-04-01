import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native'
import { COLORES, ESPACIO, RADIO, SOMBRA_CARD } from '../../constants/tema'
import ComponentePatron from '../../components/auth/ComponentePatron'
import { resetearPatronPorPadre, registrarEventoAuth } from '../../lib/auth'

type Paso = 'nuevo' | 'confirmar'

type Props = {
  childProfileId: string
  nombreNino: string
  onResetCompletado: () => void
  onCancelar: () => void
}

export default function PantallaResetPatron({
  childProfileId,
  nombreNino,
  onResetCompletado,
  onCancelar,
}: Props) {
  const [paso, setPaso] = useState<Paso>('nuevo')
  const [nuevoPatron, setNuevoPatron] = useState<number[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  function manejarNuevoPatron(secuencia: number[]) {
    setNuevoPatron(secuencia)
    setPaso('confirmar')
    setError(null)
  }

  async function manejarConfirmacion(secuencia: number[]) {
    if (!nuevoPatron) return
    if (secuencia.join('-') !== nuevoPatron.join('-')) {
      setError('Los patrones no coinciden. Empieza de nuevo.')
      setPaso('nuevo')
      setNuevoPatron(null)
      return
    }
    try {
      await registrarEventoAuth('child_pattern_reset_by_parent', 'parent', childProfileId)
      await resetearPatronPorPadre(childProfileId, secuencia)
      Alert.alert(
        'Listo',
        `El patrón de ${nombreNino} fue restablecido.`,
        [{ text: 'Continuar', onPress: onResetCompletado }]
      )
    } catch {
      setError('No pudimos restablecer el patrón. Intenta de nuevo.')
      setPaso('nuevo')
      setNuevoPatron(null)
    }
  }

  return (
    <View style={estilos.contenedor}>
      {/* Aviso de contexto */}
      <View style={estilos.aviso}>
        <Text style={estilos.avisoTexto}>
          Estás restableciendo el patrón de <Text style={estilos.avisionombre}>{nombreNino}</Text>
        </Text>
      </View>

      {paso === 'nuevo' ? (
        <ComponentePatron
          titulo="Crea un nuevo patrón"
          subtitulo="Mínimo 4 puntos. Compártelo con tu hijo después."
          onPatronCompleto={manejarNuevoPatron}
          error={error}
          modo="crear"
        />
      ) : (
        <ComponentePatron
          titulo="Confirma el nuevo patrón"
          subtitulo="Dibújalo exactamente igual"
          onPatronCompleto={manejarConfirmacion}
          error={error}
          modo="confirmar"
        />
      )}

      <TouchableOpacity onPress={onCancelar} style={estilos.botonCancelar}>
        <Text style={estilos.botonCancelarTexto}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  )
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: COLORES.fondo,
    alignItems: 'center',
    paddingTop: ESPACIO.xl,
    paddingHorizontal: ESPACIO.lg,
  },
  aviso: {
    backgroundColor: COLORES.arenaCalida,
    borderRadius: RADIO.md,
    paddingHorizontal: ESPACIO.md,
    paddingVertical: ESPACIO.sm + 2,
    marginBottom: ESPACIO.xl,
    alignSelf: 'stretch',
    ...SOMBRA_CARD,
  },
  avisoTexto: {
    fontSize: 14,
    color: COLORES.textoPrimario,
    textAlign: 'center',
    lineHeight: 20,
  },
  avisionombre: {
    fontWeight: '600',
  },
  botonCancelar: {
    marginTop: ESPACIO.lg,
    paddingHorizontal: ESPACIO.lg,
    paddingVertical: ESPACIO.sm + 2,
    borderRadius: RADIO.capsula,
    borderWidth: 1.5,
    borderColor: COLORES.borde,
  },
  botonCancelarTexto: {
    fontSize: 14,
    color: COLORES.textoSecundario,
  },
})
