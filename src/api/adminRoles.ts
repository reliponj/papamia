import { apiFetch } from '../services/api'

export type AdminRole = {
  id: number
  name: string
  code: string
  description: string
  isSystem: boolean
  permissionIds: number[]
}

export type AdminRolePayload = {
  name: string
  code: string
  description: string
  isSystem: boolean
  permissionIds: number[]
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null
}

function parseRole(raw: unknown): AdminRole | null {
  if (!isRecord(raw)) return null
  const id = typeof raw.id === 'number' ? raw.id : null
  if (id === null) return null
  return {
    id,
    name: typeof raw.name === 'string' ? raw.name : '',
    code: typeof raw.code === 'string' ? raw.code : '',
    description: typeof raw.description === 'string' ? raw.description : '',
    isSystem: typeof raw.isSystem === 'boolean' ? raw.isSystem : false,
    permissionIds: Array.isArray(raw.permissionIds) ? (raw.permissionIds as number[]) : [],
  }
}

function parseList(raw: unknown): AdminRole[] {
  let arr: unknown[] = []
  if (Array.isArray(raw)) arr = raw
  else if (isRecord(raw) && Array.isArray(raw.data)) arr = raw.data as unknown[]
  else if (isRecord(raw) && Array.isArray(raw.items)) arr = raw.items as unknown[]
  return arr.map(parseRole).filter((x): x is AdminRole => x !== null)
}

async function readBodyMessage(res: Response): Promise<string> {
  const text = await res.text()
  if (!text) return res.statusText || `HTTP ${res.status}`
  try {
    const j = JSON.parse(text) as unknown
    if (isRecord(j)) {
      const msg = j.message ?? j.error ?? j.detail
      if (typeof msg === 'string') return msg
    }
  } catch { /* ignore */ }
  return text.slice(0, 200)
}

export async function listRoles(): Promise<AdminRole[]> {
  const res = await apiFetch('/api/admin/role')
  if (!res.ok) throw new Error(await readBodyMessage(res))
  const data: unknown = await res.json()
  return parseList(data)
}

export async function createRole(payload: AdminRolePayload): Promise<AdminRole> {
  const res = await apiFetch('/api/admin/role', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(await readBodyMessage(res))
  const data: unknown = await res.json()
  const one = parseRole(data)
  if (!one) throw new Error('Invalid create role response')
  return one
}

export async function updateRole(id: number, payload: AdminRolePayload): Promise<AdminRole> {
  const res = await apiFetch(`/api/admin/role/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(await readBodyMessage(res))
  const data: unknown = await res.json()
  const one = parseRole(data)
  if (!one) throw new Error('Invalid update role response')
  return one
}

export async function deleteRole(id: number): Promise<void> {
  const res = await apiFetch(`/api/admin/role/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(await readBodyMessage(res))
}
