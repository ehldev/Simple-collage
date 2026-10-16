<template>
  <div class="layouts">
    <div class="container">
      <h1 class="title">Select a layout</h1>

      <section class="layouts-container">
        <div v-for="(item, index) in layouts" :key="index">
          <DemoCardLayout :item="item" :selectedLayout="selectedLayout" @selected="setSelectedLayout($event)" />
        </div>
      </section>

      <div class="text-right">
        <button type="button" class="button button--green" :disabled="!selectedLayout" @click="$emit('changeSection', 'generate-collage')">Siguiente</button>
      </div>
    </div>
  </div>
</template>

<script>
import DemoCardLayout from './DemoCardLayout'

export default {
  name: 'Layouts',
  data() {
    return {
      layouts: [
        {
          name: 'Basic layout',
          tag: 'basic',
          numberOfItems: 4
        },
        {
          name: 'Basic layout 2',
          tag: 'basic-2',
          numberOfItems: 2
        },
        {
          name: 'Basic layout 3',
          tag: 'basic-3',
          numberOfItems: 3
        }
      ],
      selectedLayout: null
    }
  },
  components: {
    DemoCardLayout
  },
  methods: {
    setSelectedLayout(value) {
      this.selectedLayout = value

      let item = this.layouts.find(item => item.tag === value)
      this.$emit('selected', item)
    }
  }
}
</script>

<style lang="scss">
@import "../scss/variables.scss";

.layouts {
  .title {
    font-size: 2em;
  }

  &-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 1rem;
    margin-top: 1rem;
  }

  .button {
    margin-top: 1rem;
  }

  .layout-demo-item {
    padding: .5rem;
    border: 3px solid $light;
    border-radius: .2rem;

    cursor: pointer;

    transition: border .5s;

    &--active {
      border: 3px solid $green;
    }

    input[type="radio"] {
      margin-top: .5rem;
    }
  }
}
</style>
