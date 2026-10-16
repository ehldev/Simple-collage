<template>
  <article class="card-layout" v-if="item">
    <section :id="`card-screen--${item.tag}`" class="card-grid card-grid--generate" :class="`card-grid--${item.tag}`">
      <div :class="`grid-item-${index + 1}`" v-for="(item, index) in items" :key="index">
        <vue-dropzone ref="myVueDropzone" id="dropzone" :options="dropzoneOptions" @vdropzone-success="setImage($event, index)" v-if="!item.url">
        </vue-dropzone>

        <section class="grid-background" :style="{backgroundImage: `url(${item.url})`}" v-else>
        </section>

        <a href="" id="link">Descargar</a>
      </div>
    </section>

    <p>
      {{ item.name }}
    </p>

    <div class="text-right">
      <button type="button" @click="download()" class="button button--green button--download">
        <span>Download collage</span>
        <img src="../assets/download.png" alt="Download icon">
      </button>
    </div>
  </article>
</template>

<script>
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'

import html2canvas from 'html2canvas'

export default {
  name: 'Layouts',
  data() {
    return {
      items: [],
      dropzoneOptions: {
          url: 'https://httpbin.org/post',
          thumbnailWidth: 150,
          maxFilesize: 0.5,
          headers: { "My-Awesome-Header": "header value" },
          dictDefaultMessage: `
            <p class='dropzone-description'>
              Arrastre o haga click aquí
            </p>
          `
      }
    }
  },
  mounted() {
    this.generateItems()
  },
  props: ['item', 'selectedLayout'],
  components: {
    vueDropzone: vue2Dropzone
  },
  methods: {
    generateItems() {
      for(let i = 0; i < this.item.numberOfItems; i++) {
        let item = {
          url: null
        }

        this.items.push(item)
      }
    },
    setImage(file, index) {
      this.items[index].url = URL.createObjectURL(file)
    },
    download() {
      this.showInfo = false

      const hiddenLink = document.getElementById('link')

      html2canvas(document.getElementById(`card-screen--${this.item.tag}`), {
          allowTaint: true,
          useCORS: true
      }).then(function (canvas) {
          let url = canvas.toDataURL();

          hiddenLink.download = "collage-generator.jpg";
          hiddenLink.href = url
          hiddenLink.target = '_blank';
          hiddenLink.click();
      })
    }
  }
}
</script>

<style lang="scss">
@import "../scss/variables.scss";

.dropzone-description {
  width: 80%;
  font-size: .8em;
  margin: 0 auto;
}

.button--download {
  display: flex;
  align-items: center;

  span {
    display: inline-block;
    margin-right: .3rem;
  }
}
</style>