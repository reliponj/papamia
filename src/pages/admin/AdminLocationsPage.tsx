import { useState } from 'react'
import {
  createLocation,
  deleteLocation,
  listLocations,
  updateLocation,
  type LocationDto,
} from '../../api/admin/location'
import type { LocationPayload } from '../../api/admin/types'
import { AdminModal } from './AdminModal'
import { AdminIconButton } from './AdminIconButton'
import { AdminPageHeader } from './_shared/AdminPageHeader'
import { AdminDataTable } from './_shared/AdminDataTable'
import { AdminAlert } from './_shared/AdminAlert'
import { FormField } from './_shared/FormField'
import { AdminConfirmModal } from './_shared/AdminConfirmModal'
import { useCrudResource } from './_shared/useCrudResource'
import { validateLocationPayload } from './_shared/validateLocation'

const emptyForm: LocationPayload = {
  name: '',
  address: '',
  phoneNumber: '',
  worktime: '',
  latitude: 47.01,
  longitude: 28.86,
  imageUrl: '',
}

export function AdminLocationsPage() {
  const crud = useCrudResource<LocationDto>({
    loadItems: listLocations,
    getId: (row) => row.id,
    sortItems: (a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }),
    filterItem: (row, q) =>
      `${row.name} ${row.address} ${row.phoneNumber}`.toLowerCase().includes(q),
  })

  const [editingId, setEditingId] = useState<number | null>(null)
  const [isModalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [fieldError, setFieldError] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<LocationDto | null>(null)

  function resetForm() {
    setForm(emptyForm)
    setFieldError(null)
    setEditingId(null)
    setModalOpen(false)
  }

  function openCreate() {
    setEditingId(null)
    setForm(emptyForm)
    setFieldError(null)
    setModalOpen(true)
  }

  function openEdit(row: LocationDto) {
    setEditingId(row.id)
    setForm({
      name: row.name,
      address: row.address,
      phoneNumber: row.phoneNumber,
      worktime: row.worktime,
      latitude: row.latitude,
      longitude: row.longitude,
      imageUrl: row.imageUrl,
    })
    setFieldError(null)
    setModalOpen(true)
  }

  function buildPayload(): LocationPayload {
    return {
      name: form.name.trim(),
      address: form.address.trim(),
      phoneNumber: form.phoneNumber.trim(),
      worktime: form.worktime.trim(),
      latitude: Number(form.latitude),
      longitude: Number(form.longitude),
      imageUrl: form.imageUrl.trim(),
    }
  }

  async function submitLocation() {
    const payload = buildPayload()
    const validation = validateLocationPayload(payload)
    if (validation) {
      setFieldError(validation)
      return
    }
    setFieldError(null)

    await crud.runMutation(async () => {
      if (editingId !== null) {
        crud.upsertItem(await updateLocation(editingId, payload))
      } else {
        crud.upsertItem(await createLocation(payload))
      }
      resetForm()
    }, 'Save failed')
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    const target = deleteTarget
    await crud.runMutation(async () => {
      await deleteLocation(target.id)
      crud.removeItemById(target.id)
      setDeleteTarget(null)
    }, 'Delete failed')
  }

  return (
    <section className="crm-section">
      <AdminPageHeader
        title="Locations"
        searchPlaceholder="Search locations"
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
          { key: 'address', header: 'Address', render: (row) => row.address },
          { key: 'phone', header: 'Phone', render: (row) => row.phoneNumber },
          {
            key: 'coords',
            header: 'Coordinates',
            render: (row) => `${row.latitude.toFixed(4)}, ${row.longitude.toFixed(4)}`,
          },
        ]}
        rows={crud.filteredItems}
        rowKey={(row) => row.id}
        loading={crud.loading}
        emptyMessage="No locations yet."
        actions={(row) => (
          <>
            <AdminIconButton label="Edit location" onClick={() => openEdit(row)}>
              ✎
            </AdminIconButton>
            <AdminIconButton
              label="Delete location"
              className="is-danger"
              onClick={() => setDeleteTarget(row)}
            >
              🗑
            </AdminIconButton>
          </>
        )}
      />

      <AdminModal
        title={editingId !== null ? 'Edit location' : 'Create location'}
        open={isModalOpen}
        onClose={resetForm}
      >
        <form
          className="crm-form"
          onSubmit={(e) => {
            e.preventDefault()
            void submitLocation()
          }}
        >
          <FormField label="Name" error={fieldError ?? undefined}>
            <input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
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
          <FormField label="Phone">
            <input
              value={form.phoneNumber}
              onChange={(e) => setForm((p) => ({ ...p, phoneNumber: e.target.value }))}
              required
            />
          </FormField>
          <FormField label="Work time">
            <input
              value={form.worktime}
              onChange={(e) => setForm((p) => ({ ...p, worktime: e.target.value }))}
              placeholder="Mon–Sun 10:00–22:00"
              required
            />
          </FormField>
          <FormField label="Latitude">
            <input
              type="number"
              step="any"
              min={-90}
              max={90}
              value={form.latitude}
              onChange={(e) => setForm((p) => ({ ...p, latitude: Number(e.target.value) }))}
              required
            />
          </FormField>
          <FormField label="Longitude">
            <input
              type="number"
              step="any"
              min={-180}
              max={180}
              value={form.longitude}
              onChange={(e) => setForm((p) => ({ ...p, longitude: Number(e.target.value) }))}
              required
            />
          </FormField>
          <FormField label="Image URL">
            <input
              value={form.imageUrl}
              onChange={(e) => setForm((p) => ({ ...p, imageUrl: e.target.value }))}
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
        title="Delete location"
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
