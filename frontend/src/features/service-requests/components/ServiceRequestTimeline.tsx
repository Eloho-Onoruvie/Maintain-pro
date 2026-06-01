import React from 'react'
import {
  FileText, Send, Search, CheckCircle, XCircle, UserCheck,
  Building, Award, FileSpreadsheet, Play, CheckCircle2, Archive
} from 'lucide-react'
import { cn } from '@/utils/helpers'
import type { ServiceRequestStatus } from '@/types/common.types'

interface ServiceRequestTimelineProps {
  currentStatus: ServiceRequestStatus
  assignmentType?: 'internal' | 'vendor'
}

interface Step {
  id: ServiceRequestStatus
  label: string
  icon: React.ElementType
  description: string
}

export function ServiceRequestTimeline({ currentStatus, assignmentType }: ServiceRequestTimelineProps) {
  // Define steps dynamically based on assignment type
  const steps: Step[] = [
    { id: 'draft', label: 'Draft', icon: FileText, description: 'Request created' },
    { id: 'submitted', label: 'Submitted', icon: Send, description: 'Awaiting initial check' },
    { id: 'under_review', label: 'Under Review', icon: Search, description: 'Facilities team reviewing' },
    { id: 'rejected', label: 'Rejected', icon: XCircle, description: 'Request declined' },
    { id: 'approved', label: 'Approved', icon: CheckCircle, description: 'Approved for action' },
  ]

  if (assignmentType === 'vendor' || currentStatus === 'open_to_vendors' || currentStatus === 'vendor_selected') {
    steps.push(
      { id: 'open_to_vendors', label: 'Open to Bids', icon: Building, description: 'Published to vendors' },
      { id: 'vendor_selected', label: 'Vendor Selected', icon: Award, description: 'Bid awarded' }
    )
  } else {
    steps.push(
      { id: 'assigned_internal', label: 'Assigned', icon: UserCheck, description: 'Assigned to tech' }
    )
  }

  steps.push(
    { id: 'work_order_created', label: 'WO Created', icon: FileSpreadsheet, description: 'Work order generated' },
    { id: 'in_progress', label: 'In Progress', icon: Play, description: 'Work is underway' },
    { id: 'completed', label: 'Completed', icon: CheckCircle2, description: 'Work completed' },
    { id: 'closed', label: 'Closed', icon: Archive, description: 'Ticket closed' }
  )

  // Find index of current status
  let activeIndex = steps.findIndex(s => s.id === currentStatus)
  // If not found (e.g. rejected is terminal but approved is bypassed), handle appropriately
  if (activeIndex === -1) {
    if (currentStatus === 'rejected') {
      activeIndex = 3 // rejected is step index 3
    } else {
      activeIndex = 0
    }
  }

  return (
    <div className="py-6 px-2">
      <div className="relative">
        {/* Connection Line */}
        <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-border/40 md:left-0 md:right-0 md:top-4 md:h-0.5 md:w-full md:bottom-auto" />
        
        {/* Active Line Progress */}
        <div 
          className="absolute left-4 top-2 w-0.5 bg-gradient-to-b from-primary to-cyan-500 transition-all duration-500 md:top-4 md:h-0.5 md:left-0 md:bottom-auto md:bg-gradient-to-r"
          style={{
            height: window.innerWidth < 768 ? `${(activeIndex / (steps.length - 1)) * 100}%` : '2px',
            width: window.innerWidth >= 768 ? `${(activeIndex / (steps.length - 1)) * 100}%` : '2px'
          }}
        />

        {/* Stepper items */}
        <div className="relative flex flex-col gap-6 md:flex-row md:justify-between md:gap-2">
          {steps.map((step, idx) => {
            const isCompleted = idx < activeIndex
            const isActive = idx === activeIndex
            const isCurrentRejected = currentStatus === 'rejected' && step.id === 'rejected'
            const isRejectedStep = step.id === 'rejected'

            // Skip rendering rejected step unless current status is rejected or it's the draft stage
            if (isRejectedStep && currentStatus !== 'rejected') return null

            const StepIcon = step.icon

            return (
              <div 
                key={step.id} 
                className={cn(
                  "flex items-start gap-3 md:flex-col md:items-center md:text-center md:flex-1",
                  isActive && "scale-105 transition-transform duration-300"
                )}
              >
                {/* Bullet */}
                <div 
                  className={cn(
                    "flex h-8.5 w-8.5 items-center justify-center rounded-full border-2 text-xs font-semibold z-10 transition-all duration-300",
                    isCompleted && "bg-primary border-primary text-primary-foreground shadow-[0_0_12px_rgba(var(--primary),0.3)]",
                    isActive && (isCurrentRejected ? "bg-red-500 border-red-500 text-white shadow-[0_0_12px_rgba(239,68,68,0.3)]" : "bg-background border-cyan-500 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)] animate-pulse"),
                    !isCompleted && !isActive && "bg-muted/55 border-muted-foreground/20 text-muted-foreground"
                  )}
                >
                  <StepIcon className="h-4 w-4" />
                </div>

                {/* Content */}
                <div className="flex flex-col md:items-center">
                  <span 
                    className={cn(
                      "text-xs font-semibold tracking-wide transition-colors",
                      isActive ? (isCurrentRejected ? "text-red-400" : "text-cyan-400") : isCompleted ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </span>
                  <span className="text-[10px] text-muted-foreground/70 hidden md:block max-w-[100px] mt-0.5">
                    {step.description}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
