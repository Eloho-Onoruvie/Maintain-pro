import { useMemo, useState } from 'react'

import { useAuthStore } from '@/app/store'
import { usePortal } from '@/hooks/usePortal'
import { scopeWorkOrdersForUser } from '@/features/dashboard/utils/roleScope'
import { useMockDataStore } from '@/services/mockDataStore'
import type { WorkOrder } from '@/types/common.types'
import type { WorkOrderFilters } from '../types/workOrder.types'

export function useWorkOrders(initialFilters: WorkOrderFilters = {}) {
  const [filters, setFilters] = useState<WorkOrderFilters>(initialFilters)
  const allOrders = useMockDataStore((s) => s.workOrders)
  const user = useAuthStore((state) => state.user)
  const portal = usePortal()

  const scopedOrders = useMemo(
    () => scopeWorkOrdersForUser(user, portal, allOrders),
    [allOrders, portal, user],
  )

  const workOrders = useMemo<WorkOrder[]>(() => {
    return scopedOrders.filter((order) => {
      if (filters.status && filters.status !== 'all' && order.status !== filters.status) return false
      if (filters.priority && filters.priority !== 'all' && order.priority !== filters.priority)
        return false
      if (filters.search) {
        const q = filters.search.toLowerCase()
        if (!order.title.toLowerCase().includes(q) && !order.id.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [scopedOrders, filters])

  const stats = useMemo(
    () => ({
      total: scopedOrders.length,
      open: scopedOrders.filter((o) => o.status === 'open').length,
      inProgress: scopedOrders.filter((o) => o.status === 'in_progress').length,
      completed: scopedOrders.filter((o) => o.status === 'completed').length,
      critical: scopedOrders.filter((o) => o.priority === 'critical').length,
    }),
    [scopedOrders],
  )

  const refetch = () => {
    /* store updates trigger re-render automatically */
  }

  return {
    workOrders,
    stats,
    filters,
    setFilters,
    isLoading: false,
    error: null as Error | null,
    refetch,
  }
}
