import randomInt from '../../resources/utils/randomInt';

export default {
  props: {
    items: {
      type: Array,
      default: false,
    },
    show: {
      type: Boolean
    }
  },

  data() {
    return {
      timingFunctions: ['ease', 'ease-in', 'ease-out', 'ease-in-out'],
      isMenuShow: this.show,
    }
  },

  watch: {
    show() {
      this.isMenuShow = this.show;

      if (this.isMenuShow) {
        this.$emit('onShow');
      } else {
        this.$emit('onHide');
      }
    },
  },

  methods: {
    getTimingFunction() {
      return this.timingFunctions[randomInt(0, this.timingFunctions.length - 1)];
    },

    menuItemClick(item) {
      if (item.action && typeof item.action === 'function') {
        item.action.call(this, item);
      }
    },

    showMenu() {
      this.isMenuShow = true;
      this.$emit('onShow');
    },

    hideMenu() {
      this.isMenuShow = false;
      this.$emit('onHide');
    },
  }
}