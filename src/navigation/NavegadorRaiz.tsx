import React from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { useAuth } from '../store/AuthContext'
import NavegadorAuth from './NavegadorAuth'
import NavegadorPadre from './NavegadorPadre'
import NavegadorNino from './NavegadorNino'
import { COLORES } from '../constants/tema'

export default function NavegadorRaiz() {
  const { estado } = useAuth()

  if (estado === 'cargando') {
    return (
      <View style={estilos.cargando}>
        <ActivityIndicator color={COLORES.madretierra} size="large" />
      </View>
    )
  }

  return (
    <NavigationContainer>
      {estado === 'sin_sesion' && <NavegadorAuth />}
      {estado === 'padre_autenticado' && <NavegadorPadre />}
      {estado === 'nino_activo' && <NavegadorNino />}
    </NavigationContainer>
  )
}

const estilos = StyleSheet.create({
  cargando: {
    flex: 1,
    backgroundColor: COLORES.fondo,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
