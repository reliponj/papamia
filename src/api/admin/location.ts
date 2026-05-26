import { adminRequest, isRecord, parseId, unwrapList } from './http'
import type { LocationDto, LocationPayload } from './types'

export type { LocationDto, LocationPayload }

function parseLocation(raw: unknown): LocationDto | null {
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

function parseLocationList(raw: unknown): LocationDto[] {
  return unwrapList(raw).map(parseLocation).filter((x): x is LocationDto => x !== null)
}

const BASE = '/api/admin/location'

export async function listLocations(): Promise<LocationDto[]> {
  const data = await adminRequest<unknown>('GET', BASE)
  return parseLocationList(data)
}

export async function createLocation(payload: LocationPayload): Promise<LocationDto> {
  const data = await adminRequest<unknown>('POST', BASE, payload)
  const one = parseLocation(data)
  if (!one) throw new Error('Invalid create location response')
  return one
}

export async function updateLocation(id: number, payload: LocationPayload): Promise<LocationDto> {
  const data = await adminRequest<unknown>('PUT', `${BASE}/${id}`, payload)
  const one = parseLocation(data)
  if (!one) throw new Error('Invalid update location response')
  return one
}

export async function deleteLocation(id: number): Promise<void> {
  await adminRequest<void>('DELETE', `${BASE}/${id}`)
}
