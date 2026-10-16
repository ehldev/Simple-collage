import React from 'react'
import { AbsoluteFill, useCurrentFrame } from 'remotion'
import { BEAT, C, display, pop } from '../theme'

/** Escena 5 (90 frames): tres beneficios, uno por tiempo de la música. */
const ITEMS = ['Gratis y sin marca de agua', 'Sin registrarte', 'Tus fotos no salen de tu celular']

const Check: React.FC<{ p: number }> = ({ p }) => (
  <div style={{ width: 92, height: 92, borderRadius: 28, background: C.sun, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${p}) rotate(${(1 - p) * -30}deg)` }}>
    <svg width="54" height="54" viewBox="0 0 24 24" fill="none" stroke={C.ink} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.5l4.5 4.5L19 7" strokeDasharray="22" strokeDashoffset={22 * (1 - p)} />
    </svg>
  </div>
)

export const Benefits: React.FC = () => {
  const frame = useCurrentFrame()
  return (
    <AbsoluteFill style={{ background: C.ink, justifyContent: 'center', padding: '0 90px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 64 }}>
        {ITEMS.map((text, i) => {
          const p = pop(frame, 4 + i * BEAT, { damping: 13 })
          return (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 40, opacity: Math.min(1, p * 2), transform: `translateX(${(1 - p) * 120}px)` }}>
              <Check p={p} />
              <div style={{ fontFamily: display, fontWeight: 800, fontSize: 74, lineHeight: 1.05, letterSpacing: '-0.03em', color: '#fff', textWrap: 'balance' }}>{text}</div>
            </div>
          )
        })}
      </div>
    </AbsoluteFill>
  )
}
