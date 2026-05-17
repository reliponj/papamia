import { useState } from 'react'
import {
  createArticle,
  deleteArticle,
  listArticles,
  updateArticle,
  type ArticleDto,
} from '../../api/admin/article'
import { AdminModal } from './AdminModal'
import { AdminIconButton } from './AdminIconButton'
import { AdminPageHeader } from './_shared/AdminPageHeader'
import { AdminDataTable } from './_shared/AdminDataTable'
import { AdminAlert } from './_shared/AdminAlert'
import { FormField } from './_shared/FormField'
import { AdminConfirmModal } from './_shared/AdminConfirmModal'
import { useCrudResource } from './_shared/useCrudResource'

const emptyForm = { text: '', imageUrl: '' }

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString()
  } catch {
    return iso
  }
}

function excerpt(text: string, max = 80): string {
  const t = text.trim()
  return t.length <= max ? t : `${t.slice(0, max)}…`
}

export function AdminArticlesPage() {
  const crud = useCrudResource<ArticleDto>({
    loadItems: listArticles,
    getId: (row) => row.id,
    sortItems: (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    filterItem: (row, q) =>
      row.text.toLowerCase().includes(q) || row.imageUrl.toLowerCase().includes(q),
  })

  const [editingId, setEditingId] = useState<number | null>(null)
  const [isModalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [deleteTarget, setDeleteTarget] = useState<ArticleDto | null>(null)

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

  function openEdit(row: ArticleDto) {
    setEditingId(row.id)
    setForm({ text: row.text, imageUrl: row.imageUrl })
    setModalOpen(true)
  }

  async function submitArticle() {
    const payload = { text: form.text.trim(), imageUrl: form.imageUrl.trim() }
    if (!payload.text || !payload.imageUrl) return

    await crud.runMutation(async () => {
      if (editingId !== null) {
        crud.upsertItem(await updateArticle(editingId, payload))
      } else {
        crud.upsertItem(await createArticle(payload))
      }
      resetForm()
    }, 'Save failed')
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    const target = deleteTarget
    await crud.runMutation(async () => {
      await deleteArticle(target.id)
      crud.removeItemById(target.id)
      setDeleteTarget(null)
    }, 'Delete failed')
  }

  return (
    <section className="crm-section">
      <AdminPageHeader
        title="Articles"
        searchPlaceholder="Search articles"
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
            key: 'createdAt',
            header: 'Created',
            render: (row) => formatDate(row.createdAt),
          },
          {
            key: 'text',
            header: 'Text',
            render: (row) => excerpt(row.text),
          },
          {
            key: 'image',
            header: 'Image',
            render: (row) => (
              <img
                src={row.imageUrl}
                alt=""
                className="crm-thumb"
                style={{ width: 48, height: 48, objectFit: 'cover' }}
              />
            ),
          },
        ]}
        rows={crud.filteredItems}
        rowKey={(row) => row.id}
        loading={crud.loading}
        emptyMessage="No articles yet."
        actions={(row) => (
          <>
            <AdminIconButton label="Edit article" onClick={() => openEdit(row)}>
              ✎
            </AdminIconButton>
            <AdminIconButton
              label="Delete article"
              className="is-danger"
              onClick={() => setDeleteTarget(row)}
            >
              🗑
            </AdminIconButton>
          </>
        )}
      />

      <AdminModal
        title={editingId !== null ? 'Edit article' : 'Create article'}
        open={isModalOpen}
        onClose={resetForm}
      >
        <form
          className="crm-form"
          onSubmit={(e) => {
            e.preventDefault()
            void submitArticle()
          }}
        >
          <FormField label="Text">
            <textarea
              value={form.text}
              onChange={(e) => setForm((p) => ({ ...p, text: e.target.value }))}
              rows={6}
              required
            />
          </FormField>
          <FormField label="Image URL">
            <input
              value={form.imageUrl}
              onChange={(e) => setForm((p) => ({ ...p, imageUrl: e.target.value }))}
              placeholder="https://…"
              required
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
        title="Delete article"
        message={deleteTarget ? 'Delete this article? This cannot be undone.' : ''}
        confirmLabel="Delete"
        danger
        loading={crud.saving}
        onConfirm={() => void confirmDelete()}
        onCancel={() => setDeleteTarget(null)}
      />
    </section>
  )
}
