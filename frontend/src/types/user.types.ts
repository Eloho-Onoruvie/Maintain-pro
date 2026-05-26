export const USER_ROLES = {
  FACILITY_MANAGER: 'facility_manager',
  TECHNICIAN: 'technician',
  VENDOR: 'vendor',
  STAFF: 'staff',
  FINANCE: 'finance',
  ADMIN: 'admin',
} as const

export type UserRole =
  (typeof USER_ROLES)[keyof typeof USER_ROLES]

export interface User {
  id: string

  firstName: string
  lastName: string

  email: string

  role: UserRole

  avatar?: string

  department?: string

  phone?: string

  isActive: boolean

  createdAt: string
  updatedAt: string
}