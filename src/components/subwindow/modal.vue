<template>
  <div class="subwindow">
    <transition name="subwindow" :duration="500" @after-leave="afterLeave">
      <div :class="{'subwindow__overlay': true, 'subwindow__overlay--clickable': isWindowShow}" v-if="isWindowShow">
        <div
          ref="container"
          class="subwindow__helper"
          :style="{
            left: `${left}px`,
            top: `${top}px`,
          }"
        >
          <div :class="{'subwindow__wrapper': true, 'subwindow__wrapper--wide': wide }">
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
  import subwindow from './subwindow.mixin';
  import './subwindow.scss'

  export default {
    name: "GameModal",
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
      after: {
        type: Function,
        default() {
          return () => {};
        },
      }
    },

    mounted() {},

    methods: {
      afterLeave() {
        this.after();
      },
    }
  }
</script>

<style>

</style>