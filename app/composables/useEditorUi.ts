import { ref } from 'vue'

export type EditorTab = 'layout' | 'photos' | 'photo' | 'style' | 'text'

const activeTab = ref<EditorTab>('layout')
const exportOpen = ref(false)
let picker: ((target: number | null) => void) | null = null

/** Estado de interfaz del editor compartido entre el lienzo y los paneles. */
export function useEditorUi() {
  return {
    activeTab,
    exportOpen,
    registerPicker(fn: (target: number | null) => void) {
      picker = fn
    },
    /** Abre el selector de archivos; `target` es la celda donde irá la primera foto. */
    openPicker(target: number | null = null) {
      picker?.(target)
    },
  }
}
