import { useState } from 'react'
import { Link } from 'react-router-dom'

import { BrandLogo } from '@/components/brand/BrandLogo'
import { MaterialIcon } from '@/features/public/components/MaterialIcon'
import { PUBLIC_ROUTES } from '@/features/public/constants/routes'

type FooterVariant = 'landing' | 'features' | 'about' | 'contact'

interface PublicFooterProps {
  variant?: FooterVariant
}

export function PublicFooter({ variant = 'landing' }: PublicFooterProps) {
  const showNewsletter = variant === 'landing'
  const showConnect = variant === 'about' || variant === 'contact' || variant === 'features'
  const [newsletterState, setNewsletterState] = useState<'idle' | 'success'>('idle')

  return (
    <footer className="w-full border-t border-border-subtle bg-surface-container-lowest py-12">
      <div className="mx-auto grid max-w-max-width grid-cols-1 gap-8 px-gutter-desktop md:grid-cols-4">
        <div className="md:col-span-1">
          <BrandLogo
            to={PUBLIC_ROUTES.HOME}
            iconSize={28}
            textClassName="font-headline-md text-headline-md font-bold text-primary"
            className="mb-6"
          />
          <p className="font-body-md text-body-md text-on-surface-variant">
            {variant === 'landing' && 'Smarter maintenance infrastructure for modern organizations.'}
            {variant === 'features' &&
              'Engineering reliability and transparency into every square foot of your enterprise.'}
            {variant === 'about' && 'Connecting global maintenance operations with intelligent, unified systems.'}
            {variant === 'contact' &&
              'Empowering maintenance professionals with intelligent asset management tools.'}
          </p>
        </div>

        <div>
          <h4 className="mb-6 font-label-md text-label-md font-bold text-on-surface">
            {variant === 'about' ? 'Product' : variant === 'features' ? 'Solutions' : 'Platform'}
          </h4>
          <ul className="space-y-4">
            <li>
              <Link
                to={PUBLIC_ROUTES.FEATURES}
                className="text-on-surface-variant underline transition-all hover:text-secondary"
              >
                Features
              </Link>
            </li>
            <li>
              <Link
                to={PUBLIC_ROUTES.SIGNUP_ORG}
                className="text-on-surface-variant underline transition-all hover:text-secondary"
              >
                Organizations
              </Link>
            </li>
            <li>
              <Link
                to={PUBLIC_ROUTES.SIGNUP_TECH}
                className="text-on-surface-variant underline transition-all hover:text-secondary"
              >
                Technicians
              </Link>
            </li>
            <li>
              <Link
                to={PUBLIC_ROUTES.SIGNUP_VENDOR}
                className="text-on-surface-variant underline transition-all hover:text-secondary"
              >
                Vendors
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-6 font-label-md text-label-md font-bold text-on-surface">Company</h4>
          <ul className="space-y-4">
            <li>
              <Link
                to={PUBLIC_ROUTES.ABOUT}
                className={
                  variant === 'about'
                    ? 'font-body-md text-body-md font-bold text-primary'
                    : 'text-on-surface-variant underline transition-all hover:text-secondary'
                }
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to={PUBLIC_ROUTES.PRIVACY}
                className="text-on-surface-variant underline transition-all hover:text-secondary"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                to={PUBLIC_ROUTES.TERMS}
                className="text-on-surface-variant underline transition-all hover:text-secondary"
              >
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>

        {showNewsletter && (
          <div>
            <h4 className="mb-6 font-label-md text-label-md font-bold text-on-surface">Newsletter</h4>
            <p className="mb-4 font-body-md text-body-md text-on-surface-variant">
              Stay updated with facility trends.
            </p>
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault()
                setNewsletterState('success')
                window.setTimeout(() => setNewsletterState('idle'), 2500)
              }}
            >
              <input
                className="w-full rounded-lg border border-border-subtle bg-surface-subtle px-4 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-primary"
                placeholder="Email address"
                type="email"
                aria-label="Email address for newsletter"
              />
              <button
                type="submit"
                className="rounded-lg bg-primary px-4 py-2 font-label-sm text-label-sm text-on-primary"
              >
                {newsletterState === 'success' ? 'Joined' : 'Join'}
              </button>
            </form>
            {newsletterState === 'success' && (
              <p className="mt-2 font-label-sm text-label-sm text-status-success">
                Thanks for subscribing.
              </p>
            )}
          </div>
        )}

        {showConnect && !showNewsletter && (
          <div>
            <h4 className="mb-6 font-label-md text-label-md font-bold uppercase text-on-surface">
              Stay Connected
            </h4>
            <div className="flex gap-4">
              <a
                href="mailto:support@maintainpro.com"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border-subtle text-on-surface-variant transition-all hover:border-primary hover:text-primary"
                aria-label="Email us"
              >
                <MaterialIcon name="mail" className="text-xl" />
              </a>
              <Link
                to={PUBLIC_ROUTES.CONTACT}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border-subtle text-on-surface-variant transition-all hover:border-primary hover:text-primary"
                aria-label="Contact page"
              >
                <MaterialIcon name="apps" className="text-xl" />
              </Link>
            </div>
            <p className="mt-8 font-body-md text-body-md text-on-surface-variant opacity-80">
              © 2024 MaintainPro Inc. All rights reserved.
            </p>
          </div>
        )}
      </div>

      {(showNewsletter || variant === 'features') && (
        <div className="mx-auto mt-12 max-w-max-width border-t border-border-subtle px-gutter-desktop pt-8 text-center font-body-md text-body-md text-on-surface-variant">
          © 2024 MaintainPro Inc. All rights reserved.
        </div>
      )}
    </footer>
  )
}
