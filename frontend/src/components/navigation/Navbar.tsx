import { useState } from "react";
import { Bell, Search, Plus, Menu } from "lucide-react";

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

import { useAuthStore } from "@/app/store";

import ProfileDropdown from "@/components/ui/ProfileDropdown";

import { ThemeToggle } from "@/components/ui/ThemeToggle";

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function AppHeader({ title, subtitle, actions }: AppHeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  const unreadCount = mockNotifications.filter((n) => !n.isRead).length;

  const user = useAuthStore((state) => state.user);

  return (
    <header className="sticky top-0 z-40 flex h-18 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:px-6">
      {/* LEFT */}
      <div className="flex items-center gap-4">
        {/* Mobile Sidebar */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation</span>
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="w-64 p-0">
            <Sidebar />
          </SheetContent>
        </Sheet>

        {/* Title */}
        <div>
          <h1 className="text-xl font-semibold text-foreground">{title}</h1>

          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2">
        {/* SEARCH */}
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
              onFocus={() => setSearchOpen(true)}
              onBlur={() => setSearchOpen(false)}
            />
          </div>
        </div>

        {/* Mobile Search */}
        <Button variant="ghost" size="icon" className="md:hidden">
          <Search className="h-5 w-5" />

          <span className="sr-only">Search</span>
        </Button>

        {/* QUICK CREATE */}
        {user && (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" className="hidden sm:flex">
                  <Plus className="mr-2 h-4 w-4" />
                  Create
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>Work Order</DropdownMenuItem>

                <DropdownMenuItem>Service Request</DropdownMenuItem>

                <DropdownMenuItem>Asset</DropdownMenuItem>

                <DropdownMenuItem>Vendor</DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem>PM Schedule</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Create */}
            <Button size="icon" className="sm:hidden">
              <Plus className="h-4 w-4" />

              <span className="sr-only">Create</span>
            </Button>
          </>
        )}

        {/* PAGE ACTIONS */}
        {actions}

        {/* THEME TOGGLE */}
        <ThemeToggle />

        {/* NOTIFICATIONS & Auth */}
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />

                {unreadCount > 0 && (
                  <Badge className="absolute -right-1 -top-1 h-5 w-5 justify-center p-0 text-xs">
                    {unreadCount}
                  </Badge>
                )}

                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                Notifications
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 text-xs text-primary"
                >
                  Mark all read
                </Button>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              {mockNotifications.slice(0, 4).map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className="flex flex-col items-start gap-1 py-3"
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

              <DropdownMenuItem className="justify-center text-primary">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="hidden items-center gap-2 sm:flex">
            <Button variant="outline" size="sm">
              Login
            </Button>

            <Button size="sm">Sign Up</Button>
          </div>
        )}
      </div>
    </header>
  );
}
