import { createBrowserRouter, Navigate } from "react-router-dom";

import { MainLayout } from "@/components/layout/MainLayout";
import { AuthLayout } from "@/components/layout/AuthLayout";

import ProtectedRoute from "@/app/router/ProtectedRoute";
import RoleRoute from "@/app/router/RoleRoute";

import { USER_ROLES } from "@/types/user.types";

/* AUTH */
import { Login } from "@/features/auth/pages/Login";
import { Register } from "@/features/auth/pages/Register";
import { ForgotPassword } from "@/features/auth/pages/ForgotPassword";
import UnauthorizedPage from "@/features/auth/pages/UnauthorizedPage";

/* DASHBOARD */
import DashboardPage from "@/features/dashboard/pages/DashboardPage";

/* WORK ORDERS */
import { WorkOrders } from "@/features/work-orders/pages/WorkOrders";
import { WorkOrderDetails } from "@/features/work-orders/pages/WorkOrderDetails";
import { CreateWorkOrder } from "@/features/work-orders/pages/CreateWorkOrder";

/* ASSETS */
import { Assets } from "@/features/assets/pages/Assets";
import { AssetDetails } from "@/features/assets/pages/AssetDetails";

/* LOCATIONS */
import { Locations } from "@/features/locations/pages/Locations";

/* PM */
import { PreventiveMaintenance } from "@/features/preventive-maintenance/pages/PreventiveMaintenance";

/* REQUESTS */
import { ServiceRequests } from "@/features/service-requests/pages/ServiceRequests";

/* VENDORS */
import { Vendors } from "@/features/vendors/pages/Vendors";

/* INVENTORY */
import { Inventory } from "@/features/inventory/pages/Inventory";

/* REPORTS */
import { Reports } from "@/features/reports/pages/Reports";

/* NOTIFICATIONS */
import { Notifications } from "@/features/notifications/pages/Notifications";

/* SETTINGS */
import { Settings } from "@/features/settings/pages/Settings";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },

  /*
   AUTH ROUTES
  */
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },

      {
        path: "/register",
        element: <Register />,
      },

      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },

      {
        path: "/unauthorized",
        element: <UnauthorizedPage />,
      },
    ],
  },

  /*
   PROTECTED APP
  */
  {
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),

    children: [
      /*
       DASHBOARD
      */
      {
        path: "/dashboard",
        element: <DashboardPage />,
      },

      /*
       WORK ORDERS
      */
      {
        path: "/work-orders",
        element: <WorkOrders />,
      },

      {
        path: "/work-orders/new",
        element: <CreateWorkOrder />,
      },

      {
        path: "/work-orders/:id",
        element: <WorkOrderDetails />,
      },

      /*
       ASSETS
      */
      {
        path: "/assets",
        element: <Assets />,
      },

      {
        path: "/assets/:id",
        element: <AssetDetails />,
      },

      /*
       LOCATIONS
      */
      {
        path: "/locations",
        element: <Locations />,
      },

      /*
       PM
      */
      {
        path: "/preventive-maintenance",
        element: <PreventiveMaintenance />,
      },

      /*
       SERVICE REQUESTS
      */
      {
        path: "/service-requests",
        element: <ServiceRequests />,
      },

      /*
       VENDORS
      */
      {
        path: "/vendors",
        element: <Vendors />,
      },

      /*
       INVENTORY
      */
      {
        path: "/inventory",

        element: (
          <RoleRoute
            allowedRoles={[
              USER_ROLES.ADMIN,
              USER_ROLES.FACILITY_MANAGER,
              USER_ROLES.FINANCE,
            ]}
          >
            <Inventory />
          </RoleRoute>
        ),
      },

      /*
       REPORTS
      */
      {
        path: "/reports",

        element: (
          <RoleRoute
            allowedRoles={[
              USER_ROLES.ADMIN,
              USER_ROLES.FACILITY_MANAGER,
              USER_ROLES.FINANCE,
            ]}
          >
            <Reports />
          </RoleRoute>
        ),
      },

      /*
       NOTIFICATIONS
      */
      {
        path: "/notifications",
        element: <Notifications />,
      },

      /*
       SETTINGS
      */
      {
        path: "/settings",

        element: (
          <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
            <Settings />
          </RoleRoute>
        ),
      },
    ],
  },
]);
