import { Navigate } from 'react-router-dom'

import { getDefaultPathForRole } from '@/app/portal.config'
import { useAuthStore } from '@/app/store'

interface GuestRouteProps {
  children: React.ReactNode
}

/** Redirect authenticated users away from auth pages */
export default function GuestRoute({ children }: GuestRouteProps) {
  const user = useAuthStore((state) => state.user)
  const token = useAuthStore((state) => state.token)
  const isHydrated = useAuthStore((state) => state.isHydrated)

  if (!isHydrated) return null

  if (user && token) {
    return <Navigate to={getDefaultPathForRole(user.role)} replace />
  }

  return children
}
