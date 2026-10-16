// Sintetiza la música del video (pop alegre, 120 BPM, libre de derechos).
// Uso: node scripts/make-music.mjs  ->  public/music.wav
import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const SR = 44100
const BPM = 120
const BEAT = 60 / BPM // 0.5 s = 15 frames a 30 fps
const BAR = BEAT * 4 // 2 s = 60 frames
const BARS = 13
const DURATION = BAR * BARS // 26 s, igual que el video
const N = Math.ceil(DURATION * SR)

const L = new Float32Array(N)
const R = new Float32Array(N)

let seed = 1
function noise() {
  seed = (seed * 16807) % 2147483647
  return (seed / 2147483647) * 2 - 1
}

const midi = n => 440 * 2 ** ((n - 69) / 12)

function add(start, len, fn, pan = 0, vol = 1) {
  const s0 = Math.floor(start * SR)
  const n = Math.floor(len * SR)
  const gl = Math.cos(((pan + 1) * Math.PI) / 4) * vol
  const gr = Math.sin(((pan + 1) * Math.PI) / 4) * vol
  for (let i = 0; i < n && s0 + i < N; i++) {
    const v = fn(i / SR, i)
    L[s0 + i] += v * gl
    R[s0 + i] += v * gr
  }
}

function lowpass(fc) {
  const a = 1 - Math.exp((-2 * Math.PI * fc) / SR)
  let y = 0
  return (x) => (y += a * (x - y))
}

const saw = (f, t) => 2 * ((f * t) % 1) - 1
const square = (f, t) => ((f * t) % 1 < 0.5 ? 1 : -1)
const tri = (f, t) => 1 - 4 * Math.abs(((f * t + 0.25) % 1) - 0.5)

// Acordes I–V–vi–IV en Do mayor
const CHORDS = [
  [60, 64, 67], // C
  [55, 59, 62], // G
  [57, 60, 64], // Am
  [53, 57, 60], // F
]
const chordAt = bar => (bar === BARS - 1 ? CHORDS[0] : CHORDS[bar % 4])

// Ducking tipo "sidechain": el pad y el bajo respiran con el bombo.
const kickTimes = []
for (let bar = 1; bar < BARS; bar++) {
  const beats = bar === BARS - 1 ? 1 : 4
  for (let b = 0; b < beats; b++) kickTimes.push(bar * BAR + b * BEAT)
}
function duck(time) {
  let g = 1
  for (const k of kickTimes) {
    const d = time - k
    if (d >= 0 && d < 0.3) g = Math.min(g, 1 - 0.55 * Math.exp(-d / 0.09))
  }
  return g
}

