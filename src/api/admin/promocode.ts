import { adminRequest, isRecord, parseId, unwrapList } from './http'
import type { PromocodeCreatePayload, PromocodeDto, PromocodeUpdatePayload } from './types'

export type { PromocodeDto, PromocodeCreatePayload, PromocodeUpdatePayload }

function parsePromocode(raw: unknown): PromocodeDto | null {
  if (!isRecord(raw)) return null
  const id = parseId(raw.id)
  const code = raw.code
  const percent = raw.percent
  const expiryDate = raw.expiryDate
  const isActive = raw.isActive
  if (
    id === null ||
    typeof code !== 'string' ||
    typeof percent !== 'number' ||
    typeof expiryDate !== 'string' ||
    typeof isActive !== 'boolean'
  ) {
    return null
  }
  return { id, code, percent, expiryDate, isActive }
}

function parsePromocodeList(raw: unknown): PromocodeDto[] {
  return unwrapList(raw).map(parsePromocode).filter((x): x is PromocodeDto => x !== null)
}

const BASE = '/api/admin/promocode'

export async function listPromocodes(): Promise<PromocodeDto[]> {
  const data = await adminRequest<unknown>('GET', BASE)
  return parsePromocodeList(data)
}

export async function createPromocode(payload: PromocodeCreatePayload): Promise<PromocodeDto> {
  const data = await adminRequest<unknown>('POST', BASE, payload)
  const one = parsePromocode(data)
  if (!one) throw new Error('Invalid create promocode response')
  return one
}

export async function updatePromocode(id: number, payload: PromocodeUpdatePayload): Promise<PromocodeDto> {
  const data = await adminRequest<unknown>('PUT', `${BASE}/${id}`, payload)
  const one = parsePromocode(data)
  if (!one) throw new Error('Invalid update promocode response')
  return one
}

export async function deletePromocode(id: number): Promise<void> {
  await adminRequest<void>('DELETE', `${BASE}/${id}`)
}
