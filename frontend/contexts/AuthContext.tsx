import React, { createContext, useContext, ReactNode } from 'react'
import { useAuth } from '@/hooks/useAuth'

// Kullanıcı tipi tanımı
interface User {
  id: string
  name: string
  email: string
  role: string
  isAdmin: boolean
}

// Context için tip tanımlaması
interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  isLoggingIn: boolean
  isRegistering: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

// Context oluşturma
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Auth Context Hook
export function useAuthContext() {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  
  return context
}

// Provider bileşeni
export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth()
  
  // Kullanıcı rolü kontrolü
  const isAdmin = auth.user?.role === 'admin'
  
  return (
    <AuthContext.Provider value={{
      user: auth.user,
      loading: auth.loading,
      error: auth.error,
      isLoggingIn: auth.isLoggingIn,
      isRegistering: auth.isRegistering,
      isAuthenticated: auth.isAuthenticated,
      isAdmin,
      login: auth.login,
      register: auth.register,
      logout: auth.logout,
      refreshUser: auth.refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export { useAuth } 