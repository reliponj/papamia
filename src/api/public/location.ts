import { isRecord, parseId, publicRequest, unwrapList } from './http'
import type { Location } from './types'

/** Accepts a coordinate as a number or a numeric string (e.g. "47.024"). */
function parseCoord(raw: unknown): number | null {
  if (typeof raw === 'number' && Number.isFinite(raw)) return raw
  if (typeof raw === 'string' && raw.trim() !== '') {
    const n = Number(raw)
    if (Number.isFinite(n)) return n
  }
  return null
}

function asString(raw: unknown): string {
  return typeof raw === 'string' ? raw : ''
}

function parseLocation(raw: unknown): Location | null {
  if (!isRecord(raw)) return null
  const id = parseId(raw.id)
  const name = raw.name
  const latitude = parseCoord(raw.latitude)
  const longitude = parseCoord(raw.longitude)

  // A location needs an id, a name and valid coordinates to show on the map.
  if (id === null || typeof name !== 'string' || latitude === null || longitude === null) {
    return null
  }

  return {
    id,
    name,
    address: asString(raw.address),
    phoneNumber: asString(raw.phoneNumber),
    worktime: asString(raw.worktime),
    latitude,
    longitude,
    imageUrl: asString(raw.imageUrl),
  }
}

export async function listLocations(): Promise<Location[]> {
  const data = await publicRequest<unknown>('GET', '/api/location')
  return unwrapList(data).map(parseLocation).filter((x): x is Location => x !== null)
}
