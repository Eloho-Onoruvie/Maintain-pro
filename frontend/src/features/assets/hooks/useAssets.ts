import { useState, useMemo } from 'react'
import { mockAssets } from '../services/assets.service'
import type { Asset } from '@/types/common.types'
import type { AssetFilters } from '../types/asset.types'

export function useAssets(initial: AssetFilters = {}) {
  const [filters, setFilters] = useState<AssetFilters>(initial)
  const [isLoading] = useState(false)

  const assets = useMemo<Asset[]>(() =>
    mockAssets.filter(a => {
      if (filters.status && filters.status !== 'all' && a.status !== filters.status) return false
      if (filters.category && filters.category !== 'all' && a.category !== filters.category) return false
      if (filters.locationId && a.locationId !== filters.locationId) return false
      if (filters.search) {
        const q = filters.search.toLowerCase()
        if (!a.name.toLowerCase().includes(q) && !a.serialNumber?.toLowerCase().includes(q)) return false
      }
      return true
    }), [filters])

  const stats = useMemo(() => ({
    total: mockAssets.length,
    active: mockAssets.filter(a => a.status === 'active').length,
    needsMaintenance: mockAssets.filter(a => a.status === 'needs_maintenance').length,
    underRepair: mockAssets.filter(a => a.status === 'under_repair').length,
    decommissioned: mockAssets.filter(a => a.status === 'decommissioned').length,
  }), [])

  return { assets, stats, filters, setFilters, isLoading }
}
