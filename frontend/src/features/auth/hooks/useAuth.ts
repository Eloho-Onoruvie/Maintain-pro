import { useState } from 'react'
import { authService } from '../services/auth.service'
import { useAuthStore } from '@/app/store'
import type { LoginCredentials, RegisterPayload } from '../types/auth.types'
import type { User } from '@/types/user.types'

export function useAuth() {
  const user = useAuthStore((state) => state.user)
  const token = useAuthStore((state) => state.token)
  const setSession = useAuthStore((state) => state.login)
  const clearSession = useAuthStore((state) => state.logout)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const toUser = (authUser: { id: string; name: string; email: string; role: string }): User => {
    const [firstName = authUser.name, ...rest] = authUser.name.split(' ')

    return {
      id: authUser.id,
      firstName,
      lastName: rest.join(' '),
      email: authUser.email,
      role: authUser.role as User['role'],
      isActive: true,
      createdAt: new Date(), // Changed to Date object
      updatedAt: new Date(), // Changed to Date object
    }
  }

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true)
    setError(null)
    try {
      const { user, tokens } = await authService.login(credentials)
      setSession(toUser(user), tokens.accessToken)
    } catch (err: unknown) {
      setError((err as { message?: string })?.message ?? 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (payload: RegisterPayload) => {
    setIsLoading(true)
    setError(null)
    try {
      const { user, tokens } = await authService.register(payload)
      setSession(toUser(user), tokens.accessToken)
    } catch (err: unknown) {
      setError((err as { message?: string })?.message ?? 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    authService.logout().catch(() => {})
    clearSession()
  }

  return { user, token, isAuthenticated: Boolean(user && token), isLoading, error, login, register, logout }
}
