import React, { useState, useRef } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
  Dimensions,
  Image,
} from 'react-native'
import { COLORES, ESPACIO, RADIO, SOMBRA_BOTON } from '../../constants/tema'
import { ChildProfile } from '../../types/database'

const { width: ANCHO } = Dimensions.get('window')

type Props = {
  perfil: ChildProfile
  onTerminar: () => void
}

type Paso = {
  titulo: (nombre: string, companion: string) => string
  cuerpo: (nombre: string, companion: string) => string
  color: string
}

const PASOS: Paso[] = [
  {
    titulo: (nombre) => `Hola, ${nombre}`,
    cuerpo: () =>
      'Este es DUNYO.\nTu refugio.\nUn lugar creado solo para ti.',
    color: COLORES.madretierra,
  },
  {
    titulo: (_, companion) =>
      companion === 'cat' ? 'Tu gato te acompaña' : 'Tu perro te acompaña',
    cuerpo: (nombre, companion) =>
      companion === 'cat'
        ? `${nombre}, tu gato silencioso estará contigo cada vez que entres.\nEscucha todo sin juzgar nada.`
        : `${nombre}, tu perro guardián estará contigo cada vez que entres.\nSiempre de tu lado.`,
    color: COLORES.arenaCalida,
  },
  {
    titulo: () => 'Lo que haces aquí\nes tuyo',
    cuerpo: () =>
      'Puedes decir cómo te sientes con toda confianza.\nNadie va a regañarte por lo que sientes.',
    color: COLORES.azulsuave,
  },
]

// Visualización geométrica por paso — SIN emojis
function VisualPaso({ index, companion }: { index: number; companion: string }) {
  if (index === 1) {
    const esGato = companion === 'cat'
    const clr = esGato ? COLORES.azulsuave : COLORES.arenaCalida
    return (
      <View style={[visE.wrap, { backgroundColor: clr + '55' }]}>
        <View style={[visE.avatar, { backgroundColor: clr }]}>
          {esGato ? (
            <>
              <View style={visE.orejaGatL} />
              <View style={visE.orejaGatR} />
            </>
          ) : (
            <>
              <View style={visE.orejaDogL} />
              <View style={visE.orejaDogR} />
            </>
          )}
          <View style={visE.cara} />
        </View>
      </View>
    )
  }
  // index === 2: privacidad
  return (
    <View style={[visE.wrap, { backgroundColor: COLORES.azulsuave + '55' }]}>
      <View style={visE.candadoArco} />
      <View style={visE.candadoCuerpo} />
    </View>
  )
}

const visE = StyleSheet.create({
  wrap: { width: 120, height: 120, borderRadius: 60, alignItems: 'center', justifyContent: 'center', marginBottom: ESPACIO.md },
  avatar: { width: 76, height: 76, borderRadius: 38, alignItems: 'center', justifyContent: 'center' },
  orejaDogL: { position: 'absolute', top: 7, left: 5, width: 20, height: 26, borderRadius: 10, backgroundColor: 'rgba(81,50,41,0.22)' },
  orejaDogR: { position: 'absolute', top: 7, right: 5, width: 20, height: 26, borderRadius: 10, backgroundColor: 'rgba(81,50,41,0.22)' },
  orejaGatL: { position: 'absolute', top: 2, left: 10, width: 16, height: 16, backgroundColor: 'rgba(81,50,41,0.22)', transform: [{ rotate: '25deg' }], borderRadius: 3 },
  orejaGatR: { position: 'absolute', top: 2, right: 10, width: 16, height: 16, backgroundColor: 'rgba(81,50,41,0.22)', transform: [{ rotate: '-25deg' }], borderRadius: 3 },
  cara: { width: 40, height: 30, borderRadius: 15, backgroundColor: 'rgba(81,50,41,0.15)' },
  candadoCuerpo: { width: 42, height: 36, borderRadius: 8, backgroundColor: 'rgba(81,50,41,0.28)', marginTop: 2 },
  candadoArco: { width: 26, height: 16, borderTopLeftRadius: 13, borderTopRightRadius: 13, borderWidth: 5, borderBottomWidth: 0, borderColor: 'rgba(81,50,41,0.28)', backgroundColor: 'transparent', marginBottom: -1 },
})

