import React from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image,
} from 'react-native'
import { COLORES, ESPACIO, RADIO, SOMBRA_BOTON } from '../../constants/tema'

export default function PantallaOnboardingPadre({ navigation }: any) {
  return (
    <SafeAreaView style={estilos.contenedor}>
      <View style={estilos.cuerpo}>
        {/* Logotipo completo */}
        <Image
          source={require('../../../assets/logo_dunyo.png')}
          style={estilos.logo}
          resizeMode="contain"
        />

        <Text style={estilos.titulo}>Un refugio emocional{'\n'}para tu hijo</Text>

        <Text style={estilos.subtitulo}>
          DUNYO acompaña a tu hijo a entender y expresar lo que siente,
          de forma segura y privada. Solo tú y él tienen acceso.
        </Text>

        <View style={estilos.separador} />

        <View style={estilos.listaCaracteristicas}>
          {CARACTERISTICAS.map((c, i) => (
            <View key={i} style={estilos.fila}>
              <View style={estilos.punto} />
              <Text style={estilos.filaTexto}>{c}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={estilos.pie}>
        <TouchableOpacity
          style={estilos.botonPrincipal}
          onPress={() => navigation.navigate('CrearHijo')}
          activeOpacity={0.85}
        >
          <Text style={estilos.botonPrincipalTexto}>Agregar a mi hijo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('HomePadre')}
          style={estilos.botonSecundario}
          activeOpacity={0.7}
        >
          <Text style={estilos.botonSecundarioTexto}>Omitir por ahora</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const CARACTERISTICAS = [
  'Sin anuncios, sin rastreo externo',
  'El niño accede con su propio patrón secreto',
  'Tú decides qué información compartes',
  'Diseñado con psicólogos infantiles',
]

const estilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: COLORES.fondo },
  cuerpo: {
    flex: 1,
    paddingHorizontal: ESPACIO.xl,
    paddingTop: ESPACIO.xxl,
    justifyContent: 'center',
  },
  logo: {
    width: 180,
    height: 140,
    marginBottom: ESPACIO.lg,
    alignSelf: 'center',
  },
  titulo: {
    fontSize: 32,
    color: COLORES.textoPrimario,
    fontFamily: 'CocomatPro',
    lineHeight: 40,
    marginBottom: ESPACIO.lg,
  },
  subtitulo: {
    fontSize: 15,
    color: COLORES.textoSecundario,
    lineHeight: 24,
    marginBottom: ESPACIO.lg,
  },
  separador: {
    height: 1.5,
    backgroundColor: COLORES.borde,
    marginBottom: ESPACIO.lg,
  },
  listaCaracteristicas: { gap: ESPACIO.sm },
  fila: { flexDirection: 'row', alignItems: 'center', gap: ESPACIO.sm },
  punto: {
    width: 7,
    height: 7,
    borderRadius: 99,
    backgroundColor: COLORES.madretierra,
  },
  filaTexto: { fontSize: 14, color: COLORES.textoSecundario },
  pie: {
    paddingHorizontal: ESPACIO.xl,
    paddingBottom: ESPACIO.xl,
    gap: ESPACIO.sm,
  },
  botonPrincipal: {
    backgroundColor: COLORES.madretierra,
    borderRadius: RADIO.capsula,
    paddingVertical: ESPACIO.md,
    alignItems: 'center',
    ...SOMBRA_BOTON,
  },
  botonPrincipalTexto: {
    color: COLORES.suertedados,
    fontSize: 15,
    fontWeight: '600',
  },
  botonSecundario: {
    paddingVertical: ESPACIO.sm,
    alignItems: 'center',
  },
  botonSecundarioTexto: {
    fontSize: 14,
    color: COLORES.textoSuave,
  },
})
