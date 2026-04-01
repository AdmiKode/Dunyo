import React, { useState, useEffect } from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert,
} from 'react-native'
import { COLORES, ESPACIO, RADIO, SOMBRA_CARD, SOMBRA_BOTON } from '../../constants/tema'
import { useAuth } from '../../store/AuthContext'
import { obtenerResumenNino, ResumenNino } from '../../lib/metricas'
import { ETIQUETAS_EMOCION } from '../../lib/checkins'
import { EmotionPrimary } from '../../types/database'

export default function PantallaHomePadre({ navigation }: any) {
  const { perfilesHijos, padre, cerrarSesionPadre, activarNino, recargarPerfiles } = useAuth()
  const [resumenes, setResumenes] = useState<Record<string, ResumenNino>>({})

  useEffect(() => {
    if (perfilesHijos.length === 0) return
    perfilesHijos.forEach(p => {
      obtenerResumenNino(p.id)
        .then(r => setResumenes(prev => ({ ...prev, [p.id]: r })))
        .catch(() => {})
    })
  }, [perfilesHijos.map(p => p.id).join(',')])

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

      {perfilesHijos.map(perfil => {
        const resumen = resumenes[perfil.id]
        return (
          <View key={perfil.id}>
            <TouchableOpacity
              style={estilos.tarjetaHijo}
              onPress={() => manejarEntrarComoNino(perfil)}
              activeOpacity={0.82}
            >
              <View style={estilos.tarjetaHijoInfo}>
                <Text style={estilos.nombreHijo}>{perfil.nombre_display}</Text>
                <Text style={estilos.edadHijo}>{perfil.edad ? `${perfil.edad} anos` : ''}</Text>
              </View>
              <View style={estilos.tarjetaHijoAccion}>
                <Text style={estilos.tarjetaHijoAccionTexto}>
                  {perfil.pattern_hash ? 'Entrar al refugio' : 'Configurar patron'}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Panel de metricas reales del hijo */}
            {resumen && (
              <View style={estilos.panelResumen}>
                {/* ELS + alertas */}
                <View style={estilos.filaPanelResumen}>
                  <View style={[estilos.badgeEls, { backgroundColor: resumen.elsBanda.colorHex + '33' }]}>
                    <Text style={[estilos.badgeElsNumero, { color: resumen.elsBanda.colorHex }]}>
                      {Math.round(resumen.elsHoy)}
                    </Text>
                    <Text style={[estilos.badgeElsBanda, { color: resumen.elsBanda.colorHex }]}>
                      {resumen.elsBanda.banda}
                    </Text>
                  </View>

                  <View style={estilos.colMetricas}>
                    <Text style={estilos.metricaTexto}>
                      {resumen.totalCheckins7d} registros esta semana
                    </Text>
                    {resumen.topEmociones7d.length > 0 && (
                      <Text style={estilos.metricaTexto}>
                        Mas frecuente: {ETIQUETAS_EMOCION[resumen.topEmociones7d[0].emotion as EmotionPrimary]}
                      </Text>
                    )}
                  </View>

                  {resumen.alertasActivas.length > 0 && (
                    <View style={estilos.badgeAlerta}>
                      <Text style={estilos.badgeAlertaTexto}>
                        {resumen.alertasActivas.length} alerta{resumen.alertasActivas.length > 1 ? 's' : ''}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            )}
          </View>
        )
      })}

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
  panelResumen: {
    marginTop: -ESPACIO.sm,
    marginBottom: ESPACIO.md,
    backgroundColor: COLORES.fondo,
    borderWidth: 1,
    borderColor: COLORES.borde,
    borderTopWidth: 0,
    borderBottomLeftRadius: RADIO.lg,
    borderBottomRightRadius: RADIO.lg,
    padding: ESPACIO.md,
  },
  filaPanelResumen: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESPACIO.md,
  },
  badgeEls: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeElsNumero: {
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 20,
  },
  badgeElsBanda: {
    fontSize: 10,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  colMetricas: { flex: 1, gap: 3 },
  metricaTexto: { fontSize: 12, color: COLORES.textoSuave },
  badgeAlerta: {
    backgroundColor: '#E53935',
    borderRadius: RADIO.capsula,
    paddingHorizontal: ESPACIO.sm,
    paddingVertical: 3,
  },
  badgeAlertaTexto: { fontSize: 11, color: '#fff', fontWeight: '700' },
})
