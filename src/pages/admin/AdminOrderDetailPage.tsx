import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  createOrder,
  deleteOrder,
  getOrder,
  updateOrder,
  type OrderDto,
} from '../../api/admin/order'
import { listPromocodes } from '../../api/admin/promocode'
import { listProducts } from '../../api/admin/product'
import type {
  OrderCreatePayload,
  OrderCustomPizzaItem,
  OrderLineItem,
  OrderStatus,
  OrderUpdatePayload,
  ProductListDto,
  PromocodeDto,
} from '../../api/admin/types'
import { ORDER_STATUS_LABELS } from '../../api/admin/types'
import { AdminApiError } from '../../api/admin/http'
import { AdminAlert } from './_shared/AdminAlert'
import { AdminConfirmModal } from './_shared/AdminConfirmModal'
import { FormField } from './_shared/FormField'

const PAYMENT_KINDS = [
  { value: 0, label: 'Cash' },
  { value: 1, label: 'Card' },
] as const

const CARD_PROVIDERS = [
  { value: 0, label: 'Visa' },
  { value: 1, label: 'Mastercard' },
  { value: 2, label: 'PayPal' },
] as const

type FormState = {
  firstName: string
  lastName: string
  phone: string
  email: string
  district: string
  address: string
  note: string
  promocodeId: string
  paymentKind: number
  cardProvider: string
  status: OrderStatus
  items: OrderLineItem[]
  customPizzaItems: OrderCustomPizzaItem[]
}

const emptyLine = (): OrderLineItem => ({ productId: 0, quantity: 1 })
const emptyPizza = (): OrderCustomPizzaItem => ({ customPizzaId: 0, quantity: 1 })

const emptyForm = (): FormState => ({
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  district: '',
  address: '',
  note: '',
  promocodeId: '',
  paymentKind: 0,
  cardProvider: '',
  status: 0,
  items: [emptyLine()],
  customPizzaItems: [],
})

function orderToForm(order: OrderDto): FormState {
  return {
    firstName: order.firstName,
    lastName: order.lastName,
    phone: order.phone,
    email: order.email,
    district: order.district,
    address: order.address,
    note: order.note ?? '',
    promocodeId: order.promocodeId !== null ? String(order.promocodeId) : '',
    paymentKind: order.paymentKind,
    cardProvider: order.cardProvider !== null ? String(order.cardProvider) : '',
    status: order.status,
    items: order.items.length > 0 ? order.items.map((i) => ({ ...i })) : [emptyLine()],
    customPizzaItems: order.customPizzaItems.map((i) => ({ ...i })),
  }
}

function formToCreatePayload(form: FormState): OrderCreatePayload {
  return {
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    phone: form.phone.trim(),
    email: form.email.trim(),
    district: form.district.trim(),
    address: form.address.trim(),
    note: form.note.trim() ? form.note.trim() : null,
    promocodeId: form.promocodeId ? Number(form.promocodeId) : null,
    paymentKind: form.paymentKind,
    cardProvider:
      form.paymentKind === 1 && form.cardProvider !== ''
        ? Number(form.cardProvider)
        : null,
    items: form.items.filter((i) => i.productId > 0 && i.quantity > 0),
    customPizzaItems: form.customPizzaItems.filter(
      (i) => i.customPizzaId > 0 && i.quantity > 0
    ),
  }
}

function formToUpdatePayload(form: FormState): OrderUpdatePayload {
  return { ...formToCreatePayload(form), status: form.status }
}

function errorMessage(err: unknown): string {
  if (err instanceof AdminApiError) return err.message
  if (err instanceof Error) return err.message
  return 'Request failed'
}

