import { httpClient } from '@/api/httpClient'
import { ENDPOINTS } from '@/api/endpoints'

export interface InventoryItemRecord { _id: string; sku: string; name: string; description?: string; categoryId?: string; unitOfMeasure: string; status: string; minimumStockLevel: number; reorderLevel: number; maximumStockLevel?: number; preferredVendorId?: string; createdAt: string; updatedAt: string }
export interface InventoryBalance { itemId: string; stockLocationId: string; quantity: number; reservedQuantity: number; availableQuantity: number; updatedAt: string }

export const inventoryService = {
  listItems: (params?: { search?: string; categoryId?: string; status?: string; page?: number; limit?: number }) => httpClient.get<InventoryItemRecord[]>(ENDPOINTS.INVENTORY.ITEMS, { params }),
  balances: (params?: { itemId?: string; stockLocationId?: string }) => httpClient.get<InventoryBalance[]>(ENDPOINTS.INVENTORY.BALANCES, { params }),
  createItem: (payload: Record<string, unknown>) => httpClient.post<InventoryItemRecord>(ENDPOINTS.INVENTORY.ITEMS, payload),
  updateItem: (id: string, payload: Record<string, unknown>) => httpClient.patch<InventoryItemRecord>(`${ENDPOINTS.INVENTORY.ITEMS}/${id}`, payload),
  deactivateItem: (id: string) => httpClient.post<void>(`${ENDPOINTS.INVENTORY.ITEMS}/${id}/deactivate`, {}),
  history: (params?: Record<string, string | number>) => httpClient.get<unknown[]>(`${ENDPOINTS.INVENTORY.LIST}/history`, { params }),
}
