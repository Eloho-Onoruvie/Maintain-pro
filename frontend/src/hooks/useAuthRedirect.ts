import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { getDefaultPathForRole } from '@/app/portal.config'
import { useAuthStore } from '@/app/store'

export function useAuthRedirect(isAuthenticated: boolean) {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(getDefaultPathForRole(user.role), { replace: true })
    }
  }, [isAuthenticated, navigate, user])
}
