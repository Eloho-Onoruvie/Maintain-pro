export type SignupType = 'organization' | 'technician' | 'vendor'

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterPayload {
  signupType: SignupType
  firstName: string
  lastName: string
  email: string
  password: string
  company?: string
  role?: string
  industry?: string
  /** Technician-specific */
  trade?: string
  yearsExperience?: string
  inviteCode?: string
  /** Vendor-specific */
  businessName?: string
  serviceCategories?: string[]
  taxId?: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken?: string
  expiresAt?: number
}

export interface AuthUser {
  id: string
  name: string
  email: string
  role: string
  company?: string
}

export const SIGNUP_PATHS = {
  organization: '/signup/organization',
  technician: '/signup/technician',
  vendor: '/signup/vendor',
} as const
