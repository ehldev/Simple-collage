<script setup lang="ts">
import { getRatio } from '~/utils/layouts'
import { cellRects, hitRect, photoGeometry, renderCollage, textBox } from '~/utils/render'
import { TEXT_FONTS } from '~/utils/collage'

const { t } = useI18n()
const editor = useCollageEditor()
const ui = useEditorUi()
const { state, selectedCell, selectedText, swapFrom } = editor

const stage = ref<HTMLDivElement>()
const canvas = ref<HTMLCanvasElement>()
const display = reactive({ w: 0, h: 0, dpr: 1 })
const dropCell = ref<number | null>(null)
const draggingFiles = ref(false)

// --- Tamaño: el lienzo ocupa el máximo espacio posible manteniendo el formato ---

function fit() {
  const el = stage.value
  if (!el) return
  const ratio = getRatio(state.ratioId)
  const availW = el.clientWidth
  const availH = el.clientHeight
  if (!availW || !availH) return
  let w = availW
  let h = (w * ratio.h) / ratio.w
  if (h > availH) {
    h = availH
    w = (h * ratio.w) / ratio.h
  }
  display.w = Math.floor(w)
  display.h = Math.floor(h)
  display.dpr = Math.min(window.devicePixelRatio || 1, 2.5)
}

let resizeObserver: ResizeObserver | undefined
onMounted(() => {
  resizeObserver = new ResizeObserver(fit)
  if (stage.value) resizeObserver.observe(stage.value)
  fit()
  window.addEventListener('keydown', onGlobalKey)
})
onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  window.removeEventListener('keydown', onGlobalKey)
})
watch(() => state.ratioId, () => nextTick(fit))

// --- Dibujo ---

const pixelW = computed(() => Math.round(display.w * display.dpr))
const pixelH = computed(() => Math.round(display.h * display.dpr))

let frame = 0
function scheduleRender() {
  if (frame) return
  frame = requestAnimationFrame(() => {
    frame = 0
    draw()
  })
}

function draw() {
  const el = canvas.value
  if (!el || !pixelW.value) return
  if (el.width !== pixelW.value) el.width = pixelW.value
  if (el.height !== pixelH.value) el.height = pixelH.value
  const ctx = el.getContext('2d')
  if (!ctx) return
  renderCollage(ctx, state, {
    width: el.width,
    height: el.height,
    getImage: editor.getImage,
    editor: {
      px: display.dpr,
      selectedCell: selectedCell.value,
      selectedText: selectedText.value,
      dropCell: dropCell.value,
      swapFrom: swapFrom.value,
      placeholderLabel: t('editor.placeholder'),
    },
  })
}

watch(state, scheduleRender, { deep: true })
watch([selectedCell, selectedText, swapFrom, dropCell, editor.imagesVersion, pixelW, pixelH], scheduleRender)

// Las tipografías del texto se cargan bajo demanda; al llegar, se redibuja.
const loadedFonts = new Set<string>()
watch(() => state.texts.map(tx => `${tx.weight} ${tx.font}`).join('|'), () => {
  for (const tx of state.texts) {
    const key = `${tx.weight} ${tx.font}`
    if (loadedFonts.has(key)) continue
    loadedFonts.add(key)
    document.fonts?.load(`${tx.weight} 40px "${tx.font}"`).then(scheduleRender).catch(() => {})
  }
}, { immediate: true })
onMounted(() => {
  document.fonts?.ready.then(scheduleRender)
  for (const f of TEXT_FONTS) document.fonts?.load(`400 20px "${f.family}"`).catch(() => {})
})

// --- Coordenadas y detección ---

function toCanvas(e: { clientX: number, clientY: number }) {
  const rect = canvas.value!.getBoundingClientRect()
  return {
    x: ((e.clientX - rect.left) / rect.width) * pixelW.value,
    y: ((e.clientY - rect.top) / rect.height) * pixelH.value,
  }
}

function rects() {
  return cellRects(state, pixelW.value, pixelH.value)
}

function hitText(x: number, y: number): string | null {
  const ctx = canvas.value?.getContext('2d')
  if (!ctx) return null
  const pad = 8 * display.dpr
  for (let i = state.texts.length - 1; i >= 0; i--) {
    const layer = state.texts[i]!
    const b = textBox(ctx, layer, pixelW.value, pixelH.value)
    if (x >= b.x - pad && x <= b.x + b.w + pad && y >= b.y - pad && y <= b.y + b.h + pad) return layer.id
  }
  return null
}

// --- Puntero: seleccionar, encuadrar, mover texto y pellizcar ---

type Drag =
  | { kind: 'pan', index: number, startX: number, startY: number, panX: number, panY: number, moved: boolean }
  | { kind: 'text', id: string, startX: number, startY: number, x: number, y: number, moved: boolean }
  | { kind: 'empty', index: number, startX: number, startY: number, moved: boolean }

