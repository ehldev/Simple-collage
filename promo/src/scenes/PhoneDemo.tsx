import React from 'react'
import { AbsoluteFill, useCurrentFrame } from 'remotion'
import { C, clamp01, CORAL, display, lerp, pop, sans } from '../theme'
import { cellRects, Collage, LAYOUTS, Photo } from '../collage'

/**
 * Escena 3 (330 frames): demo del editor en un celular, en 4 pasos
 * sincronizados con la música (cada cambio cae en un tiempo).
 */
export const STEPS = [
  { from: 0, label: 'Elige una plantilla', tab: 0 },
  { from: 90, label: 'Añade tus fotos', tab: 1 },
  { from: 180, label: 'Ajusta el estilo', tab: 3 },
  { from: 255, label: 'Escribe algo', tab: 4 },
]

const PHOTOS = ['sunset', 'mountain', 'beach', 'city', 'field', 'party']
const TITLE = 'Verano 2026'

// Teléfono
const PHONE = { left: 270, top: 262, w: 540, h: 1010, bezel: 16 }
const PHONE_SCALE = 1.06
const SCREEN_W = PHONE.w - PHONE.bezel * 2
const TOPBAR = 70
const CANVAS_H = 470
const PANEL_TOP = TOPBAR + CANVAS_H
const TABBAR = 92
const SCREEN_H = PHONE.h - PHONE.bezel * 2
const COLLAGE_SIZE = 400

// Momentos clave (frames locales)
const TAP_TEMPLATE = 34
const ADD_PHOTOS = 104
const SLIDE_FROM = 192
const SLIDE_TO = 226
const TAP_SWATCH = 236
const TYPE_FROM = 268

function currentStep(frame: number) {
  let s = 0
  STEPS.forEach((step, i) => {
    if (frame >= step.from) s = i
  })
  return s
}

const Caption: React.FC = () => {
  const frame = useCurrentFrame()
  const step = currentStep(frame)
  const local = frame - STEPS[step]!.from
  const p = pop(local, 0, { damping: 15 })
  return (
    <div style={{ position: 'absolute', left: 80, right: 80, top: 110, display: 'flex', alignItems: 'center', gap: 28 }}>
      <div
        style={{
          width: 104, height: 104, borderRadius: 30, background: C.tomato, color: C.paper,
          fontFamily: display, fontWeight: 800, fontSize: 64, display: 'flex', alignItems: 'center', justifyContent: 'center',
          transform: `scale(${0.6 + 0.4 * p}) rotate(${(1 - p) * -20}deg)`,
          flexShrink: 0,
        }}
      >
        {step + 1}
      </div>
      <div style={{ overflow: 'hidden', height: 110 }}>
        <div
          style={{
            fontFamily: display, fontWeight: 800, fontSize: 84, letterSpacing: '-0.03em', color: C.ink, lineHeight: 1.3,
            transform: `translateY(${(1 - p) * 110}px)`, whiteSpace: 'nowrap',
          }}
        >
          {STEPS[step]!.label}
        </div>
      </div>
    </div>
  )
}

const Finger: React.FC<{ x: number, y: number, press: number, visible: number }> = ({ x, y, press, visible }) => (
  <div
    style={{
      position: 'absolute', left: x - 34, top: y - 34, width: 68, height: 68, borderRadius: '50%',
      background: 'rgba(255,255,255,0.55)', border: `4px solid ${C.ink}`,
      transform: `scale(${1 - press * 0.18})`, opacity: visible,
      boxShadow: '0 8px 24px rgba(22,33,62,0.35)',
    }}
  >
    <div
      style={{
        position: 'absolute', inset: -4 - press * 26, borderRadius: '50%', border: `4px solid ${C.tomato}`,
        opacity: press > 0 ? 1 - press : 0,
      }}
    />
  </div>
)

/** Pulsación: sube de 0 a 1 en 4 frames y baja en 8. */
function tap(frame: number, at: number) {
  if (frame < at || frame > at + 14) return 0
  return frame < at + 4 ? (frame - at) / 4 : 1 - (frame - at - 4) / 10
}

