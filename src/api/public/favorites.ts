import { isRecord, parseId, publicRequest, unwrapList } from './http'
import type { Product } from './types'

function parseProduct(raw: unknown): Product | null {
  if (!isRecord(raw)) return null
  const id = parseId(raw.id)
  const name = raw.name
  const description = raw.description
  const price = raw.price
  const imageUrl = raw.imageUrl
  const weight = raw.weight
  const weightType = raw.weightType
  const allergens = raw.allergens
  const isActive = raw.isActive
  const categoryId = parseId(raw.categoryId)
  if (
    id === null ||
    typeof name !== 'string' ||
    typeof description !== 'string' ||
    typeof price !== 'number' ||
    typeof imageUrl !== 'string' ||
    typeof weight !== 'number' ||
    typeof weightType !== 'string' ||
    typeof allergens !== 'string' ||
    typeof isActive !== 'boolean' ||
    categoryId === null
  ) {
    return null
  }
  return {
    id,
    name,
    description,
    price,
    imageUrl,
    weight,
    weightType,
    allergens,
    isActive,
    categoryId,
  }
}

export async function listFavorites(): Promise<Product[]> {
  const data = await publicRequest<unknown>('GET', '/api/user/favorites')
  return unwrapList(data)
    .map(parseProduct)
    .filter((x): x is Product => x !== null && x.isActive)
}

export async function toggleFavorite(productId: number): Promise<boolean> {
  const data = await publicRequest<unknown>('POST', '/api/user/favorites/toggle', { productId })
  if (isRecord(data) && typeof data.isFavorite === 'boolean') return data.isFavorite
  throw new Error('Invalid favorites toggle response')
}
