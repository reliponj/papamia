import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import {
  apiLogin,
  apiRegister,
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from '../services/api'

interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
}

interface AuthApi {
  login: (email: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthStateCtx = createContext<AuthState | null>(null)
const AuthApiCtx = createContext<AuthApi | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Restore session from storage on mount
    const hasTokens = Boolean(getAccessToken() || getRefreshToken())
    setIsAuthenticated(hasTokens)
    setIsLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const data = await apiLogin(email, password)
    setTokens(data.accessToken, data.refreshToken)
    setIsAuthenticated(true)
  }, [])

  const register = useCallback(async (username: string, email: string, password: string) => {
    const data = await apiRegister(username, email, password)
    setTokens(data.accessToken, data.refreshToken)
    setIsAuthenticated(true)
  }, [])

  const logout = useCallback(() => {
    clearTokens()
    setIsAuthenticated(false)
  }, [])

  return (
    <AuthStateCtx.Provider value={{ isAuthenticated, isLoading }}>
      <AuthApiCtx.Provider value={{ login, register, logout }}>
        {children}
      </AuthApiCtx.Provider>
    </AuthStateCtx.Provider>
  )
}

export function useAuthState(): AuthState {
  const ctx = useContext(AuthStateCtx)
  if (!ctx) throw new Error('useAuthState must be used inside AuthProvider')
  return ctx
}

export function useAuthApi(): AuthApi {
  const ctx = useContext(AuthApiCtx)
  if (!ctx) throw new Error('useAuthApi must be used inside AuthProvider')
  return ctx
}
