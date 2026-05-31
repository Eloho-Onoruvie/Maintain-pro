import { useState } from 'react'
import { toast } from 'sonner'
import {
  CheckCircle2,
  XCircle,
  Camera,
  Clock,
  DollarSign,
  FileText,
  Play,
  AlertTriangle,
} from 'lucide-react'

import { PORTALS } from '@/app/portal.config'
import { useAuthStore } from '@/app/store'
import { usePortal } from '@/hooks/usePortal'
import { useRoleAccess } from '@/hooks/useRoleAccess'
import { useActionConfirm } from '@/hooks/useActionConfirm'
import { appendNotification } from '@/features/notifications/services/notificationEvents'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useMockDataStore } from '@/services/mockDataStore'
import type { WorkOrder } from '@/types/common.types'
import { USER_ROLES } from '@/types/user.types'

interface WorkOrderRolePanelProps {
  workOrder: WorkOrder
}

export function WorkOrderRolePanel({ workOrder }: WorkOrderRolePanelProps) {
  const portal = usePortal()
  const user = useAuthStore((s) => s.user)
  const { role, isMaintenanceReadOnly } = useRoleAccess()
  const updateWorkOrder = useMockDataStore((s) => s.updateWorkOrder)
  const addVendorInvoice = useMockDataStore((s) => s.addVendorInvoice)
  const addServiceRequest = useMockDataStore((s) => s.addServiceRequest)
  const { requestConfirm, ActionConfirmDialog } = useActionConfirm()

  const [rejectReason, setRejectReason] = useState('')
  const [proposedDate, setProposedDate] = useState('')
  const [completionNotes, setCompletionNotes] = useState('')
  const [timeSpent, setTimeSpent] = useState('')
  const [partsUsed, setPartsUsed] = useState('')
  const [invoiceAmount, setInvoiceAmount] = useState(
    String(workOrder.estimatedCost ?? workOrder.actualCost ?? ''),
  )
  const [invoiceNumber, setInvoiceNumber] = useState('')
  const [approvalNotes, setApprovalNotes] = useState('')
  const [issueForm, setIssueForm] = useState({
    title: '',
    category: workOrder.category,
    description: '',
    priority: workOrder.priority,
  })

  const isVendor =
    portal === PORTALS.VENDOR && user?.id === workOrder.assigneeId
  const isTech =
    portal === PORTALS.ORG &&
    role === USER_ROLES.TECHNICIAN &&
    user?.id === workOrder.assigneeId
  const isFinance = portal === PORTALS.ORG && role === USER_ROLES.FINANCE
  const needsApproval =
    isFinance &&
    workOrder.requiresApproval &&
    !workOrder.approvedAt &&
    workOrder.status !== 'cancelled'

  const notifyManager = (title: string, message: string) => {
    appendNotification('user-1', USER_ROLES.FACILITY_MANAGER, {
      type: 'work_order',
      title,
      message,
      priority: 'high',
      actionUrl: `work-orders/${workOrder.id}`,
    })
  }

  if (isVendor) {
  const pending =
    workOrder.vendorOfferStatus === 'pending_acceptance' ||
    (workOrder.status === 'assigned' && !workOrder.vendorOfferStatus)

    return (
      <>
        {ActionConfirmDialog}
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Vendor job response</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pending ? (
              <>
                <p className="text-sm text-muted-foreground">
                  Accept this assignment or decline with a reason. You can propose a scheduled
                  date after accepting.
                </p>
                <div className="space-y-2">
                  <Label>Proposed date (optional)</Label>
                  <Input
                    type="date"
                    value={proposedDate}
                    onChange={(e) => setProposedDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Decline reason</Label>
                  <Textarea
                    rows={2}
                    placeholder="Required if declining"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    className="gap-2"
                    onClick={() => {
                      updateWorkOrder(workOrder.id, {
                        vendorOfferStatus: 'accepted',
                        status: 'in_progress',
                        proposedSchedule: proposedDate
                          ? new Date(proposedDate)
                          : undefined,
                      })
                      notifyManager('Vendor accepted job', `${workOrder.id} accepted by vendor`)
                      toast.success('Job accepted')
                    }}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Accept job
                  </Button>
                  <Button
                    variant="outline"
                    className="gap-2 text-destructive"
                    onClick={() => {
                      if (!rejectReason.trim()) {
                        toast.error('Provide a decline reason')
                        return
                      }
                      updateWorkOrder(workOrder.id, {
                        vendorOfferStatus: 'rejected',
                        vendorRejectReason: rejectReason,
                        status: 'open',
                        assigneeId: undefined,
                        assigneeName: undefined,
                      })
                      toast.success('Job declined')
                    }}
                  >
                    <XCircle className="h-4 w-4" />
                    Decline
                  </Button>
                </div>
              </>
            ) : null}

            {workOrder.vendorOfferStatus === 'accepted' ||
            workOrder.status === 'in_progress' ? (
              <div className="space-y-3 border-t border-border pt-4">
                <p className="text-sm font-medium">Complete job & invoice (US-07)</p>
                <div className="space-y-2">
                  <Label>Work notes</Label>
                  <Textarea
                    rows={3}
                    value={completionNotes}
                    onChange={(e) => setCompletionNotes(e.target.value)}
                    placeholder="Summary of work performed"
                  />
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Invoice #</Label>
                    <Input
                      value={invoiceNumber}
                      onChange={(e) => setInvoiceNumber(e.target.value)}
                      placeholder="INV-XXXX"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Amount ($)</Label>
                    <Input
                      type="number"
                      value={invoiceAmount}
                      onChange={(e) => setInvoiceAmount(e.target.value)}
                    />
                  </div>
                </div>
                <Button
                  className="w-full gap-2"
                  onClick={() =>
                    requestConfirm({
                      title: 'Mark complete & submit invoice?',
                      description: 'Completes the work order and submits invoice for finance review.',
                      confirmLabel: 'Submit',
                      onConfirm: () => {
                        const amount = Number(invoiceAmount) || 0
                        updateWorkOrder(workOrder.id, {
                          status: 'completed',
                          completionNotes,
                          actualCost: amount,
                          paymentStatus: 'pending',
                        })
                        addVendorInvoice({
                          id: `INV-${Date.now()}`,
                          workOrderId: workOrder.id,
                          vendorId: user?.id ?? 'vendor-1',
                          vendorName: user?.department ?? 'Vendor',
                          amount,
                          estimatedAmount: workOrder.estimatedCost,
                          status: 'pending',
                          submittedAt: new Date(),
                          invoiceNumber: invoiceNumber || undefined,
                          notes: completionNotes,
                        })
                        appendNotification('user-3', USER_ROLES.FINANCE, {
                          type: 'approval',
                          title: 'Vendor invoice submitted',
                          message: `${workOrder.id} — $${amount.toLocaleString()} pending verification`,
                          actionUrl: 'invoices',
                        })
                        toast.success('Job completed and invoice submitted')
                      },
                    })
                  }
                >
                  <FileText className="h-4 w-4" />
                  Complete & submit invoice
                </Button>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </>
    )
  }

  if (isTech) {
    return (
      <>
        {ActionConfirmDialog}
        <Card className="border-border bg-card lg:hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Field work (US-04)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                className="gap-2"
                disabled={workOrder.status === 'in_progress'}
                onClick={() => {
                  updateWorkOrder(workOrder.id, { status: 'in_progress' })
                  toast.success('Work started')
                }}
              >
                <Play className="h-4 w-4" />
                Start work
              </Button>
              <Button
                className="gap-2"
                disabled={workOrder.status === 'completed'}
                onClick={() =>
                  requestConfirm({
                    title: 'Complete work order?',
                    description: 'Mark this job as completed with your notes and time.',
                    confirmLabel: 'Complete',
                    onConfirm: () => {
                      updateWorkOrder(workOrder.id, {
                        status: 'completed',
                        completionNotes: completionNotes || 'Work completed in field',
                        timeSpent: timeSpent ? Number(timeSpent) : undefined,
                        partsCost: partsUsed ? Number(partsUsed) : undefined,
                      })
                      toast.success('Work order completed')
                    },
                  })
                }
              >
                <CheckCircle2 className="h-4 w-4" />
                Complete
              </Button>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Time spent (hrs)</Label>
                <Input
                  type="number"
                  step="0.25"
                  value={timeSpent}
                  onChange={(e) => setTimeSpent(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Parts cost ($)</Label>
                <Input
                  type="number"
                  value={partsUsed}
                  onChange={(e) => setPartsUsed(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Completion notes</Label>
              <Textarea
                rows={2}
                value={completionNotes}
                onChange={(e) => setCompletionNotes(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() =>
                requestConfirm({
                  title: 'Add photo?',
                  description: 'Photo will attach to this work order (demo: placeholder).',
                  confirmLabel: 'Add',
                  onConfirm: () => {
                    const images = [...(workOrder.images ?? []), 'demo-photo']
                    updateWorkOrder(workOrder.id, { images })
                    toast.success('Photo attached')
                  },
                })
              }
            >
              <Camera className="h-4 w-4" />
              Upload photo
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Report new issue (US-05)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              placeholder="Issue title"
              value={issueForm.title}
              onChange={(e) => setIssueForm((p) => ({ ...p, title: e.target.value }))}
            />
            <Textarea
              rows={2}
              placeholder="Describe the issue found"
              value={issueForm.description}
              onChange={(e) => setIssueForm((p) => ({ ...p, description: e.target.value }))}
            />
            <Button
              size="sm"
              onClick={() => {
                if (!issueForm.title.trim() || !issueForm.description.trim()) {
                  toast.error('Title and description required')
                  return
                }
                const id = `SR-${Date.now().toString().slice(-6)}`
                addServiceRequest({
                  id,
                  title: issueForm.title,
                  description: `${issueForm.description}\n\nLinked to ${workOrder.id}`,
                  category: issueForm.category,
                  status: 'submitted',
                  priority: issueForm.priority,
                  requesterId: user?.id ?? 'user-2',
                  requesterName: user ? `${user.firstName} ${user.lastName}` : 'Technician',
                  requesterEmail: user?.email ?? '',
                  locationId: workOrder.locationId,
                  locationName: workOrder.locationName,
                  createdAt: new Date(),
                })
                updateWorkOrder(workOrder.id, { linkedServiceRequestId: id })
                notifyManager('Issue reported from field', `${issueForm.title} (${id})`)
                toast.success('Issue reported — manager notified')
                setIssueForm({ title: '', category: workOrder.category, description: '', priority: workOrder.priority })
              }}
            >
              Submit issue
            </Button>
          </CardContent>
        </Card>
      </>
    )
  }

  if (needsApproval) {
    return (
      <>
        {ActionConfirmDialog}
        <Card className="border-amber-400/30 bg-amber-400/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Approval required (US-10)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Estimated cost:{' '}
              <strong>${(workOrder.estimatedCost ?? 0).toLocaleString()}</strong> — exceeds
              approval threshold.
            </p>
            <Textarea
              rows={2}
              placeholder="Approval notes (optional)"
              value={approvalNotes}
              onChange={(e) => setApprovalNotes(e.target.value)}
            />
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => {
                  updateWorkOrder(workOrder.id, {
                    approvedAt: new Date(),
                    approvedBy: user?.email,
                    approvalNotes,
                    requiresApproval: false,
                  })
                  toast.success('Work order approved')
                }}
              >
                Approve
              </Button>
              <Button
                variant="outline"
                className="text-destructive"
                onClick={() => {
                  updateWorkOrder(workOrder.id, {
                    status: 'cancelled',
                    rejectionReason: approvalNotes || 'Rejected by finance',
                  })
                  toast.success('Work order rejected')
                }}
              >
                Reject
              </Button>
            </div>
          </CardContent>
        </Card>
      </>
    )
  }

  if (isMaintenanceReadOnly && workOrder.requiresApproval && !workOrder.approvedAt) {
    return (
      <Card className="border-border bg-muted/30">
        <CardContent className="p-4 text-sm text-muted-foreground">
          <Clock className="mb-2 h-4 w-4" />
          Pending finance approval before work can proceed.
        </CardContent>
      </Card>
    )
  }

  return null
}
