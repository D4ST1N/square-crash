<template>
  <div class="change-control-modal">
    <modal
      :title="$text('CONTROL_SETTINGS.CHANGE_CONTROL.TITLE')"
      :show="show"
      @onHide="hideModal"
    />
  </div>
</template>

<script>
  import modal   from './modal';

  export default {
    name: "change-control-modal",
    components: {
      modal,
    },
    props: {
      changedKey: {
        type: String,
      },
      showChangeModal: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        show: this.showChangeModal,
      };
    },

    watch: {
      showChangeModal() {
        if (this.showChangeModal) {
          this.show = true;
          document.body.addEventListener('keydown', this.handleKeyDown);
        } else {
          this.show = false;
          document.body.removeEventListener('keydown', this.handleKeyDown);
        }
      }
    },

    methods: {
      handleKeyDown(e) {
        this.$emit('keyPressed', this.changedKey, e.code);
        this.hideModal();
      },

      showModal() {
        this.show = true;
      },

      hideModal() {
        this.show = false;
      },
    },
  }
</script>

<style scoped>

</style>