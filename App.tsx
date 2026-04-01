import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { NavigationContainer } from '@react-navigation/native'
import { ProveedorAuth } from './src/store/AuthContext'
import NavegadorRaiz from './src/navigation/NavegadorRaiz'

export default function App() {
  return (
    <ProveedorAuth>
      <NavigationContainer>
        <StatusBar style="dark" backgroundColor="#F4F1E2" />
        <NavegadorRaiz />
      </NavigationContainer>
    </ProveedorAuth>
  )
}
