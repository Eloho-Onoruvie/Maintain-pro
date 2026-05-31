import { lazy, Suspense, type ComponentType, type ReactNode } from 'react'
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'

import { PageLoader } from '@/components/feedback/PageLoader'
import { ScrollToTop } from '@/components/navigation/ScrollToTop'
import { MainLayout } from '@/components/layout/MainLayout'
import { AuthLayout } from '@/components/layout/AuthLayout'

import ProtectedRoute from '@/app/router/ProtectedRoute'
import GuestRoute from '@/app/router/GuestRoute'
import PortalRoute, {
  LegacyAssetDetailRedirect,
  LegacyPortalRedirect,
  LegacyWorkOrderDetailRedirect,
  RootRedirect,
} from '@/app/router/PortalRoute'
import { orgPortalRoutes, vendorPortalRoutes } from '@/app/router/portalRoutes'
import { PORTALS } from '@/app/portal.config'

import { PublicLayout } from '@/features/public/layout/PublicLayout'

function lazyNamed<TModule, TKey extends keyof TModule>(
  loader: () => Promise<TModule>,
  exportName: TKey,
) {
  return lazy(async () => {
    const module = await loader()
    return { default: module[exportName] as ComponentType }
  })
}

function lazyPage(element: ReactNode) {
  return <Suspense fallback={<PageLoader />}>{element}</Suspense>
}

const Login = lazyNamed(() => import('@/features/auth/pages/Login'), 'Login')
const SignupHub = lazyNamed(() => import('@/features/auth/pages/SignupHub'), 'SignupHub')
const SignupOrganization = lazyNamed(
  () => import('@/features/auth/pages/SignupOrganization'),
  'SignupOrganization',
)
const SignupVendor = lazyNamed(() => import('@/features/auth/pages/SignupVendor'), 'SignupVendor')
const ForgotPassword = lazyNamed(
  () => import('@/features/auth/pages/ForgotPassword'),
  'ForgotPassword',
)
const ResetPassword = lazyNamed(() => import('@/features/auth/pages/ResetPassword'), 'ResetPassword')
const AcceptInvite = lazyNamed(() => import('@/features/auth/pages/AcceptInvite'), 'AcceptInvite')
const UnauthorizedPage = lazy(() => import('@/features/auth/pages/UnauthorizedPage'))

const AboutPage = lazyNamed(() => import('@/features/public/pages/AboutPage'), 'AboutPage')
const ContactPage = lazyNamed(() => import('@/features/public/pages/ContactPage'), 'ContactPage')
const FeaturesPage = lazyNamed(() => import('@/features/public/pages/FeaturesPage'), 'FeaturesPage')
const PrivacyPolicyPage = lazyNamed(
  () => import('@/features/public/pages/PrivacyPolicyPage'),
  'PrivacyPolicyPage',
)
const PublicHomeRoute = lazyNamed(
  () => import('@/features/public/pages/PublicHomePage'),
  'PublicHomeRoute',
)
const TermsOfServicePage = lazyNamed(
  () => import('@/features/public/pages/TermsOfServicePage'),
  'TermsOfServicePage',
)

/** Legacy segments that used to be bare /dashboard etc. */
const LEGACY_SEGMENTS = [
  'dashboard', 'work-orders', 'work-orders/new', 'assets',
  'locations', 'preventive-maintenance', 'service-requests',
  'vendors', 'inventory', 'reports', 'notifications', 'settings',
] as const

const legacyRedirects = LEGACY_SEGMENTS.map((segment) => ({
  path: `/${segment}`,
  element: <LegacyPortalRedirect segment={segment} />,
}))

/** Legacy /app/org|tech|vendor redirects → new role-based URLs */
const legacyAppRedirects = [
  { path: '/app/org/*',    element: <LegacyPortalRedirect segment="dashboard" /> },
  { path: '/app/vendor/*', element: <LegacyPortalRedirect segment="dashboard" /> },
]

function RootLayout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  )
}

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      /* PUBLIC MARKETING ROUTES */
      {
        element: <PublicLayout />,
        children: [
          { path: '/', element: lazyPage(<PublicHomeRoute />) },
          { path: '/features', element: lazyPage(<FeaturesPage />) },
          { path: '/about', element: lazyPage(<AboutPage />) },
          { path: '/contact', element: lazyPage(<ContactPage />) },
          { path: '/privacy-policy', element: lazyPage(<PrivacyPolicyPage />) },
          { path: '/terms-of-service', element: lazyPage(<TermsOfServicePage />) },
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
          { path: '/login', element: lazyPage(<Login />) },
          { path: '/signup', element: lazyPage(<SignupHub />) },
          { path: '/signup/organization', element: lazyPage(<SignupOrganization />) },
          { path: '/signup/technician', element: <Navigate to="/signup" replace /> },
          { path: '/signup/vendor', element: lazyPage(<SignupVendor />) },
          { path: '/register', element: <Navigate to="/signup/organization" replace /> },
          { path: '/forgot-password', element: lazyPage(<ForgotPassword />) },
          { path: '/reset-password', element: lazyPage(<ResetPassword />) },
          { path: '/accept-invite', element: lazyPage(<AcceptInvite />) },
          { path: '/invite/accept', element: lazyPage(<AcceptInvite />) },
        ],
      },

      { path: '/unauthorized', element: lazyPage(<UnauthorizedPage />) },

      /*
       * ORG PORTAL — /org/:roleSegment/*
       * roleSegment: admin | facility_manager | technician | staff | finance
       */
      {
        path: '/org',
        element: (
          <ProtectedRoute>
            <PortalRoute portal={PORTALS.ORG}>
              <MainLayout portal={PORTALS.ORG} />
            </PortalRoute>
          </ProtectedRoute>
        ),
        children: orgPortalRoutes,
      },

      /*
       * VENDOR PORTAL — /vendor/:roleSegment/*
       * roleSegment: team_lead | technician
       */
      {
        path: '/vendor',
        element: (
          <ProtectedRoute>
            <PortalRoute portal={PORTALS.VENDOR}>
              <MainLayout portal={PORTALS.VENDOR} />
            </PortalRoute>
          </ProtectedRoute>
        ),
        children: vendorPortalRoutes,
      },

      /* LEGACY /app/* REDIRECTS → new URL structure */
      ...legacyAppRedirects,

      /* LEGACY BARE ROUTE REDIRECTS */
      ...legacyRedirects,
      { path: '/work-orders/:id', element: <LegacyWorkOrderDetailRedirect /> },
      { path: '/assets/:id', element: <LegacyAssetDetailRedirect /> },

      /* CATCH-ALL */
      { path: '*', element: <RootRedirect /> },
    ],
  },
])
