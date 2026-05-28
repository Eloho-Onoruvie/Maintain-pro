import { useMemo } from 'react'

import { mockWorkOrders } from '../services/dashboard.service'
import {
  buildCategoryBreakdown,
  buildCostTrend,
  buildWorkOrderTrend,
  computeDashboardStats,
  filterWorkOrdersByRange,
  getDashboardReferenceDate,
  type DashboardDateRange,
} from '../utils/dashboardDateRange'

export function useDashboardDateRange(range: DashboardDateRange) {
  const referenceDate = useMemo(() => getDashboardReferenceDate(mockWorkOrders), [])

  const workOrdersInRange = useMemo(
    () => filterWorkOrdersByRange(mockWorkOrders, range, referenceDate),
    [range, referenceDate],
  )

  const stats = useMemo(
    () => computeDashboardStats(mockWorkOrders, range, referenceDate),
    [range, referenceDate],
  )

  const activeWorkOrders = useMemo(
    () =>
      workOrdersInRange.filter(
        (wo) => wo.status !== 'completed' && wo.status !== 'closed' && wo.status !== 'cancelled',
      ),
    [workOrdersInRange],
  )

  const categoryBreakdown = useMemo(
    () => buildCategoryBreakdown(workOrdersInRange),
    [workOrdersInRange],
  )

  const workOrderTrend = useMemo(
    () => buildWorkOrderTrend(workOrdersInRange),
    [workOrdersInRange],
  )

  const costTrend = useMemo(() => buildCostTrend(workOrdersInRange), [workOrdersInRange])

  return {
    referenceDate,
    workOrdersInRange,
    activeWorkOrders,
    stats,
    categoryBreakdown,
    workOrderTrend,
    costTrend,
  }
}
