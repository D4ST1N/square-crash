export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
    },
    content: {
      type: String,
    },
    wide: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      isWindowShow: this.show,
    };
  },

  watch: {
    show() {
      this.isWindowShow = this.show;

      if (this.show) {
        this.$emit('onShow');
      } else {
        this.$emit('onHide');
      }
    },
  },

  methods: {
    showWindow() {
      this.isWindowShow = true;
      this.$emit('onShow');
    },

    hideWindow() {
      this.isWindowShow = false;
      this.$emit('onHide');
    },
  },
};
