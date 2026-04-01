import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import PantallaLoginPadre from '../screens/auth/PantallaLoginPadre'
import PantallaCrearCuenta from '../screens/auth/PantallaCrearCuenta'
import PantallaVerificarCorreo from '../screens/auth/PantallaVerificarCorreo'
import PantallaEntrada from '../screens/auth/PantallaEntrada'

export type StackAuthParamList = {
  Entrada: undefined
  Login: undefined
  CrearCuenta: undefined
  VerificarCorreo: { email: string }
}

const Stack = createNativeStackNavigator<StackAuthParamList>()

export default function NavegadorAuth() {
  return (
    <Stack.Navigator
      initialRouteName="Entrada"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#F4F1E2' },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Entrada" component={PantallaEntradaWrapper} />
      <Stack.Screen name="Login" component={PantallaLoginPadreWrapper} />
      <Stack.Screen name="CrearCuenta" component={PantallaCrearCuentaWrapper} />
      <Stack.Screen name="VerificarCorreo" component={PantallaVerificarCorreo} />
    </Stack.Navigator>
  )
}

function PantallaEntradaWrapper({ navigation }: any) {
  return (
    <PantallaEntrada
      onEntrarConfiguracion={() => navigation.navigate('Login')}
      tieneSesion={false}
    />
  )
}

// Wrappers para adaptar las props de navegación
function PantallaLoginPadreWrapper({ navigation }: any) {
  return (
    <PantallaLoginPadre
      onLoginExitoso={() => {}}
      onIrARegistro={() => navigation.navigate('CrearCuenta')}
    />
  )
}

function PantallaCrearCuentaWrapper({ navigation }: any) {
  return (
    <PantallaCrearCuenta
      onRegistrado={() => navigation.navigate('VerificarCorreo', { email: '' })}
      onIrALogin={() => navigation.navigate('Login')}
    />
  )
}
