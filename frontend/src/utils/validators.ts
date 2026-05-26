export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function isStrongPassword(password: string): boolean {
  return password.length >= 8 && /[0-9]/.test(password) && /[^a-zA-Z0-9]/.test(password)
}

export function isRequired(value: string): boolean {
  return value.trim().length > 0
}
