import { useCallback, useState } from 'react'
import { toast } from 'sonner'

import { ConfirmDialog } from '@/components/feedback/ConfirmDialog'
import { AssignWorkOrderDialog } from '@/features/work-orders/components/AssignWorkOrderDialog'
import { EditWorkOrderDialog } from '@/features/work-orders/components/EditWorkOrderDialog'
import type { WorkOrder } from '@/types/common.types'

export function useWorkOrderModals() {
  const [editOrder, setEditOrder] = useState<WorkOrder | null>(null)
  const [assignOrder, setAssignOrder] = useState<WorkOrder | null>(null)
  const [deleteOrder, setDeleteOrder] = useState<WorkOrder | null>(null)

  const openEdit = useCallback((order: WorkOrder) => setEditOrder(order), [])
  const openAssign = useCallback((order: WorkOrder) => setAssignOrder(order), [])
  const openDelete = useCallback((order: WorkOrder) => setDeleteOrder(order), [])

  const handleDelete = () => {
    if (!deleteOrder) return
    toast.success(`${deleteOrder.id} deletion requested`)
    setDeleteOrder(null)
  }

  const modals = (
    <>
      <EditWorkOrderDialog
        workOrder={editOrder}
        open={!!editOrder}
        onOpenChange={(open) => !open && setEditOrder(null)}
      />
      <AssignWorkOrderDialog
        workOrder={assignOrder}
        open={!!assignOrder}
        onOpenChange={(open) => !open && setAssignOrder(null)}
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
