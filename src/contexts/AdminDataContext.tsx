import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

export type AdminUserRole = 'admin' | 'manager' | 'viewer'

export type AdminUser = {
  id: string
  name: string
  email: string
  role: AdminUserRole
}

export type AdminCategory = {
  id: string
  name: string
  slug: string
}

export type AdminProduct = {
  id: string
  name: string
  price: number
  categoryId: string
  image: string
  inStock: boolean
}

type AdminDataValue = {
  users: AdminUser[]
  categories: AdminCategory[]
  products: AdminProduct[]
  addUser: (payload: Omit<AdminUser, 'id'>) => void
  updateUser: (id: string, payload: Omit<AdminUser, 'id'>) => void
  removeUser: (id: string) => void
  addCategory: (payload: Omit<AdminCategory, 'id'>) => void
  updateCategory: (id: string, payload: Omit<AdminCategory, 'id'>) => void
  removeCategory: (id: string) => { ok: boolean; reason?: string }
  addProduct: (payload: Omit<AdminProduct, 'id'>) => void
  updateProduct: (id: string, payload: Omit<AdminProduct, 'id'>) => void
  removeProduct: (id: string) => void
}

const initialUsers: AdminUser[] = [
  { id: 'u-1', name: 'Antonio Rossi', email: 'antonio@papamia.md', role: 'admin' },
  { id: 'u-2', name: 'Elena Popa', email: 'elena@papamia.md', role: 'manager' },
  { id: 'u-3', name: 'Mark Toma', email: 'mark@papamia.md', role: 'viewer' },
]

const initialCategories: AdminCategory[] = [
  { id: 'c-1', name: 'Pizza', slug: 'pizza' },
  { id: 'c-2', name: 'Pinsa', slug: 'pinsa' },
  { id: 'c-3', name: 'Paste', slug: 'pasta' },
]

const initialProducts: AdminProduct[] = [
  {
    id: 'p-1',
    name: 'Margherita',
    price: 95,
    categoryId: 'c-1',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300&q=80',
    inStock: true,
  },
  {
    id: 'p-2',
    name: 'Capricciosa',
    price: 135,
    categoryId: 'c-1',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&q=80',
    inStock: true,
  },
  {
    id: 'p-3',
    name: 'Diavola',
    price: 180,
    categoryId: 'c-2',
    image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=300&q=80',
    inStock: false,
  },
]

function makeId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`
}

const AdminDataContext = createContext<AdminDataValue | null>(null)

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers)
  const [categories, setCategories] = useState<AdminCategory[]>(initialCategories)
  const [products, setProducts] = useState<AdminProduct[]>(initialProducts)

  const value = useMemo<AdminDataValue>(
    () => ({
      users,
      categories,
      products,
      addUser: (payload) => {
        setUsers((prev) => [...prev, { id: makeId('u'), ...payload }])
      },
      updateUser: (id, payload) => {
        setUsers((prev) => prev.map((user) => (user.id === id ? { id, ...payload } : user)))
      },
      removeUser: (id) => {
        setUsers((prev) => prev.filter((user) => user.id !== id))
      },
      addCategory: (payload) => {
        setCategories((prev) => [...prev, { id: makeId('c'), ...payload }])
      },
      updateCategory: (id, payload) => {
        setCategories((prev) =>
          prev.map((category) => (category.id === id ? { id, ...payload } : category)),
        )
      },
      removeCategory: (id) => {
        const isUsed = products.some((product) => product.categoryId === id)
        if (isUsed) {
          return { ok: false, reason: 'Category has linked products.' }
        }
        setCategories((prev) => prev.filter((category) => category.id !== id))
        return { ok: true }
      },
      addProduct: (payload) => {
        setProducts((prev) => [...prev, { id: makeId('p'), ...payload }])
      },
      updateProduct: (id, payload) => {
        setProducts((prev) => prev.map((product) => (product.id === id ? { id, ...payload } : product)))
      },
      removeProduct: (id) => {
        setProducts((prev) => prev.filter((product) => product.id !== id))
      },
    }),
    [users, categories, products],
  )

  return <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>
}

export function useAdminData() {
  const ctx = useContext(AdminDataContext)
  if (!ctx) throw new Error('useAdminData must be used within AdminDataProvider')
  return ctx
}
