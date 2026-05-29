import { useEffect, useMemo } from 'react'
import { create } from 'zustand'

import { buildPortalPath, getPortalForRole } from '@/app/portal.config'
import { useAuthStore } from '@/app/store'
import type { Notification } from '@/types/common.types'
import type { UserRole } from '@/types/user.types'

import {
  canManageEscalationRules,
  getNotificationTypesForRole,
  getNotificationsPageSubtitle,
} from '../config/notificationConfig'
import {
  loadNotificationsForUser,
  persistNotifications,
} from '../services/notifications.service'

interface NotificationsStore {
  userId: string | null
  role: UserRole | null
  notifications: Notification[]
  syncForUser: (userId: string, role: UserRole) => void
  markRead: (id: string) => void
  markAllRead: () => void
  deleteNotification: (id: string) => void
}

const useNotificationsStore = create<NotificationsStore>((set, get) => ({
  userId: null,
  role: null,
  notifications: [],

  syncForUser: (userId, role) => {
    const current = get()
    if (current.userId === userId && current.role === role && current.notifications.length > 0) {
      return
    }
    set({
      userId,
      role,
      notifications: loadNotificationsForUser(userId, role),
    })
  },

  markRead: (id) => {
    const { userId, role, notifications } = get()
    if (!userId || !role) return
    const next = notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    persistNotifications(userId, role, next)
    set({ notifications: next })
  },

  markAllRead: () => {
    const { userId, role, notifications } = get()
    if (!userId || !role) return
    const next = notifications.map((n) => ({ ...n, isRead: true }))
    persistNotifications(userId, role, next)
    set({ notifications: next })
  },

  deleteNotification: (id) => {
    const { userId, role, notifications } = get()
    if (!userId || !role) return
    const next = notifications.filter((n) => n.id !== id)
    persistNotifications(userId, role, next)
    set({ notifications: next })
  },
}))

function resolveActionUrl(actionUrl: string | undefined, role: UserRole): string | undefined {
  if (!actionUrl) return undefined
  const portal = getPortalForRole(role)
  return buildPortalPath(portal, actionUrl)
}

export function useUserNotifications() {
  const user = useAuthStore((state) => state.user)
  const userId = user?.id ?? null
  const role = user?.role ?? null

  const notifications = useNotificationsStore((state) => state.notifications)
  const syncForUser = useNotificationsStore((state) => state.syncForUser)
  const markRead = useNotificationsStore((state) => state.markRead)
  const markAllRead = useNotificationsStore((state) => state.markAllRead)
  const deleteNotification = useNotificationsStore((state) => state.deleteNotification)

  useEffect(() => {
    if (userId && role) {
      syncForUser(userId, role)
    }
  }, [userId, role, syncForUser])

  const resolvedNotifications = useMemo(() => {
    if (!role) return []
    return notifications.map((n) => ({
      ...n,
      actionUrl: resolveActionUrl(n.actionUrl, role),
    }))
  }, [notifications, role])

  const unreadCount = useMemo(
    () => resolvedNotifications.filter((n) => !n.isRead).length,
    [resolvedNotifications],
  )

  const notificationTypes = role ? getNotificationTypesForRole(role) : []
  const showEscalationRules = role ? canManageEscalationRules(role) : false
  const pageSubtitle = role ? getNotificationsPageSubtitle(role) : 'Your alerts and notification preferences'

  return {
    user,
    notifications: resolvedNotifications,
    unreadCount,
    markRead,
    markAllRead,
    deleteNotification,
    notificationTypes,
    showEscalationRules,
    pageSubtitle,
  }
}
