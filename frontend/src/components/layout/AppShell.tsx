import { Outlet } from 'react-router-dom'
import { AppSidebar as Sidebar } from '@/components/navigation/Sidebar'
import { AppHeader as Navbar } from '@/components/navigation/Navbar'

export function AppShell() {
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden lg:flex">
        <Sidebar />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar title="" />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
