import React from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  ScrollView, Alert,
} from 'react-native'
import { COLORES, ESPACIO, RADIO, SOMBRA_CARD, SOMBRA_BOTON } from '../../constants/tema'
import { useAuth } from '../../store/AuthContext'
import { ChildProfile } from '../../types/database'

export default function PantallaSelectorPerfil({ navigation }: any) {
  const { perfilesHijos, salirDeNino } = useAuth()

  function manejarSeleccion(perfil: ChildProfile) {
    if (perfil.pattern_locked_until) {
      const bloqueadoHasta = new Date(perfil.pattern_locked_until)
      if (bloqueadoHasta > new Date()) {
        const minutos = Math.ceil((bloqueadoHasta.getTime() - Date.now()) / 60000)
        Alert.alert(
          'Acceso bloqueado',
          `El acceso de ${perfil.nombre_display} está bloqueado por ${minutos} minuto${minutos > 1 ? 's' : ''}. Pide ayuda a tu padre o madre.`
        )
        return
      }
    }
    navigation.navigate('AccesoNino', { perfil })
  }

  return (
    <SafeAreaView style={estilos.contenedor}>
      <View style={estilos.encabezado}>
        <Text style={estilos.titulo}>Quien entra?</Text>
        <Text style={estilos.subtitulo}>Elige tu perfil</Text>
      </View>

      <ScrollView
        contentContainerStyle={estilos.lista}
        showsVerticalScrollIndicator={false}
      >
        {perfilesHijos.length === 0 && (
          <View style={estilos.vacio}>
            <Text style={estilos.vacioTexto}>
              No hay perfiles de ninos configurados.{'\n'}Pide a tu padre que cree uno.
            </Text>
          </View>
        )}

        {perfilesHijos.map(perfil => (
          <TouchableOpacity
            key={perfil.id}
            style={estilos.tarjeta}
            onPress={() => manejarSeleccion(perfil)}
            activeOpacity={0.82}
          >
            {/* Avatar neumorphismo */}
            <View style={[
              estilos.avatar,
              perfil.companion_type === 'cat' && estilos.avatarGato,
            ]}>
              <Text style={estilos.avatarLetra}>
                {perfil.nombre_display.charAt(0).toUpperCase()}
              </Text>
            </View>

            <View style={estilos.info}>
              <Text style={estilos.nombre}>{perfil.nombre_display}</Text>
              <Text style={estilos.detalle}>
                {perfil.companion_type === 'dog' ? 'Perro' : 'Gato'} companero
                {perfil.edad ? ` · ${perfil.edad} anos` : ''}
              </Text>
            </View>

            {/* Indicador de bloqueo */}
            {perfil.pattern_locked_until &&
              new Date(perfil.pattern_locked_until) > new Date() && (
              <View style={estilos.bloqueado}>
                <Text style={estilos.bloqueadoTexto}>Bloqueado</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Volver al panel papá */}
      <View style={estilos.pie}>
        <TouchableOpacity
          style={estilos.botonVolver}
          onPress={salirDeNino}
          activeOpacity={0.7}
        >
          <Text style={estilos.botonVolverTexto}>Volver al panel de papá o mamá</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: COLORES.fondo },
  encabezado: {
    paddingHorizontal: ESPACIO.xl,
    paddingTop: ESPACIO.xxl,
    paddingBottom: ESPACIO.lg,
  },
  titulo: {
    fontSize: 32,
    color: COLORES.textoPrimario,
    fontFamily: 'CocoматPro-Regular',
    marginBottom: 4,
  },
  subtitulo: { fontSize: 15, color: COLORES.textoSuave },
  lista: {
    paddingHorizontal: ESPACIO.xl,
    gap: ESPACIO.md,
    paddingBottom: ESPACIO.lg,
  },
  vacio: {
    alignItems: 'center',
    paddingTop: ESPACIO.xxl,
  },
  vacioTexto: {
    fontSize: 15,
    color: COLORES.textoSuave,
    textAlign: 'center',
    lineHeight: 24,
  },
  tarjeta: {
    backgroundColor: COLORES.superficie,
    borderRadius: RADIO.xl,
    padding: ESPACIO.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESPACIO.md,
    ...SOMBRA_CARD,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORES.arenaCalida,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarGato: { backgroundColor: COLORES.azulsuave },
  avatarLetra: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORES.textoPrimario,
  },
  info: { flex: 1 },
  nombre: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORES.textoPrimario,
    marginBottom: 2,
  },
  detalle: { fontSize: 13, color: COLORES.textoSuave },
  bloqueado: {
    backgroundColor: COLORES.error,
    borderRadius: RADIO.capsula,
    paddingHorizontal: ESPACIO.sm,
    paddingVertical: 3,
  },
  bloqueadoTexto: { fontSize: 11, color: COLORES.suertedados, fontWeight: '600' },
  pie: {
    padding: ESPACIO.lg,
    paddingBottom: ESPACIO.xl,
  },
  botonVolver: {
    borderRadius: RADIO.capsula,
    paddingVertical: ESPACIO.md,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORES.borde,
  },
  botonVolverTexto: { fontSize: 14, color: COLORES.textoSecundario },
})
