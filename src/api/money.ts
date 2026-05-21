/** API prices are in minor units (bani). Display in MDL. */

export function minorToMajor(minor: number): number {
  return minor / 100
}

export function majorToMinor(major: number): number {
  return Math.round(major * 100)
}

export function formatPriceMdl(minor: number): string {
  return `${minorToMajor(minor).toFixed(2)} MDL`
}
