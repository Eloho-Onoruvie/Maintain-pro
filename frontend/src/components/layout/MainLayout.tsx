import { Outlet } from 'react-router-dom'

import type { Portal } from '@/app/portal.config'
import { AppSidebar as Sidebar } from '@/components/navigation/Sidebar'

interface MainLayoutProps {
  portal: Portal
}

export function MainLayout({ portal }: MainLayoutProps) {
  return (
    <div className="app-portal flex h-dvh max-h-dvh overflow-hidden">
      <div className="hidden h-full shrink-0 lg:flex">
        <Sidebar portal={portal} />
      </div>
      <main
        data-scroll-container
        className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-y-contain"
      >
        <Outlet />
      </main>
    </div>
  )
}
