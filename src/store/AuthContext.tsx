import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { ChildProfile } from '../types/database'

type EstadoAuth =
  | 'cargando'
  | 'sin_sesion'
  | 'padre_autenticado'
  | 'nino_activo'

type ContextoAuth = {
  estado: EstadoAuth
  sesionPadre: Session | null
  padre: User | null
  perfilesHijos: ChildProfile[]
  ninoActivo: ChildProfile | null
  activarNino: (perfil: ChildProfile) => void
  salirDeNino: () => void
  cerrarSesionPadre: () => Promise<void>
  recargarPerfiles: () => Promise<void>
}

const AuthContext = createContext<ContextoAuth | null>(null)

export function ProveedorAuth({ children }: { children: ReactNode }) {
  const [estado, setEstado] = useState<EstadoAuth>('cargando')
  const [sesionPadre, setSesionPadre] = useState<Session | null>(null)
  const [perfilesHijos, setPerfilesHijos] = useState<ChildProfile[]>([])
  const [ninoActivo, setNinoActivo] = useState<ChildProfile | null>(null)

  useEffect(() => {
    // Escuchar cambios de sesión del padre
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (evento, sesion) => {
      setSesionPadre(sesion)
      if (sesion) {
        setEstado('padre_autenticado')
        await cargarPerfilesHijos()
      } else {
        setEstado('sin_sesion')
        setPerfilesHijos([])
        setNinoActivo(null)
      }
    })

    // Verificar sesión existente al arrancar
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSesionPadre(session)
      if (session) {
        setEstado('padre_autenticado')
        cargarPerfilesHijos()
      } else {
        setEstado('sin_sesion')
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function cargarPerfilesHijos() {
    const { data } = await supabase
      .from('child_profiles')
      .select('*')
      .eq('profile_state', 'active')
      .order('created_at', { ascending: true })
    setPerfilesHijos(data ?? [])
  }

  function activarNino(perfil: ChildProfile) {
    setNinoActivo(perfil)
    setEstado('nino_activo')
  }

  function salirDeNino() {
    setNinoActivo(null)
    setEstado('padre_autenticado')
  }

  async function cerrarSesionPadre() {
    await supabase.auth.signOut()
    setNinoActivo(null)
    setPerfilesHijos([])
  }

  return (
    <AuthContext.Provider value={{
      estado,
      sesionPadre,
      padre: sesionPadre?.user ?? null,
      perfilesHijos,
      ninoActivo,
      activarNino,
      salirDeNino,
      cerrarSesionPadre,
      recargarPerfiles: cargarPerfilesHijos,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): ContextoAuth {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de ProveedorAuth')
  return ctx
}
