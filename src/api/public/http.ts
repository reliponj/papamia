import { apiFetch } from '../../services/api'

export class PublicApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'PublicApiError'
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

type QueryValue = string | number | undefined | number[]

function appendQuery(params: URLSearchParams, query?: Record<string, QueryValue>): void {
  if (!query) return
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined) continue
    if (Array.isArray(value)) {
      for (const v of value) params.append(key, String(v))
    } else {
      params.set(key, String(value))
    }
  }
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

/** Public `/api/*` request (optional Bearer via apiFetch). */
export async function publicRequest<T>(
  method: HttpMethod,
  path: string,
  body?: unknown,
  query?: Record<string, QueryValue>,
): Promise<T> {
  let normalized = path.startsWith('/') ? path : `/${path}`
  const params = new URLSearchParams()
  appendQuery(params, query)
  const qs = params.toString()
  if (qs) normalized += `?${qs}`

  const res = await apiFetch(normalized, {
    method,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (res.status === 204) return undefined as T

  if (!res.ok) {
    throw new PublicApiError(await readBodyMessage(res), res.status)
  }

  const contentType = res.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    return (await res.json()) as T
  }
  return undefined as T
}
