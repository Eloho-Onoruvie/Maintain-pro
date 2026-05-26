import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { cn } from "../../utils/helpers";
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
  Bell,
  Calendar,
  ChevronDown,
  LogOut,
  HelpCircle,
  MessagesSquare,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuthStore } from "@/app/store";
import {
  mockInventory,
  mockWorkOrders,
} from "@/features/dashboard/services/dashboard.service";
import type { UserRole } from "@/types/user.types";
import { USER_ROLES } from "@/types/user.types";

const navigation: {
  name: string;
  href: string;
  icon: any;
  badge?: number;
  roles?: UserRole[];
}[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Work Orders",
    href: "/work-orders",
    icon: ClipboardList,
    badge: mockWorkOrders.filter(
      (wo) => wo.status === "open" || wo.status === "assigned",
    ).length,
  },
  {
    name: "Preventive Maintenance",
    href: "/preventive-maintenance",
    icon: Calendar,
  },
  {
    name: "Assets",
    href: "/assets",
    icon: Wrench,
    roles: ["admin", "facility_manager", "technician"],
  },
  {
    name: "Locations",
    href: "/locations",
    icon: Building2,
    roles: ["admin", "facility_manager", "technician"],
  },
  {
    name: "Inventory",
    href: "/inventory",
    icon: Package,
    badge: mockInventory.filter((item) => item.quantity <= item.minStock)
      .length,
    roles: ["admin", "facility_manager", "finance", "technician"],
  },
  {
    name: "Vendors",
    href: "/vendors",
    icon: Truck,
    roles: ["admin", "facility_manager"],
  },
  {
    name: "Service Requests",
    href: "/service-requests",
    icon: MessagesSquare,
  },
  {
    name: "Reports",
    href: "/reports",
    icon: BarChart3,
    roles: ["admin", "facility_manager", "finance"],
  },
];

const secondaryNavigation: {
  name: string;
  href: string;
  icon: any;
  roles?: UserRole[];
}[] = [
  {
    name: "Team",
    href: "/team",
    icon: Users,
    roles: ["admin", "facility_manager"],
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
    roles: ["admin", "facility_manager"],
  },
];

export function AppSidebar() {
  const { pathname } = useLocation();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const fullName = user ? `${user.firstName} ${user.lastName}` : "Sarah Chen";
  const roleLabel = user ? user.role.replace("_", " ") : "Facility Manager";
  const initials = user
    ? `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`.toUpperCase()
    : "SC";

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar">
      {/* Logo */}
      <div className="flex h-18 items-center gap-3 border-b border-sidebar-border py-5 px-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary shadow-sm shadow-primary/20">
          <Wrench className="h-5 w-5 text-primary-foreground" />
        </div>
        <div className="min-w-0">
          <span className="block truncate text-lg font-semibold leading-tight text-sidebar-foreground">
            MaintainPro
          </span>
          <span className="block text-xs text-muted-foreground">
            Operations suite
          </span>
        </div>
      </div>

      {/* Workspace Selector */}
      <div className="border-b border-sidebar-border p-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex w-full cursor-pointer items-center justify-between rounded-md bg-sidebar-accent px-3 py-2.5 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent/80">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-primary/20 text-xs font-medium text-primary">
                GH
              </div>
              <div className="min-w-0 text-left">
                <span className="block truncate font-medium">Grand Hotel</span>
                <span className="block text-xs text-muted-foreground">
                  Primary site
                </span>
              </div>
            </div>
            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem>
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded bg-primary/20 text-xs font-medium text-primary">
                  GH
                </div>
                <span>Grand Hotel</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded bg-chart-2/20 text-xs font-medium text-chart-2">
                  MC
                </div>
                <span>Medical Center</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Manage Workspaces
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 min-h-0 px-3 py-4" type="always">
        <nav className="space-y-1">
          {navigation
            .filter(
              (item) => !item.roles || (user && item.roles.includes(user.role)),
            )
            .map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");

              // Highlight Inventory badge if it represents low stock
              const isInventoryAlert =
                item.name === "Inventory" && item.badge && item.badge > 0;

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-foreground"
                      : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="flex-1">{item.name}</span>
                  {item.badge && (
                    <Badge
                      variant={isInventoryAlert ? "destructive" : "secondary"}
                      className={cn(
                        "h-5 min-w-5 justify-center text-xs",
                        !isInventoryAlert && "bg-primary/20 text-primary",
                      )}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
        </nav>

        {/* Secondary Navigation */}
        <div className="mt-6 border-t border-sidebar-border pt-6">
          <nav className="space-y-1">
            {secondaryNavigation
              .filter(
                (item) =>
                  !item.roles || (user && item.roles.includes(user.role)),
              )
              .map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-foreground"
                        : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground",
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
          </nav>
        </div>
      </ScrollArea>

      {/* User Menu */}
      <div className="border-t border-sidebar-border p-3">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex w-full cursor-pointer items-center gap-3 rounded-md border border-sidebar-border bg-sidebar-accent/50 px-3 py-2.5 text-sm transition-colors hover:bg-sidebar-accent">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="bg-primary/20 text-primary text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1 text-left">
              <p className="truncate font-medium text-sidebar-foreground">
                {fullName}
              </p>
              <p className="truncate text-xs capitalize text-muted-foreground">
                {roleLabel}
              </p>
            </div>
            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem>
              <Users className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </DropdownMenuItem>
            <DropdownMenuItem>
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
  );
}
