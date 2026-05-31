import type { UserRole } from '@/types/user.types'
import { USER_ROLES } from '@/types/user.types'

export const PORTALS = {
  ORG:    'org',
  VENDOR: 'vendor',
} as const

export type Portal = (typeof PORTALS)[keyof typeof PORTALS]

/**
 * URL segment for each role within its portal.
 *   /org/admin/dashboard
 *   /org/facility_manager/dashboard
 *   /vendor/team_lead/dashboard
 *   /vendor/technician/dashboard
 */
export const ROLE_URL_SEGMENT: Record<UserRole, string> = {
  [USER_ROLES.ADMIN]:              'admin',
  [USER_ROLES.FACILITY_MANAGER]:   'facility_manager',
  [USER_ROLES.TECHNICIAN]:         'technician',
  [USER_ROLES.STAFF]:              'staff',
  [USER_ROLES.FINANCE]:            'finance',
  [USER_ROLES.VENDOR_TEAM_LEAD]:   'team_lead',
  [USER_ROLES.VENDOR_TECHNICIAN]:  'technician',
}

/** Which portal each role belongs to */
const ROLE_PORTAL_MAP: Record<UserRole, Portal> = {
  [USER_ROLES.ADMIN]:             PORTALS.ORG,
  [USER_ROLES.FACILITY_MANAGER]:  PORTALS.ORG,
  [USER_ROLES.STAFF]:             PORTALS.ORG,
  [USER_ROLES.FINANCE]:           PORTALS.ORG,
  [USER_ROLES.TECHNICIAN]:        PORTALS.ORG,
  [USER_ROLES.VENDOR_TEAM_LEAD]:  PORTALS.VENDOR,
  [USER_ROLES.VENDOR_TECHNICIAN]: PORTALS.VENDOR,
}

const PORTAL_ROLES: Record<Portal, UserRole[]> = {
  [PORTALS.ORG]: [
    USER_ROLES.ADMIN,
    USER_ROLES.FACILITY_MANAGER,
    USER_ROLES.STAFF,
    USER_ROLES.FINANCE,
    USER_ROLES.TECHNICIAN,
  ],
  [PORTALS.VENDOR]: [
    USER_ROLES.VENDOR_TEAM_LEAD,
    USER_ROLES.VENDOR_TECHNICIAN,
  ],
}

export function getPortalForRole(role: UserRole): Portal {
  return ROLE_PORTAL_MAP[role]
}

export function getRolesForPortal(portal: Portal): UserRole[] {
  return PORTAL_ROLES[portal]
}

export function isRoleAllowedInPortal(role: UserRole, portal: Portal): boolean {
  return PORTAL_ROLES[portal].includes(role)
}

/**
 * Base path for a role: /org/facility_manager  or  /vendor/team_lead
 */
export function getRoleBasePath(role: UserRole): string {
  const portal = getPortalForRole(role)
  const segment = ROLE_URL_SEGMENT[role]
  return `/${portal}/${segment}`
}

/**
 * Full path for a role + optional page segment.
 *   buildPortalPath('facility_manager', '/work-orders') → /org/facility_manager/work-orders
 */
export function buildPortalPath(roleOrPortal: UserRole | Portal, segment = ''): string {
  let base: string
  if (roleOrPortal === PORTALS.ORG || roleOrPortal === PORTALS.VENDOR) {
    base = `/${roleOrPortal}`
  } else {
    base = getRoleBasePath(roleOrPortal as UserRole)
  }
  if (!segment) return `${base}/dashboard`
  const normalized = segment.startsWith('/') ? segment : `/${segment}`
  return `${base}${normalized}`
}

export function getDefaultPathForRole(role: UserRole): string {
  return `${getRoleBasePath(role)}/dashboard`
}

/**
 * Parse portal AND role-segment from a pathname like /org/admin/work-orders
 * Returns { portal, roleSegment } or null.
 */
export function parsePortalFromPath(pathname: string): Portal | null {
  const match = pathname.match(/^\/(org|vendor)\//)
  return match ? (match[1] as Portal) : null
}

export function parseRoleSegmentFromPath(pathname: string): string | null {
  const match = pathname.match(/^\/(org|vendor)\/([^/]+)/)
  return match ? match[2] : null
}

/** Resolve the UserRole from a portal + URL segment */
export function resolveRoleFromSegment(portal: Portal, segment: string): UserRole | null {
  for (const [role, seg] of Object.entries(ROLE_URL_SEGMENT) as [UserRole, string][]) {
    if (seg === segment && getPortalForRole(role) === portal) return role
  }
  return null
}

/** Legacy compat: getPortalBasePath kept so Sidebar import doesn't break */
export function getPortalBasePath(portal: Portal): string {
  return `/${portal}`
}
