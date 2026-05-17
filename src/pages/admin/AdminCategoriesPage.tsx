import { useState } from 'react'
import {
  createCategory,
  deleteCategory,
  listCategories,
  reorderCategories,
  updateCategory,
  type CategoryDto,
} from '../../api/admin/category'
import type { CategoryPayload } from '../../api/admin/types'
import { AdminModal } from './AdminModal'
import { AdminIconButton } from './AdminIconButton'
import { AdminPageHeader } from './_shared/AdminPageHeader'
import { AdminDataTable } from './_shared/AdminDataTable'
import { AdminAlert } from './_shared/AdminAlert'
import { FormField } from './_shared/FormField'
import { AdminConfirmModal } from './_shared/AdminConfirmModal'
import { useCrudResource } from './_shared/useCrudResource'

const emptyForm: CategoryPayload = {
  name: '',
  icon: '',
  description: '',
  sort: 0,
}

export function AdminCategoriesPage() {
  const crud = useCrudResource<CategoryDto>({
    loadItems: listCategories,
    getId: (row) => row.id,
    sortItems: (a, b) => a.sort - b.sort || a.name.localeCompare(b.name),
    filterItem: (row, q) =>
      `${row.name} ${row.icon} ${row.description}`.toLowerCase().includes(q),
  })

  const [editingId, setEditingId] = useState<number | null>(null)
  const [isModalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [deleteTarget, setDeleteTarget] = useState<CategoryDto | null>(null)

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

  function openEdit(row: CategoryDto) {
    setEditingId(row.id)
    setForm({
      name: row.name,
      icon: row.icon,
      description: row.description,
      sort: row.sort,
    })
    setModalOpen(true)
  }

  async function submitCategory() {
    const payload: CategoryPayload = {
      name: form.name.trim(),
      icon: form.icon.trim(),
      description: form.description.trim(),
      sort: Number(form.sort),
    }
    if (!payload.name) return

    await crud.runMutation(async () => {
      if (editingId !== null) {
        crud.upsertItem(await updateCategory(editingId, payload))
      } else {
        crud.upsertItem(await createCategory(payload))
      }
      resetForm()
    }, 'Save failed')
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    const target = deleteTarget
    await crud.runMutation(async () => {
      await deleteCategory(target.id)
      crud.removeItemById(target.id)
      setDeleteTarget(null)
    }, 'Delete failed')
  }

  const sortDisabled = crud.query.trim().length > 0

  async function handleReorder(next: CategoryDto[]) {
    const previous = crud.items
    const withSort = next.map((cat, index) => ({ ...cat, sort: index }))
    crud.replaceItems(withSort)
    try {
      await crud.runMutation(async () => {
        const saved = await reorderCategories(withSort)
        crud.replaceItems(saved)
      }, 'Reorder failed')
    } catch {
      crud.replaceItems(previous)
    }
  }

  return (
    <section className="crm-section">
      <AdminPageHeader
        title="Categories"
        searchPlaceholder="Search categories"
        query={crud.query}
        onQueryChange={crud.setQuery}
        onAdd={openCreate}
        onRefresh={() => void crud.reload()}
        loading={crud.loading}
      />

      {crud.error && <AdminAlert message={crud.error} />}

      <AdminDataTable
        columns={[
          {
            key: 'order',
            header: '#',
            className: 'crm-table__col-order',
            render: (_row, index) => index + 1,
          },
          { key: 'name', header: 'Name', render: (row) => row.name },
          { key: 'icon', header: 'Icon', render: (row) => row.icon || '—' },
          {
            key: 'description',
            header: 'Description',
            render: (row) =>
              row.description.length > 48 ? `${row.description.slice(0, 48)}…` : row.description,
          },
        ]}
        rows={crud.filteredItems}
        rowKey={(row) => row.id}
        loading={crud.loading}
        emptyMessage="No categories yet."
        sortable={{
          onReorder: handleReorder,
          disabled: sortDisabled,
          disabledHint: 'Clear search to reorder categories by drag and drop.',
        }}
        actions={(row) => (
          <>
            <AdminIconButton label="Edit category" onClick={() => openEdit(row)}>
              ✎
            </AdminIconButton>
            <AdminIconButton
              label="Delete category"
              className="is-danger"
              onClick={() => setDeleteTarget(row)}
            >
              🗑
            </AdminIconButton>
          </>
        )}
      />

      <AdminModal
        title={editingId !== null ? 'Edit category' : 'Create category'}
        open={isModalOpen}
        onClose={resetForm}
      >
        <form
          className="crm-form"
          onSubmit={(e) => {
            e.preventDefault()
            void submitCategory()
          }}
        >
          <FormField label="Name">
            <input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="e.g. Pizza"
              required
            />
          </FormField>
          <FormField label="Icon">
            <input
              value={form.icon}
              onChange={(e) => setForm((p) => ({ ...p, icon: e.target.value }))}
              placeholder="emoji or icon key"
            />
          </FormField>
          <FormField label="Description">
            <textarea
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              rows={3}
            />
          </FormField>
          <FormField label="Sort order">
            <input
              type="number"
              value={form.sort}
              onChange={(e) => setForm((p) => ({ ...p, sort: Number(e.target.value) }))}
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
        title="Delete category"
        message={deleteTarget ? `Delete category “${deleteTarget.name}”?` : ''}
        confirmLabel="Delete"
        danger
        loading={crud.saving}
        onConfirm={() => void confirmDelete()}
        onCancel={() => setDeleteTarget(null)}
      />
    </section>
  )
}
