import { Link, useLocation } from "react-router-dom";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Work Orders",
    href: "/work-orders",
    icon: ClipboardList,
    badge: 5,
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
  },
  {
    name: "Locations",
    href: "/locations",
    icon: Building2,
  },
  {
    name: "Inventory",
    href: "/inventory",
    icon: Package,
    badge: 2,
  },
  {
    name: "Vendors",
    href: "/vendors",
    icon: Truck,
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
  },
];

const secondaryNavigation = [
  {
    name: "Team",
    href: "/team",
    icon: Users,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Wrench className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="text-lg font-semibold text-sidebar-foreground">
          MaintainPro
        </span>
      </div>

      {/* Workspace Selector */}
      <div className="border-b border-sidebar-border p-3">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex w-full items-center justify-between rounded-md bg-sidebar-accent px-3 py-2 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent/80">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-primary/20 text-xs font-medium text-primary">
                GH
              </div>
              <span className="font-medium">Grand Hotel</span>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
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
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
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
                    variant="secondary"
                    className="h-5 min-w-5 justify-center bg-primary/20 text-xs text-primary"
                  >
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mt-6 pt-6 border-t border-sidebar-border">
          <nav className="space-y-1">
            {secondaryNavigation.map((item) => {
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
          <DropdownMenuTrigger className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm transition-colors hover:bg-sidebar-accent">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/20 text-primary text-xs">
                SC
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left">
              <p className="font-medium text-sidebar-foreground">Sarah Chen</p>
              <p className="text-xs text-muted-foreground">Facility Manager</p>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
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
            <DropdownMenuItem className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
