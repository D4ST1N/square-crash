<template>
  <div class="main-menu">
    <button class="main-menu__button" @click="showMenu"></button>
    <gameMenu :items="menuItems" :show="show" @onHide="hideMenu" :alternative="alternative"/>
  </div>
</template>

<script>
  import gameMenu  from './menu/game-menu';
  import menuItems from './menu/main-menu';
  import $event    from '../resources/utils/events';

  export default {
    name: "main-menu",
    components: {
      gameMenu,
    },

    data() {
      return {
        menuItems,
        show: false,
        alternative: false,
      };
    },

    mounted() {
      $event.$on('showMainMenu', this.showMenu);
      $event.$on('inverseMainMenu', this.inverse);
    },

    methods: {
      inverse() {
        this.alternative = !this.alternative;
      },

      showMenu(alternative) {
        if (typeof alternative !== 'boolean') {
          alternative = false
        }

        this.alternative = alternative;
        this.show = true;
      },

      hideMenu() {
        this.alternative = false;
        this.show = false;
      },
    }
  };
</script>

<style scoped lang="scss">
  .main-menu {

    &__button {
      position: fixed;
      top: 15px;
      left: 15px;
      width: 40px;
      height: 40px;
      background: transparent url("../assets/img/menu.png") no-repeat center;
      background-size: contain;
      border: 0;
      cursor: pointer;
      opacity: .75;
      transition: all .375s;

      &:hover {
        opacity: 1;
        top: 10px;
        left: 10px;
        width: 50px;
        height: 50px;
      }
    }
  }
</style>