import type { ReactNode } from 'react'

type Props = {
  title: string
  searchPlaceholder?: string
  query?: string
  onQueryChange?: (value: string) => void
  onAdd?: () => void
  addLabel?: string
  onRefresh?: () => void
  loading?: boolean
  extra?: ReactNode
}

export function AdminPageHeader({
  title,
  searchPlaceholder = 'Search…',
  query,
  onQueryChange,
  onAdd,
  addLabel = '+ Add',
  onRefresh,
  loading = false,
  extra,
}: Props) {
  const hasToolbar = onQueryChange !== undefined || onAdd || onRefresh || extra

  return (
    <header className="crm-section__head">
      <h2 className="crm-section__title">{title}</h2>
      {hasToolbar && (
        <div className="crm-toolbar">
          {onQueryChange !== undefined && (
            <input
              className="crm-search"
              placeholder={searchPlaceholder}
              value={query ?? ''}
              onChange={(e) => onQueryChange(e.target.value)}
            />
          )}
          {extra}
          {onAdd && (
            <button className="btn btn--primary" type="button" onClick={onAdd} disabled={loading}>
              {addLabel}
            </button>
          )}
          {onRefresh && (
            <button className="btn btn--ghost" type="button" onClick={onRefresh} disabled={loading}>
              Refresh
            </button>
          )}
        </div>
      )}
    </header>
  )
}
