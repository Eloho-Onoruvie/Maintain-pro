import { Bell, LogOut, User as UserIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import { useAuthStore } from '@/app/store'
import { usePortalPath } from '@/hooks/usePortal'

export default function ProfileDropdown() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()
  const profilePath = usePortalPath('profile')
  const notificationsPath = usePortalPath('notifications')

  if (!user) return null

  const initials = `${user.firstName[0]}${user.lastName[0]}`

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex cursor-pointer items-center gap-3 rounded-lg border bg-card px-3 py-2 transition hover:bg-accent">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.avatar} />

            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>

          <div className="hidden text-left md:block">
            <p className="text-sm font-medium">
              {user.firstName} {user.lastName}
            </p>

            <p className="text-xs capitalize text-muted-foreground">
              {user.role.replace('_', ' ')}
            </p>
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span className="font-medium">
              {user.firstName} {user.lastName}
            </span>

            <span className="text-xs text-muted-foreground">{user.email}</span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => navigate(profilePath)}>
          <UserIcon className="mr-2 h-4 w-4" />
          My profile
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => navigate(notificationsPath)}>
          <Bell className="mr-2 h-4 w-4" />
          Notifications
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="text-red-500" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
