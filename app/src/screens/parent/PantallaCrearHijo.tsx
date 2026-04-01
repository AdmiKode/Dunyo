import React, { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, SafeAreaView, ActivityIndicator, Alert,
} from 'react-native'
import { COLORES, ESPACIO, RADIO, SOMBRA_BOTON, SOMBRA_CARD } from '../../constants/tema'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../store/AuthContext'

type CompanionType = 'dog' | 'cat'

export default function PantallaCrearHijo({ navigation }: any) {
  const { padre, recargarPerfiles } = useAuth()
  const [nombre, setNombre] = useState('')
  const [edad, setEdad] = useState<number | null>(null)
  const [companion, setCompanion] = useState<CompanionType>('dog')
  const [cargando, setCargando] = useState(false)

  function edadValida() {
    return edad !== null && edad >= 6 && edad <= 14
  }

  function nombreValido() {
    return nombre.trim().length >= 2 && nombre.trim().length <= 30
  }

  function puedeEnviar() {
    return nombreValido() && edadValida() && !cargando
  }

  async function manejarCrear() {
    if (!puedeEnviar() || !padre) return

    setCargando(true)
    try {
      const { data, error } = await supabase
        .from('child_profiles')
        .insert({
          parent_user_id: padre.id,
          nombre_display: nombre.trim(),
          edad,
          rango_edad: edad! <= 9 ? '6-9' : edad! <= 12 ? '10-12' : '13-14',
          companion_type: companion,
          profile_state: 'active',
          onboarding_completed: false,
          access_mode: 'pattern',
          pattern_enabled: true,
        })
        .select()
        .single()

      if (error) throw error

      await recargarPerfiles()

      // El niño configurará su propio patrón la primera vez que entre al refugio
      navigation.navigate('HomePadre')
    } catch (err: any) {
      Alert.alert('No se pudo crear el perfil', err.message ?? 'Intenta de nuevo.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <SafeAreaView style={estilos.contenedor}>
      <ScrollView
        contentContainerStyle={estilos.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Encabezado */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={estilos.botonVolver}>
          <Text style={estilos.botonVolverTexto}>Volver</Text>
        </TouchableOpacity>

        <Text style={estilos.titulo}>Crear perfil{'\n'}de tu hijo</Text>
        <Text style={estilos.subtitulo}>
          Tu hijo verá este nombre en su refugio.
        </Text>

        {/* Nombre */}
        <Text style={estilos.etiqueta}>Nombre o apodo</Text>
        <TextInput
          style={[estilos.input, !nombreValido() && nombre.length > 0 && estilos.inputError]}
          placeholder="Ej. Luna, Mateo, Peque..."
          placeholderTextColor={COLORES.textoSuave}
          value={nombre}
          onChangeText={setNombre}
          maxLength={30}
          autoCapitalize="words"
          returnKeyType="done"
        />
        {!nombreValido() && nombre.length > 0 && (
          <Text style={estilos.textoError}>Mínimo 2 caracteres, máximo 30.</Text>
        )}

        {/* Edad */}
        <Text style={estilos.etiqueta}>Edad</Text>
        <View style={estilos.filaEdades}>
          {EDADES.map(e => (
            <TouchableOpacity
              key={e}
              style={[estilos.chipEdad, edad === e && estilos.chipEdadActivo]}
              onPress={() => setEdad(e)}
              activeOpacity={0.8}
            >
              <Text style={[estilos.chipEdadTexto, edad === e && estilos.chipEdadTextoActivo]}>
                {e}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Companero */}
        <Text style={estilos.etiqueta}>Companero de aventuras</Text>
        <View style={estilos.filaCompanero}>
          {COMPANEROS.map(({ tipo, etiqueta, descripcion }) => (
            <TouchableOpacity
              key={tipo}
              style={[estilos.tarjetaCompanero, companion === tipo && estilos.tarjetaCompaneroActiva]}
              onPress={() => setCompanion(tipo)}
              activeOpacity={0.82}
            >
              <Text style={[estilos.companeroEtiqueta, companion === tipo && estilos.companeroEtiquetaActiva]}>
                {etiqueta}
              </Text>
              <Text style={estilos.companeroDescripcion}>{descripcion}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Botón continuar */}
      <View style={estilos.pie}>
        <TouchableOpacity
          style={[estilos.botonContinuar, !puedeEnviar() && estilos.botonContinuarDesactivado]}
          onPress={manejarCrear}
          disabled={!puedeEnviar()}
          activeOpacity={0.85}
        >
          {cargando
            ? <ActivityIndicator color={COLORES.suertedados} />
            : <Text style={estilos.botonContinuarTexto}>Crear perfil y configurar acceso</Text>
          }
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const EDADES = [6, 7, 8, 9, 10, 11, 12, 13, 14]
const COMPANEROS: { tipo: CompanionType; etiqueta: string; descripcion: string }[] = [
  { tipo: 'dog', etiqueta: 'Perro', descripcion: 'Leal, energico, siempre contigo' },
  { tipo: 'cat', etiqueta: 'Gato', descripcion: 'Curioso, tranquilo, misterioso' },
]

const estilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: COLORES.fondo },
  scroll: { padding: ESPACIO.lg, paddingTop: ESPACIO.sm },
  botonVolver: { paddingVertical: ESPACIO.sm, marginBottom: ESPACIO.sm },
  botonVolverTexto: { fontSize: 15, color: COLORES.textoSecundario },
  titulo: {
    fontSize: 28,
    color: COLORES.textoPrimario,
    fontFamily: 'CocomatPro',
    lineHeight: 36,
    marginBottom: ESPACIO.sm,
  },
  subtitulo: { fontSize: 14, color: COLORES.textoSuave, marginBottom: ESPACIO.xl },
  etiqueta: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORES.textoSecundario,
    marginBottom: ESPACIO.sm,
    marginTop: ESPACIO.md,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  input: {
    backgroundColor: COLORES.superficie,
    borderRadius: RADIO.md,
    paddingHorizontal: ESPACIO.md,
    paddingVertical: ESPACIO.md,
    fontSize: 16,
    color: COLORES.textoPrimario,
    borderWidth: 1.5,
    borderColor: COLORES.borde,
  },
  inputError: { borderColor: COLORES.error },
  textoError: { fontSize: 12, color: COLORES.error, marginTop: 4 },
  filaEdades: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ESPACIO.sm,
  },
  chipEdad: {
    paddingHorizontal: ESPACIO.md,
    paddingVertical: ESPACIO.xs + 2,
    borderRadius: RADIO.capsula,
    borderWidth: 1.5,
    borderColor: COLORES.borde,
    backgroundColor: COLORES.superficie,
  },
  chipEdadActivo: {
    backgroundColor: COLORES.madretierra,
    borderColor: COLORES.madretierra,
  },
  chipEdadTexto: { fontSize: 14, color: COLORES.textoSecundario },
  chipEdadTextoActivo: { color: COLORES.suertedados, fontWeight: '600' },
  filaCompanero: { flexDirection: 'row', gap: ESPACIO.md },
  tarjetaCompanero: {
    flex: 1,
    backgroundColor: COLORES.superficie,
    borderRadius: RADIO.lg,
    padding: ESPACIO.md,
    borderWidth: 2,
    borderColor: COLORES.borde,
    ...SOMBRA_CARD,
  },
  tarjetaCompaneroActiva: {
    borderColor: COLORES.madretierra,
    backgroundColor: COLORES.arenaCalida,
  },
  companeroEtiqueta: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORES.textoSecundario,
    marginBottom: 4,
  },
  companeroEtiquetaActiva: { color: COLORES.textoPrimario },
  companeroDescripcion: { fontSize: 12, color: COLORES.textoSuave, lineHeight: 18 },
  pie: { padding: ESPACIO.lg, paddingBottom: ESPACIO.xl },
  botonContinuar: {
    backgroundColor: COLORES.madretierra,
    borderRadius: RADIO.capsula,
    paddingVertical: ESPACIO.md,
    alignItems: 'center',
    ...SOMBRA_BOTON,
  },
  botonContinuarDesactivado: { opacity: 0.4 },
  botonContinuarTexto: {
    color: COLORES.suertedados,
    fontSize: 15,
    fontWeight: '600',
  },
})
