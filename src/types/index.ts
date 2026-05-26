export type Lang = 'ro' | 'ru' | 'en'

export type CartLineSnapshot = {
  name: string
  price: number
  imageUrl: string
}

export type CartLine = {
  productId: number
  qty: number
  snapshot: CartLineSnapshot
}

export type CustomPizzaPreview = {
  doughName: string
  sauceName: string
  toppingNames: string[]
}

export type CustomPizzaLine = {
  id: string
  customPizzaId: number
  qty: number
  /** Price in minor units (bani) — display estimate; backend calculates order total. */
  price: number
  ingredientIds: number[]
  preview: CustomPizzaPreview
}
