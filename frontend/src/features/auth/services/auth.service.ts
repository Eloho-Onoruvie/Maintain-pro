import { httpClient } from '@/services/httpClient'
import { ENDPOINTS } from '@/services/endpoints'
import type { LoginCredentials, RegisterPayload, AuthTokens, AuthUser } from '../types/auth.types'

interface LoginResponse {
  user: AuthUser
  tokens: AuthTokens
}

export const authService = {
  login: (credentials: LoginCredentials) =>
    httpClient.post<LoginResponse>(ENDPOINTS.AUTH.LOGIN, credentials),

  register: (payload: RegisterPayload) =>
    httpClient.post<LoginResponse>(ENDPOINTS.AUTH.REGISTER, payload),

  logout: () =>
    httpClient.post<void>(ENDPOINTS.AUTH.LOGOUT, {}),

  forgotPassword: (email: string) =>
    httpClient.post<{ message: string }>(ENDPOINTS.AUTH.FORGOT_PASSWORD, { email }),

  resetPassword: (payload: { token: string; password: string }) =>
    httpClient.post<{ message: string }>(ENDPOINTS.AUTH.RESET_PASSWORD, payload),

  getMe: () =>
    httpClient.get<AuthUser>(ENDPOINTS.AUTH.ME),
}
