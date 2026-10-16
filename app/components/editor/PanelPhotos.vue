<script setup lang="ts">
import { ImagePlus, X, Check, LoaderCircle } from 'lucide-vue-next'

const { t } = useI18n()
const editor = useCollageEditor()
const ui = useEditorUi()
const { state, images, thumbs, loading, selectedCell } = editor

const placed = computed(() => new Set(state.cells.map(c => c.imageId).filter(Boolean)))

function place(id: string) {
  let target = selectedCell.value
  if (target === null) target = state.cells.findIndex(c => !c.imageId)
  if (target === null || target < 0) target = 0
  editor.placeImage(id, target)
}

function onDragStart(e: DragEvent, id: string) {
  e.dataTransfer?.setData('application/x-collage-image', id)
  if (e.dataTransfer) e.dataTransfer.effectAllowed = 'copyMove'
}
</script>

<template>
  <div class="space-y-5">
    <div>
      <button type="button" class="btn btn-primary w-full" @click="ui.openPicker(null)">
        <ImagePlus :size="18" aria-hidden="true" />
        {{ t('editor.photos.add') }}
      </button>
      <p class="mt-2 text-sm text-ink-soft">{{ t('editor.photos.hint') }}</p>
    </div>

    <p v-if="loading > 0" class="flex items-center gap-2 text-sm font-medium text-ink-soft" role="status">
      <LoaderCircle :size="16" class="animate-spin" aria-hidden="true" />
      {{ t('editor.photos.loading') }}
    </p>

    <section>
      <h2 class="font-display text-base font-bold">{{ t('editor.photos.tray') }}</h2>
      <p v-if="!images.length" class="mt-2 text-sm text-ink-soft">{{ t('editor.photos.trayEmpty') }}</p>
      <template v-else>
        <p class="mt-1 text-sm text-ink-soft">{{ t('editor.photos.placeHint') }}</p>
        <ul class="mt-3 grid grid-cols-3 gap-2">
          <li v-for="img in images" :key="img.id" class="group relative">
            <button
              type="button"
              draggable="true"
              class="block aspect-square w-full overflow-hidden rounded-xl bg-sky ring-offset-2"
              :class="placed.has(img.id) ? 'opacity-60' : ''"
              :title="img.name"
              @click="place(img.id)"
              @dragstart="onDragStart($event, img.id)"
            >
              <img v-if="thumbs[img.id]" :src="thumbs[img.id]" :alt="img.name" class="size-full object-cover" draggable="false">
            </button>
            <span
              v-if="placed.has(img.id)"
              class="pointer-events-none absolute bottom-1.5 left-1.5 flex size-5 items-center justify-center rounded-full bg-ink text-white"
              :title="t('editor.photos.inUse')"
            >
              <Check :size="12" :stroke-width="3" aria-hidden="true" />
              <span class="sr-only">{{ t('editor.photos.inUse') }}</span>
            </span>
            <button
              type="button"
              class="absolute right-1 top-1 flex size-6 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm hover:bg-tomato hover:text-white"
              :aria-label="t('editor.photos.remove', { name: img.name })"
              @click="editor.removeImage(img.id)"
            >
              <X :size="14" aria-hidden="true" />
            </button>
          </li>
        </ul>
      </template>
    </section>
  </div>
</template>
