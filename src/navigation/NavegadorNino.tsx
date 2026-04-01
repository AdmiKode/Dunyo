import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import PantallaSelectorPerfil from '../screens/child/PantallaSelectorPerfil'
import PantallaAccesoNino from '../screens/auth/PantallaAccesoNino'
import PantallaHomeNino from '../screens/child/PantallaHomeNino'
import PantallaCheckin from '../screens/child/PantallaCheckin'
import PantallaCalmarme from '../screens/child/PantallaCalmarme'
import PantallaAyudameADecirlo from '../screens/child/PantallaAyudameADecirlo'
import { ChildProfile } from '../types/database'

export type StackNinoParamList = {
  SelectorPerfil: undefined
  AccesoNino: { perfil: ChildProfile }
  HomeNino: { perfil: ChildProfile }
  Checkin: { perfil: ChildProfile }
  Calmarme: { perfil: ChildProfile }
  AyudameADecirlo: { perfil: ChildProfile }
}

const Stack = createNativeStackNavigator<StackNinoParamList>()

export default function NavegadorNino() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#F4F1E2' },
        animation: 'fade',
      }}
    >
      <Stack.Screen name="SelectorPerfil" component={PantallaSelectorPerfil} />
      <Stack.Screen name="AccesoNino" component={PantallaAccesoNinoWrapper} />
      <Stack.Screen name="HomeNino" component={PantallaHomeNino} />
      <Stack.Screen name="Checkin" component={PantallaCheckin} />
      <Stack.Screen name="Calmarme" component={PantallaCalmarme} />
      <Stack.Screen name="AyudameADecirlo" component={PantallaAyudameADecirlo} />
    </Stack.Navigator>
  )
}

function PantallaAccesoNinoWrapper({ navigation, route }: any) {
  const { perfil } = route.params as { perfil: ChildProfile }
  return (
    <PantallaAccesoNino
      childProfileId={perfil.id}
      nombreNino={perfil.nombre_display}
      onAccesoOtorgado={() => navigation.replace('HomeNino', { perfil })}
      onNecesitoAyuda={() => navigation.navigate('SelectorPerfil')}
    />
  )
}
