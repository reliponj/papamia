import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

export type AdminUserRole = 'admin' | 'manager' | 'viewer'

export type AdminUser = {
  id: string
  name: string
  email: string
  role: AdminUserRole
}

type AdminDataValue = {
  users: AdminUser[]
  addUser: (payload: Omit<AdminUser, 'id'>) => void
  updateUser: (id: string, payload: Omit<AdminUser, 'id'>) => void
  removeUser: (id: string) => void
}

const initialUsers: AdminUser[] = [
  { id: 'u-1', name: 'Antonio Rossi', email: 'antonio@papamia.md', role: 'admin' },
  { id: 'u-2', name: 'Elena Popa', email: 'elena@papamia.md', role: 'manager' },
  { id: 'u-3', name: 'Mark Toma', email: 'mark@papamia.md', role: 'viewer' },
]

function makeId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`
}

const AdminDataContext = createContext<AdminDataValue | null>(null)

/** Temporary mock store for admin users until C4 wires real API. */
export function AdminDataProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers)

  const value = useMemo<AdminDataValue>(
    () => ({
      users,
      addUser: (payload) => {
        setUsers((prev) => [...prev, { id: makeId('u'), ...payload }])
      },
      updateUser: (id, payload) => {
        setUsers((prev) => prev.map((user) => (user.id === id ? { id, ...payload } : user)))
      },
      removeUser: (id) => {
        setUsers((prev) => prev.filter((user) => user.id !== id))
      },
    }),
    [users],
  )

  return <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>
}

export function useAdminData() {
  const ctx = useContext(AdminDataContext)
  if (!ctx) throw new Error('useAdminData must be used within AdminDataProvider')
  return ctx
}
