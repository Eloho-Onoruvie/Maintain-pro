/** When true, failed auth requests fall back to local mock sessions instead of showing an error. */
export function isAuthMockFallbackEnabled(): boolean {
  if (import.meta.env.VITE_MOCK_AUTH === 'false') return false
  if (import.meta.env.VITE_MOCK_AUTH === 'true') return true
  return import.meta.env.DEV
}

/** In dev, skip the API by default so login/register work without a running backend. */
export function shouldPreferMockAuth(): boolean {
  return isAuthMockFallbackEnabled() && import.meta.env.VITE_AUTH_USE_API !== 'true'
}
