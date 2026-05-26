import { adminRequest, isRecord, parseId, unwrapList } from './http'
import type { ArticleDto, ArticlePayload } from './types'

export type { ArticleDto, ArticlePayload }

function parseArticle(raw: unknown): ArticleDto | null {
  if (!isRecord(raw)) return null
  const id = parseId(raw.id)
  const title = raw.title
  const createdAt = raw.createdAt
  const text = raw.text
  const imageUrl = raw.imageUrl
  if (
    id === null ||
    typeof title !== 'string' ||
    typeof createdAt !== 'string' ||
    typeof text !== 'string' ||
    typeof imageUrl !== 'string'
  ) {
    return null
  }
  return { id, title, createdAt, text, imageUrl }
}

function parseArticleList(raw: unknown): ArticleDto[] {
  return unwrapList(raw).map(parseArticle).filter((x): x is ArticleDto => x !== null)
}

const BASE = '/api/admin/article'

export async function listArticles(): Promise<ArticleDto[]> {
  const data = await adminRequest<unknown>('GET', BASE)
  return parseArticleList(data)
}

export async function getArticle(id: number): Promise<ArticleDto> {
  const data = await adminRequest<unknown>('GET', `${BASE}/${id}`)
  const one = parseArticle(data)
  if (!one) throw new Error('Invalid article response')
  return one
}

export async function createArticle(payload: ArticlePayload): Promise<ArticleDto> {
  const data = await adminRequest<unknown>('POST', BASE, payload)
  const one = parseArticle(data)
  if (!one) throw new Error('Invalid create article response')
  return one
}

export async function updateArticle(id: number, payload: ArticlePayload): Promise<ArticleDto> {
  const data = await adminRequest<unknown>('PUT', `${BASE}/${id}`, payload)
  const one = parseArticle(data)
  if (!one) throw new Error('Invalid update article response')
  return one
}

export async function deleteArticle(id: number): Promise<void> {
  await adminRequest<void>('DELETE', `${BASE}/${id}`)
}
