import { useState } from 'react'
import { useLocale } from '../contexts/LocaleContext'
import { useCartActions } from '../contexts/CartContext'
import { DOUGHS, SAUCES, TOPPINGS, calcPizzaPrice } from '../data/pizzaBuilder'
import type { PizzaIngredient, PizzaTopping } from '../data/pizzaBuilder'
import { Button } from '../components/ui/Button'

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

// ── per-topping renderers ──────────────────────────────────────

function renderMozzarella(cx: number, cy: number, seed: number) {
  const pts = Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * Math.PI * 2
    const r = 11 + seededRand(seed + i) * 5
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]
  })
  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ') + 'Z'
  return (
    <g key={`mozz-${seed}`}>
      <path d={d} fill="#e8d870" opacity="0.5" />
      <path d={d} fill="#fffde8" opacity="0.9" />
      <path d={d} fill="none" stroke="#d4c050" strokeWidth="0.8" opacity="0.45" />
      <ellipse cx={cx - 2} cy={cy - 2.5} rx="4" ry="2.5" fill="white" opacity="0.38" transform={`rotate(-20 ${cx - 2} ${cy - 2.5})`} />
    </g>
  )
}

function renderPepperoni(cx: number, cy: number, seed: number) {
  return (
    <g key={`pep-${seed}`}>
      <circle cx={cx + 0.8} cy={cy + 1} r="11" fill="rgba(0,0,0,0.25)" />
      <circle cx={cx} cy={cy} r="11" fill="#7a1010" />
      <circle cx={cx} cy={cy} r="10" fill="#c0392b" />
      <circle cx={cx} cy={cy} r="9" fill="#d44030" />
      {Array.from({ length: 6 }, (_, i) => {
        const a = (i / 6) * Math.PI * 2 + seededRand(seed) * 0.8
        const r = 5 + seededRand(seed + i) * 2.5
        return <ellipse key={i} cx={cx + Math.cos(a) * r} cy={cy + Math.sin(a) * r}
          rx="1" ry="1.6" fill="#6a0e0e" opacity="0.65"
          transform={`rotate(${(a * 180 / Math.PI).toFixed(0)} ${(cx + Math.cos(a) * r).toFixed(1)} ${(cy + Math.sin(a) * r).toFixed(1)})`} />
      })}
      <ellipse cx={cx - 3} cy={cy - 3} rx="3" ry="2" fill="white" opacity="0.2" transform={`rotate(-25 ${cx - 3} ${cy - 3})`} />
    </g>
  )
}

function renderMushroom(cx: number, cy: number, seed: number) {
  const tiltDeg = (seededRand(seed) * 60 - 30).toFixed(0)
  return (
    <g key={`mush-${seed}`} transform={`rotate(${tiltDeg} ${cx.toFixed(1)} ${cy.toFixed(1)})`}>
      {/* shadow */}
      <ellipse cx={cx + 1} cy={cy + 2} rx="10" ry="4" fill="rgba(0,0,0,0.2)" />
      {/* cap outer */}
      <ellipse cx={cx} cy={cy - 3} rx="10" ry="7" fill="#6b4a30" />
      {/* cap inner */}
      <ellipse cx={cx} cy={cy - 3} rx="8.5" ry="5.5" fill="#a07858" />
      {/* cap highlight */}
      <ellipse cx={cx - 2} cy={cy - 5} rx="4" ry="2" fill="white" opacity="0.15" transform={`rotate(-15 ${cx - 2} ${cy - 5})`} />
      {/* gills */}
      {[-4, -1.5, 1.5, 4].map((dx) => (
        <line key={dx} x1={cx + dx} y1={cy + 2} x2={cx + dx * 0.7} y2={cy + 7}
          stroke="#5a3820" strokeWidth="1" opacity="0.55" />
      ))}
      {/* stem */}
      <rect x={cx - 2.5} y={cy + 2} width="5" height="7" rx="2" fill="#c8a880" />
      <rect x={cx - 1.5} y={cy + 2} width="3" height="7" rx="1.5" fill="#d8b890" opacity="0.6" />
    </g>
  )
}

