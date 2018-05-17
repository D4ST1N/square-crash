<template>
  <div class="subwindow">
    <transition name="subwindow" :duration="10000">
      <div class="subwindow__overlay" v-if="isWindowShow">
        <div class="subwindow__helper">
          <div class="subwindow__wrapper">
            <header class="subwindow__header">
              <h1 class="subwindow__title">{{ title }}</h1>
              <slot name="header"></slot>
            </header>
            <section class="subwindow__content">
              {{ content }}
              <slot name="content"></slot>
            </section>
            <footer class="subwindow__footer">
              <slot name="footer"></slot>
            </footer>
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
    name: "modal",
    mixins: [subwindow],

    mounted() {},
  }
</script>

<style scoped>

</style>