import { createBrowserRouter, Navigate } from 'react-router-dom'

import { MainLayout } from '@/components/layout/MainLayout'
import { AuthLayout } from '@/components/layout/AuthLayout'

import ProtectedRoute from '@/app/router/ProtectedRoute'
import GuestRoute from '@/app/router/GuestRoute'
import PortalRoute, {
  LegacyAssetDetailRedirect,
  LegacyPortalRedirect,
  LegacyWorkOrderDetailRedirect,
} from '@/app/router/PortalRoute'
import { orgPortalRoutes, techPortalRoutes, vendorPortalRoutes } from '@/app/router/portalRoutes'
import { PORTALS } from '@/app/portal.config'

import { Login } from '@/features/auth/pages/Login'
import { SignupHub } from '@/features/auth/pages/SignupHub'
import { SignupOrganization } from '@/features/auth/pages/SignupOrganization'
import { SignupTechnician } from '@/features/auth/pages/SignupTechnician'
import { SignupVendor } from '@/features/auth/pages/SignupVendor'
import { ForgotPassword } from '@/features/auth/pages/ForgotPassword'
import UnauthorizedPage from '@/features/auth/pages/UnauthorizedPage'

import { PublicLayout } from '@/features/public/layout/PublicLayout'
import { AboutPage } from '@/features/public/pages/AboutPage'
import { ContactPage } from '@/features/public/pages/ContactPage'
import { FeaturesPage } from '@/features/public/pages/FeaturesPage'
import { PrivacyPolicyPage } from '@/features/public/pages/PrivacyPolicyPage'
import { PublicHomeRoute } from '@/features/public/pages/PublicHomePage'
import { TermsOfServicePage } from '@/features/public/pages/TermsOfServicePage'

const LEGACY_SEGMENTS = [
  'dashboard',
  'work-orders',
  'work-orders/new',
  'assets',
  'locations',
  'preventive-maintenance',
  'service-requests',
  'vendors',
  'inventory',
  'reports',
  'notifications',
  'settings',
] as const

const legacyRedirects = LEGACY_SEGMENTS.map((segment) => ({
  path: `/${segment}`,
  element: <LegacyPortalRedirect segment={segment} />,
}))

const legacyWorkOrderDetail = {
  path: '/work-orders/:id',
  element: <LegacyWorkOrderDetailRedirect />,
}

const legacyAssetDetail = {
  path: '/assets/:id',
  element: <LegacyAssetDetailRedirect />,
}

export const router = createBrowserRouter([
  /* PUBLIC MARKETING ROUTES */
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <PublicHomeRoute /> },
      { path: '/features', element: <FeaturesPage /> },
      { path: '/about', element: <AboutPage /> },
      { path: '/contact', element: <ContactPage /> },
      { path: '/privacy-policy', element: <PrivacyPolicyPage /> },
      { path: '/terms-of-service', element: <TermsOfServicePage /> },
    ],
  },

  /* AUTH ROUTES */
  {
    element: (
      <GuestRoute>
        <AuthLayout />
      </GuestRoute>
    ),
    children: [
      { path: '/login', element: <Login /> },
      { path: '/signup', element: <SignupHub /> },
      { path: '/signup/organization', element: <SignupOrganization /> },
      { path: '/signup/technician', element: <SignupTechnician /> },
      { path: '/signup/vendor', element: <SignupVendor /> },
      { path: '/register', element: <Navigate to="/signup/organization" replace /> },
      { path: '/forgot-password', element: <ForgotPassword /> },
    ],
  },

  { path: '/unauthorized', element: <UnauthorizedPage /> },

  /* ORGANIZATION PORTAL */
  {
    path: '/app/org',
    element: (
      <ProtectedRoute>
        <PortalRoute portal={PORTALS.ORG}>
          <MainLayout portal={PORTALS.ORG} />
        </PortalRoute>
      </ProtectedRoute>
    ),
    children: orgPortalRoutes,
  },

  /* TECHNICIAN PORTAL */
  {
    path: '/app/tech',
    element: (
      <ProtectedRoute>
        <PortalRoute portal={PORTALS.TECH}>
          <MainLayout portal={PORTALS.TECH} />
        </PortalRoute>
      </ProtectedRoute>
    ),
    children: techPortalRoutes,
  },

  /* VENDOR PORTAL */
  {
    path: '/app/vendor',
    element: (
      <ProtectedRoute>
        <PortalRoute portal={PORTALS.VENDOR}>
          <MainLayout portal={PORTALS.VENDOR} />
        </PortalRoute>
      </ProtectedRoute>
    ),
    children: vendorPortalRoutes,
  },

  /* LEGACY ROUTE REDIRECTS */
  ...legacyRedirects,
  legacyWorkOrderDetail,
  legacyAssetDetail,
])