export default function PantallaOnboardingNino({ perfil, onTerminar }: Props) {
  const [pasoActual, setPasoActual] = useState(0)
  const opacidad = useRef(new Animated.Value(1)).current

  const companion = perfil.companion_type ?? 'dog'
  const nombre = perfil.nombre_display
  const paso = PASOS[pasoActual]
  const esUltimo = pasoActual === PASOS.length - 1

  function avanzar() {
    Animated.sequence([
      Animated.timing(opacidad, { toValue: 0, duration: 180, useNativeDriver: true }),
      Animated.timing(opacidad, { toValue: 1, duration: 220, useNativeDriver: true }),
    ]).start()

    if (esUltimo) {
      onTerminar()
    } else {
      setPasoActual(p => p + 1)
    }
  }


  return (
    <SafeAreaView style={estilos.contenedor}>
      {/* Indicador de pasos */}
      <View style={estilos.indicadores}>
        {PASOS.map((_, i) => (
          <View
            key={i}
            style={[
              estilos.indicador,
              i === pasoActual && estilos.indicadorActivo,
              i < pasoActual && estilos.indicadorPasado,
            ]}
          />
        ))}
      </View>

      {/* Contenido animado */}
      <Animated.View style={[estilos.cuerpo, { opacity: opacidad }]}>
        {/* Icono visual — paso 0 usa logo completo, resto usa forma geométrica */}
        {pasoActual === 0 ? (
          <Image
            source={require('../../../assets/logo_dunyo.png')}
            style={estilos.logoHero}
            resizeMode="contain"
          />
        ) : (
          <VisualPaso index={pasoActual} companion={companion} />
        )}

        {/* Textos */}
        <Text style={estilos.titulo}>
          {paso.titulo(nombre, companion)}
        </Text>
        <Text style={estilos.texto}>
          {paso.cuerpo(nombre, companion)}
        </Text>
      </Animated.View>

      {/* Botón avanzar */}
      <View style={estilos.pie}>
        <TouchableOpacity
          style={[estilos.boton, { backgroundColor: paso.color }]}
          onPress={avanzar}
          activeOpacity={0.85}
        >
          <Text style={estilos.botonTexto}>
            {esUltimo ? 'Entrar a mi refugio' : 'Siguiente'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: COLORES.fondo,
  },
  indicadores: {
    flexDirection: 'row',
    gap: ESPACIO.sm,
    paddingHorizontal: ESPACIO.xl,
    paddingTop: ESPACIO.xl,
    paddingBottom: ESPACIO.lg,
  },
  indicador: {
    flex: 1,
    height: 4,
    borderRadius: RADIO.capsula,
    backgroundColor: COLORES.borde,
  },
  indicadorActivo: {
    backgroundColor: COLORES.madretierra,
  },
  indicadorPasado: {
    backgroundColor: COLORES.madretierraAlpha,
  },
  cuerpo: {
    flex: 1,
    paddingHorizontal: ESPACIO.xl,
    justifyContent: 'center',
    alignItems: 'center',
    gap: ESPACIO.xl,
  },
  logoHero: {
    width: 220,
    height: 200,
    marginBottom: ESPACIO.md,
  },
  titulo: {
    fontSize: 30,
    color: COLORES.textoPrimario,
    fontFamily: 'CocomatPro',
    textAlign: 'center',
    lineHeight: 38,
  },
  texto: {
    fontSize: 16,
    color: COLORES.textoSecundario,
    textAlign: 'center',
    lineHeight: 26,
    maxWidth: ANCHO * 0.8,
  },
  pie: {
    paddingHorizontal: ESPACIO.xl,
    paddingBottom: ESPACIO.xxl,
  },
  boton: {
    borderRadius: RADIO.lg,
    paddingVertical: ESPACIO.md + 2,
    alignItems: 'center',
    ...SOMBRA_BOTON,
  },
  botonTexto: {
    fontSize: 17,
    color: COLORES.fondo,
    fontFamily: 'CocomatPro',
    letterSpacing: 0.3,
  },
})
