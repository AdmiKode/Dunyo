import { createClient } from '@supabase/supabase-js'
import { Platform } from 'react-native'
import { Database } from '../types/database'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

// En web usamos localStorage, en nativo expo-secure-store
const storage =
  Platform.OS === 'web'
    ? {
        getItem: (key: string) => Promise.resolve(localStorage.getItem(key)),
        setItem: (key: string, value: string) => {
          localStorage.setItem(key, value)
          return Promise.resolve()
        },
        removeItem: (key: string) => {
          localStorage.removeItem(key)
          return Promise.resolve()
        },
      }
    : (() => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const SecureStore = require('expo-secure-store')
        return {
          getItem: (key: string) => SecureStore.getItemAsync(key),
          setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
          removeItem: (key: string) => SecureStore.deleteItemAsync(key),
        }
      })()

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: Platform.OS === 'web',
  },
})
