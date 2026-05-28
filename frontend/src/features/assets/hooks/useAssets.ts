import { useMemo, useState } from 'react'

import { mockDelay, useAsyncResource } from '@/hooks/useAsyncResource'

import { mockAssets } from '../services/assets.service'
import type { Asset } from '@/types/common.types'
import type { AssetFilters } from '../types/asset.types'

async function fetchAssets(): Promise<Asset[]> {
  await mockDelay()
  return mockAssets
}

export function useAssets(initial: AssetFilters = {}) {
  const [filters, setFilters] = useState<AssetFilters>(initial)
  const { data, isLoading, error, refetch } = useAsyncResource(fetchAssets, [])

  const allAssets = data ?? []

  const assets = useMemo<Asset[]>(
    () => {
      const now = new Date()
      const dueSoonCutoff = new Date(now)
      dueSoonCutoff.setDate(dueSoonCutoff.getDate() + 30)

      return allAssets.filter((a) => {
        if (filters.status && filters.status !== 'all' && a.status !== filters.status) return false
        if (filters.category && filters.category !== 'all' && a.category !== filters.category) return false
        if (filters.locationId && a.locationId !== filters.locationId) return false
        if (filters.manufacturer && a.manufacturer !== filters.manufacturer) return false

        if (filters.installDateFrom && a.installDate) {
          if (a.installDate < new Date(filters.installDateFrom)) return false
        }
        if (filters.installDateTo && a.installDate) {
          const to = new Date(filters.installDateTo)
          to.setHours(23, 59, 59, 999)
          if (a.installDate > to) return false
        }
        if (filters.installDateFrom && !a.installDate) return false
        if (filters.installDateTo && !a.installDate) return false

        if (filters.warrantyStatus) {
          const hasWarranty = Boolean(a.warrantyExpiry)
          const isActive = hasWarranty && a.warrantyExpiry! >= now
          if (filters.warrantyStatus === 'active' && !isActive) return false
          if (filters.warrantyStatus === 'expired' && (!hasWarranty || a.warrantyExpiry! >= now)) return false
          if (filters.warrantyStatus === 'none' && hasWarranty) return false
        }

        if (filters.maintenanceDue) {
          const next = a.nextMaintenanceDate
          if (filters.maintenanceDue === 'none' && next) return false
          if (filters.maintenanceDue === 'overdue' && (!next || next >= now)) return false
          if (
            filters.maintenanceDue === 'due_soon' &&
            (!next || next < now || next > dueSoonCutoff)
          ) {
            return false
          }
        }

        if (filters.search) {
          const q = filters.search.toLowerCase()
          if (
            !a.name.toLowerCase().includes(q) &&
            !a.serialNumber?.toLowerCase().includes(q) &&
            !a.manufacturer?.toLowerCase().includes(q)
          ) {
            return false
          }
        }
        return true
      })
    },
    [allAssets, filters],
  )

  const stats = useMemo(
    () => ({
      total: allAssets.length,
      active: allAssets.filter((a) => a.status === 'active').length,
      needsMaintenance: allAssets.filter((a) => a.status === 'needs_maintenance').length,
      underRepair: allAssets.filter((a) => a.status === 'under_repair').length,
      decommissioned: allAssets.filter((a) => a.status === 'decommissioned').length,
    }),
    [allAssets],
  )

  return { assets, stats, filters, setFilters, isLoading, error, refetch }
}
