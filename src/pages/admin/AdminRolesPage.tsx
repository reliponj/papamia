import { useState, useEffect, useCallback } from 'react'
import { AdminModal } from './AdminModal'
import { AdminIconButton } from './AdminIconButton'
import {
  type AdminRole,
  listRoles,
  createRole,
  updateRole,
  deleteRole,
} from '../../api/adminRoles'

type Form = { name: string; code: string; description: string }

const EMPTY_FORM: Form = { name: '', code: '', description: '' }

export function AdminRolesPage() {
  const [roles, setRoles] = useState<AdminRole[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const [isModalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<Form>(EMPTY_FORM)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setRoles(await listRoles())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load roles')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void load() }, [load])

  function openCreate() {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setModalOpen(true)
  }

  function openEdit(role: AdminRole) {
    setEditingId(role.id)
    setForm({ name: role.name, code: role.code, description: role.description })
    setModalOpen(true)
  }

  function resetForm() {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setModalOpen(false)
  }

  async function onSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    const name = form.name.trim()
    const code = form.code.trim()
    if (!name || !code) return
    setSaving(true)
    setError(null)
    try {
      const payload = {
        name,
        code,
        description: form.description.trim(),
        isSystem: false,
        permissionIds: [],
      }
      if (editingId !== null) {
        const updated = await updateRole(editingId, payload)
        setRoles((prev) => prev.map((r) => r.id === updated.id ? updated : r))
      } else {
        const created = await createRole(payload)
        setRoles((prev) => [...prev, created])
      }
      resetForm()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  async function onDelete(id: number) {
    setError(null)
    try {
      await deleteRole(id)
      setRoles((prev) => prev.filter((r) => r.id !== id))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed')
    }
  }

  return (
    <section className="crm-section">
      <header className="crm-section__head">
        <div>
          <h2>Roles</h2>
          <p>Define permission roles assigned to staff accounts.</p>
        </div>
        <div className="crm-toolbar">
          <button className="btn btn--primary" type="button" onClick={openCreate}>+ Add</button>
        </div>
      </header>

      {error && <p className="crm-error">{error}</p>}

      <div className="crm-table-wrap">
        {loading ? (
          <p className="crm-loading">Loading…</p>
        ) : (
          <table className="crm-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Code</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => (
                <tr key={role.id}>
                  <td>
                    <span className={`crm-badge crm-badge--${role.code === 'admin' ? 'admin' : role.code === 'manager' ? 'manager' : 'viewer'}`}>
                      {role.name}
                    </span>
                  </td>
                  <td>{role.code}</td>
                  <td>{role.description}</td>
                  <td className="crm-table__actions">
                    <AdminIconButton label="Edit role" onClick={() => openEdit(role)}>✎</AdminIconButton>
                    <AdminIconButton
                      label="Delete role"
                      className="is-danger"
                      onClick={() => void onDelete(role.id)}
                    >🗑</AdminIconButton>
                  </td>
                </tr>
              ))}
              {roles.length === 0 && (
                <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--color-muted)' }}>No roles yet</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <AdminModal title={editingId !== null ? 'Edit role' : 'Create role'} open={isModalOpen} onClose={resetForm}>
        <form className="crm-form" onSubmit={(e) => void onSubmit(e)}>
          <div className="field">
            <span>Name</span>
            <input
              value={form.name}
              placeholder="e.g. Manager"
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              required
            />
          </div>
          <div className="field">
            <span>Code</span>
            <input
              value={form.code}
              placeholder="e.g. manager"
              onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))}
              required
            />
          </div>
          <div className="field">
            <span>Description</span>
            <input
              value={form.description}
              placeholder="What can this role do?"
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            />
          </div>
          <div className="crm-form__actions">
            <button className="btn btn--primary" type="submit" disabled={saving}>
              {saving ? 'Saving…' : editingId !== null ? 'Save' : 'Create'}
            </button>
            <button className="btn btn--ghost" type="button" onClick={resetForm}>Cancel</button>
          </div>
        </form>
      </AdminModal>
    </section>
  )
}
