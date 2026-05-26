import { adminRequest, unwrapList } from './http'
import type { PermissionDto, PermissionPayload } from './types'
import { parsePermission } from './role'

export type { PermissionDto, PermissionPayload }

function parsePermissionList(raw: unknown): PermissionDto[] {
  return unwrapList(raw).map(parsePermission).filter((x): x is PermissionDto => x !== null)
}

export async function listPermissionsByGroup(groupId: number): Promise<PermissionDto[]> {
  const data = await adminRequest<unknown>('GET', `/api/admin/permission/group/${groupId}`)
  return parsePermissionList(data)
}

export async function createPermission(groupId: number, payload: PermissionPayload): Promise<PermissionDto> {
  const data = await adminRequest<unknown>('POST', `/api/admin/permission/group/${groupId}`, payload)
  const one = parsePermission(data)
  if (!one) throw new Error('Invalid create permission response')
  return one
}

export async function updatePermission(id: number, payload: PermissionPayload): Promise<PermissionDto> {
  const data = await adminRequest<unknown>('PUT', `/api/admin/permission/${id}`, payload)
  const one = parsePermission(data)
  if (!one) throw new Error('Invalid update permission response')
  return one
}

export async function deletePermission(id: number): Promise<void> {
  await adminRequest<void>('DELETE', `/api/admin/permission/${id}`)
}
