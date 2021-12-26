<template>
  <div id="app">
    <Welcome @changeSection="changeSection($event)" v-if="sectionName === 'welcome'" />

    <Layouts @changeSection="changeSection($event)" @selected="selectedLayout = $event" v-if="sectionName === 'layouts'" />

    <Generate :selectedLayout="selectedLayout" @changeSection="changeSection($event)" v-if="sectionName === 'generate-collage'" />

    <BackButton :sectionName="sectionName" @change="changeSection($event)" v-if="sectionName != 'welcome'" />
  </div>
</template>

<script>
import Welcome from './components/Welcome.vue'
import Layouts from './components/Layouts.vue'
import Generate from './components/Generate.vue'
import BackButton from './components/BackButton.vue'

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
    Generate,
    BackButton
  },
  methods: {
    changeSection(value) {
      this.sectionName = value
    }
  }
}
</script>

<style lang="scss">
#app {
  position: relative;
}
</style>
