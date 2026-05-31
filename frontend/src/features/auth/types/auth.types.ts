export type SignupType = 'organization' | 'vendor'

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
  vendor: '/signup/vendor',
} as const

/** Sent by an Admin/FM to invite an internal org member */
export interface InvitePayload {
  email: string
  role: string
  firstName?: string
  lastName?: string
  department?: string
  message?: string
}

/** Submitted by the invitee when they accept via the email link */
export interface AcceptInvitePayload {
  token: string
  firstName: string
  lastName: string
  password: string
}

/** Shape returned when validating an invite token */
export interface InviteTokenInfo {
  token: string
  email: string
  role: string
  organizationName: string
  inviterName: string
  expiresAt: number
}
