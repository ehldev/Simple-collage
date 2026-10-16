import React from 'react'
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion'
import { C, display, pop, sans } from '../theme'
import { Photo } from '../collage'

/**
 * Escena 6 (120 frames): cierre con el titular-collage de la web
 * ("Junta tus fotos en un collage") y el llamado a la acción.
 */
const GRID_W = 920
const GRID_H = GRID_W * (4.4 / 6)

const cell = (area: string, bg: string, color: string, text?: string, photo?: string) => ({ area, bg, color, text, photo })
const CELLS = [
  cell('w1', C.ink, '#fff', 'Junta'),
  cell('p1', C.paper, C.ink, undefined, 'sunset'),
  cell('w2', C.tomato, '#fff', 'tus fotos'),
  cell('p2', C.paper, C.ink, undefined, 'beach'),
  cell('w3', C.sun, C.ink, 'en un'),
  cell('p3', C.paper, C.ink, undefined, 'party'),
  cell('w4', C.paper, C.ink, 'collage'),
]

export const Cta: React.FC<{ siteUrl: string }> = ({ siteUrl }) => {
  const frame = useCurrentFrame()
  const assemble = pop(frame, 0, { damping: 18 })
  const spread = interpolate(frame, [10, 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const gap = 16 * spread
  const button = pop(frame, 30, { damping: 11 })
  const url = pop(frame, 42, { damping: 16 })
  const logo = pop(frame, 4, { damping: 16 })
  const pulse = frame > 70 ? 1 + 0.035 * Math.sin((frame - 70) / 4.8) : 1

  return (
    <AbsoluteFill style={{ background: C.sky }}>
      {/* Marca */}
      <div style={{ position: 'absolute', top: 110, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20, opacity: logo, transform: `translateY(${(1 - logo) * -30}px)` }}>
        <div style={{ position: 'relative', width: 60, height: 60 }}>
          <div style={{ position: 'absolute', left: 0, top: 0, width: 32, height: 60, borderRadius: 10, background: C.tomato }} />
          <div style={{ position: 'absolute', left: 38, top: 0, width: 22, height: 27, borderRadius: 8, background: C.sun }} />
          <div style={{ position: 'absolute', left: 38, top: 33, width: 22, height: 27, borderRadius: 8, background: C.ink }} />
        </div>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 56, color: C.ink, letterSpacing: '-0.02em' }}>Simple Collage</div>
      </div>

      {/* Titular-collage */}
      <div
        style={{
          position: 'absolute', left: (1080 - GRID_W) / 2, top: 250, width: GRID_W, height: GRID_H,
          display: 'grid', gap,
          gridTemplateColumns: 'repeat(6, 1fr)', gridTemplateRows: 'repeat(4, 1fr)',
          gridTemplateAreas: '"w1 w1 w1 w1 p1 p1" "w2 w2 w2 w2 p1 p1" "p2 p2 w3 w3 w3 p3" "p2 p2 w4 w4 w4 w4"',
          transform: `scale(${0.85 + 0.15 * assemble})`, opacity: Math.min(1, assemble * 1.6),
        }}
      >
        {CELLS.map(c => (
          <div
            key={c.area}
            style={{
              gridArea: c.area, background: c.bg, color: c.color, borderRadius: 22 * spread, overflow: 'hidden',
              display: 'flex', alignItems: 'flex-end', padding: c.text ? '0 26px 12px' : 0,
              fontFamily: display, fontWeight: 800, fontSize: 104, lineHeight: 0.95, letterSpacing: '-0.035em', whiteSpace: 'nowrap',
            }}
          >
            {c.photo ? <Photo name={c.photo} /> : c.text}
          </div>
        ))}
      </div>

      {/* Llamado a la acción */}
      <div style={{ position: 'absolute', top: 250 + GRID_H + 70, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30 }}>
        <div
          style={{
            fontFamily: sans, fontWeight: 700, fontSize: 54, color: '#fff', background: C.tomato, borderRadius: 999, padding: '30px 64px',
            transform: `scale(${button * pulse})`, boxShadow: '0 24px 50px -20px rgba(226,50,87,.7)',
          }}
        >
          Crea tu collage gratis
        </div>
        <div style={{ fontFamily: sans, fontWeight: 600, fontSize: 44, color: C.inkSoft, opacity: url, transform: `translateY(${(1 - url) * 20}px)` }}>
          {siteUrl}
        </div>
      </div>
    </AbsoluteFill>
  )
}
