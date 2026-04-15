import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Lang } from '../types'
import { translate, type UiKey } from '../data/translations'

const STORAGE_KEY = 'papamia-lang'

function readStoredLang(): Lang {
  if (typeof window === 'undefined') return 'ru'
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (raw === 'ro' || raw === 'ru' || raw === 'en') return raw
  return 'ru'
}

type LocaleValue = {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (key: UiKey) => string
}

const LocaleContext = createContext<LocaleValue | null>(null)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readStoredLang)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, lang)
    document.documentElement.lang = lang === 'ro' ? 'ro' : lang === 'ru' ? 'ru' : 'en'
  }, [lang])

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
  }, [])

  const t = useCallback((key: UiKey) => translate(lang, key), [lang])

  const value = useMemo(
    () => ({
      lang,
      setLang,
      t,
    }),
    [lang, setLang, t],
  )

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider')
  return ctx
}
