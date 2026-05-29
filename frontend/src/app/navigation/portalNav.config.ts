import {
  LayoutDashboard,
  ClipboardList,
  Wrench,
  Building2,
  Package,
  Users,
  Truck,
  BarChart3,
  Settings,
  Calendar,
  MessagesSquare,
  type LucideIcon,
} from 'lucide-react'

import { PORTALS, type Portal } from '@/app/portal.config'
import { USER_ROLES, type UserRole } from '@/types/user.types'

const { ADMIN, FACILITY_MANAGER, STAFF, FINANCE } = USER_ROLES

export interface PortalNavItem {
  name: string
  segment: string
  icon: LucideIcon
  badge?: number
  roles?: UserRole[]
}

export interface PortalNavConfig {
  label: string
  primary: PortalNavItem[]
  secondary: PortalNavItem[]
}

export const PORTAL_NAV: Record<Portal, PortalNavConfig> = {
  [PORTALS.ORG]: {
    label: 'Organization',
    primary: [
      { name: 'Dashboard', segment: 'dashboard', icon: LayoutDashboard },
      { name: 'Work Orders', segment: 'work-orders', icon: ClipboardList },
      {
        name: 'Assets',
        segment: 'assets',
        icon: Wrench,
        roles: [ADMIN, FACILITY_MANAGER, STAFF],
      },
      {
        name: 'Locations',
        segment: 'locations',
        icon: Building2,
        roles: [ADMIN, FACILITY_MANAGER],
      },
      {
        name: 'Inventory',
        segment: 'inventory',
        icon: Package,
        roles: [ADMIN, FACILITY_MANAGER, FINANCE],
      },
      {
        name: 'Vendors',
        segment: 'vendors',
        icon: Truck,
        roles: [ADMIN, FACILITY_MANAGER],
      },
      { name: 'Service Requests', segment: 'service-requests', icon: MessagesSquare },
      {
        name: 'Preventive Maintenance',
        segment: 'preventive-maintenance',
        icon: Calendar,
        roles: [ADMIN, FACILITY_MANAGER],
      },
      {
        name: 'Reports',
        segment: 'reports',
        icon: BarChart3,
        roles: [ADMIN, FACILITY_MANAGER, FINANCE],
      },
    ],
    secondary: [
      {
        name: 'Administration',
        segment: 'settings',
        icon: Settings,
        roles: [ADMIN, FACILITY_MANAGER],
      },
    ],
  },
  [PORTALS.TECH]: {
    label: 'Technician',
    primary: [
      { name: 'Dashboard', segment: 'dashboard', icon: LayoutDashboard },
      { name: 'My Jobs', segment: 'work-orders', icon: ClipboardList },
      { name: 'Preventive Maintenance', segment: 'preventive-maintenance', icon: Calendar },
      { name: 'Assets', segment: 'assets', icon: Wrench },
      { name: 'Inventory', segment: 'inventory', icon: Package },
    ],
    secondary: [],
  },
  [PORTALS.VENDOR]: {
    label: 'Vendor',
    primary: [
      { name: 'Dashboard', segment: 'dashboard', icon: LayoutDashboard },
      { name: 'Work Orders', segment: 'work-orders', icon: ClipboardList },
      { name: 'Team', segment: 'team', icon: Users },
      { name: 'Performance', segment: 'reports', icon: BarChart3 },
    ],
    secondary: [
      { name: 'Business settings', segment: 'settings', icon: Settings },
    ],
  },
}
