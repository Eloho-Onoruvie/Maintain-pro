import { Loader2 } from 'lucide-react'

import { cn } from '@/utils/helpers'

interface PageLoaderProps {
  label?: string
  className?: string
}

export function PageLoader({ label = 'Loading…', className }: PageLoaderProps) {
  return (
    <div
      className={cn(
        'flex min-h-[240px] flex-col items-center justify-center gap-3 text-muted-foreground',
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden />
      <p className="text-sm">{label}</p>
    </div>
  )
}
