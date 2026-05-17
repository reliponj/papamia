import { apiFetch } from '../services/api'

export type AdminPermissionGroup = {
  id: number
  name: string
  code: string
  description: string
  permissionIds: number[]
}

export type AdminPermissionGroupPayload = {
  name: string
  code: string
  description: string
  permissionIds: number[]
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null
}

function parseGroup(raw: unknown): AdminPermissionGroup | null {
  if (!isRecord(raw)) return null
  const id = typeof raw.id === 'number' ? raw.id : null
  if (id === null) return null
  return {
    id,
    name: typeof raw.name === 'string' ? raw.name : '',
    code: typeof raw.code === 'string' ? raw.code : '',
    description: typeof raw.description === 'string' ? raw.description : '',
    permissionIds: Array.isArray(raw.permissionIds) ? (raw.permissionIds as number[]) : [],
  }
}

function parseList(raw: unknown): AdminPermissionGroup[] {
  let arr: unknown[] = []
  if (Array.isArray(raw)) arr = raw
  else if (isRecord(raw) && Array.isArray(raw.data)) arr = raw.data as unknown[]
  else if (isRecord(raw) && Array.isArray(raw.items)) arr = raw.items as unknown[]
  return arr.map(parseGroup).filter((x): x is AdminPermissionGroup => x !== null)
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

export async function listPermissionGroups(): Promise<AdminPermissionGroup[]> {
  const res = await apiFetch('/api/admin/permission-group/all')
  if (!res.ok) throw new Error(await readBodyMessage(res))
  const data: unknown = await res.json()
  return parseList(data)
}

export async function createPermissionGroup(payload: AdminPermissionGroupPayload): Promise<AdminPermissionGroup> {
  const res = await apiFetch('/api/admin/permission-group', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(await readBodyMessage(res))
  const data: unknown = await res.json()
  const one = parseGroup(data)
  if (!one) throw new Error('Invalid create permission group response')
  return one
}

export async function updatePermissionGroup(id: number, payload: AdminPermissionGroupPayload): Promise<AdminPermissionGroup> {
  const res = await apiFetch(`/api/admin/permission-group/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(await readBodyMessage(res))
  const data: unknown = await res.json()
  const one = parseGroup(data)
  if (!one) throw new Error('Invalid update permission group response')
  return one
}

export async function deletePermissionGroup(id: number): Promise<void> {
  const res = await apiFetch(`/api/admin/permission-group/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(await readBodyMessage(res))
}
