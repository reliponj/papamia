import type { LocationPayload } from '../../../api/admin/types'

export function validateLocationPayload(payload: LocationPayload): string | null {
  if (payload.name.length < 2 || payload.name.length > 50) {
    return 'Name must be 2–50 characters'
  }
  if (payload.address.length < 5 || payload.address.length > 100) {
    return 'Address must be 5–100 characters'
  }
  if (payload.phoneNumber.length < 5 || payload.phoneNumber.length > 20) {
    return 'Phone must be 5–20 characters'
  }
  if (payload.worktime.length < 5 || payload.worktime.length > 100) {
    return 'Work time must be 5–100 characters'
  }
  if (payload.latitude < -90 || payload.latitude > 90) {
    return 'Latitude must be between -90 and 90'
  }
  if (payload.longitude < -180 || payload.longitude > 180) {
    return 'Longitude must be between -180 and 180'
  }
  if (!payload.imageUrl.trim()) {
    return 'Image URL is required'
  }
  return null
}
