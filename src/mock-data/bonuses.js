import Bonus                 from '../entities/bonus';
import resources             from '../resources/utils/resources';
import $event                from '../resources/utils/events';
import randomNumber          from '../resources/utils/randomNumber';
import randomInt             from '../resources/utils/randomInt';
import getCanvas             from '../resources/utils/getCanvas';
import collision             from '../resources/utils/collision';
import enemiesData           from './enemies';
import getAchievementsStatus from '../resources/utils/getAchievementsStatus';

export default {
  textures: [
    {
      name: 'coin',
      url: 'img/bonuses/coin.png',
    },
    {
      name: 'freeze',
      url: 'img/bonuses/freeze.png',
    },
    {
      name: 'bomb',
      url: 'img/bonuses/bomb.png',
    },
    {
      name: 'x3',
      url: 'img/bonuses/x3.png',
    },
    {
      name: 'shield',
      url: 'img/bonuses/shield.png',
    },
    {
      name: 'magnet',
      url: 'img/bonuses/magnet.png',
    },
    {
      name: 'knowledge',
      url: 'img/bonuses/book.png',
    },
    {
      name: 'laser',
      url: 'img/bonuses/laser.png',
    },
    {
      name: 'player shield',
      url: 'img/player-shield.png',
    },
  ],
  bonuses: [],
  maxBonusesCount: 6,
  bonusesData: [
    {
      name: 'coin',
      maxCount: 3,
      baseScoreGained: 100,

      spawnChance() {
        return 5;
      },

      action(player, bonus) {
        $event.$emit('coinPicked');
        const achievementBonus = getAchievementsStatus('devils dozen') ? 1.5 : 1;
        $event.$emit(
          'scoreGained',
          this.baseScoreGained * achievementBonus * player.level * player.scoreMultipler,
          Object.assign({}, bonus.pos),
        );
      },
    },
    {
      name: 'bomb',
      maxCount: 1,

      spawnChance() {
        return getAchievementsStatus('thanos') ? 0.5 : 0;
      },

      action(player) {
        enemiesData.killHalf(player);
      },
    },
    {
      name: 'freeze',
      maxCount: 2,
      time: 15000,
      color: 'rgba(30, 136, 229, .5)',

      spawnChance() {
        return 2;
      },

      action(player) {
        player.freezeEnemies = true;
        $event.$emit(
          'plannedTask',
          {
            ...this,
            callback: (player) => {
              player.freezeEnemies = false;
            },
          },
        );
      },
    },
    {
      name: 'x3',
      maxCount: 2,
      time: 12000,
      color: 'rgba(251, 140, 0, .5)',

      spawnChance() {
        return 2;
      },

      action(player) {
        player.scoreMultipler = 3;
        $event.$emit(
          'plannedTask',
          {
            ...this,
            callback: (player) => {
              player.scoreMultipler = 1;
            },
          },
        );
      },
    },
    {
      name: 'shield',
      maxCount: 1,
      time: 8000,
      color: 'rgba(142, 36, 170, .5)',

      spawnChance() {
        return 0.5;
      },

      action(player) {
        player.playerImmune = true;
        $event.$emit('shieldEnabled');
        $event.$emit(
          'plannedTask',
          {
            ...this,
            callback: (player) => {
              $event.$emit('shieldDisabled');
              player.playerImmune = false;
            },
          },
        );
      },
    },
    {
      name: 'magnet',
      maxCount: 1,
      time: 10000,
      color: 'rgba(0, 137, 123, .5)',

      spawnChance() {
        return 0.5;
      },

      action(player) {
        player.magnetEnabled = true;
        $event.$emit('magnetEnabled');
        $event.$emit(
          'plannedTask',
          {
            ...this,
            callback: (player) => {
              $event.$emit('magnetDisabled');
              player.magnetEnabled = false;
            },
          },
        );
      },
    },
    {
      name: 'knowledge',
      maxCount: 1,
      color: 'rgba(0, 137, 123, .5)',
      baseExpGained: 100,

      spawnChance() {
        return 0.5;
      },

      action(player) {
        const exp = this.baseExpGained * player.level;
        player.growUp(exp, true);
      },
    },
    {
      name: 'laser',
      maxCount: 1,
      time: 10000,
      color: 'rgba(57,73,171 ,.5)',

      spawnChance() {
        return getAchievementsStatus('hands') ? 0.5 : 0;
      },

      action(player) {
        player.laserEnabled = true;
        $event.$emit('laserEnabled');
        $event.$emit(
          'plannedTask',
          {
            ...this,
            callback: (player) => {
              $event.$emit('laserDisabled');
              player.laserEnabled = false;
            },
          },
        );
      },
    },
  ],

  isBonusOutDiapason(player, bonus) {
    const field = getCanvas();
    const offsetX = player.getOffset().x;
    const offsetY = player.getOffset().y;

    return bonus.pos.x < offsetX - field.width
      || bonus.pos.x > offsetX + field.width
      || bonus.pos.y < offsetY - field.height
      || bonus.pos.y > offsetY + field.height;
  },

  getBonuses(player) {
    this.bonuses.forEach((bonus, index) => {
      if (bonus.isPicked) {
        this.bonuses.splice(index, 1);
      }

      if (this.isBonusOutDiapason(player, bonus)) {
        bonus.pos = this.getSpawnPosition(player);
      }

      const isCollide = collision.test.rectCircle(player, bonus);

      if (isCollide) {
        player.collideWithBonus(bonus);
      }
    });

    return this.bonuses;
  },

  getBonusData(name) {
    return this.bonusesData.filter(bonus => bonus.name === name)[0];
  },

  loadTextures() {
    this.textures.forEach((texture) => {
      resources.load(texture);
    });
  },

  checkBonusSpawn(player) {
    this.bonusesData.forEach((bonusData) => {
      if (this.bonuses.length < this.maxBonusesCount) {
        const spawnChanceBonus = getAchievementsStatus('lucky') ? 1.5 : 1;
        const maxBonusCountBonus = getAchievementsStatus('gandhi') ? 1.5 : 1;
        const total = this.bonuses.filter(bonus => bonus.name === bonusData.name).length;

        if (total < bonusData.maxCount * maxBonusCountBonus
          && randomNumber() < bonusData.spawnChance() * spawnChanceBonus
        ) {
          this.spawnBonus(player, bonusData);
        }
      }
    });
  },

  getSpawnPosition(player) {
    const field = getCanvas();
    return {
      x: randomInt(player.pos.x - field.width / 4, player.pos.x + field.width / 4),
      y: randomInt(player.pos.y - field.height / 4, player.pos.y + field.height / 4),
    }
  },

  spawnBonus(player, bonusData) {
    const bonus = new Bonus({
      pos:     this.getSpawnPosition(player),
      size:    20,
      name:    bonusData.name,
      pattern: resources.get(bonusData.name),
    });
    this.bonuses.push(bonus);
    $event.$emit('bonusSpawned', bonus);
  },

  clear() {
    this.bonuses = [];
  },
};
