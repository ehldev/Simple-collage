<script setup lang="ts">
import { Download, Share2, X, CircleCheck, LoaderCircle } from 'lucide-vue-next'
import { exportSize, renderCollage } from '~/utils/render'
import { track } from '~/utils/analytics'

const { t } = useI18n()
const editor = useCollageEditor()
const ui = useEditorUi()
const { state } = editor

type Format = 'jpeg' | 'png' | 'webp'
const SIZES = [
  { key: 'social', long: 1080 },
  { key: 'hd', long: 2160 },
  { key: 'max', long: 3840 },
] as const

const dialog = ref<HTMLDialogElement>()
const format = ref<Format>('jpeg')
const sizeKey = ref<typeof SIZES[number]['key']>('hd')
const status = ref<'idle' | 'working' | 'done' | 'error'>('idle')
const lastFile = shallowRef<File | null>(null)
const webpSupported = ref(true)

const formats = computed<Format[]>(() => (webpSupported.value ? ['jpeg', 'png', 'webp'] : ['jpeg', 'png']))
const hasEmptyCells = computed(() => state.cells.some(c => !c.imageId))
const canShare = computed(() => !!lastFile.value && typeof navigator !== 'undefined' && !!navigator.canShare?.({ files: [lastFile.value] }))

function dims(long: number) {
  return exportSize(state.ratioId, long)
}

onMounted(() => {
  const probe = document.createElement('canvas')
  probe.width = probe.height = 1
  webpSupported.value = probe.toDataURL('image/webp').startsWith('data:image/webp')
})

watch(ui.exportOpen, (open) => {
  if (open) {
    status.value = 'idle'
    lastFile.value = null
    dialog.value?.showModal()
  }
  else {
    dialog.value?.close()
  }
})

function close() {
  ui.exportOpen.value = false
}

async function waitForFonts() {
  await Promise.all(state.texts.map(tx => document.fonts?.load(`${tx.weight} 40px "${tx.font}"`).catch(() => {})))
}

function fileName() {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  const ext = format.value === 'jpeg' ? 'jpg' : format.value
  return `collage-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}.${ext}`
}

async function generate() {
  status.value = 'working'
  try {
    await waitForFonts()
    const size = SIZES.find(s => s.key === sizeKey.value)!
    const { width, height } = dims(size.long)
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('no-context')
    renderCollage(ctx, state, { width, height, getImage: editor.getImage })

    const type = `image/${format.value}`
    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, type, format.value === 'png' ? undefined : 0.92))
    canvas.width = canvas.height = 0
    if (!blob) throw new Error('no-blob')

    const file = new File([blob], fileName(), { type })
    lastFile.value = file
    const url = URL.createObjectURL(file)
    const a = document.createElement('a')
    a.href = url
    a.download = file.name
    document.body.appendChild(a)
    a.click()
    a.remove()
    setTimeout(() => URL.revokeObjectURL(url), 10_000)
    status.value = 'done'
    track('collage_download', {
      format: format.value,
      size: sizeKey.value,
      layout: state.layoutId,
      ratio: state.ratioId,
      photos: state.cells.filter(c => c.imageId).length,
      texts: state.texts.length,
    })
  }
  catch {
    status.value = 'error'
  }
}

async function share() {
  if (!lastFile.value) return
  try {
    await navigator.share({ files: [lastFile.value], title: 'Simple Collage' })
    track('collage_share', { format: format.value })
  }
  catch { /* el usuario canceló */ }
}
</script>

<template>
  <dialog
    ref="dialog"
    class="m-auto w-[min(92vw,26rem)] rounded-[24px] bg-paper p-0 text-ink shadow-2xl backdrop:bg-ink/50 backdrop:backdrop-blur-sm"
    aria-labelledby="export-title"
    @close="ui.exportOpen.value = false"
    @click.self="close"
  >
    <div class="p-6">
      <div class="flex items-center justify-between">
        <h2 id="export-title" class="font-display text-2xl font-bold">{{ t('editor.export.title') }}</h2>
        <button type="button" class="flex size-9 items-center justify-center rounded-full hover:bg-sky" :aria-label="t('common.close')" @click="close">
          <X :size="20" aria-hidden="true" />
        </button>
      </div>

      <fieldset class="mt-5">
        <legend class="text-sm font-semibold">{{ t('editor.export.size') }}</legend>
        <div class="mt-2 space-y-1.5">
          <label
            v-for="s in SIZES"
            :key="s.key"
            class="flex cursor-pointer items-center justify-between rounded-xl px-3.5 py-2.5 ring-1 transition-colors"
            :class="sizeKey === s.key ? 'bg-sky ring-ink' : 'ring-line hover:bg-sky'"
          >
            <span class="flex items-center gap-3">
              <input v-model="sizeKey" type="radio" name="size" :value="s.key" class="accent-tomato">
              <span class="font-medium">{{ t(`editor.export.sizes.${s.key}`) }}</span>
            </span>
            <span class="text-sm tabular-nums text-ink-soft">{{ dims(s.long).width }} × {{ dims(s.long).height }}</span>
          </label>
        </div>
      </fieldset>

      <fieldset class="mt-5">
        <legend class="text-sm font-semibold">{{ t('editor.export.format') }}</legend>
        <div class="mt-2 space-y-1.5">
          <label
            v-for="f in formats"
            :key="f"
            class="flex cursor-pointer items-center gap-3 rounded-xl px-3.5 py-2.5 ring-1 transition-colors"
            :class="format === f ? 'bg-sky ring-ink' : 'ring-line hover:bg-sky'"
          >
            <input v-model="format" type="radio" name="format" :value="f" class="accent-tomato">
            <span class="text-sm font-medium">{{ t(`editor.export.formats.${f}`) }}</span>
          </label>
        </div>
      </fieldset>

      <p v-if="hasEmptyCells" class="mt-4 rounded-xl bg-sun/35 px-3.5 py-2.5 text-sm">{{ t('editor.export.emptyCells') }}</p>

      <p v-if="status === 'done'" class="mt-4 flex items-center gap-2 text-sm font-semibold text-ink" role="status">
        <CircleCheck :size="18" class="text-[#1F9D6B]" aria-hidden="true" />
        {{ t('editor.export.done') }}
      </p>
      <p v-else-if="status === 'error'" class="mt-4 text-sm font-semibold text-tomato-deep" role="alert">
        {{ t('editor.export.failed') }}
      </p>

      <div class="mt-6 flex gap-2">
        <button type="button" class="btn btn-primary flex-1" :disabled="status === 'working'" @click="generate">
          <LoaderCircle v-if="status === 'working'" :size="18" class="animate-spin" aria-hidden="true" />
          <Download v-else :size="18" aria-hidden="true" />
          {{ status === 'working' ? t('editor.export.generating') : t('editor.export.download') }}
        </button>
        <button v-if="canShare" type="button" class="btn btn-ink" @click="share">
          <Share2 :size="18" aria-hidden="true" />
          {{ t('editor.export.share') }}
        </button>
      </div>
    </div>
  </dialog>
</template>
