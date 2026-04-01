import React from 'react'
import { View } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { useFonts } from 'expo-font'
import { ProveedorAuth } from './src/store/AuthContext'
import NavegadorRaiz from './src/navigation/NavegadorRaiz'

export default function App() {
  const [fontsLoaded] = useFonts({
    CocomatPro: require('./assets/fonts/cocomat-pro-regular.woff2'),
  })

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: '#F4F1E2' }} />
  }

  return (
    <ProveedorAuth>
      <StatusBar style="dark" backgroundColor="#F4F1E2" />
      <NavegadorRaiz />
    </ProveedorAuth>
  )
}
