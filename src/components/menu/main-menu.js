import $event from '../../resources/utils/events';

export default [
  // {
  //   label: 'MAIN_MENU.PLAYER',
  // },
  {
    label: 'MAIN_MENU.ACHIEVEMENTS',
  },
  {
    label: 'MAIN_MENU.LOCALE',

    action() {
      this.hideMenu();
      $event.$emit('showLocaleMenu');
    },
  },
  {
    label: 'MAIN_MENU.CLOSE',

    action() {
      this.hideMenu();
    },
  },
]