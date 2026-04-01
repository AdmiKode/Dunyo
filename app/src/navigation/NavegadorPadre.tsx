import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import PantallaHomePadre from '../screens/parent/PantallaHomePadre'
import PantallaOnboardingPadre from '../screens/parent/PantallaOnboardingPadre'
import PantallaCrearHijo from '../screens/parent/PantallaCrearHijo'
import PantallaResetPatron from '../screens/auth/PantallaResetPatron'
import PantallaEntrada from '../screens/auth/PantallaEntrada'
import { useAuth } from '../store/AuthContext'

export type StackPadreParamList = {
  Entrada: undefined
  HomePadre: undefined
  OnboardingPadre: undefined
  CrearHijo: undefined
  ResetPatron: { childProfileId: string; nombreNino: string }
}

const Stack = createNativeStackNavigator<StackPadreParamList>()

export default function NavegadorPadre() {
  const { perfilesHijos } = useAuth()
  // Sin hijos: onboarding. Con hijos: pantalla de entrada (2 botones)
  const pantallaInicial = perfilesHijos.length === 0 ? 'OnboardingPadre' : 'Entrada'

  return (
    <Stack.Navigator
      initialRouteName={pantallaInicial}
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#F4F1E2' },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Entrada" component={PantallaEntradaConSesionWrapper} />
      <Stack.Screen name="HomePadre" component={PantallaHomePadre} />
      <Stack.Screen name="OnboardingPadre" component={PantallaOnboardingPadre} />
      <Stack.Screen name="CrearHijo" component={PantallaCrearHijo} />
      <Stack.Screen name="ResetPatron" component={ResetPatronWrapper} />
    </Stack.Navigator>
  )
}

// Desde aquí: Configuración → HomePadre, My Dunyo → activarNino (cambia estado global)
function PantallaEntradaConSesionWrapper({ navigation }: any) {
  return (
    <PantallaEntrada
      onEntrarConfiguracion={() => navigation.navigate('HomePadre')}
      tieneSesion={true}
    />
  )
}

function ResetPatronWrapper({ navigation, route }: any) {
  const { childProfileId, nombreNino } = route.params
  return (
    <PantallaResetPatron
      childProfileId={childProfileId}
      nombreNino={nombreNino}
      onResetCompletado={() => navigation.goBack()}
      onCancelar={() => navigation.goBack()}
    />
  )
}
