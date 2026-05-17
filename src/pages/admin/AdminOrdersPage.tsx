import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { deleteOrder, listOrders, type OrderDto } from '../../api/admin/order'
import { ORDER_STATUS_LABELS, type OrderStatus } from '../../api/admin/types'
import { AdminIconButton } from './AdminIconButton'
import { AdminPageHeader } from './_shared/AdminPageHeader'
import { AdminDataTable } from './_shared/AdminDataTable'
import { AdminAlert } from './_shared/AdminAlert'
import { AdminConfirmModal } from './_shared/AdminConfirmModal'
import { useCrudResource } from './_shared/useCrudResource'

const PAYMENT_LABELS: Record<number, string> = {
  0: 'Cash',
  1: 'Card',
}

const ALL_STATUSES = '' as const

function itemCount(order: OrderDto): number {
  const fromProducts = order.items.reduce((sum, i) => sum + i.quantity, 0)
  const fromPizza = order.customPizzaItems.reduce((sum, i) => sum + i.quantity, 0)
  return fromProducts + fromPizza
}

function customerLabel(order: OrderDto): string {
  return `${order.firstName} ${order.lastName}`.trim()
}

export function AdminOrdersPage() {
  const navigate = useNavigate()
  const crud = useCrudResource<OrderDto>({
    loadItems: listOrders,
    getId: (row) => row.id,
    sortItems: (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    filterItem: (row, q) => {
      const hay = `${row.firstName} ${row.lastName} ${row.phone} ${row.email}`.toLowerCase()
      return hay.includes(q)
    },
  })

  const [statusFilter, setStatusFilter] = useState<OrderStatus | typeof ALL_STATUSES>(ALL_STATUSES)
  const [deleteTarget, setDeleteTarget] = useState<OrderDto | null>(null)

  const displayRows = useMemo(() => {
    if (statusFilter === ALL_STATUSES) return crud.filteredItems
    return crud.filteredItems.filter((row) => row.status === statusFilter)
  }, [crud.filteredItems, statusFilter])

  async function confirmDelete() {
    if (!deleteTarget) return
    const target = deleteTarget
    await crud.runMutation(async () => {
      await deleteOrder(target.id)
      crud.removeItemById(target.id)
      setDeleteTarget(null)
    }, 'Delete failed')
  }

  return (
    <section className="crm-section">
      <AdminPageHeader
        title="Orders"
        description="View and manage customer orders."
        searchPlaceholder="Search by name, phone, or email"
        query={crud.query}
        onQueryChange={crud.setQuery}
        onAdd={() => navigate('/admin/orders/new')}
        onRefresh={() => void crud.reload()}
        loading={crud.loading}
        extra={
          <label className="admin-field-inline">
            <span>Status</span>
            <select
              value={statusFilter === ALL_STATUSES ? '' : String(statusFilter)}
              onChange={(e) => {
                const v = e.target.value
                setStatusFilter(v === '' ? ALL_STATUSES : (Number(v) as OrderStatus))
              }}
            >
              <option value="">All</option>
              {([0, 1, 2, 3] as const).map((s) => (
                <option key={s} value={s}>
                  {ORDER_STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </label>
        }
      />

      {crud.error && <AdminAlert message={crud.error} />}

      <AdminDataTable
        columns={[
          { key: 'id', header: 'ID', render: (row) => row.id },
          {
            key: 'created',
            header: 'Created',
            render: (row) => new Date(row.createdAt).toLocaleString(),
          },
          { key: 'customer', header: 'Customer', render: (row) => customerLabel(row) },
          { key: 'phone', header: 'Phone', render: (row) => row.phone },
          {
            key: 'items',
            header: 'Qty',
            render: (row) => itemCount(row),
          },
          {
            key: 'payment',
            header: 'Payment',
            render: (row) => PAYMENT_LABELS[row.paymentKind] ?? String(row.paymentKind),
          },
          {
            key: 'status',
            header: 'Status',
            render: (row) => (
              <span className={`crm-badge crm-badge--status-${row.status}`}>
                {ORDER_STATUS_LABELS[row.status]}
              </span>
            ),
          },
        ]}
        rows={displayRows}
        rowKey={(row) => row.id}
        loading={crud.loading}
        emptyMessage="No orders yet."
        actions={(row) => (
          <>
            <Link className="crm-table-link" to={`/admin/orders/${row.id}`}>
              Open
            </Link>
            <AdminIconButton
              label="Delete order"
              className="is-danger"
              onClick={() => setDeleteTarget(row)}
            >
              🗑
            </AdminIconButton>
          </>
        )}
      />

      <AdminConfirmModal
        open={deleteTarget !== null}
        title="Delete order"
        message={
          deleteTarget
            ? `Delete order #${deleteTarget.id} for ${customerLabel(deleteTarget)}?`
            : ''
        }
        confirmLabel="Delete"
        danger
        loading={crud.saving}
        onConfirm={() => void confirmDelete()}
        onCancel={() => setDeleteTarget(null)}
      />
    </section>
  )
}
