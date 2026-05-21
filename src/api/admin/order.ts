import { adminRequest, isRecord, parseId, unwrapList } from './http'
import type {
  OrderCreatePayload,
  OrderCustomPizzaItem,
  OrderDto,
  OrderLineItem,
  OrderStatus,
  OrderUpdatePayload,
} from './types'

export type { OrderDto, OrderCreatePayload, OrderUpdatePayload, OrderStatus }

function parseOrderStatus(raw: unknown): OrderStatus {
  const n = typeof raw === 'number' ? raw : Number(raw)
  if (n === 0 || n === 1 || n === 2 || n === 3) return n
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

function parseCustomPizzaItems(raw: unknown): OrderCustomPizzaItem[] {
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

export function parseOrder(raw: unknown): OrderDto | null {
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
    customPizzaItems: parseCustomPizzaItems(raw.customPizzaItems),
  }
}

function parseOrderList(raw: unknown): OrderDto[] {
  return unwrapList(raw).map(parseOrder).filter((x): x is OrderDto => x !== null)
}

const BASE = '/api/admin/order'

export async function listOrders(): Promise<OrderDto[]> {
  const data = await adminRequest<unknown>('GET', BASE)
  return parseOrderList(data)
}

export async function getOrder(id: number): Promise<OrderDto> {
  const data = await adminRequest<unknown>('GET', `${BASE}/${id}`)
  const one = parseOrder(data)
  if (!one) throw new Error('Invalid order response')
  return one
}

export async function createOrder(payload: OrderCreatePayload): Promise<OrderDto> {
  const data = await adminRequest<unknown>('POST', BASE, payload)
  const one = parseOrder(data)
  if (!one) throw new Error('Invalid create order response')
  return one
}

export async function updateOrder(id: number, payload: OrderUpdatePayload): Promise<OrderDto> {
  const data = await adminRequest<unknown>('PUT', `${BASE}/${id}`, payload)
  const one = parseOrder(data)
  if (!one) throw new Error('Invalid update order response')
  return one
}

export async function deleteOrder(id: number): Promise<void> {
  await adminRequest<void>('DELETE', `${BASE}/${id}`)
}
