import React from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'

export function Providers() {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  )
}
