import { isRecord, parseId, publicRequest, unwrapList } from './http'
import type { Location } from './types'

function parseLocation(raw: unknown): Location | null {
  if (!isRecord(raw)) return null
  const id = parseId(raw.id)
  const name = raw.name
  const address = raw.address
  const phoneNumber = raw.phoneNumber
  const worktime = raw.worktime
  const latitude = raw.latitude
  const longitude = raw.longitude
  const imageUrl = raw.imageUrl
  if (
    id === null ||
    typeof name !== 'string' ||
    typeof address !== 'string' ||
    typeof phoneNumber !== 'string' ||
    typeof worktime !== 'string' ||
    typeof latitude !== 'number' ||
    typeof longitude !== 'number' ||
    typeof imageUrl !== 'string'
  ) {
    return null
  }
  return { id, name, address, phoneNumber, worktime, latitude, longitude, imageUrl }
}

export async function listLocations(): Promise<Location[]> {
  const data = await publicRequest<unknown>('GET', '/api/location')
  return unwrapList(data).map(parseLocation).filter((x): x is Location => x !== null)
}
