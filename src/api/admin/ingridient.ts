import { adminRequest, isRecord, parseId, unwrapList } from './http'
import type { IngridientDto, IngridientPayload, IngridientType } from './types'

export type { IngridientDto, IngridientPayload, IngridientType }

function parseIngridientType(raw: unknown): IngridientType | null {
  const n = typeof raw === 'number' ? raw : Number(raw)
  if (n === 0 || n === 1 || n === 2) return n
  return null
}

function parseIngridient(raw: unknown): IngridientDto | null {
  if (!isRecord(raw)) return null
  const id = parseId(raw.id)
  const name = raw.name
  const type = parseIngridientType(raw.type)
  if (id === null || typeof name !== 'string' || type === null) return null
  return { id, name, type }
}

function parseIngridientList(raw: unknown): IngridientDto[] {
  return unwrapList(raw).map(parseIngridient).filter((x): x is IngridientDto => x !== null)
}

const BASE = '/api/admin/ingridient'

export async function listIngridients(): Promise<IngridientDto[]> {
  const data = await adminRequest<unknown>('GET', BASE)
  return parseIngridientList(data)
}

export async function createIngridient(payload: IngridientPayload): Promise<IngridientDto> {
  const data = await adminRequest<unknown>('POST', BASE, payload)
  const one = parseIngridient(data)
  if (!one) throw new Error('Invalid create ingredient response')
  return one
}

export async function updateIngridient(id: number, payload: IngridientPayload): Promise<IngridientDto> {
  const data = await adminRequest<unknown>('PUT', `${BASE}/${id}`, payload)
  const one = parseIngridient(data)
  if (!one) throw new Error('Invalid update ingredient response')
  return one
}

export async function deleteIngridient(id: number): Promise<void> {
  await adminRequest<void>('DELETE', `${BASE}/${id}`)
}
