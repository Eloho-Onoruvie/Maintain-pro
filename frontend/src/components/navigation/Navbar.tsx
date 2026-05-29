import { useMemo, useState } from "react";
import { Bell, Search, Plus, Menu } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Badge } from "@/components/ui/badge";

import { mockNotifications } from "@/features/dashboard/services/dashboard.service";

import { cn } from "@/utils/helpers";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { AppSidebar as Sidebar } from "@/components/navigation/Sidebar";
import { usePortal, usePortalPath } from "@/hooks/usePortal";
import { useRoleAccess } from "@/hooks/useRoleAccess";

import { useAuthStore } from "@/app/store";

import ProfileDropdown from '@/components/ui/ProfileDropdown'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  /** Shown after the menu button (e.g. back navigation on detail pages) */
  leading?: React.ReactNode;
  actions?: React.ReactNode;
  /** Hide global Create dropdown (e.g. when the page has its own primary create action) */
  hideQuickCreate?: boolean;
}

export function AppHeader({
  title,
  subtitle,
  leading,
  actions,
  hideQuickCreate = false,
}: AppHeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { pathname } = useLocation();
  const portal = usePortal();
  const navigate = useNavigate();
  const isDashboard = /\/dashboard\/?$/.test(pathname);
  const isWorkOrdersSection = /\/work-orders(\/|$)/.test(pathname);
  const showSearch = !isDashboard && !isWorkOrdersSection;
  const showQuickCreate = !hideQuickCreate && !isDashboard;
  const workOrdersPath = usePortalPath("work-orders");
  const newWorkOrderPath = usePortalPath("work-orders/new");
  const serviceRequestsPath = usePortalPath("service-requests");
  const assetsPath = usePortalPath("assets");
  const vendorsPath = usePortalPath("vendors");
  const pmPath = usePortalPath("preventive-maintenance");
  const notificationsPath = usePortalPath("notifications");
  const loginPath = "/login";
  const signupPath = "/signup";

  const [notifications, setNotifications] = useState(mockNotifications);
  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications],
  );

  const user = useAuthStore((state) => state.user);
  const {
    canCreateWorkOrder,
    canSubmitServiceRequest,
    canManageAssets,
    canManageVendors,
    canManagePm,
  } = useRoleAccess();

  const runSearch = () => {
    const term = searchQuery.trim();
    if (!term) {
      toast.info("Type something to search");
      return;
    }
    navigate(`${workOrdersPath}?q=${encodeURIComponent(term)}`);
  };

  return (
    <header className="sticky top-0 z-40 flex min-h-16 shrink-0 flex-wrap items-center justify-between gap-2 border-b border-border bg-background/95 px-3 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:gap-3 sm:px-4 lg:flex-nowrap lg:px-6 lg:py-0">
      {/* LEFT */}
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-4 lg:flex-initial">
        {/* Mobile Sidebar */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" aria-hidden />
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="w-64 p-0">
            <Sidebar portal={portal} />
          </SheetContent>
        </Sheet>

        {leading}

        {/* Title */}
        <div className="min-w-0">
          <h1 className="truncate text-base font-semibold text-foreground sm:text-xl">{title}</h1>

          {subtitle && (
            <p className="truncate text-xs text-muted-foreground sm:text-sm">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex w-full shrink-0 flex-wrap items-center justify-end gap-1.5 sm:w-auto sm:gap-2 lg:ml-auto">
        {/* SEARCH */}
        {showSearch && (
          <>
            <div
              className={cn(
                "hidden items-center md:flex",
                searchOpen ? "w-64" : "w-auto",
              )}
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  placeholder="Search work orders, assets..."
                  className="w-64 bg-secondary pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchOpen(true)}
                  onBlur={() => setSearchOpen(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") runSearch();
                  }}
                />
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={runSearch}
              aria-label="Search work orders and assets"
            >
              <Search className="h-5 w-5" aria-hidden />
            </Button>
          </>
        )}

        {/* QUICK CREATE */}
        {user && showQuickCreate && (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" className="hidden sm:flex">
                  <Plus className="mr-2 h-4 w-4" />
                  Create
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-48">
                {canCreateWorkOrder && (
                  <DropdownMenuItem onClick={() => navigate(newWorkOrderPath)}>
                    Work Order
                  </DropdownMenuItem>
                )}

                {canSubmitServiceRequest && (
                  <DropdownMenuItem onClick={() => navigate(serviceRequestsPath)}>
                    Service Request
                  </DropdownMenuItem>
                )}

                {canManageAssets && (
                  <DropdownMenuItem onClick={() => navigate(assetsPath)}>
                    Asset
                  </DropdownMenuItem>
                )}

                {canManageVendors && (
                  <DropdownMenuItem onClick={() => navigate(vendorsPath)}>
                    Vendor
                  </DropdownMenuItem>
                )}

                {canManagePm && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate(pmPath)}>
                      PM Schedule
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Create */}
            <Button
              size="icon"
              className="sm:hidden"
              aria-label="Quick create menu"
              onClick={() => {
                if (canCreateWorkOrder) navigate(newWorkOrderPath)
                else if (canSubmitServiceRequest) navigate(serviceRequestsPath)
                else toast.info('No quick-create actions for this portal')
              }}
            >
              <Plus className="h-4 w-4" aria-hidden />
            </Button>
          </>
        )}

        {/* PAGE ACTIONS */}
        {actions ? (
          <div className="flex max-w-full flex-wrap items-center justify-end gap-1.5 sm:gap-2">
            {actions}
          </div>
        ) : null}

        {/* THEME TOGGLE */}
        <ThemeToggle />

        {/* NOTIFICATIONS & Auth */}
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : 'Notifications'}
              >
                <Bell className="h-5 w-5" aria-hidden />

                {unreadCount > 0 && (
                  <Badge className="absolute -right-1 -top-1 h-5 w-5 justify-center p-0 text-xs">
                    {unreadCount}
                  </Badge>
                )}

              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                Notifications
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 text-xs text-primary"
                  onClick={() =>
                    setNotifications((prev) =>
                      prev.map((n) => ({ ...n, isRead: true })),
                    )
                  }
                >
                  Mark all read
                </Button>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              {notifications.slice(0, 4).map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className="flex flex-col items-start gap-1 py-3"
                  onClick={() => navigate(notificationsPath)}
                >
                  <div className="flex w-full items-start justify-between gap-2">
                    <span
                      className={cn(
                        "text-sm font-medium",
                        !notification.isRead && "text-foreground",
                      )}
                    >
                      {notification.title}
                    </span>

                    {!notification.isRead && (
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    )}
                  </div>

                  <span className="line-clamp-2 text-xs text-muted-foreground">
                    {notification.message}
                  </span>
                </DropdownMenuItem>
              ))}

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="justify-center text-primary"
                onClick={() => navigate(notificationsPath)}
              >
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="hidden items-center gap-2 sm:flex">
            <Button variant="outline" size="sm" asChild>
              <Link to={loginPath}>
              Login
              </Link>
            </Button>

            <Button size="sm" asChild>
              <Link to={signupPath}>Sign Up</Link>
            </Button>
          </div>
        )}

        {user ? <ProfileDropdown /> : null}
      </div>
    </header>
  );
}
