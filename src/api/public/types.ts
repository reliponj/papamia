export type Category = {
  id: number
  name: string
  icon: string
  description: string
  sort: number
}

export type Product = {
  id: number
  name: string
  description: string
  price: number
  imageUrl: string
  weight: number
  weightType: string
  allergens: string
  isActive: boolean
  categoryId: number
}

export type Allergen = {
  id: number
  name: string
}

export type IngredientType = 0 | 1 | 2

export type Ingredient = {
  id: number
  name: string
  type: IngredientType
  price: number
  isActive: boolean
}

export type CustomPizzaDto = {
  id: number
  totalPrice: number
  ingridientIds: number[]
}

export type ArticleComment = {
  id: number
  userId: number
  text: string
  createdAt: string
}

export type Banner = {
  id: number
  imageUrl: string
  link: string
  sort: number
}

export type Article = {
  id: number
  title: string
  createdAt: string
  text: string
  imageUrl: string
  comments?: ArticleComment[]
}

export type FavoriteToggleResult = {
  isFavorite: boolean
}

export type Location = {
  id: number
  name: string
  address: string
  phoneNumber: string
  worktime: string
  latitude: number
  longitude: number
  imageUrl: string
}

export type OrderStatus = 0 | 1 | 2 | 3

export type OrderLineItem = {
  productId: number
  quantity: number
}

export type OrderCustomPizzaItem = {
  customPizzaId: number
  quantity: number
}

export type Order = {
  id: number
  userId: number | null
  promocodeId: number | null
  firstName: string
  lastName: string
  phone: string
  email: string
  district: string
  address: string
  note: string | null
  paymentKind: number
  cardProvider: number | null
  createdAt: string
  status: OrderStatus
  items: OrderLineItem[]
  customPizzaItems: OrderCustomPizzaItem[]
}

export type OrderCreatePayload = {
  firstName: string
  lastName: string
  phone: string
  email: string
  district: string
  address: string
  note: string | null
  promocodeId: number | null
  paymentKind: number
  cardProvider: number | null
  items: OrderLineItem[]
  customPizzaItems: OrderCustomPizzaItem[]
}

export type Promocode = {
  id: number
  code: string
  percent: number
  expiryDate: string
  isActive: boolean
}

export type Review = {
  id: number
  authorName: string
  rating: number
  text: string
  createdAt: string
}

export type ReviewPayload = {
  rating: number
  text: string
}
