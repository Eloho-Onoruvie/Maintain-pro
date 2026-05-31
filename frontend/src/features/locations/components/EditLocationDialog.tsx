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
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useMockDataStore } from '@/services/mockDataStore'
import type { Location } from '@/types/common.types'

interface EditLocationDialogProps {
  location: Location | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditLocationDialog({ location, open, onOpenChange }: EditLocationDialogProps) {
  const locations = useMockDataStore((s) => s.locations)
  const updateLocation = useMockDataStore((s) => s.updateLocation)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '',
    type: 'building' as Location['type'],
    address: '',
    description: '',
    parentId: '',
  })

  useEffect(() => {
    if (!location || !open) return
    setForm({
      name: location.name,
      type: location.type,
      address: location.address ?? '',
      description: location.description ?? '',
      parentId: location.parentId ?? '',
    })
  }, [location, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!location) return
    setSaving(true)
    updateLocation(location.id, {
      name: form.name,
      type: form.type,
      address: form.address || undefined,
      description: form.description || undefined,
      parentId: form.parentId || undefined,
    })
    setSaving(false)
    toast.success(`${location.name} updated`)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle>Edit location</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select value={form.type} onValueChange={(v) => setForm((p) => ({ ...p, type: v as Location['type'] }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(['site', 'building', 'floor', 'room', 'zone'] as const).map((t) => (
                    <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Parent</Label>
              <Select
                value={form.parentId || '__none__'}
                onValueChange={(v) => setForm((p) => ({ ...p, parentId: v === '__none__' ? '' : v }))}
              >
                <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">None</SelectItem>
                  {locations.filter((l) => l.id !== location?.id).map((l) => (
                    <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Address</Label>
            <Input value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} />
          </div>
          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea rows={2} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
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
