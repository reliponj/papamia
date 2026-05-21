import { useMemo } from 'react'
import type { ReactNode } from 'react'
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'

export type AdminTableColumn<T> = {
  key: string
  header: string
  render: (row: T, index: number) => ReactNode
  className?: string
}

type SortableConfig<T> = {
  onReorder: (rows: T[]) => void | Promise<void>
  disabled?: boolean
  disabledHint?: string
}

type Props<T> = {
  columns: AdminTableColumn<T>[]
  rows: T[]
  rowKey: (row: T) => string | number
  loading?: boolean
  emptyMessage?: string
  actions?: (row: T) => ReactNode
  sortable?: SortableConfig<T>
}

function SortableRow({
  id,
  children,
  dragDisabled,
}: {
  id: string | number
  children: (props: {
    setNodeRef: (node: HTMLElement | null) => void
    style: React.CSSProperties
    dragHandle: ReactNode
    isDragging: boolean
  }) => ReactNode
  dragDisabled?: boolean
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: dragDisabled })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const dragHandle = dragDisabled ? null : (
    <button
      type="button"
      ref={setActivatorNodeRef}
      className="crm-table__drag-handle"
      aria-label="Drag to reorder"
      {...attributes}
      {...listeners}
    >
      <GripVertical size={16} strokeWidth={1.75} aria-hidden />
    </button>
  )

  return <>{children({ setNodeRef, style, dragHandle, isDragging })}</>
}

function TableBody<T>({
  columns,
  rows,
  rowKey,
  actions,
  sortable,
}: Props<T>) {
  const sortableIds = useMemo(() => rows.map((row) => String(rowKey(row))), [rows, rowKey])

  const rowCells = (row: T, rowIndex: number, dragHandle: ReactNode | null) => (
    <>
      {sortable && <td className="crm-table__col-drag">{dragHandle}</td>}
      {columns.map((col) => (
        <td key={col.key} className={col.className}>
          {col.render(row, rowIndex)}
        </td>
      ))}
      {actions && (
        <td className="crm-table__col-actions">
          <div className="crm-table__actions">{actions(row)}</div>
        </td>
      )}
    </>
  )

  if (!sortable || sortable.disabled) {
    return (
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowKey(row)}>{rowCells(row, rowIndex, null)}</tr>
        ))}
      </tbody>
    )
  }

  return (
    <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
      <tbody>
        {rows.map((row, rowIndex) => {
          const id = String(rowKey(row))
          return (
            <SortableRow key={id} id={id}>
              {({ setNodeRef, style, dragHandle, isDragging }) => (
                <tr
                  ref={setNodeRef}
                  style={style}
                  className={isDragging ? 'is-dragging' : undefined}
                >
                  {rowCells(row, rowIndex, dragHandle)}
                </tr>
              )}
            </SortableRow>
          )
        })}
      </tbody>
    </SortableContext>
  )
}

export function AdminDataTable<T>({
  columns,
  rows,
  rowKey,
  loading = false,
  emptyMessage = 'No records found.',
  actions,
  sortable,
}: Props<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function handleDragEnd(event: DragEndEvent) {
    if (!sortable || sortable.disabled) return
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = rows.findIndex((row) => String(rowKey(row)) === active.id)
    const newIndex = rows.findIndex((row) => String(rowKey(row)) === over.id)
    if (oldIndex < 0 || newIndex < 0) return

    void sortable.onReorder(arrayMove(rows, oldIndex, newIndex))
  }

  if (loading) {
    return <p className="admin-table-state">Loading…</p>
  }

  if (rows.length === 0) {
    return <p className="admin-table-state">{emptyMessage}</p>
  }

  const table = (
    <div className="crm-table-wrap">
      {sortable?.disabled && sortable.disabledHint && (
        <p className="crm-table__sort-hint">{sortable.disabledHint}</p>
      )}
      <table className="crm-table">
        <thead>
          <tr>
            {sortable && <th className="crm-table__col-drag" scope="col" aria-label="Reorder" />}
            {columns.map((col) => (
              <th key={col.key} scope="col">
                {col.header}
              </th>
            ))}
            {actions && (
              <th className="crm-table__col-actions" scope="col">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <TableBody
          columns={columns}
          rows={rows}
          rowKey={rowKey}
          actions={actions}
          sortable={sortable}
        />
      </table>
    </div>
  )

  if (!sortable || sortable.disabled) {
    return table
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      {table}
    </DndContext>
  )
}
