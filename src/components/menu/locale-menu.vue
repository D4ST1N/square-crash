<template>
  <div class="locale-menu">
    <gameMenu
      :items="menuItems"
      :show="show"
      :alternative="alternative"
      @onHide="hideMenu"
      @inverse="inverse"
    />
  </div>
</template>

<script>
  import gameMenu   from './game-menu';
  import getLocales from '../../resources/utils/getLocales';
  import $event     from '../../resources/utils/events';

  export default {
    name: "locale-menu",
    components: {
      gameMenu,
    },

    data() {
      return {
        menuItems: [],
        show: false,
        alternative: false,
      };
    },

    mounted() {
      $event.$on('showLocaleMenu', this.showMenu);
      this.menuItems = getLocales().map(locale => ({
        label: this.$text('CURRENT_LOCALE', locale),

        action() {
          $event.$emit('changeLocale', locale);
          this.hideMenu();
        },
      }));
      this.menuItems.push({
        label: 'LOCALE_MENU.BACK',

        action() {
          this.$emit('inverse');
          this.$nextTick(() => {
            this.hideMenu();
            $event.$emit('showMainMenu');
          });
        },
      });
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
        this.show = false;
      },
    },
  };
</script>

<style scoped>

</style>