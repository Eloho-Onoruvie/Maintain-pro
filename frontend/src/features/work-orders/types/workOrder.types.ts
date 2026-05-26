export type { WorkOrder, WorkOrderStatus, WorkOrderPriority, Comment } from '@/types/common.types'

export interface WorkOrderFilters {
  status?: string
  priority?: string
  search?: string
  assigneeId?: string
  locationId?: string
  dateFrom?: string
  dateTo?: string
}

export interface CreateWorkOrderPayload {
  title: string
  description: string
  category: string
  priority: string
  locationId: string
  assetId?: string
  assigneeId?: string
  estimatedCost?: number
  dueDate?: string
}
