import type { Ingredient } from '../../api/public/types'
import { useLocale } from '../../contexts/LocaleContext'
import {
  doughColorForName,
  doughCrustDarkForName,
  resolveToppingVisualKey,
  sauceColorForName,
} from '../../utils/pizzaBuilderUi'
import {
  getToppingPositions,
  seededRand,
  TOPPING_COUNT,
  TOPPING_RENDERERS,
} from './pizzaToppingRenderers'

type PreviewIngredient = Pick<Ingredient, 'id' | 'name'>

type Props = {
  dough: PreviewIngredient | null
  sauce: PreviewIngredient | null
  toppings: PreviewIngredient[]
  compact?: boolean
}

export function PizzaPreview({ dough, sauce, toppings, compact = false }: Props) {
  const { t } = useLocale()

  if (!dough) {
    return (
      <div className={`pizza-preview pizza-preview--empty${compact ? ' pizza-preview--compact' : ''}`}>
        <svg viewBox="0 0 300 300" className="pizza-preview__svg">
          <defs>
            <radialGradient id="emptyGrad" cx="40%" cy="38%">
              <stop offset="0%" stopColor="#2a2018" />
              <stop offset="100%" stopColor="#1a150e" />
            </radialGradient>
          </defs>
          <circle
            cx="150"
            cy="150"
            r="138"
            fill="url(#emptyGrad)"
            stroke="#d4b872"
            strokeWidth="1.5"
            strokeDasharray="8 5"
          />
          <circle
            cx="150"
            cy="150"
            r="110"
            fill="none"
            stroke="#d4b872"
            strokeWidth="0.5"
            strokeDasharray="4 8"
            opacity="0.4"
          />
          <text
            x="150"
            y="158"
            textAnchor="middle"
            fill="#d4b872"
            fontSize="9"
            opacity="0.5"
            fontFamily="sans-serif"
            letterSpacing="1.5"
          >
            {t('builder.preview.empty').toUpperCase()}
          </text>
        </svg>
      </div>
    )
  }

  const crustMid = doughColorForName(dough.name)
  const crustDark = doughCrustDarkForName(dough.name)
  const sauceColor = sauce ? sauceColorForName(sauce.name) : null

  return (
    <div className={`pizza-preview${compact ? ' pizza-preview--compact' : ''}`}>
      <svg viewBox="0 0 300 300" className="pizza-preview__svg">
        <defs>
          <radialGradient id="crustGrad" cx="38%" cy="35%" r="65%">
            <stop offset="0%" stopColor={crustMid} />
            <stop offset="55%" stopColor={crustDark} />
            <stop offset="100%" stopColor="#1e0e04" />
          </radialGradient>
          <radialGradient id="doughGrad" cx="38%" cy="35%" r="70%">
            <stop offset="0%" stopColor={crustMid} />
            <stop offset="60%" stopColor={crustDark} />
            <stop offset="100%" stopColor="#3a200a" />
          </radialGradient>
          <filter id="doughNoise" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" seed="3" result="noise" />
            <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise" />
            <feBlend in="SourceGraphic" in2="grayNoise" mode="multiply" result="blended" />
            <feComposite in="blended" in2="SourceGraphic" operator="in" />
          </filter>
          <radialGradient id="crustEdge" cx="50%" cy="50%" r="50%">
            <stop offset="72%" stopColor="transparent" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.55)" />
          </radialGradient>
          {sauceColor && (
            <>
              <radialGradient id="sauceGrad" cx="40%" cy="38%" r="65%">
                <stop offset="0%" stopColor={sauceColor} stopOpacity="0.7" />
                <stop offset="70%" stopColor={sauceColor} stopOpacity="0.92" />
                <stop offset="100%" stopColor={sauceColor} stopOpacity="1" />
              </radialGradient>
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

        <circle cx="152" cy="156" r="135" fill="rgba(0,0,0,0.4)" />
        <circle cx="150" cy="150" r="138" fill="url(#crustGrad)" filter="url(#pizzaShadow)" />
        <circle cx="150" cy="150" r="138" fill={crustMid} opacity="0.25" filter="url(#crustBump)" clipPath="url(#crustClip)" />

        {Array.from({ length: 22 }, (_, i) => {
          const a = (i / 22) * Math.PI * 2 + seededRand(i * 9) * 0.25
          const rr = 120 + seededRand(i * 7) * 13
          const bx = 150 + Math.cos(a) * rr
          const by = 150 + Math.sin(a) * rr
          const br = 2.5 + seededRand(i * 3) * 5.5
          return (
            <g key={i}>
              <circle cx={bx + 0.8} cy={by + 1} r={br} fill="rgba(0,0,0,0.3)" opacity="0.6" />
              <circle cx={bx} cy={by} r={br} fill={crustMid} opacity={0.55 + seededRand(i * 11) * 0.3} />
              <circle cx={bx - br * 0.35} cy={by - br * 0.35} r={br * 0.4} fill="white" opacity="0.22" />
            </g>
          )
        })}

        {Array.from({ length: 14 }, (_, i) => {
          const a = (i / 14) * Math.PI * 2 + seededRand(i * 5) * 0.4
          const rr = 118 + seededRand(i * 13) * 16
          const bx = 150 + Math.cos(a) * rr
          const by = 150 + Math.sin(a) * rr
          return (
            <ellipse
              key={i}
              cx={bx}
              cy={by}
              rx={1.5 + seededRand(i * 5) * 3.5}
              ry={1 + seededRand(i * 7) * 2.5}
              fill="#1a0800"
              transform={`rotate(${(seededRand(i * 3) * 180).toFixed(0)} ${bx.toFixed(1)} ${by.toFixed(1)})`}
              opacity={0.4 + seededRand(i) * 0.45}
            />
          )
        })}

        <circle cx="150" cy="150" r="138" fill="url(#crustEdge)" clipPath="url(#crustClip)" />
        <circle cx="150" cy="150" r="118" fill="url(#doughGrad)" />
        <circle cx="150" cy="150" r="118" fill={crustMid} opacity="0.15" filter="url(#doughNoise)" />
        <circle cx="150" cy="150" r="118" fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="8" />

        {sauceColor && (
          <>
            <circle cx="150" cy="150" r="112" fill={sauceColor} opacity="0.92" filter="url(#sauceNoise)" />
            <circle cx="150" cy="150" r="112" fill="url(#sauceGrad)" />
            {Array.from({ length: 7 }, (_, i) => {
              const a = (i / 7) * Math.PI * 2 + 0.5
              const rr = 28 + seededRand(i * 6) * 55
              const sx = 150 + Math.cos(a) * rr
              const sy = 150 + Math.sin(a) * rr
              const sr = 10 + seededRand(i * 4) * 22
              return (
                <circle
                  key={i}
                  cx={sx}
                  cy={sy}
                  r={sr}
                  fill="rgba(0,0,0,0.12)"
                  opacity={0.6 + seededRand(i * 3) * 0.4}
                />
              )
            })}
            {Array.from({ length: 4 }, (_, i) => {
              const a = (i / 4) * Math.PI * 2 + 1.1
              const rr = 15 + seededRand(i * 8) * 40
              const sx = 150 + Math.cos(a) * rr
              const sy = 150 + Math.sin(a) * rr
              return (
                <circle
                  key={i}
                  cx={sx}
                  cy={sy}
                  r={6 + seededRand(i * 5) * 12}
                  fill="white"
                  opacity={0.06 + seededRand(i * 2) * 0.06}
                />
              )
            })}
            <circle cx="150" cy="150" r="112" fill="url(#sauceEdgeShadow)" />
          </>
        )}

        <g clipPath="url(#pizzaClip)">
          {toppings.map((topping, ti) => {
            const visualKey = resolveToppingVisualKey(topping.name)
            if (!visualKey) return null
            const renderer = TOPPING_RENDERERS[visualKey]
            if (!renderer) return null
            const count = TOPPING_COUNT[visualKey] ?? 6
            const positions = getToppingPositions(ti, count)
            return positions.slice(0, count).map(([px, py], pi) => renderer(px, py, ti * 100 + pi))
          })}
        </g>

        <ellipse cx="122" cy="108" rx="44" ry="28" fill="white" opacity="0.055" transform="rotate(-30 122 108)" />
        <ellipse cx="115" cy="102" rx="18" ry="10" fill="white" opacity="0.07" transform="rotate(-30 115 102)" />
      </svg>
    </div>
  )
}
