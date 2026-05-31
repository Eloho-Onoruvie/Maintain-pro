import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { useMockDataStore } from '@/services/mockDataStore'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { WorkOrder, WorkOrderPriority, WorkOrderStatus } from '@/types/common.types'

const CATEGORIES = [
  'HVAC',
  'Electrical',
  'Plumbing',
  'Elevator',
  'Structural',
  'Safety',
  'Security',
  'Cleaning',
  'Other',
]

const PRIORITIES: WorkOrderPriority[] = ['critical', 'high', 'medium', 'low']
const STATUSES: WorkOrderStatus[] = [
  'open',
  'assigned',
  'in_progress',
  'pending',
  'completed',
  'verified',
  'closed',
  'cancelled',
]

interface EditWorkOrderDialogProps {
  workOrder: WorkOrder | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaved?: (workOrder: WorkOrder) => void
}

export function EditWorkOrderDialog({
  workOrder,
  open,
  onOpenChange,
  onSaved,
}: EditWorkOrderDialogProps) {
  const locations = useMockDataStore((s) => s.locations)
  const assets = useMockDataStore((s) => s.assets)
  const updateWorkOrder = useMockDataStore((s) => s.updateWorkOrder)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    priority: '' as WorkOrderPriority | '',
    status: '' as WorkOrderStatus | '',
    locationId: '',
    assetId: '',
    estimatedCost: '',
  })

  useEffect(() => {
    if (!workOrder || !open) return
    setForm({
      title: workOrder.title,
      description: workOrder.description,
      category: workOrder.category.toLowerCase(),
      priority: workOrder.priority,
      status: workOrder.status,
      locationId: workOrder.locationId,
      assetId: workOrder.assetId ?? '',
      estimatedCost: workOrder.estimatedCost?.toString() ?? '',
    })
  }, [workOrder, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!workOrder) return
    setSaving(true)
    await new Promise((r) => setTimeout(r, 600))
    const location = locations.find((l) => l.id === form.locationId)
    const asset = assets.find((a) => a.id === form.assetId)
    const updated: WorkOrder = {
      ...workOrder,
      title: form.title,
      description: form.description,
      category: form.category,
      priority: form.priority as WorkOrderPriority,
      status: form.status as WorkOrderStatus,
      locationId: form.locationId,
      locationName: location?.name ?? workOrder.locationName,
      assetId: form.assetId || undefined,
      assetName: asset?.name,
      estimatedCost: form.estimatedCost ? Number(form.estimatedCost) : undefined,
      updatedAt: new Date(),
    }
    updateWorkOrder(updated.id, updated)
    setSaving(false)
    toast.success(`${workOrder.id} updated`)
    onSaved?.(updated)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle>Edit work order</DialogTitle>
          <DialogDescription>
            {workOrder ? `Update details for ${workOrder.id}` : 'Update work order details'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="wo-edit-title">Title</Label>
            <Input
              id="wo-edit-title"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="wo-edit-desc">Description</Label>
            <Textarea
              id="wo-edit-desc"
              rows={3}
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select
                value={form.category}
                onValueChange={(v) => setForm((p) => ({ ...p, category: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c.toLowerCase()}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Priority</Label>
              <Select
                value={form.priority}
                onValueChange={(v) => setForm((p) => ({ ...p, priority: v as WorkOrderPriority }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((p) => (
                    <SelectItem key={p} value={p} className="capitalize">
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select
              value={form.status}
              onValueChange={(v) => setForm((p) => ({ ...p, status: v as WorkOrderStatus }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s} className="capitalize">
                    {s.replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Location</Label>
            <Select
              value={form.locationId}
              onValueChange={(v) => setForm((p) => ({ ...p, locationId: v }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((loc) => (
                  <SelectItem key={loc.id} value={loc.id}>
                    {loc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Related asset (optional)</Label>
            <Select
              value={form.assetId || '__none__'}
              onValueChange={(v) => setForm((p) => ({ ...p, assetId: v === '__none__' ? '' : v }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">None</SelectItem>
                {assets.map((asset) => (
                  <SelectItem key={asset.id} value={asset.id}>
                    {asset.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="wo-edit-cost">Estimated cost ($)</Label>
            <Input
              id="wo-edit-cost"
              type="number"
              min={0}
              value={form.estimatedCost}
              onChange={(e) => setForm((p) => ({ ...p, estimatedCost: e.target.value }))}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving || !form.title || !form.description}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
