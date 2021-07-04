<template>
  <div class="player-status">
    <div class="player-status__wrapper">
      <div v-if="player" class="player-status__level">{{ player.level }}</div>
      <canvas class="player-status__experience-progress" ref="field" width="60" height="60"></canvas>
    </div>
    <div v-if="player" class="player-status__experience">
      {{ toFixed(player.experience) }} / {{ player.playerExperienceTable[player.level] }}
    </div>
  </div>
</template>

<script>
  import $event  from '../resources/utils/events';
  import toFixed from '../resources/utils/toFixed';

  export default {
    name: "player-status",
    props: {
      player: {
        type: Object,
      },
    },

    data() {
      return {
        ctx: undefined,
      };
    },

    watch: {
      player() {
        this.drawBaseCircle();
        this.drawTotalExperience();
      },
    },

    mounted() {
      this.ctx = this.$refs.field.getContext('2d');
      $event.$on('expChanged', () => {
        this.drawBaseCircle();
        this.drawTotalExperience();
      });
    },

    methods: {
      toFixed,

      drawBaseCircle() {
        this.ctx.clearRect(0, 0, 60, 60);
        this.ctx.beginPath();
        this.ctx.arc(30, 30, 25, 0, 2 * Math.PI);
        this.ctx.strokeStyle = 'rgba(209,196,233 ,1)';
        this.ctx.lineWidth = 5;
        this.ctx.stroke();
      },

      drawTotalExperience() {
        const expNeeded = this.player.playerExperienceTable[this.player.level];
        const percent = -0.5 + (this.player.experience / expNeeded * 100) / 50;
        this.ctx.beginPath();
        this.ctx.arc(30, 30, 25, -0.5 * Math.PI, percent * Math.PI);
        this.ctx.strokeStyle = 'rgba(142,36,170 ,1)';
        this.ctx.lineWidth = 5;
        this.ctx.stroke();
      },
    },
  };
</script>

<style lang="scss">
  .player-status {
    position: fixed;
    top: 10px;
    left: 0;
    right: 0;

    &__wrapper {
      display: inline-flex;
      width: 50px;
      height: 50px;
      padding: 5px;
      position: relative;
    }

    &__experience {
      margin-top: 10px;
      text-align: center;
    }

    &__level {
      display: inline-flex;
      width: 50px;
      height: 50px;
      align-items: center;
      justify-content: center;
      background: rgba(30,136,229 ,1);
      border-radius: 50%;
      font-size: 32px;
      color: rgba(255, 255, 255, 1);
    }

    &__experience-progress {
      position: absolute;
      width: 60px;
      height: 60px;
      top: 0;
      left: 0;
    }
  }
</style>