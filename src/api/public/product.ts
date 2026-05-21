import { isRecord, parseId, publicRequest, unwrapList } from './http'
import type { Product } from './types'

export type ProductListQuery = {
  allergenExclude?: number[]
  sortBy?: 'price' | 'name'
  sortDir?: 'asc' | 'desc'
}

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

export async function listProductsByCategory(
  categoryId: number,
  query: ProductListQuery = {},
): Promise<Product[]> {
  const params: Record<string, string | number | number[] | undefined> = {}
  if (query.allergenExclude?.length) params.allergenExclude = query.allergenExclude
  if (query.sortBy) params.sortBy = query.sortBy
  if (query.sortDir) params.sortDir = query.sortDir

  const data = await publicRequest<unknown>(
    'GET',
    `/api/product/category/${categoryId}`,
    undefined,
    params,
  )
  return unwrapList(data).map(parseProduct).filter((x): x is Product => x !== null && x.isActive)
}
