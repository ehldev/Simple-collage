import { computed, reactive, ref, shallowRef, watch } from 'vue'
import { getLayout, getRatio, type RatioId } from '~/utils/layouts'
import {
  createId, defaultState, emptyCell, DEFAULT_FILTERS,
  type CellState, type CollageState, type StoredImage, type TextLayer,
} from '~/utils/collage'
import { loadImageFile, makeThumb, UnsupportedImageError } from '~/utils/images'
import { clearProject, deleteImageBlob, loadImageBlob, loadProject, saveImageBlob, saveProject } from '~/utils/persist'

/**
 * Estado del editor. Es un singleton de módulo: solo se usa en el cliente
 * (el editor se renderiza dentro de <ClientOnly>).
 */
const HISTORY_LIMIT = 80

const state = reactive<CollageState>(defaultState())
const images = ref<StoredImage[]>([])
const bitmaps = new Map<string, ImageBitmap>()
/** URLs de miniaturas por id de foto. */
const thumbs = reactive<Record<string, string>>({})
/** Se incrementa cuando cambian los bitmaps para forzar un redibujado. */
const imagesVersion = ref(0)

const selectedCell = ref<number | null>(null)
const selectedText = ref<string | null>(null)
const swapFrom = ref<number | null>(null)
const loading = ref(0)
const ready = ref(false)

export interface ImageError { name: string, reason: UnsupportedImageError['reason'] }
const errors = shallowRef<ImageError[]>([])

const history: string[] = []
const historyIndex = ref(-1)

function snapshot() {
  return JSON.stringify(state)
}

function restore(json: string) {
  const parsed = JSON.parse(json) as CollageState
  Object.assign(state, parsed)
  if (selectedCell.value !== null && selectedCell.value >= state.cells.length) selectedCell.value = null
  if (selectedText.value && !state.texts.some(t => t.id === selectedText.value)) selectedText.value = null
}

/** Guarda un punto de deshacer. Llamar después de cada cambio "terminado". */
function commit() {
  const snap = snapshot()
  if (history[historyIndex.value] === snap) return
  history.splice(historyIndex.value + 1)
  history.push(snap)
  if (history.length > HISTORY_LIMIT) history.shift()
  historyIndex.value = history.length - 1
}

function resetHistory() {
  history.length = 0
  historyIndex.value = -1
  commit()
}

function undo() {
  if (historyIndex.value <= 0) return
  historyIndex.value--
  restore(history[historyIndex.value]!)
}

function redo() {
  if (historyIndex.value >= history.length - 1) return
  historyIndex.value++
  restore(history[historyIndex.value]!)
}

const canUndo = computed(() => historyIndex.value > 0)
const canRedo = computed(() => historyIndex.value < history.length - 1 && historyIndex.value >= 0)

// --- Plantilla y formato ---

function setLayout(id: string, opts: { commit?: boolean } = {}) {
  const layout = getLayout(id)
  const filled = state.cells.filter(c => c.imageId)
  const cells: CellState[] = layout.cells.map((_, i) => filled[i] ?? emptyCell())
  state.layoutId = layout.id
  state.cells = cells
  fillEmptyCellsFromTray()
  if (selectedCell.value !== null && selectedCell.value >= cells.length) selectedCell.value = null
  swapFrom.value = null
  if (opts.commit !== false) commit()
}

function setRatio(id: RatioId) {
  state.ratioId = getRatio(id).id
  commit()
}

// --- Fotos ---

function placedIds() {
  return new Set(state.cells.map(c => c.imageId).filter(Boolean) as string[])
}

const unplacedImages = computed(() => {
  const used = placedIds()
  return images.value.filter(img => !used.has(img.id))
})

function fillEmptyCellsFromTray() {
  const pending = [...unplacedImages.value]
  for (const cell of state.cells) {
    if (!pending.length) break
    if (!cell.imageId) Object.assign(cell, emptyCell(), { imageId: pending.shift()!.id })
  }
}

