// Re-export mock data for dev; replace with real API calls in production
export { mockUsers } from '@/features/dashboard/services/dashboard.service'

import { httpClient } from '@/services/httpClient'
import { ENDPOINTS } from '@/services/endpoints'
import type { WorkOrder } from '@/types/common.types'
import type { CreateWorkOrderPayload, WorkOrderFilters } from '../types/workOrder.types'
import type { PaginatedResponse } from '@/types/api.types'

export const workOrdersService = {
  list: (filters?: WorkOrderFilters) =>
    httpClient.get<PaginatedResponse<WorkOrder>>(ENDPOINTS.WORK_ORDERS.LIST, {
      params: filters as Record<string, string | number | boolean>,
    }),

  getById: (id: string) =>
    httpClient.get<WorkOrder>(ENDPOINTS.WORK_ORDERS.DETAIL(id)),

  create: (payload: CreateWorkOrderPayload) =>
    httpClient.post<WorkOrder>(ENDPOINTS.WORK_ORDERS.CREATE, payload),

  update: (id: string, payload: Partial<CreateWorkOrderPayload>) =>
    httpClient.patch<WorkOrder>(ENDPOINTS.WORK_ORDERS.UPDATE(id), payload),

  delete: (id: string) =>
    httpClient.delete<void>(ENDPOINTS.WORK_ORDERS.DELETE(id)),
}
