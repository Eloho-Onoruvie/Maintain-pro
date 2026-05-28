import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { InventoryItem } from '@/types/common.types'

const CATEGORIES = ['HVAC', 'Electrical', 'Plumbing', 'Fire Safety', 'Elevator', 'General', 'Cleaning', 'Security']

interface EditInventoryItemDialogProps {
  item: InventoryItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditInventoryItemDialog({ item, open, onOpenChange }: EditInventoryItemDialogProps) {
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '',
    sku: '',
    category: '',
    quantity: '',
    minStock: '',
    unitPrice: '',
    supplier: '',
  })

  useEffect(() => {
    if (!item || !open) return
    setForm({
      name: item.name,
      sku: item.sku,
      category: item.category,
      quantity: String(item.quantity),
      minStock: String(item.minStock),
      unitPrice: String(item.unitPrice),
      supplier: item.supplier ?? '',
    })
  }, [item, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!item) return
    setSaving(true)
    await new Promise((r) => setTimeout(r, 500))
    setSaving(false)
    toast.success(`${item.name} updated`)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle>Edit inventory item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>SKU</Label>
              <Input value={form.sku} onChange={(e) => setForm((p) => ({ ...p, sku: e.target.value }))} required />
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm((p) => ({ ...p, category: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label>Qty</Label>
              <Input type="number" min={0} value={form.quantity} onChange={(e) => setForm((p) => ({ ...p, quantity: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Min stock</Label>
              <Input type="number" min={0} value={form.minStock} onChange={(e) => setForm((p) => ({ ...p, minStock: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Unit price</Label>
              <Input type="number" min={0} step="0.01" value={form.unitPrice} onChange={(e) => setForm((p) => ({ ...p, unitPrice: e.target.value }))} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Supplier</Label>
            <Input value={form.supplier} onChange={(e) => setForm((p) => ({ ...p, supplier: e.target.value }))} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
