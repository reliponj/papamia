import { useEffect, useMemo, useState } from 'react'
import { createCustomPizza, listIngredients } from '../api/public/pizza-constructor'
import type { Ingredient } from '../api/public/types'
import { formatPriceMdl } from '../api/money'
import { useLocale } from '../contexts/LocaleContext'
import { useCartActions } from '../contexts/CartContext'
import {
  CUSTOM_PIZZA_EXTRA_MAJOR,
  estimateCustomPizzaPriceMinor,
  swatchForId,
} from '../utils/pizzaBuilderUi'
import { Button } from '../components/ui/Button'

type UiIngredient = Ingredient & { color: string }

type Step = 0 | 1 | 2

// Deterministic pseudo-random based on seed
function seededRand(seed: number) {
  const x = Math.sin(seed + 1) * 10000
  return x - Math.floor(x)
}

// Poisson disk sampling on the pizza surface (center 150,150, radius 90)
// Generates ~maxPts well-distributed points with no two closer than minDist
function poissonDiskPizza(seed: number, maxPts: number, minDist = 22): [number, number][] {
  const cx = 150, cy = 150, R = 90
  const pts: [number, number][] = []
  let attempts = 0
  // LCG pseudo-random with seed
  let s = seed * 1000 + 1
  function rand() {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
  while (pts.length < maxPts && attempts < maxPts * 60) {
    attempts++
    // uniform random point inside disk
    const angle = rand() * Math.PI * 2
    const r = Math.sqrt(rand()) * R
    const x = cx + Math.cos(angle) * r
    const y = cy + Math.sin(angle) * r
    // reject if too close to existing point
    const tooClose = pts.some(([px, py]) => {
      const d = Math.sqrt((x - px) ** 2 + (y - py) ** 2)
      return d < minDist
    })
    if (!tooClose) pts.push([x, y])
  }
  return pts
}

// Pre-compute a large pool of positions per topping slot
const POSITION_CACHE = new Map<string, [number, number][]>()
function getToppingPositions(ti: number, count: number): [number, number][] {
  const key = `${ti}-${count}`
  if (!POSITION_CACHE.has(key)) {
    POSITION_CACHE.set(key, poissonDiskPizza(ti * 37 + count * 13, count + 4, 20))
  }
  return POSITION_CACHE.get(key)!
}

function renderGenericTopping(cx: number, cy: number, color: string, seed: number) {
  return (
    <circle
      key={`gen-${seed}`}
      cx={cx}
      cy={cy}
      r={9 + seededRand(seed) * 3}
      fill={color}
      opacity={0.88}
      stroke="rgba(0,0,0,0.2)"
      strokeWidth="0.6"
    />
  )
}

function PizzaPreview({
  dough,
  sauce,
  toppings,
}: {
  dough: UiIngredient | null
  sauce: UiIngredient | null
  toppings: UiIngredient[]
}) {
  const { t } = useLocale()

  if (!dough) {
    return (
      <div className="pizza-preview pizza-preview--empty">
        <svg viewBox="0 0 300 300" className="pizza-preview__svg">
          <defs>
            <radialGradient id="emptyGrad" cx="40%" cy="38%">
              <stop offset="0%" stopColor="#2a2018" />
              <stop offset="100%" stopColor="#1a150e" />
            </radialGradient>
          </defs>
          <circle cx="150" cy="150" r="138" fill="url(#emptyGrad)" stroke="#d4b872" strokeWidth="1.5" strokeDasharray="8 5" />
          <circle cx="150" cy="150" r="110" fill="none" stroke="#d4b872" strokeWidth="0.5" strokeDasharray="4 8" opacity="0.4" />
          <text x="150" y="158" textAnchor="middle" fill="#d4b872" fontSize="9" opacity="0.5"
            fontFamily="sans-serif" letterSpacing="1.5">{t('builder.preview.empty').toUpperCase()}</text>
        </svg>
      </div>
    )
  }

  // Darker crust shade
  const doughVariant = dough.id % 3
  const crustDark = doughVariant === 0 ? '#7a5030' : doughVariant === 1 ? '#a07828' : '#b08830'
  const crustMid = dough.color

  return (
    <div className="pizza-preview">
      <svg viewBox="0 0 300 300" className="pizza-preview__svg">
        <defs>
          <radialGradient id="crustGrad" cx="38%" cy="35%" r="65%">
            <stop offset="0%"   stopColor={crustMid} />
            <stop offset="55%"  stopColor={crustDark} />
            <stop offset="100%" stopColor="#1e0e04" />
          </radialGradient>
          <radialGradient id="doughGrad" cx="38%" cy="35%" r="70%">
            <stop offset="0%"   stopColor={crustMid} />
            <stop offset="60%"  stopColor={crustDark} />
            <stop offset="100%" stopColor="#3a200a" />
          </radialGradient>
          {/* dough surface noise */}
          <filter id="doughNoise" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" seed="3" result="noise" />
            <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise" />
            <feBlend in="SourceGraphic" in2="grayNoise" mode="multiply" result="blended" />
            <feComposite in="blended" in2="SourceGraphic" operator="in" />
          </filter>
          {/* crust edge darkening */}
          <radialGradient id="crustEdge" cx="50%" cy="50%" r="50%">
            <stop offset="72%" stopColor="transparent" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.55)" />
          </radialGradient>
          {sauce && (
            <>
              <radialGradient id="sauceGrad" cx="40%" cy="38%" r="65%">
                <stop offset="0%"   stopColor={sauce.color} stopOpacity="0.7" />
                <stop offset="70%"  stopColor={sauce.color} stopOpacity="0.92" />
                <stop offset="100%" stopColor={sauce.color} stopOpacity="1" />
              </radialGradient>
              {/* sauce edge shadow — darker ring where sauce meets crust */}
              <radialGradient id="sauceEdgeShadow" cx="50%" cy="50%" r="50%">
                <stop offset="65%" stopColor="transparent" />
                <stop offset="100%" stopColor="rgba(0,0,0,0.38)" />
              </radialGradient>
              <filter id="sauceNoise" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
                <feTurbulence type="turbulence" baseFrequency="0.04 0.06" numOctaves="3" seed="7" result="wave" />
                <feDisplacementMap in="SourceGraphic" in2="wave" scale="6" xChannelSelector="R" yChannelSelector="G" />
              </filter>
            </>
          )}
          <filter id="pizzaShadow" x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="0" dy="8" stdDeviation="14" floodColor="rgba(0,0,0,0.6)" />
          </filter>
          <filter id="crustBump" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="12" result="bump" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.18 0" in="bump" result="bumpAlpha" />
            <feComposite in="bumpAlpha" in2="SourceGraphic" operator="in" result="texture" />
            <feBlend in="SourceGraphic" in2="texture" mode="screen" />
          </filter>
          <clipPath id="pizzaClip">
            <circle cx="150" cy="150" r="116" />
          </clipPath>
          <clipPath id="crustClip">
            <circle cx="150" cy="150" r="138" />
          </clipPath>
        </defs>

        {/* outer shadow disc */}
        <circle cx="152" cy="156" r="135" fill="rgba(0,0,0,0.4)" />

        {/* crust base */}
        <circle cx="150" cy="150" r="138" fill="url(#crustGrad)" filter="url(#pizzaShadow)" />

        {/* crust noise texture overlay */}
        <circle cx="150" cy="150" r="138" fill={crustMid} opacity="0.25" filter="url(#crustBump)" clipPath="url(#crustClip)" />

        {/* crust bubbles / blisters — larger and more varied */}
        {Array.from({ length: 22 }, (_, i) => {
          const a = (i / 22) * Math.PI * 2 + seededRand(i * 9) * 0.25
          const rr = 120 + seededRand(i * 7) * 13
          const bx = 150 + Math.cos(a) * rr
          const by = 150 + Math.sin(a) * rr
          const br = 2.5 + seededRand(i * 3) * 5.5
          return (
            <g key={i}>
              {/* blister shadow */}
              <circle cx={bx + 0.8} cy={by + 1} r={br} fill="rgba(0,0,0,0.3)" opacity="0.6" />
              {/* blister body */}
              <circle cx={bx} cy={by} r={br} fill={crustMid} opacity={0.55 + seededRand(i * 11) * 0.3} />
              {/* blister highlight */}
              <circle cx={bx - br * 0.35} cy={by - br * 0.35} r={br * 0.4} fill="white" opacity="0.22" />
            </g>
          )
        })}
        {/* crust char / burn spots */}
        {Array.from({ length: 14 }, (_, i) => {
          const a = (i / 14) * Math.PI * 2 + seededRand(i * 5) * 0.4
          const rr = 118 + seededRand(i * 13) * 16
          const bx = 150 + Math.cos(a) * rr
          const by = 150 + Math.sin(a) * rr
          return <ellipse key={i} cx={bx} cy={by}
            rx={1.5 + seededRand(i * 5) * 3.5} ry={1 + seededRand(i * 7) * 2.5}
            fill="#1a0800"
            transform={`rotate(${(seededRand(i * 3) * 180).toFixed(0)} ${bx.toFixed(1)} ${by.toFixed(1)})`}
            opacity={0.4 + seededRand(i) * 0.45} />
        })}
        {/* crust edge vignette */}
        <circle cx="150" cy="150" r="138" fill="url(#crustEdge)" clipPath="url(#crustClip)" />

        {/* inner dough face — slightly smaller, own gradient + noise */}
        <circle cx="150" cy="150" r="118" fill="url(#doughGrad)" />
        <circle cx="150" cy="150" r="118" fill={crustMid} opacity="0.15" filter="url(#doughNoise)" />
        {/* crust-to-sauce shadow ring */}
        <circle cx="150" cy="150" r="118" fill="none"
          stroke="rgba(0,0,0,0.35)" strokeWidth="8" />

        {/* sauce */}
        {sauce && (
          <>
            {/* base coat */}
            <circle cx="150" cy="150" r="112" fill={sauce.color} opacity="0.92" filter="url(#sauceNoise)" />
            {/* gradient on top for depth */}
            <circle cx="150" cy="150" r="112" fill="url(#sauceGrad)" />
            {/* darker pools / depth variation */}
            {Array.from({ length: 7 }, (_, i) => {
              const a = (i / 7) * Math.PI * 2 + 0.5
              const rr = 28 + seededRand(i * 6) * 55
              const sx = 150 + Math.cos(a) * rr
              const sy = 150 + Math.sin(a) * rr
              const sr = 10 + seededRand(i * 4) * 22
              return <circle key={i} cx={sx} cy={sy} r={sr}
                fill="rgba(0,0,0,0.12)" opacity={0.6 + seededRand(i * 3) * 0.4} />
            })}
            {/* lighter highlight patches (oil sheen) */}
            {Array.from({ length: 4 }, (_, i) => {
              const a = (i / 4) * Math.PI * 2 + 1.1
              const rr = 15 + seededRand(i * 8) * 40
              const sx = 150 + Math.cos(a) * rr
              const sy = 150 + Math.sin(a) * rr
              return <circle key={i} cx={sx} cy={sy} r={6 + seededRand(i * 5) * 12}
                fill="white" opacity={0.06 + seededRand(i * 2) * 0.06} />
            })}
            {/* sauce edge shadow */}
            <circle cx="150" cy="150" r="112" fill="url(#sauceEdgeShadow)" />
          </>
        )}

        {/* toppings — clipped to pizza surface */}
        <g clipPath="url(#pizzaClip)">
          {toppings.map((topping, ti) => {
            const count = 7
            const positions = getToppingPositions(ti, count)
            return positions.slice(0, count).map(([px, py], pi) =>
              renderGenericTopping(px, py, topping.color, ti * 100 + pi),
            )
          })}
        </g>

        {/* gloss highlight */}
        <ellipse cx="122" cy="108" rx="44" ry="28"
          fill="white" opacity="0.055" transform="rotate(-30 122 108)" />
        <ellipse cx="115" cy="102" rx="18" ry="10"
          fill="white" opacity="0.07" transform="rotate(-30 115 102)" />
      </svg>
    </div>
  )
}

