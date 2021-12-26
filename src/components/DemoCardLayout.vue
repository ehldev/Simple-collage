<template>
  <article class="card-layout" :class="{'card-layout--active': item.tag === selectedLayout}" @click="setSelectedLayout()" v-if="item">
    <section class="card-grid" :class="`card-grid--${item.tag}`">
      <div :class="`grid-item-${index + 1}`" v-for="(item, index) in item.numberOfItems" :key="index">
        <img src="../assets/image.png" alt="Image" class="card-icon">
      </div>
    </section>

    <p>
      {{ item.name }}
    </p>

    <input type="radio" :value="item.tag" v-model="selectedLayout" @change="setSelectedLayout()">
  </article>
</template>

<script>
export default {
  name: 'Layouts',
  data() {
    return {
      
    }
  },
  props: ['item', 'selectedLayout'],
  methods: {
    setSelectedLayout() {
      this.$emit('selected', this.item.tag)
    }
  }
}
</script>

<style lang="scss">
</style>
