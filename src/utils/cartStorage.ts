import type { CartLine, CustomPizzaLine } from '../types'

const CART_COOKIE = 'papamia-cart'
const MAX_AGE_DAYS = 30

export type PersistedCart = {
  lines: CartLine[]
  customLines: CustomPizzaLine[]
}

function setCookie(value: string) {
  const maxAge = MAX_AGE_DAYS * 24 * 60 * 60
  document.cookie = `${CART_COOKIE}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`
}

function deleteCookie() {
  document.cookie = `${CART_COOKIE}=; path=/; max-age=0; SameSite=Lax`
}

function readCookie(): string | null {
  const prefix = `${CART_COOKIE}=`
  for (const part of document.cookie.split(';')) {
    const trimmed = part.trim()
    if (trimmed.startsWith(prefix)) {
      return decodeURIComponent(trimmed.slice(prefix.length))
    }
  }
  return null
}

function isCartLine(value: unknown): value is CartLine {
  if (typeof value !== 'object' || value === null) return false
  const line = value as CartLine
  return (
    typeof line.productId === 'number' &&
    typeof line.qty === 'number' &&
    line.qty > 0 &&
    typeof line.snapshot?.name === 'string' &&
    typeof line.snapshot?.price === 'number' &&
    typeof line.snapshot?.imageUrl === 'string'
  )
}

function isCustomPizzaPreview(value: unknown): value is CustomPizzaLine['preview'] {
  if (typeof value !== 'object' || value === null) return false
  const preview = value as CustomPizzaLine['preview']
  return (
    typeof preview.doughName === 'string' &&
    typeof preview.sauceName === 'string' &&
    Array.isArray(preview.toppingNames) &&
    preview.toppingNames.every((n) => typeof n === 'string')
  )
}

function isCustomPizzaLine(value: unknown): value is CustomPizzaLine {
  if (typeof value !== 'object' || value === null) return false
  const line = value as CustomPizzaLine
  return (
    typeof line.id === 'string' &&
    typeof line.customPizzaId === 'number' &&
    typeof line.qty === 'number' &&
    line.qty > 0 &&
    typeof line.price === 'number' &&
    Array.isArray(line.ingredientIds) &&
    line.ingredientIds.every((id) => typeof id === 'number') &&
    isCustomPizzaPreview(line.preview)
  )
}

export function loadCartFromCookie(): PersistedCart {
  if (typeof document === 'undefined') {
    return { lines: [], customLines: [] }
  }

  try {
    const raw = readCookie()
    if (!raw) return { lines: [], customLines: [] }

    const parsed = JSON.parse(raw) as unknown
    if (typeof parsed !== 'object' || parsed === null) {
      return { lines: [], customLines: [] }
    }

    const data = parsed as Partial<PersistedCart>
    const lines = Array.isArray(data.lines) ? data.lines.filter(isCartLine) : []
    const customLines = Array.isArray(data.customLines)
      ? data.customLines.filter(isCustomPizzaLine)
      : []

    return { lines, customLines }
  } catch {
    return { lines: [], customLines: [] }
  }
}

export function saveCartToCookie(cart: PersistedCart) {
  if (typeof document === 'undefined') return

  if (cart.lines.length === 0 && cart.customLines.length === 0) {
    deleteCookie()
    return
  }

  try {
    setCookie(JSON.stringify(cart))
  } catch {
    // Cookie may exceed size limit — ignore write failure
  }
}
