<template>
  <div class="tutorial">
    <modal
      :title="$text('BONUS.POPUP.TITLE')"
      :show="show"
      :left="modalLeft"
      :top="modalTop"
      ref="modal"
      @onHide="hideModal"
    >
      <p slot="content">
        {{ $text(`BONUS.DESCRIPTION.${name.toUpperCase()}`) }}
      </p>
      <button ref="ok" slot="footer" class="button" autofocus @click="hideModal">{{ $text('BONUS.POPUP.TITLE') }}</button>
    </modal>
  </div>
</template>

<script>
  import modal  from './modal';
  import $event from '../../resources/utils/events';

  export default {
    name: "tutorial",
    components: {
      modal,
    },

    data() {
      return {
        show: false,
      };
    },

    mounted() {
      $event.$on('showTutorial', this.showModal);
    },

    showModal() {
      this.show = true;
    },

    hideModal() {
      this.show = false;
    },
  }
</script>

<style scoped>

</style>