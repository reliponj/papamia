import { adminRequest, isRecord, parseId, unwrapList } from './http'
import type { RoleListDto, UserCreatePayload, UserDto, UserUpdatePayload } from './types'
import { parseRoleList } from './role'

export type { UserDto, UserCreatePayload, UserUpdatePayload }

function parseUser(raw: unknown): UserDto | null {
  if (!isRecord(raw)) return null
  const id = parseId(raw.id)
  const username = raw.username
  const email = raw.email
  if (id === null || typeof username !== 'string' || typeof email !== 'string') return null
  const lastLogin = raw.lastLogin
  const lastIp = raw.lastIp
  return {
    id,
    username,
    email,
    lastLogin: typeof lastLogin === 'string' ? lastLogin : null,
    lastIp: typeof lastIp === 'string' ? lastIp : null,
  }
}

function parseUserList(raw: unknown): UserDto[] {
  return unwrapList(raw).map(parseUser).filter((x): x is UserDto => x !== null)
}

const BASE = '/api/admin/user'

export async function listUsers(): Promise<UserDto[]> {
  const data = await adminRequest<unknown>('GET', BASE)
  return parseUserList(data)
}

export async function createUser(payload: UserCreatePayload): Promise<UserDto> {
  const data = await adminRequest<unknown>('POST', BASE, payload)
  const one = parseUser(data)
  if (!one) throw new Error('Invalid create user response')
  return one
}

export async function updateUser(id: number, payload: UserUpdatePayload): Promise<UserDto> {
  const data = await adminRequest<unknown>('PUT', `${BASE}/${id}`, payload)
  const one = parseUser(data)
  if (!one) throw new Error('Invalid update user response')
  return one
}

export async function deleteUser(id: number): Promise<void> {
  await adminRequest<void>('DELETE', `${BASE}/${id}`)
}

export async function fetchUserRoles(userId: number): Promise<RoleListDto[]> {
  const data = await adminRequest<unknown>('GET', `${BASE}/${userId}/roles`)
  return parseRoleList(data)
}

export async function updateUserRoles(userId: number, roleIds: number[]): Promise<RoleListDto[]> {
  const data = await adminRequest<unknown>('PUT', `${BASE}/${userId}/roles`, { roleIds })
  return parseRoleList(data)
}
