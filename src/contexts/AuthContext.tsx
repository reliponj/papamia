import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import {
  apiLogin,
  apiRegister,
  apiGetMe,
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
  type UserMe,
} from '../services/api'

interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  user: UserMe | null
}

interface AuthApi {
  login: (email: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
  refetchUser: () => Promise<void>
}

const AuthStateCtx = createContext<AuthState | null>(null)
const AuthApiCtx = createContext<AuthApi | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<UserMe | null>(null)

  const loadUser = useCallback(async () => {
    try {
      const me = await apiGetMe()
      setUser(me)
    } catch {
      setUser(null)
    }
  }, [])

  useEffect(() => {
    const hasTokens = Boolean(getAccessToken() || getRefreshToken())
    if (hasTokens) {
      setIsAuthenticated(true)
      loadUser().finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }
  }, [loadUser])

  const login = useCallback(async (email: string, password: string) => {
    const data = await apiLogin(email, password)
    setTokens(data.accessToken, data.refreshToken)
    setIsAuthenticated(true)
    const me = await apiGetMe()
    setUser(me)
  }, [])

  const register = useCallback(async (username: string, email: string, password: string) => {
    const data = await apiRegister(username, email, password)
    setTokens(data.accessToken, data.refreshToken)
    setIsAuthenticated(true)
    const me = await apiGetMe().catch(() => null)
    setUser(me)
  }, [])

  const logout = useCallback(() => {
    clearTokens()
    setIsAuthenticated(false)
    setUser(null)
  }, [])

  const refetchUser = useCallback(async () => {
    await loadUser()
  }, [loadUser])

  return (
    <AuthStateCtx.Provider value={{ isAuthenticated, isLoading, user }}>
      <AuthApiCtx.Provider value={{ login, register, logout, refetchUser }}>
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