function renderOlive(cx: number, cy: number, seed: number) {
  const tiltDeg = (seededRand(seed) * 180).toFixed(0)
  return (
    <g key={`olv-${seed}`} transform={`rotate(${tiltDeg} ${cx.toFixed(1)} ${cy.toFixed(1)})`}>
      <ellipse cx={cx + 0.5} cy={cy + 1} rx="6.5" ry="9.5" fill="rgba(0,0,0,0.25)" />
      <ellipse cx={cx} cy={cy} rx="6" ry="9" fill="#1e2a14" />
      <ellipse cx={cx} cy={cy} rx="4.5" ry="7" fill="#2c3c1a" />
      <ellipse cx={cx} cy={cy} rx="2.5" ry="4.5" fill="#161e0c" />
      <ellipse cx={cx} cy={cy} rx="1.8" ry="3.2" fill="#d4a840" opacity="0.9" />
      <ellipse cx={cx - 1.5} cy={cy - 3} rx="1.2" ry="1.8" fill="white" opacity="0.22" />
    </g>
  )
}

function renderBellPepper(cx: number, cy: number, seed: number) {
  const hue = seededRand(seed) > 0.5 ? '#d4541a' : '#e8b010'
  const dark = seededRand(seed) > 0.5 ? '#8a2c08' : '#9a6808'
  const tiltDeg = (seededRand(seed + 1) * 140 - 70).toFixed(0)
  return (
    <g key={`bp-${seed}`} transform={`rotate(${tiltDeg} ${cx.toFixed(1)} ${cy.toFixed(1)})`}>
      <path d={`M${cx},${cy - 9} C${cx + 9},${cy - 6} ${cx + 10},${cy + 4} ${cx + 1.5},${cy + 9}
                 C${cx - 1.5},${cy + 10} ${cx - 10},${cy + 4} ${cx - 9},${cy - 6} Z`}
        fill={dark} opacity="0.5" transform={`translate(1,1.5)`} />
      <path d={`M${cx},${cy - 9} C${cx + 9},${cy - 6} ${cx + 10},${cy + 4} ${cx + 1.5},${cy + 9}
                 C${cx - 1.5},${cy + 10} ${cx - 10},${cy + 4} ${cx - 9},${cy - 6} Z`}
        fill={hue} />
      <line x1={cx} y1={cy - 9} x2={cx} y2={cy + 9} stroke="rgba(0,0,0,0.18)" strokeWidth="1.2" />
      <ellipse cx={cx - 2.5} cy={cy - 4} rx="2.5" ry="3.5" fill="white" opacity="0.22" transform={`rotate(-10 ${cx - 2.5} ${cy - 4})`} />
    </g>
  )
}

function renderArugula(cx: number, cy: number, seed: number) {
  const tiltDeg = (seededRand(seed) * 360).toFixed(0)
  return (
    <g key={`arg-${seed}`} transform={`rotate(${tiltDeg} ${cx.toFixed(1)} ${cy.toFixed(1)})`}>
      {/* shadow */}
      <path d={`M${cx},${cy + 8} C${cx - 8},${cy + 1} ${cx - 7},${cy - 5} ${cx},${cy - 9}
                 C${cx + 7},${cy - 5} ${cx + 8},${cy + 1} ${cx},${cy + 8} Z`}
        fill="rgba(0,0,0,0.2)" transform="translate(1,1.5)" />
      {/* leaf blade */}
      <path d={`M${cx},${cy + 8} C${cx - 8},${cy + 1} ${cx - 7},${cy - 5} ${cx},${cy - 9}
                 C${cx + 7},${cy - 5} ${cx + 8},${cy + 1} ${cx},${cy + 8} Z`}
        fill="#3a7020" />
      {/* lighter vein area */}
      <path d={`M${cx},${cy + 7} C${cx - 4},${cy + 1} ${cx - 3},${cy - 4} ${cx},${cy - 8}
                 C${cx + 3},${cy - 4} ${cx + 4},${cy + 1} ${cx},${cy + 7} Z`}
        fill="#4a8c2a" opacity="0.6" />
      {/* center vein */}
      <line x1={cx} y1={cy + 8} x2={cx} y2={cy - 9} stroke="#2a5014" strokeWidth="0.9" opacity="0.7" />
      {[-4, -1, 3, 6].map((dy, i) => (
        <line key={i} x1={cx} y1={cy + dy} x2={cx + (i % 2 === 0 ? 5 : -5)} y2={cy + dy - 2}
          stroke="#2a5014" strokeWidth="0.7" opacity="0.5" />
      ))}
    </g>
  )
}

