<template>
  <div class="welcome">
    <img alt="Vue logo" src="../assets/home.png">
    <h1 class="title font-weight-bold">Collage generator with Vuejs</h1>
    <h2>By <i>@ehldev</i></h2>

    <button type="button" class="button button--green" @click="$emit('changeSection', 'layouts')">Empezar</button>
  </div>
</template>

<script>
export default {
  name: 'Welcome'
}
</script>

<style lang="scss">
.welcome {
  width: 100%;
  height: 100vh;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  h1 {
    margin-top: 1rem;
  }

  h2 {
    font-size: 1em;
    margin-top: .3rem;
  }

  .button {
    margin-top: 1rem;
  }
}
</style>
