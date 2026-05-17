/**
 * Admin allergen API (CRUD).
 * Base URL: VITE_API_BASE_URL or https://dev.api.papamia.reliponj.online
 */

export type AdminAllergen = {
  id: number
  name: string
}

export type AdminAllergenPayload = {
  name: string
}

const DEFAULT_API_BASE = 'https://dev.api.papamia.reliponj.online'

function apiBase(): string {
  const raw = import.meta.env.VITE_API_BASE_URL?.trim()
  return (raw && raw.length > 0 ? raw : DEFAULT_API_BASE).replace(/\/$/, '')
}

function allergenPath(id?: number): string {
  if (id === undefined) return `${apiBase()}/api/admin/allergen`
  return `${apiBase()}/api/admin/allergen/${id}`
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null
}

function parseId(raw: unknown): number | null {
  if (typeof raw === 'number' && Number.isFinite(raw)) return raw
  if (typeof raw === 'string' && raw.trim() !== '') {
    const n = Number(raw)
    if (Number.isFinite(n)) return n
  }
  return null
}

function parseAllergen(raw: unknown): AdminAllergen | null {
  if (!isRecord(raw)) return null
  const id = parseId(raw.id)
  const name = raw.name
  if (id === null || typeof name !== 'string') return null
  return { id, name }
}

function parseList(raw: unknown): AdminAllergen[] {
  let arr: unknown[] = []
  if (Array.isArray(raw)) arr = raw
  else if (isRecord(raw) && Array.isArray(raw.data)) arr = raw.data
  else if (isRecord(raw) && Array.isArray(raw.items)) arr = raw.items
  return arr.map(parseAllergen).filter((x): x is AdminAllergen => x !== null)
}

async function readBodyMessage(res: Response): Promise<string> {
  const text = await res.text()
  if (!text) return res.statusText || `HTTP ${res.status}`
  try {
    const j = JSON.parse(text) as unknown
    if (isRecord(j)) {
      const msg = j.message ?? j.error ?? j.detail
      if (typeof msg === 'string') return msg
      if (Array.isArray(msg) && msg.every((m) => typeof m === 'string')) return msg.join('; ')
    }
  } catch {
    /* ignore */
  }
  return text.slice(0, 200)
}

export async function listAllergens(): Promise<AdminAllergen[]> {
  const res = await fetch(allergenPath(), { method: 'GET' })
  if (!res.ok) throw new Error(await readBodyMessage(res))
  const data: unknown = await res.json()
  return parseList(data)
}

export async function getAllergen(id: number): Promise<AdminAllergen> {
  const res = await fetch(allergenPath(id), { method: 'GET' })
  if (!res.ok) throw new Error(await readBodyMessage(res))
  const data: unknown = await res.json()
  const one = parseAllergen(data)
  if (!one) throw new Error('Invalid allergen response')
  return one
}

export async function createAllergen(payload: AdminAllergenPayload): Promise<AdminAllergen> {
  const res = await fetch(allergenPath(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: payload.name }),
  })
  if (!res.ok) throw new Error(await readBodyMessage(res))
  const data: unknown = await res.json()
  const one = parseAllergen(data)
  if (!one) throw new Error('Invalid create allergen response')
  return one
}

export async function updateAllergen(id: number, payload: AdminAllergenPayload): Promise<AdminAllergen> {
  const res = await fetch(allergenPath(id), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: payload.name }),
  })
  if (!res.ok) throw new Error(await readBodyMessage(res))
  const data: unknown = await res.json()
  const one = parseAllergen(data)
  if (!one) throw new Error('Invalid update allergen response')
  return one
}

export async function deleteAllergen(id: number): Promise<void> {
  const res = await fetch(allergenPath(id), { method: 'DELETE' })
  if (!res.ok) throw new Error(await readBodyMessage(res))
}
