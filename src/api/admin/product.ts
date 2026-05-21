import { adminRequest, isRecord, parseId, unwrapList } from './http'
import type { ProductCreatePayload, ProductDto, ProductListDto, ProductUpdatePayload } from './types'
import { parseCategory } from './category'

export type { ProductListDto, ProductDto, ProductCreatePayload, ProductUpdatePayload }

function parseProductListItem(raw: unknown): ProductListDto | null {
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

function parseProduct(raw: unknown): ProductDto | null {
  const base = parseProductListItem(raw)
  if (!base || !isRecord(raw)) return null
  const category = raw.category !== undefined ? parseCategory(raw.category) : undefined
  return { ...base, category: category ?? undefined }
}

function parseProductList(raw: unknown): ProductListDto[] {
  return unwrapList(raw).map(parseProductListItem).filter((x): x is ProductListDto => x !== null)
}

const BASE = '/api/admin/product'

export async function listProducts(categoryId?: number): Promise<ProductListDto[]> {
  const data = await adminRequest<unknown>('GET', BASE, undefined, { categoryId })
  return parseProductList(data)
}

export async function getProduct(id: number): Promise<ProductDto> {
  const data = await adminRequest<unknown>('GET', `${BASE}/${id}`)
  const one = parseProduct(data)
  if (!one) throw new Error('Invalid product response')
  return one
}

export async function createProduct(payload: ProductCreatePayload): Promise<ProductDto> {
  const data = await adminRequest<unknown>('POST', BASE, payload)
  const one = parseProduct(data)
  if (!one) throw new Error('Invalid create product response')
  return one
}

export async function updateProduct(id: number, payload: ProductUpdatePayload): Promise<ProductDto> {
  const data = await adminRequest<unknown>('PUT', `${BASE}/${id}`, payload)
  const one = parseProduct(data)
  if (!one) throw new Error('Invalid update product response')
  return one
}

export async function deleteProduct(id: number): Promise<void> {
  await adminRequest<void>('DELETE', `${BASE}/${id}`)
}
