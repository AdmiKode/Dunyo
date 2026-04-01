import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import PantallaAccesoNino from '../screens/auth/PantallaAccesoNino'
import PantallaSetupPatronNino from '../screens/auth/PantallaSetupPatronNino'
import PantallaResetPatron from '../screens/auth/PantallaResetPatron'
import PantallaOnboardingNino from '../screens/child/PantallaOnboardingNino'
import PantallaHomeNino from '../screens/child/PantallaHomeNino'
import PantallaCheckin from '../screens/child/PantallaCheckin'
import PantallaCalmarme from '../screens/child/PantallaCalmarme'
import PantallaDesahogarme from '../screens/child/PantallaDesahogarme'
import PantallaAyudameADecirlo from '../screens/child/PantallaAyudameADecirlo'
import { ChildProfile } from '../types/database'
import { useAuth } from '../store/AuthContext'

export type StackNinoParamList = {
  // AccesoNino y SetupPatronNino leen el perfil de AuthContext (ninoActivo)
  AccesoNino: undefined
  SetupPatronNino: undefined
  OnboardingNino: { perfil: ChildProfile }
  HomeNino: { perfil: ChildProfile }
  Checkin: { perfil: ChildProfile }
  Calmarme: { perfil: ChildProfile }
  Desahogarme: { perfil: ChildProfile }
  AyudameADecirlo: { perfil: ChildProfile }
  ResetPatronHijo: { childProfileId: string; nombreNino: string }
}

const Stack = createNativeStackNavigator<StackNinoParamList>()

export default function NavegadorNino() {
  const { ninoActivo } = useAuth()
  // ninoActivo siempre existe cuando estado === 'nino_activo'
  const perfil = ninoActivo!
  // Si ya tiene patrón: desbloquear. Si no: crear patrón por primera vez.
  const pantallaInicial = perfil.pattern_hash ? 'AccesoNino' : 'SetupPatronNino'

  return (
    <Stack.Navigator
      initialRouteName={pantallaInicial}
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#F4F1E2' },
        animation: 'fade',
      }}
    >
      <Stack.Screen name="AccesoNino" component={AccesoNinoWrapper} />
      <Stack.Screen name="SetupPatronNino" component={SetupPatronWrapper} />
      <Stack.Screen name="OnboardingNino" component={OnboardingNinoWrapper} />
      <Stack.Screen name="HomeNino" component={PantallaHomeNino} />
      <Stack.Screen name="Checkin" component={PantallaCheckin} />
      <Stack.Screen name="Calmarme" component={PantallaCalmarme} />
      <Stack.Screen name="Desahogarme" component={PantallaDesahogarme} />
      <Stack.Screen name="AyudameADecirlo" component={PantallaAyudameADecirlo} />
      <Stack.Screen name="ResetPatronHijo" component={ResetPatronHijoWrapper} />
    </Stack.Navigator>
  )
}

// Lee el perfil del contexto — no del route.params
function AccesoNinoWrapper({ navigation }: any) {
  const { ninoActivo } = useAuth()
  const perfil = ninoActivo!
  return (
    <PantallaAccesoNino
      childProfileId={perfil.id}
      nombreNino={perfil.nombre_display}
      onAccesoOtorgado={() => {
        if (!perfil.onboarding_completed) {
          navigation.replace('OnboardingNino', { perfil })
        } else {
          navigation.replace('HomeNino', { perfil })
        }
      }}
      onNecesitoAyuda={() => navigation.navigate('ResetPatronHijo', {
        childProfileId: perfil.id,
        nombreNino: perfil.nombre_display,
      })}
    />
  )
}

// El niño crea su patrón por primera vez — solo cuando pattern_hash es null
function SetupPatronWrapper({ navigation }: any) {
  const { ninoActivo, recargarPerfiles } = useAuth()
  const perfil = ninoActivo!
  return (
    <PantallaSetupPatronNino
      childProfileId={perfil.id}
      onPatronGuardado={async () => {
        await recargarPerfiles()
        navigation.replace('OnboardingNino', { perfil })
      }}
    />
  )
}

// Onboarding del niño — solo en primer acceso
function OnboardingNinoWrapper({ navigation, route }: any) {
  const { perfil } = route.params as { perfil: ChildProfile }
  return (
    <PantallaOnboardingNino
      perfil={perfil}
      onTerminar={() => navigation.replace('HomeNino', { perfil })}
    />
  )
}

// Reset de patrón por padre — aparece cuando el niño dice "Necesito ayuda"
function ResetPatronHijoWrapper({ navigation, route }: any) {
  const { childProfileId, nombreNino } = route.params as { childProfileId: string; nombreNino: string }
  return (
    <PantallaResetPatron
      childProfileId={childProfileId}
      nombreNino={nombreNino}
      onResetCompletado={() => navigation.replace('AccesoNino')}
      onCancelar={() => navigation.goBack()}
    />
  )
}
