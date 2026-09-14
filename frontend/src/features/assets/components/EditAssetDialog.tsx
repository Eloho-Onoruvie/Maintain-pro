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
import { assetsApi } from '@/features/assets/api/assets.api'
import type { BackendAsset, BackendAssetCategory, BackendAssetStatus } from '@/features/assets/api/assets.contract'

const STATUSES: BackendAssetStatus[] = ['active', 'inactive', 'under_maintenance', 'retired']
const CATEGORIES: BackendAssetCategory[] = ['hardware', 'software', 'infrastructure', 'other']

interface EditAssetDialogProps {
  asset: BackendAsset | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaved?: (asset: BackendAsset) => void
}

export function EditAssetDialog({ asset, open, onOpenChange, onSaved }: EditAssetDialogProps) {
  const locations = asset?.locationId ? [{ id: asset.locationId, name: 'Assigned location' }] : []
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '',
    category: 'other' as BackendAssetCategory,
    status: 'active' as BackendAssetStatus,
    locationId: '',
    manufacturer: '',
    model: '',
    serialNumber: '',
  })

  useEffect(() => {
    if (!asset || !open) return
    setForm({
      name: asset.name,
      category: asset.category,
      status: asset.status,
      locationId: asset.locationId ?? '',
      manufacturer: asset.manufacturer ?? '',
      model: asset.modelNumber ?? '',
      serialNumber: asset.serialNumber ?? '',
    })
  }, [asset, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!asset) return
    setSaving(true)
    try {
      const payload = {
        name: form.name,
        status: form.status,
        category: form.category,
        locationId: form.locationId || undefined,
        manufacturer: form.manufacturer || undefined,
        modelNumber: form.model || undefined,
        serialNumber: form.serialNumber || undefined,
      }
      const updated = await assetsApi.update(asset.assetTag, payload)
      toast.success(`${asset.name} updated`)
      onSaved?.(updated)
      onOpenChange(false)
    } catch {
      toast.error('Unable to update asset')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle>Edit asset</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(value) => setForm((p) => ({ ...p, category: value as BackendAssetCategory }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category} className="capitalize">{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(value) => setForm((p) => ({ ...p, status: value as BackendAssetStatus }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STATUSES.map((status) => (
                    <SelectItem key={status} value={status} className="capitalize">{status.replace('_', ' ')}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {locations.length > 0 ? (
            <div className="space-y-1.5">
              <Label>Location</Label>
              <Select value={form.locationId} onValueChange={(value) => setForm((p) => ({ ...p, locationId: value }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location.id} value={location.id}>{location.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : null}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Manufacturer</Label>
              <Input value={form.manufacturer} onChange={(e) => setForm((p) => ({ ...p, manufacturer: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Model</Label>
              <Input value={form.model} onChange={(e) => setForm((p) => ({ ...p, model: e.target.value }))} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Serial number</Label>
            <Input value={form.serialNumber} onChange={(e) => setForm((p) => ({ ...p, serialNumber: e.target.value }))} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
