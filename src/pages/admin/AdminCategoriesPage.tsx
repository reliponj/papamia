import { useMemo, useState, type FormEvent } from 'react'
import { useAdminData } from '../../contexts/AdminDataContext'
import { AdminModal } from './AdminModal'
import { AdminIconButton } from './AdminIconButton'

export function AdminCategoriesPage() {
  const { categories, products, addCategory, updateCategory, removeCategory } = useAdminData()
  const [query, setQuery] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isModalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ name: '', slug: '' })

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return categories
    return categories.filter((category) => `${category.name} ${category.slug}`.toLowerCase().includes(q))
  }, [categories, query])

  function resetForm() {
    setForm({ name: '', slug: '' })
    setEditingId(null)
    setModalOpen(false)
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const payload = { name: form.name.trim(), slug: form.slug.trim().toLowerCase() }
    if (!payload.name || !payload.slug) return
    if (editingId) updateCategory(editingId, payload)
    else addCategory(payload)
    resetForm()
  }

  function openCreate() {
    setEditingId(null)
    setForm({ name: '', slug: '' })
    setModalOpen(true)
  }

  return (
    <section className="crm-section">
      <header className="crm-section__head">
        <div>
          <h2>Categories</h2>
          <p>Organize products by logical menu groups.</p>
        </div>
        <div className="crm-toolbar">
          <input
            className="crm-search"
            placeholder="Search categories"
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
              <th>Slug</th>
              <th>Linked products</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((category) => {
              const linked = products.filter((product) => product.categoryId === category.id).length
              return (
                <tr key={category.id}>
                  <td>{category.name}</td>
                  <td>{category.slug}</td>
                  <td>{linked}</td>
                  <td className="crm-table__actions">
                    <AdminIconButton
                      label="Edit category"
                      onClick={() => {
                        setEditingId(category.id)
                        setForm({ name: category.name, slug: category.slug })
                        setModalOpen(true)
                      }}
                    >
                      ✎
                    </AdminIconButton>
                    <AdminIconButton
                      label="Delete category"
                      className="is-danger"
                      onClick={() => {
                        const res = removeCategory(category.id)
                        if (!res.ok) window.alert(res.reason ?? 'Unable to delete category')
                      }}
                    >
                      🗑
                    </AdminIconButton>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <AdminModal title={editingId ? 'Edit category' : 'Create category'} open={isModalOpen} onClose={resetForm}>
        <form className="crm-form" onSubmit={onSubmit}>
          <label className="field">
            <span>Name</span>
            <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
          </label>
          <label className="field">
            <span>Slug</span>
            <input value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} required />
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
