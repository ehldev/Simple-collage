<script setup lang="ts">
import { LayoutGrid, Images, Crop, Palette, Type, Undo2, Redo2, RotateCcw, Download, FilePlus2, X } from 'lucide-vue-next'
import { ACCEPTED_TYPES } from '~/utils/images'
import type { EditorTab } from '~/composables/useEditorUi'

const { t } = useI18n()
const route = useRoute()
const localePath = useLocalePath()
const editor = useCollageEditor()
const ui = useEditorUi()
const { activeTab } = ui

const TABS: { key: EditorTab, icon: typeof LayoutGrid }[] = [
  { key: 'layout', icon: LayoutGrid },
  { key: 'photos', icon: Images },
  { key: 'photo', icon: Crop },
  { key: 'style', icon: Palette },
  { key: 'text', icon: Type },
]

// --- Selector de archivos compartido ---
const fileInput = ref<HTMLInputElement>()
let pickerTarget: number | null = null
ui.registerPicker((target) => {
  pickerTarget = target
  fileInput.value?.click()
})

function onFiles(e: Event) {
  const input = e.target as HTMLInputElement
  if (input.files?.length) editor.addFiles([...input.files], pickerTarget)
  input.value = ''
  pickerTarget = null
}

// --- Inicio ---
onMounted(async () => {
  const q = route.query
  await editor.init({
    layout: typeof q.layout === 'string' ? q.layout : undefined,
    ratio: typeof q.ratio === 'string' ? q.ratio : undefined,
  })
})

// --- Nuevo proyecto ---
const confirmNew = ref(false)
async function startNew() {
  confirmNew.value = false
  await editor.newProject()
  activeTab.value = 'layout'
}

function errorText(err: { name: string, reason: string }) {
  return t(`editor.errors.${err.reason}`, { name: err.name })
}
</script>

