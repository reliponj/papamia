import { majorToMinor } from '../api/money'

/** Display-only base price (MDL); order total is calculated on the backend. */
export const CUSTOM_PIZZA_BASE_MAJOR = 99
export const CUSTOM_PIZZA_EXTRA_MAJOR = 5

const DOUGH_COLORS: Record<string, string> = {
  classic: '#e8c97a',
  thin: '#d4aa55',
  grain: '#b8895a',
}

const DOUGH_CRUST_DARK: Record<string, string> = {
  classic: '#b08830',
  thin: '#a07828',
  grain: '#7a5030',
}

const SAUCE_COLORS: Record<string, string> = {
  tomato: '#c0392b',
  creamy: '#f5e6c8',
  cream: '#f5e6c8',
  pesto: '#4a7c59',
  bbq: '#6b2d0f',
}

const TOPPING_SWATCHES: Record<string, string> = {
  mozzarella: '#fffde7',
  prosciutto: '#e8a090',
  mushrooms: '#9e8472',
  pepperoni: '#b84040',
  olives: '#4a5240',
  bell_pepper: '#d4541a',
  arugula: '#5a8c3a',
  cherry_tomato: '#e03030',
}

const TOPPING_ALIASES: Record<string, string> = {
  mozzarela: 'mozzarella',
  mozzarella: 'mozzarella',
  proshutto: 'prosciutto',
  prosciutto: 'prosciutto',
  peperonni: 'pepperoni',
  pepperoni: 'pepperoni',
  paper: 'bell_pepper',
  pepper: 'bell_pepper',
  bell_pepper: 'bell_pepper',
  rukkola: 'arugula',
  rucola: 'arugula',
  arugula: 'arugula',
  cherry_tomatos: 'cherry_tomato',
  cherry_tomatoes: 'cherry_tomato',
  cherry_tomato: 'cherry_tomato',
  mushrooms: 'mushrooms',
  mushroom: 'mushrooms',
  olives: 'olives',
  olive: 'olives',
}

const DOUGH_ALIASES: Record<string, string> = {
  classic: 'classic',
  clasic: 'classic',
  thin: 'thin',
  grain: 'grain',
  whole: 'grain',
  wholegrain: 'grain',
}

const SAUCE_ALIASES: Record<string, string> = {
  tomato: 'tomato',
  creamy: 'creamy',
  cream: 'creamy',
  pesto: 'pesto',
  bbq: 'bbq',
}

export function normalizeIngredientName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
}

export function resolveToppingVisualKey(name: string): string | null {
  const normalized = normalizeIngredientName(name)
  const key = TOPPING_ALIASES[normalized] ?? normalized
  return key in TOPPING_SWATCHES ? key : null
}

function resolveDoughKey(name: string): string {
  const normalized = normalizeIngredientName(name)
  return DOUGH_ALIASES[normalized] ?? normalized
}

function resolveSauceKey(name: string): string {
  const normalized = normalizeIngredientName(name)
  return SAUCE_ALIASES[normalized] ?? normalized
}

export function doughColorForName(name: string): string {
  const key = resolveDoughKey(name)
  return DOUGH_COLORS[key] ?? '#e8c97a'
}

export function doughCrustDarkForName(name: string): string {
  const key = resolveDoughKey(name)
  return DOUGH_CRUST_DARK[key] ?? '#b08830'
}

export function sauceColorForName(name: string): string {
  const key = resolveSauceKey(name)
  return SAUCE_COLORS[key] ?? '#c0392b'
}

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

export function swatchForIngredient(name: string, type: 0 | 1 | 2, id: number): string {
  if (type === 0) return doughColorForName(name)
  if (type === 1) return sauceColorForName(name)
  const toppingKey = resolveToppingVisualKey(name)
  if (toppingKey) return TOPPING_SWATCHES[toppingKey]
  return SWATCHES[Math.abs(id) % SWATCHES.length]
}

/** Client-side estimate for custom pizza (minor units). */
export function estimateCustomPizzaPriceMinor(extraCount: number): number {
  return majorToMinor(CUSTOM_PIZZA_BASE_MAJOR + extraCount * CUSTOM_PIZZA_EXTRA_MAJOR)
}
