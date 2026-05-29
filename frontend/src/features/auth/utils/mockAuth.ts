import type { User } from '@/types/user.types'
import { USER_ROLES } from '@/types/user.types'

import type { LoginCredentials, RegisterPayload } from '../types/auth.types'

function resolveSignupRole(payload: RegisterPayload): User['role'] {
  const allowed = Object.values(USER_ROLES) as string[]
  if (payload.role && allowed.includes(payload.role)) {
    return payload.role as User['role']
  }

  switch (payload.signupType) {
    case 'technician':
      return USER_ROLES.TECHNICIAN
    case 'vendor':
      return USER_ROLES.VENDOR
    default:
      return USER_ROLES.FACILITY_MANAGER
  }
}

export function createMockLoginSession(credentials: LoginCredentials): { user: User; token: string } {
  const now = new Date().toISOString()
  const email = credentials.email.toLowerCase()

  let role: User['role'] = USER_ROLES.STAFF
  if (email.includes('admin')) role = USER_ROLES.ADMIN
  else if (email.includes('manager')) role = USER_ROLES.FACILITY_MANAGER
  else if (email.includes('tech')) role = USER_ROLES.TECHNICIAN
  else if (email.includes('vendor')) role = USER_ROLES.VENDOR
  else if (email.includes('finance')) role = USER_ROLES.FINANCE

  return {
    user: {
      id: 'mock-user',
      firstName: 'Demo',
      lastName: 'User',
      email: credentials.email,
      role,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
    token: 'mock-jwt-token',
  }
}

export function createMockRegisterSession(payload: RegisterPayload): { user: User; token: string } {
  const now = new Date().toISOString()
  const role = resolveSignupRole(payload)

  return {
    user: {
      id: `mock-${Date.now()}`,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      role,
      department: payload.company ?? payload.businessName,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
    token: 'mock-jwt-token',
  }
}
