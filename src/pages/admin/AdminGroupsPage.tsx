import { useState } from 'react'
import {
  createPermissionGroup,
  deletePermissionGroup,
  listPermissionGroups,
  updatePermissionGroup,
  type PermissionGroupDto,
} from '../../api/admin/permission-group'
import type { PermissionGroupCreatePayload, PermissionPayload } from '../../api/admin/types'
import {
  createPermission,
  deletePermission,
  type PermissionDto,
} from '../../api/admin/permission'
import { AdminModal } from './AdminModal'
import { AdminIconButton } from './AdminIconButton'
import { AdminPageHeader } from './_shared/AdminPageHeader'
import { AdminDataTable } from './_shared/AdminDataTable'
import { AdminAlert } from './_shared/AdminAlert'
import { FormField } from './_shared/FormField'
import { AdminConfirmModal } from './_shared/AdminConfirmModal'
import { useCrudResource } from './_shared/useCrudResource'

type GroupForm = {
  name: string
  code: string
  description: string
}

const emptyGroupForm: GroupForm = { name: '', code: '', description: '' }
const emptyPermForm: PermissionPayload = { name: '', code: '', description: '' }

export function AdminGroupsPage() {
  const crud = useCrudResource<PermissionGroupDto>({
    loadItems: listPermissionGroups,
    getId: (row) => row.id,
    sortItems: (a, b) => a.name.localeCompare(b.name),
    filterItem: (row, q) =>
      `${row.name} ${row.code} ${row.description}`.toLowerCase().includes(q),
  })

  const [editingId, setEditingId] = useState<number | null>(null)
  const [isModalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(emptyGroupForm)
  const [groupPermissions, setGroupPermissions] = useState<PermissionDto[]>([])
  const [permForm, setPermForm] = useState(emptyPermForm)
  const [deleteTarget, setDeleteTarget] = useState<PermissionGroupDto | null>(null)

  function resetForm() {
    setForm(emptyGroupForm)
    setGroupPermissions([])
    setPermForm(emptyPermForm)
    setEditingId(null)
    setModalOpen(false)
  }

  function openCreate() {
    setEditingId(null)
    setForm(emptyGroupForm)
    setGroupPermissions([])
    setModalOpen(true)
  }

  function openEdit(row: PermissionGroupDto) {
    setEditingId(row.id)
    setForm({ name: row.name, code: row.code, description: row.description })
    setGroupPermissions([...row.permissions])
    setModalOpen(true)
  }

  async function submitGroup() {
    const base: PermissionGroupCreatePayload = {
      name: form.name.trim(),
      code: form.code.trim(),
      description: form.description.trim(),
    }
    if (!base.name || !base.code) return

    await crud.runMutation(async () => {
      if (editingId !== null) {
        const updated = await updatePermissionGroup(editingId, {
          ...base,
          permissionIds: groupPermissions.map((p) => p.id),
        })
        crud.upsertItem(updated)
      } else {
        const created = await createPermissionGroup(base)
        crud.upsertItem(created)
      }
      resetForm()
    }, 'Save failed')
  }

  async function addPermission() {
    if (editingId === null) return
    const payload = {
      name: permForm.name.trim(),
      code: permForm.code.trim(),
      description: permForm.description.trim(),
    }
    if (!payload.name || !payload.code) return

    await crud.runMutation(async () => {
      const created = await createPermission(editingId, payload)
      setGroupPermissions((prev) => [...prev, created])
      setPermForm(emptyPermForm)
    }, 'Failed to add permission')
  }

  async function removePermission(perm: PermissionDto) {
    await crud.runMutation(async () => {
      await deletePermission(perm.id)
      setGroupPermissions((prev) => prev.filter((p) => p.id !== perm.id))
    }, 'Failed to delete permission')
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    const target = deleteTarget
    await crud.runMutation(async () => {
      await deletePermissionGroup(target.id)
      crud.removeItemById(target.id)
      setDeleteTarget(null)
    }, 'Delete failed')
  }

  return (
    <section className="crm-section">
      <AdminPageHeader
        title="Permission groups"
        searchPlaceholder="Search groups"
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
          { key: 'code', header: 'Code', render: (row) => row.code },
          {
            key: 'description',
            header: 'Description',
            render: (row) => row.description || '—',
          },
          {
            key: 'count',
            header: 'Permissions',
            render: (row) => row.permissions.length,
          },
        ]}
        rows={crud.filteredItems}
        rowKey={(row) => row.id}
        loading={crud.loading}
        emptyMessage="No groups yet."
        actions={(row) => (
          <>
            <AdminIconButton label="Edit group" onClick={() => openEdit(row)}>
              ✎
            </AdminIconButton>
            <AdminIconButton
              label="Delete group"
              className="is-danger"
              onClick={() => setDeleteTarget(row)}
            >
              🗑
            </AdminIconButton>
          </>
        )}
      />

      <AdminModal
        title={editingId !== null ? 'Edit permission group' : 'Create permission group'}
        open={isModalOpen}
        onClose={resetForm}
      >
        <form
          className="crm-form"
          onSubmit={(e) => {
            e.preventDefault()
            void submitGroup()
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
            />
          </FormField>
          <FormField label="Description">
            <input
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            />
          </FormField>

          {editingId !== null && (
            <>
              <p className="admin-permission-picker__heading">Permissions in group</p>
              {groupPermissions.length === 0 ? (
                <p className="admin-table-state">No permissions yet.</p>
              ) : (
                <ul className="admin-permission-picker__list">
                  {groupPermissions.map((perm) => (
                    <li key={perm.id} className="admin-perm-row">
                      <span>
                        {perm.name} <code>{perm.code}</code>
                      </span>
                      <AdminIconButton
                        label="Delete permission"
                        className="is-danger"
                        onClick={() => void removePermission(perm)}
                      >
                        🗑
                      </AdminIconButton>
                    </li>
                  ))}
                </ul>
              )}
              <p className="admin-permission-picker__heading">Add permission</p>
              <FormField label="Name">
                <input
                  value={permForm.name}
                  onChange={(e) => setPermForm((p) => ({ ...p, name: e.target.value }))}
                />
              </FormField>
              <FormField label="Code">
                <input
                  value={permForm.code}
                  onChange={(e) => setPermForm((p) => ({ ...p, code: e.target.value }))}
                />
              </FormField>
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => void addPermission()}
                disabled={crud.saving}
              >
                + Add permission
              </button>
            </>
          )}

          <div className="crm-form__actions">
            <button className="btn btn--primary" type="submit" disabled={crud.saving}>
              {crud.saving ? 'Saving…' : editingId !== null ? 'Save group' : 'Create'}
            </button>
            <button className="btn btn--ghost" type="button" onClick={resetForm} disabled={crud.saving}>
              Cancel
            </button>
          </div>
        </form>
      </AdminModal>

      <AdminConfirmModal
        open={deleteTarget !== null}
        title="Delete group"
        message={deleteTarget ? `Delete group “${deleteTarget.name}”?` : ''}
        confirmLabel="Delete"
        danger
        loading={crud.saving}
        onConfirm={() => void confirmDelete()}
        onCancel={() => setDeleteTarget(null)}
      />
    </section>
  )
}