function renderCherryTomato(cx: number, cy: number, seed: number) {
  return (
    <g key={`cht-${seed}`}>
      <circle cx={cx + 1} cy={cy + 1.5} r="9" fill="rgba(0,0,0,0.25)" />
      <circle cx={cx} cy={cy} r="9" fill="#900e0e" />
      <circle cx={cx} cy={cy} r="8" fill="#d42020" />
      <circle cx={cx} cy={cy} r="7.2" fill="#e83030" />
      {/* crease */}
      <path d={`M${cx},${cy - 7} Q${cx + 2},${cy} ${cx},${cy + 7}`}
        fill="none" stroke="#a01010" strokeWidth="1" opacity="0.4" />
      {/* highlight */}
      <ellipse cx={cx - 3} cy={cy - 3} rx="3.5" ry="2.2" fill="white" opacity="0.3" transform={`rotate(-30 ${cx - 3} ${cy - 3})`} />
      {/* stem */}
      <path d={`M${cx - 1.5},${cy - 7.5} Q${cx},${cy - 10} ${cx + 1.5},${cy - 7.5}`}
        fill="none" stroke="#1a8010" strokeWidth="1.8" strokeLinecap="round" />
    </g>
  )
}

function renderProsciutto(cx: number, cy: number, seed: number) {
  const tiltDeg = (seededRand(seed) * 140 - 70).toFixed(0)
  return (
    <g key={`pro-${seed}`} transform={`rotate(${tiltDeg} ${cx.toFixed(1)} ${cy.toFixed(1)})`}>
      <path d={`M${cx - 10},${cy - 4} C${cx - 7},${cy - 9} ${cx + 4},${cy - 10} ${cx + 10},${cy - 3}
                 C${cx + 12},${cy + 3} ${cx + 6},${cy + 9} ${cx - 3},${cy + 8}
                 C${cx - 10},${cy + 6} ${cx - 13},${cy + 2} ${cx - 10},${cy - 4} Z`}
        fill="#b06050" opacity="0.5" transform="translate(1,2)" />
      <path d={`M${cx - 10},${cy - 4} C${cx - 7},${cy - 9} ${cx + 4},${cy - 10} ${cx + 10},${cy - 3}
                 C${cx + 12},${cy + 3} ${cx + 6},${cy + 9} ${cx - 3},${cy + 8}
                 C${cx - 10},${cy + 6} ${cx - 13},${cy + 2} ${cx - 10},${cy - 4} Z`}
        fill="#cc7060" />
      {/* fat marbling streaks */}
      <path d={`M${cx - 5},${cy - 6} C${cx - 1},${cy - 3} ${cx + 5},${cy - 4} ${cx + 8},${cy - 1}`}
        fill="none" stroke="#f8e0d0" strokeWidth="2" opacity="0.6" />
      <path d={`M${cx - 7},${cy + 1} C${cx - 3},${cy + 4} ${cx + 3},${cy + 3} ${cx + 7},${cy + 5}`}
        fill="none" stroke="#f8e0d0" strokeWidth="1.5" opacity="0.45" />
      <path d={`M${cx - 2},${cy - 7} C${cx + 2},${cy - 5} ${cx + 3},${cy + 1} ${cx + 5},${cy + 3}`}
        fill="none" stroke="#f8e0d0" strokeWidth="1" opacity="0.3" />
      {/* outline */}
      <path d={`M${cx - 10},${cy - 4} C${cx - 7},${cy - 9} ${cx + 4},${cy - 10} ${cx + 10},${cy - 3}
                 C${cx + 12},${cy + 3} ${cx + 6},${cy + 9} ${cx - 3},${cy + 8}
                 C${cx - 10},${cy + 6} ${cx - 13},${cy + 2} ${cx - 10},${cy - 4} Z`}
        fill="none" stroke="#904030" strokeWidth="0.7" opacity="0.5" />
    </g>
  )
}

const TOPPING_RENDERERS: Record<string, (cx: number, cy: number, seed: number) => React.ReactElement> = {
  mozzarella:   renderMozzarella,
  pepperoni:    renderPepperoni,
  mushrooms:    renderMushroom,
  olives:       renderOlive,
  bell_pepper:  renderBellPepper,
  arugula:      renderArugula,
  cherry_tomato: renderCherryTomato,
  prosciutto:   renderProsciutto,
}

// How many pieces per topping
const TOPPING_COUNT: Record<string, number> = {
  mozzarella: 9, pepperoni: 10, mushrooms: 8, olives: 11,
  bell_pepper: 9, arugula: 12, cherry_tomato: 9, prosciutto: 7,
}

