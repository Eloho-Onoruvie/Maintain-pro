import { Navigate, useParams } from 'react-router-dom'

import {
  getDefaultPathForRole,
  getPortalForRole,
  isRoleAllowedInPortal,
  type Portal,
} from '@/app/portal.config'
import { useAuthStore } from '@/app/store'

interface PortalRouteProps {
  portal: Portal
  children: React.ReactNode
}

/** Ensures the authenticated user belongs to the requested portal */
export default function PortalRoute({ portal, children }: PortalRouteProps) {
  const user = useAuthStore((state) => state.user)

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!isRoleAllowedInPortal(user.role, portal)) {
    return <Navigate to={getDefaultPathForRole(user.role)} replace />
  }

  return children
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

/** Redirect legacy flat routes to portal-prefixed routes */
export function LegacyPortalRedirect({ segment }: LegacyPortalRedirectProps) {
  const user = useAuthStore((state) => state.user)
  const token = useAuthStore((state) => state.token)

  if (!user || !token) {
    return <Navigate to="/login" replace />
  }

  const portal = getPortalForRole(user.role)
  const path = segment.startsWith('/') ? segment : `/${segment}`

  return <Navigate to={`/app/${portal}${path}`} replace />
}

export function LegacyWorkOrderDetailRedirect() {
  const { id } = useParams<{ id: string }>()
  const user = useAuthStore((state) => state.user)

  if (!user) return <Navigate to="/login" replace />

  const portal = getPortalForRole(user.role)
  return <Navigate to={`/app/${portal}/work-orders/${id}`} replace />
}

export function LegacyAssetDetailRedirect() {
  const { id } = useParams<{ id: string }>()
  const user = useAuthStore((state) => state.user)

  if (!user) return <Navigate to="/login" replace />

  const portal = getPortalForRole(user.role)
  return <Navigate to={`/app/${portal}/assets/${id}`} replace />
}
