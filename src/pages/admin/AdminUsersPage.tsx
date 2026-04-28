import { useMemo, useState, type FormEvent } from 'react'
import { useAdminData, type AdminUserRole } from '../../contexts/AdminDataContext'
import { AdminModal } from './AdminModal'
import { AdminIconButton } from './AdminIconButton'

export function AdminUsersPage() {
  const { users, addUser, updateUser, removeUser } = useAdminData()
  const [query, setQuery] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isModalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', role: 'viewer' as AdminUserRole })

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return users
    return users.filter((u) => `${u.name} ${u.email} ${u.role}`.toLowerCase().includes(q))
  }, [users, query])

  function resetForm() {
    setForm({ name: '', email: '', role: 'viewer' })
    setEditingId(null)
    setModalOpen(false)
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const payload = { name: form.name.trim(), email: form.email.trim(), role: form.role }
    if (!payload.name || !payload.email) return
    if (editingId) updateUser(editingId, payload)
    else addUser(payload)
    resetForm()
  }

  function openCreate() {
    setEditingId(null)
    setForm({ name: '', email: '', role: 'viewer' })
    setModalOpen(true)
  }

  return (
    <section className="crm-section">
      <header className="crm-section__head">
        <div>
          <h2>Users</h2>
          <p>Manage admin and staff accounts.</p>
        </div>
        <div className="crm-toolbar">
          <input
            className="crm-search"
            placeholder="Search users"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="btn btn--primary" type="button" onClick={openCreate}>
            + Add
          </button>
        </div>
      </header>

      <div className="crm-table-wrap">
        <table className="crm-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td><span className={`crm-badge crm-badge--${user.role}`}>{user.role}</span></td>
                <td className="crm-table__actions">
                  <AdminIconButton
                    label="Edit user"
                    onClick={() => {
                      setEditingId(user.id)
                      setForm({ name: user.name, email: user.email, role: user.role })
                      setModalOpen(true)
                    }}
                  >
                    ✎
                  </AdminIconButton>
                  <AdminIconButton label="Delete user" onClick={() => removeUser(user.id)} className="is-danger">
                    🗑
                  </AdminIconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AdminModal title={editingId ? 'Edit user' : 'Create user'} open={isModalOpen} onClose={resetForm}>
        <form className="crm-form" onSubmit={onSubmit}>
          <label className="field">
            <span>Name</span>
            <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
          </label>
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              required
            />
          </label>
          <label className="field">
            <span>Role</span>
            <select
              value={form.role}
              onChange={(e) => setForm((p) => ({ ...p, role: e.target.value as AdminUserRole }))}
            >
              <option value="admin">admin</option>
              <option value="manager">manager</option>
              <option value="viewer">viewer</option>
            </select>
          </label>
          <div className="crm-form__actions">
            <button className="btn btn--primary" type="submit">{editingId ? 'Save' : 'Create'}</button>
            <button className="btn btn--ghost" type="button" onClick={resetForm}>
              Cancel
            </button>
          </div>
        </form>
      </AdminModal>
    </section>
  )
}
