export type { Asset, AssetStatus, AssetDocument, AssetMaintenanceRecord } from '@/types/common.types'

export interface AssetFilters {
  search?: string
  status?: string
  category?: string
  locationId?: string
}

export interface CreateAssetPayload {
  name: string
  category: string
  model?: string
  serialNumber?: string
  manufacturer?: string
  locationId: string
  status: string
  installDate?: string
  warrantyExpiry?: string
  purchaseCost?: number
  description?: string
}