async function addFiles(files: Iterable<File>, targetCell: number | null = null) {
  const list = [...files]
  if (!list.length) return
  const newErrors: ImageError[] = []
  let target = targetCell
  loading.value += list.length

  for (const file of list) {
    try {
      const loaded = await loadImageFile(file)
      const id = createId()
      bitmaps.set(id, loaded.bitmap)
      thumbs[id] = await makeThumb(loaded.bitmap)
      images.value.push({ id, name: file.name, width: loaded.width, height: loaded.height })
      saveImageBlob(id, loaded.blob)

      const index = target !== null && target < state.cells.length
        ? target
        : state.cells.findIndex(c => !c.imageId)
      if (index >= 0) Object.assign(state.cells[index]!, emptyCell(), { imageId: id })
      target = null
      imagesVersion.value++
    }
    catch (e) {
      newErrors.push({ name: file.name, reason: e instanceof UnsupportedImageError ? e.reason : 'decode' })
    }
    finally {
      loading.value--
    }
  }

  errors.value = newErrors
  commit()
}

function placeImage(imageId: string, cellIndex: number) {
  const cell = state.cells[cellIndex]
  if (!cell) return
  // Si la foto ya estaba en otra celda, intercambiamos para no duplicarla.
  const from = state.cells.findIndex(c => c.imageId === imageId)
  if (from === cellIndex) return
  if (from >= 0) {
    swapCells(from, cellIndex)
    return
  }
  Object.assign(cell, emptyCell(), { imageId })
  selectedCell.value = cellIndex
  commit()
}

function swapCells(a: number, b: number) {
  const ca = state.cells[a]
  const cb = state.cells[b]
  if (!ca || !cb || a === b) return
  state.cells[a] = cb
  state.cells[b] = ca
  swapFrom.value = null
  selectedCell.value = b
  commit()
}

function clearCell(index: number) {
  const cell = state.cells[index]
  if (!cell) return
  Object.assign(cell, emptyCell())
  commit()
}

function removeImage(id: string) {
  state.cells.forEach((c) => {
    if (c.imageId === id) Object.assign(c, emptyCell())
  })
  images.value = images.value.filter(img => img.id !== id)
  if (thumbs[id]) URL.revokeObjectURL(thumbs[id])
  delete thumbs[id]
  deleteImageBlob(id)
  commit()
}

function updateCell(index: number, patch: Partial<CellState>, save = false) {
  const cell = state.cells[index]
  if (!cell) return
  Object.assign(cell, patch)
  if (save) commit()
}

function rotateCell(index: number) {
  const cell = state.cells[index]
  if (!cell) return
  cell.rotation = ((cell.rotation + 90) % 360) as CellState['rotation']
  commit()
}

function resetCellFrame(index: number) {
  updateCell(index, { zoom: 1, panX: 0, panY: 0, rotation: 0, flipX: false }, true)
}

function resetCellFilters(index: number) {
  updateCell(index, { filters: { ...DEFAULT_FILTERS } }, true)
}

/**
 * Devuelve el diseño a sus valores iniciales: espaciado, margen, esquinas,
 * fondo y el encuadre/filtros de cada foto. Conserva fotos, plantilla,
 * formato y textos. Se puede deshacer.
 */
function resetDesign() {
  const d = defaultState()
  state.gap = d.gap
  state.padding = d.padding
  state.linkPadding = d.linkPadding
  state.radius = d.radius
  state.background = d.background
  state.cells.forEach((cell) => {
    Object.assign(cell, emptyCell(), { imageId: cell.imageId })
  })
  swapFrom.value = null
  commit()
}

function getImage(id: string) {
  return bitmaps.get(id)
}

// --- Texto ---

/** Alturas donde colocar textos nuevos, en orden de preferencia. */
const TEXT_SLOTS = [0.5, 0.82, 0.18, 0.66, 0.34]

/** Primera altura que no está ocupada por otro texto, para que no se encimen. */
function freeTextY() {
  const used = state.texts.map(t => t.y)
  return TEXT_SLOTS.find(y => used.every(u => Math.abs(u - y) > 0.1))
    ?? TEXT_SLOTS[state.texts.length % TEXT_SLOTS.length]!
}

