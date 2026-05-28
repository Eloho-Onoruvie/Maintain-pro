import { useMemo, useState } from 'react'

import { mockDelay, useAsyncResource } from '@/hooks/useAsyncResource'

import { mockWorkOrders } from '../services/workOrders.service'
import type { WorkOrder } from '@/types/common.types'
import type { WorkOrderFilters } from '../types/workOrder.types'

async function fetchWorkOrders(): Promise<WorkOrder[]> {
  await mockDelay()
  return mockWorkOrders
}

export function useWorkOrders(initialFilters: WorkOrderFilters = {}) {
  const [filters, setFilters] = useState<WorkOrderFilters>(initialFilters)
  const { data, isLoading, error, refetch } = useAsyncResource(fetchWorkOrders, [])

  const allOrders = data ?? []

  const workOrders = useMemo<WorkOrder[]>(() => {
    return allOrders.filter((order) => {
      if (filters.status && filters.status !== 'all' && order.status !== filters.status) return false
      if (filters.priority && filters.priority !== 'all' && order.priority !== filters.priority) return false
      if (filters.search) {
        const q = filters.search.toLowerCase()
        if (!order.title.toLowerCase().includes(q) && !order.id.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [allOrders, filters])

  const stats = useMemo(
    () => ({
      total: allOrders.length,
      open: allOrders.filter((o) => o.status === 'open').length,
      inProgress: allOrders.filter((o) => o.status === 'in_progress').length,
      completed: allOrders.filter((o) => o.status === 'completed').length,
      critical: allOrders.filter((o) => o.priority === 'critical').length,
    }),
    [allOrders],
  )

  return { workOrders, stats, filters, setFilters, isLoading, error, refetch }
}
