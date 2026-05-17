/** Shared admin DTOs — extend as new resources are wired up. */

export type RoleListDto = {
  id: number
  name: string
  code: string
  description: string
  isSystem: boolean
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
