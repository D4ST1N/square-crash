import $event from './events';

export default {
  init() {
    $event.$on('changeLocale', this.change);
  },

  change(locale) {
    localStorage.setItem('locale', locale);
    location.reload();
  },
}