import { useEffect, useMemo } from 'react'
import { create } from 'zustand'
import { buildUserPortalPath } from '@/app/portal.config'
import { useAuthStore } from '@/app/store'
import type { Notification } from '@/types/common.types'
import type { UserRole } from '@/types/user.types'
import { canManageEscalationRules, getNotificationTypesForRole, getNotificationsPageSubtitle } from '../config/notificationConfig'
import { notificationsApi, type BackendNotification } from '../services/notifications.api'
import { registerNotificationRefresh } from '../services/notificationEvents'
import { isDemoMode } from '@/config/runtime'

interface NotificationsStore { userId: string | null; role: UserRole | null; notifications: Notification[]; unreadCount: number; isLoading: boolean; error: string | null; syncForUser: (id: string, role: UserRole) => Promise<void>; refresh: () => Promise<void>; markRead: (id: string) => Promise<void>; markAllRead: () => Promise<void>; deleteNotification: (id: string) => void }

function toNotification(item: BackendNotification): Notification {
  const types: Record<string, Notification['type']> = { work_order: 'work_order', service_request: 'approval', procurement: 'vendor', inventory: 'inventory', billing: 'contract', security: 'system', system: 'system' }
  return { id: item.id, type: types[item.type] ?? 'system', title: item.title, message: item.message, isRead: item.isRead, priority: item.priority === 'high' || item.priority === 'critical' ? 'high' : 'normal', createdAt: new Date(item.createdAt), actionUrl: item.resourceType && item.resourceId ? `${item.resourceType}/${item.resourceId}` : undefined }
}

const store = create<NotificationsStore>((set, get) => ({
  userId: null, role: null, notifications: [], unreadCount: 0, isLoading: false, error: null,
  syncForUser: async (userId, role) => { set({ userId, role, isLoading: true, error: null }); if (isDemoMode) { const isVendor = role.startsWith('vendor'); const demoNotifications: Notification[] = isVendor ? [{ id: 'demo-notification-1', type: 'work_order', title: 'Work order assigned', message: 'WO-DEMO-001 has been assigned and is ready for review.', isRead: false, priority: 'high', createdAt: new Date(Date.now() - 15 * 60 * 1000), actionUrl: 'work-orders/WO-DEMO-001' }, { id: 'demo-notification-2', type: 'vendor', title: 'New service opportunity', message: 'A new maintenance opportunity is available for your team to review.', isRead: false, priority: 'normal', createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), actionUrl: 'opportunities' }, { id: 'demo-notification-3', type: 'contract', title: 'Contract renewal approaching', message: 'Review the upcoming renewal terms for your active service agreement.', isRead: true, priority: 'normal', createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), actionUrl: 'contracts' }] : [{ id: 'demo-notification-1', type: 'work_order', title: 'Work order assigned', message: 'WO-DEMO-001 has been assigned and is ready for review.', isRead: false, priority: 'high', createdAt: new Date(Date.now() - 15 * 60 * 1000), actionUrl: 'work-orders/WO-DEMO-001' }, { id: 'demo-notification-2', type: 'inventory', title: 'Inventory threshold reached', message: 'HVAC filters are below the configured minimum stock level.', isRead: false, priority: 'normal', createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), actionUrl: 'inventory' }, { id: 'demo-notification-3', type: 'approval', title: 'Service request awaiting review', message: 'A high-priority service request requires facilities approval.', isRead: true, priority: 'normal', createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), actionUrl: 'service-requests' }]; set({ notifications: demoNotifications, unreadCount: 2, isLoading: false }); return } try { const [page, unread] = await Promise.all([notificationsApi.list({ page: 1, limit: 50 }), notificationsApi.unreadCount()]); set({ notifications: page.data.map(toNotification), unreadCount: unread.count, isLoading: false }) } catch (error) { set({ notifications: [], unreadCount: 0, isLoading: false, error: error instanceof Error ? error.message : 'Unable to load notifications' }) } },
  refresh: async () => { const { userId, role } = get(); if (userId && role) await get().syncForUser(userId, role) },
  markRead: async (id) => { const wasUnread = get().notifications.some((item) => item.id === id && !item.isRead); set((state) => ({ notifications: state.notifications.map((item) => item.id === id ? { ...item, isRead: true } : item), unreadCount: Math.max(0, state.unreadCount - (wasUnread ? 1 : 0)) })); if (isDemoMode) return; try { await notificationsApi.markRead(id) } catch { await get().refresh() } },
  markAllRead: async () => { set((state) => ({ notifications: state.notifications.map((item) => ({ ...item, isRead: true })), unreadCount: 0 })); if (isDemoMode) return; try { await notificationsApi.markAllRead() } catch { await get().refresh() } },
  deleteNotification: () => undefined,
}))

registerNotificationRefresh(() => { void store.getState().refresh() })

export function useUserNotifications() {
  const user = useAuthStore((state) => state.user); const userId = user?.id ?? null; const role = user?.role ?? null
  const notifications = store((state) => state.notifications); const unreadCount = store((state) => state.unreadCount); const isLoading = store((state) => state.isLoading); const error = store((state) => state.error)
  const syncForUser = store((state) => state.syncForUser); const markRead = store((state) => state.markRead); const markAllRead = store((state) => state.markAllRead); const deleteNotification = store((state) => state.deleteNotification)
  useEffect(() => { if (userId && role) void syncForUser(userId, role) }, [userId, role, syncForUser])
  const resolvedNotifications = useMemo(() => role ? notifications.map((item) => ({ ...item, actionUrl: item.actionUrl ? buildUserPortalPath({ role }, item.actionUrl) : undefined })) : [], [notifications, role])
  return { user, notifications: resolvedNotifications, unreadCount, markRead, markAllRead, deleteNotification, notificationTypes: role ? getNotificationTypesForRole(role) : [], isLoading, error, retry: () => store.getState().refresh(), showEscalationRules: role ? canManageEscalationRules(role) : false, pageSubtitle: role ? getNotificationsPageSubtitle(role) : 'Your alerts and notification preferences' }
}
