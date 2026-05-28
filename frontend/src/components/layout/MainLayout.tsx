import { Outlet } from 'react-router-dom'

import type { Portal } from '@/app/portal.config'
import { AppSidebar as Sidebar } from '@/components/navigation/Sidebar'

interface MainLayoutProps {
  portal: Portal
}

export function MainLayout({ portal }: MainLayoutProps) {
  return (
    <div className="app-portal flex h-screen overflow-hidden">
      <div className="hidden lg:flex">
        <Sidebar portal={portal} />
      </div>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
