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
    let inicializado = false

    // Verificar sesión existente al arrancar — esto es la fuente de verdad
    supabase.auth.getSession().then(async ({ data: { session }, error }) => {
      if (error) {
        console.warn('[Auth] getSession error:', error.message)
        setEstado('sin_sesion')
        return
      }
      if (session) {
        setSesionPadre(session)
        await cargarYTransicionarPadre()
      } else {
        setEstado('sin_sesion')
      }
      inicializado = true
    }).catch((err) => {
      console.warn('[Auth] getSession catch:', err)
      setEstado('sin_sesion')
      inicializado = true
    })

    // Escuchar cambios POSTERIORES al arranque (login, logout, refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (evento, sesion) => {
      // Ignorar el evento INITIAL_SESSION — ya lo maneja getSession arriba
      if (evento === 'INITIAL_SESSION') return
      if (sesion) {
        setSesionPadre(sesion)
        await cargarYTransicionarPadre()
      } else {
        setSesionPadre(null)
        setEstado('sin_sesion')
        setPerfilesHijos([])
        setNinoActivo(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function cargarYTransicionarPadre() {
    try {
      const { data, error } = await supabase
        .from('child_profiles')
        .select('*')
        .eq('profile_state', 'active')
        .order('created_at', { ascending: true })
      if (error) console.warn('[Auth] cargar perfiles error:', error.message)
      setPerfilesHijos(data ?? [])
    } catch (err) {
      console.warn('[Auth] cargar perfiles catch:', err)
      setPerfilesHijos([])
    } finally {
      setEstado('padre_autenticado')
    }
  }

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
