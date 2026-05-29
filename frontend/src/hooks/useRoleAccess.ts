import { useMemo } from 'react'

import { PORTALS } from '@/app/portal.config'
import { canAccessOrgSegment } from '@/app/navigation/routeAccess'
import { useAuthStore } from '@/app/store'
import { USER_ROLES } from '@/types/user.types'

import { usePortal } from './usePortal'

export function useRoleAccess() {
  const role = useAuthStore((state) => state.user?.role)
  const portal = usePortal()

  return useMemo(
    () => ({
      role,
      canAccessOrgSegment: (segment: string) =>
        role ? canAccessOrgSegment(role, segment) : false,
      canCreateWorkOrder:
        portal === PORTALS.ORG &&
        Boolean(role && canAccessOrgSegment(role, 'work-orders/new')),
      canSubmitServiceRequest: portal === PORTALS.ORG,
      canManageVendors:
        portal === PORTALS.ORG && role
          ? canAccessOrgSegment(role, 'vendors')
          : false,
      canManageAssets:
        portal === PORTALS.ORG
          ? Boolean(role && canAccessOrgSegment(role, 'assets'))
          : portal === PORTALS.TECH,
      canManagePm:
        portal === PORTALS.ORG
          ? Boolean(role && canAccessOrgSegment(role, 'preventive-maintenance'))
          : portal === PORTALS.TECH,
      /** Org/vendor sidebar administration — not the user profile page */
      canOpenOrgSettings:
        portal === PORTALS.VENDOR
          ? role === USER_ROLES.VENDOR
          : portal === PORTALS.ORG
            ? Boolean(role && canAccessOrgSegment(role, 'settings'))
            : false,
      canOpenSettings:
        portal === PORTALS.VENDOR
          ? role === USER_ROLES.VENDOR
          : portal === PORTALS.ORG
            ? Boolean(role && canAccessOrgSegment(role, 'settings'))
            : false,
      /** Staff & finance: view maintenance data, no create/edit/delete in org portal */
      isMaintenanceReadOnly:
        portal === PORTALS.ORG &&
        (role === USER_ROLES.STAFF || role === USER_ROLES.FINANCE),
    }),
    [portal, role],
  )
}

export type RoleAccess = ReturnType<typeof useRoleAccess>