for (let bar = 0; bar < BARS; bar++) {
  const t0 = bar * BAR
  const chord = chordAt(bar)
  const last = bar === BARS - 1
  const len = last ? BAR : BAR + 0.05

  // Pad: dos sierras desafinadas por nota, filtradas
  for (const note of chord) {
    for (const det of [-0.12, 0.12]) {
      const f = midi(note) * 2 ** (det / 12)
      const lp = lowpass(last ? 1400 : 1100)
      add(t0, len, (t) => {
        const env = Math.min(1, t / 0.25) * (last ? Math.exp(-t * 0.9) : Math.min(1, (len - t) / 0.15))
        return lp(saw(f, t)) * env * duck(t0 + t)
      }, det < 0 ? -0.4 : 0.4, 0.05)
    }
  }

  // Arpegio en corcheas (desde el compás 0, más suave en la intro)
  if (!last) {
    const notes = [chord[0], chord[1], chord[2], chord[0] + 12, chord[2], chord[1], chord[0] + 12, chord[2] + 12]
    notes.forEach((n, i) => {
      const f = midi(n + 12)
      const lp = lowpass(3200)
      add(t0 + i * (BEAT / 2), 0.32, (t) => lp(square(f, t) * 0.6 + tri(f, t) * 0.4) * Math.exp(-t * 9), i % 2 ? 0.35 : -0.35, bar === 0 ? 0.045 : 0.07)
    })
  }

  if (bar === 0) {
    // Subida de ruido hacia el "drop": filtro que se abre y volumen que crece
    let y = 0
    add(t0 + BEAT * 2, BEAT * 2, (t) => {
      const p = t / (BEAT * 2)
      const a = 1 - Math.exp((-2 * Math.PI * (300 + p * p * 8000)) / SR)
      y += a * (noise() - y)
      return y * p * p
    }, 0, 0.5)
    continue
  }

  // Platillo al entrar el ritmo y en el final
  if (bar === 1 || last || bar === 7) {
    let prev = 0
    add(t0, 2.5, (t) => {
      const x = noise()
      const hp = x - prev
      prev = x
      return hp * Math.exp(-t * 2.2)
    }, 0, 0.16)
  }

  const beats = last ? 1 : 4
  for (let b = 0; b < beats; b++) {
    const tb = t0 + b * BEAT
    // Bombo
    let phase = 0
    add(tb, 0.45, (t) => {
      const f = 48 + 110 * Math.exp(-t * 32)
      phase += (2 * Math.PI * f) / SR
      return Math.sin(phase) * Math.exp(-t * 7)
    }, 0, 0.9)
    // Palmas en 2 y 4
    if (b % 2 === 1) {
      for (const off of [0, 0.012, 0.024]) {
        let prev = 0
        add(tb + off, 0.2, (t) => {
          const x = noise()
          const hp = x - prev * 0.7
          prev = x
          return hp * Math.exp(-t * 28)
        }, 0, 0.16)
      }
    }
    // Hi-hat en contratiempo
    if (!last) {
      let prev = 0
      add(tb + BEAT / 2, 0.06, (t) => {
        const x = noise()
        const hp = x - prev
        prev = x
        return hp * Math.exp(-t * 70)
      }, 0.25, 0.1)
    }
  }

  // Bajo en corcheas sobre la tónica
  const root = midi(chord[0] - 24)
  const steps = last ? 1 : 8
  for (let i = 0; i < steps; i++) {
    const lp = lowpass(520)
    const start = t0 + i * (BEAT / 2)
    add(start, last ? 1.6 : 0.24, (t) => lp(saw(root, t) * 0.7 + Math.sin(2 * Math.PI * root * t) * 0.6) * Math.exp(-t * (last ? 2 : 5)) * duck(start + t), 0, 0.32)
  }

  // Campanita en el primer tiempo de cada compás a partir del 5
  if (bar >= 5 && !last) {
    const f = midi(chord[2] + 24)
    add(t0, 1.2, (t) => (Math.sin(2 * Math.PI * f * t) + 0.3 * Math.sin(2 * Math.PI * f * 2 * t)) * Math.exp(-t * 3.5), 0.1, 0.06)
  }
}

// Normalizar y suavizar inicio y final
let peak = 0
for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]))
const gain = 0.89 / peak
const fadeIn = 0.05 * SR
const fadeOut = 1.2 * SR
for (let i = 0; i < N; i++) {
  let g = gain
  if (i < fadeIn) g *= i / fadeIn
  if (i > N - fadeOut) g *= (N - i) / fadeOut
  L[i] = Math.tanh(L[i] * g * 1.1) / Math.tanh(1.1)
  R[i] = Math.tanh(R[i] * g * 1.1) / Math.tanh(1.1)
}

// WAV PCM 16 bits estéreo
const data = Buffer.alloc(N * 4)
for (let i = 0; i < N; i++) {
  data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i])) * 32767), i * 4)
  data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i])) * 32767), i * 4 + 2)
}
const header = Buffer.alloc(44)
header.write('RIFF', 0)
header.writeUInt32LE(36 + data.length, 4)
header.write('WAVE', 8)
header.write('fmt ', 12)
header.writeUInt32LE(16, 16)
header.writeUInt16LE(1, 20)
header.writeUInt16LE(2, 22)
header.writeUInt32LE(SR, 24)
header.writeUInt32LE(SR * 4, 28)
header.writeUInt16LE(4, 32)
header.writeUInt16LE(16, 34)
header.write('data', 36)
header.writeUInt32LE(data.length, 40)

await writeFile(fileURLToPath(new URL('../public/music.wav', import.meta.url)), Buffer.concat([header, data]))
console.log(`ok ${DURATION}s`)
