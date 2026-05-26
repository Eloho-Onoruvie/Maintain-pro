import { create } from "zustand";

import type {User} from '@/types/user.types'

interface AuthStore {
  user: User | null;
  token: string | null;

  login: (user: User, token: string) => void;
  logout: () => void;
}

// user: 

// token: 'mock-jwt-token'

export const useAuthStore = create<AuthStore>((set) => ({
   user: {
  id: '1',
  firstName: 'Samuel',
  lastName: 'Ayokanmi',
  email: 'samuel@example.com',
  role: 'staff',
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
},

    token: 'mock-jwt-token',

  login: (user, token) =>
    set({
      user,
      token,
    }),

  logout: () =>
    set({
      user: null,
      token: null,
    }),
}));
