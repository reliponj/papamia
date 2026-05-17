import { useEffect, useState } from 'react'
import {
  createUser,
  deleteUser,
  fetchUserRoles,
  listUsers,
  updateUser,
  updateUserRoles,
  type UserDto,
} from '../../api/admin/user'
import type { UserCreatePayload, UserUpdatePayload } from '../../api/admin/types'
import { listRoles, type RoleListDto } from '../../api/admin/role'
import { AdminModal } from './AdminModal'
import { AdminIconButton } from './AdminIconButton'
import { AdminPageHeader } from './_shared/AdminPageHeader'
import { AdminDataTable } from './_shared/AdminDataTable'
import { AdminAlert } from './_shared/AdminAlert'
import { FormField } from './_shared/FormField'
import { AdminConfirmModal } from './_shared/AdminConfirmModal'
import { useCrudResource } from './_shared/useCrudResource'
import { RolePicker } from './_shared/RolePicker'

type UserForm = {
  username: string
  email: string
  password: string
}

const emptyUserForm: UserForm = { username: '', email: '', password: '' }

function formatLogin(iso: string | null): string {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleString()
  } catch {
    return iso
  }
}

export function AdminUsersPage() {
  const crud = useCrudResource<UserDto>({
    loadItems: listUsers,
    getId: (row) => row.id,
    sortItems: (a, b) => a.username.localeCompare(b.username),
    filterItem: (row, q) =>
      `${row.username} ${row.email} ${row.lastIp ?? ''}`.toLowerCase().includes(q),
  })

  const [allRoles, setAllRoles] = useState<RoleListDto[]>([])
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isModalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(emptyUserForm)
  const [deleteTarget, setDeleteTarget] = useState<UserDto | null>(null)

  const [rolesUser, setRolesUser] = useState<UserDto | null>(null)
  const [roleIds, setRoleIds] = useState<number[]>([])
  const [rolesLoading, setRolesLoading] = useState(false)
  const [rolesSaving, setRolesSaving] = useState(false)
  const [rolesError, setRolesError] = useState<string | null>(null)

  useEffect(() => {
    listRoles()
      .then(setAllRoles)
      .catch(() => setAllRoles([]))
  }, [])

  function resetForm() {
    setForm(emptyUserForm)
    setEditingId(null)
    setModalOpen(false)
  }

  function openCreate() {
    setEditingId(null)
    setForm(emptyUserForm)
    setModalOpen(true)
  }

  function openEdit(row: UserDto) {
    setEditingId(row.id)
    setForm({ username: row.username, email: row.email, password: '' })
    setModalOpen(true)
  }

  async function openRoles(row: UserDto) {
    setRolesUser(row)
    setRolesError(null)
    setRolesLoading(true)
    setRoleIds([])
    try {
      const roles = await fetchUserRoles(row.id)
      setRoleIds(roles.map((r) => r.id))
    } catch (e) {
      setRolesError(e instanceof Error ? e.message : 'Failed to load roles')
    } finally {
      setRolesLoading(false)
    }
  }

  function closeRolesModal() {
    setRolesUser(null)
    setRoleIds([])
    setRolesError(null)
  }

  async function saveRoles() {
    if (!rolesUser) return
    setRolesSaving(true)
    setRolesError(null)
    try {
      await updateUserRoles(rolesUser.id, roleIds)
      closeRolesModal()
    } catch (e) {
      setRolesError(e instanceof Error ? e.message : 'Failed to save roles')
    } finally {
      setRolesSaving(false)
    }
  }

  async function submitUser() {
    if (editingId !== null) {
      const payload: UserUpdatePayload = {
        username: form.username.trim(),
        email: form.email.trim(),
      }
      if (!payload.username || !payload.email) return
      await crud.runMutation(async () => {
        crud.upsertItem(await updateUser(editingId, payload))
        resetForm()
      }, 'Save failed')
    } else {
      const payload: UserCreatePayload = {
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
      }
      if (!payload.username || !payload.email || !payload.password) return
      await crud.runMutation(async () => {
        crud.upsertItem(await createUser(payload))
        resetForm()
      }, 'Save failed')
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    const target = deleteTarget
    await crud.runMutation(async () => {
      await deleteUser(target.id)
      crud.removeItemById(target.id)
      setDeleteTarget(null)
    }, 'Delete failed')
  }

  return (
    <section className="crm-section">
      <AdminPageHeader
        title="Users"
        description="Staff and customer accounts (API)."
        searchPlaceholder="Search users"
        query={crud.query}
        onQueryChange={crud.setQuery}
        onAdd={openCreate}
        onRefresh={() => void crud.reload()}
        loading={crud.loading}
      />

      {crud.error && <AdminAlert message={crud.error} />}

      <AdminDataTable
        columns={[
          { key: 'username', header: 'Username', render: (row) => row.username },
          { key: 'email', header: 'Email', render: (row) => row.email },
          { key: 'lastLogin', header: 'Last login', render: (row) => formatLogin(row.lastLogin) },
          { key: 'lastIp', header: 'Last IP', render: (row) => row.lastIp ?? '—' },
        ]}
        rows={crud.filteredItems}
        rowKey={(row) => row.id}
        loading={crud.loading}
        emptyMessage="No users yet."
        actions={(row) => (
          <>
            <AdminIconButton label="Manage roles" onClick={() => void openRoles(row)}>
              ⚿
            </AdminIconButton>
            <AdminIconButton label="Edit user" onClick={() => openEdit(row)}>
              ✎
            </AdminIconButton>
            <AdminIconButton
              label="Delete user"
              className="is-danger"
              onClick={() => setDeleteTarget(row)}
            >
              🗑
            </AdminIconButton>
          </>
        )}
      />

      <AdminModal
        title={editingId !== null ? 'Edit user' : 'Create user'}
        open={isModalOpen}
        onClose={resetForm}
      >
        <form
          className="crm-form"
          onSubmit={(e) => {
            e.preventDefault()
            void submitUser()
          }}
        >
          <FormField label="Username">
            <input
              value={form.username}
              onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
              required
            />
          </FormField>
          <FormField label="Email">
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              required
            />
          </FormField>
          {editingId === null && (
            <FormField label="Password">
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                required
                autoComplete="new-password"
              />
            </FormField>
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

      <AdminModal
        title={rolesUser ? `Roles — ${rolesUser.username}` : 'Roles'}
        open={rolesUser !== null}
        onClose={closeRolesModal}
      >
        {rolesError && <AdminAlert message={rolesError} />}
        {rolesLoading ? (
          <p className="admin-table-state">Loading roles…</p>
        ) : (
          <RolePicker roles={allRoles} selectedIds={roleIds} onChange={setRoleIds} />
        )}
        <div className="crm-form__actions" style={{ marginTop: '1rem' }}>
          <button
            type="button"
            className="btn btn--primary"
            disabled={rolesSaving || rolesLoading}
            onClick={() => void saveRoles()}
          >
            {rolesSaving ? 'Saving…' : 'Save roles'}
          </button>
          <button type="button" className="btn btn--ghost" onClick={closeRolesModal} disabled={rolesSaving}>
            Cancel
          </button>
        </div>
      </AdminModal>

      <AdminConfirmModal
        open={deleteTarget !== null}
        title="Delete user"
        message={deleteTarget ? `Delete user “${deleteTarget.username}”?` : ''}
        confirmLabel="Delete"
        danger
        loading={crud.saving}
        onConfirm={() => void confirmDelete()}
        onCancel={() => setDeleteTarget(null)}
      />
    </section>
  )
}
