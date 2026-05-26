import * as Select from '@radix-ui/react-select'
import { Check } from 'lucide-react'
import { useLocale } from '../../contexts/LocaleContext'
import type { Lang } from '../../types'

const LANGS: Lang[] = ['ro', 'ru', 'en']

export function LangSelect() {
  const { lang, setLang, t } = useLocale()

  return (
    <Select.Root value={lang} onValueChange={(v) => setLang(v as Lang)}>
      <Select.Trigger className="app-select-trigger app-select-trigger--compact" aria-label={t('aria.lang')}>
        <Select.Value />
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="app-select-content" position="popper" sideOffset={6} align="end">
          <Select.Viewport className="app-select-viewport">
            {LANGS.map((code) => (
              <Select.Item key={code} value={code} className="app-select-item">
                <Select.ItemText>{code.toUpperCase()}</Select.ItemText>
                <Select.ItemIndicator className="app-select-item__check">
                  <Check size={14} strokeWidth={2.5} aria-hidden />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  )
}
