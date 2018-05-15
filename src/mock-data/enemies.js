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
    });

    const field = getCanvas();
    const max = Math.round(Math.cbrt(field.width * field.height / player.size));

    if (this.enemies.length < max && randomNumber() < this.enemySpawnChance) {
      this.enemies.push(this.createEnemy(player))
    }

    return this.enemies;
  }
}