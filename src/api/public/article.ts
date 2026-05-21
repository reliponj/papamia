import { isRecord, parseId, publicRequest, unwrapList } from './http'
import type { Article } from './types'

function parseArticle(raw: unknown): Article | null {
  if (!isRecord(raw)) return null
  const id = parseId(raw.id)
  const createdAt = raw.createdAt
  const text = raw.text
  const imageUrl = raw.imageUrl
  if (
    id === null ||
    typeof createdAt !== 'string' ||
    typeof text !== 'string' ||
    typeof imageUrl !== 'string'
  ) {
    return null
  }
  return { id, createdAt, text, imageUrl }
}

export async function listArticles(): Promise<Article[]> {
  const data = await publicRequest<unknown>('GET', '/api/article')
  return unwrapList(data)
    .map(parseArticle)
    .filter((x): x is Article => x !== null)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export async function getArticle(id: number): Promise<Article> {
  const data = await publicRequest<unknown>('GET', `/api/article/${id}`)
  const one = parseArticle(data)
  if (!one) throw new Error('Invalid article response')
  return one
}
