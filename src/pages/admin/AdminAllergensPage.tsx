import { useState } from 'react'
import {
  createAllergen,
  deleteAllergen,
  listAllergens,
  updateAllergen,
  type AllergenDto,
} from '../../api/admin/allergen'
import { AdminModal } from './AdminModal'
import { AdminIconButton } from './AdminIconButton'
import { AdminPageHeader } from './_shared/AdminPageHeader'
import { AdminDataTable } from './_shared/AdminDataTable'
import { AdminAlert } from './_shared/AdminAlert'
import { FormField } from './_shared/FormField'
import { AdminConfirmModal } from './_shared/AdminConfirmModal'
import { useCrudResource } from './_shared/useCrudResource'

export function AdminAllergensPage() {
  const crud = useCrudResource<AllergenDto>({
    loadItems: listAllergens,
    getId: (row) => row.id,
    sortItems: (a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }),
    filterItem: (row, q) => row.name.toLowerCase().includes(q),
  })

  const [editingId, setEditingId] = useState<number | null>(null)
  const [isModalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ name: '' })
  const [deleteTarget, setDeleteTarget] = useState<AllergenDto | null>(null)

  function resetForm() {
    setForm({ name: '' })
    setEditingId(null)
    setModalOpen(false)
  }

  function openCreate() {
    setEditingId(null)
    setForm({ name: '' })
    setModalOpen(true)
  }

  function openEdit(row: AllergenDto) {
    setEditingId(row.id)
    setForm({ name: row.name })
    setModalOpen(true)
  }

  async function submitAllergen() {
    const name = form.name.trim()
    if (!name) return

    await crud.runMutation(async () => {
      if (editingId !== null) {
        const updated = await updateAllergen(editingId, { name })
        crud.upsertItem(updated)
      } else {
        const created = await createAllergen({ name })
        crud.upsertItem(created)
      }
      resetForm()
    }, 'Save failed')
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    const target = deleteTarget
    await crud.runMutation(async () => {
      await deleteAllergen(target.id)
      crud.removeItemById(target.id)
      setDeleteTarget(null)
    }, 'Delete failed')
  }

  return (
    <section className="crm-section">
      <AdminPageHeader
        title="Allergens"
        searchPlaceholder="Search allergens"
        query={crud.query}
        onQueryChange={crud.setQuery}
        onAdd={openCreate}
        onRefresh={() => void crud.reload()}
        loading={crud.loading}
      />

      {crud.error && <AdminAlert message={crud.error} />}

      <AdminDataTable
        columns={[
          { key: 'id', header: 'ID', render: (row) => row.id },
          { key: 'name', header: 'Name', render: (row) => row.name },
        ]}
        rows={crud.filteredItems}
        rowKey={(row) => row.id}
        loading={crud.loading}
        emptyMessage="No allergens yet."
        actions={(row) => (
          <>
            <AdminIconButton label="Edit allergen" onClick={() => openEdit(row)}>
              ✎
            </AdminIconButton>
            <AdminIconButton
              label="Delete allergen"
              className="is-danger"
              onClick={() => setDeleteTarget(row)}
            >
              🗑
            </AdminIconButton>
          </>
        )}
      />

      <AdminModal
        title={editingId !== null ? 'Edit allergen' : 'Create allergen'}
        open={isModalOpen}
        onClose={resetForm}
      >
        <form
          className="crm-form"
          onSubmit={(e) => {
            e.preventDefault()
            void submitAllergen()
          }}
        >
          <FormField label="Name">
            <input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="e.g. Gluten"
              required
              autoFocus
            />
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
        title="Delete allergen"
        message={
          deleteTarget
            ? `Delete allergen “${deleteTarget.name}”? This cannot be undone.`
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
