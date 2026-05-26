import type { ReactElement } from 'react'

export function seededRand(seed: number) {
  const x = Math.sin(seed + 1) * 10000
  return x - Math.floor(x)
}

function poissonDiskPizza(seed: number, maxPts: number, minDist = 22): [number, number][] {
  const cx = 150
  const cy = 150
  const R = 90
  const pts: [number, number][] = []
  let attempts = 0
  let s = seed * 1000 + 1
  function rand() {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
  while (pts.length < maxPts && attempts < maxPts * 60) {
    attempts++
    const angle = rand() * Math.PI * 2
    const r = Math.sqrt(rand()) * R
    const x = cx + Math.cos(angle) * r
    const y = cy + Math.sin(angle) * r
    const tooClose = pts.some(([px, py]) => {
      const d = Math.sqrt((x - px) ** 2 + (y - py) ** 2)
      return d < minDist
    })
    if (!tooClose) pts.push([x, y])
  }
  return pts
}

const POSITION_CACHE = new Map<string, [number, number][]>()

export function getToppingPositions(ti: number, count: number): [number, number][] {
  const key = `${ti}-${count}`
  if (!POSITION_CACHE.has(key)) {
    POSITION_CACHE.set(key, poissonDiskPizza(ti * 37 + count * 13, count + 4, 20))
  }
  return POSITION_CACHE.get(key)!
}

function renderMozzarella(cx: number, cy: number, seed: number) {
  const pts = Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * Math.PI * 2
    const r = 11 + seededRand(seed + i) * 5
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]
  })
  const d =
    pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ') + 'Z'
  return (
    <g key={`mozz-${seed}`}>
      <path d={d} fill="#e8d870" opacity="0.5" />
      <path d={d} fill="#fffde8" opacity="0.9" />
      <path d={d} fill="none" stroke="#d4c050" strokeWidth="0.8" opacity="0.45" />
      <ellipse
        cx={cx - 2}
        cy={cy - 2.5}
        rx="4"
        ry="2.5"
        fill="white"
        opacity="0.38"
        transform={`rotate(-20 ${cx - 2} ${cy - 2.5})`}
      />
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
        return (
          <ellipse
            key={i}
            cx={cx + Math.cos(a) * r}
            cy={cy + Math.sin(a) * r}
            rx="1"
            ry="1.6"
            fill="#6a0e0e"
            opacity="0.65"
            transform={`rotate(${(a * 180) / Math.PI} ${(cx + Math.cos(a) * r).toFixed(1)} ${(cy + Math.sin(a) * r).toFixed(1)})`}
          />
        )
      })}
      <ellipse
        cx={cx - 3}
        cy={cy - 3}
        rx="3"
        ry="2"
        fill="white"
        opacity="0.2"
        transform={`rotate(-25 ${cx - 3} ${cy - 3})`}
      />
    </g>
  )
}

function renderMushroom(cx: number, cy: number, seed: number) {
  const tiltDeg = (seededRand(seed) * 60 - 30).toFixed(0)
  return (
    <g key={`mush-${seed}`} transform={`rotate(${tiltDeg} ${cx.toFixed(1)} ${cy.toFixed(1)})`}>
      <ellipse cx={cx + 1} cy={cy + 2} rx="10" ry="4" fill="rgba(0,0,0,0.2)" />
      <ellipse cx={cx} cy={cy - 3} rx="10" ry="7" fill="#6b4a30" />
      <ellipse cx={cx} cy={cy - 3} rx="8.5" ry="5.5" fill="#a07858" />
      <ellipse
        cx={cx - 2}
        cy={cy - 5}
        rx="4"
        ry="2"
        fill="white"
        opacity="0.15"
        transform={`rotate(-15 ${cx - 2} ${cy - 5})`}
      />
      {[-4, -1.5, 1.5, 4].map((dx) => (
        <line
          key={dx}
          x1={cx + dx}
          y1={cy + 2}
          x2={cx + dx * 0.7}
          y2={cy + 7}
          stroke="#5a3820"
          strokeWidth="1"
          opacity="0.55"
        />
      ))}
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
      <path
        d={`M${cx},${cy - 9} C${cx + 9},${cy - 6} ${cx + 10},${cy + 4} ${cx + 1.5},${cy + 9}
                 C${cx - 1.5},${cy + 10} ${cx - 10},${cy + 4} ${cx - 9},${cy - 6} Z`}
        fill={dark}
        opacity="0.5"
        transform="translate(1,1.5)"
      />
      <path
        d={`M${cx},${cy - 9} C${cx + 9},${cy - 6} ${cx + 10},${cy + 4} ${cx + 1.5},${cy + 9}
                 C${cx - 1.5},${cy + 10} ${cx - 10},${cy + 4} ${cx - 9},${cy - 6} Z`}
        fill={hue}
      />
      <line x1={cx} y1={cy - 9} x2={cx} y2={cy + 9} stroke="rgba(0,0,0,0.18)" strokeWidth="1.2" />
      <ellipse
        cx={cx - 2.5}
        cy={cy - 4}
        rx="2.5"
        ry="3.5"
        fill="white"
        opacity="0.22"
        transform={`rotate(-10 ${cx - 2.5} ${cy - 4})`}
      />
    </g>
  )
}

