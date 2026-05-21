import { isRecord, parseId, publicRequest, unwrapList } from './http'
import type { Allergen } from './types'

function parseAllergen(raw: unknown): Allergen | null {
  if (!isRecord(raw)) return null
  const id = parseId(raw.id)
  const name = raw.name
  if (id === null || typeof name !== 'string') return null
  return { id, name }
}

export async function listAllergens(): Promise<Allergen[]> {
  const data = await publicRequest<unknown>('GET', '/api/allergen')
  return unwrapList(data)
    .map(parseAllergen)
    .filter((x): x is Allergen => x !== null)
    .sort((a, b) => a.name.localeCompare(b.name))
}
