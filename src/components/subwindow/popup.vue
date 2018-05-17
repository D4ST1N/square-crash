<template>
  <div class="subwindow">
    <transition name="subwindow" :duration="10000">
      <div class="subwindow__overlay" v-if="isWindowShow" @click.self="hideWindow">
        <div class="subwindow__helper">
          <div class="subwindow__wrapper">
            <header class="subwindow__header">
              <h1 class="subwindow__title">{{ title }}</h1>
            </header>
            <section class="subwindow__content">
              {{ content }}
            </section>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import subwindow from './subwindow';
  import './subwindow.scss'

  export default {
    name: "popup",
    mixins: [subwindow],

    mounted() {},
  }
</script>

<style scoped>

</style>