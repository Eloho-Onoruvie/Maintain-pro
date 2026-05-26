import { ShieldAlert } from 'lucide-react'

import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 text-center shadow-sm">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-red-100 p-4 dark:bg-red-950">
            <ShieldAlert className="h-10 w-10 text-red-500" />
          </div>
        </div>

        <h1 className="mb-2 text-3xl font-bold">
          Access Denied
        </h1>

        <p className="mb-6 text-sm text-muted-foreground">
          You do not have permission to access this page.
        </p>

        <div className="flex justify-center gap-3">
          <Button asChild>
            <Link to="/dashboard">
              Back to Dashboard
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
          >
            <Link to="/login">
              Login Again
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}