<template>
  <div class="subwindow">
    <transition name="subwindow" :duration="10000">
      <div :class="{'subwindow__overlay': true, 'subwindow__overlay--clickable': isWindowShow}" v-if="isWindowShow">
        <div
          ref="container"
          class="subwindow__helper"
          :style="{
            left: `${left}px`,
            top: `${top}px`,
          }"
        >
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
    props: {
      left: {
        type: Number,
        default: 0,
      },
      top: {
        type: Number,
        default: 0,
      },
    },

    mounted() {},
  }
</script>

<style>

</style>