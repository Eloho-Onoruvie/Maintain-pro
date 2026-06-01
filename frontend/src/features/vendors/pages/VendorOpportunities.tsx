import { useState, useMemo } from 'react'
import { toast } from 'sonner'
import {
  Briefcase, DollarSign, Calendar, Clock, CheckCircle2,
  AlertCircle, ShieldAlert, ArrowRight, Check, Send, User, MessageSquare
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { AppHeader } from '@/components/navigation/Navbar'
import { useMockDataStore } from '@/services/mockDataStore'
import { useAuthStore } from '@/app/store'
import { formatRelativeDate, formatDate } from '@/utils/formatDate'
import { cn } from '@/utils/helpers'
import { EmptyState } from '@/components/feedback/EmptyState'
import type { VendorOpportunity, VendorBid, WorkOrderPriority } from '@/types/common.types'

const priorityColors: Record<WorkOrderPriority, string> = {
  critical: 'text-red-400 bg-red-400/10 border-red-400/20',
  high:     'text-orange-400 bg-orange-400/10 border-orange-400/20',
  medium:   'text-amber-400 bg-amber-400/10 border-amber-400/20',
  low:      'text-muted-foreground bg-muted border-border',
}

export function VendorOpportunities() {
  const user = useAuthStore((s) => s.user)
  const vendorOpportunities = useMockDataStore((s) => s.vendorOpportunities)
  const addBidToOpportunity = useMockDataStore((s) => s.addBidToOpportunity)
  const updateServiceRequest = useMockDataStore((s) => s.updateServiceRequest)
  const updateVendorOpportunity = useMockDataStore((s) => s.updateVendorOpportunity)

  // Bidding form states
  const [biddingOpp, setBiddingOpp] = useState<VendorOpportunity | null>(null)
  const [proposedCost, setProposedCost] = useState('1200')
  const [estimatedDays, setEstimatedDays] = useState('5')
  const [notes, setNotes] = useState('')

  // Filter out opportunities. Let's assume vendor category matches the opportunity category.
  // Sarah Chen/Admin might see all, but vendors see matching categories or all.
  const isVendorUser = user?.role?.startsWith('vendor')
  const vendorId = isVendorUser ? 'vendor-1' : 'all'
  const vendorName = isVendorUser ? 'ProTech HVAC Services' : 'Internal FM Reviewer'

  const filteredOpportunities = useMemo(() => {
    // If it's a vendor, we can filter or let them browse all opportunities
    return vendorOpportunities
  }, [vendorOpportunities])

  const handleBidSubmit = () => {
    if (!biddingOpp) return

    const newBid: VendorBid = {
      id: `bid-${Date.now()}`,
      opportunityId: biddingOpp.id,
      vendorId: vendorId,
      vendorName: vendorName,
      proposedCost: Number(proposedCost),
      estimatedDays: Number(estimatedDays),
      notes: notes,
      submittedAt: new Date(),
      status: 'pending'
    }

    addBidToOpportunity(biddingOpp.id, newBid)
    toast.success(`Bid submitted for ${biddingOpp.title}!`)
    setBiddingOpp(null)
    setNotes('')
  }

  const handleAcceptAward = (opp: VendorOpportunity) => {
    // Moves opportunity and service request to in_progress stage
    updateVendorOpportunity(opp.id, { status: 'closed' })
    updateServiceRequest(opp.serviceRequestId, { status: 'in_progress' })
    toast.success('Opportunity work accepted! Status updated to In Progress.')
  }

  return (
    <div className="flex flex-col bg-background">
      <AppHeader
        title="Vendor Bidding Board"
        subtitle="Browse available opportunities, submit bids, and manage contracted projects"
        hideQuickCreate
      />

      <div className="space-y-6 page-body">
        {/* Main Opportunity Grid */}
        <div className="grid grid-cols-1 gap-4">
          {filteredOpportunities.length === 0 ? (
            <EmptyState
              icon={Briefcase}
              title="No open opportunities"
              description="There are currently no new vendor opportunities published. Check back later!"
            />
          ) : (
            filteredOpportunities.map(opp => {
              const myBid = opp.bids.find(b => b.vendorId === vendorId)
              const isAwardedToMe = opp.awardedVendorId === vendorId
              const isClosed = opp.status === 'closed'
              const isAwarded = opp.status === 'awarded'

              return (
                <Card key={opp.id} className={cn(
                  "border-border bg-card transition-all duration-300",
                  isAwardedToMe && "border-pink-500/35 bg-pink-950/5 shadow-[0_0_12px_rgba(219,39,119,0.05)]",
                  opp.status === 'open' && "hover:border-border/80"
                )}>
                  <CardContent className="p-5">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      
                      {/* Left: Info */}
                      <div className="space-y-3 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-lg text-foreground">{opp.title}</h3>
                          <Badge variant="outline" className={cn('capitalize', priorityColors[opp.priority])}>{opp.priority}</Badge>
                          <Badge variant="outline" className="bg-muted text-muted-foreground">{opp.category}</Badge>
                          
                          {opp.status === 'open' && <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Active Bidding</Badge>}
                          {isAwarded && <Badge className="bg-pink-500/10 text-pink-400 border-pink-500/20">Awarded</Badge>}
                          {isClosed && <Badge className="bg-zinc-500/10 text-zinc-400 border-zinc-500/20">Contract Active</Badge>}
                        </div>

                        <p className="text-sm text-muted-foreground max-w-2xl">{opp.description}</p>

                        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1 font-mono">Opp ID: {opp.id}</span>
                          <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />Published {formatRelativeDate(opp.publishedAt)}</span>
                          {opp.deadline && <span className="flex items-center gap-1 text-amber-400"><Clock className="h-3.5 w-3.5" />Deadline: {formatDate(opp.deadline)}</span>}
                          {opp.estimatedBudget && <span className="flex items-center gap-1 text-emerald-400 font-semibold"><DollarSign className="h-3.5 w-3.5" />Budget: ${opp.estimatedBudget}</span>}
                        </div>
                      </div>

                      {/* Right: Actions / Bid Status */}
                      <div className="flex flex-col gap-2 flex-shrink-0 justify-center min-w-[160px] border-t md:border-t-0 md:border-l border-border/60 pt-3 md:pt-0 md:pl-4">
                        {opp.status === 'open' && !myBid && (
                          <Button 
                            className="w-full gap-1.5"
                            onClick={() => {
                              setBiddingOpp(opp)
                              setProposedCost(opp.estimatedBudget ? String(opp.estimatedBudget) : '1200')
                            }}
                          >
                            <Send className="h-4 w-4" /> Bid on Work
                          </Button>
                        )}

                        {myBid && opp.status === 'open' && (
                          <div className="bg-muted/30 border border-border p-3 rounded-lg text-center space-y-1">
                            <span className="text-[10px] text-muted-foreground block uppercase font-bold tracking-wider">Your Bid</span>
                            <span className="text-sm font-semibold text-emerald-400">${myBid.proposedCost}</span>
                            <span className="text-[10px] text-muted-foreground block">In {myBid.estimatedDays} days</span>
                            <Badge className="bg-amber-400/10 text-amber-400 border border-amber-400/20 text-[10px] scale-95 mt-1">Pending Review</Badge>
                          </div>
                        )}

                        {isAwarded && isAwardedToMe && (
                          <div className="bg-pink-950/10 border border-pink-500/20 p-3 rounded-lg text-center space-y-2">
                            <span className="text-[10px] text-pink-400 block uppercase font-bold tracking-wider">Work Awarded!</span>
                            <span className="text-xs text-muted-foreground block">Confirm acceptance to begin work order.</span>
                            <Button 
                              size="sm" 
                              className="w-full bg-pink-600 hover:bg-pink-700 text-white gap-1"
                              onClick={() => handleAcceptAward(opp)}
                            >
                              <Check className="h-3.5 w-3.5" /> Accept Contract
                            </Button>
                          </div>
                        )}

                        {isClosed && isAwardedToMe && (
                          <div className="bg-emerald-950/10 border border-emerald-500/20 p-3 rounded-lg text-center space-y-1">
                            <span className="text-[10px] text-emerald-400 block uppercase font-bold tracking-wider">Contract Active</span>
                            <span className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-1">
                              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                              Active Project
                            </span>
                          </div>
                        )}

                        {isAwarded && !isAwardedToMe && (
                          <div className="text-center py-2 text-xs text-muted-foreground italic">
                            Awarded to competitor
                          </div>
                        )}
                      </div>

                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </div>

      {/* Bid Dialog */}
      <Dialog open={!!biddingOpp} onOpenChange={() => setBiddingOpp(null)}>
        <DialogContent className="max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle>Submit Bid Proposal</DialogTitle>
            <CardDescription>Bid on: {biddingOpp?.title}</CardDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Proposed Cost ($)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="number" className="pl-8" value={proposedCost} onChange={e => setProposedCost(e.target.value)} />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Est. Duration (Days)</Label>
                <Input type="number" value={estimatedDays} onChange={e => setEstimatedDays(e.target.value)} />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Bid Notes & References</Label>
              <Textarea 
                placeholder="Detail your qualifications, response time, warranty, or scope adjustments..." 
                rows={3}
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setBiddingOpp(null)}>Cancel</Button>
            <Button onClick={handleBidSubmit} disabled={!proposedCost || !estimatedDays}>Submit Bid</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
