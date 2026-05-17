import type { ReactNode } from 'react'

type Column<T> = {
  key: string
  header: string
  render: (row: T) => ReactNode
  className?: string
}

type Props<T> = {
  columns: Column<T>[]
  rows: T[]
  rowKey: (row: T) => string | number
  loading?: boolean
  emptyMessage?: string
  actions?: (row: T) => ReactNode
}

export function AdminDataTable<T>({
  columns,
  rows,
  rowKey,
  loading = false,
  emptyMessage = 'No records found.',
  actions,
}: Props<T>) {
  if (loading) {
    return <p className="admin-table-state">Loading…</p>
  }

  if (rows.length === 0) {
    return <p className="admin-table-state">{emptyMessage}</p>
  }

  return (
    <div className="crm-table-wrap">
      <table className="crm-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.header}</th>
            ))}
            {actions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={rowKey(row)}>
              {columns.map((col) => (
                <td key={col.key} className={col.className}>
                  {col.render(row)}
                </td>
              ))}
              {actions && <td className="crm-table__actions">{actions(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
