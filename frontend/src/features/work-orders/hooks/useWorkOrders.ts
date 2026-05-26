import { useState, useMemo } from 'react'
import { mockWorkOrders } from '../services/workOrders.service'
import type { WorkOrder } from '@/types/common.types'
import type { WorkOrderFilters } from '../types/workOrder.types'

export function useWorkOrders(initialFilters: WorkOrderFilters = {}) {
  const [filters, setFilters] = useState<WorkOrderFilters>(initialFilters)
  const [isLoading] = useState(false)

  const workOrders = useMemo<WorkOrder[]>(() => {
    return mockWorkOrders.filter((order) => {
      if (filters.status && filters.status !== 'all' && order.status !== filters.status) return false
      if (filters.priority && filters.priority !== 'all' && order.priority !== filters.priority) return false
      if (filters.search) {
        const q = filters.search.toLowerCase()
        if (!order.title.toLowerCase().includes(q) && !order.id.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [filters])

  const stats = useMemo(() => ({
    total: mockWorkOrders.length,
    open: mockWorkOrders.filter(o => o.status === 'open').length,
    inProgress: mockWorkOrders.filter(o => o.status === 'in_progress').length,
    completed: mockWorkOrders.filter(o => o.status === 'completed').length,
    critical: mockWorkOrders.filter(o => o.priority === 'critical').length,
  }), [])

  return { workOrders, stats, filters, setFilters, isLoading }
}
