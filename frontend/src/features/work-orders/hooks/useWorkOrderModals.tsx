import { useCallback, useState } from 'react'
import { toast } from 'sonner'

import { ConfirmDialog } from '@/components/feedback/ConfirmDialog'
import { useAuthStore } from '@/app/store'
import { appendNotification } from '@/features/notifications/services/notificationEvents'
import { AssignWorkOrderDialog } from '@/features/work-orders/components/AssignWorkOrderDialog'
import { EditWorkOrderDialog } from '@/features/work-orders/components/EditWorkOrderDialog'
import { useMockDataStore } from '@/services/mockDataStore'
import type { WorkOrder } from '@/types/common.types'

export function useWorkOrderModals() {
  const [editOrder, setEditOrder] = useState<WorkOrder | null>(null)
  const [assignOrder, setAssignOrder] = useState<WorkOrder | null>(null)
  const [deleteOrder, setDeleteOrder] = useState<WorkOrder | null>(null)
  const updateWorkOrder = useMockDataStore((s) => s.updateWorkOrder)
  const removeWorkOrder = useMockDataStore((s) => s.removeWorkOrder)
  const user = useAuthStore((s) => s.user)

  const openEdit = useCallback((order: WorkOrder) => setEditOrder(order), [])
  const openAssign = useCallback((order: WorkOrder) => setAssignOrder(order), [])
  const openDelete = useCallback((order: WorkOrder) => setDeleteOrder(order), [])

  const notifyAssignment = (updated: WorkOrder) => {
    if (!user || !updated.assigneeId) return
    appendNotification(updated.assigneeId, 'technician', {
      type: 'work_order',
      title: 'Work order assigned',
      message: `${updated.id} "${updated.title}" has been assigned to you`,
      priority: updated.priority === 'critical' ? 'high' : 'normal',
      actionUrl: `work-orders/${updated.id}`,
    })
    appendNotification(user.id, user.role, {
      type: 'work_order',
      title: 'Assignment updated',
      message: `${updated.id} assigned to ${updated.assigneeName ?? 'technician'}`,
      actionUrl: `work-orders/${updated.id}`,
    })
  }

  const handleDelete = () => {
    if (!deleteOrder) return
    removeWorkOrder(deleteOrder.id)
    toast.success(`${deleteOrder.id} removed`)
    setDeleteOrder(null)
  }

  const modals = (
    <>
      <EditWorkOrderDialog
        workOrder={editOrder}
        open={!!editOrder}
        onOpenChange={(open) => !open && setEditOrder(null)}
        onSaved={(updated) => {
          updateWorkOrder(updated.id, updated)
          setEditOrder(null)
        }}
      />
      <AssignWorkOrderDialog
        workOrder={assignOrder}
        open={!!assignOrder}
        onOpenChange={(open) => !open && setAssignOrder(null)}
        onAssigned={(updated) => {
          updateWorkOrder(updated.id, updated)
          notifyAssignment(updated)
          setAssignOrder(null)
        }}
      />
      <ConfirmDialog
        open={!!deleteOrder}
        onOpenChange={(open) => !open && setDeleteOrder(null)}
        title="Delete work order?"
        description={
          deleteOrder
            ? `This will permanently remove ${deleteOrder.id} — "${deleteOrder.title}". This action cannot be undone.`
            : ''
        }
        confirmLabel="Delete"
        destructive
        onConfirm={handleDelete}
      />
    </>
  )

  return { openEdit, openAssign, openDelete, modals }
}
