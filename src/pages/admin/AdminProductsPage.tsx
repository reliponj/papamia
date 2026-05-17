import { useMemo, useState, type FormEvent } from 'react'
import * as Select from '@radix-ui/react-select'
import * as Switch from '@radix-ui/react-switch'
import { ChevronDown, Check } from 'lucide-react'
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
    () => new Map(categories.map((c) => [c.id, c.name])),
    [categories],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return products
    return products.filter((p) => {
      const cat = categoryNameById.get(p.categoryId) ?? ''
      return `${p.name} ${cat}`.toLowerCase().includes(q)
    })
  }, [products, query, categoryNameById])

  function resetForm() {
    setForm({ name: '', price: '0', categoryId: categories[0]?.id ?? '', image: '', inStock: true })
    setEditingId(null)
    setModalOpen(false)
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const parsedPrice = Number.parseFloat(form.price)
    if (!form.name.trim() || !Number.isFinite(parsedPrice) || parsedPrice < 0 || !form.categoryId) return
    const payload = {
      name: form.name.trim(),
      price: parsedPrice,
      categoryId: form.categoryId,
      image: form.image.trim() || 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300&q=80',
      inStock: form.inStock,
    }
    if (editingId) updateProduct(editingId, payload)
    else addProduct(payload)
    resetForm()
  }

  function openCreate() {
    setEditingId(null)
    setForm({ name: '', price: '0', categoryId: categories[0]?.id ?? '', image: '', inStock: true })
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
          <button className="btn btn--primary" type="button" onClick={openCreate}>+ Add</button>
        </div>
      </header>

      <div className="crm-table-wrap">
        <table className="crm-table">
          <thead>
            <tr>
              <th>Image</th><th>Name</th><th>Price</th><th>Category</th><th>Stock</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => (
              <tr key={product.id}>
                <td><img src={product.image} alt={product.name} className="crm-thumb" loading="lazy" /></td>
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
                  >✎</AdminIconButton>
                  <AdminIconButton label="Delete product" className="is-danger" onClick={() => removeProduct(product.id)}>🗑</AdminIconButton>
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
            <input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="e.g. Margherita"
              required
            />
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

          <div className="field">
            <span>Category</span>
            <Select.Root
              value={form.categoryId}
              onValueChange={(val) => setForm((p) => ({ ...p, categoryId: val }))}
            >
              <Select.Trigger className="crm-select-trigger" aria-label="Category">
                <Select.Value placeholder="Select category" />
                <Select.Icon asChild>
                  <ChevronDown size={16} className="crm-select-trigger__icon" />
                </Select.Icon>
              </Select.Trigger>
              <Select.Portal>
                <Select.Content className="crm-select-content" position="popper" sideOffset={4}>
                  <Select.Viewport>
                    {categories.map((cat) => (
                      <Select.Item key={cat.id} value={cat.id} className="crm-select-item">
                        <Select.ItemText>{cat.name}</Select.ItemText>
                        <Select.ItemIndicator>
                          <Check size={14} />
                        </Select.ItemIndicator>
                      </Select.Item>
                    ))}
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          </div>

          <label className="field">
            <span>Image URL</span>
            <input
              value={form.image}
              onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))}
              placeholder="https://…"
            />
          </label>

          <div className="crm-switch-row">
            <label className="crm-switch-label" htmlFor="instock-switch">In stock</label>
            <Switch.Root
              id="instock-switch"
              className="crm-switch"
              checked={form.inStock}
              onCheckedChange={(val) => setForm((p) => ({ ...p, inStock: val }))}
            >
              <Switch.Thumb className="crm-switch__thumb" />
            </Switch.Root>
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