function addText(partial: Partial<TextLayer>) {
  const layer: TextLayer = {
    id: createId(),
    content: 'Texto',
    font: 'Bricolage Grotesque',
    size: 72,
    weight: 800,
    color: '#FFFFFF',
    background: '',
    outline: false,
    shadow: true,
    x: 0.5,
    y: freeTextY(),
    ...partial,
  }
  state.texts.push(layer)
  selectedText.value = layer.id
  selectedCell.value = null
  commit()
  return layer
}

function updateText(id: string, patch: Partial<TextLayer>, save = false) {
  const layer = state.texts.find(t => t.id === id)
  if (!layer) return
  Object.assign(layer, patch)
  if (save) commit()
}

function removeText(id: string) {
  state.texts = state.texts.filter(t => t.id !== id)
  if (selectedText.value === id) selectedText.value = null
  commit()
}

function duplicateText(id: string) {
  const layer = state.texts.find(t => t.id === id)
  if (!layer) return
  const { id: _id, ...copy } = layer
  addText({ ...copy, x: Math.min(0.95, layer.x + 0.04), y: Math.min(0.95, layer.y + 0.04) })
}

// --- Proyecto ---

let saveTimer: ReturnType<typeof setTimeout> | undefined
let autosaveStarted = false

function startAutosave() {
  if (autosaveStarted) return
  autosaveStarted = true
  watch([() => snapshot(), images], () => {
    clearTimeout(saveTimer)
    saveTimer = setTimeout(() => {
      saveProject({ state: JSON.parse(snapshot()), images: images.value })
    }, 600)
  })
}

async function init(query: { layout?: string, ratio?: string }) {
  if (!ready.value) {
    const saved = await loadProject()
    if (saved?.state?.cells) {
      const restored: StoredImage[] = []
      for (const img of saved.images ?? []) {
        const blob = await loadImageBlob(img.id)
        if (!blob) continue
        try {
          const bitmap = await createImageBitmap(blob)
          bitmaps.set(img.id, bitmap)
          thumbs[img.id] = await makeThumb(bitmap)
          restored.push(img)
        }
        catch { /* foto dañada: se omite */ }
      }
      images.value = restored
      Object.assign(state, defaultState(), saved.state)
      imagesVersion.value++
    }
    ready.value = true
    startAutosave()
  }

  if (query.layout) {
    const layout = getLayout(query.layout)
    setLayout(layout.id, { commit: false })
    if (!query.ratio && layout.ratio) state.ratioId = layout.ratio
  }
  if (query.ratio) state.ratioId = getRatio(query.ratio).id
  resetHistory()
}

async function newProject() {
  for (const bmp of bitmaps.values()) bmp.close()
  bitmaps.clear()
  for (const id of Object.keys(thumbs)) {
    URL.revokeObjectURL(thumbs[id]!)
    delete thumbs[id]
  }
  images.value = []
  Object.assign(state, defaultState(), { layoutId: state.layoutId, ratioId: state.ratioId })
  state.cells = getLayout(state.layoutId).cells.map(() => emptyCell())
  selectedCell.value = null
  selectedText.value = null
  swapFrom.value = null
  imagesVersion.value++
  await clearProject()
  resetHistory()
}

export function useCollageEditor() {
  return {
    state,
    images,
    thumbs,
    unplacedImages,
    imagesVersion,
    selectedCell,
    selectedText,
    swapFrom,
    loading,
    ready,
    errors,
    canUndo,
    canRedo,
    commit,
    undo,
    redo,
    setLayout,
    setRatio,
    addFiles,
    placeImage,
    swapCells,
    clearCell,
    removeImage,
    updateCell,
    rotateCell,
    resetCellFrame,
    resetCellFilters,
    resetDesign,
    getImage,
    addText,
    updateText,
    removeText,
    duplicateText,
    init,
    newProject,
  }
}
