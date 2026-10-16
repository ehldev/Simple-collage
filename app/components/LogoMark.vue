<script setup lang="ts">
withDefaults(defineProps<{ size?: number }>(), { size: 28 })
</script>

<template>
  <!-- Una plantilla de collage de 3 celdas: la marca es el producto. -->
  <svg :width="size" :height="size" viewBox="0 0 32 32" aria-hidden="true">
    <rect x="1" y="1" width="17" height="30" rx="5" fill="#FF4D6D" />
    <rect x="20" y="1" width="11" height="14" rx="4" fill="#FFC93C" />
    <rect x="20" y="17" width="11" height="14" rx="4" fill="#16213E" />
  </svg>
</template>
