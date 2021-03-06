import Enemy                  from '../entities/enemy';
import randomInt              from '../resources/utils/randomInt';
import getCanvas              from '../resources/utils/getCanvas';
import sizeStatus             from '../resources/utils/getSizeDifferenceStatus';
import collision              from '../resources/utils/collision';
import constants              from '../resources/constants';
import randomNumber           from '../resources/utils/randomNumber';
import getDistanceBetweenDots from '../resources/utils/getDistanceBetweenDots';

export default {
  color:            {
    safe:      {
      bg:     'rgba(129, 199, 132, .25)',
      border: 'rgba(67,160,71 ,1)',
    },
    warning:   {
      bg:     'rgba(255, 183, 77, .25)',
      border: 'rgba(251,140,0 ,1)',
    },
    dangerous: {
      bg:     'rgba(255, 87, 34, .25)',
      border: 'rgba(244,81,30 ,1)',
    },
  },
  enemySpawnChance: 25,
  enemies:          [],

  createEnemy(player, isSafe = false) {
    const offsetX   = player.getOffset().x;
    const offsetY   = player.getOffset().y;
    const minSize   = Math.round(player.size * 0.10);
    const maxCoeff  = Math.min(1 / Math.pow(0.87, player.level), 2.25);
    const maxSize   = Math.round(player.size * (isSafe ? 0.65 : maxCoeff));
    const enemySize = randomInt(minSize, maxSize);
    const field     = getCanvas();
    const enemy     = {
      pos:    {
        x: randomInt(offsetX - field.width, offsetX + field.width),
        y: randomInt(offsetY - field.height, offsetY + field.height),
      },
      moveTo: {
        x: randomInt(offsetX - field.width, offsetX + field.width),
        y: randomInt(offsetY - field.height, offsetY + field.height),
      },
      size:   enemySize,
      speed:  0.25 * player.level,
    };

    while (collision.test.squareSquare(player, enemy, player.size * 2)) {
      enemy.pos.x = randomInt(offsetX - field.width, offsetX + field.width);
      enemy.pos.y = randomInt(offsetY - field.height, offsetY + field.height);
    }

    Object.assign(enemy, this.colorizeAccordingDifference(enemy, player));

    return new Enemy(enemy);
  },

  colorizeAccordingDifference(enemy, player) {
    const difference = sizeStatus(player, enemy);

    if (difference === constants.sizeDifferenceStatuses.safe) {
      return {
        color:  this.color.safe.bg,
        border: this.color.safe.border,
      };
    } else if (difference === constants.sizeDifferenceStatuses.warning) {
      return {
        color:  this.color.warning.bg,
        border: this.color.warning.border,
      };
    }

    return {
      color:  this.color.dangerous.bg,
      border: this.color.dangerous.border,
    };
  },

  getYCoordinate(x, pos1, pos2) {
    return (x - pos1.x) * (pos2.y - pos1.y) / (pos2.x - pos1.x) + pos1.y;
  },

  getXCoordinate(y, pos1, pos2) {
    return (y - pos1.y) * (pos2.x - pos1.x) / (pos2.y - pos1.y) + pos1.x;
  },

  enemiesMoves(player, enemy, inArea = false) {
    let speedBonus = 0;

    if (inArea && player.magnetEnabled) {
      const distance = getDistanceBetweenDots(
        {
          x: player.pos.x + player.size / 2,
          y: player.pos.y + player.size / 2,
        },
        {
          x: enemy.pos.x + enemy.size / 2,
          y: enemy.pos.y + enemy.size / 2,
        },
      );
      const traveled = distance / (player.magnetArea() + player.size / 2);
      speedBonus = 25 - Math.round(traveled * 25);
    }

    const field = getCanvas();
    const enemySpeed = enemy.speed + speedBonus;

    if (Math.abs(enemy.pos.x - enemy.moveTo.x) < enemySpeed
        && Math.abs(enemy.pos.y - enemy.moveTo.y) < enemySpeed
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
                    ? enemy.pos.x - enemySpeed
                    : enemy.pos.x + enemySpeed;
      yCoordinate = this.getYCoordinate(
        xCoordinate,
        enemy.pos,
        enemy.moveTo,
      );
    } else {
      yCoordinate = enemy.pos.y > enemy.moveTo.y
                    ? enemy.pos.y - enemySpeed
                    : enemy.pos.y + enemySpeed;
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
    const isInMagnetArea = collision.test.rectCircle(
      enemy,
      {
        pos:  {
          x: player.pos.x + player.size / 2,
          y: player.pos.y + player.size / 2,
        },
        size: player.magnetArea(),
      },
    );

    if (isInMagnetArea) {
      enemy.moveTo = {
        x: player.pos.x + player.size / 2,
        y: player.pos.y + player.size / 2,
      };
      this.enemiesMoves(player, enemy, true);
    }
  },

  isEnemySafe(player, enemy) {
    return sizeStatus(player, enemy) === constants.sizeDifferenceStatuses.safe;
  },

  isEnemyTooSmall(player, enemy) {
    return sizeStatus(player, enemy) === constants.sizeDifferenceStatuses.tiny;
  },

  isEnemyOutOfDiapason(player, enemy) {
    const field = getCanvas();
    const offsetX = player.getOffset().x;
    const offsetY = player.getOffset().y;

    return enemy.pos.x < offsetX - field.width || enemy.pos.x > offsetX + field.width
      || enemy.pos.y < offsetY - field.height || enemy.pos.y > offsetY + field.height;
  },

  getEnemies(player) {
    let safeEnemyCount = 0;

    this.enemies.forEach((enemy, index) => {
      if (enemy.isKilled
        || this.isEnemyTooSmall(player, enemy)
        || this.isEnemyOutOfDiapason(player, enemy)
      ) {
        this.enemies.splice(index, 1);
      }

      Object.assign(enemy, this.colorizeAccordingDifference(enemy, player));
      const isCollide = collision.test.squareSquare(player, enemy);

      if (isCollide) {
        player.collideWithEnemy(enemy);
      }

      if (player.freezeEnemies === false) {
        this.enemiesMoves(player, enemy);
      }

      if (this.isEnemySafe(player, enemy) || player.playerImmune) {
        safeEnemyCount += 1;

        if (player.magnetEnabled) {
          this.checkForMagnet(player, enemy);
        }
      }
    });

    let max = Math.round((70 - (4 * player.level)) * (player.level * 0.35));

    if (player.level > 9) {
      max = Math.max(max, 100);
    }

    if (safeEnemyCount < Math.round(this.enemies.length / 10)) {
      for (; 0 !== safeEnemyCount; safeEnemyCount -= 1) {
        this.enemies.push(this.createEnemy(player, true));
      }
    }

    if (this.enemies.length < max && randomNumber() < this.enemySpawnChance) {
      this.enemies.push(this.createEnemy(player));
    }

    return this.enemies;
  },

  killAll(player) {
    this.enemies.forEach(enemy => player.getExp(enemy, 0.25));
  },

  clear() {
    this.enemies = [];
  },
};
