import { Navigate, useParams } from 'react-router-dom'

import {
  getDefaultPathForRole,
  getPortalForRole,
  isRoleAllowedInPortal,
  resolveRoleFromSegment,
  type Portal,
} from '@/app/portal.config'
import { useAuthStore } from '@/app/store'

interface PortalRouteProps {
  portal: Portal
  children: React.ReactNode
}

/**
 * Ensures:
 * 1. User is authenticated
 * 2. User belongs to this portal
 * 3. The role segment in the URL matches the user's actual role
 */
export default function PortalRoute({ portal, children }: PortalRouteProps) {
  const user = useAuthStore((state) => state.user)
  const { roleSegment } = useParams<{ roleSegment: string }>()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!isRoleAllowedInPortal(user.role, portal)) {
    return <Navigate to={getDefaultPathForRole(user.role)} replace />
  }

  // If the URL role segment doesn't match the logged-in user's role, redirect
  // to their correct segment so URLs stay canonical
  if (roleSegment) {
    const expectedRole = resolveRoleFromSegment(portal, roleSegment)
    if (!expectedRole || expectedRole !== user.role) {
      return <Navigate to={getDefaultPathForRole(user.role)} replace />
    }
  }

  return <>{children}</>
}

export function RootRedirect() {
  const user = useAuthStore((state) => state.user)
  const token = useAuthStore((state) => state.token)

  if (user && token) {
    return <Navigate to={getDefaultPathForRole(user.role)} replace />
  }

  return <Navigate to="/login" replace />
}

interface LegacyPortalRedirectProps {
  segment: string
}

/** Redirect legacy /app/org/... and bare /dashboard routes */
export function LegacyPortalRedirect({ segment }: LegacyPortalRedirectProps) {
  const user = useAuthStore((state) => state.user)
  const token = useAuthStore((state) => state.token)

  if (!user || !token) {
    return <Navigate to="/login" replace />
  }

  const path = segment.startsWith('/') ? segment : `/${segment}`
  return <Navigate to={`${getDefaultPathForRole(user.role).replace('/dashboard', '')}${path}`} replace />
}

export function LegacyWorkOrderDetailRedirect() {
  const { id } = useParams<{ id: string }>()
  const user = useAuthStore((state) => state.user)

  if (!user) return <Navigate to="/login" replace />

  const base = getDefaultPathForRole(user.role).replace('/dashboard', '')
  return <Navigate to={`${base}/work-orders/${id}`} replace />
}

export function LegacyAssetDetailRedirect() {
  const { id } = useParams<{ id: string }>()
  const user = useAuthStore((state) => state.user)

  if (!user) return <Navigate to="/login" replace />

  const base = getDefaultPathForRole(user.role).replace('/dashboard', '')
  return <Navigate to={`${base}/assets/${id}`} replace />
}
