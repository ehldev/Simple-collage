import type { RatioId } from './layouts'

/**
 * Todas las medidas en píxeles (espaciado, radio, tamaño de texto…) se
 * expresan respecto a un lienzo cuyo lado menor mide REFERENCE_SIZE, y se
 * escalan al tamaño real al dibujar. Así la vista previa y la exportación
 * en cualquier resolución se ven idénticas.
 */
export const REFERENCE_SIZE = 1080

export interface PhotoFilters {
  brightness: number // %
  contrast: number // %
  saturate: number // %
  grayscale: number // %
  sepia: number // %
  hue: number // grados
}

export const DEFAULT_FILTERS: PhotoFilters = {
  brightness: 100,
  contrast: 100,
  saturate: 100,
  grayscale: 0,
  sepia: 0,
  hue: 0,
}

export const FILTER_PRESETS: Record<string, PhotoFilters> = {
  original: { ...DEFAULT_FILTERS },
  vivid: { ...DEFAULT_FILTERS, contrast: 112, saturate: 135 },
  warm: { ...DEFAULT_FILTERS, sepia: 22, saturate: 118, brightness: 104 },
  cool: { ...DEFAULT_FILTERS, hue: -12, saturate: 90, brightness: 104 },
  bw: { ...DEFAULT_FILTERS, grayscale: 100, contrast: 112 },
  sepia: { ...DEFAULT_FILTERS, sepia: 80, contrast: 95 },
  fade: { ...DEFAULT_FILTERS, contrast: 82, saturate: 80, brightness: 110 },
  drama: { ...DEFAULT_FILTERS, contrast: 140, saturate: 85, brightness: 95 },
}

export interface CellState {
  imageId: string | null
  zoom: number // 1..4
  panX: number // -1..1 (desplazamiento dentro del sobrante)
  panY: number
  rotation: 0 | 90 | 180 | 270
  flipX: boolean
  filters: PhotoFilters
}

export interface TextLayer {
  id: string
  content: string
  font: string
  size: number // px de referencia
  weight: number
  color: string
  /** Color de fondo tipo "etiqueta"; vacío = sin fondo. */
  background: string
  outline: boolean
  shadow: boolean
  x: number // 0..1 centro
  y: number // 0..1 centro
}

export interface Background {
  type: 'solid' | 'gradient'
  color: string
  color2: string
  angle: number
}

export interface CollageState {
  layoutId: string
  ratioId: RatioId
  gap: number
  padding: number
  radius: number
  background: Background
  cells: CellState[]
  texts: TextLayer[]
}

export interface StoredImage {
  id: string
  name: string
  width: number
  height: number
}

export function emptyCell(): CellState {
  return { imageId: null, zoom: 1, panX: 0, panY: 0, rotation: 0, flipX: false, filters: { ...DEFAULT_FILTERS } }
}

export function defaultState(): CollageState {
  return {
    layoutId: 'grid-4',
    ratioId: '1:1',
    gap: 16,
    padding: 16,
    radius: 0,
    background: { type: 'solid', color: '#FFFFFF', color2: '#FFC93C', angle: 135 },
    cells: [emptyCell(), emptyCell(), emptyCell(), emptyCell()],
    texts: [],
  }
}

export const TEXT_FONTS = [
  { family: 'Bricolage Grotesque', label: 'Bricolage', weights: [400, 800] },
  { family: 'Instrument Sans', label: 'Instrument', weights: [400, 700] },
  { family: 'Playfair Display', label: 'Playfair', weights: [400, 700] },
  { family: 'DM Serif Display', label: 'DM Serif', weights: [400] },
  { family: 'Bebas Neue', label: 'Bebas', weights: [400] },
  { family: 'Pacifico', label: 'Pacifico', weights: [400] },
  { family: 'Caveat', label: 'Caveat', weights: [400, 700] },
  { family: 'Permanent Marker', label: 'Marker', weights: [400] },
] as const

export function createId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4)
}