export function PizzaBuilderPage() {
  const { t } = useLocale()
  const { addCustomPizza, openDrawer } = useCartActions()

  const [step, setStep] = useState<Step>(0)
  const [dough, setDough] = useState<UiIngredient | null>(null)
  const [sauce, setSauce] = useState<UiIngredient | null>(null)
  const [toppings, setToppings] = useState<UiIngredient[]>([])
  const [doughs, setDoughs] = useState<UiIngredient[]>([])
  const [sauces, setSauces] = useState<UiIngredient[]>([])
  const [extras, setExtras] = useState<UiIngredient[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    listIngredients()
      .then((items) => {
        if (cancelled) return
        const withColor = items.map((i) => ({ ...i, color: swatchForId(i.id) }))
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

  const totalPriceMinor = useMemo(
    () => estimateCustomPizzaPriceMinor(toppings.length),
    [toppings.length],
  )
  const totalPriceLabel = formatPriceMdl(totalPriceMinor)
  const extraPriceLabel = `${CUSTOM_PIZZA_EXTRA_MAJOR} ${t('menu.currency')}`

  function toggleTopping(topping: UiIngredient) {
    setToppings((prev) =>
      prev.find((x) => x.id === topping.id)
        ? prev.filter((x) => x.id !== topping.id)
        : [...prev, topping],
    )
  }

  async function handleAddToCart() {
    if (!dough || !sauce || adding) return
    const ingredientIds = [dough.id, sauce.id, ...toppings.map((x) => x.id)]
    setAdding(true)
    setError('')
    try {
      const created = await createCustomPizza(ingredientIds)
      const toppingNames = toppings.map((x) => x.name).join(', ')
      const label = `${t('builder.custom')}: ${dough.name}, ${sauce.name}${toppingNames ? `, ${toppingNames}` : ''}`
      addCustomPizza({
        id: `custom-${created.id}-${Date.now()}`,
        customPizzaId: created.id,
        label,
        price: totalPriceMinor,
        ingredientIds,
      })
      openDrawer()
      setStep(0)
      setDough(null)
      setSauce(null)
      setToppings([])
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
      <div className="builder-page__header">
        <h1 className="section-title">{t('builder.title')}</h1>
        <p className="builder-page__sub">{t('builder.sub')}</p>
      </div>

      <div className="builder-page__layout">
        {/* LEFT — pizza preview */}
        <div className="builder-page__canvas">
          <PizzaPreview dough={dough} sauce={sauce} toppings={toppings} />
        </div>

        {/* RIGHT — step panel */}
        <div className="builder-page__panel">
          {/* step indicators */}
          <div className="builder-steps">
            {([0, 1, 2] as Step[]).map((s) => (
              <div
                key={s}
                className={`builder-steps__dot${step === s ? ' is-active' : ''}${s < step ? ' is-done' : ''}`}
              />
            ))}
          </div>

          <h2 className="builder-page__step-title">{stepTitles[step]}</h2>

          {/* Step 0 — dough */}
          {loading && <p className="builder-page__loading">...</p>}
          {error && <p className="builder-page__error">{error}</p>}

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

          {/* navigation */}
          <div className="builder-page__nav">
            {step > 0 && (
              <button
                type="button"
                className="builder-page__back"
                onClick={() => setStep((s) => (s - 1) as Step)}
              >
                ← {t('builder.back')}
              </button>
            )}

            {step < 2 && (
              <Button
                variant="primary"
                onClick={() => setStep((s) => (s + 1) as Step)}
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
                {adding ? '...' : `${t('builder.addToCart')} — ${totalPriceLabel}`}
              </Button>
            )}
          </div>
        </div>

        {/* price summary — full width across both columns */}
        {(dough || sauce || toppings.length > 0) && (
          <div className="builder-page__price-summary">
            <div className="builder-page__price-grid">
              {dough && (
                <div className="builder-page__price-item">
                  <span className="builder-page__price-label">{dough.name}</span>
                </div>
              )}
              {sauce && (
                <div className="builder-page__price-item">
                  <span className="builder-page__price-label">{sauce.name}</span>
                </div>
              )}
              {toppings.map((tp) => (
                <div key={tp.id} className="builder-page__price-item">
                  <span className="builder-page__price-label">{tp.name}</span>
                  <span className="builder-page__price-val">+{extraPriceLabel}</span>
                </div>
              ))}
            </div>
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
