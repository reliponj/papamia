import { isRecord, publicRequest, unwrapList } from './http'
import type { Review, ReviewPayload } from './types'

export type { Review, ReviewPayload } from './types'

function parseReview(raw: unknown): Review | null {
  if (!isRecord(raw)) return null
  const id = typeof raw.id === 'number' ? raw.id : null
  if (id === null) return null
  return {
    id,
    authorName: typeof raw.authorName === 'string' ? raw.authorName : 'Guest',
    rating: typeof raw.rating === 'number' ? Math.min(5, Math.max(1, raw.rating)) : 5,
    text: typeof raw.text === 'string' ? raw.text : '',
    createdAt: typeof raw.createdAt === 'string' ? raw.createdAt : new Date().toISOString(),
  }
}

export async function listReviews(): Promise<Review[]> {
  const data = await publicRequest<unknown>('GET', '/api/review')
  return unwrapList(data)
    .map(parseReview)
    .filter((x): x is Review => x !== null)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export async function createReview(payload: ReviewPayload): Promise<Review> {
  const data = await publicRequest<unknown>('POST', '/api/review', payload)
  const one = parseReview(data)
  if (!one) throw new Error('Invalid create review response')
  return one
}
