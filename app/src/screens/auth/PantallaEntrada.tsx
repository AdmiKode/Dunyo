import React, { useState } from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image,
} from 'react-native'
import { COLORES, ESPACIO, RADIO } from '../../constants/tema'
import { useAuth } from '../../store/AuthContext'
import { ChildProfile } from '../../types/database'

type Props = {
  // Ruta del padre — navegador decide a dónde va (Login o HomePadre según contexto)
  onEntrarConfiguracion: () => void
  // true = hay sesión padre activa, false = sin sesión
  tieneSesion: boolean
}

export default function PantallaEntrada({ onEntrarConfiguracion, tieneSesion }: Props) {
  const { perfilesHijos, activarNino } = useAuth()
  const [mostrarSelector, setMostrarSelector] = useState(false)

  const hayHijos = tieneSesion && perfilesHijos.length > 0

  function manejarMyDunyo() {
    if (!hayHijos) return
    if (perfilesHijos.length === 1) {
      activarNino(perfilesHijos[0])
    } else {
      setMostrarSelector(true)
    }
  }

  // ── Selector de hijo cuando hay múltiples ────────────────────────────────
  if (mostrarSelector) {
    return (
      <SafeAreaView style={e.raiz}>
        <View style={e.selectorCuerpo}>
          <Text style={e.selectorTitulo}>Quien entra?</Text>
          <Text style={e.selectorSub}>Elige tu refugio</Text>

          {perfilesHijos.map((perfil: ChildProfile) => (
            <TouchableOpacity
              key={perfil.id}
              style={e.tarjetaHijo}
              onPress={() => activarNino(perfil)}
              activeOpacity={0.82}
            >
              <View style={[
                e.avatarCirculo,
                { backgroundColor: perfil.companion_type === 'cat' ? COLORES.azulsuave : COLORES.arenaCalida },
              ]}>
                <Text style={e.avatarLetra}>
                  {perfil.nombre_display.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View>
                <Text style={e.tarjetaNombre}>{perfil.nombre_display}</Text>
                {perfil.edad ? (
                  <Text style={e.tarjetaEdad}>{perfil.edad} anos</Text>
                ) : null}
              </View>
            </TouchableOpacity>
          ))}

          <TouchableOpacity onPress={() => setMostrarSelector(false)} style={e.btnVolver}>
            <Text style={e.btnVolverTxt}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  // ── Pantalla principal con 2 botones ─────────────────────────────────────
  return (
    <SafeAreaView style={e.raiz}>
      {/* Logo centrado */}
      <View style={e.cuerpo}>
        <Image
          source={require('../../../assets/letrero_dunyo.png')}
          style={e.logo}
          resizeMode="contain"
        />
        <Text style={e.lema}>Tu lugar seguro</Text>
      </View>

      {/* Botones de entrada */}
      <View style={e.botones}>

        {/* ── Botón niño: My Dunyo ── */}
        <TouchableOpacity
          style={[e.btnPrincipal, !hayHijos && e.btnBloqueado]}
          onPress={manejarMyDunyo}
          activeOpacity={hayHijos ? 0.82 : 1}
        >
          <Text style={[e.btnPrincipalTitulo, !hayHijos && e.txtBloqueado]}>
            Entrar a My Dunyo
          </Text>
          <Text style={[e.btnPrincipalSub, !hayHijos && e.txtBloqueadoSub]}>
            {hayHijos
              ? '(Mi Mundo)'
              : 'Configura la app con tu mamá o papá primero'}
          </Text>
        </TouchableOpacity>

        {/* Separador */}
        <View style={e.separador} />

        {/* ── Botón padre: Configuración ── */}
        <TouchableOpacity
          style={e.btnSecundario}
          onPress={onEntrarConfiguracion}
          activeOpacity={0.78}
        >
          <Text style={e.btnSecundarioTitulo}>Entrar a configuración</Text>
          <Text style={e.btnSecundarioSub}>Control parental · Solo para padres</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  )
}

const e = StyleSheet.create({
  raiz: {
    flex: 1,
    backgroundColor: COLORES.fondo,
  },

  // ── Cuerpo central ───
  cuerpo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: ESPACIO.xl,
  },
  logo: {
    width: 240,
    height: 130,
    marginBottom: ESPACIO.lg,
  },
  lema: {
    fontSize: 14,
    color: COLORES.textoSuave,
    fontFamily: 'CocomatPro',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },

  // ── Zona de botones ───
  botones: {
    paddingHorizontal: ESPACIO.lg,
    paddingBottom: ESPACIO.xxl,
  },

  // Botón My Dunyo
  btnPrincipal: {
    backgroundColor: COLORES.madretierra,
    borderRadius: RADIO.xl,
    paddingVertical: ESPACIO.lg + 4,
    paddingHorizontal: ESPACIO.xl,
    alignItems: 'center',
    marginBottom: ESPACIO.sm,
    shadowColor: COLORES.madretierra,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.38,
    shadowRadius: 22,
    elevation: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  btnBloqueado: {
    backgroundColor: COLORES.borde,
    shadowOpacity: 0.04,
    elevation: 1,
  },
  btnPrincipalTitulo: {
    fontSize: 19,
    fontFamily: 'CocomatPro',
    color: COLORES.suertedados,
  },
  btnPrincipalSub: {
    fontSize: 12,
    color: 'rgba(244,241,226,0.65)',
    marginTop: 4,
    letterSpacing: 0.2,
  },
  txtBloqueado: {
    color: COLORES.textoSuave,
  },
  txtBloqueadoSub: {
    color: COLORES.textoSuave,
  },

  // Separador
  separador: {
    height: 1,
    backgroundColor: COLORES.borde,
    marginVertical: ESPACIO.md,
    marginHorizontal: ESPACIO.xl,
  },

  // Botón configuración
  btnSecundario: {
    backgroundColor: COLORES.superficie,
    borderRadius: RADIO.xl,
    paddingVertical: ESPACIO.md + 4,
    paddingHorizontal: ESPACIO.xl,
    alignItems: 'center',
    shadowColor: COLORES.madretierra,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.75)',
  },
  btnSecundarioTitulo: {
    fontSize: 15,
    color: COLORES.textoSecundario,
    fontFamily: 'CocomatPro',
  },
  btnSecundarioSub: {
    fontSize: 11,
    color: COLORES.textoSuave,
    marginTop: 3,
    letterSpacing: 0.2,
  },

  // ── Selector de hijo ───
  selectorCuerpo: {
    flex: 1,
    paddingHorizontal: ESPACIO.lg,
    paddingTop: ESPACIO.xxl,
    alignItems: 'center',
  },
  selectorTitulo: {
    fontSize: 32,
    fontFamily: 'CocomatPro',
    color: COLORES.textoPrimario,
    textAlign: 'center',
    marginBottom: ESPACIO.xs,
  },
  selectorSub: {
    fontSize: 14,
    color: COLORES.textoSuave,
    textAlign: 'center',
    marginBottom: ESPACIO.xl,
  },
  tarjetaHijo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORES.superficie,
    borderRadius: RADIO.xl,
    padding: ESPACIO.lg,
    marginBottom: ESPACIO.md,
    width: '100%',
    shadowColor: COLORES.madretierra,
    shadowOffset: { width: 6, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 5,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.85)',
    gap: ESPACIO.md,
  },
  avatarCirculo: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetra: {
    fontSize: 22,
    fontFamily: 'CocomatPro',
    color: COLORES.madretierra,
  },
  tarjetaNombre: {
    fontSize: 20,
    fontFamily: 'CocomatPro',
    color: COLORES.textoPrimario,
  },
  tarjetaEdad: {
    fontSize: 12,
    color: COLORES.textoSuave,
    marginTop: 2,
  },
  btnVolver: {
    marginTop: ESPACIO.xl,
    paddingHorizontal: ESPACIO.xl,
    paddingVertical: ESPACIO.sm,
    borderRadius: RADIO.capsula,
    borderWidth: 1,
    borderColor: COLORES.borde,
  },
  btnVolverTxt: {
    fontSize: 14,
    color: COLORES.textoSecundario,
  },
})
