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
  DollarSign,
  FileCheck,
  type LucideIcon,
} from 'lucide-react'

import { PORTALS, type Portal } from '@/app/portal.config'
import { USER_ROLES, type UserRole } from '@/types/user.types'

const { ADMIN, FACILITY_MANAGER, STAFF, FINANCE, TECHNICIAN, VENDOR_TEAM_LEAD, VENDOR_TECHNICIAN } = USER_ROLES

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
      { name: 'Dashboard',              segment: 'dashboard',              icon: LayoutDashboard },
      { name: 'Work Orders',            segment: 'work-orders',            icon: ClipboardList },
      { name: 'Assets',                 segment: 'assets',                 icon: Wrench,         roles: [ADMIN, FACILITY_MANAGER, STAFF, TECHNICIAN] },
      { name: 'Locations',              segment: 'locations',              icon: Building2,      roles: [ADMIN, FACILITY_MANAGER] },
      { name: 'Inventory',              segment: 'inventory',              icon: Package,        roles: [ADMIN, FACILITY_MANAGER, FINANCE] },
      { name: 'Vendors',                segment: 'vendors',                icon: Truck,          roles: [ADMIN, FACILITY_MANAGER] },
      { name: 'Service Requests',       segment: 'service-requests',       icon: MessagesSquare },
      { name: 'Preventive Maintenance', segment: 'preventive-maintenance', icon: Calendar,       roles: [ADMIN, FACILITY_MANAGER] },
      { name: 'Reports',                segment: 'reports',                icon: BarChart3,      roles: [ADMIN, FACILITY_MANAGER, FINANCE] },
      { name: 'Financial Approvals',    segment: 'approvals',              icon: FileCheck,      roles: [FINANCE, ADMIN] },
      { name: 'Invoices',               segment: 'invoices',               icon: DollarSign,     roles: [FINANCE, ADMIN] },
    ],
    secondary: [
      { name: 'Administration', segment: 'settings', icon: Settings, roles: [ADMIN, FACILITY_MANAGER] },
    ],
  },
  [PORTALS.VENDOR]: {
    label: 'Vendor',
    primary: [
      { name: 'Dashboard',     segment: 'dashboard',     icon: LayoutDashboard },
      { name: 'Work Orders',   segment: 'work-orders',   icon: ClipboardList },
      { name: 'Team',          segment: 'team',          icon: Users,    roles: [VENDOR_TEAM_LEAD] },
      { name: 'Opportunities', segment: 'opportunities', icon: Wrench,   roles: [VENDOR_TEAM_LEAD] },
      { name: 'Performance',   segment: 'reports',       icon: BarChart3, roles: [VENDOR_TEAM_LEAD] },
    ],
    secondary: [
      { name: 'Business Settings', segment: 'settings', icon: Settings, roles: [VENDOR_TEAM_LEAD] },
    ],
  },
}
