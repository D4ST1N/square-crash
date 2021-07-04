<template>
  <div class="fps">{{ fpsScore }} FPS</div>
</template>

<script>
  export default {
    name: "fps",
    props: {
      fps: Number
    },

    data() {
      return {
        fpsScore: this.fps,
      };
    },

    watch: {
      fps() {
        if (Math.abs(this.fps - this.fpsScore) > 3) {
          this.fpsScore = this.fps;
        }
      }
    }
  };
</script>

<style scoped>
  .fps {
    position: fixed;
    top: 100px;
    left: calc(50% - 50px);
    text-align: center;
    width: 100px;
  }
</style>