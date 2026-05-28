import { Navigate } from 'react-router-dom'

import { getDefaultPathForRole } from '@/app/portal.config'
import { useAuthStore } from '@/app/store'
import { LandingPage } from '@/features/public/pages/LandingPage'

/** Landing page at `/` — redirects authenticated users to their portal */
export function PublicHomeRoute() {
  const user = useAuthStore((state) => state.user)
  const token = useAuthStore((state) => state.token)
  const isHydrated = useAuthStore((state) => state.isHydrated)

  if (!isHydrated) return null

  if (user && token) {
    return <Navigate to={getDefaultPathForRole(user.role)} replace />
  }

  return <LandingPage />
}
