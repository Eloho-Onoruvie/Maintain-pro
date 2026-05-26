import { Navigate } from 'react-router-dom'

import { useAuthStore } from '@/app/store'

import type { UserRole } from '@/types/user.types'

interface RoleRouteProps {
  children: React.ReactNode
  allowedRoles: UserRole[]
}

export default function RoleRoute({
  children,
  allowedRoles,
}: RoleRouteProps) {
  const user = useAuthStore((state) => state.user)

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    )
  }

  const hasAccess = allowedRoles.includes(
    user.role
  )

  if (!hasAccess) {
    return (
      <Navigate
        to="/unauthorized"
        replace
      />
    )
  }

  return children
}