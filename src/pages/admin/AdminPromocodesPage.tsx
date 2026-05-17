import { useMemo, useState } from 'react'
import {
  createPromocode,
  deletePromocode,
  listPromocodes,
  updatePromocode,
  type PromocodeDto,
} from '../../api/admin/promocode'
import type { PromocodeUpdatePayload } from '../../api/admin/types'
import { AdminModal } from './AdminModal'
import { AdminIconButton } from './AdminIconButton'
import { AdminPageHeader } from './_shared/AdminPageHeader'
import { AdminDataTable } from './_shared/AdminDataTable'
import { AdminAlert } from './_shared/AdminAlert'
import { FormField } from './_shared/FormField'
import { AdminConfirmModal } from './_shared/AdminConfirmModal'
import { useCrudResource } from './_shared/useCrudResource'

type FormState = {
  code: string
  percent: number
  expiryLocal: string
  isActive: boolean
}

const emptyForm: FormState = {
  code: '',
  percent: 10,
  expiryLocal: '',
  isActive: true,
}

function toDatetimeLocal(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function toIsoFromLocal(local: string): string {
  return new Date(local).toISOString()
}

export function AdminPromocodesPage() {
  const crud = useCrudResource<PromocodeDto>({
    loadItems: listPromocodes,
    getId: (row) => row.id,
    sortItems: (a, b) => a.code.localeCompare(b.code),
    filterItem: (row, q) => row.code.toLowerCase().includes(q),
  })

  const [onlyActive, setOnlyActive] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isModalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [deleteTarget, setDeleteTarget] = useState<PromocodeDto | null>(null)

  const displayRows = useMemo(() => {
    if (!onlyActive) return crud.filteredItems
    return crud.filteredItems.filter((row) => row.isActive)
  }, [crud.filteredItems, onlyActive])

  function resetForm() {
    setForm(emptyForm)
    setEditingId(null)
    setModalOpen(false)
  }

  function openCreate() {
    setEditingId(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  function openEdit(row: PromocodeDto) {
    setEditingId(row.id)
    setForm({
      code: row.code,
      percent: row.percent,
      expiryLocal: toDatetimeLocal(row.expiryDate),
      isActive: row.isActive,
    })
    setModalOpen(true)
  }

  function buildUpdatePayload(): PromocodeUpdatePayload {
    return {
      code: form.code.trim().toUpperCase(),
      percent: Number(form.percent),
      expiryDate: toIsoFromLocal(form.expiryLocal),
      isActive: form.isActive,
    }
  }

  async function submitPromocode() {
    const payload = buildUpdatePayload()
    if (!payload.code || !Number.isFinite(payload.percent) || !form.expiryLocal) return

    await crud.runMutation(async () => {
      if (editingId !== null) {
        crud.upsertItem(await updatePromocode(editingId, payload))
      } else {
        const { isActive: _, ...createPayload } = payload
        crud.upsertItem(await createPromocode(createPayload))
      }
      resetForm()
    }, 'Save failed')
  }

  async function toggleActive(row: PromocodeDto) {
    await crud.runMutation(async () => {
      const updated = await updatePromocode(row.id, {
        code: row.code,
        percent: row.percent,
        expiryDate: row.expiryDate,
        isActive: !row.isActive,
      })
      crud.upsertItem(updated)
    }, 'Update failed')
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    const target = deleteTarget
    await crud.runMutation(async () => {
      await deletePromocode(target.id)
      crud.removeItemById(target.id)
      setDeleteTarget(null)
    }, 'Delete failed')
  }

  return (
    <section className="crm-section">
      <AdminPageHeader
        title="Promo codes"
        description="Discount codes for checkout."
        searchPlaceholder="Search by code"
        query={crud.query}
        onQueryChange={crud.setQuery}
        onAdd={openCreate}
        onRefresh={() => void crud.reload()}
        loading={crud.loading}
        extra={
          <label className="admin-check">
            <input
              type="checkbox"
              checked={onlyActive}
              onChange={(e) => setOnlyActive(e.target.checked)}
            />
            Active only
          </label>
        }
      />

      {crud.error && <AdminAlert message={crud.error} />}

      <AdminDataTable
        columns={[
          { key: 'code', header: 'Code', render: (row) => <strong>{row.code}</strong> },
          { key: 'percent', header: '%', render: (row) => `${row.percent}%` },
          {
            key: 'expiry',
            header: 'Expires',
            render: (row) => new Date(row.expiryDate).toLocaleString(),
          },
          {
            key: 'active',
            header: 'Active',
            render: (row) => (
              <button
                type="button"
                className={`crm-badge${row.isActive ? ' crm-badge--ok' : ' crm-badge--warn'}`}
                onClick={() => void toggleActive(row)}
                title="Toggle active"
              >
                {row.isActive ? 'Yes' : 'No'}
              </button>
            ),
          },
        ]}
        rows={displayRows}
        rowKey={(row) => row.id}
        loading={crud.loading}
        emptyMessage="No promo codes yet."
        actions={(row) => (
          <>
            <AdminIconButton label="Edit promocode" onClick={() => openEdit(row)}>
              ✎
            </AdminIconButton>
            <AdminIconButton
              label="Delete promocode"
              className="is-danger"
              onClick={() => setDeleteTarget(row)}
            >
              🗑
            </AdminIconButton>
          </>
        )}
      />

      <AdminModal
        title={editingId !== null ? 'Edit promocode' : 'Create promocode'}
        open={isModalOpen}
        onClose={resetForm}
      >
        <form
          className="crm-form"
          onSubmit={(e) => {
            e.preventDefault()
            void submitPromocode()
          }}
        >
          <FormField label="Code">
            <input
              value={form.code}
              onChange={(e) => setForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))}
              placeholder="SUMMER20"
              required
            />
          </FormField>
          <FormField label="Discount %">
            <input
              type="number"
              min={1}
              max={100}
              value={form.percent}
              onChange={(e) => setForm((p) => ({ ...p, percent: Number(e.target.value) }))}
              required
            />
          </FormField>
          <FormField label="Expiry">
            <input
              type="datetime-local"
              value={form.expiryLocal}
              onChange={(e) => setForm((p) => ({ ...p, expiryLocal: e.target.value }))}
              required
            />
          </FormField>
          {editingId !== null && (
            <label className="admin-check">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
              />
              Active
            </label>
          )}
          <div className="crm-form__actions">
            <button className="btn btn--primary" type="submit" disabled={crud.saving}>
              {crud.saving ? 'Saving…' : editingId !== null ? 'Save' : 'Create'}
            </button>
            <button className="btn btn--ghost" type="button" onClick={resetForm} disabled={crud.saving}>
              Cancel
            </button>
          </div>
        </form>
      </AdminModal>

      <AdminConfirmModal
        open={deleteTarget !== null}
        title="Delete promocode"
        message={deleteTarget ? `Delete code “${deleteTarget.code}”?` : ''}
        confirmLabel="Delete"
        danger
        loading={crud.saving}
        onConfirm={() => void confirmDelete()}
        onCancel={() => setDeleteTarget(null)}
      />
    </section>
  )
}
