<template>
  <div class="scoreboard">
    <span class="scoreboard__score">{{ $text('UI.SCORE') }}: {{ toFixed(score) }}</span>
    <span class="scoreboard__score">{{ $text('UI.HIGH_SCORE') }}: {{ toFixed(highScore) }}</span>
  </div>
</template>

<script>
  import $event from '../resources/utils/events';
  import toFixed from '../resources/utils/toFixed';

  export default {
    name: 'ScoreBoard',

    data() {
      return {
        score: 0,
        highScore: 0,
      }
    },

    mounted() {
      this.setInitialHighScore();
      $event.$on('scoreGained', this.scoreGain);
      $event.$on('restartGame', this.resetScore);
    },

    methods: {
      toFixed,

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
          version: APPLICATION_VERSION,
        }));
      },

      setInitialHighScore() {
        // TODO get high score from server
        const highScoreStore = localStorage.getItem('highScore');

        if (highScoreStore) {
          const highScoreData = JSON.parse(highScoreStore);

          console.log(highScoreData.version, APPLICATION_VERSION);
          if (highScoreData.version === APPLICATION_VERSION) {
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