import type { Notification, NotificationType } from '@/types/common.types'
import type { UserRole } from '@/types/user.types'

import {
  loadNotificationsForUser,
  persistNotifications,
} from './notifications.service'

type RefreshHandler = () => void
let onNotificationsChanged: RefreshHandler | null = null

export function registerNotificationRefresh(handler: RefreshHandler): void {
  onNotificationsChanged = handler
}

export function appendNotification(
  userId: string,
  role: UserRole,
  partial: {
    type: NotificationType
    title: string
    message: string
    priority?: Notification['priority']
    actionUrl?: string
  },
): void {
  const existing = loadNotificationsForUser(userId, role)
  const notification: Notification = {
    id: `${userId}-${Date.now()}`,
    userId,
    type: partial.type,
    title: partial.title,
    message: partial.message,
    isRead: false,
    createdAt: new Date(),
    priority: partial.priority ?? 'normal',
    actionUrl: partial.actionUrl,
  }
  persistNotifications(userId, role, [notification, ...existing].slice(0, 50))
  onNotificationsChanged?.()
}
