import { adminRequest, isRecord, parseId, unwrapList } from './http'
import type {
  PermissionDto,
  PermissionGroupCreatePayload,
  PermissionGroupDto,
  PermissionGroupUpdatePayload,
} from './types'
import { parsePermission } from './role'

export type { PermissionGroupDto, PermissionGroupCreatePayload, PermissionGroupUpdatePayload }

function parsePermissionGroup(raw: unknown): PermissionGroupDto | null {
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
  const permissions = Array.isArray(raw.permissions)
    ? raw.permissions.map(parsePermission).filter((x): x is PermissionDto => x !== null)
    : []
  return { id, name, code, description, permissions }
}

function parsePermissionGroupList(raw: unknown): PermissionGroupDto[] {
  return unwrapList(raw).map(parsePermissionGroup).filter((x): x is PermissionGroupDto => x !== null)
}

const BASE = '/api/admin/permission-group'

export async function listPermissionGroups(): Promise<PermissionGroupDto[]> {
  const data = await adminRequest<unknown>('GET', `${BASE}/all`)
  return parsePermissionGroupList(data)
}

export async function createPermissionGroup(
  payload: PermissionGroupCreatePayload,
): Promise<PermissionGroupDto> {
  const data = await adminRequest<unknown>('POST', BASE, payload)
  const one = parsePermissionGroup(data)
  if (!one) throw new Error('Invalid create permission group response')
  return one
}

export async function updatePermissionGroup(
  id: number,
  payload: PermissionGroupUpdatePayload,
): Promise<PermissionGroupDto> {
  const data = await adminRequest<unknown>('PUT', `${BASE}/${id}`, payload)
  const one = parsePermissionGroup(data)
  if (!one) throw new Error('Invalid update permission group response')
  return one
}

export async function deletePermissionGroup(id: number): Promise<void> {
  await adminRequest<void>('DELETE', `${BASE}/${id}`)
}

export function permissionIdsFromGroup(group: PermissionGroupDto): number[] {
  return group.permissions.map((p) => p.id)
}