export function AdminOrderDetailPage() {
  const { id: idParam } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isNew = idParam === 'new'
  const orderId = isNew ? null : idParam ? Number(idParam) : null

  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [products, setProducts] = useState<ProductListDto[]>([])
  const [promocodes, setPromocodes] = useState<PromocodeDto[]>([])
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const [productList, promoList] = await Promise.all([listProducts(), listPromocodes()])
        if (!cancelled) {
          setProducts(productList)
          setPromocodes(promoList)
        }
      } catch {
        /* hints optional */
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (isNew || orderId === null || Number.isNaN(orderId)) {
      if (!isNew) setError('Invalid order id')
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)
    void (async () => {
      try {
        const order = await getOrder(orderId)
        if (!cancelled) setForm(orderToForm(order))
      } catch (err) {
        if (!cancelled) setError(errorMessage(err))
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [isNew, orderId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      if (isNew) {
        const created = await createOrder(formToCreatePayload(form))
        navigate(`/admin/orders/${created.id}`, { replace: true })
      } else if (orderId !== null) {
        await updateOrder(orderId, formToUpdatePayload(form))
        const refreshed = await getOrder(orderId)
        setForm(orderToForm(refreshed))
      }
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (orderId === null) return
    setSaving(true)
    setError(null)
    try {
      await deleteOrder(orderId)
      navigate('/admin/orders', { replace: true })
    } catch (err) {
      setError(errorMessage(err))
      setSaving(false)
      setConfirmDelete(false)
    }
  }

  const productNameById = new Map(products.map((p) => [p.id, p.name]))

  if (loading) {
    return <p className="admin-table-state">Loading order…</p>
  }

  return (
    <section className="crm-section">
      <header className="crm-detail-header">
        <div>
          <Link to="/admin/orders" className="crm-back-link">
            ← Orders
          </Link>
          <h2>{isNew ? 'New order' : `Order #${orderId}`}</h2>
        </div>
        {!isNew && orderId !== null && (
          <button
            type="button"
            className="btn btn--ghost is-danger-text"
            onClick={() => setConfirmDelete(true)}
            disabled={saving}
          >
            Delete
          </button>
        )}
      </header>

      {error && <AdminAlert message={error} />}

      <form className="crm-form crm-form--wide" onSubmit={(e) => void handleSubmit(e)}>
        <div className="crm-form-grid">
          <FormField label="First name">
            <input
              value={form.firstName}
              onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))}
              required
            />
          </FormField>
          <FormField label="Last name">
            <input
              value={form.lastName}
              onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))}
              required
            />
          </FormField>
          <FormField label="Phone">
            <input
              value={form.phone}
              onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
              required
            />
          </FormField>
          <FormField label="Email">
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              required
            />
          </FormField>
          <FormField label="District">
            <input
              value={form.district}
              onChange={(e) => setForm((p) => ({ ...p, district: e.target.value }))}
              required
            />
          </FormField>
          <FormField label="Address">
            <input
              value={form.address}
              onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
              required
            />
          </FormField>
        </div>

        <FormField label="Note">
          <textarea
            rows={2}
            value={form.note}
            onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))}
          />
        </FormField>

        <div className="crm-form-grid">
          <FormField label="Payment">
            <select
              value={form.paymentKind}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  paymentKind: Number(e.target.value),
                  cardProvider: Number(e.target.value) === 1 ? p.cardProvider : '',
                }))
              }
            >
              {PAYMENT_KINDS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </FormField>
          {form.paymentKind === 1 && (
            <FormField label="Card provider">
              <select
                value={form.cardProvider}
                onChange={(e) => setForm((p) => ({ ...p, cardProvider: e.target.value }))}
                required
              >
                <option value="">Select…</option>
                {CARD_PROVIDERS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </FormField>
          )}
          <FormField label="Promocode">
            <select
              value={form.promocodeId}
              onChange={(e) => setForm((p) => ({ ...p, promocodeId: e.target.value }))}
            >
              <option value="">None</option>
              {promocodes.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.code} ({p.percent}%)
                </option>
              ))}
            </select>
          </FormField>
          {!isNew && (
            <FormField label="Status">
              <select
                value={form.status}
                onChange={(e) =>
                  setForm((p) => ({ ...p, status: Number(e.target.value) as OrderStatus }))
                }
              >
                {([0, 1, 2, 3] as const).map((s) => (
                  <option key={s} value={s}>
                    {ORDER_STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
            </FormField>
          )}
        </div>

        <fieldset className="crm-fieldset">
          <legend>Products</legend>
          {form.items.map((line, idx) => (
            <div key={`item-${idx}`} className="crm-line-row">
              <select
                value={line.productId || ''}
                onChange={(e) => {
                  const productId = Number(e.target.value)
                  setForm((p) => {
                    const items = [...p.items]
                    items[idx] = { ...items[idx], productId }
                    return { ...p, items }
                  })
                }}
              >
                <option value="">Product…</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    #{p.id} {p.name}
                  </option>
                ))}
              </select>
              {line.productId > 0 && (
                <span className="crm-line-hint">{productNameById.get(line.productId)}</span>
              )}
              <input
                type="number"
                min={1}
                value={line.quantity}
                onChange={(e) => {
                  const quantity = Number(e.target.value)
                  setForm((p) => {
                    const items = [...p.items]
                    items[idx] = { ...items[idx], quantity }
                    return { ...p, items }
                  })
                }}
              />
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={() =>
                  setForm((p) => ({ ...p, items: p.items.filter((_, i) => i !== idx) }))
                }
                disabled={form.items.length <= 1}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            onClick={() => setForm((p) => ({ ...p, items: [...p.items, emptyLine()] }))}
          >
            + Add product line
          </button>
        </fieldset>

        <fieldset className="crm-fieldset">
          <legend>Custom pizzas</legend>
          {form.customPizzaItems.length === 0 && (
            <p className="admin-table-state">No custom pizza lines.</p>
          )}
          {form.customPizzaItems.map((line, idx) => (
            <div key={`pizza-${idx}`} className="crm-line-row">
              <input
                type="number"
                min={1}
                placeholder="Custom pizza ID"
                value={line.customPizzaId || ''}
                onChange={(e) => {
                  const customPizzaId = Number(e.target.value)
                  setForm((p) => {
                    const customPizzaItems = [...p.customPizzaItems]
                    customPizzaItems[idx] = { ...customPizzaItems[idx], customPizzaId }
                    return { ...p, customPizzaItems }
                  })
                }}
              />
              <input
                type="number"
                min={1}
                value={line.quantity}
                onChange={(e) => {
                  const quantity = Number(e.target.value)
                  setForm((p) => {
                    const customPizzaItems = [...p.customPizzaItems]
                    customPizzaItems[idx] = { ...customPizzaItems[idx], quantity }
                    return { ...p, customPizzaItems }
                  })
                }}
              />
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={() =>
                  setForm((p) => ({
                    ...p,
                    customPizzaItems: p.customPizzaItems.filter((_, i) => i !== idx),
                  }))
                }
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            onClick={() =>
              setForm((p) => ({
                ...p,
                customPizzaItems: [...p.customPizzaItems, emptyPizza()],
              }))
            }
          >
            + Add custom pizza line
          </button>
        </fieldset>

        <div className="crm-form__actions">
          <button className="btn btn--primary" type="submit" disabled={saving}>
            {saving ? 'Saving…' : isNew ? 'Create order' : 'Save changes'}
          </button>
          <Link className="btn btn--ghost" to="/admin/orders">
            Cancel
          </Link>
        </div>
      </form>

      <AdminConfirmModal
        open={confirmDelete}
        title="Delete order"
        message={orderId !== null ? `Delete order #${orderId}?` : ''}
        confirmLabel="Delete"
        danger
        loading={saving}
        onConfirm={() => void handleDelete()}
        onCancel={() => setConfirmDelete(false)}
      />
    </section>
  )
}
