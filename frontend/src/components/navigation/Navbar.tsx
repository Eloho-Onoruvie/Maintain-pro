import { useEffect, useState } from 'react'
import { Bell, Plus, Menu } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

import { useUserNotifications } from '@/features/notifications/hooks/useUserNotifications'
import { AppSidebar as Sidebar } from '@/components/navigation/Sidebar'
import { usePortal, usePortalPath } from '@/hooks/usePortal'
import { useRoleAccess } from '@/hooks/useRoleAccess'
import { useAuthStore } from '@/app/store'
import { cn } from '@/utils/helpers'

interface AppHeaderProps {
  title: string
  subtitle?: string
  /** Shown after the menu button (e.g. back navigation on detail pages) */
  leading?: React.ReactNode
  actions?: React.ReactNode
  /** Hide global Create dropdown (e.g. when the page has its own primary create action) */
  hideQuickCreate?: boolean
}

export function AppHeader({
  title,
  subtitle,
  leading,
  actions,
  hideQuickCreate = false,
}: AppHeaderProps) {
  const { pathname } = useLocation()
  const portal = usePortal()
  const navigate = useNavigate()
  const [navOpen, setNavOpen] = useState(false)
  const isDashboard = /\/dashboard\/?$/.test(pathname)
  const showQuickCreate = !hideQuickCreate && !isDashboard
  const newWorkOrderPath = usePortalPath('work-orders/new')
  const serviceRequestsPath = usePortalPath('service-requests')
  const assetsPath = usePortalPath('assets')
  const vendorsPath = usePortalPath('vendors')
  const pmPath = usePortalPath('preventive-maintenance')
  const notificationsPath = usePortalPath('notifications')
  const loginPath = '/login'
  const signupPath = '/signup'

  const { notifications, unreadCount, markAllRead } = useUserNotifications()

  const user = useAuthStore((state) => state.user)
  const {
    canCreateWorkOrder,
    canSubmitServiceRequest,
    canManageAssets,
    canManageVendors,
    canManagePm,
  } = useRoleAccess()

  useEffect(() => {
    setNavOpen(false)
  }, [pathname])

  const handleQuickCreate = () => {
    if (canCreateWorkOrder) navigate(newWorkOrderPath)
    else if (canSubmitServiceRequest) navigate(serviceRequestsPath)
    else toast.info('No quick-create actions for this portal')
  }

  const hasMobileToolbar = Boolean(actions)

  return (
    <div className="sticky top-0 z-40 shrink-0 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <header className="flex h-14 items-center gap-2 px-3 sm:h-16 sm:gap-3 sm:px-4 lg:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <Sheet open={navOpen} onOpenChange={setNavOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 lg:hidden"
                aria-label="Open navigation menu"
              >
                <Menu className="h-5 w-5" aria-hidden />
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="w-64 p-0">
              <Sidebar portal={portal} onNavigate={() => setNavOpen(false)} />
            </SheetContent>
          </Sheet>

          {leading}

          <div className="min-w-0 flex-1">
            <h1 className="truncate text-base font-semibold text-foreground sm:text-xl">{title}</h1>
            {subtitle ? (
              <p className="hidden truncate text-xs text-muted-foreground sm:block sm:text-sm">
                {subtitle}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-0.5 sm:gap-1.5">
          {actions ? (
            <div className="mr-1 hidden max-w-[min(50vw,28rem)] items-center justify-end gap-2 lg:flex">
              {actions}
            </div>
          ) : null}

          {user && showQuickCreate ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" className="hidden sm:inline-flex">
                    <Plus className="mr-2 h-4 w-4" />
                    Create
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-48">
                  {canCreateWorkOrder && (
                    <DropdownMenuItem onClick={() => navigate(newWorkOrderPath)}>
                      Work Order
                    </DropdownMenuItem>
                  )}
                  {canSubmitServiceRequest && (
                    <DropdownMenuItem onClick={() => navigate(serviceRequestsPath)}>
                      Service Request
                    </DropdownMenuItem>
                  )}
                  {canManageAssets && (
                    <DropdownMenuItem onClick={() => navigate(assetsPath)}>Asset</DropdownMenuItem>
                  )}
                  {canManageVendors && (
                    <DropdownMenuItem onClick={() => navigate(vendorsPath)}>Vendor</DropdownMenuItem>
                  )}
                  {canManagePm && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate(pmPath)}>PM Schedule</DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                size="icon"
                className="sm:hidden"
                aria-label="Quick create"
                onClick={handleQuickCreate}
              >
                <Plus className="h-4 w-4" aria-hidden />
              </Button>
            </>
          ) : null}

          <ThemeToggle />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative shrink-0"
                  aria-label={
                    unreadCount > 0 ? `Notifications, ${unreadCount} unread` : 'Notifications'
                  }
                >
                  <Bell className="h-5 w-5" aria-hidden />
                  {unreadCount > 0 && (
                    <Badge className="absolute -right-1 -top-1 h-5 w-5 justify-center p-0 text-xs">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-80 max-w-[calc(100vw-2rem)]">
                <DropdownMenuLabel className="flex items-center justify-between">
                  Notifications
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 text-xs text-primary"
                    onClick={markAllRead}
                  >
                    Mark all read
                  </Button>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                {notifications.slice(0, 4).map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className="flex flex-col items-start gap-1 py-3"
                    onClick={() => navigate(notificationsPath)}
                  >
                    <div className="flex w-full items-start justify-between gap-2">
                      <span
                        className={cn(
                          'text-sm font-medium',
                          !notification.isRead && 'text-foreground',
                        )}
                      >
                        {notification.title}
                      </span>
                      {!notification.isRead && (
                        <div className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                      )}
                    </div>
                    <span className="line-clamp-2 text-xs text-muted-foreground">
                      {notification.message}
                    </span>
                  </DropdownMenuItem>
                ))}

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  className="justify-center text-primary"
                  onClick={() => navigate(notificationsPath)}
                >
                  View all notifications
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button variant="outline" size="sm" asChild>
                <Link to={loginPath}>Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to={signupPath}>Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </header>

      {hasMobileToolbar ? (
        <div
          className={cn(
            'flex items-center gap-2 overflow-x-auto border-t border-border/60 px-3 py-2 lg:hidden',
            '[&_button]:shrink-0 [&_a]:shrink-0',
          )}
        >
          {actions}
        </div>
      ) : null}
    </div>
  )
}
