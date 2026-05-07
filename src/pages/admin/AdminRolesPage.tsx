import { useState } from 'react'
import { AdminModal } from './AdminModal'
import { AdminIconButton } from './AdminIconButton'

type Role = { id: string; name: string; description: string }

const INITIAL: Role[] = [
  { id: '1', name: 'admin',   description: 'Full access to all CRM features' },
  { id: '2', name: 'manager', description: 'Can manage menu and orders'       },
  { id: '3', name: 'viewer',  description: 'Read-only access'                 },
]

export function AdminRolesPage() {
  const [roles, setRoles] = useState<Role[]>(INITIAL)
  const [isModalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', description: '' })

  function resetForm() {
    setForm({ name: '', description: '' })
    setEditingId(null)
    setModalOpen(false)
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const name = form.name.trim()
    const description = form.description.trim()
    if (!name) return
    if (editingId) {
      setRoles((prev) => prev.map((r) => r.id === editingId ? { ...r, name, description } : r))
    } else {
      setRoles((prev) => [...prev, { id: String(Date.now()), name, description }])
    }
    resetForm()
  }

  return (
    <section className="crm-section">
      <header className="crm-section__head">
        <div>
          <h2>Roles</h2>
          <p>Define permission roles assigned to staff accounts.</p>
        </div>
        <div className="crm-toolbar">
          <button className="btn btn--primary" type="button" onClick={() => setModalOpen(true)}>+ Add</button>
        </div>
      </header>

      <div className="crm-table-wrap">
        <table className="crm-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.id}>
                <td>
                  <span className={`crm-badge crm-badge--${role.name === 'admin' ? 'admin' : role.name === 'manager' ? 'manager' : 'viewer'}`}>
                    {role.name}
                  </span>
                </td>
                <td>{role.description}</td>
                <td className="crm-table__actions">
                  <AdminIconButton
                    label="Edit role"
                    onClick={() => {
                      setEditingId(role.id)
                      setForm({ name: role.name, description: role.description })
                      setModalOpen(true)
                    }}
                  >✎</AdminIconButton>
                  <AdminIconButton
                    label="Delete role"
                    className="is-danger"
                    onClick={() => setRoles((prev) => prev.filter((r) => r.id !== role.id))}
                  >🗑</AdminIconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AdminModal title={editingId ? 'Edit role' : 'Create role'} open={isModalOpen} onClose={resetForm}>
        <form className="crm-form" onSubmit={onSubmit}>
          <div className="field">
            <span>Name</span>
            <input
              value={form.name}
              placeholder="e.g. editor"
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
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
            <button className="btn btn--primary" type="submit">{editingId ? 'Save' : 'Create'}</button>
            <button className="btn btn--ghost" type="button" onClick={resetForm}>Cancel</button>
          </div>
        </form>
      </AdminModal>
    </section>
  )
}
