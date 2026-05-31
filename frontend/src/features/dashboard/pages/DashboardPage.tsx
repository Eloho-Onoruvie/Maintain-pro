import { useAuthStore } from "@/app/store";

import { USER_ROLES } from "@/types/user.types";

import { FacilityManagerDashboard } from "../views/FacilityManagerDashboard";
import { TechnicianDashboard } from "../views/TechnicianDashboard";
import { VendorDashboard } from "../views/VendorDashboard";
import { FinanceDashboard } from "../views/FinanceDashboard";
import { AdminDashboard } from "../views/AdminDashboard";
import { StaffDashboard } from "../views/StaffDashboard";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  switch (user?.role) {
    case USER_ROLES.FACILITY_MANAGER:
      return <FacilityManagerDashboard />;

    case USER_ROLES.TECHNICIAN:
      return <TechnicianDashboard />;

    case USER_ROLES.STAFF:
      return <StaffDashboard />;

    case USER_ROLES.VENDOR_TEAM_LEAD:
    case USER_ROLES.VENDOR_TECHNICIAN:
      return <VendorDashboard />;

    case USER_ROLES.FINANCE:
      return <FinanceDashboard />;

    case USER_ROLES.ADMIN:
      return <AdminDashboard />;

    default:
      return null;
  }
}
