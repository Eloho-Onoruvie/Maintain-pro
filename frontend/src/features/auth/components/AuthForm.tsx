import { ReactNode } from 'react'
import { Wrench } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface AuthFormProps {
  title: string
  description?: string
  children: ReactNode
  showLogo?: boolean
}

export function AuthForm({ title, description, children, showLogo = true }: AuthFormProps) {
  return (
    <div className="w-full max-w-sm">
      {showLogo && (
        <div className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Wrench className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-semibold">MaintainPro</span>
        </div>
      )}
      <Card className="border-border bg-card">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  )
}
