<template>
  <div class="generate">
    <div class="container">
      <h1 class="title">Generate collage</h1>
      <p>Archivos permitidos: .jpg, .jpeg, .png</p>

      <section class="generate__collage">
        <CardLayout :item="selectedLayout" />
      </section>

      <!-- <div class="text-right">
        <button type="button" class="button button--green" :disabled="!selectedLayout" @click="$emit('changeSection', 'generate-collage')">Finalizar</button>
      </div> -->
    </div>
  </div>
</template>

<script>
import CardLayout from './CardLayout'

export default {
  name: 'Layouts',
  data() {
    return {
    }
  },
  components: {
    CardLayout
  },
  props: ['selectedLayout']
}
</script>

<style lang="scss">
.generate {
  &__collage {
    width: 80%;
    margin: 2rem auto;

    @media (min-width: 768px) {
      width: 70%;
    }

    @media (min-width: 992px) {
      width: 60%;
    }
  }
}
</style>
