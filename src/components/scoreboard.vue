<template>
  <div class="scoreboard">
    <span class="scoreboard__score">Score: {{ score }}</span>
    <span class="scoreboard__score">High Score: {{ highScore }}</span>
  </div>
</template>

<script>
  import $event from '../resources/utils/events';

  export default {
    name: 'scoreboard',

    data() {
      return {
        score: 0,
        highScore: 0,
      }
    },

    mounted() {
      this.setInitialHighScore();
      $event.$on('scoreGained', this.scoreGain);
      $event.$on('gameRestart', this.resetScore);
    },
    
    methods: {
      resetScore() {
        this.score = 0;
      },

      scoreGain(score) {
        this.score += score;
        $event.$emit('scoreChanged', this.score);

        if (this.score > this.highScore) {
          this.highScore = this.score;
          this.setHighScore();
        }
      },

      setHighScore() {
        localStorage.setItem('highScore', JSON.stringify({
          score:   this.highScore,
          version: this.$root.version,
        }));
      },

      setInitialHighScore() {
        // TODO get high score from server
        const highScoreStore = localStorage.getItem('highScore');

        if (highScoreStore) {
          const highScoreData = JSON.parse(highScoreStore);

          if (highScoreData.version === this.$root.version) {
            this.highScore = highScoreData.score;
          }
        }

        this.setHighScore();
      },
    },
  }
</script>

<style scoped>
  .scoreboard {
    position: fixed;
    top: 10px;
    right: 10px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    font-size: 32px;
    font-weight: 600;
    opacity: 0.5;
  }
</style>