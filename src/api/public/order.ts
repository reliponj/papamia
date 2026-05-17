import { isRecord, parseId, publicRequest, unwrapList } from './http'
import type { Order, OrderCreatePayload, OrderCustomPizzaItem, OrderLineItem, OrderStatus } from './types'

function parseOrderStatus(raw: unknown): OrderStatus {
  const n = typeof raw === 'number' ? raw : Number(raw)
  if (n === 1 || n === 2 || n === 3) return n
  return 0
}

function parseLineItems(raw: unknown): OrderLineItem[] {
  if (!Array.isArray(raw)) return []
  return raw
    .map((item) => {
      if (!isRecord(item)) return null
      const productId = parseId(item.productId)
      const quantity = item.quantity
      if (productId === null || typeof quantity !== 'number') return null
      return { productId, quantity }
    })
    .filter((x): x is OrderLineItem => x !== null)
}

function parseCustomItems(raw: unknown): OrderCustomPizzaItem[] {
  if (!Array.isArray(raw)) return []
  return raw
    .map((item) => {
      if (!isRecord(item)) return null
      const customPizzaId = parseId(item.customPizzaId)
      const quantity = item.quantity
      if (customPizzaId === null || typeof quantity !== 'number') return null
      return { customPizzaId, quantity }
    })
    .filter((x): x is OrderCustomPizzaItem => x !== null)
}

export function parseOrder(raw: unknown): Order | null {
  if (!isRecord(raw)) return null
  const id = parseId(raw.id)
  const firstName = raw.firstName
  const lastName = raw.lastName
  const phone = raw.phone
  const email = raw.email
  const district = raw.district
  const address = raw.address
  const createdAt = raw.createdAt
  if (
    id === null ||
    typeof firstName !== 'string' ||
    typeof lastName !== 'string' ||
    typeof phone !== 'string' ||
    typeof email !== 'string' ||
    typeof district !== 'string' ||
    typeof address !== 'string' ||
    typeof createdAt !== 'string'
  ) {
    return null
  }
  const userId =
    raw.userId === null || raw.userId === undefined ? null : parseId(raw.userId)
  const promocodeId =
    raw.promocodeId === null || raw.promocodeId === undefined
      ? null
      : parseId(raw.promocodeId)
  const note =
    raw.note === null || raw.note === undefined
      ? null
      : typeof raw.note === 'string'
        ? raw.note
        : null
  const cardProvider =
    raw.cardProvider === null || raw.cardProvider === undefined
      ? null
      : typeof raw.cardProvider === 'number'
        ? raw.cardProvider
        : null

  return {
    id,
    userId,
    promocodeId,
    firstName,
    lastName,
    phone,
    email,
    district,
    address,
    note,
    paymentKind: typeof raw.paymentKind === 'number' ? raw.paymentKind : 0,
    cardProvider,
    createdAt,
    status: parseOrderStatus(raw.status),
    items: parseLineItems(raw.items),
    customPizzaItems: parseCustomItems(raw.customPizzaItems),
  }
}

export async function createOrder(payload: OrderCreatePayload): Promise<Order> {
  const data = await publicRequest<unknown>('POST', '/api/order', payload)
  const one = parseOrder(data)
  if (!one) throw new Error('Invalid create order response')
  return one
}

export async function listMyOrders(): Promise<Order[]> {
  const data = await publicRequest<unknown>('GET', '/api/order')
  return unwrapList(data)
    .map(parseOrder)
    .filter((x): x is Order => x !== null)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}
