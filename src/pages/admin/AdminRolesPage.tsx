import { useEffect, useState } from 'react'
import {
  createRole,
  deleteRole,
  getRole,
  listRoles,
  updateRole,
  type RoleListDto,
} from '../../api/admin/role'
import type { RolePayload } from '../../api/admin/types'
import { listPermissionGroups, type PermissionGroupDto } from '../../api/admin/permission-group'
import { AdminModal } from './AdminModal'
import { AdminIconButton } from './AdminIconButton'
import { AdminPageHeader } from './_shared/AdminPageHeader'
import { AdminDataTable } from './_shared/AdminDataTable'
import { AdminAlert } from './_shared/AdminAlert'
import { FormField } from './_shared/FormField'
import { AdminConfirmModal } from './_shared/AdminConfirmModal'
import { useCrudResource } from './_shared/useCrudResource'
import { PermissionPicker } from './_shared/PermissionPicker'

type FormState = {
  name: string
  code: string
  description: string
  isSystem: boolean
}

const emptyForm: FormState = {
  name: '',
  code: '',
  description: '',
  isSystem: false,
}

export function AdminRolesPage() {
  const crud = useCrudResource<RoleListDto>({
    loadItems: listRoles,
    getId: (row) => row.id,
    sortItems: (a, b) => a.name.localeCompare(b.name),
    filterItem: (row, q) =>
      `${row.name} ${row.code} ${row.description}`.toLowerCase().includes(q),
  })

  const [permissionGroups, setPermissionGroups] = useState<PermissionGroupDto[]>([])
  const [permissionIds, setPermissionIds] = useState<number[]>([])
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isModalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [deleteTarget, setDeleteTarget] = useState<RoleListDto | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)

  useEffect(() => {
    listPermissionGroups()
      .then(setPermissionGroups)
      .catch(() => setPermissionGroups([]))
  }, [])

  function resetForm() {
    setForm(emptyForm)
    setPermissionIds([])
    setEditingId(null)
    setModalOpen(false)
    setDetailLoading(false)
  }

  function openCreate() {
    setEditingId(null)
    setForm(emptyForm)
    setPermissionIds([])
    setModalOpen(true)
  }

  async function openEdit(row: RoleListDto) {
    setEditingId(row.id)
    setForm({
      name: row.name,
      code: row.code,
      description: row.description,
      isSystem: row.isSystem,
    })
    setPermissionIds([])
    setModalOpen(true)
    setDetailLoading(true)
    try {
      const detail = await getRole(row.id)
      setPermissionIds(detail.permissionIds)
      setForm({
        name: detail.name,
        code: detail.code,
        description: detail.description,
        isSystem: detail.isSystem,
      })
    } catch (e) {
      crud.setError(e instanceof Error ? e.message : 'Failed to load role')
    } finally {
      setDetailLoading(false)
    }
  }

  async function submitRole() {
    const payload: RolePayload = {
      name: form.name.trim(),
      code: form.code.trim().toLowerCase(),
      description: form.description.trim(),
      isSystem: form.isSystem,
      permissionIds,
    }
    if (!payload.name || !payload.code) return

    await crud.runMutation(async () => {
      if (editingId !== null) {
        const updated = await updateRole(editingId, payload)
        crud.upsertItem(updated)
      } else {
        const created = await createRole(payload)
        crud.upsertItem(created)
      }
      resetForm()
    }, 'Save failed')
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    const target = deleteTarget
    await crud.runMutation(async () => {
      await deleteRole(target.id)
      crud.removeItemById(target.id)
      setDeleteTarget(null)
    }, 'Delete failed')
  }

  return (
    <section className="crm-section">
      <AdminPageHeader
        title="Roles"
        searchPlaceholder="Search roles"
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
            key: 'name',
            header: 'Name',
            render: (row) => (
              <span
                className={`crm-badge crm-badge--${
                  row.code === 'admin' ? 'admin' : row.code === 'moderator' ? 'manager' : 'viewer'
                }`}
              >
                {row.name}
              </span>
            ),
          },
          { key: 'code', header: 'Code', render: (row) => row.code },
          { key: 'description', header: 'Description', render: (row) => row.description || '—' },
          {
            key: 'system',
            header: 'System',
            render: (row) => (row.isSystem ? 'Yes' : 'No'),
          },
        ]}
        rows={crud.filteredItems}
        rowKey={(row) => row.id}
        loading={crud.loading}
        emptyMessage="No roles yet."
        actions={(row) => (
          <>
            <AdminIconButton label="Edit role" onClick={() => void openEdit(row)}>
              ✎
            </AdminIconButton>
            <AdminIconButton
              label="Delete role"
              className="is-danger"
              onClick={() => setDeleteTarget(row)}
              disabled={row.isSystem}
            >
              🗑
            </AdminIconButton>
          </>
        )}
      />

      <AdminModal
        title={editingId !== null ? 'Edit role' : 'Create role'}
        open={isModalOpen}
        onClose={resetForm}
      >
        <form
          className="crm-form"
          onSubmit={(e) => {
            e.preventDefault()
            void submitRole()
          }}
        >
          <FormField label="Name">
            <input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              required
            />
          </FormField>
          <FormField label="Code">
            <input
              value={form.code}
              onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))}
              required
              disabled={editingId !== null && form.isSystem}
            />
          </FormField>
          <FormField label="Description">
            <input
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            />
          </FormField>
          {editingId !== null && (
            <label className="admin-check">
              <input
                type="checkbox"
                checked={form.isSystem}
                onChange={(e) => setForm((p) => ({ ...p, isSystem: e.target.checked }))}
              />
              System role
            </label>
          )}
          <p className="admin-permission-picker__heading">Permissions</p>
          {detailLoading ? (
            <p className="admin-table-state">Loading permissions…</p>
          ) : (
            <PermissionPicker
              groups={permissionGroups}
              selectedIds={permissionIds}
              onChange={setPermissionIds}
            />
          )}
          <div className="crm-form__actions">
            <button className="btn btn--primary" type="submit" disabled={crud.saving || detailLoading}>
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
        title="Delete role"
        message={deleteTarget ? `Delete role “${deleteTarget.name}”?` : ''}
        confirmLabel="Delete"
        danger
        loading={crud.saving}
        onConfirm={() => void confirmDelete()}
        onCancel={() => setDeleteTarget(null)}
      />
    </section>
  )
}
