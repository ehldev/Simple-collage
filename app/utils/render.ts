import { getLayout, getRatio, type Ratio } from './layouts'
import { REFERENCE_SIZE, type CellState, type CollageState, type PhotoFilters, type TextLayer } from './collage'

export interface Rect {
  x: number
  y: number
  w: number
  h: number
}

export interface EditorOverlay {
  /** Píxeles de canvas por píxel CSS, para que los trazos de la interfaz se vean igual a cualquier zoom. */
  px: number
  selectedCell: number | null
  selectedText: string | null
  dropCell: number | null
  swapFrom: number | null
  placeholderLabel: string
}

export interface RenderOptions {
  width: number
  height: number
  getImage: (id: string) => CanvasImageSource & { width: number, height: number } | undefined
  editor?: EditorOverlay
}

const EPS = 0.0001
const TOMATO = '#FF4D6D'

export function canvasSize(ratio: Ratio, longSide: number) {
  if (ratio.w >= ratio.h) {
    return { width: longSide, height: Math.round(longSide * ratio.h / ratio.w) }
  }
  return { width: Math.round(longSide * ratio.w / ratio.h), height: longSide }
}

/** Factor para convertir medidas de referencia al tamaño real. */
export function scaleFactor(width: number, height: number) {
  return Math.min(width, height) / REFERENCE_SIZE
}

export function cellRects(state: CollageState, width: number, height: number): Rect[] {
  const k = scaleFactor(width, height)
  const pad = (state.linkPadding ? state.gap : state.padding) * k
  const half = (state.gap * k) / 2
  const innerW = width - pad * 2
  const innerH = height - pad * 2

  return getLayout(state.layoutId).cells.map(([cx, cy, cw, ch]) => {
    const left = cx > EPS ? half : 0
    const top = cy > EPS ? half : 0
    const right = cx + cw < 1 - EPS ? half : 0
    const bottom = cy + ch < 1 - EPS ? half : 0
    return {
      x: pad + cx * innerW + left,
      y: pad + cy * innerH + top,
      w: Math.max(1, cw * innerW - left - right),
      h: Math.max(1, ch * innerH - top - bottom),
    }
  })
}

export function filterString(f: PhotoFilters): string {
  const parts: string[] = []
  if (f.brightness !== 100) parts.push(`brightness(${f.brightness}%)`)
  if (f.contrast !== 100) parts.push(`contrast(${f.contrast}%)`)
  if (f.saturate !== 100) parts.push(`saturate(${f.saturate}%)`)
  if (f.grayscale) parts.push(`grayscale(${f.grayscale}%)`)
  if (f.sepia) parts.push(`sepia(${f.sepia}%)`)
  if (f.hue) parts.push(`hue-rotate(${f.hue}deg)`)
  return parts.length ? parts.join(' ') : 'none'
}

/**
 * Geometría de la foto dentro de su celda: escala tipo "cover" multiplicada
 * por el zoom, y desplazamiento limitado al sobrante para no dejar huecos.
 */
export function photoGeometry(cell: CellState, rect: Rect, imgW: number, imgH: number) {
  const turned = cell.rotation % 180 !== 0
  const iw = turned ? imgH : imgW
  const ih = turned ? imgW : imgH
  const scale = Math.max(rect.w / iw, rect.h / ih) * cell.zoom
  const drawnW = iw * scale
  const drawnH = ih * scale
  const overflowX = (drawnW - rect.w) / 2
  const overflowY = (drawnH - rect.h) / 2
  return {
    scale,
    overflowX,
    overflowY,
    cx: rect.x + rect.w / 2 + cell.panX * overflowX,
    cy: rect.y + rect.h / 2 + cell.panY * overflowY,
  }
}

function roundedPath(ctx: CanvasRenderingContext2D, r: Rect, radius: number) {
  ctx.beginPath()
  const rad = Math.min(radius, r.w / 2, r.h / 2)
  if (rad > 0) ctx.roundRect(r.x, r.y, r.w, r.h, rad)
  else ctx.rect(r.x, r.y, r.w, r.h)
}

