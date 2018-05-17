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
  },

  data() {
    return {
      isWindowShow: this.show,
    };
  },

  watch: {
    show() {
      this.isWindowShow = this.show;
      this.$emit('onToggle', this.isWindowShow);
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
