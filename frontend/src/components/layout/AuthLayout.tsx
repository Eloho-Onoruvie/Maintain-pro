import { Outlet } from 'react-router-dom'

import { ThemeToggle } from '@/components/ui/ThemeToggle'

export function AuthLayout() {
  return (
    <div className="relative min-h-screen bg-background">
      <div className="absolute right-4 top-4 z-50">
        <ThemeToggle />
      </div>
      <Outlet />
    </div>
  )
}
