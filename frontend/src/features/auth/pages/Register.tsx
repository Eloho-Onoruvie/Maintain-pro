import { Navigate } from 'react-router-dom'

/** @deprecated Use SignupOrganization or /signup/organization */
export function Register() {
  return <Navigate to="/signup/organization" replace />
}
