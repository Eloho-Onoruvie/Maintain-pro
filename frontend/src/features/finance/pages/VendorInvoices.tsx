import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, FileText, XCircle } from 'lucide-react'
import { toast } from 'sonner'

import { AppHeader } from '@/components/navigation/Navbar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { usePortalPath } from '@/hooks/usePortal'
import { useAuthStore } from '@/app/store'
import { useMockDataStore } from '@/services/mockDataStore'
import type { VendorInvoice } from '@/types/common.types'
import { formatDate } from '@/utils/formatDate'
import { cn } from '@/utils/helpers'

const statusStyle: Record<VendorInvoice['status'], string> = {
  pending: 'border-amber-400/20 text-amber-400 bg-amber-400/10',
  approved: 'border-emerald-400/20 text-emerald-400 bg-emerald-400/10',
  paid: 'border-blue-400/20 text-blue-400 bg-blue-400/10',
  rejected: 'border-red-400/20 text-red-400 bg-red-400/10',
  disputed: 'border-orange-400/20 text-orange-400 bg-orange-400/10',
}

export function VendorInvoices() {
  const invoices = useMockDataStore((s) => s.vendorInvoices)
  const workOrders = useMockDataStore((s) => s.workOrders)
  const updateVendorInvoice = useMockDataStore((s) => s.updateVendorInvoice)
  const updateWorkOrder = useMockDataStore((s) => s.updateWorkOrder)
  const workOrdersPath = usePortalPath('work-orders')
  const [filter, setFilter] = useState<'all' | VendorInvoice['status']>('pending')

  const filtered = useMemo(() => {
    if (filter === 'all') return invoices
    return invoices.filter((inv) => inv.status === filter)
  }, [filter, invoices])

  const user = useAuthStore((s) => s.user)
  const actorName = user ? `${user.firstName} ${user.lastName}` : 'Finance Staff'

  const markPaid = (inv: VendorInvoice) => {
    const entry = {
      id: `AE-${Date.now()}`,
      action: 'Paid',
      actorName: actorName,
      timestamp: new Date(),
      notes: 'Payment processed and closed.',
    }
    updateVendorInvoice(inv.id, {
      status: 'paid',
      paidAt: new Date(),
      auditLog: [...(inv.auditLog ?? []), entry],
    })
    updateWorkOrder(inv.workOrderId, { paymentStatus: 'paid' })
    toast.success(`Invoice ${inv.id} marked paid`)
  }

  const approve = (inv: VendorInvoice) => {
    const entry = {
      id: `AE-${Date.now()}`,
      action: 'Approved',
      actorName: actorName,
      timestamp: new Date(),
      notes: 'Invoice matched and approved.',
    }
    updateVendorInvoice(inv.id, {
      status: 'approved',
      auditLog: [...(inv.auditLog ?? []), entry],
    })
    updateWorkOrder(inv.workOrderId, { paymentStatus: 'approved' })
    toast.success(`Invoice ${inv.id} approved`)
  }

  const reject = (inv: VendorInvoice) => {
    const entry = {
      id: `AE-${Date.now()}`,
      action: 'Rejected',
      actorName: actorName,
      timestamp: new Date(),
      notes: 'Invoice disputed/rejected.',
    }
    updateVendorInvoice(inv.id, {
      status: 'rejected',
      auditLog: [...(inv.auditLog ?? []), entry],
    })
    toast.success(`Invoice ${inv.id} rejected`)
  }

  return (
    <div className="flex flex-col bg-background">
      <AppHeader
        title="Vendor Invoices"
        subtitle="Match invoices to work orders before payment (US-12)"
        hideQuickCreate
      />
      <div className="page-body space-y-4">
        <div className="flex flex-wrap gap-2">
          {(['all', 'pending', 'approved', 'paid', 'disputed'] as const).map((s) => (
            <Button
              key={s}
              size="sm"
              variant={filter === s ? 'default' : 'outline'}
              onClick={() => setFilter(s)}
              className="capitalize"
            >
              {s}
            </Button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <Card className="border-border bg-card">
            <CardContent className="p-8 text-center text-muted-foreground">
              No invoices in this view.
            </CardContent>
          </Card>
        ) : (
          filtered.map((inv) => {
            const wo = workOrders.find((w) => w.id === inv.workOrderId)
            const variance =
              inv.estimatedAmount != null
                ? inv.amount - inv.estimatedAmount
                : null
            return (
              <Card key={inv.id} className="border-border bg-card">
                <CardContent className="space-y-3 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="mb-1 flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{inv.invoiceNumber ?? inv.id}</span>
                        <Badge variant="outline" className={cn('text-xs', statusStyle[inv.status])}>
                          {inv.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {inv.vendorName} · WO{' '}
                        <Link
                          to={`${workOrdersPath}/${inv.workOrderId}`}
                          className="text-primary hover:underline"
                        >
                          {inv.workOrderId}
                        </Link>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Submitted {formatDate(inv.submittedAt)}
                        {inv.paidAt ? ` · Paid ${formatDate(inv.paidAt)}` : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold">${inv.amount.toLocaleString()}</p>
                      {inv.estimatedAmount != null && (
                        <p className="text-xs text-muted-foreground">
                          Estimate ${inv.estimatedAmount.toLocaleString()}
                          {variance != null && (
                            <span
                              className={cn(
                                ' ml-1',
                                variance > 0 ? 'text-amber-400' : 'text-emerald-400',
                              )}
                            >
                              ({variance > 0 ? '+' : ''}
                              {variance})
                            </span>
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                  {wo?.completionNotes && (
                    <p className="rounded-md bg-muted/40 p-2 text-sm text-muted-foreground">
                      Completion: {wo.completionNotes}
                    </p>
                  )}
                  {wo?.images && wo.images.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-xs font-semibold text-muted-foreground">Completion Photos:</span>
                      <div className="flex flex-wrap gap-2">
                        {wo.images.map((img, i) => (
                          <img
                            key={i}
                            src={img.startsWith('data:') ? img : `https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=200`}
                            alt="Work completion evidence"
                            className="h-16 w-16 object-cover rounded border border-border"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  {inv.auditLog && inv.auditLog.length > 0 && (
                    <div className="rounded-lg border border-border p-3 space-y-2 bg-muted/10">
                      <span className="text-xs font-semibold text-muted-foreground block">Invoice Audit Trail</span>
                      <div className="space-y-2 text-xs">
                        {inv.auditLog.map((log) => (
                          <div key={log.id} className="flex justify-between border-b border-border/40 pb-1.5 last:border-b-0 last:pb-0">
                            <div>
                              <span className="font-semibold text-foreground">{log.action}</span>
                              <span className="text-muted-foreground ml-1">by {log.actorName}</span>
                              {log.notes && <p className="text-[11px] text-muted-foreground mt-0.5">{log.notes}</p>}
                            </div>
                            <span className="text-muted-foreground text-[10px]">{formatDate(new Date(log.timestamp))}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {inv.status === 'pending' && (
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" className="gap-1" onClick={() => approve(inv)}>
                        <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => markPaid(inv)}>
                        Mark paid
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive"
                        onClick={() => reject(inv)}
                      >
                        <XCircle className="h-3.5 w-3.5" /> Reject
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
