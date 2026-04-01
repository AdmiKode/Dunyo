import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native'
import { COLORES, ESPACIO, RADIO } from '../../constants/tema'
import ComponentePatron from '../../components/auth/ComponentePatron'
import { guardarPatronNino, registrarEventoAuth } from '../../lib/auth'

type Paso = 'crear' | 'confirmar'

type Props = {
  childProfileId: string
  onPatronGuardado: () => void
}

export default function PantallaSetupPatronNino({ childProfileId, onPatronGuardado }: Props) {
  const [paso, setPaso] = useState<Paso>('crear')
  const [primerPatron, setPrimerPatron] = useState<number[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [guardando, setGuardando] = useState(false)

  function manejarPrimerPatron(secuencia: number[]) {
    setPrimerPatron(secuencia)
    setPaso('confirmar')
    setError(null)
  }

  async function manejarConfirmacion(secuencia: number[]) {
    if (!primerPatron) return
    // Verificar que coincidan
    if (secuencia.join('-') !== primerPatron.join('-')) {
      setError('Los patrones no coinciden. Intenta de nuevo')
      setPaso('crear')
      setPrimerPatron(null)
      return
    }
    setGuardando(true)
    try {
      await registrarEventoAuth('child_pattern_setup_started', 'parent', childProfileId)
      await guardarPatronNino(childProfileId, secuencia)
      await registrarEventoAuth('child_pattern_setup_completed', 'parent', childProfileId)
      onPatronGuardado()
    } catch {
      setError('No pudimos guardar el patrón. Intenta de nuevo')
      setPaso('crear')
      setPrimerPatron(null)
    } finally {
      setGuardando(false)
    }
  }

  return (
    <ScrollView
      style={estilos.contenedor}
      contentContainerStyle={estilos.scroll}
      showsVerticalScrollIndicator={false}
    >
      {/* Indicador de pasos */}
      <View style={estilos.pasos}>
        <View style={[estilos.paso, paso === 'crear' && estilos.pasoActivo]} />
        <View style={[estilos.paso, paso === 'confirmar' && estilos.pasoActivo]} />
      </View>

      {paso === 'crear' ? (
        <>
          <Text style={estilos.encabezadoPequeno}>Este es tu espacio</Text>
          <ComponentePatron
            titulo="Haz tu patrón para entrar"
            subtitulo="Repítelo para que no se te olvide. Mínimo 4 puntos."
            onPatronCompleto={manejarPrimerPatron}
            error={error}
            modo="crear"
          />
        </>
      ) : (
        <>
          <Text style={estilos.encabezadoPequeno}>Confirma tu patrón</Text>
          <ComponentePatron
            titulo="Dibújalo de nuevo"
            subtitulo="Exactamente igual que antes"
            onPatronCompleto={manejarConfirmacion}
            error={error}
            modo="confirmar"
          />
        </>
      )}

      <Text style={estilos.notaPrivacidad}>
        Si no lo recuerdas, un adulto puede ayudarte a restablecerlo.
      </Text>
    </ScrollView>
  )
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: COLORES.fondo,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: ESPACIO.lg,
    paddingTop: ESPACIO.xl,
    paddingBottom: ESPACIO.xl,
    alignItems: 'center',
  },
  pasos: {
    flexDirection: 'row',
    gap: ESPACIO.sm,
    marginBottom: ESPACIO.xl,
  },
  paso: {
    width: 32,
    height: 4,
    borderRadius: RADIO.capsula,
    backgroundColor: COLORES.borde,
  },
  pasoActivo: {
    backgroundColor: COLORES.madretierra,
  },
  encabezadoPequeno: {
    fontSize: 13,
    color: COLORES.textoSuave,
    marginBottom: ESPACIO.sm,
    textAlign: 'center',
  },
  notaPrivacidad: {
    fontSize: 12,
    color: COLORES.textoSuave,
    textAlign: 'center',
    marginTop: ESPACIO.lg,
    paddingHorizontal: ESPACIO.md,
    lineHeight: 18,
  },
})
