<template>
  <div class="game-over-modal">
    <modal
      :title="$text('GAME_OVER.TITLE')"
      :content="$text('GAME_OVER.CONTENT')"
      :show="show"
      @onHide="hideModal"
    >
      <p slot="content">
        {{ $text('GAME_OVER.SCORE') }}: {{ score }}
      </p>
      <button ref="restart" slot="footer" class="button" @click="restart">{{ $text('GAME_OVER.BUTTON') }}</button>
    </modal>
  </div>
</template>

<script>
  import modal from './modal';
  import $event from '../../resources/utils/events';

  export default {
    name: "game-over-modal",
    components: {
      modal,
    },

    data() {
      return {
        score: 0,
        show: false,
      };
    },

    mounted() {
      $event.$on('scoreChanged', this.setScore);
      $event.$on('playerDeath', this.showModal);
    },

    methods: {
      setScore(score) {
        this.score = score;
      },

      showModal() {
        this.show = true;
        this.$nextTick(() => {
          this.$refs.restart.focus();
        })
      },

      hideModal() {
        this.show = false;
      },

      restart() {
        this.$emit('restartGame');
        $event.$emit('restartGame');
        this.hideModal();
      },
    },
  }
</script>

<style scoped>

</style>