import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PasswordStrengthBar } from '@/features/auth/components/PasswordStrengthBar'

interface PasswordFieldProps {
  id: string
  label?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  hint?: string
  showStrength?: boolean
}

export function PasswordField({
  id,
  label = 'Password',
  value,
  onChange,
  placeholder = 'Enter your password',
  required = true,
  hint,
  showStrength = false,
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="bg-secondary pr-10"
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {showStrength && <PasswordStrengthBar password={value} />}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}
