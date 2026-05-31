import { useMemo } from 'react'

import { useAuthStore } from '@/app/store'
import { usePortal } from '@/hooks/usePortal'

import { useDashboardDateRange } from './useDashboardDateRange'
import { getRoleDashboardWorkOrders } from '../utils/roleScope'
import type { DashboardDateRange } from '../utils/dashboardDateRange'

export function useRoleDashboardDateRange(range: DashboardDateRange) {
  const user = useAuthStore((state) => state.user)
  const portal = usePortal()

  const scopedWorkOrders = useMemo(
    () => getRoleDashboardWorkOrders(user, portal),
    [portal, user],
  )

  return useDashboardDateRange(range, scopedWorkOrders)
}