function paintBackground(ctx: CanvasRenderingContext2D, state: CollageState, width: number, height: number) {
  const bg = state.background
  if (bg.type === 'gradient') {
    const a = (bg.angle * Math.PI) / 180
    const len = Math.abs(width * Math.sin(a)) + Math.abs(height * Math.cos(a))
    const dx = (Math.sin(a) * len) / 2
    const dy = (-Math.cos(a) * len) / 2
    const g = ctx.createLinearGradient(width / 2 - dx, height / 2 - dy, width / 2 + dx, height / 2 + dy)
    g.addColorStop(0, bg.color)
    g.addColorStop(1, bg.color2)
    ctx.fillStyle = g
  }
  else {
    ctx.fillStyle = bg.color
  }
  ctx.fillRect(0, 0, width, height)
}

function paintPlaceholder(ctx: CanvasRenderingContext2D, rect: Rect, radius: number, ui: EditorOverlay) {
  roundedPath(ctx, rect, radius)
  ctx.fillStyle = '#E4E9F2'
  ctx.fill()

  const cx = rect.x + rect.w / 2
  const cy = rect.y + rect.h / 2
  const r = Math.min(22 * ui.px, Math.min(rect.w, rect.h) * 0.22)
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.fillStyle = '#FFFFFF'
  ctx.fill()
  ctx.strokeStyle = '#16213E'
  ctx.lineWidth = Math.max(1.5, r * 0.12)
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(cx - r * 0.42, cy)
  ctx.lineTo(cx + r * 0.42, cy)
  ctx.moveTo(cx, cy - r * 0.42)
  ctx.lineTo(cx, cy + r * 0.42)
  ctx.stroke()

  const fontSize = 13 * ui.px
  if (rect.w > fontSize * 9 && rect.h > r * 2 + fontSize * 3) {
    ctx.font = `600 ${fontSize}px "Instrument Sans", sans-serif`
    ctx.fillStyle = '#4A5675'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    ctx.fillText(ui.placeholderLabel, cx, cy + r + fontSize * 0.7)
  }
}

function paintPhoto(ctx: CanvasRenderingContext2D, cell: CellState, rect: Rect, radius: number, img: CanvasImageSource & { width: number, height: number }) {
  const g = photoGeometry(cell, rect, img.width, img.height)
  ctx.save()
  roundedPath(ctx, rect, radius)
  ctx.clip()
  ctx.translate(g.cx, g.cy)
  ctx.rotate((cell.rotation * Math.PI) / 180)
  if (cell.flipX) ctx.scale(-1, 1)
  ctx.filter = filterString(cell.filters)
  const w = img.width * g.scale
  const h = img.height * g.scale
  ctx.drawImage(img, -w / 2, -h / 2, w, h)
  ctx.restore()
}

const LINE_HEIGHT = 1.15

function textFont(layer: TextLayer, k: number) {
  return `${layer.weight} ${layer.size * k}px "${layer.font}", sans-serif`
}

/** Caja de un texto en píxeles de canvas (para dibujarlo y para seleccionarlo). */
export function textBox(ctx: CanvasRenderingContext2D, layer: TextLayer, width: number, height: number): Rect & { lines: string[], lineH: number, padX: number, padY: number } {
  const k = scaleFactor(width, height)
  ctx.font = textFont(layer, k)
  const lines = (layer.content || ' ').split('\n')
  const fontPx = layer.size * k
  const lineH = fontPx * LINE_HEIGHT
  const textW = Math.max(...lines.map(l => ctx.measureText(l).width), fontPx * 0.5)
  const textH = lineH * lines.length
  const padX = layer.background ? fontPx * 0.45 : fontPx * 0.1
  const padY = layer.background ? fontPx * 0.25 : fontPx * 0.05
  const w = textW + padX * 2
  const h = textH + padY * 2
  return { x: layer.x * width - w / 2, y: layer.y * height - h / 2, w, h, lines, lineH, padX, padY }
}

