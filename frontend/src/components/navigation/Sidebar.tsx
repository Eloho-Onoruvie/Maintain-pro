import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  ChevronDown,
  LogOut,
  HelpCircle,
  Bell,
  User,
} from 'lucide-react'

import { buildPortalPath, type Portal } from '@/app/portal.config'
import { PORTAL_NAV } from '@/app/navigation/portalNav.config'
import { filterNavItemsByRole } from '@/app/navigation/routeAccess'
import { GearIcon } from '@/components/brand/GearIcon'
import { cn } from '@/utils/helpers'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useAuthStore } from '@/app/store'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { usePortalBranding } from '@/hooks/usePortalBranding'
import {
  mockInventory,
  mockWorkOrders,
} from '@/features/dashboard/services/dashboard.service'

interface AppSidebarProps {
  portal: Portal
  /** Close mobile nav sheet after navigation */
  onNavigate?: () => void
}

export function AppSidebar({ portal, onNavigate }: AppSidebarProps) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const { logout } = useAuth()
  const navConfig = PORTAL_NAV[portal]
  const portalSubtitle = usePortalBranding()
  const primaryItems = filterNavItemsByRole(navConfig.primary, user?.role)
  const secondaryItems = filterNavItemsByRole(navConfig.secondary, user?.role)

  const fullName = user ? `${user.firstName} ${user.lastName}` : 'User'
  const roleLabel = user ? user.role.replace(/_/g, ' ') : ''
  const initials = user
    ? `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase()
    : 'U'

  const openWorkOrders = mockWorkOrders.filter(
    (wo) => wo.status === 'open' || wo.status === 'assigned',
  ).length
  const lowStock = mockInventory.filter((item) => item.quantity <= item.minStock).length

  const badgeForSegment = (segment: string) => {
    if (segment === 'work-orders') return openWorkOrders
    if (segment === 'inventory') return lowStock
    return undefined
  }

  const hrefFor = (segment: string) => buildPortalPath(portal, `/${segment}`)

  const renderNavItem = (item: (typeof navConfig.primary)[number]) => {
    const href = hrefFor(item.segment)
    const isActive = pathname === href || pathname.startsWith(`${href}/`)
    const badge = item.badge ?? badgeForSegment(item.segment)
    const isInventoryAlert = item.segment === 'inventory' && badge && badge > 0

    return (
      <Link
        key={item.name}
        to={href}
        onClick={onNavigate}
        className={cn(
          'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
          isActive
            ? 'bg-sidebar-accent text-sidebar-foreground'
            : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground',
        )}
      >
        <item.icon className="h-4 w-4" />
        <span className="flex-1">{item.name}</span>
        {badge ? (
          <Badge
            variant={isInventoryAlert ? 'destructive' : 'secondary'}
            className={cn('h-5 min-w-5 justify-center text-xs', !isInventoryAlert && 'bg-primary/20 text-primary')}
          >
            {badge}
          </Badge>
        ) : null}
      </Link>
    )
  }

  return (
    <aside className="flex h-full min-h-0 w-64 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-5 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary shadow-sm shadow-primary/20">
          <GearIcon size={20} className="text-primary-foreground" />
        </div>
        <div className="min-w-0">
          <span className="block truncate text-lg font-semibold leading-tight text-sidebar-foreground">
            MaintainPro
          </span>
          <span className="block truncate text-xs text-muted-foreground">{portalSubtitle}</span>
        </div>
      </div>

      <ScrollArea className="flex-1 min-h-0 px-3 py-4">
        <nav className="space-y-1">{primaryItems.map(renderNavItem)}</nav>

        {secondaryItems.length > 0 && (
          <div className="mt-6 border-t border-sidebar-border pt-6">
            <nav className="space-y-1">
              {secondaryItems.map((item) => {
                const href = hrefFor(item.segment)
                const isActive = pathname === href

                return (
                  <Link
                    key={item.name}
                    to={href}
                    onClick={onNavigate}
                    className={cn(
                      'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-sidebar-accent text-sidebar-foreground'
                        : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground',
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>
          </div>
        )}
      </ScrollArea>

      <div className="border-t border-sidebar-border p-3">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex w-full cursor-pointer items-center gap-3 rounded-md border border-sidebar-border bg-sidebar-accent/50 px-3 py-2.5 text-sm transition-colors hover:bg-sidebar-accent">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="bg-primary/20 text-primary text-xs">{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1 text-left">
              <p className="truncate font-medium text-sidebar-foreground">{fullName}</p>
              <p className="truncate text-xs capitalize text-muted-foreground">{roleLabel}</p>
            </div>
            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={() => navigate(hrefFor('profile'))}>
              <User className="mr-2 h-4 w-4" />
              My profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate(hrefFor('notifications'))}>
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => window.open('mailto:support@maintainpro.com', '_blank')}>
              <HelpCircle className="mr-2 h-4 w-4" />
              Help & Support
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  )
}
