import { useMemo, useState, type FormEvent } from 'react'
import { useAdminData } from '../../contexts/AdminDataContext'
import { AdminModal } from './AdminModal'
import { AdminIconButton } from './AdminIconButton'

export function AdminProductsPage() {
  const { categories, products, addProduct, updateProduct, removeProduct } = useAdminData()
  const [query, setQuery] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isModalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({
    name: '',
    price: '0',
    categoryId: categories[0]?.id ?? '',
    image: '',
    inStock: true,
  })

  const categoryNameById = useMemo(
    () => new Map(categories.map((category) => [category.id, category.name])),
    [categories],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return products
    return products.filter((product) => {
      const categoryName = categoryNameById.get(product.categoryId) ?? ''
      return `${product.name} ${categoryName}`.toLowerCase().includes(q)
    })
  }, [products, query, categoryNameById])

  function resetForm() {
    setForm({
      name: '',
      price: '0',
      categoryId: categories[0]?.id ?? '',
      image: '',
      inStock: true,
    })
    setEditingId(null)
    setModalOpen(false)
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const parsedPrice = Number.parseFloat(form.price)
    if (!form.name.trim() || !Number.isFinite(parsedPrice) || parsedPrice < 0) return
    if (!form.categoryId) return

    const payload = {
      name: form.name.trim(),
      price: parsedPrice,
      categoryId: form.categoryId,
      image:
        form.image.trim() ||
        'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300&q=80',
      inStock: form.inStock,
    }

    if (editingId) updateProduct(editingId, payload)
    else addProduct(payload)
    resetForm()
  }

  function openCreate() {
    setEditingId(null)
    setForm({
      name: '',
      price: '0',
      categoryId: categories[0]?.id ?? '',
      image: '',
      inStock: true,
    })
    setModalOpen(true)
  }

  return (
    <section className="crm-section">
      <header className="crm-section__head">
        <div>
          <h2>Products</h2>
          <p>Maintain menu items and stock visibility.</p>
        </div>
        <div className="crm-toolbar">
          <input
            className="crm-search"
            placeholder="Search products"
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
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => (
              <tr key={product.id}>
                <td>
                  <img src={product.image} alt={product.name} className="crm-thumb" loading="lazy" />
                </td>
                <td>{product.name}</td>
                <td>{product.price.toFixed(2)} MDL</td>
                <td>{categoryNameById.get(product.categoryId) ?? 'No category'}</td>
                <td>
                  <span className={`crm-badge ${product.inStock ? 'crm-badge--ok' : 'crm-badge--warn'}`}>
                    {product.inStock ? 'In stock' : 'Out of stock'}
                  </span>
                </td>
                <td className="crm-table__actions">
                  <AdminIconButton
                    label="Edit product"
                    onClick={() => {
                      setEditingId(product.id)
                      setForm({
                        name: product.name,
                        price: product.price.toString(),
                        categoryId: product.categoryId,
                        image: product.image,
                        inStock: product.inStock,
                      })
                      setModalOpen(true)
                    }}
                  >
                    ✎
                  </AdminIconButton>
                  <AdminIconButton label="Delete product" className="is-danger" onClick={() => removeProduct(product.id)}>
                    🗑
                  </AdminIconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AdminModal title={editingId ? 'Edit product' : 'Create product'} open={isModalOpen} onClose={resetForm}>
        <form className="crm-form" onSubmit={onSubmit}>
          <label className="field">
            <span>Name</span>
            <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
          </label>
          <label className="field">
            <span>Price (MDL)</span>
            <input
              type="number"
              min={0}
              step="0.01"
              value={form.price}
              onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
              required
            />
          </label>
          <label className="field">
            <span>Category</span>
            <select
              value={form.categoryId}
              onChange={(e) => setForm((p) => ({ ...p, categoryId: e.target.value }))}
              required
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Image URL</span>
            <input value={form.image} onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))} />
          </label>
          <label className="admin-check">
            <input
              type="checkbox"
              checked={form.inStock}
              onChange={(e) => setForm((p) => ({ ...p, inStock: e.target.checked }))}
            />
            <span>In stock</span>
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
