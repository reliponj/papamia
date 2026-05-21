import { isRecord, parseId, publicRequest, unwrapList } from './http'
import type { Banner } from './types'

function parseBanner(raw: unknown): Banner | null {
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

export async function listBanners(): Promise<Banner[]> {
  const data = await publicRequest<unknown>('GET', '/api/banner')
  return unwrapList(data)
    .map(parseBanner)
    .filter((x): x is Banner => x !== null)
    .sort((a, b) => a.sort - b.sort)
}
