import { useMemo } from 'react'
import type { AllergenDto } from '../../../api/admin/allergen'

type Props = {
  allergens: AllergenDto[]
  selected: string[]
  onChange: (selected: string[]) => void
  disabled?: boolean
}

export function parseProductAllergens(raw: string, catalog: AllergenDto[]): string[] {
  if (!raw.trim()) return []
  const tokens = new Set(raw.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean))
  return catalog.filter((a) => tokens.has(a.name.toLowerCase())).map((a) => a.name)
}

export function serializeProductAllergens(names: string[]): string {
  return names.join(', ')
}

export function AllergenPillPicker({ allergens, selected, onChange, disabled = false }: Props) {
  const selectedKeys = useMemo(
    () => new Set(selected.map((name) => name.toLowerCase())),
    [selected],
  )

  function toggle(name: string) {
    if (disabled) return
    const key = name.toLowerCase()
    if (selectedKeys.has(key)) {
      onChange(selected.filter((item) => item.toLowerCase() !== key))
    } else {
      onChange([...selected, name])
    }
  }

  if (allergens.length === 0) {
    return (
      <p className="crm-pill-picker__empty">
        No allergens in catalog. Add them under Catalog → Allergens.
      </p>
    )
  }

  return (
    <div className="crm-pill-list" role="group" aria-label="Allergens">
      {allergens.map((allergen) => {
        const isSelected = selectedKeys.has(allergen.name.toLowerCase())
        return (
          <button
            key={allergen.id}
            type="button"
            className={`crm-pill${isSelected ? ' is-selected' : ''}`}
            aria-pressed={isSelected}
            disabled={disabled}
            onClick={() => toggle(allergen.name)}
          >
            {allergen.name}
          </button>
        )
      })}
    </div>
  )
}
