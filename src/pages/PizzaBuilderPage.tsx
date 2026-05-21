import { useEffect, useMemo, useRef, useState } from 'react'
import { createCustomPizza, listIngredients } from '../api/public/pizza-constructor'
import type { Ingredient } from '../api/public/types'
import { formatPriceMdl } from '../api/money'
import { useLocale } from '../contexts/LocaleContext'
import { useCartActions } from '../contexts/CartContext'
import {
  CUSTOM_PIZZA_EXTRA_MAJOR,
  estimateCustomPizzaPriceMinor,
  swatchForIngredient,
} from '../utils/pizzaBuilderUi'
import { PizzaPreview } from '../components/pizza/PizzaPreview'
import { Button } from '../components/ui/Button'

type UiIngredient = Ingredient & { color: string }

type Step = 0 | 1 | 2
type StepDirection = 'forward' | 'back'

export function PizzaBuilderPage() {
  const { t } = useLocale()
  const { addCustomPizza, openDrawer } = useCartActions()

  const [step, setStep] = useState<Step>(0)
  const [stepDir, setStepDir] = useState<StepDirection>('forward')
  const [dough, setDough] = useState<UiIngredient | null>(null)
  const [sauce, setSauce] = useState<UiIngredient | null>(null)
  const [toppings, setToppings] = useState<UiIngredient[]>([])
  const [doughs, setDoughs] = useState<UiIngredient[]>([])
  const [sauces, setSauces] = useState<UiIngredient[]>([])
  const [extras, setExtras] = useState<UiIngredient[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState('')
  const [addedNotice, setAddedNotice] = useState(false)
  const addedTimerRef = useRef<number | null>(null)

  useEffect(() => {
    let cancelled = false
    listIngredients()
      .then((items) => {
        if (cancelled) return
        const withColor = items.map((i) => ({
          ...i,
          color: swatchForIngredient(i.name, i.type, i.id),
        }))
        setDoughs(withColor.filter((i) => i.type === 0))
        setSauces(withColor.filter((i) => i.type === 1))
        setExtras(withColor.filter((i) => i.type === 2))
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load ingredients')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    return () => {
      if (addedTimerRef.current) window.clearTimeout(addedTimerRef.current)
    }
  }, [])

  const totalPriceMinor = useMemo(
    () => estimateCustomPizzaPriceMinor(toppings.length),
    [toppings.length],
  )
  const totalPriceLabel = formatPriceMdl(totalPriceMinor)
  const extraPriceLabel = `${CUSTOM_PIZZA_EXTRA_MAJOR} ${t('menu.currency')}`
  const previewKey = `${dough?.id ?? 'x'}-${sauce?.id ?? 'x'}-${toppings.map((x) => x.id).join(',')}`
  const hasSelection = Boolean(dough || sauce || toppings.length > 0 || step > 0)

  function goToStep(next: Step, dir: StepDirection) {
    setStepDir(dir)
    setStep(next)
  }

  function toggleTopping(topping: UiIngredient) {
    setToppings((prev) =>
      prev.find((x) => x.id === topping.id)
        ? prev.filter((x) => x.id !== topping.id)
        : [...prev, topping],
    )
  }

  function resetBuilder() {
    setStepDir('back')
    setStep(0)
    setDough(null)
    setSauce(null)
    setToppings([])
    setError('')
    setAddedNotice(false)
  }

  function flashAddedNotice() {
    setAddedNotice(true)
    if (addedTimerRef.current) window.clearTimeout(addedTimerRef.current)
    addedTimerRef.current = window.setTimeout(() => setAddedNotice(false), 3200)
  }

  async function handleAddToCart() {
    if (!dough || !sauce || adding) return
    const ingredientIds = [dough.id, sauce.id, ...toppings.map((x) => x.id)]
    setAdding(true)
    setError('')
    try {
      const created = await createCustomPizza(ingredientIds)
      addCustomPizza({
        id: `custom-${created.id}-${Date.now()}`,
        customPizzaId: created.id,
        price: totalPriceMinor,
        ingredientIds,
        preview: {
          doughName: dough.name,
          sauceName: sauce.name,
          toppingNames: toppings.map((x) => x.name),
        },
      })
      flashAddedNotice()
      openDrawer()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add pizza')
    } finally {
      setAdding(false)
    }
  }

  const stepTitles: Record<Step, string> = {
    0: t('builder.step.dough'),
    1: t('builder.step.sauce'),
    2: t('builder.step.toppings'),
  }

  return (
    <div className="builder-page section">
      <header className="builder-page__header">
        <h1 className="section-title">{t('builder.title')}</h1>
        <p className="builder-page__sub">{t('builder.sub')}</p>
      </header>

      <div className="builder-page__layout">
        <div className="builder-page__canvas">
          <div key={previewKey} className="builder-page__preview-wrap">
            <PizzaPreview dough={dough} sauce={sauce} toppings={toppings} />
          </div>
        </div>

        <div className="builder-page__panel">
          <div className="builder-steps" aria-hidden>
            {([0, 1, 2] as Step[]).map((s) => (
              <div
                key={s}
                className={`builder-steps__dot${step === s ? ' is-active' : ''}${s < step ? ' is-done' : ''}`}
              />
            ))}
          </div>

          <div
            key={step}
            className={`builder-step-panel builder-step-panel--${stepDir}`}
          >
            <h2 className="builder-page__step-title">{stepTitles[step]}</h2>

            {loading && <p className="builder-page__loading">{t('builder.loading')}</p>}
            {error && <p className="builder-page__error">{error}</p>}
            {addedNotice && (
              <p className="builder-page__success" role="status">
                {t('builder.added')}
              </p>
            )}

            {step === 0 && !loading && (
              <ul className="builder-options">
                {doughs.map((d) => (
                  <li key={d.id}>
                    <button
                      type="button"
                      className={`builder-option${dough?.id === d.id ? ' is-selected' : ''}`}
                      onClick={() => setDough(d)}
                    >
                      <span className="builder-option__swatch" style={{ background: d.color }} />
                      <span className="builder-option__name">{d.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {step === 1 && !loading && (
              <ul className="builder-options">
                {sauces.map((s) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      className={`builder-option${sauce?.id === s.id ? ' is-selected' : ''}`}
                      onClick={() => setSauce(s)}
                    >
                      <span className="builder-option__swatch" style={{ background: s.color }} />
                      <span className="builder-option__name">{s.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {step === 2 && !loading && (
              <>
                <p className="builder-page__hint">{t('builder.toppings.hint')}</p>
                <ul className="builder-options builder-options--grid">
                  {extras.map((tp) => {
                    const selected = toppings.some((x) => x.id === tp.id)
                    return (
                      <li key={tp.id}>
                        <button
                          type="button"
                          className={`builder-option${selected ? ' is-selected' : ''}`}
                          onClick={() => toggleTopping(tp)}
                        >
                          <span className="builder-option__swatch" style={{ background: tp.color }} />
                          <span className="builder-option__name">{tp.name}</span>
                          <span className="builder-option__price">+{extraPriceLabel}</span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </>
            )}
          </div>

          <div className="builder-page__nav">
            {step > 0 && (
              <button
                type="button"
                className="builder-page__back"
                onClick={() => goToStep((step - 1) as Step, 'back')}
              >
                ← {t('builder.back')}
              </button>
            )}

            {hasSelection && (
              <button type="button" className="builder-page__reset" onClick={resetBuilder}>
                {t('builder.reset')}
              </button>
            )}

            <div className="builder-page__nav-primary">
              {step < 2 && (
                <Button
                  variant="primary"
                  onClick={() => goToStep((step + 1) as Step, 'forward')}
                  disabled={step === 0 ? !dough : !sauce}
                >
                  {t('builder.next')} →
                </Button>
              )}

              {step === 2 && (
                <Button
                  variant="primary"
                  onClick={() => void handleAddToCart()}
                  disabled={!dough || !sauce || adding}
                >
                  {adding ? t('builder.adding') : `${t('builder.addToCart')} — ${totalPriceLabel}`}
                </Button>
              )}
            </div>
          </div>
        </div>

        {(dough || sauce || toppings.length > 0) && (
          <div className="builder-page__price-summary">
            <div className="builder-page__price-total">
              <span>{t('builder.total')}</span>
              <strong>{totalPriceLabel}</strong>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
