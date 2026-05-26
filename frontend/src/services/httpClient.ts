import type { ApiError } from '@/types/api.types'

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>
}

function buildUrl(url: string, params?: Record<string, string | number | boolean>): string {
  if (!params) return url
  const qs = new URLSearchParams(
    Object.entries(params).map(([k, v]) => [k, String(v)])
  )
  return `${url}?${qs.toString()}`
}

async function request<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const { params, ...init } = options
  const finalUrl = buildUrl(url, params)

  const token = localStorage.getItem('auth_token')

  const response = await fetch(finalUrl, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  })

  if (!response.ok) {
    const error: ApiError = await response.json().catch(() => ({
      message: 'An unexpected error occurred',
      status: response.status,
    }))
    throw error
  }

  return response.json()
}

export const httpClient = {
  get: <T>(url: string, options?: RequestOptions) =>
    request<T>(url, { method: 'GET', ...options }),
  post: <T>(url: string, body: unknown, options?: RequestOptions) =>
    request<T>(url, { method: 'POST', body: JSON.stringify(body), ...options }),
  put: <T>(url: string, body: unknown, options?: RequestOptions) =>
    request<T>(url, { method: 'PUT', body: JSON.stringify(body), ...options }),
  patch: <T>(url: string, body: unknown, options?: RequestOptions) =>
    request<T>(url, { method: 'PATCH', body: JSON.stringify(body), ...options }),
  delete: <T>(url: string, options?: RequestOptions) =>
    request<T>(url, { method: 'DELETE', ...options }),
}
