/** Shared admin DTOs — extend as new resources are wired up. */

export type RoleListDto = {
  id: number
  name: string
  code: string
  description: string
  isSystem: boolean
}

export type PermissionDto = {
  id: number
  name: string
  code: string
  description: string
}

export type RoleDto = RoleListDto & {
  permissions?: PermissionDto[]
}

export type RolePayload = {
  name: string
  code: string
  description: string
  isSystem: boolean
  permissionIds: number[]
}

export type UserDto = {
  id: number
  username: string
  email: string
  lastLogin: string | null
  lastIp: string | null
}

export type UserCreatePayload = {
  username: string
  password: string
  email: string
}

export type UserUpdatePayload = {
  username: string
  email: string
}

export type PermissionGroupDto = {
  id: number
  name: string
  code: string
  description: string
  permissions: PermissionDto[]
}

export type PermissionGroupCreatePayload = {
  name: string
  code: string
  description: string
}

export type PermissionGroupUpdatePayload = PermissionGroupCreatePayload & {
  permissionIds: number[]
}

export type PermissionPayload = {
  name: string
  code: string
  description: string
}

export type AllergenDto = {
  id: number
  name: string
}

export type AllergenPayload = {
  name: string
}

export type BannerDto = {
  id: number
  imageUrl: string
  link: string
  sort: number
}

export type BannerPayload = {
  imageUrl: string
  link: string
  sort: number
}

export type ArticleDto = {
  id: number
  title: string
  createdAt: string
  text: string
  imageUrl: string
}

export type ArticlePayload = {
  title: string
  text: string
  imageUrl: string
}

export type LocationDto = {
  id: number
  name: string
  address: string
  phoneNumber: string
  worktime: string
  latitude: number
  longitude: number
  imageUrl: string
}

export type LocationPayload = {
  name: string
  address: string
  phoneNumber: string
  worktime: string
  latitude: number
  longitude: number
  imageUrl: string
}

export type PromocodeDto = {
  id: number
  code: string
  percent: number
  expiryDate: string
  isActive: boolean
}

export type PromocodeCreatePayload = {
  code: string
  percent: number
  expiryDate: string
}

export type PromocodeUpdatePayload = PromocodeCreatePayload & {
  isActive: boolean
}

export type IngridientType = 0 | 1 | 2

export type IngridientDto = {
  id: number
  name: string
  type: IngridientType
  price: number
  isActive: boolean
}

export type IngridientPayload = {
  name: string
  type: IngridientType
  price: number
  isActive: boolean
}

export type CategoryDto = {
  id: number
  name: string
  icon: string
  description: string
  sort: number
}

export type CategoryPayload = {
  name: string
  icon: string
  description: string
  sort: number
}

export type ProductListDto = {
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

export type ProductDto = ProductListDto & {
  category?: CategoryDto
}

export type ProductCreatePayload = {
  name: string
  description: string
  price: number
  imageUrl: string
  weight: number
  weightType: string
  allergens: string
  categoryId: number
}

export type ProductUpdatePayload = ProductCreatePayload & {
  isActive: boolean
}

export type ReviewDto = {
  id: number
  userId: number | null
  authorName: string
  rating: number
  text: string
  createdAt: string
  isHidden: boolean
}

export type ReviewUpdatePayload = {
  authorName: string
  rating: number
  text: string
  isHidden: boolean
}

export type OrderStatus = 0 | 1 | 2 | 3

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  0: 'New',
  1: 'Processing',
  2: 'Done',
  3: 'Cancelled',
}

export type OrderLineItem = {
  productId: number
  quantity: number
}

export type OrderCustomPizzaItem = {
  customPizzaId: number
  quantity: number
}

export type OrderDto = {
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

export type OrderUpdatePayload = OrderCreatePayload & {
  status: OrderStatus
}
