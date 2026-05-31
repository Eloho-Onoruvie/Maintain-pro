import type { User } from '@/types/user.types'
import { USER_ROLES } from '@/types/user.types'

import type { LoginCredentials, RegisterPayload } from '../types/auth.types'

function resolveSignupRole(payload: RegisterPayload): User['role'] {
  const allowed = Object.values(USER_ROLES) as string[]
  if (payload.role && allowed.includes(payload.role)) {
    return payload.role as User['role']
  }

  switch (payload.signupType) {
    case 'vendor':
      return USER_ROLES.VENDOR_TEAM_LEAD
    default:
      return USER_ROLES.FACILITY_MANAGER
  }
}

function mockProfileForRole(role: User['role']): Pick<User, 'id' | 'firstName' | 'lastName' | 'department'> {
  switch (role) {
    case USER_ROLES.ADMIN:
      return { id: 'user-admin', firstName: 'James', lastName: 'Park', department: 'IT' }
    case USER_ROLES.FACILITY_MANAGER:
      return { id: 'user-1', firstName: 'Sarah', lastName: 'Chen', department: 'Operations' }
    case USER_ROLES.TECHNICIAN:
      return { id: 'user-2', firstName: 'Mike', lastName: 'Rodriguez', department: 'Maintenance' }
    case USER_ROLES.FINANCE:
      return { id: 'user-3', firstName: 'Emily', lastName: 'Watson', department: 'Finance' }
    case USER_ROLES.VENDOR_TEAM_LEAD:
      return { id: 'vendor-1', firstName: 'David', lastName: 'Lee', department: 'ProTech HVAC Services' }
    default:
      return { id: 'staff-1', firstName: 'John', lastName: 'Smith', department: 'General' }
  }
}

export function createMockLoginSession(credentials: LoginCredentials): { user: User; token: string } {
  const now = new Date().toISOString()
  const email = credentials.email.toLowerCase()

  let role: User['role'] = USER_ROLES.STAFF
  if (email.includes('admin')) role = USER_ROLES.ADMIN
  else if (email.includes('manager')) role = USER_ROLES.FACILITY_MANAGER
  else if (email.includes('tech')) role = USER_ROLES.TECHNICIAN
  else if (email.includes('vtech')) role = USER_ROLES.VENDOR_TECHNICIAN
  else if (email.includes('vendor')) role = USER_ROLES.VENDOR_TEAM_LEAD
  else if (email.includes('finance')) role = USER_ROLES.FINANCE

  const profile = mockProfileForRole(role)

  return {
    user: {
      ...profile,
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
