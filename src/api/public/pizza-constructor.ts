import { isRecord, parseId, publicRequest, unwrapList } from './http'
import type { CustomPizzaDto, Ingredient, IngredientType } from './types'

function parseIngredientType(raw: unknown): IngredientType {
  const n = typeof raw === 'number' ? raw : Number(raw)
  if (n === 1) return 1
  if (n === 2) return 2
  return 0
}

function parseIngredient(raw: unknown): Ingredient | null {
  if (!isRecord(raw)) return null
  const id = parseId(raw.id)
  const name = raw.name
  if (id === null || typeof name !== 'string') return null
  return { id, name, type: parseIngredientType(raw.type) }
}

function parseCustomPizza(raw: unknown): CustomPizzaDto | null {
  if (!isRecord(raw)) return null
  const id = parseId(raw.id)
  if (id === null) return null
  const ids = unwrapList(raw.ingridientIds ?? raw.ingredientIds)
    .map(parseId)
    .filter((x): x is number => x !== null)
  return { id, ingridientIds: ids }
}

export async function listIngredients(): Promise<Ingredient[]> {
  const data = await publicRequest<unknown>('GET', '/api/pizza-constructor/ingridients')
  return unwrapList(data).map(parseIngredient).filter((x): x is Ingredient => x !== null)
}

export async function createCustomPizza(ingridientIds: number[]): Promise<CustomPizzaDto> {
  const data = await publicRequest<unknown>('POST', '/api/pizza-constructor/custom-pizza', {
    ingridientIds,
  })
  const one = parseCustomPizza(data)
  if (!one) throw new Error('Invalid custom pizza response')
  return one
}
