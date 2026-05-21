import { adminRequest, isRecord, parseId, unwrapList } from './http'
import type { BannerDto, BannerPayload } from './types'

export type { BannerDto, BannerPayload }

function parseBanner(raw: unknown): BannerDto | null {
  if (!isRecord(raw)) return null
  const id = parseId(raw.id)
  const imageUrl = raw.imageUrl
  const link = raw.link
  const sort = raw.sort
  if (
    id === null ||
    typeof imageUrl !== 'string' ||
    typeof link !== 'string' ||
    typeof sort !== 'number'
  ) {
    return null
  }
  return { id, imageUrl, link, sort }
}

function parseBannerList(raw: unknown): BannerDto[] {
  return unwrapList(raw).map(parseBanner).filter((x): x is BannerDto => x !== null)
}

const BASE = '/api/admin/banner'

export async function listBanners(): Promise<BannerDto[]> {
  const data = await adminRequest<unknown>('GET', BASE)
  return parseBannerList(data)
}

export async function getBanner(id: number): Promise<BannerDto> {
  const data = await adminRequest<unknown>('GET', `${BASE}/${id}`)
  const one = parseBanner(data)
  if (!one) throw new Error('Invalid banner response')
  return one
}

export async function createBanner(payload: BannerPayload): Promise<BannerDto> {
  const data = await adminRequest<unknown>('POST', BASE, payload)
  const one = parseBanner(data)
  if (!one) throw new Error('Invalid create banner response')
  return one
}

export async function updateBanner(id: number, payload: BannerPayload): Promise<BannerDto> {
  const data = await adminRequest<unknown>('PUT', `${BASE}/${id}`, payload)
  const one = parseBanner(data)
  if (!one) throw new Error('Invalid update banner response')
  return one
}

export async function deleteBanner(id: number): Promise<void> {
  await adminRequest<void>('DELETE', `${BASE}/${id}`)
}
