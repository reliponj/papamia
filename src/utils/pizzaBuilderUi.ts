import { majorToMinor } from '../api/money'

/** Display-only base price (MDL); order total is calculated on the backend. */
export const CUSTOM_PIZZA_BASE_MAJOR = 99
export const CUSTOM_PIZZA_EXTRA_MAJOR = 5

const SWATCHES = [
  '#c8956c',
  '#c0392b',
  '#f0a030',
  '#5a8a3a',
  '#8e44ad',
  '#2980b9',
  '#d35400',
  '#27ae60',
  '#e74c3c',
  '#16a085',
]

export function swatchForId(id: number): string {
  return SWATCHES[Math.abs(id) % SWATCHES.length]
}

/** Client-side estimate for custom pizza (minor units). */
export function estimateCustomPizzaPriceMinor(extraCount: number): number {
  return majorToMinor(CUSTOM_PIZZA_BASE_MAJOR + extraCount * CUSTOM_PIZZA_EXTRA_MAJOR)
}