function paintText(ctx: CanvasRenderingContext2D, layer: TextLayer, width: number, height: number) {
  const k = scaleFactor(width, height)
  const box = textBox(ctx, layer, width, height)
  const fontPx = layer.size * k

  ctx.save()
  if (layer.background) {
    ctx.fillStyle = layer.background
    ctx.beginPath()
    ctx.roundRect(box.x, box.y, box.w, box.h, fontPx * 0.22)
    ctx.fill()
  }

  ctx.font = textFont(layer, k)
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.lineJoin = 'round'
  const cx = layer.x * width
  const startY = box.y + box.padY + box.lineH / 2

  box.lines.forEach((line, i) => {
    const y = startY + i * box.lineH
    if (layer.shadow) {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.6)'
      ctx.shadowBlur = fontPx * 0.35
      ctx.shadowOffsetY = fontPx * 0.03
    }
    if (layer.outline) {
      ctx.lineWidth = fontPx * 0.16
      ctx.strokeStyle = isLight(layer.color) ? '#16213E' : '#FFFFFF'
      ctx.strokeText(line, cx, y)
      ctx.shadowColor = 'transparent'
    }
    ctx.fillStyle = layer.color
    ctx.fillText(line, cx, y)
    ctx.shadowColor = 'transparent'
  })
  ctx.restore()
}

export function isLight(hex: string): boolean {
  const m = hex.replace('#', '')
  if (m.length < 6) return true
  const r = parseInt(m.slice(0, 2), 16)
  const g = parseInt(m.slice(2, 4), 16)
  const b = parseInt(m.slice(4, 6), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 > 150
}

export function renderCollage(ctx: CanvasRenderingContext2D, state: CollageState, opts: RenderOptions) {
  const { width, height, editor } = opts
  const k = scaleFactor(width, height)
  const radius = state.radius * k

  ctx.save()
  ctx.clearRect(0, 0, width, height)
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  paintBackground(ctx, state, width, height)

  const rects = cellRects(state, width, height)
  rects.forEach((rect, i) => {
    const cell = state.cells[i]
    const img = cell?.imageId ? opts.getImage(cell.imageId) : undefined
    if (cell && img) paintPhoto(ctx, cell, rect, radius, img)
    else if (editor) paintPlaceholder(ctx, rect, radius, editor)
  })

  for (const layer of state.texts) paintText(ctx, layer, width, height)

  if (editor) {
    ctx.lineWidth = 3 * editor.px
    rects.forEach((rect, i) => {
      if (i === editor.dropCell) {
        roundedPath(ctx, rect, radius)
        ctx.fillStyle = 'rgba(255, 77, 109, 0.22)'
        ctx.fill()
      }
      if (i === editor.swapFrom) {
        ctx.setLineDash([8 * editor.px, 6 * editor.px])
        ctx.strokeStyle = TOMATO
        roundedPath(ctx, inset(rect, 1.5 * editor.px), radius)
        ctx.stroke()
        ctx.setLineDash([])
      }
      else if (i === editor.selectedCell) {
        ctx.strokeStyle = TOMATO
        roundedPath(ctx, inset(rect, 1.5 * editor.px), radius)
        ctx.stroke()
      }
    })

    const selected = state.texts.find(t => t.id === editor.selectedText)
    if (selected) {
      const box = textBox(ctx, selected, width, height)
      ctx.setLineDash([6 * editor.px, 4 * editor.px])
      ctx.strokeStyle = TOMATO
      ctx.lineWidth = 2 * editor.px
      ctx.strokeRect(box.x - 4 * editor.px, box.y - 4 * editor.px, box.w + 8 * editor.px, box.h + 8 * editor.px)
      ctx.setLineDash([])
    }
  }
  ctx.restore()
}

function inset(r: Rect, d: number): Rect {
  return { x: r.x + d, y: r.y + d, w: r.w - d * 2, h: r.h - d * 2 }
}

export function hitRect(rects: Rect[], x: number, y: number): number {
  return rects.findIndex(r => x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h)
}

export function exportSize(ratioId: string, longSide: number) {
  return canvasSize(getRatio(ratioId), longSide)
}
