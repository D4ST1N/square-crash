<template>
  <div id="app">
    <canvas id="field" class="field"></canvas>
    <canvas id="buffer" class="field--buffer"></canvas>
    <!--<fps :fps="fps"/>-->
    <scoreboard />
    <playerStatus :player="player" />
    <mainMenu />
    <localeMenu />
    <achievementProgress />
    <gameOverModal @restartGame="restart" />
    <bonusDescription :player="player"/>
    <achievement />
  </div>
</template>

<script>
  import Player              from './entities/player';
  import Text                from './entities/text';
  import playerData          from './mock-data/player';
  import enemiesData         from './mock-data/enemies';
  import bonusesData         from './mock-data/bonuses';
  import keysData            from './mock-data/keys';
  import scoreboard          from './components/scoreboard';
  import gameOverModal       from './components/subwindow/game-over-modal';
  import bonusDescription    from './components/subwindow/bonus-description';
  import playerStatus        from './components/player-status';
  import mainMenu            from './components/main-menu';
  import localeMenu            from './components/menu/locale-menu';
  import fps                   from './components/fps';
  import achievement           from './components/achievement';
  import achievementProgress   from './components/subwindow/achievement-progress';
  import $event                from './resources/utils/events';
  import resources             from './resources/utils/resources';
  import achievements          from './resources/achievements';
  import toFixed               from './resources/utils/toFixed';
  import getAchievementsStatus from './resources/utils/getAchievementsStatus';
  import gameStats             from './resources/utils/gameStats';
  import './assets/styles/buttons.scss';

  export default {
    name:       'app',
    components: {
      scoreboard,
      gameOverModal,
      playerStatus,
      bonusDescription,
      mainMenu,
      localeMenu,
      fps,
      achievement,
      achievementProgress,
    },

    data() {
      return {
        canvas:         undefined,
        ctx:            undefined,
        buffer:         undefined,
        bctx:           undefined,
        gameTick:       undefined,
        lastTime:       undefined,
        raf:            undefined,
        player:         undefined,
        enemies:        [],
        bonuses:        [],
        texts:          [],
        tasks:          [],
        keys:           keysData,
        scaleActivated: false,
        isPaused:       false,
        scaleCount:     0,
        fps:            60,
        bonusSpawned:   false,
        coinCount:      0,
        enemiesCount:   0,
        pickedBonuses:  [],
        enemyKilled:    false,
      };
    },

    created() {
      resources.load({
        name: 'bg',
        url: 'img/bg.png'
      });
    },

    mounted() {
      this.lastTime = performance.now();
      this.init();
      gameStats.init();
      this.start();
      bonusesData.loadTextures();
      $event.$on('enemyKill', this.enemyKill);
      $event.$on('scoreGained', this.createGainedScore);
      $event.$on('plannedTask', this.addTask);
      $event.$on('pauseGame', this.pause);
      $event.$on('continueGame', this.continue);
      $event.$on('bonusSpawned', () => this.bonusSpawned = true);
      $event.$on('levelUp', this.onLevelUp);
      $event.$on('coinPicked', this.onCoinPicked);
      $event.$on('bonusPicked', this.onBonusPicked);
      $event.$on('expChanged', this.onExpChanged);

      if (getAchievementsStatus('gandhi')) {
        setTimeout(() => {
          if (this.player.level === 1 && this.player.experience === 0) {
            bonusesData.spawnBonus(this.player, bonusesData.getBonusData('knowledge'));
          }
        }, 111111);
      }
    },

    methods:    {
      onLevelUp(level) {
        if (level === 10) {
          $event.$emit('achievementUnlocked', achievements.get('in ten'));
        }

        if (level === 2 && !this.enemyKilled) {
          $event.$emit('achievementUnlocked', achievements.get('gandhi'));
        }

        if (level === 3 && this.bonusSpawned === false) {
          $event.$emit('achievementUnlocked', achievements.get('lucky'));
        }
      },

      onCoinPicked() {
        this.coinCount += 1;

        if (this.coinCount === 13) {
          $event.$emit('achievementUnlocked', achievements.get('devils dozen'));
        }
      },

      onBonusPicked(bonusName) {
        gameStats.set('totalBonusesPicked', 1);
        gameStats.set(`${bonusName}Total`, 1);

        if (!this.pickedBonuses.includes(bonusName)) {
          this.pickedBonuses.push(bonusName);
        }

        if (this.pickedBonuses.length === 6) {
          $event.$emit('achievementUnlocked', achievements.get('thanos'));
        }
      },

      onExpChanged(exp) {
        if (exp === 3.14) {
          $event.$emit('achievementUnlocked', achievements.get('euclid'));
        }
      },

      enemyKill(enemy, isSafe) {
        this.enemyKilled = true;
        gameStats.set('totalEnemyKilled', 1);

        if (gameStats.get('totalEnemyKilled') === 100) {
          $event.$emit('achievementUnlocked', achievements.get('jason'));
        }

        bonusesData.checkBonusSpawn.call(bonusesData, this.player);

        if (this.player.playerImmune && this.player.magnetEnabled) {
          if (!isSafe) {
            this.enemiesCount += 1;

            if (this.enemiesCount === 30) {
              $event.$emit('achievementUnlocked', achievements.get('leeroy jenkins'));
            }
          }
        } else {
          this.enemiesCount = 0;
        }
      },

      addTask(options) {
        const existedTask = this.tasks.filter(task => task.name === options.name)[0];
        options.time = Array.apply(null, Array(this.player.level))
                            .reduce(sum => sum += sum * 0.1, options.time);

        if (existedTask) {
          existedTask.time += options.time;
        } else {
          this.tasks.push(Object.assign({}, options, { start: performance.now() }));
        }
      },

      createGainedScore(score, pos) {
        this.texts.push(new Text({
          pos,
          speed: 1,
          size:  24,
          color: 'rgba(3,169,244 ,.6)',
          text:  `+ ${toFixed(score)}`,
        }));
      },

      renderBackground() {
        const bg = resources.get('bg');
        this.ctx.fillStyle = '#cbe0ea';
        this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

        if (bg) {
          const offsetX = this.player.getOffset().x / 3;
          const offsetY = this.player.getOffset().y / 3;
          this.bctx.fillStyle = this.bctx.createPattern(bg, 'repeat');
          this.ctx.globalAlpha = 0.5;
          this.bctx.translate(-offsetX, -offsetY);
          this.bctx.fillRect(offsetX, offsetY, window.innerWidth, window.innerHeight);
          this.bctx.translate(offsetX, offsetY);
          this.ctx.drawImage(this.buffer, 0, 0);
          this.bctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
          this.bctx.restore();
          this.ctx.globalAlpha = 1;
        }
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
          this.ctx.arc(circle.pos.x - offsetX, circle.pos.y - offsetY, circle.size, 0, 2 * Math.PI);
          this.ctx.closePath();
          this.ctx.clip();
          this.ctx.drawImage(
            circle.pattern,
            circle.pos.x - circle.size - offsetX,
            circle.pos.y - circle.size - offsetY,
          );
          this.ctx.beginPath();
          this.ctx.arc(circle.pos.x - offsetX, circle.pos.y - offsetY, circle.size, 0, 2 * Math.PI);
          this.ctx.closePath();
        } else {
          this.ctx.fillStyle = circle.color;
          this.ctx.beginPath();
          this.ctx.arc(circle.pos.x - offsetX, circle.pos.y - offsetY, circle.size, 0, 2 * Math.PI);
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

      renderImage(pos, size, image, isFixed = false) {
        let offsetX = 0;
        let offsetY = 0;

        if (isFixed === false) {
          offsetX = this.player.getOffset().x;
          offsetY = this.player.getOffset().y;
        }

        this.ctx.save();
        this.ctx.globalAlpha = 0.8;
        this.ctx.drawImage(image, pos.x - offsetX, pos.y - offsetY, size, size);
        this.ctx.restore();
      },

      renderUIImage(image, pos, size) {
        this.ctx.globalAlpha = 0.75;
        this.ctx.drawImage(image, pos.x, pos.y, size.width, size.height);
        this.ctx.restore();
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
        if ((this.canvas.height / this.player.size < 10
            || this.canvas.width / this.player.size < 10)
            && this.scaleActivated === false
        ) {
          this.scaleCount = 40;
          this.scaleActivated = true;
        }

        if (this.scaleActivated === true) {
          this.player.scale(0.973);
          this.enemies.forEach(enemy => enemy.scale(0.973));
          this.scaleCount -= 1;

          if (this.scaleCount === 0) {
            this.scaleActivated = false;
          }
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
              text:  `${toFixed((task.time - timePass) / 1000, 1)}s`,
            }),
          },
        );
      },

      init() {
        this.canvas        = document.getElementById('field');
        this.ctx           = this.canvas.getContext('2d');
        this.buffer        = document.getElementById('buffer');
        this.bctx          = this.buffer.getContext('2d');
        this.canvas.width  = window.innerWidth;
        this.canvas.height = window.innerHeight - 4;
        this.buffer.width  = window.innerWidth;
        this.buffer.height = window.innerHeight - 4;
        this.player        = new Player(playerData.getData());
        document.body.addEventListener('keydown', this.handleKeyDown);
        document.body.addEventListener('keyup', this.handleKeyUp);
      },

      start() {
        this.isPaused = false;
        this.main(performance.now());
      },

      pause() {
        this.isPaused = true;
      },

      continue() {
        this.isPaused = false;
        cancelAnimationFrame(this.raf);
        this.main(performance.now());
      },

      restart() {
        this.player = new Player(playerData.getData());
        enemiesData.clear();
        bonusesData.clear();
        this.texts = [];
        this.tasks = [];
      },

      main(now) {
        if (this.isPaused === false) {
          this.gameTick = now - this.lastTime;
          const delta = this.gameTick / 1000;
          this.fps = Math.round(1 / delta);
          this.lastTime = now;
          this.update(now);
          this.render(now);
          this.tasks.forEach(this.checkTasks);
          this.raf = requestAnimationFrame(this.main);
        }
      },

      update(now) {
        this.checkPlayerSize();
        this.enemies = enemiesData.getEnemies(this.player, now);
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
        this.renderBackground();
        this.enemies.forEach(enemy => this.renderRectangle(enemy));

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

        if (this.player.playerImmune) {
          this.renderImage(
            this.player.pos,
            this.player.size,
            resources.get('player shield'),
          );
        }

        this.bonuses.forEach(bonus => this.renderCircle(bonus));
        this.texts.forEach(text => this.renderText(text));
        this.tasks.forEach((task) => {
          this.renderRectangle(task, true);
          this.renderText(task.text, true);

          if (task.size) {
            this.renderUIImage(
              resources.get(task.name),
              {
                x: task.size.width,
                y: task.pos.y - 5,
              },
              {
                width: 30,
                height: 30,
              },
            );
          }
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

  .field--buffer {
    display: none;
  }
</style>
