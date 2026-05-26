import { listCategories } from './category'
import { listProductsByCategory } from './product'
import type { Product } from './types'

export async function fetchProductsByIds(ids: number[]): Promise<Map<number, Product>> {
  const unique = [...new Set(ids)]
  if (unique.length === 0) return new Map()

  const categories = await listCategories()
  const lists = await Promise.all(categories.map((c) => listProductsByCategory(c.id)))
  const map = new Map<number, Product>()
  for (const list of lists) {
    for (const product of list) {
      if (unique.includes(product.id)) map.set(product.id, product)
    }
  }
  return map
}
