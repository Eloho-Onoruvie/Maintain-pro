import { useState, useEffect } from 'react'
import { dashboardStats, mockWorkOrders, mockPMs, mockInventory, mockVendors } from '../services/dashboard.service'
import type { DashboardStats } from '../types/dashboard.types'

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats>(dashboardStats)
  const [isLoading, setIsLoading] = useState(false)

  // In production, fetch from API; using mock data here
  const workOrders = mockWorkOrders
  const preventiveMaintenance = mockPMs
  const inventory = mockInventory
  const vendors = mockVendors

  return { stats, isLoading, workOrders, preventiveMaintenance, inventory, vendors }
}
