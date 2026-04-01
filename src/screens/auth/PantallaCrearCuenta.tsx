import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { COLORES, ESPACIO, RADIO, SOMBRA_CARD, SOMBRA_BOTON } from '../../constants/tema'
import { registrarPadre, registrarEventoAuth } from '../../lib/auth'

type Props = {
  onRegistrado: () => void
  onIrALogin: () => void
}

const CONTRASENA_MINIMA = 8

function validarContrasena(c: string): string | null {
  if (c.length < CONTRASENA_MINIMA) return `Mínimo ${CONTRASENA_MINIMA} caracteres`
  if (!/[A-Z]/.test(c)) return 'Debe incluir al menos una mayúscula'
  if (!/[0-9]/.test(c)) return 'Debe incluir al menos un número'
  return null
}

export default function PantallaCrearCuenta({ onRegistrado, onIrALogin }: Props) {
  const [email, setEmail] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [aceptaTerminos, setAceptaTerminos] = useState(false)
  const [cargando, setCargando] = useState(false)
  const [errores, setErrores] = useState<Record<string, string>>({})

  function validarFormulario(): boolean {
    const nuevosErrores: Record<string, string> = {}
    if (!email.includes('@')) nuevosErrores.email = 'Correo no válido'
    const errContrasena = validarContrasena(contrasena)
    if (errContrasena) nuevosErrores.contrasena = errContrasena
    if (contrasena !== confirmar) nuevosErrores.confirmar = 'Las contraseñas no coinciden'
    if (!aceptaTerminos) nuevosErrores.terminos = 'Debes aceptar los términos'
    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  async function manejarRegistro() {
    if (!validarFormulario()) return
    setCargando(true)
    try {
      await registrarEventoAuth('parent_signup_started', 'parent')
      await registrarPadre(email, contrasena)
      await registrarEventoAuth('parent_signup_completed', 'parent')
      onRegistrado()
    } catch (error: any) {
      Alert.alert(
        'No pudimos crear tu cuenta',
        error?.message ?? 'Intenta de nuevo en un momento'
      )
    } finally {
      setCargando(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={estilos.contenedor}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={estilos.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={estilos.titulo}>Crea tu cuenta</Text>
        <Text style={estilos.subtitulo}>
          Tu panel protegido con contraseña.{'\n'}Solo tú puedes ver los reportes y configurar todo.
        </Text>

        {/* Email */}
        <View style={estilos.campoContenedor}>
          <Text style={estilos.etiqueta}>Correo electrónico</Text>
          <View style={[estilos.campo, errores.email ? estilos.campoError : null]}>
            <TextInput
              style={estilos.input}
              value={email}
              onChangeText={setEmail}
              placeholder="tu@correo.com"
              placeholderTextColor={COLORES.textoSuave}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          {errores.email ? <Text style={estilos.textoError}>{errores.email}</Text> : null}
        </View>

        {/* Contraseña */}
        <View style={estilos.campoContenedor}>
          <Text style={estilos.etiqueta}>Contraseña</Text>
          <View style={[estilos.campo, errores.contrasena ? estilos.campoError : null]}>
            <TextInput
              style={estilos.input}
              value={contrasena}
              onChangeText={setContrasena}
              placeholder="Mínimo 8 caracteres, 1 mayúscula, 1 número"
              placeholderTextColor={COLORES.textoSuave}
              secureTextEntry
            />
          </View>
          {errores.contrasena ? <Text style={estilos.textoError}>{errores.contrasena}</Text> : null}
        </View>

        {/* Confirmar contraseña */}
        <View style={estilos.campoContenedor}>
          <Text style={estilos.etiqueta}>Confirmar contraseña</Text>
          <View style={[estilos.campo, errores.confirmar ? estilos.campoError : null]}>
            <TextInput
              style={estilos.input}
              value={confirmar}
              onChangeText={setConfirmar}
              placeholder="Repite tu contraseña"
              placeholderTextColor={COLORES.textoSuave}
              secureTextEntry
            />
          </View>
          {errores.confirmar ? <Text style={estilos.textoError}>{errores.confirmar}</Text> : null}
        </View>

        {/* Términos */}
        <TouchableOpacity
          style={estilos.terminosContenedor}
          onPress={() => setAceptaTerminos(!aceptaTerminos)}
          activeOpacity={0.7}
        >
          <View style={[estilos.checkbox, aceptaTerminos && estilos.checkboxActivo]} />
          <Text style={estilos.terminosTexto}>
            Acepto los{' '}
            <Text style={estilos.enlace}>términos de uso</Text>
            {' '}y la{' '}
            <Text style={estilos.enlace}>política de privacidad</Text>
          </Text>
        </TouchableOpacity>
        {errores.terminos ? <Text style={estilos.textoError}>{errores.terminos}</Text> : null}

        {/* Botón principal */}
        <TouchableOpacity
          style={[estilos.boton, cargando && estilos.botonDesactivado]}
          onPress={manejarRegistro}
          disabled={cargando}
          activeOpacity={0.85}
        >
          {cargando
            ? <ActivityIndicator color={COLORES.suertedados} />
            : <Text style={estilos.botonTexto}>Crear cuenta</Text>
          }
        </TouchableOpacity>

        {/* Ir a login */}
        <TouchableOpacity onPress={onIrALogin} style={estilos.enlaceContenedor}>
          <Text style={estilos.enlaceTexto}>
            ¿Ya tienes cuenta? <Text style={estilos.enlace}>Inicia sesión</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
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
    paddingTop: ESPACIO.xxl,
    paddingBottom: ESPACIO.xl,
  },
  titulo: {
    fontSize: 28,
    color: COLORES.textoPrimario,
    fontFamily: 'CocoматPro-Regular',
    marginBottom: ESPACIO.sm,
  },
  subtitulo: {
    fontSize: 15,
    color: COLORES.textoSecundario,
    lineHeight: 22,
    marginBottom: ESPACIO.xl,
  },
  campoContenedor: {
    marginBottom: ESPACIO.md,
  },
  etiqueta: {
    fontSize: 13,
    color: COLORES.textoSecundario,
    marginBottom: ESPACIO.xs,
    fontWeight: '500',
  },
  campo: {
    backgroundColor: COLORES.suertedados,
    borderRadius: RADIO.md,
    paddingHorizontal: ESPACIO.md,
    paddingVertical: ESPACIO.sm + 2,
    ...SOMBRA_CARD,
  },
  campoError: {
    borderWidth: 1,
    borderColor: COLORES.error,
  },
  input: {
    fontSize: 15,
    color: COLORES.textoPrimario,
    padding: 0,
  },
  textoError: {
    fontSize: 12,
    color: COLORES.error,
    marginTop: ESPACIO.xs,
  },
  terminosContenedor: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: ESPACIO.sm,
    gap: ESPACIO.sm,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: RADIO.xs,
    borderWidth: 1.5,
    borderColor: COLORES.borde,
    marginTop: 2,
    backgroundColor: COLORES.suertedados,
  },
  checkboxActivo: {
    backgroundColor: COLORES.madretierra,
    borderColor: COLORES.madretierra,
  },
  terminosTexto: {
    flex: 1,
    fontSize: 13,
    color: COLORES.textoSecundario,
    lineHeight: 20,
  },
  enlace: {
    color: COLORES.madretierra,
    fontWeight: '600',
  },
  boton: {
    backgroundColor: COLORES.madretierra,
    borderRadius: RADIO.capsula,
    paddingVertical: ESPACIO.md,
    alignItems: 'center',
    marginTop: ESPACIO.md,
    ...SOMBRA_BOTON,
  },
  botonDesactivado: {
    opacity: 0.6,
  },
  botonTexto: {
    color: COLORES.suertedados,
    fontSize: 16,
    fontWeight: '600',
  },
  enlaceContenedor: {
    alignItems: 'center',
    marginTop: ESPACIO.lg,
  },
  enlaceTexto: {
    fontSize: 14,
    color: COLORES.textoSecundario,
  },
})
