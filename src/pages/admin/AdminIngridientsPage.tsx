import { useState } from 'react'
import { formatPriceMdl, majorToMinor, minorToMajor } from '../../api/money'
import {
  createIngridient,
  deleteIngridient,
  listIngridients,
  updateIngridient,
  type IngridientDto,
} from '../../api/admin/ingridient'
import type { IngridientType } from '../../api/admin/types'
import { AdminModal } from './AdminModal'
import { AdminIconButton } from './AdminIconButton'
import { AdminPageHeader } from './_shared/AdminPageHeader'
import { AdminDataTable } from './_shared/AdminDataTable'
import { AdminAlert } from './_shared/AdminAlert'
import { FormField } from './_shared/FormField'
import { AdminConfirmModal } from './_shared/AdminConfirmModal'
import { useCrudResource } from './_shared/useCrudResource'

const TYPE_LABELS: Record<IngridientType, string> = {
  0: 'Dough',
  1: 'Sauce',
  2: 'Extra',
}

const emptyForm = { name: '', type: 0 as IngridientType, priceMdl: '0', isActive: true }

export function AdminIngridientsPage() {
  const crud = useCrudResource<IngridientDto>({
    loadItems: listIngridients,
    getId: (row) => row.id,
    sortItems: (a, b) =>
      a.type - b.type || a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }),
    filterItem: (row, q) =>
      row.name.toLowerCase().includes(q) || TYPE_LABELS[row.type].toLowerCase().includes(q),
  })

  const [editingId, setEditingId] = useState<number | null>(null)
  const [isModalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [deleteTarget, setDeleteTarget] = useState<IngridientDto | null>(null)

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

  function openEdit(row: IngridientDto) {
    setEditingId(row.id)
    setForm({
      name: row.name,
      type: row.type,
      priceMdl: minorToMajor(row.price).toFixed(2),
      isActive: row.isActive,
    })
    setModalOpen(true)
  }

  async function submitIngridient() {
    const priceMajor = Number.parseFloat(form.priceMdl)
    if (!form.name.trim() || !Number.isFinite(priceMajor) || priceMajor < 0) return
    const payload = {
      name: form.name.trim(),
      type: form.type,
      price: majorToMinor(priceMajor),
      isActive: form.isActive,
    }

    await crud.runMutation(async () => {
      if (editingId !== null) {
        crud.upsertItem(await updateIngridient(editingId, payload))
      } else {
        crud.upsertItem(await createIngridient(payload))
      }
      resetForm()
    }, 'Save failed')
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    const target = deleteTarget
    await crud.runMutation(async () => {
      await deleteIngridient(target.id)
      crud.removeItemById(target.id)
      setDeleteTarget(null)
    }, 'Delete failed')
  }

  return (
    <section className="crm-section">
      <AdminPageHeader
        title="Ingredients"
        searchPlaceholder="Search ingredients"
        query={crud.query}
        onQueryChange={crud.setQuery}
        onAdd={openCreate}
        onRefresh={() => void crud.reload()}
        loading={crud.loading}
      />

      {crud.error && <AdminAlert message={crud.error} />}

      <AdminDataTable
        columns={[
          { key: 'name', header: 'Name', render: (row) => row.name },
          { key: 'type', header: 'Type', render: (row) => TYPE_LABELS[row.type] },
          { key: 'price', header: 'Price', render: (row) => formatPriceMdl(row.price) },
          {
            key: 'active',
            header: 'Active',
            render: (row) => (row.isActive ? 'Yes' : 'No'),
          },
        ]}
        rows={crud.filteredItems}
        rowKey={(row) => row.id}
        loading={crud.loading}
        emptyMessage="No ingredients yet."
        actions={(row) => (
          <>
            <AdminIconButton label="Edit ingredient" onClick={() => openEdit(row)}>
              ✎
            </AdminIconButton>
            <AdminIconButton
              label="Delete ingredient"
              className="is-danger"
              onClick={() => setDeleteTarget(row)}
            >
              🗑
            </AdminIconButton>
          </>
        )}
      />

      <AdminModal
        title={editingId !== null ? 'Edit ingredient' : 'Create ingredient'}
        open={isModalOpen}
        onClose={resetForm}
      >
        <form
          className="crm-form"
          onSubmit={(e) => {
            e.preventDefault()
            void submitIngridient()
          }}
        >
          <FormField label="Name">
            <input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              required
              autoFocus
            />
          </FormField>
          <FormField label="Type">
            <select
              value={form.type}
              onChange={(e) =>
                setForm((p) => ({ ...p, type: Number(e.target.value) as IngridientType }))
              }
            >
              {([0, 1, 2] as IngridientType[]).map((value) => (
                <option key={value} value={value}>
                  {TYPE_LABELS[value]}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Price (MDL)">
            <input
              type="number"
              min={0}
              step="0.01"
              value={form.priceMdl}
              onChange={(e) => setForm((p) => ({ ...p, priceMdl: e.target.value }))}
              required
            />
          </FormField>
          <FormField label="Active">
            <label className="crm-checkbox">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
              />
              <span>Visible in pizza builder</span>
            </label>
          </FormField>
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
        title="Delete ingredient"
        message={deleteTarget ? `Delete “${deleteTarget.name}”?` : ''}
        confirmLabel="Delete"
        danger
        loading={crud.saving}
        onConfirm={() => void confirmDelete()}
        onCancel={() => setDeleteTarget(null)}
      />
    </section>
  )
}
