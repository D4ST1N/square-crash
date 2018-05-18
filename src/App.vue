<template>
  <div id="app">
    <canvas id="field"></canvas>
    <scoreboard :count="enemies.length" :player="player"/>
    <gameOverModal @restartGame="restart" />
  </div>
</template>

<script>
  import Player        from './entities/player';
  import Text          from './entities/text';
  import playerData    from './mock-data/player';
  import enemiesData   from './mock-data/enemies';
  import bonusesData   from './mock-data/bonuses';
  import keysData      from './mock-data/keys';
  import scoreboard    from './components/scoreboard';
  import gameOverModal from './components/subwindow/game-over-modal';
  import $event        from './resources/utils/events';
  import './assets/styles/buttons.scss';

  export default {
    name:       'app',
    components: {
      scoreboard,
      gameOverModal,
    },

    data() {
      return {
        canvas:   undefined,
        ctx:      undefined,
        gameTick: undefined,
        lastTime: undefined,
        raf:      undefined,
        player:   undefined,
        enemies:  [],
        bonuses:  [],
        texts:    [],
        tasks:    [],
        keys:     keysData,
      };
    },

    mounted() {
      this.lastTime = performance.now();
      this.init();
      this.start();
      bonusesData.loadTextures();
      $event.$on('enemyKill', bonusesData.checkBonusSpawn.bind(bonusesData));
      $event.$on('scoreGained', this.createGainedScore);
      $event.$on('plannedTask', this.addTask);
    },

    methods:    {
      addTask(options) {
        const existedTask = this.tasks.filter(
          task => task.name === options.name,
        )[0];

        if (existedTask) {
          existedTask.time += options.time;
        } else {
          this.tasks.push(Object.assign(
            {},
            options,
            {
              start: performance.now(),
            },
          ));
        }
      },

      createGainedScore(score, pos) {
        this.texts.push(new Text({
          pos,
          speed: 1,
          size:  24,
          color: 'rgba(255, 255, 255, 0.6)',
          text:  `+ ${score}`,
        }));
      },

      renderRectangle(rect, isFixed = false) {
        if (typeof rect.pos !== 'object') {
          return;
        }

        let offsetX = 0;
        let offsetY = 0;

        if (!isFixed) {
          offsetX = this.player.getOffset().x;
          offsetY = this.player.getOffset().y;
        }

        this.ctx.save();
        this.ctx.fillStyle = rect.color;
        this.ctx.fillRect(
          rect.pos.x - offsetX,
          rect.pos.y - offsetY,
          typeof rect.size === 'object' ? rect.size.width : rect.size,
          typeof rect.size === 'object' ? rect.size.height : rect.size,
        );

        if (rect.border) {
          this.ctx.strokeStyle = rect.border;
          this.ctx.strokeRect(
            rect.pos.x - offsetX,
            rect.pos.y - offsetY,
            rect.size,
            rect.size,
          );
        }

        this.ctx.restore();
      },

      renderCircle(circle, isFixed = false) {
        let offsetX = 0;
        let offsetY = 0;

        if (!isFixed) {
          offsetX = this.player.getOffset().x;
          offsetY = this.player.getOffset().y;
        }

        this.ctx.save();

        if (circle.pattern) {
          this.ctx.beginPath();
          this.ctx.arc(
            circle.pos.x - offsetX,
            circle.pos.y - offsetY,
            circle.size,
            0,
            2 * Math.PI,
          );
          this.ctx.closePath();
          this.ctx.clip();
          this.ctx.drawImage(
            circle.pattern,
            circle.pos.x - circle.size - offsetX,
            circle.pos.y - circle.size - offsetY,
          );
          this.ctx.beginPath();
          this.ctx.arc(
            circle.pos.x - offsetX,
            circle.pos.y - offsetY,
            circle.size,
            0,
            2 * Math.PI,
          );
          this.ctx.closePath();
        } else {
          this.ctx.fillStyle = circle.color;
          this.ctx.beginPath();
          this.ctx.arc(
            circle.pos.x - offsetX,
            circle.pos.y - offsetY,
            circle.size,
            0,
            2 * Math.PI,
          );
          this.ctx.fill();
        }

        this.ctx.restore();
      },

      renderText(text, isFixed = false) {
        if (!text || typeof text.pos !== 'object') {
          return;
        }

        let offsetX = 0;
        let offsetY = 0;

        if (!isFixed) {
          offsetX = this.player.getOffset().x;
          offsetY = this.player.getOffset().y;
        }

        this.ctx.font      = text.font;
        this.ctx.fillStyle = text.color;
        this.ctx.fillText(text.text, text.pos.x - offsetX, text.pos.y - offsetY);
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

      checkTasks(task, index) {
        const timePass = performance.now() - task.start;

        if (timePass >= task.time) {
          task.callback(this.player);
          this.tasks.splice(index, 1);
        }

        this.setProgressOptions(task, index, timePass);
      },

      setProgressOptions(task, index, timePass) {
        const percent = timePass / task.time;
        const maxWidth = this.canvas.width - 40;
        const pos = {
          x: 20,
          y: this.canvas.height - 30 * (index + 1),
        };

        Object.assign(
          task,
          {
            pos,
            size: {
              width:  maxWidth - Math.min(maxWidth * percent, maxWidth),
              height: 20,
            },
            text: new Text({
              pos:   {
                x: pos.x + 5,
                y: pos.y + 16,
              },
              size:  18,
              color: 'rgba(255, 255, 255, 0.6)',
              text:  `${((task.time - timePass) / 1000).toFixed(1)}s`,
            }),
          },
        );
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

      restart() {
        this.player = new Player(playerData.getData());
        enemiesData.clear();
        bonusesData.clear();
        this.texts = [];
      },

      main(now) {
        this.gameTick = now - this.lastTime;
        this.lastTime = now;
        this.update();
        this.render(now);
        this.tasks.forEach(this.checkTasks);
        this.raf = requestAnimationFrame(now => this.main(now));
        document.body.addEventListener('keydown', this.handleKeyDown);
        document.body.addEventListener('keyup', this.handleKeyUp);
      },

      update() {
        this.checkPlayerSize();
        this.enemies = enemiesData.getEnemies(this.player);
        this.bonuses = bonusesData.getBonuses(this.player);
        this.texts.forEach((text, index) => {
          text.time -= this.gameTick;

          if (text.time <= 0) {
            this.texts.splice(index, 1);
          }

          text.moveUp();
        });
        this.player.checkMoving(this.keys);
      },

      render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.enemies.forEach(enemy => this.renderRectangle(enemy));
        this.bonuses.forEach(bonus => this.renderCircle(bonus));

        if (this.player.magnetEnabled) {
          this.renderCircle({
            pos:   {
              x: this.player.pos.x + this.player.size / 2,
              y: this.player.pos.y + this.player.size / 2,
            },
            size:  this.player.magnetArea(),
            color: this.player.magnetAreaColor,
          });
        }

        this.renderRectangle(this.player);
        this.texts.forEach(text => this.renderText(text));
        this.tasks.forEach((task) => {
          this.renderRectangle(task, true);
          this.renderText(task.text, true);
        });
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
