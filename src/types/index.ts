export type Lang = 'ro' | 'ru' | 'en'

export type Localized = Record<Lang, string>

export type MenuCategory =
  | 'pizza'
  | 'pinsa'
  | 'antipasti'
  | 'pasta'
  | 'dolci'
  | 'drinks'

export type MenuProduct = {
  id: string
  category: MenuCategory
  name: Localized
  description: Localized
  price: number
  image: string
  featured?: boolean
}

export type CartLine = {
  productId: string
  qty: number
}

export type CustomPizzaLine = {
  id: string
  label: string
  price: number
  qty: number
  doughId: string
  sauceId: string
  toppingIds: string[]
}
