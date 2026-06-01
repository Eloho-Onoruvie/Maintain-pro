import { useState } from 'react'
import { 
  MapPin, User, Check, X, ShieldAlert, Users, 
  Briefcase, FileText, CheckCircle2, Star, Calendar, 
  DollarSign, ArrowRight, Clock, ShieldCheck
} from 'lucide-react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { formatRelativeDate, formatDate } from '@/utils/formatDate'
import { cn } from '@/utils/helpers'
import { useMockDataStore } from '@/services/mockDataStore'
import { useRoleAccess } from '@/hooks/useRoleAccess'
import { ServiceRequestTimeline } from './ServiceRequestTimeline'
import type { ServiceRequest, VendorOpportunity, VendorBid, WorkOrder } from '@/types/common.types'

interface ViewServiceRequestDialogProps {
  request: ServiceRequest | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const priorityColors: Record<string, string> = {
  critical: 'text-red-400 bg-red-400/10 border-red-400/20',
  high: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
  medium: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  low: 'text-muted-foreground bg-muted border-border',
}

const mockTechnicians = [
  { id: 'user-2', name: 'Mike Rodriguez', email: 'mike.r@company.com' },
  { id: 'tech-emma', name: 'Emma Wilson', email: 'emma.w@company.com' }
]

export function ViewServiceRequestDialog({
  request,
  open,
  onOpenChange,
}: ViewServiceRequestDialogProps) {
  const updateServiceRequest = useMockDataStore((s) => s.updateServiceRequest)
  const addVendorOpportunity = useMockDataStore((s) => s.addVendorOpportunity)
  const updateVendorOpportunity = useMockDataStore((s) => s.updateVendorOpportunity)
  const addWorkOrder = useMockDataStore((s) => s.addWorkOrder)
  const vendorOpportunities = useMockDataStore((s) => s.vendorOpportunities)
  const user = useMockDataStore((s) => s.workOrders) // just accessing to ensure store is reactive

  const {
    role,
    canApproveSR,
    canAssignTechnician,
    canPublishToVendors,
    canSelectVendor,
  } = useRoleAccess()

  // Form states
  const [reviewNotes, setReviewNotes] = useState('')
  const [selectedTechId, setSelectedTechId] = useState('user-2')
  const [budget, setBudget] = useState('1500')
  const [deadline, setDeadline] = useState(new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0])
  const [activeForm, setActiveForm] = useState<'approve' | 'reject' | 'assign_tech' | 'publish_vendor' | null>(null)

  if (!request) return null

  // Find related opportunity
  const opp = vendorOpportunities.find(o => o.serviceRequestId === request.id)

  const handleApprove = () => {
    updateServiceRequest(request.id, {
      status: 'approved',
      reviewedBy: role ?? 'facility_manager',
      reviewedAt: new Date(),
      approvedAt: new Date(),
      reviewNotes: reviewNotes || 'Approved for assignment'
    })
    toast.success('Service Request approved!')
    setActiveForm(null)
    setReviewNotes('')
  }

  const handleReject = () => {
    updateServiceRequest(request.id, {
      status: 'rejected',
      reviewedBy: role ?? 'facility_manager',
      reviewedAt: new Date(),
      reviewNotes: reviewNotes || 'Declined'
    })
    toast.error('Service Request rejected.')
    setActiveForm(null)
    setReviewNotes('')
  }

  const handleAssignTech = () => {
    const tech = mockTechnicians.find(t => t.id === selectedTechId)
    updateServiceRequest(request.id, {
      status: 'assigned_internal',
      assignmentType: 'internal',
      assignedTechnicianId: selectedTechId,
      assignedTechnicianName: tech?.name ?? 'Unknown Technician'
    })
    toast.success(`Assigned to ${tech?.name}`)
    setActiveForm(null)
  }

