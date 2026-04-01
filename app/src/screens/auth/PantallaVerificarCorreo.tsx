import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { COLORES, ESPACIO, RADIO, SOMBRA_BOTON } from '../../constants/tema'

type Props = {
  route: any
  navigation: any
}

export default function PantallaVerificarCorreo({ route, navigation }: Props) {
  const email = route.params?.email ?? ''

  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.titulo}>Revisa tu correo</Text>
      <Text style={estilos.cuerpo}>
        Te enviamos un enlace de verificación{email ? ` a\n${email}` : ''}.{'\n\n'}
        Abre el correo y confirma tu cuenta para continuar.
      </Text>
      <TouchableOpacity
        style={estilos.boton}
        onPress={() => navigation.navigate('Login')}
        activeOpacity={0.85}
      >
        <Text style={estilos.botonTexto}>Ya verifiqué, ir al inicio</Text>
      </TouchableOpacity>
    </View>
  )
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: COLORES.fondo,
    alignItems: 'center',
    justifyContent: 'center',
    padding: ESPACIO.xl,
  },
  titulo: {
    fontSize: 26,
    color: COLORES.textoPrimario,
    fontFamily: 'CocomatPro',
    marginBottom: ESPACIO.md,
    textAlign: 'center',
  },
  cuerpo: {
    fontSize: 15,
    color: COLORES.textoSecundario,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: ESPACIO.xl,
  },
  boton: {
    backgroundColor: COLORES.madretierra,
    borderRadius: RADIO.capsula,
    paddingVertical: ESPACIO.md,
    paddingHorizontal: ESPACIO.xl,
    ...SOMBRA_BOTON,
  },
  botonTexto: {
    color: COLORES.suertedados,
    fontSize: 15,
    fontWeight: '600',
  },
})
