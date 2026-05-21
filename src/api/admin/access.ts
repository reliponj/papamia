import { AdminApiError } from './http'
import type { RoleListDto } from './types'
import { fetchUserRoles as fetchUserRolesFromApi } from './user'

export async function fetchUserRoles(userId: number): Promise<RoleListDto[]> {
  return fetchUserRolesFromApi(userId)
}

export const ADMIN_ROLE_CODES = new Set(['admin', 'moderator'])

export function hasAdminPanelAccess(roles: RoleListDto[]): boolean {
  return roles.some((r) => ADMIN_ROLE_CODES.has(r.code.toLowerCase()))
}

export function isForbiddenError(err: unknown): boolean {
  return err instanceof AdminApiError && err.status === 403
}
