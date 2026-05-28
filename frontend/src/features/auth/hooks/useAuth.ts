import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getDefaultPathForRole } from '@/app/portal.config'
import { useAuthStore } from '@/app/store'
import type { User } from '@/types/user.types'
import { USER_ROLES } from '@/types/user.types'

import { authService } from '../services/auth.service'
import type { LoginCredentials, RegisterPayload } from '../types/auth.types'
import { setOrganizationName } from '@/utils/organization'

function toUser(authUser: { id: string; name: string; email: string; role: string }): User {
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

function defaultRoleForSignup(payload: RegisterPayload): User['role'] {
  switch (payload.signupType) {
    case 'technician':
      return USER_ROLES.TECHNICIAN
    case 'vendor':
      return USER_ROLES.VENDOR
    default:
      return USER_ROLES.FACILITY_MANAGER
  }
}

/** Dev-only mock session when backend is unavailable */
function createMockSession(credentials: LoginCredentials): { user: User; token: string } {
  const now = new Date().toISOString()
  const email = credentials.email.toLowerCase()

  let role: User['role'] = USER_ROLES.STAFF
  if (email.includes('admin')) role = USER_ROLES.ADMIN
  else if (email.includes('manager')) role = USER_ROLES.FACILITY_MANAGER
  else if (email.includes('tech')) role = USER_ROLES.TECHNICIAN
  else if (email.includes('vendor')) role = USER_ROLES.VENDOR
  else if (email.includes('finance')) role = USER_ROLES.FINANCE

  const user: User = {
    id: 'mock-user',
    firstName: 'Demo',
    lastName: 'User',
    email: credentials.email,
    role,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  }

  return { user, token: 'mock-jwt-token' }
}

function createMockRegisterSession(payload: RegisterPayload): { user: User; token: string } {
  const now = new Date().toISOString()
  const role = defaultRoleForSignup(payload)

  const user: User = {
    id: `mock-${Date.now()}`,
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: payload.email,
    role,
    department: payload.company ?? payload.businessName,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  }

  return { user, token: 'mock-jwt-token' }
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

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true)
    setError(null)

    try {
      const { user: authUser, tokens } = await authService.login(credentials)
      const sessionUser = toUser(authUser)
      setSession(sessionUser, tokens.accessToken)
      redirectAfterAuth(sessionUser)
    } catch (err: unknown) {
      if (import.meta.env.DEV) {
        const mock = createMockSession(credentials)
        setSession(mock.user, mock.token)
        redirectAfterAuth(mock.user)
        return
      }
      setError((err as { message?: string })?.message ?? 'Login failed. Check your credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (payload: RegisterPayload) => {
    setIsLoading(true)
    setError(null)

    try {
      const { user: authUser, tokens } = await authService.register(payload)
      if (payload.signupType === 'organization' && payload.company) {
        setOrganizationName(payload.company)
      }
      const sessionUser = toUser(authUser)
      setSession(sessionUser, tokens.accessToken)
      redirectAfterAuth(sessionUser)
    } catch (err: unknown) {
      if (import.meta.env.DEV) {
        const mock = createMockRegisterSession(payload)
        if (payload.signupType === 'organization' && payload.company) {
          setOrganizationName(payload.company)
        }
        setSession(mock.user, mock.token)
        redirectAfterAuth(mock.user)
        return
      }
      setError((err as { message?: string })?.message ?? 'Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    authService.logout().catch(() => {})
    clearSession()
    navigate('/login', { replace: true })
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
