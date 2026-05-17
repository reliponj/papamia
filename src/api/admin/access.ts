import { AdminApiError, adminRequest, isRecord, parseId, unwrapList } from './http'
import type { RoleListDto } from './types'

function parseRole(raw: unknown): RoleListDto | null {
  if (!isRecord(raw)) return null
  const id = parseId(raw.id)
  const name = raw.name
  const code = raw.code
  const description = raw.description
  const isSystem = raw.isSystem
  if (
    id === null ||
    typeof name !== 'string' ||
    typeof code !== 'string' ||
    typeof description !== 'string' ||
    typeof isSystem !== 'boolean'
  ) {
    return null
  }
  return { id, name, code, description, isSystem }
}

function parseRoleList(raw: unknown): RoleListDto[] {
  return unwrapList(raw).map(parseRole).filter((x): x is RoleListDto => x !== null)
}

export async function fetchUserRoles(userId: number): Promise<RoleListDto[]> {
  const data = await adminRequest<unknown>('GET', `/api/admin/user/${userId}/roles`)
  return parseRoleList(data)
}

export const ADMIN_ROLE_CODES = new Set(['admin', 'moderator'])

export function hasAdminPanelAccess(roles: RoleListDto[]): boolean {
  return roles.some((r) => ADMIN_ROLE_CODES.has(r.code.toLowerCase()))
}

export function isForbiddenError(err: unknown): boolean {
  return err instanceof AdminApiError && err.status === 403
}
