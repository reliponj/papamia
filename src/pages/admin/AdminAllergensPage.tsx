import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  createAllergen,
  deleteAllergen,
  listAllergens,
  updateAllergen,
  type AllergenDto,
} from '../../api/admin/allergen'
import { AdminModal } from './AdminModal'
import { AdminIconButton } from './AdminIconButton'

export function AdminAllergensPage() {
  const [items, setItems] = useState<AllergenDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isModalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ name: '' })
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setError(null)
    setLoading(true)
    try {
      const list = await listAllergens()
      list.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }))
      setItems(list)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load allergens')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter((row) => row.name.toLowerCase().includes(q))
  }, [items, query])

  function resetForm() {
    setForm({ name: '' })
    setEditingId(null)
    setModalOpen(false)
  }

  async function submitAllergen() {
    const name = form.name.trim()
    if (!name) return
    setSaving(true)
    setError(null)
    try {
      if (editingId !== null) {
        const updated = await updateAllergen(editingId, { name })
        setItems((prev) => {
          const next = prev.map((x) => (x.id === updated.id ? updated : x))
          next.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }))
          return next
        })
      } else {
        const created = await createAllergen({ name })
        setItems((prev) => {
          const next = [...prev.filter((x) => x.id !== created.id), created]
          next.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }))
          return next
        })
      }
      resetForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  function openCreate() {
    setEditingId(null)
    setForm({ name: '' })
    setModalOpen(true)
  }

  async function onDelete(row: AllergenDto) {
    if (!window.confirm(`Delete allergen “${row.name}”?`)) return
    setError(null)
    try {
      await deleteAllergen(row.id)
      setItems((prev) => prev.filter((x) => x.id !== row.id))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed')
    }
  }

  return (
    <section className="crm-section">
      <header className="crm-section__head">
        <div>
          <h2>Allergens</h2>
          <p>Maintain allergen labels used on the menu.</p>
        </div>
        <div className="crm-toolbar">
          <input
            className="crm-search"
            placeholder="Search allergens"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="btn btn--primary" type="button" onClick={openCreate} disabled={loading}>
            + Add
          </button>
          <button className="btn btn--ghost" type="button" onClick={() => void load()} disabled={loading}>
            Refresh
          </button>
        </div>
      </header>

      {error && (
        <p style={{ color: '#ff9580', margin: '0 0 0.75rem' }} role="alert">
          {error}
        </p>
      )}

      {loading ? (
        <p style={{ color: 'var(--muted)', margin: 0 }}>Loading…</p>
      ) : (
        <div className="crm-table-wrap">
          <table className="crm-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.name}</td>
                  <td className="crm-table__actions">
                    <AdminIconButton
                      label="Edit allergen"
                      onClick={() => {
                        setEditingId(row.id)
                        setForm({ name: row.name })
                        setModalOpen(true)
                      }}
                    >
                      ✎
                    </AdminIconButton>
                    <AdminIconButton
                      label="Delete allergen"
                      className="is-danger"
                      onClick={() => void onDelete(row)}
                    >
                      🗑
                    </AdminIconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AdminModal
        title={editingId !== null ? 'Edit allergen' : 'Create allergen'}
        open={isModalOpen}
        onClose={resetForm}
      >
        <form
          className="crm-form"
          onSubmit={(e) => {
            e.preventDefault()
            void submitAllergen()
          }}
        >
          <div className="field">
            <span>Name</span>
            <input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="e.g. Gluten"
              required
              autoFocus
            />
          </div>
          <div className="crm-form__actions">
            <button className="btn btn--primary" type="submit" disabled={saving}>
              {saving ? 'Saving…' : editingId !== null ? 'Save' : 'Create'}
            </button>
            <button className="btn btn--ghost" type="button" onClick={resetForm} disabled={saving}>
              Cancel
            </button>
          </div>
        </form>
      </AdminModal>
    </section>
  )
}
