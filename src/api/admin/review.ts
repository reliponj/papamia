import { adminRequest, isRecord, parseId, unwrapList } from './http'
import type { ReviewDto, ReviewUpdatePayload } from './types'

export type { ReviewDto, ReviewUpdatePayload }

function parseReview(raw: unknown): ReviewDto | null {
  if (!isRecord(raw)) return null
  const id = parseId(raw.id)
  const authorName = raw.authorName
  const rating = raw.rating
  const text = raw.text
  const createdAt = raw.createdAt
  const isHidden = raw.isHidden
  if (
    id === null ||
    typeof authorName !== 'string' ||
    typeof rating !== 'number' ||
    typeof text !== 'string' ||
    typeof createdAt !== 'string' ||
    typeof isHidden !== 'boolean'
  ) {
    return null
  }
  const userId = raw.userId === null || raw.userId === undefined ? null : parseId(raw.userId)
  return { id, userId, authorName, rating, text, createdAt, isHidden }
}

function parseReviewList(raw: unknown): ReviewDto[] {
  return unwrapList(raw).map(parseReview).filter((x): x is ReviewDto => x !== null)
}

const BASE = '/api/admin/review'

export async function listReviews(): Promise<ReviewDto[]> {
  const data = await adminRequest<unknown>('GET', BASE)
  return parseReviewList(data)
}

export async function getReview(id: number): Promise<ReviewDto> {
  const data = await adminRequest<unknown>('GET', `${BASE}/${id}`)
  const one = parseReview(data)
  if (!one) throw new Error('Invalid review response')
  return one
}

export async function updateReview(id: number, payload: ReviewUpdatePayload): Promise<ReviewDto> {
  const data = await adminRequest<unknown>('PUT', `${BASE}/${id}`, payload)
  const one = parseReview(data)
  if (!one) throw new Error('Invalid update review response')
  return one
}

export async function deleteReview(id: number): Promise<void> {
  await adminRequest<void>('DELETE', `${BASE}/${id}`)
}

export async function hideReview(id: number): Promise<ReviewDto> {
  const data = await adminRequest<unknown>('POST', `${BASE}/${id}/hide`)
  const one = parseReview(data)
  if (!one) throw new Error('Invalid hide review response')
  return one
}

export async function showReview(id: number): Promise<ReviewDto> {
  const data = await adminRequest<unknown>('POST', `${BASE}/${id}/show`)
  const one = parseReview(data)
  if (!one) throw new Error('Invalid show review response')
  return one
}