const Thumb: React.FC<{ layout: string, active: boolean }> = ({ layout, active }) => {
  const rects = cellRects(LAYOUTS[layout]!, 60, 60, 4)
  const colors = [C.tomato, C.sun, C.ink, '#8DB0E8', '#F9A8BA', '#33467A']
  return (
    <div
      style={{
        width: 98, height: 98, borderRadius: 18, background: active ? 'rgba(255,77,109,0.14)' : C.sky,
        boxShadow: active ? `inset 0 0 0 4px ${C.tomato}` : 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <div style={{ position: 'relative', width: 60, height: 60 }}>
        {rects.map((r, i) => (
          <div key={i} style={{ position: 'absolute', left: r.x, top: r.y, width: r.w, height: r.h, borderRadius: 3, background: active ? colors[i % colors.length] : C.thumb }} />
        ))}
      </div>
    </div>
  )
}

const TEMPLATE_GRID = ['grid-4', 'duo-cols', 'trio-left-big', 'four-top-big', 'five-left-big', 'six-feature', 'four-strip', 'grid-9']

const PanelTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ fontFamily: display, fontWeight: 800, fontSize: 26, color: C.ink, marginBottom: 16 }}>{children}</div>
)

const Slider: React.FC<{ label: string, value: number }> = ({ label, value }) => (
  <div style={{ marginBottom: 22 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: sans, fontWeight: 600, fontSize: 21, color: C.ink }}>
      <span>{label}</span>
      <span style={{ color: C.inkSoft }}>{Math.round(value * 40)}</span>
    </div>
    <div style={{ position: 'relative', height: 10, borderRadius: 5, background: C.skyDeep, marginTop: 14 }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${value * 100}%`, borderRadius: 5, background: C.ink }} />
      <div style={{ position: 'absolute', left: `calc(${value * 100}% - 15px)`, top: -10, width: 30, height: 30, borderRadius: '50%', background: C.ink, border: '5px solid #fff', boxShadow: '0 2px 6px rgba(0,0,0,.3)' }} />
    </div>
  </div>
)

export const PhoneDemo: React.FC = () => {
  const frame = useCurrentFrame()
  const step = currentStep(frame)
  const enter = pop(frame, 0, { damping: 16 })

  // Estado del collage
  const layout = frame < TAP_TEMPLATE + 2 ? 'grid-4' : 'six-feature'
  const layoutBounce = frame >= TAP_TEMPLATE + 2 ? pop(frame, TAP_TEMPLATE + 2, { damping: 10 }) : 1
  const photoIn = PHOTOS.map((_, i) => (frame >= ADD_PHOTOS + 8 + i * 7 ? pop(frame, ADD_PHOTOS + 8 + i * 7, { damping: 12 }) : 0))
  const style = clamp01(frame, SLIDE_FROM, SLIDE_TO)
  const gap = lerp(6, 18, style)
  const radius = lerp(0, 18, style)
  const coral = clamp01(frame, TAP_SWATCH + 2, TAP_SWATCH + 10)
  const typed = TITLE.slice(0, Math.max(0, Math.floor((frame - TYPE_FROM) / 2.4)))
  const sunPop = frame >= TYPE_FROM + 34 ? pop(frame, TYPE_FROM + 34, { damping: 9 }) : 0

  // Coordenadas en pantalla (relativas al lienzo del video)
  const screenX = PHONE.left + PHONE.bezel
  const screenY = PHONE.top + PHONE.bezel + (1 - enter) * 900
  const thumbPos = (i: number) => ({ x: screenX + 24 + (i % 4) * 114 + 49, y: screenY + PANEL_TOP + 22 + 42 + Math.floor(i / 4) * 112 + 49 })
  const sliderY = screenY + PANEL_TOP + 22 + 42 + 30
  const sliderX0 = screenX + 24
  const sliderW = SCREEN_W - 48

  // Dónde está el dedo en cada momento
  let finger = { x: 0, y: 0, press: 0, visible: 0 }
  if (frame >= 12 && frame < 70) {
    const from = thumbPos(0)
    const to = thumbPos(5)
    const t = clamp01(frame, 14, TAP_TEMPLATE - 4)
    finger = { x: lerp(from.x + 120, to.x, t), y: lerp(from.y + 200, to.y, t), press: tap(frame, TAP_TEMPLATE), visible: clamp01(frame, 12, 18) * (1 - clamp01(frame, 60, 68)) }
  }
  else if (frame >= ADD_PHOTOS - 14 && frame < ADD_PHOTOS + 24) {
    const x = screenX + SCREEN_W / 2
    const y = screenY + PANEL_TOP + 22 + 42 + 34
    finger = { x, y: y + (1 - clamp01(frame, ADD_PHOTOS - 14, ADD_PHOTOS - 4)) * 160, press: tap(frame, ADD_PHOTOS), visible: clamp01(frame, ADD_PHOTOS - 14, ADD_PHOTOS - 8) * (1 - clamp01(frame, ADD_PHOTOS + 16, ADD_PHOTOS + 24)) }
  }
  else if (frame >= SLIDE_FROM - 12 && frame < TAP_SWATCH + 22) {
    const knobX = sliderX0 + lerp(6 / 40, 18 / 40, style) * sliderW
    const swatch = { x: screenX + 24 + 4 * 62 + 24, y: screenY + PANEL_TOP + 22 + 42 + 2 * 78 + 40 }
    const toSwatch = clamp01(frame, SLIDE_TO + 2, TAP_SWATCH - 2)
    finger = {
      x: lerp(knobX, swatch.x, toSwatch),
      y: lerp(sliderY, swatch.y, toSwatch),
      press: frame < SLIDE_TO ? clamp01(frame, SLIDE_FROM - 4, SLIDE_FROM) * 0.6 : tap(frame, TAP_SWATCH),
      visible: clamp01(frame, SLIDE_FROM - 12, SLIDE_FROM - 6) * (1 - clamp01(frame, TAP_SWATCH + 14, TAP_SWATCH + 22)),
    }
  }

  const tabs = ['Plantilla', 'Fotos', 'Foto', 'Estilo', 'Texto']

  return (
    <AbsoluteFill style={{ background: C.sky }}>
      <Caption />

      {/* El teléfono y el dedo se escalan juntos para mantener las coordenadas */}
      <AbsoluteFill style={{ transform: `scale(${PHONE_SCALE})`, transformOrigin: `540px ${PHONE.top}px` }}>
      {/* Teléfono */}
      <div
        style={{
          position: 'absolute', left: PHONE.left, top: PHONE.top + (1 - enter) * 900, width: PHONE.w, height: PHONE.h,
          borderRadius: 72, background: C.ink, padding: PHONE.bezel,
          boxShadow: '0 60px 120px -50px rgba(22,33,62,0.65)',
        }}
      >
        <div style={{ position: 'relative', width: SCREEN_W, height: SCREEN_H, borderRadius: 58, overflow: 'hidden', background: C.sky }}>
          {/* Barra superior */}
          <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: TOPBAR, background: C.paper, borderBottom: `2px solid ${C.skyDeep}`, display: 'flex', alignItems: 'center', padding: '0 26px', gap: 14 }}>
            <div style={{ position: 'relative', width: 30, height: 30 }}>
              <div style={{ position: 'absolute', left: 0, top: 0, width: 16, height: 30, borderRadius: 5, background: C.tomato }} />
              <div style={{ position: 'absolute', left: 19, top: 0, width: 11, height: 13, borderRadius: 4, background: C.sun }} />
              <div style={{ position: 'absolute', left: 19, top: 17, width: 11, height: 13, borderRadius: 4, background: C.ink }} />
            </div>
            <div style={{ flex: 1 }} />
            <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 18, color: C.paper, background: C.tomato, borderRadius: 999, padding: '9px 18px' }}>Descargar</div>
          </div>

          {/* Lienzo */}
          <div style={{ position: 'absolute', left: 0, right: 0, top: TOPBAR, height: CANVAS_H, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'relative', background: C.paper, transform: `scale(${0.92 + 0.08 * layoutBounce})`, boxShadow: '0 20px 40px -22px rgba(22,33,62,0.5)' }}>
              {/* Fondo coral detrás de las celdas */}
              <div style={{ position: 'absolute', inset: 0, background: CORAL, opacity: coral }} />
              <Collage
                layout={layout}
                width={COLLAGE_SIZE}
                height={COLLAGE_SIZE}
                gap={gap}
                radius={radius}
                background="transparent"
                photos={layout === 'six-feature' ? PHOTOS : []}
                photoIn={photoIn}
              />
              <div style={{ position: 'absolute', inset: 0 }}>
                {typed && (
                  <div style={{ position: 'absolute', left: 0, right: 0, top: '72%', textAlign: 'center', fontFamily: display, fontWeight: 800, fontSize: 52, color: '#fff', textShadow: '0 3px 18px rgba(0,0,0,.6)', letterSpacing: '-0.02em' }}>
                    {typed}
                    {sunPop > 0 && <span style={{ display: 'inline-block', marginLeft: 8, transform: `scale(${sunPop})` }}>☀️</span>}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Panel */}
          <div style={{ position: 'absolute', left: 0, right: 0, top: PANEL_TOP, bottom: TABBAR, background: C.paper, borderTop: `2px solid ${C.skyDeep}`, padding: '22px 24px' }}>
            {step === 0 && (
              <>
                <PanelTitle>Elige una plantilla</PanelTitle>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 98px)', gap: 16 }}>
                  {TEMPLATE_GRID.map((l, i) => <Thumb key={l} layout={l} active={frame < TAP_TEMPLATE + 2 ? i === 0 : i === 5} />)}
                </div>
              </>
            )}
            {step === 1 && (
              <>
                <PanelTitle>Tus fotos</PanelTitle>
                <div style={{ height: 68, borderRadius: 999, background: C.tomato, color: '#fff', fontFamily: sans, fontWeight: 700, fontSize: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${1 - tap(frame, ADD_PHOTOS) * 0.05})` }}>
                  Añadir fotos
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10, marginTop: 20 }}>
                  {PHOTOS.map((p, i) => (
                    <div key={p} style={{ aspectRatio: '1', borderRadius: 12, overflow: 'hidden', background: C.sky, transform: `scale(${0.8 + 0.2 * Math.min(1, photoIn[i]!)})` }}>
                      {photoIn[i]! > 0 && <Photo name={p} />}
                    </div>
                  ))}
                </div>
              </>
            )}
            {step === 2 && (
              <>
                <PanelTitle>Estilo</PanelTitle>
                <Slider label="Espaciado" value={gap / 40} />
                <Slider label="Esquinas" value={radius / 40} />
                <div style={{ display: 'flex', gap: 14, marginTop: 6 }}>
                  {['#FFFFFF', '#16213E', '#FFC93C', '#CFE3F7', CORAL, 'linear-gradient(135deg,#A1C4FD,#C2E9FB)'].map((bg, i) => (
                    <div key={i} style={{ width: 48, height: 48, borderRadius: i >= 4 ? 14 : '50%', background: bg, boxShadow: (i === 4 && coral > 0.5) || (i === 0 && coral <= 0.5) ? `0 0 0 4px #fff, 0 0 0 7px ${C.ink}` : 'inset 0 0 0 2px rgba(0,0,0,.08)' }} />
                  ))}
                </div>
              </>
            )}
            {step === 3 && (
              <>
                <PanelTitle>Texto</PanelTitle>
                <div style={{ height: 76, borderRadius: 16, border: `3px solid ${C.ink}`, display: 'flex', alignItems: 'center', padding: '0 18px', fontFamily: sans, fontSize: 28, color: C.ink }}>
                  {typed}
                  <span style={{ width: 3, height: 34, background: C.ink, marginLeft: 2, opacity: Math.floor(frame / 8) % 2 ? 1 : 0 }} />
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
                  {['Bricolage', 'Pacifico', 'Caveat'].map((f, i) => (
                    <div key={f} style={{ padding: '10px 18px', borderRadius: 14, fontFamily: sans, fontWeight: 700, fontSize: 20, background: i === 0 ? C.ink : C.sky, color: i === 0 ? '#fff' : C.ink }}>{f}</div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Pestañas */}
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: TABBAR, background: C.paper, borderTop: `2px solid ${C.skyDeep}`, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', paddingBottom: 14 }}>
            {tabs.map((label, i) => {
              const active = STEPS[step]!.tab === i
              return (
                <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, color: active ? '#E23257' : C.inkSoft, fontFamily: sans, fontWeight: 700, fontSize: 15 }}>
                  <div style={{ width: 26, height: 26, borderRadius: 7, border: `3px solid currentColor`, background: active ? 'rgba(255,77,109,.15)' : 'transparent' }} />
                  {label}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <Finger {...finger} />
      </AbsoluteFill>
    </AbsoluteFill>
  )
}
