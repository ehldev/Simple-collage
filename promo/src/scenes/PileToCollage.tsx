import React from 'react'
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion'
import { C, clamp01, display, lerp, pop } from '../theme'
import { cellRects, LAYOUTS, Photo } from '../collage'

/**
 * Escenas 1 y 2 (150 frames): fotos desordenadas que caen como una pila
 * y, en el "drop" de la música (frame 60), saltan a un collage y se separan.
 */
const PHOTOS = ['sunset', 'mountain', 'beach', 'city', 'field', 'party']

// Posición en la pila: centro x/y, rotación (sobre un lienzo de 1080x1350)
const PILE = [
  { x: 330, y: 820, r: -12 },
  { x: 740, y: 760, r: 9 },
  { x: 290, y: 1110, r: 10 },
  { x: 560, y: 1000, r: 4 },
  { x: 800, y: 1090, r: -7 },
  { x: 560, y: 760, r: -3 },
]
const CARD_W = 360
const CARD_H = 450

const COLLAGE = { left: 120, top: 420, size: 840 }
const DROP = 60

const Headline: React.FC<{ lines: string[], enter: number, exit?: number }> = ({ lines, enter, exit }) => {
  const frame = useCurrentFrame()
  return (
    <div style={{ position: 'absolute', left: 80, top: 120, right: 80 }}>
      {lines.map((line, i) => {
        const inP = pop(frame, enter + i * 5, { damping: 16 })
        const outP = exit === undefined ? 0 : clamp01(frame, exit + i * 2, exit + 8 + i * 2)
        return (
          <div key={line} style={{ overflow: 'hidden', height: 128 }}>
            <div
              style={{
                fontFamily: display,
                fontWeight: 800,
                fontSize: 112,
                lineHeight: 1.1,
                letterSpacing: '-0.035em',
                color: C.ink,
                transform: `translateY(${(1 - inP) * 130 - outP * 130}px)`,
              }}
            >
              {line}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export const PileToCollage: React.FC = () => {
  const frame = useCurrentFrame()

  // 0 = pila, 1 = collage
  const toGrid = pop(frame, DROP, { damping: 15, mass: 0.8 })
  // Después de encajar, el collage "respira": aparecen el espaciado y las esquinas
  const spread = interpolate(frame, [DROP + 18, DROP + 34], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const gap = 26 * spread
  const radius = 26 * spread
  const rects = cellRects(LAYOUTS['six-feature']!, COLLAGE.size, COLLAGE.size, gap)

  return (
    <AbsoluteFill style={{ background: C.sky }}>

      {/* Fondo blanco del collage, aparece con el espaciado */}
      <div
        style={{
          position: 'absolute',
          left: COLLAGE.left,
          top: COLLAGE.top,
          width: COLLAGE.size,
          height: COLLAGE.size,
          background: C.paper,
          opacity: spread,
          boxShadow: `0 40px 80px -40px rgba(22,33,62,${0.5 * spread})`,
        }}
      />

      {PHOTOS.map((name, i) => {
        const fall = pop(frame, 3 + i * 5, { damping: 13 })
        const pile = PILE[i]!
        const cell = rects[i]!
        const pileX = pile.x - CARD_W / 2
        const pileY = pile.y - CARD_H / 2 - (1 - fall) * 1300
        const x = lerp(pileX, COLLAGE.left + cell.x, toGrid)
        const y = lerp(pileY, COLLAGE.top + cell.y, toGrid)
        const w = lerp(CARD_W, cell.w, toGrid)
        const h = lerp(CARD_H, cell.h, toGrid)
        const border = 14 * (1 - toGrid)
        return (
          <div
            key={name}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: w,
              height: h,
              transform: `rotate(${lerp(pile.r, 0, toGrid)}deg)`,
              background: C.paper,
              padding: border,
              paddingBottom: border * 3.2,
              borderRadius: Math.max(6 * (1 - toGrid), radius),
              boxShadow: `0 24px 50px -18px rgba(22,33,62,${0.45 * (1 - toGrid)})`,
              overflow: 'hidden',
            }}
          >
            <div style={{ width: '100%', height: '100%', borderRadius: Math.max(2, radius - border), overflow: 'hidden' }}>
              <Photo name={name} />
            </div>
          </div>
        )
      })}

      <Headline lines={['¿Muchas fotos', 'y ningún post?']} enter={2} exit={DROP - 6} />
      <Headline lines={['Júntalas en', 'un collage.']} enter={DROP + 6} />
    </AbsoluteFill>
  )
}
