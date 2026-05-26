export const config = {
  appName: 'MaintainPro',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '/api/v1',
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const
