import { create } from 'zustand'

import type { User } from '@/types/user.types'

const AUTH_TOKEN_KEY = 'auth_token'
const AUTH_USER_KEY = 'auth_user'

function readStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY)
    return raw ? (JSON.parse(raw) as User) : null
  } catch {
    return null
  }
}

interface AuthStore {
  user: User | null
  token: string | null
  isHydrated: boolean

  login: (user: User, token: string) => void
  logout: () => void
  hydrate: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isHydrated: false,

  login: (user, token) => {
    localStorage.setItem(AUTH_TOKEN_KEY, token)
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
    set({ user, token })
  },

  logout: () => {
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem(AUTH_USER_KEY)
    set({ user: null, token: null })
  },

  hydrate: () => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY)
    const user = readStoredUser()
    set({
      user: token && user ? user : null,
      token: token && user ? token : null,
      isHydrated: true,
    })
  },
}))

// Hydrate auth state on module load
useAuthStore.getState().hydrate()
