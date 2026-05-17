import { isRecord, publicRequest } from './http'
import type { Promocode } from './types'

function parsePromocode(raw: unknown): Promocode | null {
  if (!isRecord(raw)) return null
  const id = typeof raw.id === 'number' ? raw.id : null
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

export async function validatePromocode(code: string): Promise<Promocode> {
  const data = await publicRequest<unknown>('POST', '/api/promocode/validate', { code })
  const one = parsePromocode(data)
  if (!one) throw new Error('Invalid promocode response')
  return one
}
