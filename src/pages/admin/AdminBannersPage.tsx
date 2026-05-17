import { useState } from 'react'
import {
  createBanner,
  deleteBanner,
  listBanners,
  updateBanner,
  type BannerDto,
} from '../../api/admin/banner'
import { AdminModal } from './AdminModal'
import { AdminIconButton } from './AdminIconButton'
import { AdminPageHeader } from './_shared/AdminPageHeader'
import { AdminDataTable } from './_shared/AdminDataTable'
import { AdminAlert } from './_shared/AdminAlert'
import { FormField } from './_shared/FormField'
import { AdminConfirmModal } from './_shared/AdminConfirmModal'
import { useCrudResource } from './_shared/useCrudResource'

const emptyForm = { imageUrl: '', link: '', sort: 0 }

export function AdminBannersPage() {
  const crud = useCrudResource<BannerDto>({
    loadItems: listBanners,
    getId: (row) => row.id,
    sortItems: (a, b) => a.sort - b.sort || a.id - b.id,
    filterItem: (row, q) =>
      row.link.toLowerCase().includes(q) || row.imageUrl.toLowerCase().includes(q),
  })

  const [editingId, setEditingId] = useState<number | null>(null)
  const [isModalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [deleteTarget, setDeleteTarget] = useState<BannerDto | null>(null)

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

  function openEdit(row: BannerDto) {
    setEditingId(row.id)
    setForm({ imageUrl: row.imageUrl, link: row.link, sort: row.sort })
    setModalOpen(true)
  }

  async function submitBanner() {
    const payload = {
      imageUrl: form.imageUrl.trim(),
      link: form.link.trim(),
      sort: Number(form.sort),
    }
    if (!payload.imageUrl || !payload.link || !Number.isFinite(payload.sort)) return

    await crud.runMutation(async () => {
      if (editingId !== null) {
        crud.upsertItem(await updateBanner(editingId, payload))
      } else {
        crud.upsertItem(await createBanner(payload))
      }
      resetForm()
    }, 'Save failed')
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    const target = deleteTarget
    await crud.runMutation(async () => {
      await deleteBanner(target.id)
      crud.removeItemById(target.id)
      setDeleteTarget(null)
    }, 'Delete failed')
  }

  return (
    <section className="crm-section">
      <AdminPageHeader
        title="Banners"
        description="Homepage carousel slides (image, link, sort order)."
        searchPlaceholder="Search banners"
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
            key: 'preview',
            header: 'Preview',
            render: (row) => (
              <img
                src={row.imageUrl}
                alt=""
                className="crm-thumb"
                style={{ width: 72, height: 40, objectFit: 'cover' }}
              />
            ),
          },
          { key: 'sort', header: 'Sort', render: (row) => row.sort },
          {
            key: 'link',
            header: 'Link',
            render: (row) => (
              <a href={row.link} target="_blank" rel="noreferrer" className="admin-table-link">
                {row.link}
              </a>
            ),
          },
        ]}
        rows={crud.filteredItems}
        rowKey={(row) => row.id}
        loading={crud.loading}
        emptyMessage="No banners yet."
        actions={(row) => (
          <>
            <AdminIconButton label="Edit banner" onClick={() => openEdit(row)}>
              ✎
            </AdminIconButton>
            <AdminIconButton
              label="Delete banner"
              className="is-danger"
              onClick={() => setDeleteTarget(row)}
            >
              🗑
            </AdminIconButton>
          </>
        )}
      />

      <AdminModal
        title={editingId !== null ? 'Edit banner' : 'Create banner'}
        open={isModalOpen}
        onClose={resetForm}
      >
        <form
          className="crm-form"
          onSubmit={(e) => {
            e.preventDefault()
            void submitBanner()
          }}
        >
          <FormField label="Image URL">
            <input
              value={form.imageUrl}
              onChange={(e) => setForm((p) => ({ ...p, imageUrl: e.target.value }))}
              placeholder="https://…"
              required
            />
          </FormField>
          <FormField label="Link">
            <input
              value={form.link}
              onChange={(e) => setForm((p) => ({ ...p, link: e.target.value }))}
              placeholder="/menu or https://…"
              required
            />
          </FormField>
          <FormField label="Sort order">
            <input
              type="number"
              value={form.sort}
              onChange={(e) => setForm((p) => ({ ...p, sort: Number(e.target.value) }))}
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
        title="Delete banner"
        message={deleteTarget ? `Delete this banner (sort ${deleteTarget.sort})?` : ''}
        confirmLabel="Delete"
        danger
        loading={crud.saving}
        onConfirm={() => void confirmDelete()}
        onCancel={() => setDeleteTarget(null)}
      />
    </section>
  )
}
