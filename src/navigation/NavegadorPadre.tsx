import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import PantallaHomePadre from '../screens/parent/PantallaHomePadre'
import PantallaOnboardingPadre from '../screens/parent/PantallaOnboardingPadre'
import PantallaCrearHijo from '../screens/parent/PantallaCrearHijo'
import PantallaSetupPatronNino from '../screens/auth/PantallaSetupPatronNino'
import PantallaResetPatron from '../screens/auth/PantallaResetPatron'

export type StackPadreParamList = {
  HomePadre: undefined
  OnboardingPadre: undefined
  CrearHijo: undefined
  SetupPatron: { childProfileId: string; nombreNino: string }
  ResetPatron: { childProfileId: string; nombreNino: string }
}

const Stack = createNativeStackNavigator<StackPadreParamList>()

export default function NavegadorPadre() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#F4F1E2' },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="HomePadre" component={PantallaHomePadre} />
      <Stack.Screen name="OnboardingPadre" component={PantallaOnboardingPadre} />
      <Stack.Screen name="CrearHijo" component={PantallaCrearHijo} />
      <Stack.Screen name="SetupPatron" component={SetupPatronWrapper} />
      <Stack.Screen name="ResetPatron" component={ResetPatronWrapper} />
    </Stack.Navigator>
  )
}

function SetupPatronWrapper({ navigation, route }: any) {
  const { childProfileId, nombreNino } = route.params
  return (
    <PantallaSetupPatronNino
      childProfileId={childProfileId}
      onPatronGuardado={() => navigation.navigate('HomePadre')}
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
