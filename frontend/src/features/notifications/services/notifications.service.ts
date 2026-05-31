import type { Notification, NotificationType } from '@/types/common.types'
import type { UserRole } from '@/types/user.types'
import { USER_ROLES } from '@/types/user.types'

import { getNotificationTypesForRole } from '../config/notificationConfig'

type NotificationSeed = Omit<Notification, 'id' | 'userId' | 'createdAt'> & {
  idSuffix: string
  createdAtOffsetMs: number
}

const ROLE_NOTIFICATION_SEEDS: Partial<Record<UserRole, NotificationSeed[]>> = {
  [USER_ROLES.ADMIN]: [
    {
      idSuffix: 'wo-critical',
      type: 'work_order',
      title: 'Critical Work Order',
      message: 'WO-2024-001 HVAC System Failure — Building A requires immediate attention',
      isRead: false,
      createdAtOffsetMs: 5 * 60_000,
      priority: 'high',
      actionUrl: 'work-orders/WO-2024-001',
    },
    {
      idSuffix: 'escalation',
      type: 'escalation',
      title: 'Escalation Alert',
      message: 'WO-2024-077 is 6 hours overdue — escalated to Operations Director',
      isRead: false,
      createdAtOffsetMs: 45 * 60_000,
      priority: 'high',
      actionUrl: 'work-orders/WO-2024-077',
    },
    {
      idSuffix: 'inventory',
      type: 'inventory',
      title: 'Low Stock Alert',
      message: 'HVAC Air Filters (SKU-AF-001) is below minimum stock level (3 remaining)',
      isRead: false,
      createdAtOffsetMs: 2 * 3_600_000,
      priority: 'normal',
      actionUrl: 'inventory',
    },
    {
      idSuffix: 'approval',
      type: 'approval',
      title: 'Approval Required',
      message: 'Work Order WO-2024-091 requires your approval — estimated cost $4,500',
      isRead: false,
      createdAtOffsetMs: 3 * 3_600_000,
      priority: 'high',
      actionUrl: 'work-orders/WO-2024-091',
    },
    {
      idSuffix: 'contract',
      type: 'contract',
      title: 'Contract Expiring Soon',
      message: 'CoolTech HVAC Services contract expires in 28 days — renewal required',
      isRead: true,
      createdAtOffsetMs: 5 * 3_600_000,
      priority: 'high',
      actionUrl: 'vendors',
    },
    {
      idSuffix: 'system',
      type: 'system',
      title: 'System Backup Completed',
      message: 'Nightly data backup completed successfully at 03:00 AM',
      isRead: true,
      createdAtOffsetMs: 36 * 3_600_000,
      priority: 'normal',
    },
  ],
  [USER_ROLES.FACILITY_MANAGER]: [
    {
      idSuffix: 'wo-assigned',
      type: 'work_order',
      title: 'Work Order Assigned',
      message: 'WO-2024-089 "HVAC Compressor Repair" has been assigned to Mike Rodriguez',
      isRead: false,
      createdAtOffsetMs: 5 * 60_000,
      priority: 'high',
      actionUrl: 'work-orders/WO-2024-089',
    },
    {
      idSuffix: 'pm-due',
      type: 'maintenance',
      title: 'PM Schedule Due',
      message: 'Quarterly HVAC Inspection at Building A is due in 2 days',
      isRead: false,
      createdAtOffsetMs: 30 * 60_000,
      priority: 'normal',
      actionUrl: 'preventive-maintenance',
    },
    {
      idSuffix: 'inventory',
      type: 'inventory',
      title: 'Low Stock Alert',
      message: 'LED Light Bulb 60W is below minimum stock level (8/25)',
      isRead: false,
      createdAtOffsetMs: 2 * 3_600_000,
      priority: 'normal',
      actionUrl: 'inventory',
    },
    {
      idSuffix: 'escalation',
      type: 'escalation',
      title: 'Escalation Alert',
      message: 'WO-2024-077 is 6 hours overdue — escalated to Facilities Director',
      isRead: true,
      createdAtOffsetMs: 24 * 3_600_000,
      priority: 'high',
      actionUrl: 'work-orders/WO-2024-077',
    },
    {
      idSuffix: 'wo-complete',
      type: 'work_order',
      title: 'Work Order Completed',
      message: 'WO-2024-082 "Plumbing Leak — Floor 3" marked complete by Mike Rodriguez',
      isRead: true,
      createdAtOffsetMs: 8 * 3_600_000,
      priority: 'normal',
      actionUrl: 'work-orders/WO-2024-082',
    },
    {
      idSuffix: 'vendor-invoice',
      type: 'vendor',
      title: 'Invoice Submitted',
      message: 'PestAway Services submitted invoice INV-2024-156 for $1,200 — awaiting verification',
      isRead: true,
      createdAtOffsetMs: 26 * 3_600_000,
      priority: 'normal',
      actionUrl: 'vendors',
    },
  ],
  [USER_ROLES.TECHNICIAN]: [
    {
      idSuffix: 'wo-assigned',
      type: 'work_order',
      title: 'Work Order Assigned',
      message: 'WO-2024-089 "HVAC Compressor Repair" has been assigned to you',
      isRead: false,
      createdAtOffsetMs: 5 * 60_000,
      priority: 'high',
      actionUrl: 'work-orders/WO-2024-089',
    },
    {
      idSuffix: 'wo-urgent',
      type: 'work_order',
      title: 'Urgent Job Dispatch',
      message: 'WO-2024-095 Elevator malfunction — respond within 30 minutes',
      isRead: false,
      createdAtOffsetMs: 15 * 60_000,
      priority: 'high',
      actionUrl: 'work-orders/WO-2024-095',
    },
    {
      idSuffix: 'pm-due',
      type: 'maintenance',
      title: 'PM Task Due Today',
      message: 'Generator Weekly Test at Building C is scheduled for today at 2:00 PM',
      isRead: false,
      createdAtOffsetMs: 60 * 60_000,
      priority: 'normal',
      actionUrl: 'preventive-maintenance',
    },
    {
      idSuffix: 'pm-overdue',
      type: 'maintenance',
      title: 'PM Overdue',
      message: 'Monthly Elevator Inspection at Tower B is 3 days overdue',
      isRead: true,
      createdAtOffsetMs: 48 * 3_600_000,
      priority: 'high',
      actionUrl: 'preventive-maintenance',
    },
    {
      idSuffix: 'system',
      type: 'system',
      title: 'Schedule Updated',
      message: 'Your work schedule for next week has been published',
      isRead: true,
      createdAtOffsetMs: 12 * 3_600_000,
      priority: 'normal',
    },
  ],
  [USER_ROLES.VENDOR_TEAM_LEAD]: [
    {
      idSuffix: 'wo-assigned',
      type: 'work_order',
      title: 'New Service Request',
      message: 'WO-2024-102 "Roof Leak Repair" has been assigned to your company',
      isRead: false,
      createdAtOffsetMs: 10 * 60_000,
      priority: 'high',
      actionUrl: 'work-orders/WO-2024-102',
    },
    {
      idSuffix: 'approval',
      type: 'approval',
      title: 'Invoice Approved',
      message: 'Invoice INV-2024-142 ($3,200) has been approved for payment',
      isRead: false,
      createdAtOffsetMs: 3 * 3_600_000,
      priority: 'normal',
      actionUrl: 'vendors',
    },
    {
      idSuffix: 'contract',
      type: 'contract',
      title: 'Contract Renewal Due',
      message: 'Your annual maintenance agreement expires in 45 days',
      isRead: true,
      createdAtOffsetMs: 24 * 3_600_000,
      priority: 'high',
      actionUrl: 'vendors',
    },
    {
      idSuffix: 'vendor-payment',
      type: 'vendor',
      title: 'Payment Processed',
      message: 'Payment of $1,850 for invoice INV-2024-138 has been issued',
      isRead: true,
      createdAtOffsetMs: 72 * 3_600_000,
      priority: 'normal',
      actionUrl: 'vendors',
    },
  ],
  [USER_ROLES.STAFF]: [
    {
      idSuffix: 'sr-update',
      type: 'work_order',
      title: 'Request Update',
      message: 'Your service request SR-2024-034 "Broken light fixture" is now in progress',
      isRead: false,
      createdAtOffsetMs: 20 * 60_000,
      priority: 'normal',
      actionUrl: 'service-requests',
    },
    {
      idSuffix: 'sr-complete',
      type: 'work_order',
      title: 'Request Completed',
      message: 'Your service request SR-2024-028 "AC not cooling" has been resolved',
      isRead: false,
      createdAtOffsetMs: 4 * 3_600_000,
      priority: 'normal',
      actionUrl: 'service-requests',
    },
    {
      idSuffix: 'maintenance',
      type: 'maintenance',
      title: 'Scheduled Maintenance',
      message: 'Water shutoff in Building B on Friday 9 AM — plan accordingly',
      isRead: true,
      createdAtOffsetMs: 18 * 3_600_000,
      priority: 'normal',
    },
  ],
  [USER_ROLES.FINANCE]: [
    {
      idSuffix: 'approval-pending',
      type: 'approval',
      title: 'Invoice Pending Approval',
      message: 'ProTech HVAC Services submitted invoice #INV-2024-089 for $2,450',
      isRead: false,
      createdAtOffsetMs: 30 * 60_000,
      priority: 'high',
      actionUrl: 'finance/approvals',
    },
    {
      idSuffix: 'wo-budget',
      type: 'work_order',
      title: 'Budget Threshold Exceeded',
      message: 'WO-2024-091 estimated cost ($4,500) exceeds department threshold',
      isRead: false,
      createdAtOffsetMs: 2 * 3_600_000,
      priority: 'high',
      actionUrl: 'work-orders/WO-2024-091',
    },
    {
      idSuffix: 'vendor-invoice',
      type: 'vendor',
      title: 'Invoice Submitted',
      message: 'CleanPro Services submitted invoice INV-2024-160 for $980',
      isRead: false,
      createdAtOffsetMs: 5 * 3_600_000,
      priority: 'normal',
      actionUrl: 'vendors',
    },
    {
      idSuffix: 'contract',
      type: 'contract',
      title: 'Contract Renewal Review',
      message: 'Elevator maintenance contract renewal requires budget sign-off',
      isRead: true,
      createdAtOffsetMs: 48 * 3_600_000,
      priority: 'high',
      actionUrl: 'vendors',
    },
    {
      idSuffix: 'inventory',
      type: 'inventory',
      title: 'Purchase Requisition',
      message: 'Inventory reorder request for HVAC filters ($1,240) awaiting approval',
      isRead: true,
      createdAtOffsetMs: 60 * 3_600_000,
      priority: 'normal',
      actionUrl: 'inventory',
    },
  ],
}

