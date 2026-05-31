import { lazy, Suspense, type ComponentType, type ReactNode } from 'react'
import { Navigate, type RouteObject } from 'react-router-dom'

import { ORG_ROUTE_ACCESS } from '@/app/navigation/routeAccess'
import RoleRoute from '@/app/router/RoleRoute'
import { PageLoader } from '@/components/feedback/PageLoader'
import { USER_ROLES, type UserRole } from '@/types/user.types'

function lazyNamed<TModule, TKey extends keyof TModule>(
  loader: () => Promise<TModule>,
  exportName: TKey,
) {
  return lazy(async () => {
    const module = await loader()
    return { default: module[exportName] as ComponentType }
  })
}

function page(element: ReactNode) {
  return <Suspense fallback={<PageLoader />}>{element}</Suspense>
}

const DashboardPage = lazy(() => import('@/features/dashboard/pages/DashboardPage'))
const WorkOrders = lazyNamed(() => import('@/features/work-orders/pages/WorkOrders'), 'WorkOrders')
const WorkOrderDetails = lazyNamed(
  () => import('@/features/work-orders/pages/WorkOrderDetails'),
  'WorkOrderDetails',
)
const CreateWorkOrder = lazyNamed(
  () => import('@/features/work-orders/pages/CreateWorkOrder'),
  'CreateWorkOrder',
)
const Assets = lazyNamed(() => import('@/features/assets/pages/Assets'), 'Assets')
const AssetDetails = lazyNamed(() => import('@/features/assets/pages/AssetDetails'), 'AssetDetails')
const Locations = lazyNamed(() => import('@/features/locations/pages/Locations'), 'Locations')
const LocationDetails = lazyNamed(
  () => import('@/features/locations/pages/LocationDetails'),
  'LocationDetails',
)
const PreventiveMaintenance = lazyNamed(
  () => import('@/features/preventive-maintenance/pages/PreventiveMaintenance'),
  'PreventiveMaintenance',
)
const ServiceRequests = lazyNamed(
  () => import('@/features/service-requests/pages/ServiceRequests'),
  'ServiceRequests',
)
const Vendors = lazyNamed(() => import('@/features/vendors/pages/Vendors'), 'Vendors')
const Inventory = lazyNamed(() => import('@/features/inventory/pages/Inventory'), 'Inventory')
const Reports = lazyNamed(() => import('@/features/reports/pages/Reports'), 'Reports')
const Notifications = lazyNamed(
  () => import('@/features/notifications/pages/Notifications'),
  'Notifications',
)
const Settings = lazyNamed(() => import('@/features/settings/pages/Settings'), 'Settings')
const UserProfile = lazyNamed(() => import('@/features/settings/pages/UserProfile'), 'UserProfile')
const VendorTeam = lazyNamed(() => import('@/features/vendors/pages/VendorTeam'), 'VendorTeam')
const FinanceApprovals = lazyNamed(
  () => import('@/features/finance/pages/FinanceApprovals'),
  'FinanceApprovals',
)
const VendorInvoices = lazyNamed(
  () => import('@/features/finance/pages/VendorInvoices'),
  'VendorInvoices',
)

function orgOnly(element: ReactNode, segment: keyof typeof ORG_ROUTE_ACCESS) {
  const roles = ORG_ROUTE_ACCESS[segment]
  if (!roles) return element
  return <RoleRoute allowedRoles={roles}>{element}</RoleRoute>
}

/** Shared page routes — mounted under the :roleSegment param */
const orgPages: RouteObject[] = [
  { path: 'dashboard',              element: page(<DashboardPage />) },
  { path: 'work-orders',            element: page(<WorkOrders />) },
  { path: 'work-orders/new',        element: orgOnly(page(<CreateWorkOrder />), 'work-orders/new') },
  { path: 'work-orders/:id',        element: page(<WorkOrderDetails />) },
  { path: 'assets',                 element: orgOnly(page(<Assets />), 'assets') },
  { path: 'assets/:id',             element: orgOnly(page(<AssetDetails />), 'assets') },
  { path: 'locations',              element: orgOnly(page(<Locations />), 'locations') },
  { path: 'locations/:id',          element: orgOnly(page(<LocationDetails />), 'locations') },
  { path: 'preventive-maintenance', element: orgOnly(page(<PreventiveMaintenance />), 'preventive-maintenance') },
  { path: 'service-requests',       element: page(<ServiceRequests />) },
  { path: 'vendors',                element: orgOnly(page(<Vendors />), 'vendors') },
  { path: 'inventory',              element: orgOnly(page(<Inventory />), 'inventory') },
  { path: 'reports',                element: orgOnly(page(<Reports />), 'reports') },
  { path: 'approvals',              element: orgOnly(page(<FinanceApprovals />), 'approvals') },
  { path: 'invoices',               element: orgOnly(page(<VendorInvoices />), 'invoices') },
  { path: 'notifications',          element: page(<Notifications />) },
  { path: 'profile',                element: page(<UserProfile />) },
  { path: 'settings',               element: orgOnly(page(<Settings />), 'settings') },
  { index: true,                    element: <Navigate to="dashboard" replace /> },
]

const vendorTeamLeadPages: RouteObject[] = [
  { path: 'dashboard',     element: page(<DashboardPage />) },
  { path: 'work-orders',   element: page(<WorkOrders />) },
  { path: 'work-orders/:id', element: page(<WorkOrderDetails />) },
  { path: 'team',          element: page(<VendorTeam />) },
  { path: 'reports',       element: page(<Reports />) },
  { path: 'notifications', element: page(<Notifications />) },
  { path: 'profile',       element: page(<UserProfile />) },
  { path: 'settings',      element: page(<Settings />) },
  { index: true,           element: <Navigate to="dashboard" replace /> },
]

const vendorTechnicianPages: RouteObject[] = [
  { path: 'dashboard',       element: page(<DashboardPage />) },
  { path: 'work-orders',     element: page(<WorkOrders />) },
  { path: 'work-orders/:id', element: page(<WorkOrderDetails />) },
  { path: 'notifications',   element: page(<Notifications />) },
  { path: 'profile',         element: page(<UserProfile />) },
  { index: true,             element: <Navigate to="dashboard" replace /> },
]

/**
 * Org portal children: /org/:roleSegment/*
 * One entry per org role segment so the router can mount the right page set.
 */
export const orgPortalRoutes: RouteObject[] = [
  { path: 'admin',            children: orgPages },
  { path: 'facility_manager', children: orgPages },
  { path: 'technician',       children: orgPages },
  { path: 'staff',            children: orgPages },
  { path: 'finance',          children: orgPages },
  { index: true, element: <Navigate to="dashboard" replace /> },
]

/**
 * Vendor portal children: /vendor/:roleSegment/*
 */
export const vendorPortalRoutes: RouteObject[] = [
  { path: 'team_lead',   children: vendorTeamLeadPages },
  { path: 'technician',  children: vendorTechnicianPages },
  { index: true, element: <Navigate to="dashboard" replace /> },
]
