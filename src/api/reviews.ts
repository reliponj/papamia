import { apiFetch } from '../services/api'

export type Review = {
  id: number
  authorName: string
  rating: number
  text: string
  createdAt: string
}

export type ReviewPayload = {
  rating: number
  text: string
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null
}

function parseReview(raw: unknown): Review | null {
  if (!isRecord(raw)) return null
  const id = typeof raw.id === 'number' ? raw.id : null
  if (id === null) return null
  return {
    id,
    authorName: typeof raw.authorName === 'string' ? raw.authorName
      : typeof raw.username === 'string' ? raw.username
      : 'Guest',
    rating: typeof raw.rating === 'number' ? Math.min(5, Math.max(1, raw.rating)) : 5,
    text: typeof raw.text === 'string' ? raw.text
      : typeof raw.content === 'string' ? raw.content
      : '',
    createdAt: typeof raw.createdAt === 'string' ? raw.createdAt
      : typeof raw.date === 'string' ? raw.date
      : new Date().toISOString(),
  }
}

function parseList(raw: unknown): Review[] {
  let arr: unknown[] = []
  if (Array.isArray(raw)) arr = raw
  else if (isRecord(raw) && Array.isArray(raw.data)) arr = raw.data as unknown[]
  else if (isRecord(raw) && Array.isArray(raw.items)) arr = raw.items as unknown[]
  return arr.map(parseReview).filter((x): x is Review => x !== null)
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

export async function listReviews(): Promise<Review[]> {
  const res = await apiFetch('/api/review')
  if (!res.ok) throw new Error(await readBodyMessage(res))
  const data: unknown = await res.json()
  return parseList(data)
}

export async function createReview(payload: ReviewPayload): Promise<Review> {
  const res = await apiFetch('/api/review', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(await readBodyMessage(res))
  const data: unknown = await res.json()
  const one = parseReview(data)
  if (!one) throw new Error('Invalid create review response')
  return one
}
