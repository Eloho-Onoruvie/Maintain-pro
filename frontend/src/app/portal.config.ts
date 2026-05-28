import type { UserRole } from '@/types/user.types'
import { USER_ROLES } from '@/types/user.types'

export const PORTALS = {
  ORG: 'org',
  TECH: 'tech',
  VENDOR: 'vendor',
} as const

export type Portal = (typeof PORTALS)[keyof typeof PORTALS]

const ROLE_PORTAL_MAP: Record<UserRole, Portal> = {
  [USER_ROLES.ADMIN]: PORTALS.ORG,
  [USER_ROLES.FACILITY_MANAGER]: PORTALS.ORG,
  [USER_ROLES.STAFF]: PORTALS.ORG,
  [USER_ROLES.FINANCE]: PORTALS.ORG,
  [USER_ROLES.TECHNICIAN]: PORTALS.TECH,
  [USER_ROLES.VENDOR]: PORTALS.VENDOR,
}

const PORTAL_ROLES: Record<Portal, UserRole[]> = {
  [PORTALS.ORG]: [
    USER_ROLES.ADMIN,
    USER_ROLES.FACILITY_MANAGER,
    USER_ROLES.STAFF,
    USER_ROLES.FINANCE,
  ],
  [PORTALS.TECH]: [USER_ROLES.TECHNICIAN],
  [PORTALS.VENDOR]: [USER_ROLES.VENDOR],
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

export function getPortalBasePath(portal: Portal): string {
  return `/app/${portal}`
}

export function buildPortalPath(portal: Portal, segment = ''): string {
  const base = getPortalBasePath(portal)
  if (!segment) return `${base}/dashboard`
  const normalized = segment.startsWith('/') ? segment : `/${segment}`
  return `${base}${normalized}`
}

export function getDefaultPathForRole(role: UserRole): string {
  return buildPortalPath(getPortalForRole(role), '/dashboard')
}

export function parsePortalFromPath(pathname: string): Portal | null {
  const match = pathname.match(/^\/app\/(org|tech|vendor)/)
  return match ? (match[1] as Portal) : null
}
