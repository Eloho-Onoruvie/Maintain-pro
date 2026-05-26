import { Outlet } from 'react-router-dom'
import {AppSidebar as Sidebar } from '@/components/navigation/Sidebar'

export function MainLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden lg:flex">
        <Sidebar />
      </div>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
