import { loadFont as loadDisplay } from '@remotion/google-fonts/BricolageGrotesque'
import { loadFont as loadSans } from '@remotion/google-fonts/InstrumentSans'
import { interpolate, spring } from 'remotion'

export const display = loadDisplay('normal', { weights: ['600', '800'], subsets: ['latin'] }).fontFamily
export const sans = loadSans('normal', { weights: ['400', '500', '600', '700'], subsets: ['latin'] }).fontFamily

export const C = {
  sky: '#EEF1F6',
  skyDeep: '#DDE3EE',
  paper: '#FFFFFF',
  ink: '#16213E',
  inkSoft: '#4A5675',
  tomato: '#FF4D6D',
  sun: '#FFC93C',
  placeholder: '#E4E9F2',
  thumb: '#C9D2E3',
}

export const CORAL = 'linear-gradient(135deg, #FF9A8B, #FF6A88)'

export const FPS = 30
/** Un compás de la música (120 BPM) = 60 frames; un tiempo = 15 frames. */
export const BEAT = 15

/** Resorte que arranca en `delay` frames. */
export function pop(frame: number, delay = 0, config: Partial<{ damping: number, mass: number, stiffness: number }> = {}) {
  return spring({ frame: frame - delay, fps: FPS, config: { damping: 14, mass: 0.7, ...config } })
}

export function clamp01(frame: number, from: number, to: number) {
  return interpolate(frame, [from, to], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
}

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t
