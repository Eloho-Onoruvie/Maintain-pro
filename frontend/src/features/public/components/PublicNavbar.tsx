import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import { cn } from '@/utils/helpers'
import { MaterialIcon } from '@/features/public/components/MaterialIcon'
import { PublicThemeToggle } from '@/features/public/components/PublicThemeToggle'
import {
  PUBLIC_NAV_LINKS,
  PUBLIC_ROUTES,
  type PublicNavItem,
} from '@/features/public/constants/routes'

interface PublicNavbarProps {
  activeItem?: PublicNavItem | 'portals'
}

export function PublicNavbar({ activeItem }: PublicNavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 z-50 h-20 w-full border-b border-border-subtle bg-surface-bright shadow-sm transition-shadow',
        scrolled && 'shadow-md',
      )}
    >
      <nav
        className="mx-auto flex h-full max-w-max-width items-center justify-between px-gutter-desktop"
        aria-label="Main navigation"
      >
        <Link to={PUBLIC_ROUTES.HOME} className="flex items-center gap-2">
          <MaterialIcon name="settings_suggest" className="text-3xl text-primary" />
          <span className="font-headline-lg text-headline-lg font-bold text-primary">MaintainPro</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {PUBLIC_NAV_LINKS.map((link) => (
            <Link
              key={link.id}
              to={link.href}
              className={cn(
                'font-label-md text-label-md transition-colors',
                activeItem === link.id
                  ? 'border-b-2 border-primary pb-1 text-primary'
                  : 'text-on-surface-variant hover:text-primary',
              )}
            >
              {link.label}
            </Link>
          ))}

          <Link
            to={PUBLIC_ROUTES.LOGIN}
            className={cn(
              'font-label-md text-label-md transition-colors',
              activeItem === 'portals'
                ? 'border-b-2 border-primary pb-1 text-primary'
                : 'text-on-surface-variant hover:text-primary',
            )}
          >
            Portals
          </Link>

          <PublicThemeToggle />

          <Link
            to={PUBLIC_ROUTES.SIGNUP}
            className="rounded-lg bg-primary px-6 py-2.5 font-label-md text-label-md text-on-primary transition-all hover:opacity-90 active:scale-95"
          >
            Get Started
          </Link>
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <PublicThemeToggle />
          <button
          type="button"
          className="p-2 text-on-surface-variant"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((open) => !open)}
        >
          <MaterialIcon name={mobileOpen ? 'close' : 'menu'} />
        </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="border-t border-border-subtle bg-surface-bright px-gutter-mobile py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {PUBLIC_NAV_LINKS.map((link) => (
              <Link
                key={link.id}
                to={link.href}
                className={cn(
                  'font-body-md text-body-md',
                  activeItem === link.id ? 'text-primary' : 'text-on-surface-variant',
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link to={PUBLIC_ROUTES.LOGIN} className="font-body-md text-body-md text-on-surface-variant">
              Portals
            </Link>
            <Link
              to={PUBLIC_ROUTES.SIGNUP}
              className="rounded-lg bg-primary px-6 py-2.5 text-center font-label-md text-label-md text-on-primary"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
