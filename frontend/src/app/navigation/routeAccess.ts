import { USER_ROLES, type UserRole } from '@/types/user.types'

/** Org portal segment → allowed roles. Omit or `undefined` = all org roles. */
export const ORG_ROUTE_ACCESS: Partial<Record<string, UserRole[]>> = {
  'work-orders/new': [USER_ROLES.ADMIN, USER_ROLES.FACILITY_MANAGER],
  locations: [USER_ROLES.ADMIN, USER_ROLES.FACILITY_MANAGER],
  'preventive-maintenance': [USER_ROLES.ADMIN, USER_ROLES.FACILITY_MANAGER],
  assets: [USER_ROLES.ADMIN, USER_ROLES.FACILITY_MANAGER, USER_ROLES.STAFF],
  vendors: [USER_ROLES.ADMIN, USER_ROLES.FACILITY_MANAGER],
  inventory: [USER_ROLES.ADMIN, USER_ROLES.FACILITY_MANAGER, USER_ROLES.FINANCE],
  reports: [USER_ROLES.ADMIN, USER_ROLES.FACILITY_MANAGER, USER_ROLES.FINANCE],
  settings: [USER_ROLES.ADMIN, USER_ROLES.FACILITY_MANAGER],
}

export function canAccessOrgSegment(role: UserRole, segment: string): boolean {
  const allowed = ORG_ROUTE_ACCESS[segment]
  if (!allowed) return true
  return allowed.includes(role)
}

export function filterNavItemsByRole<T extends { roles?: UserRole[] }>(
  items: T[],
  role: UserRole | undefined,
): T[] {
  if (!role) return items
  return items.filter((item) => !item.roles || item.roles.includes(role))
}
