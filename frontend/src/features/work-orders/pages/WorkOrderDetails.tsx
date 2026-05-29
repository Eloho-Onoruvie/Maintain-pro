


import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import {AppHeader as Navbar } from '@/components/navigation/Navbar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  ArrowLeft, 
  Clock, 
  MapPin, 
  Calendar,
  User,
  DollarSign,
  Wrench,
  Building2,
  Edit,
  Trash2,
  Send,
  Camera,
  Paperclip,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
} from 'lucide-react'
import { mockWorkOrders, mockUsers } from '../services/workOrders.service'
import { WorkOrderPriority, WorkOrderStatus } from '@/types/common.types'
import { cn } from '@/utils/helpers'
import { usePortalPath } from '@/hooks/usePortal'
import { useRoleAccess } from '@/hooks/useRoleAccess'
import { useWorkOrderModals } from '@/features/work-orders/hooks/useWorkOrderModals'

const priorityStyles: Record<WorkOrderPriority, string> = {
  critical: 'bg-status-critical/10 text-status-critical border-status-critical/20',
  high: 'bg-status-high/10 text-status-high border-status-high/20',
  medium: 'bg-status-active/10 text-status-active border-status-active/20',
  low: 'bg-muted text-muted-foreground border-border',
}

const statusStyles: Record<WorkOrderStatus, string> = {
  open: 'bg-status-active/10 text-status-active',
  in_progress: 'bg-status-pending/10 text-status-pending',
  assigned: 'bg-status-active/10 text-status-active',
  verified: 'bg-status-completed/10 text-status-completed',
  pending: 'bg-status-high/10 text-status-high',
  closed: 'bg-muted text-muted-foreground',
  completed: 'bg-status-completed/10 text-status-completed',
  cancelled: 'bg-muted text-muted-foreground',
}

const statusLabels: Record<WorkOrderStatus, string> = {
  open: "Open",
  in_progress: "In Progress",
  assigned: "Assigned",
  verified: "Verified",
  pending: "Pending",
  closed: "Closed",
  completed: "Completed",
  cancelled: "Cancelled",
};

interface PageProps {
  params: Promise<{ id: string }>
}

