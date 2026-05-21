export type Permission = string

export function hasPermission(
  userPermissions: readonly Permission[],
  permission: Permission,
): boolean {
  return userPermissions.includes(permission)
}

export function hasAnyPermission(
  userPermissions: readonly Permission[],
  permissions: readonly Permission[],
): boolean {
  return permissions.some((permission) =>
    hasPermission(userPermissions, permission),
  )
}

