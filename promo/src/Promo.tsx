import React from 'react'
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useVideoConfig } from 'remotion'
import { C } from './theme'
import { PileToCollage } from './scenes/PileToCollage'
import { PhoneDemo } from './scenes/PhoneDemo'
import { Formats } from './scenes/Formats'
import { Benefits } from './scenes/Benefits'
import { Cta } from './scenes/Cta'

export interface PromoProps {
  siteUrl: string
}

/** Todas las escenas se diseñan sobre 1080x1350 (4:5). */
const STAGE_H = 1350

/**
 * En 9:16 el escenario 4:5 queda centrado; las franjas de arriba y abajo
 * coinciden con las zonas que Facebook/Instagram tapan con su interfaz.
 */
const Stage: React.FC<{ background: string, children: React.ReactNode }> = ({ background, children }) => {
  const { height } = useVideoConfig()
  return (
    <AbsoluteFill style={{ background }}>
      <div style={{ position: 'absolute', left: 0, top: (height - STAGE_H) / 2, width: 1080, height: STAGE_H }}>
        {children}
      </div>
    </AbsoluteFill>
  )
}

// Cada corte cae en un tiempo de la música (120 BPM = 15 frames por tiempo).
const SCENES = [
  { from: 0, duration: 150, bg: C.sky, render: () => <PileToCollage /> },
  { from: 150, duration: 330, bg: C.sky, render: () => <PhoneDemo /> },
  { from: 480, duration: 90, bg: C.sky, render: () => <Formats /> },
  { from: 570, duration: 90, bg: C.ink, render: () => <Benefits /> },
] as const

export const PROMO_FRAMES = 780

export const Promo: React.FC<PromoProps> = ({ siteUrl }) => (
  <AbsoluteFill style={{ background: C.sky }}>
    {SCENES.map(s => (
      <Sequence key={s.from} from={s.from} durationInFrames={s.duration}>
        <Stage background={s.bg}>{s.render()}</Stage>
      </Sequence>
    ))}
    <Sequence from={660} durationInFrames={120}>
      <Stage background={C.sky}><Cta siteUrl={siteUrl} /></Stage>
    </Sequence>
    <Audio src={staticFile('music.wav')} volume={f => interpolate(f, [0, 6], [0, 0.9], { extrapolateRight: 'clamp' })} />
  </AbsoluteFill>
)