let drag: Drag | null = null
const pointers = new Map<number, { x: number, y: number }>()
let pinch: { index: number, dist: number, zoom: number } | null = null

function pointerDistance() {
  const [a, b] = [...pointers.values()]
  return a && b ? Math.hypot(a.x - b.x, a.y - b.y) : 0
}

function onPointerDown(e: PointerEvent) {
  if (e.button !== 0 && e.pointerType === 'mouse') return
  canvas.value?.setPointerCapture(e.pointerId)
  canvas.value?.focus({ preventScroll: true })
  const p = toCanvas(e)
  pointers.set(e.pointerId, p)

  if (pointers.size === 2) {
    const index = selectedCell.value
    const cell = index !== null ? state.cells[index] : undefined
    if (index !== null && cell?.imageId) pinch = { index, dist: pointerDistance(), zoom: cell.zoom }
    drag = null
    return
  }

  const textId = hitText(p.x, p.y)
  if (textId) {
    const layer = state.texts.find(tx => tx.id === textId)!
    selectedText.value = textId
    selectedCell.value = null
    ui.activeTab.value = 'text'
    drag = { kind: 'text', id: textId, startX: p.x, startY: p.y, x: layer.x, y: layer.y, moved: false }
    return
  }

  const index = hitRect(rects(), p.x, p.y)
  if (index < 0) {
    selectedCell.value = null
    selectedText.value = null
    return
  }

  if (swapFrom.value !== null) {
    if (swapFrom.value !== index) editor.swapCells(swapFrom.value, index)
    else swapFrom.value = null
    return
  }

  selectedText.value = null
  selectedCell.value = index
  ui.activeTab.value = 'photo'
  const cell = state.cells[index]!
  drag = cell.imageId
    ? { kind: 'pan', index, startX: p.x, startY: p.y, panX: cell.panX, panY: cell.panY, moved: false }
    : { kind: 'empty', index, startX: p.x, startY: p.y, moved: false }
}

function onPointerMove(e: PointerEvent) {
  const p = toCanvas(e)

  if (!pointers.has(e.pointerId)) {
    updateCursor(p.x, p.y)
    return
  }
  pointers.set(e.pointerId, p)

  if (pinch && pointers.size === 2) {
    const zoom = clamp(pinch.zoom * (pointerDistance() / pinch.dist), 1, 4)
    editor.updateCell(pinch.index, { zoom })
    return
  }
  if (!drag) return

  const dx = p.x - drag.startX
  const dy = p.y - drag.startY
  if (!drag.moved && Math.hypot(dx, dy) > 4 * display.dpr) drag.moved = true
  if (!drag.moved) return

  if (drag.kind === 'pan') {
    const cell = state.cells[drag.index]
    const img = cell?.imageId ? editor.getImage(cell.imageId) : undefined
    const rect = rects()[drag.index]
    if (!cell || !img || !rect) return
    const g = photoGeometry(cell, rect, img.width, img.height)
    // El desplazamiento se guarda relativo al sobrante, con el giro aplicado.
    editor.updateCell(drag.index, {
      panX: g.overflowX > 0.5 ? clamp(drag.panX + dx / g.overflowX, -1, 1) : 0,
      panY: g.overflowY > 0.5 ? clamp(drag.panY + dy / g.overflowY, -1, 1) : 0,
    })
  }
  else if (drag.kind === 'text') {
    editor.updateText(drag.id, {
      x: clamp(drag.x + dx / pixelW.value, 0, 1),
      y: clamp(drag.y + dy / pixelH.value, 0, 1),
    })
  }
}

function onPointerUp(e: PointerEvent) {
  pointers.delete(e.pointerId)
  if (pinch) {
    if (pointers.size < 2) {
      pinch = null
      editor.commit()
    }
    return
  }
  if (!drag) return
  if (drag.kind === 'empty' && !drag.moved) ui.openPicker(drag.index)
  else if (drag.moved) editor.commit()
  drag = null
}

function updateCursor(x: number, y: number) {
  const el = canvas.value
  if (!el) return
  if (hitText(x, y)) {
    el.style.cursor = 'move'
    return
  }
  const index = hitRect(rects(), x, y)
  if (index < 0) el.style.cursor = 'default'
  else if (swapFrom.value !== null) el.style.cursor = 'pointer'
  else el.style.cursor = state.cells[index]?.imageId ? 'grab' : 'pointer'
}

// --- Rueda: zoom de la foto bajo el cursor ---

let wheelCommit: ReturnType<typeof setTimeout> | undefined
function onWheel(e: WheelEvent) {
  const p = toCanvas(e)
  const index = hitRect(rects(), p.x, p.y)
  const cell = state.cells[index]
  if (index < 0 || !cell?.imageId) return
  e.preventDefault()
  selectedCell.value = index
  selectedText.value = null
  ui.activeTab.value = 'photo'
  editor.updateCell(index, { zoom: clamp(cell.zoom * Math.exp(-e.deltaY * 0.0015), 1, 4) })
  clearTimeout(wheelCommit)
  wheelCommit = setTimeout(editor.commit, 350)
}

