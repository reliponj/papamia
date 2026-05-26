import { isRecord, parseId, publicRequest, unwrapList } from './http'
import type { Category } from './types'

function parseCategory(raw: unknown): Category | null {
  if (!isRecord(raw)) return null
  const id = parseId(raw.id)
  const name = raw.name
  const icon = raw.icon
  const description = raw.description
  const sort = raw.sort
  if (
    id === null ||
    typeof name !== 'string' ||
    typeof icon !== 'string' ||
    typeof description !== 'string' ||
    typeof sort !== 'number'
  ) {
    return null
  }
  return { id, name, icon, description, sort }
}

export async function listCategories(): Promise<Category[]> {
  const data = await publicRequest<unknown>('GET', '/api/product/categories')
  return unwrapList(data)
    .map(parseCategory)
    .filter((x): x is Category => x !== null)
    .sort((a, b) => a.sort - b.sort || a.name.localeCompare(b.name))
}
