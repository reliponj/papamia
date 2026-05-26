import { isRecord, parseId, publicRequest, unwrapList } from './http'
import type { Article, ArticleComment } from './types'

function parseComment(raw: unknown): ArticleComment | null {
  if (!isRecord(raw)) return null
  const id = parseId(raw.id)
  const userId = parseId(raw.userId)
  const text = raw.text
  const createdAt = raw.createdAt
  if (id === null || userId === null || typeof text !== 'string' || typeof createdAt !== 'string') {
    return null
  }
  return { id, userId, text, createdAt }
}

function parseArticle(raw: unknown, withComments = false): Article | null {
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
  const article: Article = { id, title, createdAt, text, imageUrl }
  if (withComments && Array.isArray(raw.comments)) {
    article.comments = raw.comments
      .map(parseComment)
      .filter((x): x is ArticleComment => x !== null)
  } else if (withComments) {
    article.comments = []
  }
  return article
}

export async function listArticles(): Promise<Article[]> {
  const data = await publicRequest<unknown>('GET', '/api/article')
  return unwrapList(data)
    .map((row) => parseArticle(row, false))
    .filter((x): x is Article => x !== null)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export async function getArticle(id: number): Promise<Article> {
  const data = await publicRequest<unknown>('GET', `/api/article/${id}`)
  const one = parseArticle(data, true)
  if (!one) throw new Error('Invalid article response')
  return one
}

export async function postArticleComment(articleId: number, text: string): Promise<ArticleComment> {
  const data = await publicRequest<unknown>('POST', `/api/article/${articleId}/comments`, { text })
  const one = parseComment(data)
  if (!one) throw new Error('Invalid comment response')
  return one
}
