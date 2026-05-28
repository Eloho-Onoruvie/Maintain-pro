import React from 'react'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'sonner'
import { router } from './router'

export function Providers() {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
      <Toaster richColors closeButton position="top-right" />
    </React.StrictMode>
  )
}
