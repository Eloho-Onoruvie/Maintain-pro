/** Public marketing site navigation targets */
export const PUBLIC_ROUTES = {
  HOME: '/',
  FEATURES: '/features',
  ABOUT: '/about',
  CONTACT: '/contact',
  PRIVACY: '/privacy-policy',
  TERMS: '/terms-of-service',
  LOGIN: '/login',
  SIGNUP: '/signup',
  SIGNUP_ORG: '/signup/organization',
  SIGNUP_TECH: '/signup/technician',
  SIGNUP_VENDOR: '/signup/vendor',
} as const

export type PublicNavItem = 'home' | 'features' | 'about' | 'contact'

export const PUBLIC_NAV_LINKS: { id: PublicNavItem; label: string; href: string }[] = [
  { id: 'features', label: 'Features', href: PUBLIC_ROUTES.FEATURES },
  { id: 'about', label: 'About', href: PUBLIC_ROUTES.ABOUT },
  { id: 'contact', label: 'Contact', href: PUBLIC_ROUTES.CONTACT },
]
