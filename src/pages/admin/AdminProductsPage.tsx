import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import * as Select from '@radix-ui/react-select'
import * as Switch from '@radix-ui/react-switch'
import { ChevronDown, Check } from 'lucide-react'
import { listCategories, type CategoryDto } from '../../api/admin/category'
import {
  createProduct,
  deleteProduct,
  listProducts,
  updateProduct,
  type ProductListDto,
} from '../../api/admin/product'
import type { ProductCreatePayload, ProductUpdatePayload } from '../../api/admin/types'
import { formatPriceMdl, majorToMinor, minorToMajor } from '../../api/admin/money'
import { AdminModal } from './AdminModal'
import { AdminIconButton } from './AdminIconButton'
import { AdminPageHeader } from './_shared/AdminPageHeader'
import { AdminDataTable } from './_shared/AdminDataTable'
import { AdminAlert } from './_shared/AdminAlert'
import { FormField } from './_shared/FormField'
import { AdminConfirmModal } from './_shared/AdminConfirmModal'
import { useCrudResource } from './_shared/useCrudResource'

type FormState = {
  name: string
  description: string
  priceMdl: string
  imageUrl: string
  weight: number
  weightType: string
  allergens: string
  categoryId: string
  isActive: boolean
}

const emptyForm = (categoryId: string): FormState => ({
  name: '',
  description: '',
  priceMdl: '0',
  imageUrl: '',
  weight: 500,
  weightType: 'g',
  allergens: '',
  categoryId,
  isActive: true,
})

function toPayload(form: FormState): ProductCreatePayload | null {
  const priceMajor = Number.parseFloat(form.priceMdl)
  const categoryId = Number(form.categoryId)
  if (!form.name.trim() || !Number.isFinite(priceMajor) || priceMajor < 0 || !Number.isFinite(categoryId)) {
    return null
  }
  return {
    name: form.name.trim(),
    description: form.description.trim(),
    price: majorToMinor(priceMajor),
    imageUrl: form.imageUrl.trim(),
    weight: Number(form.weight),
    weightType: form.weightType.trim() || 'g',
    allergens: form.allergens.trim(),
    categoryId,
  }
}

