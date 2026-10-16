<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <!--
    El titular está compuesto como un collage: cada fragmento ocupa una celda.
    Al cargar, las celdas se separan (el "espaciado" del editor) una sola vez.
  -->
  <h1 class="hero-grid">
    <span class="cell word bg-ink text-white [grid-area:w1]">{{ `${t('home.hero.w1')} ` }}</span>
    <span class="cell photo photo-sunset [grid-area:p1]" aria-hidden="true" />
    <span class="cell word bg-tomato text-white [grid-area:w2]">{{ `${t('home.hero.w2')} ` }}</span>
    <span class="cell photo photo-sea [grid-area:p2]" aria-hidden="true" />
    <span class="cell word bg-sun text-ink [grid-area:w3]">{{ `${t('home.hero.w3')} ` }}</span>
    <span class="cell photo photo-bloom [grid-area:p3]" aria-hidden="true" />
    <span class="cell word bg-paper text-ink [grid-area:w4]">{{ `${t('home.hero.w4')} ` }}</span>
  </h1>
</template>

<style scoped>
.hero-grid {
  container-type: inline-size;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(4, minmax(0, 1fr));
  grid-template-areas:
    "w1 w1 w1 w1 p1 p1"
    "w2 w2 w2 w2 p1 p1"
    "p2 p2 w3 w3 w3 p3"
    "p2 p2 w4 w4 w4 w4";
  aspect-ratio: 6 / 4.4;
  gap: 10px;
  margin: 0;
  animation: spread 900ms cubic-bezier(0.2, 0.8, 0.2, 1) 250ms both;
}

.cell {
  display: flex;
  align-items: flex-end;
  min-width: 0;
  overflow: hidden;
  border-radius: var(--radius-cell);
  animation: round 900ms cubic-bezier(0.2, 0.8, 0.2, 1) 250ms both;
}

.word {
  padding: 0.12em 0.32em 0.16em;
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(1.9rem, 10.5cqi, 5.6rem);
  line-height: 0.95;
  letter-spacing: -0.035em;
  white-space: nowrap;
}

.photo-sunset {
  background:
    radial-gradient(circle at 50% 78%, #FFE29A 0 14%, transparent 15%),
    linear-gradient(180deg, #FFB3A1 0%, #FF6F7F 48%, #6E4C9A 100%);
}

.photo-sea {
  background:
    radial-gradient(ellipse at 30% 30%, #FFFFFF 0 7%, transparent 8%),
    linear-gradient(180deg, #A9C9F5 0%, #A9C9F5 52%, #3D6CC2 53%, #1E3E80 100%);
}

.photo-bloom {
  background:
    radial-gradient(circle at 50% 50%, #FFC93C 0 14%, transparent 15%),
    radial-gradient(circle at 50% 50%, #F9A8BA 0 42%, transparent 43%),
    #33467A;
}

@keyframes spread {
  from { gap: 0; }
  to { gap: 10px; }
}

@keyframes round {
  from { border-radius: 0; }
  to { border-radius: var(--radius-cell); }
}

@media (min-width: 640px) {
  .hero-grid { gap: 14px; }
  @keyframes spread {
    from { gap: 0; }
    to { gap: 14px; }
  }
}
</style>
