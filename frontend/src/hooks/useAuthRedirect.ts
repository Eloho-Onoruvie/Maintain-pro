import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export function useAuthRedirect(isAuthenticated: boolean, redirectTo = '/dashboard') {
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo, { replace: true })
    }
  }, [isAuthenticated, navigate, redirectTo])
}
