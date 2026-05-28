import { MapPin, User } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { formatRelativeDate } from '@/utils/formatDate'
import { cn } from '@/utils/helpers'
import type { ServiceRequest } from '@/types/common.types'

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

export function ViewServiceRequestDialog({
  request,
  open,
  onOpenChange,
}: ViewServiceRequestDialogProps) {
  if (!request) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-card border-border">
        <DialogHeader>
          <DialogTitle>{request.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="capitalize">{request.status.replace('_', ' ')}</Badge>
            <Badge variant="outline" className={cn('capitalize', priorityColors[request.priority])}>
              {request.priority}
            </Badge>
            <span className="font-mono text-xs text-muted-foreground">{request.id}</span>
          </div>
          <p className="text-muted-foreground leading-relaxed">{request.description}</p>
          <div className="flex flex-col gap-2 text-muted-foreground">
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {request.locationName}
            </span>
            <span className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {request.requesterName}
            </span>
            <span>Submitted {formatRelativeDate(request.createdAt)}</span>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
