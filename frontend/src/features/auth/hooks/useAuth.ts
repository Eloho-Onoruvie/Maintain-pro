import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getDefaultPathForRole } from '@/app/portal.config'
import { useAuthStore } from '@/app/store'
import type { User } from '@/types/user.types'

import { authService } from '../services/auth.service'
import type { AuthUser, LoginCredentials, RegisterPayload } from '../types/auth.types'
import { isAuthMockFallbackEnabled, shouldPreferMockAuth } from '../utils/authConfig'
import { createMockLoginSession, createMockRegisterSession } from '../utils/mockAuth'
import { setOrganizationName } from '@/utils/organization'

function toUser(authUser: AuthUser): User {
  const [firstName = authUser.name, ...rest] = authUser.name.split(' ')
  const now = new Date().toISOString()

  return {
    id: authUser.id,
    firstName,
    lastName: rest.join(' '),
    email: authUser.email,
    role: authUser.role as User['role'],
    isActive: true,
    createdAt: now,
    updatedAt: now,
  }
}

function isValidAuthResponse(
  data: unknown,
): data is { user: AuthUser; tokens: { accessToken: string } } {
  if (!data || typeof data !== 'object') return false
  const record = data as Record<string, unknown>
  const user = record.user as AuthUser | undefined
  const tokens = record.tokens as { accessToken?: string } | undefined
  return Boolean(user?.email && user?.role && tokens?.accessToken)
}

export function useAuth() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const token = useAuthStore((state) => state.token)
  const setSession = useAuthStore((state) => state.login)
  const clearSession = useAuthStore((state) => state.logout)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const redirectAfterAuth = (authUser: User) => {
    navigate(getDefaultPathForRole(authUser.role), { replace: true })
  }

  const completeSession = (sessionUser: User, accessToken: string) => {
    setSession(sessionUser, accessToken)
    redirectAfterAuth(sessionUser)
  }

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true)
    setError(null)

    try {
      if (shouldPreferMockAuth()) {
        const mock = createMockLoginSession(credentials)
        completeSession(mock.user, mock.token)
        return
      }

      const response = await authService.login(credentials)
      if (!isValidAuthResponse(response)) {
        throw new Error('Invalid response from authentication server')
      }

      completeSession(toUser(response.user), response.tokens.accessToken)
    } catch (err: unknown) {
      if (isAuthMockFallbackEnabled()) {
        const mock = createMockLoginSession(credentials)
        completeSession(mock.user, mock.token)
        return
      }

      const message =
        err instanceof Error
          ? err.message
          : (err as { message?: string })?.message ?? 'Login failed. Check your credentials.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (payload: RegisterPayload) => {
    setIsLoading(true)
    setError(null)

    const persistOrgName = () => {
      if (payload.signupType === 'organization' && payload.company) {
        setOrganizationName(payload.company)
      }
    }

    try {
      if (shouldPreferMockAuth()) {
        const mock = createMockRegisterSession(payload)
        persistOrgName()
        completeSession(mock.user, mock.token)
        return
      }

      const response = await authService.register(payload)
      if (!isValidAuthResponse(response)) {
        throw new Error('Invalid response from authentication server')
      }

      persistOrgName()
      completeSession(toUser(response.user), response.tokens.accessToken)
    } catch (err: unknown) {
      if (isAuthMockFallbackEnabled()) {
        const mock = createMockRegisterSession(payload)
        persistOrgName()
        completeSession(mock.user, mock.token)
        return
      }

      const message =
        err instanceof Error
          ? err.message
          : (err as { message?: string })?.message ?? 'Registration failed. Please try again.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    authService.logout().catch(() => {})
    clearSession()
    navigate('/', { replace: true })
  }

  return {
    user,
    token,
    isAuthenticated: Boolean(user && token),
    isLoading,
    error,
    login,
    register,
    logout,
    clearError: () => setError(null),
  }
}