  const handlePublishVendor = () => {
    const oppId = `opp-${Date.now()}`
    const newOpp: VendorOpportunity = {
      id: oppId,
      serviceRequestId: request.id,
      title: request.title,
      description: request.description,
      category: request.category,
      locationName: request.locationName,
      priority: request.priority,
      estimatedBudget: Number(budget),
      publishedAt: new Date(),
      deadline: new Date(deadline),
      status: 'open',
      bids: []
    }
    
    addVendorOpportunity(newOpp)
    updateServiceRequest(request.id, {
      status: 'open_to_vendors',
      assignmentType: 'vendor',
      opportunityId: oppId
    })
    
    toast.success('Opportunity published to Vendors board!')
    setActiveForm(null)
  }

  const handleAwardBid = (bid: VendorBid) => {
    if (!opp) return
    
    // Accept selected bid, reject others
    const updatedBids = opp.bids.map(b => ({
      ...b,
      status: b.id === bid.id ? 'accepted' as const : 'rejected' as const
    }))
    
    updateVendorOpportunity(opp.id, {
      status: 'awarded',
      awardedVendorId: bid.vendorId,
      awardedVendorName: bid.vendorName,
      bids: updatedBids
    })

    updateServiceRequest(request.id, {
      status: 'vendor_selected',
      selectedVendorId: bid.vendorId,
      selectedVendorName: bid.vendorName
    })

    toast.success(`Awarded to ${bid.vendorName}!`)
  }

  const handleGenerateWorkOrder = () => {
    const woId = `WO-${Date.now().toString().slice(-6)}`
    
    const newWo: WorkOrder = {
      id: woId,
      title: request.title,
      description: request.description,
      status: 'open',
      priority: request.priority,
      type: 'reactive',
      category: request.category,
      locationId: request.locationId,
      locationName: request.locationName,
      requesterId: request.requesterId,
      requesterName: request.requesterName,
      createdAt: new Date(),
      updatedAt: new Date(),
      assigneeId: request.assignedTechnicianId || request.selectedVendorId,
      assigneeName: request.assignedTechnicianName || request.selectedVendorName
    }

    addWorkOrder(newWo)

    updateServiceRequest(request.id, {
      status: 'work_order_created',
      generatedWorkOrderId: woId
    })

    toast.success(`Work Order ${woId} generated successfully!`)
  }

