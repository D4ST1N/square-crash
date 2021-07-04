<template>
  <div class="menu">
    <transition name="menu" :duration="500">
      <div v-if="isMenuShow" class="menu__overlay">
        <div class="menu__wrapper">
          <div
            v-for="(item, index) in items"
            :class="{ 'menu__item': true, 'menu__item--alternative': alternative }"
            :style="{
              'animation-delay': `${0.05 * index}s`,
              'animation-timing-function': getTimingFunction()
            }"
            @click="menuItemClick(item)"
          >
            {{ $text(item.label) }}
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import menu from './menu.mixin';
  import './menu.scss';

  export default {
    name: "game-menu",
    mixins: [menu],
    props: {
      alternative: {
        type: Boolean,
        default: false,
      }
    },
  }
</script>

<style lang="scss">
</style>