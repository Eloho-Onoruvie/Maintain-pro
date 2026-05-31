import type { EscalationRule, VendorInvoice, WorkOrder } from '@/types/common.types'

export const SEED_ESCALATION_RULES: EscalationRule[] = [
  {
    id: 'esc-1',
    name: 'Critical overdue — 4h',
    triggerHours: 4,
    priority: 'critical',
    escalateTo: 'Operations Director',
    method: ['in_app', 'email'],
    isActive: true,
    level: 1,
  },
  {
    id: 'esc-2',
    name: 'High priority overdue — 24h',
    triggerHours: 24,
    priority: 'high',
    escalateTo: 'Facility Manager',
    method: ['in_app'],
    isActive: true,
    level: 1,
  },
]

export const SEED_VENDOR_INVOICES: VendorInvoice[] = [
  {
    id: 'INV-2024-001',
    workOrderId: 'WO-2024-005',
    vendorId: 'vendor-1',
    vendorName: 'ProTech HVAC Services',
    amount: 420,
    estimatedAmount: 450,
    status: 'pending',
    submittedAt: new Date(),
    invoiceNumber: 'INV-PT-8821',
  },
]

export function enrichWorkOrdersForStories(workOrders: WorkOrder[]): WorkOrder[] {
  return workOrders.map((wo) => {
    const patch: Partial<WorkOrder> = {}

    if (wo.id === 'WO-2024-002' && wo.assigneeId?.startsWith('vendor')) {
      patch.vendorOfferStatus = 'pending_acceptance'
    }
    if (wo.id === 'WO-2024-005' && wo.assigneeId === 'vendor-1') {
      patch.vendorOfferStatus = 'accepted'
      patch.status = 'in_progress'
    }
    if (wo.id === 'WO-2024-003') {
      patch.requiresApproval = true
      patch.estimatedCost = 3200
    }
    if (wo.id === 'WO-2024-006') {
      patch.requiresApproval = true
      patch.estimatedCost = 8500
    }

    return Object.keys(patch).length ? { ...wo, ...patch } : wo
  })
}
