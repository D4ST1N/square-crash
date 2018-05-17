import Enemy        from '../entities/enemy';
import randomInt    from '../resources/utils/randomInt';
import getCanvas    from '../resources/utils/getCanvas';
import sizeStatus   from '../resources/utils/getSizeDifferenceStatus';
import collision    from '../resources/utils/collision';
import constants    from '../resources/constants';
import randomNumber from '../resources/utils/randomNumber';

export default {
  color: {
    safe: {
      bg: 'rgba(129, 199, 132, .25)',
      border: 'rgba(67,160,71 ,1)',
    },
    warning: {
      bg: 'rgba(255, 183, 77, .25)',
      border: 'rgba(251,140,0 ,1)',
    },
    dangerous: {
      bg: 'rgba(255, 87, 34, .25)',
      border: 'rgba(244,81,30 ,1)',
    },
  },
  enemySpawnChance: 5,
  enemies: [],

  createEnemy(player, isSafe = false) {
    const minSize = Math.round(player.size * 0.10);
    const maxCoefficient = Math.min(1 / Math.pow(0.87, player.level), 2.25);
    const maxSize = Math.round(player.size * (isSafe ? 0.65 : maxCoefficient));
    const enemySize = randomInt(minSize, maxSize);
    const field = getCanvas();
    const enemy = {
      pos:  {
        x: randomInt(0, field.width - enemySize),
        y: randomInt(0, field.height - enemySize),
      },
      moveTo: {
        x: randomInt(0, field.width - enemySize),
        y: randomInt(0, field.height - enemySize),
      },
      size: enemySize,
      speed: 0.25 * player.level,
    };

    while (collision.test.rectRect(player, enemy, player.size * 2)) {
      enemy.pos.x = randomInt(0, field.width - enemySize);
      enemy.pos.y = randomInt(0, field.width - enemySize);
    }

    Object.assign(enemy, this.colorizeAccordingDifference(enemy, player));

    return new Enemy(enemy);
  },

  colorizeAccordingDifference(enemy, player) {
    const difference = sizeStatus(player, enemy);

    if (difference === constants.sizeDifferenceStatuses.safe) {
      return {
        color: this.color.safe.bg,
        border: this.color.safe.border,
      };
    } else if (difference === constants.sizeDifferenceStatuses.warning) {
      return {
        color: this.color.warning.bg,
        border: this.color.warning.border,
      };
    }

    return {
      color: this.color.dangerous.bg,
      border: this.color.dangerous.border,
    };
  },

  getYCoordinate(x, pos1, pos2) {
    return (x - pos1.x) * (pos2.y - pos1.y) / (pos2.x - pos1.x) + pos1.y;
  },

  getXCoordinate(y, pos1, pos2) {
    return (y - pos1.y) * (pos2.x - pos1.x) / (pos2.y - pos1.y) + pos1.x;
  },

  enemiesMoves(enemy) {
    const field = getCanvas();
    if (Math.abs(enemy.pos.x - enemy.moveTo.x) < 1
        && Math.abs(enemy.pos.y - enemy.moveTo.y) < 1
    ) {
      enemy.moveTo.x = randomInt(0, field.width - enemy.size);
      enemy.moveTo.y = randomInt(0, field.height - enemy.size);
    }

    let xCoordinate;
    let yCoordinate;

    if (Math.abs(enemy.pos.x - enemy.moveTo.x)
        > Math.abs(enemy.pos.y - enemy.moveTo.y)
    ) {
      xCoordinate = enemy.pos.x > enemy.moveTo.x
                    ? enemy.pos.x - enemy.speed
                    : enemy.pos.x + enemy.speed;
      yCoordinate = this.getYCoordinate(
        xCoordinate,
        enemy.pos,
        enemy.moveTo,
      );
    } else {
      yCoordinate = enemy.pos.y > enemy.moveTo.y
                    ? enemy.pos.y - enemy.speed
                    : enemy.pos.y + enemy.speed;
      xCoordinate = this.getXCoordinate(
        yCoordinate,
        enemy.pos,
        enemy.moveTo,
      );
    }

    enemy.pos.x = xCoordinate;
    enemy.pos.y = yCoordinate;
  },

  checkForMagnet(player, enemy) {
    const isInMagnetArea = collision.test.rectRect(
      {
        pos:  {
          x: player.pos.x - player.magnetArea(),
          y: player.pos.y - player.magnetArea(),
        },
        size: player.size + player.magnetArea(),
      },
      enemy,
    );

    if (isInMagnetArea) {
      enemy.moveTo = {
        x: player.pos.x + player.size / 2,
        y: player.pos.y + player.size / 2,
      };
      this.enemiesMoves(enemy);
    }
  },

  getEnemies(player) {
    this.enemies.forEach((enemy, index) => {
      if (enemy.isKilled) {
        this.enemies.splice(index, 1);
      }

      Object.assign(enemy, this.colorizeAccordingDifference(enemy, player));
      const isCollide = collision.test.rectRect(player, enemy);

      if (isCollide) {
        player.collideWithEnemy(enemy);
      }

      if (player.freezeEnemies === false) {
        this.enemiesMoves(enemy);
      }

      if (player.magnetEnabled) {
        this.checkForMagnet(player, enemy);
      }
    });

    const field = getCanvas();
    const max = Math.round(Math.cbrt(field.width * field.height / player.size));

    if (this.enemies.length < max && randomNumber() < this.enemySpawnChance) {
      this.enemies.push(this.createEnemy(player))
    }

    return this.enemies;
  },

  killAll(player) {
    this.enemies.forEach(enemy => player.getExp(enemy));
  },

  clear() {
    this.enemies = [];
  },
};
