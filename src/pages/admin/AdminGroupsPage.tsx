import { useState, useEffect, useCallback } from 'react'
import { AdminModal } from './AdminModal'
import { AdminIconButton } from './AdminIconButton'
import {
  type AdminPermissionGroup,
  listPermissionGroups,
  createPermissionGroup,
  updatePermissionGroup,
  deletePermissionGroup,
} from '../../api/adminPermissionGroups'

type Form = { name: string; code: string; description: string }

const EMPTY_FORM: Form = { name: '', code: '', description: '' }

export function AdminGroupsPage() {
  const [groups, setGroups] = useState<AdminPermissionGroup[]>([])
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
      setGroups(await listPermissionGroups())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load groups')
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

  function openEdit(group: AdminPermissionGroup) {
    setEditingId(group.id)
    setForm({ name: group.name, code: group.code, description: group.description })
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
        permissionIds: editingId !== null
          ? (groups.find((g) => g.id === editingId)?.permissionIds ?? [])
          : [],
      }
      if (editingId !== null) {
        const updated = await updatePermissionGroup(editingId, payload)
        setGroups((prev) => prev.map((g) => g.id === updated.id ? updated : g))
      } else {
        const created = await createPermissionGroup(payload)
        setGroups((prev) => [...prev, created])
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
      await deletePermissionGroup(id)
      setGroups((prev) => prev.filter((g) => g.id !== id))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed')
    }
  }

  return (
    <section className="crm-section">
      <header className="crm-section__head">
        <div>
          <h2>Permission Groups</h2>
          <p>Organize permissions into named groups for easier role management.</p>
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
                <th>Permissions</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((group) => (
                <tr key={group.id}>
                  <td>{group.name}</td>
                  <td><span className="crm-badge crm-badge--viewer">{group.code}</span></td>
                  <td>{group.description}</td>
                  <td>{group.permissionIds.length}</td>
                  <td className="crm-table__actions">
                    <AdminIconButton label="Edit group" onClick={() => openEdit(group)}>✎</AdminIconButton>
                    <AdminIconButton
                      label="Delete group"
                      className="is-danger"
                      onClick={() => void onDelete(group.id)}
                    >🗑</AdminIconButton>
                  </td>
                </tr>
              ))}
              {groups.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--color-muted)' }}>No groups yet</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <AdminModal title={editingId !== null ? 'Edit group' : 'Create group'} open={isModalOpen} onClose={resetForm}>
        <form className="crm-form" onSubmit={(e) => void onSubmit(e)}>
          <div className="field">
            <span>Name</span>
            <input
              value={form.name}
              placeholder="e.g. Kitchen staff"
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              required
            />
          </div>
          <div className="field">
            <span>Code</span>
            <input
              value={form.code}
              placeholder="e.g. kitchen_staff"
              onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))}
              required
            />
          </div>
          <div className="field">
            <span>Description</span>
            <input
              value={form.description}
              placeholder="What does this group cover?"
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
