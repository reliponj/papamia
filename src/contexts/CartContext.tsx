import { createContext, useContext, useMemo, useReducer, type ReactNode } from 'react'
import { getProductById } from '../data/menu'
import type { CartLine } from '../types'

export type CartState = {
  lines: CartLine[]
  isDrawerOpen: boolean
}

type CartAction =
  | { type: 'ADD'; productId: string }
  | { type: 'REMOVE_LINE'; productId: string }
  | { type: 'SET_QTY'; productId: string; qty: number }
  | { type: 'CLEAR' }
  | { type: 'OPEN_DRAWER' }
  | { type: 'CLOSE_DRAWER' }
  | { type: 'TOGGLE_DRAWER' }

const CartStateContext = createContext<CartState | null>(null)
const CartDispatchContext = createContext<React.Dispatch<CartAction> | null>(null)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD': {
      const existing = state.lines.find((l) => l.productId === action.productId)
      const lines = existing
        ? state.lines.map((l) =>
            l.productId === action.productId ? { ...l, qty: l.qty + 1 } : l,
          )
        : [...state.lines, { productId: action.productId, qty: 1 }]
      return { ...state, lines, isDrawerOpen: true }
    }
    case 'REMOVE_LINE':
      return {
        ...state,
        lines: state.lines.filter((l) => l.productId !== action.productId),
      }
    case 'SET_QTY': {
      const q = Math.max(0, Math.floor(action.qty))
      if (q === 0) {
        return {
          ...state,
          lines: state.lines.filter((l) => l.productId !== action.productId),
        }
      }
      return {
        ...state,
        lines: state.lines.some((l) => l.productId === action.productId)
          ? state.lines.map((l) =>
              l.productId === action.productId ? { ...l, qty: q } : l,
            )
          : [...state.lines, { productId: action.productId, qty: q }],
      }
    }
    case 'CLEAR':
      return { ...state, lines: [] }
    case 'OPEN_DRAWER':
      return { ...state, isDrawerOpen: true }
    case 'CLOSE_DRAWER':
      return { ...state, isDrawerOpen: false }
    case 'TOGGLE_DRAWER':
      return { ...state, isDrawerOpen: !state.isDrawerOpen }
    default:
      return state
  }
}

const initialCart: CartState = { lines: [], isDrawerOpen: false }

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialCart)

  return (
    <CartStateContext.Provider value={state}>
      <CartDispatchContext.Provider value={dispatch}>{children}</CartDispatchContext.Provider>
    </CartStateContext.Provider>
  )
}

export function useCartState() {
  const ctx = useContext(CartStateContext)
  if (!ctx) throw new Error('useCartState must be used within CartProvider')
  return ctx
}

export function useCartDispatch() {
  const ctx = useContext(CartDispatchContext)
  if (!ctx) throw new Error('useCartDispatch must be used within CartProvider')
  return ctx
}

export function useCartTotals() {
  const { lines } = useCartState()
  return useMemo(() => {
    let count = 0
    let total = 0
    for (const line of lines) {
      const p = getProductById(line.productId)
      if (!p) continue
      count += line.qty
      total += p.price * line.qty
    }
    return { count, total, lines }
  }, [lines])
}

export function useCartActions() {
  const dispatch = useCartDispatch()
  return useMemo(
    () => ({
      add: (productId: string) => dispatch({ type: 'ADD', productId }),
      removeLine: (productId: string) => dispatch({ type: 'REMOVE_LINE', productId }),
      setQty: (productId: string, qty: number) =>
        dispatch({ type: 'SET_QTY', productId, qty }),
      clear: () => dispatch({ type: 'CLEAR' }),
      openDrawer: () => dispatch({ type: 'OPEN_DRAWER' }),
      closeDrawer: () => dispatch({ type: 'CLOSE_DRAWER' }),
      toggleDrawer: () => dispatch({ type: 'TOGGLE_DRAWER' }),
    }),
    [dispatch],
  )
}
