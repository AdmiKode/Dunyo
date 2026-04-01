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
  Image,
} from 'react-native'
import { COLORES, ESPACIO, RADIO, SOMBRA_CARD, SOMBRA_BOTON } from '../../constants/tema'
import { loginPadre, solicitarResetContrasena, registrarEventoAuth } from '../../lib/auth'

type Props = {
  onLoginExitoso: () => void
  onIrARegistro: () => void
}

export default function PantallaLoginPadre({ onLoginExitoso, onIrARegistro }: Props) {
  const [email, setEmail] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [cargando, setCargando] = useState(false)
  const [errores, setErrores] = useState<Record<string, string>>({})

  function validar(): boolean {
    const e: Record<string, string> = {}
    if (!email.includes('@')) e.email = 'Correo no válido'
    if (!contrasena) e.contrasena = 'Ingresa tu contraseña'
    setErrores(e)
    return Object.keys(e).length === 0
  }

  async function manejarLogin() {
    if (!validar()) return
    setCargando(true)
    try {
      await loginPadre(email, contrasena)
      await registrarEventoAuth('parent_login_success', 'parent')
      onLoginExitoso()
    } catch (error: any) {
      Alert.alert('No pudimos iniciar sesión', 'Revisa tu correo y contraseña')
    } finally {
      setCargando(false)
    }
  }

  async function manejarOlvideContrasena() {
    if (!email.includes('@')) {
      Alert.alert('Ingresa tu correo primero')
      return
    }
    try {
      await solicitarResetContrasena(email)
      await registrarEventoAuth('parent_password_reset_started', 'parent')
      Alert.alert(
        'Revisa tu correo',
        `Te enviamos un enlace para restablecer tu contraseña a ${email}`
      )
    } catch {
      Alert.alert('Error', 'No pudimos enviarte el correo. Intenta de nuevo.')
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
        <Image
          source={require('../../../assets/letrero_dunyo.png')}
          style={estilos.letrero}
          resizeMode="contain"
        />
        <Text style={estilos.titulo}>Bienvenido</Text>
        <Text style={estilos.subtitulo}>
          Protege tu panel con tu contraseña.{'\n'}Solo tú puedes ver reportes y configurar todo.
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
              placeholder="Tu contraseña"
              placeholderTextColor={COLORES.textoSuave}
              secureTextEntry
            />
          </View>
          {errores.contrasena ? <Text style={estilos.textoError}>{errores.contrasena}</Text> : null}
        </View>

        {/* Olvidé mi contraseña */}
        <TouchableOpacity onPress={manejarOlvideContrasena} style={estilos.olvideLinkContenedor}>
          <Text style={estilos.olvideLinkTexto}>Olvidé mi contraseña</Text>
        </TouchableOpacity>

        {/* Botón principal */}
        <TouchableOpacity
          style={[estilos.boton, cargando && estilos.botonDesactivado]}
          onPress={manejarLogin}
          disabled={cargando}
          activeOpacity={0.85}
        >
          {cargando
            ? <ActivityIndicator color={COLORES.suertedados} />
            : <Text style={estilos.botonTexto}>Entrar</Text>
          }
        </TouchableOpacity>

        {/* Ir a registro */}
        <TouchableOpacity onPress={onIrARegistro} style={estilos.enlaceContenedor}>
          <Text style={estilos.enlaceTexto}>
            ¿No tienes cuenta? <Text style={estilos.enlace}>Regístrate</Text>
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
    fontFamily: 'CocomatPro',
    marginBottom: ESPACIO.sm,
  },
  letrero: {
    width: 160,
    height: 52,
    marginBottom: ESPACIO.lg,
    alignSelf: 'flex-start',
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
  olvideLinkContenedor: {
    alignSelf: 'flex-end',
    marginBottom: ESPACIO.lg,
  },
  olvideLinkTexto: {
    fontSize: 13,
    color: COLORES.madretierra,
  },
  boton: {
    backgroundColor: COLORES.madretierra,
    borderRadius: RADIO.capsula,
    paddingVertical: ESPACIO.md,
    alignItems: 'center',
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
  enlace: {
    color: COLORES.madretierra,
    fontWeight: '600',
  },
})
