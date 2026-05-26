export const APP_NAME = 'MaintainPro'

export const WORK_ORDER_STATUSES = ['open', 'in_progress', 'pending', 'completed', 'cancelled'] as const
export const WORK_ORDER_PRIORITIES = ['critical', 'high', 'medium', 'low'] as const
export const PM_FREQUENCIES = ['daily', 'weekly', 'monthly', 'quarterly', 'yearly'] as const

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  DASHBOARD: '/dashboard',
  WORK_ORDERS: '/work-orders',
  WORK_ORDER_NEW: '/work-orders/new',
  WORK_ORDER_DETAIL: (id: string) => `/work-orders/${id}`,
  ASSETS: '/assets',
  LOCATIONS: '/locations',
  INVENTORY: '/inventory',
  VENDORS: '/vendors',
  PREVENTIVE_MAINTENANCE: '/preventive-maintenance',
  REPORTS: '/reports',
  SETTINGS: '/settings',
} as const