export function AdminProductsPage() {
  const [categories, setCategories] = useState<CategoryDto[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const categoryFilterRef = useRef<number | undefined>(undefined)

  const loadProducts = useCallback(async () => {
    return listProducts(categoryFilterRef.current)
  }, [])

  const crud = useCrudResource<ProductListDto>({
    loadItems: loadProducts,
    getId: (row) => row.id,
    sortItems: (a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }),
    filterItem: (row, q) => row.name.toLowerCase().includes(q),
  })

  const categoryNameById = useMemo(
    () => new Map(categories.map((c) => [c.id, c.name])),
    [categories],
  )

  const [editingId, setEditingId] = useState<number | null>(null)
  const [isModalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState<FormState>(emptyForm(''))
  const [deleteTarget, setDeleteTarget] = useState<ProductListDto | null>(null)

  useEffect(() => {
    let cancelled = false
    setCategoriesLoading(true)
    listCategories()
      .then((list) => {
        if (!cancelled) {
          list.sort((a, b) => a.sort - b.sort)
          setCategories(list)
        }
      })
      .catch(() => {
        if (!cancelled) setCategories([])
      })
      .finally(() => {
        if (!cancelled) setCategoriesLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const skipFilterReload = useRef(true)
  useEffect(() => {
    categoryFilterRef.current =
      categoryFilter === 'all' ? undefined : Number(categoryFilter)
    if (skipFilterReload.current) {
      skipFilterReload.current = false
      return
    }
    void crud.reload()
  }, [categoryFilter, crud.reload])

  const defaultCategoryId = categories[0] ? String(categories[0].id) : ''

  function resetForm() {
    setForm(emptyForm(defaultCategoryId))
    setEditingId(null)
    setModalOpen(false)
  }

  function openCreate() {
    setEditingId(null)
    setForm(emptyForm(defaultCategoryId))
    setModalOpen(true)
  }

  function openEdit(row: ProductListDto) {
    setEditingId(row.id)
    setForm({
      name: row.name,
      description: row.description,
      priceMdl: minorToMajor(row.price).toFixed(2),
      imageUrl: row.imageUrl,
      weight: row.weight,
      weightType: row.weightType,
      allergens: row.allergens,
      categoryId: String(row.categoryId),
      isActive: row.isActive,
    })
    setModalOpen(true)
  }

  async function submitProduct() {
    const base = toPayload(form)
    if (!base) return

    await crud.runMutation(async () => {
      if (editingId !== null) {
        const payload: ProductUpdatePayload = { ...base, isActive: form.isActive }
        crud.upsertItem(await updateProduct(editingId, payload))
      } else {
        crud.upsertItem(await createProduct(base))
      }
      resetForm()
    }, 'Save failed')
  }

  async function toggleActive(row: ProductListDto) {
    const payload: ProductUpdatePayload = {
      name: row.name,
      description: row.description,
      price: row.price,
      imageUrl: row.imageUrl,
      weight: row.weight,
      weightType: row.weightType,
      allergens: row.allergens,
      categoryId: row.categoryId,
      isActive: !row.isActive,
    }
    await crud.runMutation(async () => {
      crud.upsertItem(await updateProduct(row.id, payload))
    }, 'Update failed')
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    const target = deleteTarget
    await crud.runMutation(async () => {
      await deleteProduct(target.id)
      crud.removeItemById(target.id)
      setDeleteTarget(null)
    }, 'Delete failed')
  }

  return (
    <section className="crm-section">
      <AdminPageHeader
        title="Products"
        description="Menu items. Prices in MDL (stored in minor units on API)."
        searchPlaceholder="Search products"
        query={crud.query}
        onQueryChange={crud.setQuery}
        onAdd={openCreate}
        onRefresh={() => void crud.reload()}
        loading={crud.loading || categoriesLoading}
        extra={
          <Select.Root value={categoryFilter} onValueChange={setCategoryFilter}>
            <Select.Trigger className="crm-select-trigger crm-select-trigger--compact" aria-label="Filter by category">
              <Select.Value placeholder="All categories" />
              <Select.Icon asChild>
                <ChevronDown size={16} className="crm-select-trigger__icon" />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="crm-select-content" position="popper" sideOffset={4}>
                <Select.Viewport>
                  <Select.Item value="all" className="crm-select-item">
                    <Select.ItemText>All categories</Select.ItemText>
                    <Select.ItemIndicator>
                      <Check size={14} />
                    </Select.ItemIndicator>
                  </Select.Item>
                  {categories.map((cat) => (
                    <Select.Item key={cat.id} value={String(cat.id)} className="crm-select-item">
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
        }
      />

      {crud.error && <AdminAlert message={crud.error} />}

      <AdminDataTable
        columns={[
          {
            key: 'image',
            header: 'Image',
            render: (row) => (
              <img src={row.imageUrl} alt="" className="crm-thumb" loading="lazy" />
            ),
          },
          { key: 'name', header: 'Name', render: (row) => row.name },
          { key: 'price', header: 'Price', render: (row) => formatPriceMdl(row.price) },
          {
            key: 'category',
            header: 'Category',
            render: (row) => categoryNameById.get(row.categoryId) ?? row.categoryId,
          },
          {
            key: 'active',
            header: 'Active',
            render: (row) => (
              <button
                type="button"
                className={`crm-badge${row.isActive ? ' crm-badge--ok' : ' crm-badge--warn'}`}
                onClick={() => void toggleActive(row)}
                title="Toggle active"
              >
                {row.isActive ? 'Yes' : 'No'}
              </button>
            ),
          },
        ]}
        rows={crud.filteredItems}
        rowKey={(row) => row.id}
        loading={crud.loading}
        emptyMessage="No products yet."
        actions={(row) => (
          <>
            <AdminIconButton label="Edit product" onClick={() => openEdit(row)}>
              ✎
            </AdminIconButton>
            <AdminIconButton
              label="Delete product"
              className="is-danger"
              onClick={() => setDeleteTarget(row)}
            >
              🗑
            </AdminIconButton>
          </>
        )}
      />

      <AdminModal
        title={editingId !== null ? 'Edit product' : 'Create product'}
        open={isModalOpen}
        onClose={resetForm}
      >
        <form
          className="crm-form"
          onSubmit={(e) => {
            e.preventDefault()
            void submitProduct()
          }}
        >
          <FormField label="Name">
            <input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              required
            />
          </FormField>
          <FormField label="Description">
            <textarea
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              rows={3}
            />
          </FormField>
          <FormField label="Price (MDL)">
            <input
              type="number"
              min={0}
              step="0.01"
              value={form.priceMdl}
              onChange={(e) => setForm((p) => ({ ...p, priceMdl: e.target.value }))}
              required
            />
          </FormField>
          <FormField label="Category">
            <select
              value={form.categoryId}
              onChange={(e) => setForm((p) => ({ ...p, categoryId: e.target.value }))}
              required
              disabled={categories.length === 0}
            >
              {categories.map((cat) => (
                <option key={cat.id} value={String(cat.id)}>
                  {cat.name}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Image URL">
            <input
              value={form.imageUrl}
              onChange={(e) => setForm((p) => ({ ...p, imageUrl: e.target.value }))}
              required
            />
          </FormField>
          <FormField label="Weight">
            <input
              type="number"
              min={0}
              value={form.weight}
              onChange={(e) => setForm((p) => ({ ...p, weight: Number(e.target.value) }))}
            />
          </FormField>
          <FormField label="Weight type">
            <input
              value={form.weightType}
              onChange={(e) => setForm((p) => ({ ...p, weightType: e.target.value }))}
              placeholder="g"
            />
          </FormField>
          <FormField label="Allergens">
            <input
              value={form.allergens}
              onChange={(e) => setForm((p) => ({ ...p, allergens: e.target.value }))}
              placeholder="comma-separated or free text"
            />
          </FormField>
          <div className="crm-switch-row">
            <label className="crm-switch-label" htmlFor="product-active-switch">
              Active (visible on menu)
            </label>
            <Switch.Root
              id="product-active-switch"
              className="crm-switch"
              checked={form.isActive}
              onCheckedChange={(val) => setForm((p) => ({ ...p, isActive: val }))}
            >
              <Switch.Thumb className="crm-switch__thumb" />
            </Switch.Root>
          </div>
          <div className="crm-form__actions">
            <button
              className="btn btn--primary"
              type="submit"
              disabled={crud.saving || categories.length === 0}
            >
              {crud.saving ? 'Saving…' : editingId !== null ? 'Save' : 'Create'}
            </button>
            <button className="btn btn--ghost" type="button" onClick={resetForm} disabled={crud.saving}>
              Cancel
            </button>
          </div>
        </form>
      </AdminModal>

      <AdminConfirmModal
        open={deleteTarget !== null}
        title="Delete product"
        message={deleteTarget ? `Delete “${deleteTarget.name}”?` : ''}
        confirmLabel="Delete"
        danger
        loading={crud.saving}
        onConfirm={() => void confirmDelete()}
        onCancel={() => setDeleteTarget(null)}
      />
    </section>
  )
}
