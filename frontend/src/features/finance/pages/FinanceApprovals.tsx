import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { DollarSign, ExternalLink, MessageSquare } from 'lucide-react'
import { toast } from 'sonner'

import { AppHeader } from '@/components/navigation/Navbar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { useAuthStore } from '@/app/store'
import { usePortalPath } from '@/hooks/usePortal'
import { useMockDataStore } from '@/services/mockDataStore'
import type { WorkOrder } from '@/types/common.types'

export function FinanceApprovals() {
  const user = useAuthStore((s) => s.user)
  const workOrders = useMockDataStore((s) => s.workOrders)
  const updateWorkOrder = useMockDataStore((s) => s.updateWorkOrder)
  const workOrdersPath = usePortalPath('work-orders')
  const [notesById, setNotesById] = useState<Record<string, string>>({})

  const pending = useMemo(
    () =>
      workOrders.filter(
        (wo) =>
          wo.requiresApproval &&
          !wo.approvedAt &&
          wo.status !== 'cancelled' &&
          wo.status !== 'completed',
      ),
    [workOrders],
  )

  const handleApprove = (wo: WorkOrder) => {
    updateWorkOrder(wo.id, {
      approvedAt: new Date(),
      approvedBy: user?.email,
      approvalNotes: notesById[wo.id],
      requiresApproval: false,
    })
    toast.success(`${wo.id} approved`)
  }

  const handleReject = (wo: WorkOrder) => {
    updateWorkOrder(wo.id, {
      status: 'cancelled',
      rejectionReason: notesById[wo.id] || 'Rejected by finance',
    })
    toast.success(`${wo.id} rejected`)
  }

  const handleRequestMoreInfo = (wo: WorkOrder) => {
    const note = notesById[wo.id]?.trim()
    if (!note) {
      toast.error('Add a note explaining what information is needed before requesting more info')
      return
    }
    updateWorkOrder(wo.id, {
      status: 'pending',
      approvalNotes: `[More info requested] ${note}`,
    })
    toast.success(`More info requested for ${wo.id}`)
  }

  return (
    <div className="flex flex-col bg-background">
      <AppHeader
        title="Work Order Approvals"
        subtitle="High-value work orders requiring finance sign-off (US-10)"
        hideQuickCreate
      />
      <div className="page-body space-y-4">
        {pending.length === 0 ? (
          <Card className="border-border bg-card">
            <CardContent className="p-8 text-center text-muted-foreground">
              No work orders pending approval.
            </CardContent>
          </Card>
        ) : (
          pending.map((wo) => (
            <Card key={wo.id} className="border-border bg-card">
              <CardContent className="space-y-4 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground">{wo.id}</span>
                      <Badge variant="outline" className="capitalize">
                        {wo.priority}
                      </Badge>
                    </div>
                    <p className="font-medium">{wo.title}</p>
                    <p className="text-sm text-muted-foreground">{wo.locationName} · {wo.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Estimated cost</p>
                    <p className="flex items-center justify-end gap-1 text-lg font-semibold">
                      <DollarSign className="h-4 w-4" />
                      {(wo.estimatedCost ?? 0).toLocaleString()}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{wo.description}</p>
                <Textarea
                  rows={2}
                  placeholder="Approval notes (optional)"
                  value={notesById[wo.id] ?? ''}
                  onChange={(e) =>
                    setNotesById((p) => ({ ...p, [wo.id]: e.target.value }))
                  }
                />
                <div className="flex flex-wrap gap-2">
                  <Button onClick={() => handleApprove(wo)}>Approve</Button>
                  <Button variant="outline" onClick={() => handleReject(wo)}>
                    Reject
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    onClick={() => handleRequestMoreInfo(wo)}
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    Request More Info
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`${workOrdersPath}/${wo.id}`} className="gap-1">
                      View details <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