function PizzaPreview({
  dough,
  sauce,
  toppings,
}: {
  dough: PizzaIngredient | null
  sauce: PizzaIngredient | null
  toppings: PizzaTopping[]
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
  const crustDark = dough.id === 'whole' ? '#7a5030' : dough.id === 'thin' ? '#a07828' : '#b08830'
  const crustMid  = dough.color

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
            const renderer = TOPPING_RENDERERS[topping.id]
            if (!renderer) return null
            const count = TOPPING_COUNT[topping.id] ?? 6
            const positions = getToppingPositions(ti, count)
            return positions.slice(0, count).map(([px, py], pi) =>
              renderer(px, py, ti * 100 + pi)
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
  const { t, lang } = useLocale()
  const { addCustomPizza, openDrawer } = useCartActions()

  const [step, setStep] = useState<Step>(0)
  const [dough, setDough] = useState<PizzaIngredient | null>(null)
  const [sauce, setSauce] = useState<PizzaIngredient | null>(null)
  const [toppings, setToppings] = useState<PizzaTopping[]>([])

  const totalPrice =
    (dough?.price ?? 0) +
    (sauce?.price ?? 0) +
    toppings.reduce((s, t) => s + t.price, 0)

  function toggleTopping(topping: PizzaTopping) {
    setToppings((prev) =>
      prev.find((t) => t.id === topping.id)
        ? prev.filter((t) => t.id !== topping.id)
        : [...prev, topping],
    )
  }

  function handleAddToCart() {
    if (!dough || !sauce) return
    const pizza = { dough, sauce, toppings }
    const price = calcPizzaPrice(pizza)
    const toppingNames = toppings.map((t) => t.name[lang]).join(', ')
    const label = `${t('builder.custom')}: ${dough.name[lang]}, ${sauce.name[lang]}${toppingNames ? `, ${toppingNames}` : ''}`
    addCustomPizza({
      id: `custom-pizza-${Date.now()}`,
      label,
      price,
      doughId: dough.id,
      sauceId: sauce.id,
      toppingIds: toppings.map((t) => t.id),
    })
    openDrawer()
    // reset
    setStep(0)
    setDough(null)
    setSauce(null)
    setToppings([])
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
          {step === 0 && (
            <ul className="builder-options">
              {DOUGHS.map((d) => (
                <li key={d.id}>
                  <button
                    type="button"
                    className={`builder-option${dough?.id === d.id ? ' is-selected' : ''}`}
                    onClick={() => setDough(d)}
                  >
                    <span
                      className="builder-option__swatch"
                      style={{ background: d.color }}
                    />
                    <span className="builder-option__name">{d.name[lang]}</span>
                    <span className="builder-option__price">{d.price} {t('menu.currency')}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Step 1 — sauce */}
          {step === 1 && (
            <ul className="builder-options">
              {SAUCES.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    className={`builder-option${sauce?.id === s.id ? ' is-selected' : ''}`}
                    onClick={() => setSauce(s)}
                  >
                    <span
                      className="builder-option__swatch"
                      style={{ background: s.color }}
                    />
                    <span className="builder-option__name">{s.name[lang]}</span>
                    <span className="builder-option__price">{s.price} {t('menu.currency')}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Step 2 — toppings */}
          {step === 2 && (
            <>
              <p className="builder-page__hint">{t('builder.toppings.hint')}</p>
              <ul className="builder-options builder-options--grid">
                {TOPPINGS.map((tp) => {
                  const selected = toppings.some((t) => t.id === tp.id)
                  return (
                    <li key={tp.id}>
                      <button
                        type="button"
                        className={`builder-option${selected ? ' is-selected' : ''}`}
                        onClick={() => toggleTopping(tp)}
                      >
                        <span
                          className="builder-option__swatch"
                          style={{ background: tp.color }}
                        />
                        <span className="builder-option__name">{tp.name[lang]}</span>
                        <span className="builder-option__price">+{tp.price} {t('menu.currency')}</span>
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
                onClick={handleAddToCart}
                disabled={!dough || !sauce}
              >
                {t('builder.addToCart')} — {totalPrice} {t('menu.currency')}
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
                  <span className="builder-page__price-label">{dough.name[lang]}</span>
                  <span className="builder-page__price-val">{dough.price} {t('menu.currency')}</span>
                </div>
              )}
              {sauce && (
                <div className="builder-page__price-item">
                  <span className="builder-page__price-label">{sauce.name[lang]}</span>
                  <span className="builder-page__price-val">{sauce.price} {t('menu.currency')}</span>
                </div>
              )}
              {toppings.map((tp) => (
                <div key={tp.id} className="builder-page__price-item">
                  <span className="builder-page__price-label">{tp.name[lang]}</span>
                  <span className="builder-page__price-val">{tp.price} {t('menu.currency')}</span>
                </div>
              ))}
            </div>
            <div className="builder-page__price-total">
              <span>{t('builder.total')}</span>
              <strong>{totalPrice} {t('menu.currency')}</strong>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
