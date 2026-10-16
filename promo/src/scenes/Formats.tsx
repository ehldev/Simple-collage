import React from 'react'
import { AbsoluteFill, useCurrentFrame } from 'remotion'
import { C, CORAL, display, lerp, pop, sans } from '../theme'
import { Collage } from '../collage'

/** Escena 4 (90 frames): el mismo collage cambia de formato. */
const FORMATS = [
  { at: 0, ratio: 1, label: 'Cuadrado' },
  { at: 30, ratio: 4 / 5, label: 'Instagram' },
  { at: 60, ratio: 9 / 16, label: 'Historias' },
]
const PHOTOS = ['sunset', 'mountain', 'beach', 'city', 'field', 'party']
const BOX = { cx: 540, top: 400, maxW: 820, maxH: 880 }

function size(ratio: number) {
  const w = Math.min(BOX.maxW, BOX.maxH * ratio)
  return { w, h: w / ratio }
}

export const Formats: React.FC = () => {
  const frame = useCurrentFrame()

  let idx = 0
  FORMATS.forEach((f, i) => {
    if (frame >= f.at) idx = i
  })
  const prev = FORMATS[Math.max(0, idx - 1)]!
  const cur = FORMATS[idx]!
  const t = idx === 0 ? 1 : pop(frame, cur.at, { damping: 15 })
  const a = size(prev.ratio)
  const b = size(cur.ratio)
  const w = lerp(a.w, b.w, t)
  const h = lerp(a.h, b.h, t)
  const head = pop(frame, 0, { damping: 16 })
  const chip = pop(frame, cur.at, { damping: 11 })

  return (
    <AbsoluteFill style={{ background: C.sky }}>
      <div style={{ position: 'absolute', left: 80, right: 80, top: 120 }}>
        {['Para Instagram,', 'historias o imprimir.'].map((line, i) => (
          <div key={line} style={{ overflow: 'hidden', height: 112 }}>
            <div style={{ fontFamily: display, fontWeight: 800, fontSize: 96, lineHeight: 1.15, letterSpacing: '-0.035em', color: C.ink, transform: `translateY(${(1 - pop(frame, i * 4, { damping: 16 })) * 112}px)`, opacity: head }}>
              {line}
            </div>
          </div>
        ))}
      </div>

      <div style={{ position: 'absolute', left: BOX.cx - w / 2, top: BOX.top + (BOX.maxH - h) / 2, boxShadow: '0 50px 90px -45px rgba(22,33,62,0.6)' }}>
        <Collage layout="six-feature" width={w} height={h} gap={20} radius={20} background={CORAL} photos={PHOTOS}>
          <div style={{ position: 'absolute', left: 0, right: 0, top: '74%', textAlign: 'center', fontFamily: display, fontWeight: 800, fontSize: Math.min(84, w * 0.105), whiteSpace: 'nowrap', color: '#fff', textShadow: '0 4px 24px rgba(0,0,0,.6)', letterSpacing: '-0.02em' }}>
            Verano 2026 ☀️
          </div>
        </Collage>
        <div
          style={{
            position: 'absolute', right: -24, top: -28, padding: '14px 28px', borderRadius: 999, background: C.ink, color: '#fff',
            fontFamily: sans, fontWeight: 700, fontSize: 38, transform: `scale(${0.7 + 0.3 * chip}) rotate(${(1 - chip) * 10}deg)`,
            boxShadow: '0 12px 24px -10px rgba(22,33,62,.6)',
          }}
        >
          {cur.label}
        </div>
      </div>
    </AbsoluteFill>
  )
}