export function WorkOrderDetails() {
  const { id } = useParams()
  const workOrdersPath = usePortalPath('work-orders')
  const assetsPath = usePortalPath('assets')
  const { isMaintenanceReadOnly } = useRoleAccess()
  const { openEdit, openAssign, openDelete, modals } = useWorkOrderModals()
  const [comment, setComment] = useState('')
  const workOrder = mockWorkOrders.find(wo => wo.id === id) || mockWorkOrders[0]

  const activities = [
    { 
      id: 1, 
      user: 'Mike Rodriguez', 
      action: 'started working on this', 
      time: '2 hours ago',
      type: 'status'
    },
    { 
      id: 2, 
      user: 'Sarah Chen', 
      action: 'assigned this to Mike Rodriguez', 
      time: '4 hours ago',
      type: 'assignment'
    },
    { 
      id: 3, 
      user: 'Sarah Chen', 
      action: 'created this work order', 
      time: '6 hours ago',
      type: 'create'
    },
  ]

  return (
    <>
      {modals}
      <Navbar
        title={workOrder.id}
        subtitle={workOrder.title}
        hideQuickCreate
        actions={
          !isMaintenanceReadOnly ? (
            <div className="page-actions">
              <Button variant="outline" size="sm" onClick={() => openEdit(workOrder)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => openDelete(workOrder)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          ) : undefined
        }
      />
      
      <div className="page-body">
        {/* Back Link */}
        <Link 
          to={workOrdersPath} 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Work Orders
        </Link>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={cn('capitalize', priorityStyles[workOrder.priority])}>
                        {workOrder.priority} Priority
                      </Badge>
                      <Badge className={cn(statusStyles[workOrder.status])}>
                        {statusLabels[workOrder.status]}
                      </Badge>
                    </div>
                    <h1 className="text-xl font-semibold text-foreground">{workOrder.title}</h1>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {workOrder.locationName}
                      </div>
                      <div className="flex items-center gap-1">
                        <Wrench className="h-4 w-4" />
                        {workOrder.category}
                      </div>
                      {workOrder.dueDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Due {new Date(workOrder.dueDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                  <Select
                    defaultValue={workOrder.status}
                    disabled={isMaintenanceReadOnly}
                    onValueChange={(value) => toast.success(`Status updated to ${value.replace('_', ' ')}`)}
                  >
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Update Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {workOrder.description}
                </p>
              </CardContent>
            </Card>

            {/* Photos */}
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Photos & Attachments</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast.info('Photo upload will be available when connected to the API')}
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Add Photo
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="aspect-square rounded-lg bg-secondary flex items-center justify-center border-2 border-dashed border-border">
                    <div className="text-center">
                      <Paperclip className="h-6 w-6 mx-auto text-muted-foreground" />
                      <p className="text-xs text-muted-foreground mt-1">No photos yet</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comments & Activity */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base">Activity & Comments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Comment Input */}
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/20 text-primary text-xs">SC</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <Textarea
                      placeholder="Add a comment..."
                      className="min-h-[80px] bg-secondary resize-none"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        disabled={!comment.trim()}
                        onClick={() => {
                          toast.success('Comment posted')
                          setComment('')
                        }}
                      >
                        <Send className="mr-2 h-4 w-4" />
                        Send
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Activity Timeline */}
                <div className="space-y-4">
                  {activities.map((activity, index) => (
                    <div key={activity.id} className="flex gap-3">
                      <div className="relative">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-secondary text-muted-foreground text-xs">
                            {activity.user.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        {index < activities.length - 1 && (
                          <div className="absolute left-4 top-8 bottom-0 w-px bg-border h-8" />
                        )}
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="text-sm">
                          <span className="font-medium text-foreground">{activity.user}</span>
                          {' '}
                          <span className="text-muted-foreground">{activity.action}</span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Details */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base">Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Assignee</span>
                  {workOrder.assigneeName ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="bg-primary/20 text-primary text-xs">
                          {workOrder.assigneeName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{workOrder.assigneeName}</span>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 text-primary"
                      onClick={() => openAssign(workOrder)}
                    >
                      Assign
                    </Button>
                  )}
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Requester</span>
                  <span className="text-sm font-medium">{workOrder.requesterName}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Created</span>
                  <span className="text-sm">{new Date(workOrder.createdAt).toLocaleDateString()}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Updated</span>
                  <span className="text-sm">{new Date(workOrder.updatedAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>

            {/* Cost Tracking */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base">Cost Tracking</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Estimated</span>
                  <span className="text-sm font-medium">
                    ${workOrder.estimatedCost?.toLocaleString() || '—'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Actual</span>
                  <span className="text-sm font-medium text-status-completed">
                    ${workOrder.actualCost?.toLocaleString() || '—'}
                  </span>
                </div>
                {workOrder.estimatedCost && workOrder.actualCost && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Budget Used</span>
                        <span>{Math.round((workOrder.actualCost / workOrder.estimatedCost) * 100)}%</span>
                      </div>
                      <Progress 
                        value={(workOrder.actualCost / workOrder.estimatedCost) * 100} 
                        className="h-2"
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Asset Info */}
            {workOrder.assetName && (
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-base">Related Asset</CardTitle>
                </CardHeader>
                <CardContent>
                  <Link
                    to={`${assetsPath}/${workOrder.assetId}`}
                    className="block rounded-lg border border-border p-3 transition-colors hover:bg-accent/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <Wrench className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{workOrder.assetName}</p>
                        <p className="text-xs text-muted-foreground">{workOrder.category}</p>
                      </div>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* Location Info */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base">Location</CardTitle>
              </CardHeader>
              <CardContent>
                <button
                  type="button"
                  className="block w-full rounded-lg border border-border p-3 text-left transition-colors hover:bg-accent/50"
                  onClick={() => toast.info(`Location: ${workOrder.locationName}`)}
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Building2 className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{workOrder.locationName}</p>
                      <p className="text-xs text-muted-foreground">View location details</p>
                    </div>
                  </div>
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
