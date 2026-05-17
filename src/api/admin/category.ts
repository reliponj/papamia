import { adminRequest, isRecord, parseId, unwrapList } from './http'
import type { CategoryDto, CategoryPayload } from './types'

export type { CategoryDto, CategoryPayload }

export function parseCategory(raw: unknown): CategoryDto | null {
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

function parseCategoryList(raw: unknown): CategoryDto[] {
  return unwrapList(raw).map(parseCategory).filter((x): x is CategoryDto => x !== null)
}

const BASE = '/api/admin/category'

export async function listCategories(): Promise<CategoryDto[]> {
  const data = await adminRequest<unknown>('GET', BASE)
  return parseCategoryList(data)
}

export async function createCategory(payload: CategoryPayload): Promise<CategoryDto> {
  const data = await adminRequest<unknown>('POST', BASE, payload)
  const one = parseCategory(data)
  if (!one) throw new Error('Invalid create category response')
  return one
}

export async function updateCategory(id: number, payload: CategoryPayload): Promise<CategoryDto> {
  const data = await adminRequest<unknown>('PUT', `${BASE}/${id}`, payload)
  const one = parseCategory(data)
  if (!one) throw new Error('Invalid update category response')
  return one
}

export async function deleteCategory(id: number): Promise<void> {
  await adminRequest<void>('DELETE', `${BASE}/${id}`)
}
