import { adminRequest, isRecord, parseId, unwrapList } from './http'
import type { AllergenDto, AllergenPayload } from './types'

export type { AllergenDto, AllergenPayload }

function parseAllergen(raw: unknown): AllergenDto | null {
  if (!isRecord(raw)) return null
  const id = parseId(raw.id)
  const name = raw.name
  if (id === null || typeof name !== 'string') return null
  return { id, name }
}

function parseAllergenList(raw: unknown): AllergenDto[] {
  return unwrapList(raw).map(parseAllergen).filter((x): x is AllergenDto => x !== null)
}

const BASE = '/api/admin/allergen'

export async function listAllergens(): Promise<AllergenDto[]> {
  const data = await adminRequest<unknown>('GET', BASE)
  return parseAllergenList(data)
}

export async function getAllergen(id: number): Promise<AllergenDto> {
  const data = await adminRequest<unknown>('GET', `${BASE}/${id}`)
  const one = parseAllergen(data)
  if (!one) throw new Error('Invalid allergen response')
  return one
}

export async function createAllergen(payload: AllergenPayload): Promise<AllergenDto> {
  const data = await adminRequest<unknown>('POST', BASE, { name: payload.name })
  const one = parseAllergen(data)
  if (!one) throw new Error('Invalid create allergen response')
  return one
}

export async function updateAllergen(id: number, payload: AllergenPayload): Promise<AllergenDto> {
  const data = await adminRequest<unknown>('PUT', `${BASE}/${id}`, { name: payload.name })
  const one = parseAllergen(data)
  if (!one) throw new Error('Invalid update allergen response')
  return one
}

export async function deleteAllergen(id: number): Promise<void> {
  await adminRequest<void>('DELETE', `${BASE}/${id}`)
}
