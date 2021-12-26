<template>
  <div id="app">
    <Welcome @changeSection="changeSection($event)" v-if="sectionName === 'welcome'" />

    <Layouts @changeSection="changeSection($event)" @selected="selectedLayout = $event" v-if="sectionName === 'layouts'" />

    <Generate :selectedLayout="selectedLayout" @changeSection="changeSection($event)" v-if="sectionName === 'generate-collage'" />
  </div>
</template>

<script>
import Welcome from './components/Welcome.vue'
import Layouts from './components/Layouts.vue'
import Generate from './components/Generate.vue'

export default {
  name: 'App',
  data() {
    return {
      sectionName: 'welcome',
      selectedLayout: null
    }
  },
  components: {
    Welcome,
    Layouts,
    Generate
  },
  methods: {
    changeSection(value) {
      this.sectionName = value
    }
  }
}
</script>

<style lang="scss">
</style>