// --- Soltar archivos o fotos de la bandeja ---

const TRAY_TYPE = 'application/x-collage-image'

function onDragOver(e: DragEvent) {
  const types = e.dataTransfer?.types ?? []
  if (!types.includes('Files') && !types.includes(TRAY_TYPE)) return
  e.preventDefault()
  draggingFiles.value = types.includes('Files')
  if (canvas.value) {
    const p = toCanvas(e)
    const index = hitRect(rects(), p.x, p.y)
    dropCell.value = index >= 0 ? index : null
  }
}

function onDragLeave(e: DragEvent) {
  if (e.currentTarget === e.target || !stage.value?.contains(e.relatedTarget as Node)) {
    dropCell.value = null
    draggingFiles.value = false
  }
}

function onDrop(e: DragEvent) {
  e.preventDefault()
  const target = dropCell.value
  dropCell.value = null
  draggingFiles.value = false
  const trayId = e.dataTransfer?.getData(TRAY_TYPE)
  if (trayId) {
    if (target !== null) editor.placeImage(trayId, target)
    return
  }
  const files = [...(e.dataTransfer?.files ?? [])].filter(f => f.type.startsWith('image/') || /\.(heic|heif)$/i.test(f.name))
  if (files.length) editor.addFiles(files, target)
}

// --- Teclado ---

function isTyping(e: KeyboardEvent) {
  const el = e.target as HTMLElement | null
  return !!el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.isContentEditable)
}

function onGlobalKey(e: KeyboardEvent) {
  if (isTyping(e)) return
  const mod = e.ctrlKey || e.metaKey
  if (mod && e.key.toLowerCase() === 'z') {
    e.preventDefault()
    if (e.shiftKey) editor.redo()
    else editor.undo()
  }
  else if (mod && e.key.toLowerCase() === 'y') {
    e.preventDefault()
    editor.redo()
  }
}

function onCanvasKey(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    swapFrom.value = null
    selectedCell.value = null
    selectedText.value = null
    return
  }
  if (e.key === 'Delete' || e.key === 'Backspace') {
    if (selectedText.value) editor.removeText(selectedText.value)
    else if (selectedCell.value !== null) editor.clearCell(selectedCell.value)
    e.preventDefault()
    return
  }
  if (e.key === 'Tab' && !e.shiftKey && !selectedText.value && state.cells.length) {
    // Tab recorre las celdas antes de salir del lienzo.
    const next = selectedCell.value === null ? 0 : selectedCell.value + 1
    if (next < state.cells.length) {
      e.preventDefault()
      selectedCell.value = next
      ui.activeTab.value = 'photo'
    }
    return
  }
  if (e.key === 'Enter' && selectedCell.value !== null && !state.cells[selectedCell.value]?.imageId) {
    ui.openPicker(selectedCell.value)
    return
  }

  const arrows: Record<string, [number, number]> = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }
  const dir = arrows[e.key]
  if (!dir) return
  e.preventDefault()
  const step = e.shiftKey ? 0.1 : 0.02
  if (selectedText.value) {
    const layer = state.texts.find(tx => tx.id === selectedText.value)
    if (layer) editor.updateText(layer.id, { x: clamp(layer.x + dir[0] * step / 2, 0, 1), y: clamp(layer.y + dir[1] * step / 2, 0, 1) }, true)
  }
  else if (selectedCell.value !== null) {
    const cell = state.cells[selectedCell.value]
    if (cell?.imageId) editor.updateCell(selectedCell.value, { panX: clamp(cell.panX + dir[0] * step * 2, -1, 1), panY: clamp(cell.panY + dir[1] * step * 2, -1, 1) }, true)
  }
}

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v))
}
</script>

<template>
  <div
    ref="stage"
    class="relative flex h-full w-full items-center justify-center"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
  >
    <canvas
      ref="canvas"
      tabindex="0"
      role="application"
      :aria-label="t('editor.canvasLabel')"
      class="block touch-none rounded-sm bg-paper shadow-[0_18px_50px_-20px_rgba(22,33,62,0.45)] outline-offset-4"
      :style="{ width: `${display.w}px`, height: `${display.h}px` }"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
      @wheel="onWheel"
      @keydown="onCanvasKey"
    />
    <div
      v-if="draggingFiles && dropCell === null"
      class="pointer-events-none absolute inset-3 flex items-center justify-center rounded-3xl border-[3px] border-dashed border-tomato bg-tomato/10 font-display text-xl font-bold text-ink"
    >
      {{ t('editor.dropHere') }}
    </div>
  </div>
</template>
