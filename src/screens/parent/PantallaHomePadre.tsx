import React from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert,
} from 'react-native'
import { COLORES, ESPACIO, RADIO, SOMBRA_CARD, SOMBRA_BOTON } from '../../constants/tema'
import { useAuth } from '../../store/AuthContext'

export default function PantallaHomePadre({ navigation }: any) {
  const { perfilesHijos, padre, cerrarSesionPadre, activarNino, recargarPerfiles } = useAuth()

  const sinHijos = perfilesHijos.length === 0

  function manejarEntrarComoNino(perfil: any) {
    if (!perfil.pattern_hash) {
      // Niño sin patrón configurado
      navigation.navigate('SetupPatron', {
        childProfileId: perfil.id,
        nombreNino: perfil.nombre_display,
      })
      return
    }
    activarNino(perfil)
  }

  async function manejarCerrarSesion() {
    Alert.alert('Cerrar sesión', '¿Seguro que quieres salir?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Salir', style: 'destructive', onPress: cerrarSesionPadre },
    ])
  }

  return (
    <ScrollView style={estilos.contenedor} contentContainerStyle={estilos.scroll} showsVerticalScrollIndicator={false}>
      {/* Encabezado */}
      <View style={estilos.encabezado}>
        <View>
          <Text style={estilos.saludo}>Hola</Text>
          <Text style={estilos.email}>{padre?.email ?? ''}</Text>
        </View>
        <TouchableOpacity onPress={manejarCerrarSesion} style={estilos.botonSalir}>
          <Text style={estilos.botonSalirTexto}>Salir</Text>
        </TouchableOpacity>
      </View>

      {/* Hijos */}
      <Text style={estilos.seccionTitulo}>
        {sinHijos ? 'Agrega a tu hijo para comenzar' : 'Tus hijos'}
      </Text>

      {perfilesHijos.map(perfil => (
        <TouchableOpacity
          key={perfil.id}
          style={estilos.tarjetaHijo}
          onPress={() => manejarEntrarComoNino(perfil)}
          activeOpacity={0.82}
        >
          <View style={estilos.tarjetaHijoInfo}>
            <Text style={estilos.nombreHijo}>{perfil.nombre_display}</Text>
            <Text style={estilos.edadHijo}>{perfil.edad ? `${perfil.edad} años` : ''}</Text>
          </View>
          <View style={estilos.tarjetaHijoAccion}>
            <Text style={estilos.tarjetaHijoAccionTexto}>
              {perfil.pattern_hash ? 'Entrar al refugio' : 'Configurar patrón'}
            </Text>
          </View>
        </TouchableOpacity>
      ))}

      {/* Agregar hijo */}
      <TouchableOpacity
        style={estilos.botonAgregar}
        onPress={() => navigation.navigate('CrearHijo')}
        activeOpacity={0.85}
      >
        <Text style={estilos.botonAgregarTexto}>
          {sinHijos ? 'Agregar a mi hijo' : '+ Agregar otro hijo'}
        </Text>
      </TouchableOpacity>

      {/* Placeholder panel parental — Fase 3 */}
      {!sinHijos && (
        <View style={estilos.panelPlaceholder}>
          <Text style={estilos.panelPlaceholderTexto}>
            El panel de tendencias y reportes se construye en Fase 3.
          </Text>
        </View>
      )}
    </ScrollView>
  )
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: COLORES.fondo },
  scroll: { padding: ESPACIO.lg, paddingTop: ESPACIO.xxl },
  encabezado: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: ESPACIO.xl,
  },
  saludo: {
    fontSize: 26,
    color: COLORES.textoPrimario,
    fontFamily: 'CocoматPro-Regular',
  },
  email: {
    fontSize: 13,
    color: COLORES.textoSuave,
    marginTop: 2,
  },
  botonSalir: {
    paddingHorizontal: ESPACIO.md,
    paddingVertical: ESPACIO.xs + 2,
    borderRadius: RADIO.capsula,
    borderWidth: 1.5,
    borderColor: COLORES.borde,
  },
  botonSalirTexto: {
    fontSize: 13,
    color: COLORES.textoSecundario,
  },
  seccionTitulo: {
    fontSize: 16,
    color: COLORES.textoPrimario,
    fontWeight: '600',
    marginBottom: ESPACIO.md,
  },
  tarjetaHijo: {
    backgroundColor: COLORES.suertedados,
    borderRadius: RADIO.lg,
    padding: ESPACIO.md,
    marginBottom: ESPACIO.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...SOMBRA_CARD,
  },
  tarjetaHijoInfo: { gap: 4 },
  nombreHijo: {
    fontSize: 17,
    color: COLORES.textoPrimario,
    fontFamily: 'CocomatPro-Regular',
  },
  edadHijo: {
    fontSize: 13,
    color: COLORES.textoSuave,
  },
  tarjetaHijoAccion: {
    backgroundColor: COLORES.madretierraAlpha,
    borderRadius: RADIO.capsula,
    paddingHorizontal: ESPACIO.md,
    paddingVertical: ESPACIO.xs + 2,
  },
  tarjetaHijoAccionTexto: {
    fontSize: 13,
    color: COLORES.madretierra,
    fontWeight: '600',
  },
  botonAgregar: {
    backgroundColor: COLORES.madretierra,
    borderRadius: RADIO.capsula,
    paddingVertical: ESPACIO.md,
    alignItems: 'center',
    marginTop: ESPACIO.sm,
    ...SOMBRA_BOTON,
  },
  botonAgregarTexto: {
    color: COLORES.suertedados,
    fontSize: 15,
    fontWeight: '600',
  },
  panelPlaceholder: {
    marginTop: ESPACIO.xl,
    backgroundColor: COLORES.azulsuave,
    borderRadius: RADIO.md,
    padding: ESPACIO.md,
  },
  panelPlaceholderTexto: {
    fontSize: 13,
    color: COLORES.textoPrimario,
    textAlign: 'center',
  },
})
