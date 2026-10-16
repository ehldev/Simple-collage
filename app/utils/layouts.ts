/** Celda en coordenadas normalizadas (0..1) dentro del área del collage. */
export type Cell = [x: number, y: number, w: number, h: number]

export interface CollageLayout {
  id: string
  cells: Cell[]
  /** Formato sugerido al elegir la plantilla desde una landing. */
  ratio?: RatioId
}

export type RatioId = '1:1' | '4:5' | '3:4' | '2:3' | '9:16' | '16:9' | '4:3' | 'a4'

export interface Ratio {
  id: RatioId
  w: number
  h: number
}

export const RATIOS: Ratio[] = [
  { id: '1:1', w: 1, h: 1 },
  { id: '4:5', w: 4, h: 5 },
  { id: '9:16', w: 9, h: 16 },
  { id: '3:4', w: 3, h: 4 },
  { id: '2:3', w: 2, h: 3 },
  { id: 'a4', w: 210, h: 297 },
  { id: '16:9', w: 16, h: 9 },
  { id: '4:3', w: 4, h: 3 },
]

export function getRatio(id: string | undefined): Ratio {
  return RATIOS.find(r => r.id === id) ?? RATIOS[0]!
}

/** Cuadrícula uniforme de `cols` x `rows`. */
function grid(cols: number, rows: number): Cell[] {
  const cells: Cell[] = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) cells.push([c / cols, r / rows, 1 / cols, 1 / rows])
  }
  return cells
}

/** Celdas definidas en unidades enteras de una retícula `cols` x `rows`. */
function units(cols: number, rows: number, list: [number, number, number, number][]): Cell[] {
  return list.map(([x, y, w, h]) => [x / cols, y / rows, w / cols, h / rows])
}

export const LAYOUTS: CollageLayout[] = [
  // 2 fotos
  { id: 'duo-cols', cells: grid(2, 1) },
  { id: 'duo-rows', cells: grid(1, 2), ratio: '4:5' },
  { id: 'duo-wide-left', cells: [[0, 0, 0.64, 1], [0.64, 0, 0.36, 1]], ratio: '16:9' },

  // 3 fotos
  { id: 'trio-cols', cells: grid(3, 1), ratio: '16:9' },
  { id: 'trio-rows', cells: grid(1, 3), ratio: '9:16' },
  { id: 'trio-left-big', cells: units(2, 2, [[0, 0, 1, 2], [1, 0, 1, 1], [1, 1, 1, 1]]) },
  { id: 'trio-top-big', cells: [[0, 0, 1, 0.6], [0, 0.6, 0.5, 0.4], [0.5, 0.6, 0.5, 0.4]], ratio: '4:5' },
  { id: 'trio-bottom-big', cells: units(2, 2, [[0, 0, 1, 1], [1, 0, 1, 1], [0, 1, 2, 1]]) },

  // 4 fotos
  { id: 'grid-4', cells: grid(2, 2) },
  { id: 'four-left-big', cells: [[0, 0, 0.62, 1], [0.62, 0, 0.38, 1 / 3], [0.62, 1 / 3, 0.38, 1 / 3], [0.62, 2 / 3, 0.38, 1 / 3]] },
  { id: 'four-top-big', cells: [[0, 0, 1, 0.62], [0, 0.62, 1 / 3, 0.38], [1 / 3, 0.62, 1 / 3, 0.38], [2 / 3, 0.62, 1 / 3, 0.38]], ratio: '4:5' },
  { id: 'four-mosaic', cells: [[0, 0, 0.6, 0.5], [0.6, 0, 0.4, 0.5], [0, 0.5, 0.4, 0.5], [0.4, 0.5, 0.6, 0.5]] },
  { id: 'four-strip', cells: grid(1, 4), ratio: '9:16' },
  { id: 'four-cols', cells: grid(4, 1), ratio: '16:9' },

  // 5 fotos
  { id: 'five-two-three', cells: [[0, 0, 0.5, 0.5], [0.5, 0, 0.5, 0.5], [0, 0.5, 1 / 3, 0.5], [1 / 3, 0.5, 1 / 3, 0.5], [2 / 3, 0.5, 1 / 3, 0.5]] },
  { id: 'five-left-big', cells: units(4, 2, [[0, 0, 2, 2], [2, 0, 1, 1], [3, 0, 1, 1], [2, 1, 1, 1], [3, 1, 1, 1]]), ratio: '16:9' },
  { id: 'five-top-big', cells: [[0, 0, 1, 0.58], [0, 0.58, 0.25, 0.42], [0.25, 0.58, 0.25, 0.42], [0.5, 0.58, 0.25, 0.42], [0.75, 0.58, 0.25, 0.42]], ratio: '4:5' },

  // 6 fotos
  { id: 'grid-6', cells: grid(3, 2), ratio: '4:3' },
  { id: 'grid-6-tall', cells: grid(2, 3), ratio: '4:5' },
  { id: 'six-feature', cells: units(3, 3, [[0, 0, 2, 2], [2, 0, 1, 1], [2, 1, 1, 1], [0, 2, 1, 1], [1, 2, 1, 1], [2, 2, 1, 1]]) },

  // 7 y 8 fotos
  { id: 'seven-bands', cells: [[0, 0, 1 / 3, 0.33], [1 / 3, 0, 1 / 3, 0.33], [2 / 3, 0, 1 / 3, 0.33], [0, 0.33, 1, 0.34], [0, 0.67, 1 / 3, 0.33], [1 / 3, 0.67, 1 / 3, 0.33], [2 / 3, 0.67, 1 / 3, 0.33]], ratio: '4:5' },
  { id: 'grid-8', cells: grid(4, 2), ratio: '16:9' },
  { id: 'grid-8-tall', cells: grid(2, 4), ratio: '9:16' },

  // 9 o más
  { id: 'grid-9', cells: grid(3, 3) },
  { id: 'nine-feature', cells: units(4, 3, [[0, 0, 2, 2], [2, 0, 1, 1], [3, 0, 1, 1], [2, 1, 1, 1], [3, 1, 1, 1], [0, 2, 1, 1], [1, 2, 1, 1], [2, 2, 1, 1], [3, 2, 1, 1]]), ratio: '4:3' },
  { id: 'grid-12', cells: grid(4, 3), ratio: '4:3' },
  { id: 'grid-16', cells: grid(4, 4) },

  // 1 foto (marco con texto)
  { id: 'single', cells: [[0, 0, 1, 1]] },
]

export function getLayout(id: string | undefined): CollageLayout {
  return LAYOUTS.find(l => l.id === id) ?? LAYOUTS.find(l => l.id === 'grid-4')!
}

/** Plantillas agrupadas por número de fotos, en orden ascendente. */
export function layoutsByCount(): { count: number, layouts: CollageLayout[] }[] {
  const groups = new Map<number, CollageLayout[]>()
  for (const layout of LAYOUTS) {
    const n = layout.cells.length
    if (!groups.has(n)) groups.set(n, [])
    groups.get(n)!.push(layout)
  }
  return [...groups.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([count, layouts]) => ({ count, layouts }))
}
