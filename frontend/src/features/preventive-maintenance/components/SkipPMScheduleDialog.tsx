import { useState } from 'react'
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
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { PreventiveMaintenance } from '@/types/common.types'

interface SkipPMScheduleDialogProps {
  schedule: PreventiveMaintenance | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SkipPMScheduleDialog({ schedule, open, onOpenChange }: SkipPMScheduleDialogProps) {
  const updatePm = useMockDataStore((s) => s.updatePm)
  const [reason, setReason] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!schedule || !reason.trim()) return
    setSaving(true)
    await new Promise((r) => setTimeout(r, 400))
    updatePm(schedule.id, { lastCompleted: new Date() })
    setSaving(false)
    toast.success(`Skipped ${schedule.title}`)
    setReason('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle>Skip schedule occurrence</DialogTitle>
          <DialogDescription>
            {schedule ? `Provide a reason for skipping "${schedule.title}"` : 'Skip this occurrence'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="skip-reason">Reason *</Label>
            <Textarea
              id="skip-reason"
              rows={3}
              placeholder="e.g. Asset temporarily offline, vendor rescheduled..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={saving || !reason.trim()}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Confirm skip
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
