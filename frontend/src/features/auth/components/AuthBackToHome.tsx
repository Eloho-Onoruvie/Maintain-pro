import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

import { PUBLIC_ROUTES } from '@/features/public/constants/routes'

export function AuthBackToHome({ className }: { className?: string }) {
  return (
    <Link
      to={PUBLIC_ROUTES.HOME}
      className={
        className ??
        'inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground'
      }
    >
      <ArrowLeft className="h-4 w-4" aria-hidden />
      Back to home
    </Link>
  )
}