<template>
  <div class="flex h-full flex-col">
    <!-- Barra superior -->
    <header class="relative z-20 flex h-14 shrink-0 items-center gap-1 border-b border-line bg-paper px-2 sm:px-4">
      <NuxtLink :to="localePath('index')" class="mr-auto flex items-center gap-2 rounded-full px-2 py-1 font-display font-bold" :aria-label="t('nav.home')">
        <LogoMark :size="24" />
        <span class="hidden sm:inline">Simple Collage</span>
      </NuxtLink>

      <button type="button" class="icon-btn" :disabled="!editor.canUndo.value" :aria-label="t('editor.toolbar.undo')" :title="`${t('editor.toolbar.undo')} (Ctrl+Z)`" @click="editor.undo">
        <Undo2 :size="19" aria-hidden="true" />
      </button>
      <button type="button" class="icon-btn" :disabled="!editor.canRedo.value" :aria-label="t('editor.toolbar.redo')" :title="`${t('editor.toolbar.redo')} (Ctrl+Shift+Z)`" @click="editor.redo">
        <Redo2 :size="19" aria-hidden="true" />
      </button>
      <button type="button" class="icon-btn sm:!w-auto sm:gap-1.5 sm:px-3" :title="t('editor.toolbar.resetDesignHint')" @click="editor.resetDesign">
        <RotateCcw :size="19" aria-hidden="true" />
        <span class="sr-only text-sm font-semibold sm:not-sr-only">{{ t('editor.toolbar.resetDesign') }}</span>
      </button>

      <div class="relative">
        <button type="button" class="icon-btn sm:!w-auto sm:gap-1.5 sm:px-3" :aria-expanded="confirmNew" @click="confirmNew = !confirmNew">
          <FilePlus2 :size="19" aria-hidden="true" />
          <span class="sr-only text-sm font-semibold sm:not-sr-only">{{ t('editor.toolbar.newProject') }}</span>
        </button>
        <div v-if="confirmNew" class="absolute right-0 top-12 w-72 rounded-2xl bg-paper p-4 shadow-[0_18px_40px_-12px_rgba(22,33,62,0.4)] ring-1 ring-line" role="dialog" aria-modal="false">
          <p class="text-sm leading-relaxed">{{ t('editor.toolbar.newConfirm') }}</p>
          <div class="mt-3 flex justify-end gap-2">
            <button type="button" class="btn btn-ghost !px-3 !py-1.5 text-sm" @click="confirmNew = false">{{ t('common.cancel') }}</button>
            <button type="button" class="btn btn-primary !px-3 !py-1.5 text-sm" @click="startNew">{{ t('editor.toolbar.newConfirmYes') }}</button>
          </div>
        </div>
      </div>

      <button type="button" class="btn btn-primary ml-1 !px-4 !py-2 text-sm" @click="ui.exportOpen.value = true">
        <Download :size="17" aria-hidden="true" />
        {{ t('editor.toolbar.export') }}
      </button>
    </header>

    <div class="flex min-h-0 flex-1 flex-col lg:flex-row">
      <!-- Pestañas: barra inferior en móvil, columna en escritorio -->
      <nav
        class="order-3 grid shrink-0 grid-cols-5 border-t border-line bg-paper pb-[env(safe-area-inset-bottom)] lg:order-1 lg:flex lg:w-[84px] lg:flex-col lg:gap-1 lg:border-t-0 lg:border-r lg:p-2"
        role="tablist"
        :aria-label="t('editor.meta.title')"
      >
        <button
          v-for="tab in TABS"
          :id="`tab-${tab.key}`"
          :key="tab.key"
          type="button"
          role="tab"
          :aria-selected="activeTab === tab.key"
          aria-controls="editor-panel"
          class="flex flex-col items-center gap-1 py-2 text-[11px] font-semibold transition-colors lg:rounded-xl lg:py-3"
          :class="activeTab === tab.key ? 'text-tomato-deep lg:bg-tomato/10' : 'text-ink-soft hover:text-ink lg:hover:bg-sky'"
          @click="ui.activeTab.value = tab.key"
        >
          <component :is="tab.icon" :size="21" aria-hidden="true" />
          {{ t(`editor.tabs.${tab.key}`) }}
        </button>
      </nav>

      <!-- Panel de herramientas -->
      <aside
        id="editor-panel"
        role="tabpanel"
        :aria-labelledby="`tab-${activeTab}`"
        class="order-2 max-h-[38dvh] shrink-0 overflow-y-auto border-t border-line bg-paper px-4 py-5 lg:order-2 lg:max-h-none lg:w-[340px] lg:border-t-0 lg:border-r lg:px-5"
      >
        <EditorPanelLayout v-if="activeTab === 'layout'" />
        <EditorPanelPhotos v-else-if="activeTab === 'photos'" />
        <EditorPanelPhoto v-else-if="activeTab === 'photo'" />
        <EditorPanelStyle v-else-if="activeTab === 'style'" />
        <EditorPanelText v-else-if="activeTab === 'text'" />
      </aside>

      <!-- Lienzo -->
      <section class="relative order-1 min-h-0 flex-1 p-4 sm:p-6 lg:order-3 lg:p-10">
        <EditorCanvas />

        <div
          v-if="editor.errors.value.length"
          class="absolute inset-x-4 bottom-4 z-10 mx-auto max-w-lg rounded-2xl bg-ink p-4 text-sm text-white shadow-xl"
          role="alert"
        >
          <div class="flex items-start gap-3">
            <ul class="flex-1 space-y-1.5">
              <li v-for="err in editor.errors.value" :key="err.name">{{ errorText(err) }}</li>
            </ul>
            <button type="button" class="shrink-0 rounded-full p-1 hover:bg-white/10" :aria-label="t('editor.errors.dismiss')" @click="editor.errors.value = []">
              <X :size="18" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>
    </div>

    <input
      ref="fileInput"
      type="file"
      class="hidden"
      multiple
      :accept="[...ACCEPTED_TYPES, '.heic', '.heif'].join(',')"
      @change="onFiles"
    >

    <EditorExportDialog />
  </div>
</template>

<style scoped>
.icon-btn {
  display: inline-flex;
  height: 2.5rem;
  width: 2.5rem;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  color: var(--color-ink);
  transition: background-color 0.15s;
}
.icon-btn:hover:not(:disabled) { background: var(--color-sky); }
.icon-btn:disabled { opacity: 0.35; cursor: not-allowed; }
</style>
