<template>
  <div class="game-over-modal">
    <modal
      title="Oh, hell!"
      content="You're die! But you can start again!"
      :show="show"
      @onHide="hideModal"
    >
      <p slot="content">
        Your score: {{ score }}
      </p>
      <button slot="footer" class="button" @click="restart">Start Again!</button>
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
      },

      hideModal() {
        this.show = false;
      },

      restart() {
        this.$emit('restartGame');
        $event.$emit('restartGame');
      },
    },
  }
</script>

<style scoped>

</style>