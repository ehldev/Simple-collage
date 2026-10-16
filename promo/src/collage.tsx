import React from 'react'
import { Img, staticFile } from 'remotion'
import { C } from './theme'

type Cell = [number, number, number, number]

function units(cols: number, rows: number, list: Cell[]): Cell[] {
  return list.map(([x, y, w, h]) => [x / cols, y / rows, w / cols, h / rows])
}

/** Mismas plantillas que la app (subconjunto). */
export const LAYOUTS: Record<string, Cell[]> = {
  'grid-4': units(2, 2, [[0, 0, 1, 1], [1, 0, 1, 1], [0, 1, 1, 1], [1, 1, 1, 1]]),
  'six-feature': units(3, 3, [[0, 0, 2, 2], [2, 0, 1, 1], [2, 1, 1, 1], [0, 2, 1, 1], [1, 2, 1, 1], [2, 2, 1, 1]]),
  'trio-left-big': units(2, 2, [[0, 0, 1, 2], [1, 0, 1, 1], [1, 1, 1, 1]]),
  'duo-cols': units(2, 1, [[0, 0, 1, 1], [1, 0, 1, 1]]),
  'four-top-big': [[0, 0, 1, 0.62], [0, 0.62, 1 / 3, 0.38], [1 / 3, 0.62, 1 / 3, 0.38], [2 / 3, 0.62, 1 / 3, 0.38]],
  'four-strip': units(1, 4, [[0, 0, 1, 1], [0, 1, 1, 1], [0, 2, 1, 1], [0, 3, 1, 1]]),
  'grid-9': units(3, 3, Array.from({ length: 9 }, (_, i) => [i % 3, Math.floor(i / 3), 1, 1] as Cell)),
  'five-left-big': units(4, 2, [[0, 0, 2, 2], [2, 0, 1, 1], [3, 0, 1, 1], [2, 1, 1, 1], [3, 1, 1, 1]]),
}

export interface Rect { x: number, y: number, w: number, h: number }

/** Igual que el editor: margen exterior = espaciado, mitad del espaciado entre celdas. */
export function cellRects(cells: Cell[], width: number, height: number, gap: number): Rect[] {
  const half = gap / 2
  const innerW = width - gap * 2
  const innerH = height - gap * 2
  const e = 0.0001
  return cells.map(([cx, cy, cw, ch]) => {
    const l = cx > e ? half : 0
    const t = cy > e ? half : 0
    const r = cx + cw < 1 - e ? half : 0
    const b = cy + ch < 1 - e ? half : 0
    return { x: gap + cx * innerW + l, y: gap + cy * innerH + t, w: cw * innerW - l - r, h: ch * innerH - t - b }
  })
}

export const Photo: React.FC<{ name: string, style?: React.CSSProperties }> = ({ name, style }) => (
  <Img src={staticFile(`photos/${name}.jpg`)} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', ...style }} />
)

export const Placeholder: React.FC<{ size: number }> = ({ size }) => (
  <div style={{ width: '100%', height: '100%', background: C.placeholder, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ width: size, height: size, borderRadius: '50%', background: C.paper, position: 'relative' }}>
      <div style={{ position: 'absolute', left: '28%', right: '28%', top: '47%', height: '6%', background: C.ink, borderRadius: 4 }} />
      <div style={{ position: 'absolute', top: '28%', bottom: '28%', left: '47%', width: '6%', background: C.ink, borderRadius: 4 }} />
    </div>
  </div>
)

export interface CollageProps {
  layout: string
  width: number
  height: number
  gap: number
  radius: number
  background: string
  photos: (string | null)[]
  /** Animación de entrada de cada foto (0..1). */
  photoIn?: number[]
  children?: React.ReactNode
  style?: React.CSSProperties
}

export const Collage: React.FC<CollageProps> = ({ layout, width, height, gap, radius, background, photos, photoIn, children, style }) => {
  const rects = cellRects(LAYOUTS[layout]!, width, height, gap)
  return (
    <div style={{ position: 'relative', width, height, background, overflow: 'hidden', ...style }}>
      {rects.map((r, i) => {
        const p = photos[i]
        const t = photoIn?.[i] ?? 1
        return (
          <div key={i} style={{ position: 'absolute', left: r.x, top: r.y, width: r.w, height: r.h, borderRadius: Math.min(radius, r.w / 2, r.h / 2), overflow: 'hidden' }}>
            <Placeholder size={Math.min(r.w, r.h) * 0.24} />
            {p && t > 0 && (
              <div style={{ position: 'absolute', inset: 0, opacity: Math.min(1, t * 1.5), transform: `scale(${1.25 - 0.25 * t})` }}>
                <Photo name={p} />
              </div>
            )}
          </div>
        )
      })}
      {children}
    </div>
  )
}
