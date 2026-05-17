import { apiFetch } from '../../services/api'

export class AdminApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'AdminApiError'
    this.status = status
  }
}

export function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null
}

export function parseId(raw: unknown): number | null {
  if (typeof raw === 'number' && Number.isFinite(raw)) return raw
  if (typeof raw === 'string' && raw.trim() !== '') {
    const n = Number(raw)
    if (Number.isFinite(n)) return n
  }
  return null
}

export async function readBodyMessage(res: Response): Promise<string> {
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

export function unwrapList(raw: unknown): unknown[] {
  if (Array.isArray(raw)) return raw
  if (isRecord(raw) && Array.isArray(raw.data)) return raw.data
  if (isRecord(raw) && Array.isArray(raw.items)) return raw.items
  return []
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

/**
 * Authenticated request to `/api/admin/*` (Bearer + refresh via apiFetch).
 */
export async function adminRequest<T>(
  method: HttpMethod,
  path: string,
  body?: unknown,
): Promise<T> {
  const normalized = path.startsWith('/') ? path : `/${path}`
  const res = await apiFetch(normalized, {
    method,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (res.status === 204) return undefined as T

  if (!res.ok) {
    throw new AdminApiError(await readBodyMessage(res), res.status)
  }

  const contentType = res.headers.get('content-type') ?? ''
  if (!contentType.includes('application/json')) return undefined as T

  const text = await res.text()
  if (!text) return undefined as T

  return JSON.parse(text) as T
}
