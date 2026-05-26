import { httpClient } from '@/services/httpClient'
import { ENDPOINTS } from '@/services/endpoints'
import type { Asset } from '@/types/common.types'
import type { CreateAssetPayload, AssetFilters } from '../types/asset.types'
import type { PaginatedResponse } from '@/types/api.types'

export { mockAssets, mockLocations } from '@/features/dashboard/services/dashboard.service'

export const assetsService = {
  list: (f?: AssetFilters) =>
    httpClient.get<PaginatedResponse<Asset>>(ENDPOINTS.ASSETS.LIST, { params: f as Record<string, string | number | boolean> }),
  getById: (id: string) => httpClient.get<Asset>(ENDPOINTS.ASSETS.DETAIL(id)),
  create: (p: CreateAssetPayload) => httpClient.post<Asset>(ENDPOINTS.ASSETS.CREATE, p),
  update: (id: string, p: Partial<CreateAssetPayload>) => httpClient.patch<Asset>(ENDPOINTS.ASSETS.UPDATE(id), p),
  delete: (id: string) => httpClient.delete<void>(ENDPOINTS.ASSETS.DELETE(id)),
  getHistory: (id: string) => httpClient.get(ENDPOINTS.ASSETS.HISTORY(id)),
  generateQR: (id: string) => httpClient.get<{ qrCode: string }>(ENDPOINTS.ASSETS.QR(id)),
}
