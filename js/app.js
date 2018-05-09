const Game = {
  initialParams: {
    playerSize: 30,
    playerSpeed: 5,
    playerColor: 'rgba(33, 150, 243, 1)',
  },
  gameConstants: {
    canvasBorderWidth: 5,
    enemySpawnChance: 5,
    coinSpawnChance: 0.05,
    coinColor: 'rgba(255,235,59 ,.4)',
    coinBorderColor: 'rgba(251,192,45 ,1)',
    saveColor: 'rgba(129, 199, 132, .25)',
    saveBorderColor: 'rgba(67,160,71 ,1)',
    warningColor: 'rgba(255, 183, 77, .25)',
    warningBorderColor: 'rgba(251,140,0 ,1)',
    dangerousColor: 'rgba(255, 87, 34, .25)',
    dangerousBorderColor: 'rgba(244,81,30 ,1)',
  },
  keys: {
    37: {
      pressed: false
    },
    38: {
      pressed: false
    },
    39: {
      pressed: false
    },
    40: {
      pressed: false
    },
  },
  isPressed: false,
  scaleCoefficient: 1,
  enemyMaxNumber: 20,
  fps: 0,
  score: 0,
  oldScore: 0,
  highScore: 0,
  player: {},
  enemies: [],
  coins: [],
  scores: [],
  canvas: undefined,
  scoreBoard: undefined,
  highScoreBoard: undefined,
  gameTick: undefined,
  lastTime: performance.now(),
  fpsBoard: document.querySelector('.fps'),
  ctx: undefined,
  gameOverPopup: document.querySelector('.game-over'),
  gameOverScoreBoard: document.querySelector('.game-over__score'),
  gameOverRestartButton: document.querySelector('.game-over__restart'),
  randomNumber(min = 0, max = 100) {
    return Math.random() * (max - min) + min;
  },
  randomInt(...args) {
    return Math.round(this.randomNumber(...args));
  },
  getMousePosition(event) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: event.clientX || event.changedTouches[0].pageX - rect.left,
      y: event.clientY || event.changedTouches[0].pageY - rect.top
    };
  },
  createEnemy(save = false) {
    const minSize = Math.round(this.player.size * 0.10);
    const maxCoefficient = Math.pow(0.8, this.scaleCoefficient);
    const maxSize = save ? Math.round(this.player.size * 0.65) : Math.round(this.player.size * (1 / maxCoefficient));
    const enemySize = this.randomInt(minSize, maxSize);
    const enemy = {
      pos:  {
        x: this.randomInt(0, this.canvas.width - enemySize),
        y: this.randomInt(0, this.canvas.height - enemySize),
      },
      moveTo: {
        x: this.randomInt(0, this.canvas.width - enemySize),
        y: this.randomInt(0, this.canvas.height - enemySize),
      },
      size: enemySize,
      speed: 0.25 * this.scaleCoefficient,
    };

    while (this.testCollision(this.player, enemy)) {
      enemy.pos.x = this.randomInt(0, this.canvas.width - enemySize);
      enemy.pos.y = this.randomInt(0, this.canvas.width - enemySize);
    }

    const difference = this.checkSizeDifference(enemy);

    if (difference === 'save') {
      enemy.color = this.gameConstants.saveColor;
      enemy.borderColor = this.gameConstants.saveBorderColor;
    } else if (difference === 'dangerously') {
      enemy.color = this.gameConstants.dangerousColor;
      enemy.borderColor = this.gameConstants.dangerousBorderColor;
    } else {
      enemy.color = this.gameConstants.warningColor;
      enemy.borderColor = this.gameConstants.warningBorderColor;
    }

    this.enemies.push(enemy);
  },
  createCoin() {
    const coin = {
      pos:  {
        x: this.randomInt(0, this.canvas.width - 40),
        y: this.randomInt(0, this.canvas.height - 40),
      },
      color: this.gameConstants.coinColor,
      borderColor: this.gameConstants.coinBorderColor,
      size: 20,
    };
    this.coins.push(coin);
  },
  createPlayer() {
    this.player = {
      color: this.initialParams.playerColor,
      size: this.initialParams.playerSize,
      speed: this.initialParams.playerSpeed,
      pos: {
        x: this.randomInt(0, this.canvas.width - this.initialParams.playerSize),
        y: this.randomInt(0, this.canvas.height - this.initialParams.playerSize)
      }
    };
  },
  createScore({ x, y, score }) {
    this.scores.push(
      {
        text: `+${score}`,
        pos: {
          x,
          y,
        },
        time: 1000,
        speed: 1,
      }
    )
  },
  moveScore(score) {
    score.pos.y -= score.speed;
  },
  updateScore() {
    this.scoreBoard.innerHTML = `Score: ${this.score}`;
    this.oldScore = this.score;

    if (this.highScore < this.score) {
      this.highScore = this.score;
      localStorage.setItem('highScore', this.highScore.toString());
    }

    if (this.highScore) {
      this.highScoreBoard.innerHTML = `High score: ${this.highScore}`;
    }
  },
  updateFPS() {
    this.fpsBoard.innerHTML = `${this.fps} FPS`;
  },
  checkSizeDifference(enemy) {
    const difference = enemy.size / this.player.size;
    if (difference < 0.66) {
      return 'save';
    } else if (difference < 2) {
      return 'aware';
    }

    return 'dangerously';
  },
  renderEntity(entity, isPlayer = false) {
    if (!isPlayer) {
      const difference = this.checkSizeDifference(entity);

      if (difference === 'save') {
        entity.color = this.gameConstants.saveColor;
        entity.borderColor = this.gameConstants.saveBorderColor;
      } else if (difference === 'dangerously') {
        entity.color = this.gameConstants.dangerousColor;
        entity.borderColor = this.gameConstants.dangerousBorderColor;
      } else {
        entity.color = this.gameConstants.warningColor;
        entity.borderColor = this.gameConstants.warningBorderColor;
      }
    }

    this.ctx.fillStyle = entity.color;
    this.ctx.fillRect(entity.pos.x, entity.pos.y, entity.size, entity.size);

    if (entity.borderColor) {
      this.ctx.strokeStyle = entity.borderColor;
      this.ctx.strokeRect(entity.pos.x, entity.pos.y, entity.size, entity.size);
    }
  },
  renderCircle(circle) {
    this.ctx.fillStyle = circle.color;
    this.ctx.beginPath();
    this.ctx.arc(circle.pos.x, circle.pos.y, circle.size, 0, 2 * Math.PI);
    this.ctx.fill();
    this.ctx.closePath();
    this.ctx.strokeStyle = circle.borderColor;
    this.ctx.stroke();
  },
  renderScore(score) {
    this.ctx.font = '24px cursive';
    this.ctx.fillStyle = 'rgba(0,137,123 ,.6)';
    this.ctx.fillText(score.text, score.pos.x, score.pos.y);
  },
  checkMoving(delta) {
    if (this.keys['37'].pressed && this.player.pos.x > this.gameConstants.canvasBorderWidth) {
      this.player.pos.x -= this.player.speed * (16 / delta);
    }

    if (this.keys['38'].pressed && this.player.pos.y > this.gameConstants.canvasBorderWidth) {
      this.player.pos.y -= this.player.speed * (16 / delta);
    }

    if (this.keys['39'].pressed && this.player.pos.x < this.canvas.width - this.player.size - this.gameConstants.canvasBorderWidth) {
      this.player.pos.x += this.player.speed * (16 / delta);
    }

    if (this.keys['40'].pressed && this.player.pos.y < this.canvas.height - this.player.size - this.gameConstants.canvasBorderWidth) {
      this.player.pos.y += this.player.speed * (16 / delta);
    }
  },
  checkEnemiesMoving() {
    this.enemies.forEach((enemy, index) => {
      if (isNaN(enemy.pos.x) || isNaN(enemy.pos.y)) {
        this.enemies.splice(index, 1);
      } else {
        if (Math.abs(enemy.pos.x - enemy.moveTo.x) < 1 && Math.abs(enemy.pos.y - enemy.moveTo.y)) {
          enemy.moveTo.x = this.randomInt(0, this.canvas.width - enemy.size);
          enemy.moveTo.y = this.randomInt(0, this.canvas.height - enemy.size);
        }

        let xCoordinate;
        let yCoordinate;

        if (Math.abs(enemy.pos.x - enemy.moveTo.x) > Math.abs(enemy.pos.y - enemy.moveTo.y)) {
          xCoordinate = enemy.pos.x > enemy.moveTo.x ? enemy.pos.x - enemy.speed : enemy.pos.x + enemy.speed;
          yCoordinate = this.getYCoordinate(xCoordinate, enemy.pos, enemy.moveTo);
        } else {
          yCoordinate = enemy.pos.y > enemy.moveTo.y ? enemy.pos.y - enemy.speed : enemy.pos.y + enemy.speed;
          xCoordinate = this.getXCoordinate(yCoordinate, enemy.pos, enemy.moveTo);
        }

        enemy.pos.x = xCoordinate;
        enemy.pos.y = yCoordinate;
      }
    });
  },
  getYCoordinate(x, pos1, pos2) {
    return (x - pos1.x) * (pos2.y - pos1.y) / (pos2.x - pos1.x) + pos1.y;
  },
  getXCoordinate(y, pos1, pos2) {
    return (y - pos1.y) * (pos2.x - pos1.x) / (pos2.y - pos1.y) + pos1.x;
  },
  testCollision(entity1, entity2) {
    return entity1.pos.x < entity2.pos.x + entity2.size
           && entity1.pos.x + entity1.size > entity2.pos.x
           && entity1.pos.y < entity2.pos.y + entity2.size
           && entity1.size + entity1.pos.y > entity2.pos.y
  },
  testCollisionPlayerAndCoin(coin) {
    const distX = Math.abs(coin.pos.x - this.player.pos.x - this.player.size / 2);
    const distY = Math.abs(coin.pos.y - this.player.pos.y - this.player.size / 2);

    if (distX > (this.player.size / 2 + coin.size) || distY > (this.player.size / 2 + coin.size)) {
      return false;
    }

    if (distX <= (this.player.size / 2) || distY <= (this.player.size / 2)) {
      return true;
    }

    const dx = distX - this.player.size / 2;
    const dy = distY - this.player.size / 2;
    return (dx * dx + dy * dy <= (coin.size * coin.size));
  },
  checkSaving() {
    let saveCount = this.enemies.filter((enemy) => this.checkSizeDifference(enemy) === 'save').length;
    let dangerousCount = 0;
    while (saveCount < 5) {
      this.createEnemy(true);
      saveCount += 1;
    }
    this.enemies.forEach((enemy, index) => {
      const sizeDifference = this.checkSizeDifference(enemy);
      if (sizeDifference === 'dangerously') {
        if (dangerousCount === 5) {
          this.enemies.splice(index, 1);
        } else {
          dangerousCount += 1;
        }
      } else if (sizeDifference === 'save') {
        if (enemy.size / this.player.size < 0.1) {
          this.enemies.splice(index, 1);
        }
      }
    })
  },
  death() {
    this.player.size = 0;
    cancelAnimationFrame(this.raf);
    this.gameOverPopup.style.display = 'flex';
    this.gameOverScoreBoard.innerHTML = `Score: ${this.score}`;
    this.gameOverRestartButton.onclick = () => {
      this.gameOverPopup.style.display = 'none';
      this.restart();
    }
  },
  changeMaxEnemiesCount() {
    this.enemyMaxNumber = Math.round(Math.cbrt(this.canvas.width * this.canvas.height / this.player.size));
  },
  checkPlayerSize() {
    if (this.canvas.height / this.player.size < 10 || this.canvas.width / this.player.size < 10) {
      this.scaleGameField();
    }
  },
  scaleGameField() {
    this.scaleCoefficient += 1;
    this.scaleEntity(this.player);
    this.enemies.forEach((enemy) => {
      this.scaleEntity(enemy);
    });
  },
  scaleEntity(entity) {
    const difference = entity.size / 2;
    entity.size = difference;
    entity.pos.x += difference / 2;
    entity.pos.y += difference / 2;
  },
  handleMouseDown(e) {
    e.preventDefault();
    this.mousePosition = this.getMousePosition(e);
    const matchHorizontal = this.mousePosition.x - this.player.pos.x < this.player.size
                            && this.mousePosition.x > this.player.pos.x;
    const matchVertical = this.mousePosition.y - this.player.pos.y < this.player.size
                          && this.mousePosition.y > this.player.pos.y;

    if (matchHorizontal && matchVertical) {
      this.isPressed = true;
    }
  },
  handleMouseUp(e) {
    e.preventDefault();
    this.isPressed = false;
  },
  handleMouseOut(e) {
    e.preventDefault();
    this.isPressed = false;
  },
  handleMouseMove(e) {
    e.preventDefault();

    if (!this.isPressed) {
      return;
    }

    const currentMousePosition = this.getMousePosition(e);
    const distance = {
      x: currentMousePosition.x - this.mousePosition.x,
      y: currentMousePosition.y - this.mousePosition.y,
    };
    this.mousePosition = currentMousePosition;
    this.player.pos.x += distance.x;
    this.player.pos.y += distance.y;
  },
  init() {
    this.canvas = document.createElement("canvas");
    this.scoreBoard = document.createElement('div');
    this.highScoreBoard = document.createElement('div');
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight - 4;
    this.scoreBoard.className = 'scoreboard';
    this.highScoreBoard.className = 'high-scoreboard';
    const highScore = localStorage.getItem('highScore');

    if (highScore) {
      this.highScore = highScore;
    }

    this.updateScore();
    const app = document.getElementById('app');
    app.appendChild(this.canvas);
    app.appendChild(this.scoreBoard);
    app.appendChild(this.highScoreBoard);
    document.addEventListener('keydown', (event) => {
      if (this.keys.hasOwnProperty(event.keyCode)) {
        this.keys[event.keyCode].pressed = true;
      }
    });
    document.addEventListener('keyup', (event) => {
      if (this.keys.hasOwnProperty(event.keyCode)) {
        this.keys[event.keyCode].pressed = false;
      }
    });
    this.canvas.addEventListener('mousedown', (event) => this.handleMouseDown.call(this, event), false);
    this.canvas.addEventListener('touchstart', (event) => this.handleMouseDown.call(this, event), false);
    this.canvas.addEventListener('mouseup', (event) => this.handleMouseUp.call(this, event), false);
    this.canvas.addEventListener('touchend', (event) => this.handleMouseUp.call(this, event), false);
    this.canvas.addEventListener('mouseout', (event) => this.handleMouseOut.call(this, event), false);
    this.canvas.addEventListener('mousemove', (event) => this.handleMouseMove.call(this, event), false);
    this.canvas.addEventListener('touchmove', (event) => this.handleMouseMove.call(this, event), false);
    setInterval(() => {
      this.updateFPS();
    }, 500);
  },
  update(delta) {
    if (this.oldScore !== this.score) {
      this.updateScore();
    }

    this.changeMaxEnemiesCount();
    this.checkPlayerSize();

    if (this.score > 100) {
      this.checkEnemiesMoving();
    }

    this.checkMoving(delta);
    this.enemies.forEach((enemy, index) => {
      const collision = this.testCollision(this.player, enemy);

      if (collision) {
        const difference = this.checkSizeDifference(enemy);

        if (difference === 'save') {
          const exp = (Math.round(enemy.size / 8) || 1);
          this.player.size += exp;
          this.player.pos.x -= exp / 2;
          this.player.pos.y -= exp / 2;
          this.createScore(Object.assign({}, enemy.pos, { score: exp * this.scaleCoefficient }));
          this.enemies.splice(index, 1);
          this.score += exp * this.scaleCoefficient;
        } else if (difference === 'dangerously') {
          this.death();
        } else {
          this.player.size -= Math.round(enemy.size / 8);
          enemy.size -= Math.round(this.player.size / 4);
        }
      }
    });
    this.coins.forEach((coin, index) => {
      if (this.testCollisionPlayerAndCoin(coin)) {
        this.createScore(Object.assign({}, coin.pos, { score: 100 * this.scaleCoefficient }));
        this.coins.splice(index, 1);
        this.score += 100 * this.scaleCoefficient;
      }
    });
    this.scores.forEach((score, index) => {
      if (score.time <= 0) {
        this.scores.splice(index, 1);
      }

      score.time -= this.gameTick;

      this.moveScore(score);
    });

    if (this.enemies.length >= this.enemyMaxNumber) {
      this.checkSaving();
    }
  },
  render() {
    this.ctx.fillStyle = 'rgba(176,190,197 ,1)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.renderEntity(this.player, true);
    this.enemies.forEach((enemy) => this.renderEntity(enemy));
    this.coins.forEach((coin) => this.renderCircle(coin, true));
    this.scores.forEach((score) => this.renderScore(score));
  },
  main() {
    this.gameTick = performance.now() - this.lastTime;
    const delta = this.gameTick / 1000;
    this.fps = Math.round(1 / delta);
    this.lastTime = performance.now();
    if (this.gameTick)
    this.update(this.gameTick);
    this.render();

    if (this.randomNumber() <= this.gameConstants.enemySpawnChance
        && this.enemies.length <= this.enemyMaxNumber
    ) {
      this.createEnemy();
    }

    if (this.randomNumber() <= this.gameConstants.coinSpawnChance && this.coins.length < 2) {
      this.createCoin();
    }

    this.raf = requestAnimationFrame(this.main.bind(this));
  },
  start() {
    this.createPlayer();
    this.main();
  },
  restart() {
    this.score = 0;
    this.enemies = [];
    this.createPlayer();
  }
};

Game.init();
Game.start();