interface StoredNotificationState {
  role: UserRole
  notifications: Array<Omit<Notification, 'createdAt'> & { createdAt: string }>
}

function storageKey(userId: string): string {
  return `maintainpro_notifications_${userId}`
}

function buildNotificationsForUser(userId: string, role: UserRole): Notification[] {
  const allowedTypes = new Set(getNotificationTypesForRole(role))
  const seeds = ROLE_NOTIFICATION_SEEDS[role] ?? ROLE_NOTIFICATION_SEEDS[USER_ROLES.STAFF] ?? []
  const now = Date.now()

  return seeds
    .filter((seed) => allowedTypes.has(seed.type))
    .map((seed) => {
      const { idSuffix, createdAtOffsetMs, ...rest } = seed
      return {
        ...rest,
        id: `${userId}-${idSuffix}`,
        userId,
        createdAt: new Date(now - createdAtOffsetMs),
      }
    })
}

function parseStoredNotifications(raw: StoredNotificationState): Notification[] {
  return raw.notifications.map((item) => ({
    ...item,
    createdAt: new Date(item.createdAt),
  }))
}

function saveNotifications(userId: string, role: UserRole, notifications: Notification[]): void {
  const payload: StoredNotificationState = {
    role,
    notifications: notifications.map((n) => ({
      ...n,
      createdAt: n.createdAt.toISOString(),
    })),
  }
  localStorage.setItem(storageKey(userId), JSON.stringify(payload))
}

export function loadNotificationsForUser(userId: string, role: UserRole): Notification[] {
  try {
    const raw = localStorage.getItem(storageKey(userId))
    if (raw) {
      const parsed = JSON.parse(raw) as StoredNotificationState
      if (parsed.role === role && Array.isArray(parsed.notifications)) {
        return parseStoredNotifications(parsed)
      }
    }
  } catch {
    // fall through to seed
  }

  const seeded = buildNotificationsForUser(userId, role)
  saveNotifications(userId, role, seeded)
  return seeded
}

export function persistNotifications(
  userId: string,
  role: UserRole,
  notifications: Notification[],
): void {
  saveNotifications(userId, role, notifications)
}

export function filterNotificationsByRole(
  notifications: Notification[],
  role: UserRole,
): Notification[] {
  const allowedTypes = new Set(getNotificationTypesForRole(role))
  return notifications.filter((n) => allowedTypes.has(n.type))
}
