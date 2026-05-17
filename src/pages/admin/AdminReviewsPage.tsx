import { useMemo, useState } from 'react'
import {
  deleteReview,
  hideReview,
  listReviews,
  showReview,
  updateReview,
  type ReviewDto,
} from '../../api/admin/review'
import type { ReviewUpdatePayload } from '../../api/admin/types'
import { AdminModal } from './AdminModal'
import { AdminIconButton } from './AdminIconButton'
import { AdminPageHeader } from './_shared/AdminPageHeader'
import { AdminDataTable } from './_shared/AdminDataTable'
import { AdminAlert } from './_shared/AdminAlert'
import { FormField } from './_shared/FormField'
import { AdminConfirmModal } from './_shared/AdminConfirmModal'
import { useCrudResource } from './_shared/useCrudResource'

type FormState = {
  authorName: string
  rating: number
  text: string
  isHidden: boolean
}

const emptyForm: FormState = {
  authorName: '',
  rating: 5,
  text: '',
  isHidden: false,
}

function truncate(text: string, max = 80): string {
  if (text.length <= max) return text
  return `${text.slice(0, max)}…`
}

export function AdminReviewsPage() {
  const crud = useCrudResource<ReviewDto>({
    loadItems: listReviews,
    getId: (row) => row.id,
    sortItems: (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    filterItem: (row, q) => {
      const hay = `${row.authorName} ${row.text}`.toLowerCase()
      return hay.includes(q)
    },
  })

  const [showHidden, setShowHidden] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isModalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [deleteTarget, setDeleteTarget] = useState<ReviewDto | null>(null)

  const displayRows = useMemo(() => {
    if (showHidden) return crud.filteredItems
    return crud.filteredItems.filter((row) => !row.isHidden)
  }, [crud.filteredItems, showHidden])

  function resetForm() {
    setForm(emptyForm)
    setEditingId(null)
    setModalOpen(false)
  }

  function openEdit(row: ReviewDto) {
    setEditingId(row.id)
    setForm({
      authorName: row.authorName,
      rating: row.rating,
      text: row.text,
      isHidden: row.isHidden,
    })
    setModalOpen(true)
  }

  function buildPayload(): ReviewUpdatePayload {
    return {
      authorName: form.authorName.trim(),
      rating: Number(form.rating),
      text: form.text.trim(),
      isHidden: form.isHidden,
    }
  }

  async function submitReview() {
    const payload = buildPayload()
    if (!payload.authorName || !payload.text || !Number.isFinite(payload.rating)) return
    if (editingId === null) return

    await crud.runMutation(async () => {
      crud.upsertItem(await updateReview(editingId, payload))
      resetForm()
    }, 'Save failed')
  }

  async function toggleVisibility(row: ReviewDto) {
    await crud.runMutation(async () => {
      const updated = row.isHidden ? await showReview(row.id) : await hideReview(row.id)
      crud.upsertItem(updated)
    }, 'Update failed')
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    const target = deleteTarget
    await crud.runMutation(async () => {
      await deleteReview(target.id)
      crud.removeItemById(target.id)
      setDeleteTarget(null)
    }, 'Delete failed')
  }

  return (
    <section className="crm-section">
      <AdminPageHeader
        title="Reviews"
        searchPlaceholder="Search by author or text"
        query={crud.query}
        onQueryChange={crud.setQuery}
        onRefresh={() => void crud.reload()}
        loading={crud.loading}
        extra={
          <label className="admin-check">
            <input
              type="checkbox"
              checked={showHidden}
              onChange={(e) => setShowHidden(e.target.checked)}
            />
            Show hidden
          </label>
        }
      />

      {crud.error && <AdminAlert message={crud.error} />}

      <AdminDataTable
        columns={[
          { key: 'rating', header: '★', render: (row) => row.rating },
          { key: 'author', header: 'Author', render: (row) => row.authorName },
          {
            key: 'text',
            header: 'Text',
            render: (row) => <span title={row.text}>{truncate(row.text)}</span>,
          },
          {
            key: 'hidden',
            header: 'Visible',
            render: (row) => (
              <button
                type="button"
                className={`crm-badge${row.isHidden ? ' crm-badge--warn' : ' crm-badge--ok'}`}
                onClick={() => void toggleVisibility(row)}
                title={row.isHidden ? 'Show review' : 'Hide review'}
              >
                {row.isHidden ? 'Hidden' : 'Public'}
              </button>
            ),
          },
          {
            key: 'created',
            header: 'Created',
            render: (row) => new Date(row.createdAt).toLocaleString(),
          },
        ]}
        rows={displayRows}
        rowKey={(row) => row.id}
        loading={crud.loading}
        emptyMessage="No reviews yet."
        actions={(row) => (
          <>
            <AdminIconButton label="Edit review" onClick={() => openEdit(row)}>
              ✎
            </AdminIconButton>
            <AdminIconButton
              label="Delete review"
              className="is-danger"
              onClick={() => setDeleteTarget(row)}
            >
              🗑
            </AdminIconButton>
          </>
        )}
      />

      <AdminModal title="Edit review" open={isModalOpen} onClose={resetForm}>
        <form
          className="crm-form"
          onSubmit={(e) => {
            e.preventDefault()
            void submitReview()
          }}
        >
          <FormField label="Author name">
            <input
              value={form.authorName}
              onChange={(e) => setForm((p) => ({ ...p, authorName: e.target.value }))}
              required
              autoFocus
            />
          </FormField>
          <FormField label="Rating (1–5)">
            <input
              type="number"
              min={1}
              max={5}
              value={form.rating}
              onChange={(e) => setForm((p) => ({ ...p, rating: Number(e.target.value) }))}
              required
            />
          </FormField>
          <FormField label="Text">
            <textarea
              rows={4}
              value={form.text}
              onChange={(e) => setForm((p) => ({ ...p, text: e.target.value }))}
              required
            />
          </FormField>
          <label className="admin-check">
            <input
              type="checkbox"
              checked={form.isHidden}
              onChange={(e) => setForm((p) => ({ ...p, isHidden: e.target.checked }))}
            />
            Hidden from public list
          </label>
          <div className="crm-form__actions">
            <button className="btn btn--primary" type="submit" disabled={crud.saving}>
              {crud.saving ? 'Saving…' : 'Save'}
            </button>
            <button className="btn btn--ghost" type="button" onClick={resetForm} disabled={crud.saving}>
              Cancel
            </button>
          </div>
        </form>
      </AdminModal>

      <AdminConfirmModal
        open={deleteTarget !== null}
        title="Delete review"
        message={
          deleteTarget
            ? `Delete review by “${deleteTarget.authorName}”? This cannot be undone.`
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
