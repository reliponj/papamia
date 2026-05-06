import { useState } from 'react'
import * as Select from '@radix-ui/react-select'
import { ChevronDown, Check } from 'lucide-react'
import { AdminModal } from './AdminModal'
import { AdminIconButton } from './AdminIconButton'

type Group = { id: string; name: string; role: string; members: number }

const INITIAL: Group[] = [
  { id: '1', name: 'Kitchen staff', role: 'viewer',  members: 4 },
  { id: '2', name: 'Managers',      role: 'manager', members: 2 },
  { id: '3', name: 'Admins',        role: 'admin',   members: 1 },
]

const ROLES = ['admin', 'manager', 'viewer'] as const

export function AdminGroupsPage() {
  const [groups, setGroups] = useState<Group[]>(INITIAL)
  const [isModalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', role: 'viewer' })

  function resetForm() {
    setForm({ name: '', role: 'viewer' })
    setEditingId(null)
    setModalOpen(false)
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const name = form.name.trim()
    if (!name) return
    if (editingId) {
      setGroups((prev) => prev.map((g) => g.id === editingId ? { ...g, name, role: form.role } : g))
    } else {
      setGroups((prev) => [...prev, { id: String(Date.now()), name, role: form.role, members: 0 }])
    }
    resetForm()
  }

  return (
    <section className="crm-section">
      <header className="crm-section__head">
        <div>
          <h2>Groups</h2>
          <p>Organize staff into groups with shared role permissions.</p>
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
              <th>Default role</th>
              <th>Members</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => (
              <tr key={group.id}>
                <td>{group.name}</td>
                <td>
                  <span className={`crm-badge crm-badge--${group.role}`}>{group.role}</span>
                </td>
                <td>{group.members}</td>
                <td className="crm-table__actions">
                  <AdminIconButton
                    label="Edit group"
                    onClick={() => {
                      setEditingId(group.id)
                      setForm({ name: group.name, role: group.role })
                      setModalOpen(true)
                    }}
                  >✎</AdminIconButton>
                  <AdminIconButton
                    label="Delete group"
                    className="is-danger"
                    onClick={() => setGroups((prev) => prev.filter((g) => g.id !== group.id))}
                  >🗑</AdminIconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AdminModal title={editingId ? 'Edit group' : 'Create group'} open={isModalOpen} onClose={resetForm}>
        <form className="crm-form" onSubmit={onSubmit}>
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
            <span>Default role</span>
            <Select.Root value={form.role} onValueChange={(val) => setForm((p) => ({ ...p, role: val }))}>
              <Select.Trigger className="crm-select-trigger" aria-label="Default role">
                <Select.Value />
                <Select.Icon asChild>
                  <ChevronDown size={16} className="crm-select-trigger__icon" />
                </Select.Icon>
              </Select.Trigger>
              <Select.Portal>
                <Select.Content className="crm-select-content" position="popper" sideOffset={4}>
                  <Select.Viewport>
                    {ROLES.map((role) => (
                      <Select.Item key={role} value={role} className="crm-select-item">
                        <Select.ItemText>{role}</Select.ItemText>
                        <Select.ItemIndicator><Check size={14} /></Select.ItemIndicator>
                      </Select.Item>
                    ))}
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
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
