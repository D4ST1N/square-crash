<template>
  <div id="app">
    <canvas id="field"></canvas>
  </div>
</template>

<script>
  import Player      from './entities/player';
  import playerData  from './mock-data/player';
  import enemiesData from './mock-data/enemies';
  import keysData    from './mock-data/keys';
  import $event      from './resources/utils/events';

  export default {
    name:    'app',
    data() {
      return {
        canvas:   undefined,
        ctx:      undefined,
        gameTick: undefined,
        lastTime: undefined,
        raf:      undefined,
        player:   undefined,
        enemies:  [],
        keys:     keysData,
      };
    },
    mounted() {
      this.lastTime = performance.now();
      this.init();
      this.start();
      $event.$on('scoreGained', (score) => {
        console.log(score);
      });
    },
    methods: {
      renderEntity(entity) {
        this.ctx.fillStyle = entity.color;
        this.ctx.fillRect(
          entity.pos.x,
          entity.pos.y,
          typeof entity.size === 'object' ? entity.size.width : entity.size,
          typeof entity.size === 'object' ? entity.size.height : entity.size
        );

        if (entity.border) {
          this.ctx.strokeStyle = entity.border;
          this.ctx.strokeRect(
            entity.pos.x,
            entity.pos.y,
            entity.size,
            entity.size
          );
        }
      },
      handleKeyDown(e) {
        if (Object.prototype.hasOwnProperty.call(this.keys, e.key)) {
          this.keys[e.key].pressed = true;
        }
      },
      handleKeyUp(e) {
        if (Object.prototype.hasOwnProperty.call(this.keys, e.key)) {
          this.keys[e.key].pressed = false;
        }
      },
      checkPlayerSize() {
        if (this.canvas.height / this.player.size < 10
            || this.canvas.width / this.player.size < 10
        ) {
          this.player.scale(3);
          this.enemies.forEach(enemy => enemy.scale(3));
        }
      },
      init() {
        this.canvas        = document.getElementById('field');
        this.ctx           = this.canvas.getContext('2d');
        this.canvas.width  = window.innerWidth;
        this.canvas.height = window.innerHeight - 4;
        this.player        = new Player(playerData.getData());
      },
      start() {
        this.main(performance.now());
      },
      main(now) {
        this.gameTick = now - this.lastTime;
        this.lastTime = now;
        this.update();
        this.render(now);
        this.raf = requestAnimationFrame(now => this.main(now));
        document.body.addEventListener('keydown', this.handleKeyDown);
        document.body.addEventListener('keyup', this.handleKeyUp);
      },
      update() {
        this.checkPlayerSize();
        this.enemies = enemiesData.getEnemies(this.player);
        this.player.checkMoving(this.keys);
      },
      render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.enemies.forEach(enemy => this.renderEntity(enemy));
        this.renderEntity(this.player);
      },
    },
  }
</script>

<style>
body {
  margin: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #cbe0ea;
  display: flex;
  flex-direction: column;
}
</style>