function renderArugula(cx: number, cy: number, seed: number) {
  const tiltDeg = (seededRand(seed) * 360).toFixed(0)
  return (
    <g key={`arg-${seed}`} transform={`rotate(${tiltDeg} ${cx.toFixed(1)} ${cy.toFixed(1)})`}>
      <path
        d={`M${cx},${cy + 8} C${cx - 8},${cy + 1} ${cx - 7},${cy - 5} ${cx},${cy - 9}
                 C${cx + 7},${cy - 5} ${cx + 8},${cy + 1} ${cx},${cy + 8} Z`}
        fill="rgba(0,0,0,0.2)"
        transform="translate(1,1.5)"
      />
      <path
        d={`M${cx},${cy + 8} C${cx - 8},${cy + 1} ${cx - 7},${cy - 5} ${cx},${cy - 9}
                 C${cx + 7},${cy - 5} ${cx + 8},${cy + 1} ${cx},${cy + 8} Z`}
        fill="#3a7020"
      />
      <path
        d={`M${cx},${cy + 7} C${cx - 4},${cy + 1} ${cx - 3},${cy - 4} ${cx},${cy - 8}
                 C${cx + 3},${cy - 4} ${cx + 4},${cy + 1} ${cx},${cy + 7} Z`}
        fill="#4a8c2a"
        opacity="0.6"
      />
      <line x1={cx} y1={cy + 8} x2={cx} y2={cy - 9} stroke="#2a5014" strokeWidth="0.9" opacity="0.7" />
      {[-4, -1, 3, 6].map((dy, i) => (
        <line
          key={i}
          x1={cx}
          y1={cy + dy}
          x2={cx + (i % 2 === 0 ? 5 : -5)}
          y2={cy + dy - 2}
          stroke="#2a5014"
          strokeWidth="0.7"
          opacity="0.5"
        />
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
      <path
        d={`M${cx},${cy - 7} Q${cx + 2},${cy} ${cx},${cy + 7}`}
        fill="none"
        stroke="#a01010"
        strokeWidth="1"
        opacity="0.4"
      />
      <ellipse
        cx={cx - 3}
        cy={cy - 3}
        rx="3.5"
        ry="2.2"
        fill="white"
        opacity="0.3"
        transform={`rotate(-30 ${cx - 3} ${cy - 3})`}
      />
      <path
        d={`M${cx - 1.5},${cy - 7.5} Q${cx},${cy - 10} ${cx + 1.5},${cy - 7.5}`}
        fill="none"
        stroke="#1a8010"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </g>
  )
}

function renderProsciutto(cx: number, cy: number, seed: number) {
  const tiltDeg = (seededRand(seed) * 140 - 70).toFixed(0)
  return (
    <g key={`pro-${seed}`} transform={`rotate(${tiltDeg} ${cx.toFixed(1)} ${cy.toFixed(1)})`}>
      <path
        d={`M${cx - 10},${cy - 4} C${cx - 7},${cy - 9} ${cx + 4},${cy - 10} ${cx + 10},${cy - 3}
                 C${cx + 12},${cy + 3} ${cx + 6},${cy + 9} ${cx - 3},${cy + 8}
                 C${cx - 10},${cy + 6} ${cx - 13},${cy + 2} ${cx - 10},${cy - 4} Z`}
        fill="#b06050"
        opacity="0.5"
        transform="translate(1,2)"
      />
      <path
        d={`M${cx - 10},${cy - 4} C${cx - 7},${cy - 9} ${cx + 4},${cy - 10} ${cx + 10},${cy - 3}
                 C${cx + 12},${cy + 3} ${cx + 6},${cy + 9} ${cx - 3},${cy + 8}
                 C${cx - 10},${cy + 6} ${cx - 13},${cy + 2} ${cx - 10},${cy - 4} Z`}
        fill="#cc7060"
      />
      <path
        d={`M${cx - 5},${cy - 6} C${cx - 1},${cy - 3} ${cx + 5},${cy - 4} ${cx + 8},${cy - 1}`}
        fill="none"
        stroke="#f8e0d0"
        strokeWidth="2"
        opacity="0.6"
      />
      <path
        d={`M${cx - 7},${cy + 1} C${cx - 3},${cy + 4} ${cx + 3},${cy + 3} ${cx + 7},${cy + 5}`}
        fill="none"
        stroke="#f8e0d0"
        strokeWidth="1.5"
        opacity="0.45"
      />
      <path
        d={`M${cx - 2},${cy - 7} C${cx + 2},${cy - 5} ${cx + 3},${cy + 1} ${cx + 5},${cy + 3}`}
        fill="none"
        stroke="#f8e0d0"
        strokeWidth="1"
        opacity="0.3"
      />
      <path
        d={`M${cx - 10},${cy - 4} C${cx - 7},${cy - 9} ${cx + 4},${cy - 10} ${cx + 10},${cy - 3}
                 C${cx + 12},${cy + 3} ${cx + 6},${cy + 9} ${cx - 3},${cy + 8}
                 C${cx - 10},${cy + 6} ${cx - 13},${cy + 2} ${cx - 10},${cy - 4} Z`}
        fill="none"
        stroke="#904030"
        strokeWidth="0.7"
        opacity="0.5"
      />
    </g>
  )
}

export type ToppingRenderer = (cx: number, cy: number, seed: number) => ReactElement

export const TOPPING_RENDERERS: Record<string, ToppingRenderer> = {
  mozzarella: renderMozzarella,
  pepperoni: renderPepperoni,
  mushrooms: renderMushroom,
  olives: renderOlive,
  bell_pepper: renderBellPepper,
  arugula: renderArugula,
  cherry_tomato: renderCherryTomato,
  prosciutto: renderProsciutto,
}

export const TOPPING_COUNT: Record<string, number> = {
  mozzarella: 9,
  pepperoni: 10,
  mushrooms: 8,
  olives: 11,
  bell_pepper: 9,
  arugula: 12,
  cherry_tomato: 9,
  prosciutto: 7,
}