  const handleAdvanceStatus = (nextStatus: 'in_progress' | 'completed' | 'closed') => {
    updateServiceRequest(request.id, {
      status: nextStatus,
      resolvedAt: nextStatus === 'completed' ? new Date() : request.resolvedAt
    })
    toast.success(`Status updated to ${nextStatus.replace('_', ' ')}`)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-card border-border overflow-y-auto max-h-[92vh] scrollbar-thin">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between pr-6 flex-wrap gap-2">
            <span>{request.title}</span>
            <span className="font-mono text-xs text-muted-foreground">{request.id}</span>
          </DialogTitle>
        </DialogHeader>

        {/* Stepper Timeline */}
        <div className="border-b border-border pb-4">
          <ServiceRequestTimeline 
            currentStatus={request.status} 
            assignmentType={request.assignmentType} 
          />
        </div>

        <div className="space-y-6 py-4 text-sm">
          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/30 p-4 rounded-xl border border-border/60">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="capitalize">{request.status.replace(/_/g, ' ')}</Badge>
                <Badge variant="outline" className={cn('capitalize', priorityColors[request.priority])}>
                  {request.priority}
                </Badge>
              </div>
              <p className="text-muted-foreground leading-relaxed pt-1">{request.description}</p>
            </div>
            
            <div className="space-y-2 border-t md:border-t-0 md:border-l border-border/80 pt-2 md:pt-0 md:pl-4 flex flex-col justify-center">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{request.locationName}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-4 w-4" />
                <span>Submitted by: <strong>{request.requesterName}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Submitted {formatRelativeDate(request.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Workflow Status Info */}
          {(request.reviewedBy || request.assignedTechnicianName || request.selectedVendorName || request.generatedWorkOrderId) && (
            <div className="border border-border/60 rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Workflow Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {request.reviewedBy && (
                  <div className="space-y-0.5">
                    <span className="text-muted-foreground block">Reviewed By</span>
                    <span className="font-medium text-foreground">{request.reviewedBy}</span>
                    {request.reviewNotes && (
                      <span className="italic text-muted-foreground/80 block mt-0.5">"{request.reviewNotes}"</span>
                    )}
                  </div>
                )}
                {request.assignedTechnicianName && (
                  <div className="space-y-0.5">
                    <span className="text-muted-foreground block">Assigned Internal Technician</span>
                    <span className="font-medium text-foreground flex items-center gap-1">
                      <Users className="h-3.5 w-3.5 text-teal-400" />
                      {request.assignedTechnicianName}
                    </span>
                  </div>
                )}
                {request.selectedVendorName && (
                  <div className="space-y-0.5">
                    <span className="text-muted-foreground block">Awarded External Vendor</span>
                    <span className="font-medium text-foreground flex items-center gap-1">
                      <Briefcase className="h-3.5 w-3.5 text-pink-400" />
                      {request.selectedVendorName}
                    </span>
                  </div>
                )}
                {request.generatedWorkOrderId && (
                  <div className="space-y-0.5">
                    <span className="text-muted-foreground block">Linked Work Order</span>
                    <Badge className="bg-sky-400/10 text-sky-400 border border-sky-400/20 font-mono">
                      {request.generatedWorkOrderId}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Vendor Opportunity Bids Section */}
          {request.status === 'open_to_vendors' && opp && (
            <div className="border border-border/60 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Vendor Bids ({opp.bids.length})</h4>
                {opp.estimatedBudget && (
                  <span className="text-xs text-muted-foreground">Budget: <strong>${opp.estimatedBudget}</strong></span>
                )}
              </div>
              
              <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                {opp.bids.length === 0 ? (
                  <div className="text-center py-4 text-xs text-muted-foreground border border-dashed border-border rounded-lg bg-muted/10">
                    Awaiting bids from qualified nearby vendors...
                  </div>
                ) : (
                  opp.bids.map(bid => (
                    <div key={bid.id} className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
                      <div className="space-y-1">
                        <div className="font-semibold text-foreground flex items-center gap-1">{bid.vendorName}</div>
                        <div className="text-xs text-muted-foreground flex gap-3">
                          <span className="flex items-center text-emerald-400 font-medium"><DollarSign className="h-3 w-3" />{bid.proposedCost}</span>
                          <span>Est: <strong>{bid.estimatedDays} days</strong></span>
                        </div>
                        {bid.notes && <p className="text-[11px] text-muted-foreground/80 italic">"{bid.notes}"</p>}
                      </div>
                      {canSelectVendor && (
                        <Button size="sm" className="h-7 text-[11px] gap-1 px-3" onClick={() => handleAwardBid(bid)}>
                          <Check className="h-3 w-3" /> Select & Award
                        </Button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Gated Dynamic Admin/FM Actions Panel */}
          {(canApproveSR || canAssignTechnician || canPublishToVendors) && (
            <div className="border border-cyan-500/20 bg-cyan-950/5 rounded-xl p-4 space-y-4">
              <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs uppercase tracking-wider">
                <ShieldCheck className="h-4 w-4" />
                <span>Facilities Manager Action Control</span>
              </div>

              <div className="flex gap-2 flex-wrap">
                {/* 1. Review stage */}
                {['submitted', 'under_review'].includes(request.status) && !activeForm && (
                  <>
                    <Button 
                      size="sm" 
                      className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                      onClick={() => setActiveForm('approve')}
                    >
                      <Check className="h-4 w-4" /> Review & Approve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      className="gap-1"
                      onClick={() => setActiveForm('reject')}
                    >
                      <X className="h-4 w-4" /> Reject Request
                    </Button>
                  </>
                )}

                {/* 2. Assignment stage */}
                {request.status === 'approved' && !activeForm && (
                  <>
                    {canAssignTechnician && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-teal-500/30 text-teal-400 hover:bg-teal-950/20 gap-1.5"
                        onClick={() => setActiveForm('assign_tech')}
                      >
                        <Users className="h-4 w-4" /> Assign Internal Tech
                      </Button>
                    )}
                    {canPublishToVendors && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-indigo-500/30 text-indigo-400 hover:bg-indigo-950/20 gap-1.5"
                        onClick={() => setActiveForm('publish_vendor')}
                      >
                        <Briefcase className="h-4 w-4" /> Publish Vendor Opportunity
                      </Button>
                    )}
                  </>
                )}

                {/* 3. Work Order generation stage */}
                {['assigned_internal', 'vendor_selected'].includes(request.status) && (
                  <Button 
                    size="sm" 
                    className="bg-cyan-600 hover:bg-cyan-700 text-white gap-1.5 shadow-[0_0_10px_rgba(8,145,178,0.2)]"
                    onClick={handleGenerateWorkOrder}
                  >
                    <ArrowRight className="h-4 w-4 animate-pulse" /> Generate Work Order
                  </Button>
                )}

                {/* 4. Complete / Close Simulation */}
                {request.status === 'work_order_created' && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="border-amber-500/30 text-amber-400 hover:bg-amber-950/20 gap-1.5"
                    onClick={() => handleAdvanceStatus('in_progress')}
                  >
                    <Clock className="h-4 w-4" /> Start Work (Simulate)
                  </Button>
                )}

                {request.status === 'in_progress' && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-950/20 gap-1.5"
                    onClick={() => handleAdvanceStatus('completed')}
                  >
                    <CheckCircle2 className="h-4 w-4" /> Complete Request
                  </Button>
                )}

                {request.status === 'completed' && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="border-slate-500/30 text-slate-400 hover:bg-slate-950/20 gap-1.5"
                    onClick={() => handleAdvanceStatus('closed')}
                  >
                    <CheckCircle2 className="h-4 w-4" /> Archive & Close Request
                  </Button>
                )}
              </div>

              {/* Collapsible Forms inside panel */}
              {activeForm === 'approve' && (
                <div className="bg-muted/30 p-3 rounded-lg border border-border/80 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="space-y-1">
                    <Label className="text-xs">Approval / Review Notes (Optional)</Label>
                    <Textarea 
                      placeholder="e.g. Approved. Assigning to electrical team." 
                      rows={2} 
                      value={reviewNotes} 
                      onChange={e => setReviewNotes(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button size="sm" variant="ghost" onClick={() => setActiveForm(null)}>Cancel</Button>
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={handleApprove}>Confirm Approval</Button>
                  </div>
                </div>
              )}

              {activeForm === 'reject' && (
                <div className="bg-muted/30 p-3 rounded-lg border border-border/80 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="space-y-1">
                    <Label className="text-xs">Reason for Rejection *</Label>
                    <Textarea 
                      placeholder="Please specify why this request is being rejected..." 
                      rows={2} 
                      value={reviewNotes} 
                      onChange={e => setReviewNotes(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button size="sm" variant="ghost" onClick={() => setActiveForm(null)}>Cancel</Button>
                    <Button size="sm" variant="destructive" onClick={handleReject} disabled={!reviewNotes.trim()}>Reject Request</Button>
                  </div>
                </div>
              )}

              {activeForm === 'assign_tech' && (
                <div className="bg-muted/30 p-3 rounded-lg border border-border/80 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="space-y-1">
                    <Label className="text-xs">Choose Internal Technician</Label>
                    <select 
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      value={selectedTechId}
                      onChange={e => setSelectedTechId(e.target.value)}
                    >
                      {mockTechnicians.map(t => (
                        <option key={t.id} value={t.id}>{t.name} ({t.email})</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button size="sm" variant="ghost" onClick={() => setActiveForm(null)}>Cancel</Button>
                    <Button size="sm" className="bg-teal-600 hover:bg-teal-700" onClick={handleAssignTech}>Confirm Assignment</Button>
                  </div>
                </div>
              )}

              {activeForm === 'publish_vendor' && (
                <div className="bg-muted/30 p-3 rounded-lg border border-border/80 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Estimated Budget ($)</Label>
                      <Input type="number" value={budget} onChange={e => setBudget(e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Bidding Deadline</Label>
                      <Input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button size="sm" variant="ghost" onClick={() => setActiveForm(null)}>Cancel</Button>
                    <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handlePublishVendor}>Publish Opportunity</Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close Dialog</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
