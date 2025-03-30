'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type AuthData = {
  token: string
  athleteId: string
  expiresIn: number
}

type AuthContextType = {
  user: AuthData | null
  login: (data: AuthData) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthData | null>(null)
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem('auth')
    if (stored) {
      setUser(JSON.parse(stored))
    }
  }, [])

  const login = (data: AuthData) => {
    setUser(data)
    localStorage.setItem('auth', JSON.stringify(data))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('auth')
    router.push('/login')
  }

  const isAuthenticated = !!user?.token

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
