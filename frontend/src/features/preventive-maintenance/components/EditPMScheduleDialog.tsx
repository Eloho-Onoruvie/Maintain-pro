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
import type { PMFrequency, PreventiveMaintenance } from '@/types/common.types'

const FREQUENCIES: PMFrequency[] = ['daily', 'weekly', 'monthly', 'quarterly', 'yearly', 'custom']

interface EditPMScheduleDialogProps {
  schedule: PreventiveMaintenance | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditPMScheduleDialog({ schedule, open, onOpenChange }: EditPMScheduleDialogProps) {
  const updatePm = useMockDataStore((s) => s.updatePm)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    frequency: 'monthly' as PMFrequency,
    isActive: true,
  })

  useEffect(() => {
    if (!schedule || !open) return
    setForm({
      title: schedule.title,
      description: schedule.description,
      frequency: schedule.frequency,
      isActive: schedule.isActive,
    })
  }, [schedule, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!schedule) return
    setSaving(true)
    updatePm(schedule.id, {
      title: form.title,
      description: form.description,
      frequency: form.frequency,
      isActive: form.isActive,
    })
    setSaving(false)
    toast.success(`Schedule "${schedule.title}" updated`)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle>Edit PM schedule</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label>Title</Label>
            <Input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} required />
          </div>
          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea rows={2} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Frequency</Label>
              <Select value={form.frequency} onValueChange={(v) => setForm((p) => ({ ...p, frequency: v as PMFrequency }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {FREQUENCIES.map((f) => (
                    <SelectItem key={f} value={f} className="capitalize">{f}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select
                value={form.isActive ? 'active' : 'paused'}
                onValueChange={(v) => setForm((p) => ({ ...p, isActive: v === 'active' }))}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
