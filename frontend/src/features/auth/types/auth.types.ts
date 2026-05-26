export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterPayload {
  firstName: string
  lastName: string
  email: string
  password: string
  company: string
  role: string
  industry: string
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
