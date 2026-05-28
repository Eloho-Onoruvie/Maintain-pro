import { Navigate, type RouteObject } from 'react-router-dom'

import { ORG_ROUTE_ACCESS } from '@/app/navigation/routeAccess'
import RoleRoute from '@/app/router/RoleRoute'

import DashboardPage from '@/features/dashboard/pages/DashboardPage'
import { WorkOrders } from '@/features/work-orders/pages/WorkOrders'
import { WorkOrderDetails } from '@/features/work-orders/pages/WorkOrderDetails'
import { CreateWorkOrder } from '@/features/work-orders/pages/CreateWorkOrder'
import { Assets } from '@/features/assets/pages/Assets'
import { AssetDetails } from '@/features/assets/pages/AssetDetails'
import { Locations } from '@/features/locations/pages/Locations'
import { LocationDetails } from '@/features/locations/pages/LocationDetails'
import { PreventiveMaintenance } from '@/features/preventive-maintenance/pages/PreventiveMaintenance'
import { ServiceRequests } from '@/features/service-requests/pages/ServiceRequests'
import { Vendors } from '@/features/vendors/pages/Vendors'
import { Inventory } from '@/features/inventory/pages/Inventory'
import { Reports } from '@/features/reports/pages/Reports'
import { Notifications } from '@/features/notifications/pages/Notifications'
import { Settings } from '@/features/settings/pages/Settings'
import { VendorTeam } from '@/features/vendors/pages/VendorTeam'

function orgOnly(element: React.ReactNode, segment: keyof typeof ORG_ROUTE_ACCESS) {
  const roles = ORG_ROUTE_ACCESS[segment]
  if (!roles) return element
  return <RoleRoute allowedRoles={roles}>{element}</RoleRoute>
}

export const orgPortalRoutes: RouteObject[] = [
  { path: 'dashboard', element: <DashboardPage /> },
  { path: 'work-orders', element: <WorkOrders /> },
  { path: 'work-orders/new', element: orgOnly(<CreateWorkOrder />, 'work-orders/new') },
  { path: 'work-orders/:id', element: <WorkOrderDetails /> },
  { path: 'assets', element: orgOnly(<Assets />, 'assets') },
  { path: 'assets/:id', element: orgOnly(<AssetDetails />, 'assets') },
  { path: 'locations', element: orgOnly(<Locations />, 'locations') },
  { path: 'locations/:id', element: orgOnly(<LocationDetails />, 'locations') },
  { path: 'preventive-maintenance', element: orgOnly(<PreventiveMaintenance />, 'preventive-maintenance') },
  { path: 'service-requests', element: <ServiceRequests /> },
  { path: 'vendors', element: orgOnly(<Vendors />, 'vendors') },
  { path: 'inventory', element: orgOnly(<Inventory />, 'inventory') },
  { path: 'reports', element: orgOnly(<Reports />, 'reports') },
  { path: 'notifications', element: <Notifications /> },
  { path: 'settings', element: orgOnly(<Settings />, 'settings') },
  { index: true, element: <Navigate to="dashboard" replace /> },
]

export const techPortalRoutes: RouteObject[] = [
  { path: 'dashboard', element: <DashboardPage /> },
  { path: 'work-orders', element: <WorkOrders /> },
  { path: 'work-orders/:id', element: <WorkOrderDetails /> },
  { path: 'preventive-maintenance', element: <PreventiveMaintenance /> },
  { path: 'assets', element: <Assets /> },
  { path: 'assets/:id', element: <AssetDetails /> },
  { path: 'inventory', element: <Inventory /> },
  { path: 'notifications', element: <Notifications /> },
  { index: true, element: <Navigate to="dashboard" replace /> },
]

export const vendorPortalRoutes: RouteObject[] = [
  { path: 'dashboard', element: <DashboardPage /> },
  { path: 'work-orders', element: <WorkOrders /> },
  { path: 'work-orders/:id', element: <WorkOrderDetails /> },
  { path: 'team', element: <VendorTeam /> },
  { path: 'reports', element: <Reports /> },
  { path: 'notifications', element: <Notifications /> },
  { path: 'settings', element: <Settings /> },
  { index: true, element: <Navigate to="dashboard" replace /> },
]
