import { USER_ROLES, type UserRole } from '@/types/user.types'

/**
 * Org portal segment → roles allowed to ACCESS that page.
 * Omit a segment (or set undefined) = all authenticated org roles can access.
 *
 * Access ≠ management. Fine-grained "can manage" flags live in useRoleAccess.
 * This table controls whether the route renders at all (RoleRoute guard).
 *
 * PRD mapping:
 *  US-01 FM/Admin → preventive-maintenance, work-orders/new
 *  US-02 FM/Admin → dashboard (no guard — all roles see their own dashboard)
 *  US-03 FM/Admin/Finance(view) → vendors (Finance needs read to check spend vs contract)
 *  US-04 Technician → work-orders 
 *  US-05 Technician → work-orders 
 *  US-08 Staff → service-requests (no guard — all org roles can view SR page)
 *  US-09 Staff → service-requests (same)
 *  US-10 Finance/Admin → approvals, invoices
 *  US-11 Finance/Admin/FM → reports
 *  US-12 Finance/Admin → invoices
 *  US-13 Admin/FM → locations
 *  US-14 Admin → settings
 */
export const ORG_ROUTE_ACCESS: Partial<Record<string, UserRole[]>> = {
  // Work order creation: FM and Admin only (US-01 generates via PM; US-02 via FM dashboard)
  'work-orders/new': [USER_ROLES.ADMIN, USER_ROLES.FACILITY_MANAGER],

  // Locations: Admin + FM manage; no one else needs the locations page (US-13)
  locations: [USER_ROLES.ADMIN, USER_ROLES.FACILITY_MANAGER],

  // PM: Admin + FM manage; Technician (TECH portal) views via their own portal — not needed here
  'preventive-maintenance': [USER_ROLES.ADMIN, USER_ROLES.FACILITY_MANAGER],

  // Assets: Admin + FM manage; Staff can VIEW their workplace assets (US-04 asset access
  // for Technician is in TECH portal, handled by isTechPortal flag in useRoleAccess)
  assets: [USER_ROLES.ADMIN, USER_ROLES.FACILITY_MANAGER, USER_ROLES.STAFF, USER_ROLES.TECHNICIAN],

  // Vendors: Admin + FM manage contracts (US-03); Finance VIEW-ONLY to check spend vs
  // contract value (US-11: "breakdown by vendor", US-03: "track spend vs. contract value")
  vendors: [USER_ROLES.ADMIN, USER_ROLES.FACILITY_MANAGER, USER_ROLES.FINANCE],

  // Inventory: Admin + FM manage stock; Finance views for cost reporting (US-11)
  inventory: [USER_ROLES.ADMIN, USER_ROLES.FACILITY_MANAGER, USER_ROLES.FINANCE],

  // Reports: FM monitors operations (US-02); Finance analyzes costs (US-11); Admin overview
  reports: [USER_ROLES.ADMIN, USER_ROLES.FACILITY_MANAGER, USER_ROLES.FINANCE],

  // Finance-specific pages (US-10, US-12)
  approvals: [USER_ROLES.FINANCE, USER_ROLES.ADMIN],
  invoices: [USER_ROLES.FINANCE, USER_ROLES.ADMIN],

  // Settings: Admin configures system (US-14); FM manages their org profile
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
