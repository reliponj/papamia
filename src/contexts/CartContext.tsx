import { createContext, useContext, useMemo, useReducer, type ReactNode } from 'react'
import type { CartLine, CartLineSnapshot, CustomPizzaLine } from '../types'

export type CartState = {
  lines: CartLine[]
  customLines: CustomPizzaLine[]
  isDrawerOpen: boolean
}

type CartAction =
  | { type: 'ADD'; productId: number; snapshot: CartLineSnapshot }
  | { type: 'REMOVE_LINE'; productId: number }
  | { type: 'SET_QTY'; productId: number; qty: number }
  | { type: 'ADD_CUSTOM_PIZZA'; pizza: Omit<CustomPizzaLine, 'qty'> }
  | { type: 'SET_CUSTOM_QTY'; id: string; qty: number }
  | { type: 'REMOVE_CUSTOM_LINE'; id: string }
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
        : [
            ...state.lines,
            { productId: action.productId, qty: 1, snapshot: action.snapshot },
          ]
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
      const existing = state.lines.find((l) => l.productId === action.productId)
      if (!existing) return state
      return {
        ...state,
        lines: state.lines.map((l) =>
          l.productId === action.productId ? { ...l, qty: q } : l,
        ),
      }
    }
    case 'ADD_CUSTOM_PIZZA': {
      const sameIngredients = state.customLines.find((l) =>
        l.ingredientIds.length === action.pizza.ingredientIds.length &&
        l.ingredientIds.every((id, i) => id === action.pizza.ingredientIds[i]),
      )
      if (sameIngredients) {
        return {
          ...state,
          customLines: state.customLines.map((l) =>
            l.id === sameIngredients.id ? { ...l, qty: l.qty + 1 } : l,
          ),
          isDrawerOpen: true,
        }
      }
      return {
        ...state,
        customLines: [...state.customLines, { ...action.pizza, qty: 1 }],
        isDrawerOpen: true,
      }
    }
    case 'SET_CUSTOM_QTY': {
      const q = Math.max(0, Math.floor(action.qty))
      if (q === 0) {
        return {
          ...state,
          customLines: state.customLines.filter((l) => l.id !== action.id),
        }
      }
      const existing = state.customLines.find((l) => l.id === action.id)
      if (!existing) return state
      return {
        ...state,
        customLines: state.customLines.map((l) =>
          l.id === action.id ? { ...l, qty: q } : l,
        ),
      }
    }
    case 'REMOVE_CUSTOM_LINE':
      return {
        ...state,
        customLines: state.customLines.filter((l) => l.id !== action.id),
      }
    case 'CLEAR':
      return { ...state, lines: [], customLines: [] }
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

const initialCart: CartState = { lines: [], customLines: [], isDrawerOpen: false }

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
  const { lines, customLines } = useCartState()
  return useMemo(() => {
    let count = 0
    let total = 0
    for (const line of lines) {
      count += line.qty
      total += line.snapshot.price * line.qty
    }
    for (const cl of customLines) {
      count += cl.qty
      total += cl.price * cl.qty
    }
    return { count, total, lines, customLines }
  }, [lines, customLines])
}

export function useCartActions() {
  const dispatch = useCartDispatch()
  return useMemo(
    () => ({
      add: (productId: number, snapshot: CartLineSnapshot) =>
        dispatch({ type: 'ADD', productId, snapshot }),
      removeLine: (productId: number) => dispatch({ type: 'REMOVE_LINE', productId }),
      setQty: (productId: number, qty: number) =>
        dispatch({ type: 'SET_QTY', productId, qty }),
      addCustomPizza: (pizza: Omit<CustomPizzaLine, 'qty'>) =>
        dispatch({ type: 'ADD_CUSTOM_PIZZA', pizza }),
      setCustomQty: (id: string, qty: number) =>
        dispatch({ type: 'SET_CUSTOM_QTY', id, qty }),
      removeCustomLine: (id: string) => dispatch({ type: 'REMOVE_CUSTOM_LINE', id }),
      clear: () => dispatch({ type: 'CLEAR' }),
      openDrawer: () => dispatch({ type: 'OPEN_DRAWER' }),
      closeDrawer: () => dispatch({ type: 'CLOSE_DRAWER' }),
      toggleDrawer: () => dispatch({ type: 'TOGGLE_DRAWER' }),
    }),
    [dispatch],
  )
}
