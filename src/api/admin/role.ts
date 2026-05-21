import { adminRequest, isRecord, parseId, unwrapList } from './http'
import type { PermissionDto, RoleDto, RoleListDto, RolePayload } from './types'

export type { RoleDto, RoleListDto, RolePayload }

export function parsePermission(raw: unknown): PermissionDto | null {
  if (!isRecord(raw)) return null
  const id = parseId(raw.id)
  const name = raw.name
  const code = raw.code
  const description = raw.description
  if (
    id === null ||
    typeof name !== 'string' ||
    typeof code !== 'string' ||
    typeof description !== 'string'
  ) {
    return null
  }
  return { id, name, code, description }
}

function permissionIdsFromRaw(raw: Record<string, unknown>): number[] {
  if (Array.isArray(raw.permissionIds)) {
    return raw.permissionIds
      .map((id) => (typeof id === 'number' ? id : Number(id)))
      .filter((id) => Number.isFinite(id))
  }
  if (Array.isArray(raw.permissions)) {
    return raw.permissions
      .map((p) => parsePermission(p)?.id)
      .filter((id): id is number => id !== undefined)
  }
  return []
}

export function parseRoleListItem(raw: unknown): RoleListDto | null {
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

export function parseRoleList(raw: unknown): RoleListDto[] {
  return unwrapList(raw).map(parseRoleListItem).filter((x): x is RoleListDto => x !== null)
}

export function parseRoleDetail(raw: unknown): (RoleDto & { permissionIds: number[] }) | null {
  const base = parseRoleListItem(raw)
  if (!base || !isRecord(raw)) return null
  const permissions = Array.isArray(raw.permissions)
    ? raw.permissions.map(parsePermission).filter((x): x is PermissionDto => x !== null)
    : undefined
  return {
    ...base,
    permissions,
    permissionIds: permissionIdsFromRaw(raw),
  }
}

const BASE = '/api/admin/role'

export async function listRoles(): Promise<RoleListDto[]> {
  const data = await adminRequest<unknown>('GET', BASE)
  return parseRoleList(data)
}

export async function getRole(id: number): Promise<RoleDto & { permissionIds: number[] }> {
  const data = await adminRequest<unknown>('GET', `${BASE}/${id}`)
  const one = parseRoleDetail(data)
  if (!one) throw new Error('Invalid role response')
  return one
}

export async function createRole(payload: RolePayload): Promise<RoleDto & { permissionIds: number[] }> {
  const data = await adminRequest<unknown>('POST', BASE, payload)
  const one = parseRoleDetail(data)
  if (!one) throw new Error('Invalid create role response')
  return one
}

export async function updateRole(id: number, payload: RolePayload): Promise<RoleDto & { permissionIds: number[] }> {
  const data = await adminRequest<unknown>('PUT', `${BASE}/${id}`, payload)
  const one = parseRoleDetail(data)
  if (!one) throw new Error('Invalid update role response')
  return one
}

export async function deleteRole(id: number): Promise<void> {
  await adminRequest<void>('DELETE', `${BASE}/${id}`)
}
