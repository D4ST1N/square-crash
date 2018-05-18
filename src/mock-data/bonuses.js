import Bonus        from '../entities/bonus';
import resources    from '../resources/utils/resources';
import $event       from '../resources/utils/events';
import randomNumber from '../resources/utils/randomNumber';
import randomInt    from '../resources/utils/randomInt';
import getCanvas    from '../resources/utils/getCanvas';
import collision    from '../resources/utils/collision';
import enemiesData  from './enemies';

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
  ],
  bonuses: [],
  maxBonusesCount: 6,
  bonusesData: [
    {
      name: 'coin',
      spawnChance: 5,
      maxCount: 3,
      baseScoreGained: 100,

      action(player, bonus) {
        $event.$emit(
          'scoreGained',
          this.baseScoreGained * player.level * player.scoreMultipler,
          Object.assign({}, bonus.pos),
        );
      },
    },
    {
      name: 'bomb',
      spawnChance: 0.5,
      maxCount: 1,

      action(player) {
        enemiesData.killAll(player);
      },
    },
    {
      name: 'freeze',
      spawnChance: 2,
      maxCount: 2,
      time: 20000,
      color: 'rgba(30, 136, 229, .5)',

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
      spawnChance: 2,
      maxCount: 2,
      time: 7500,
      color: 'rgba(251, 140, 0, .5)',

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
      spawnChance: 0.5,
      maxCount: 1,
      time: 5000,
      color: 'rgba(142, 36, 170, .5)',

      action(player) {
        player.playerImmune = true;
        $event.$emit(
          'plannedTask',
          {
            ...this,
            callback: (player) => {
              player.playerImmune = false;
            },
          },
        );
      },
    },
    {
      name: 'magnet',
      spawnChance: 0.5,
      maxCount: 1,
      time: 10000,
      color: 'rgba(0, 137, 123, .5)',

      action(player) {
        player.magnetEnabled = true;
        $event.$emit(
          'plannedTask',
          {
            ...this,
            callback: (player) => {
              player.magnetEnabled = false;
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
      if (bonus.isPicked || this.isBonusOutDiapason(player, bonus)) {
        this.bonuses.splice(index, 1);
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

  checkBonusSpawn() {
    this.bonusesData.forEach((bonusData) => {
      if (this.bonuses.length < this.maxBonusesCount) {
        const total = this.bonuses.filter(bonus => bonus.name === bonusData.name).length;

        if (total < bonusData.maxCount && randomNumber() < bonusData.spawnChance) {
          const field = getCanvas();
          this.bonuses.push(new Bonus({
            pos:     {
              x: randomInt(20, field.width - 20),
              y: randomInt(20, field.height - 20),
            },
            size:    20,
            name:    bonusData.name,
            pattern: resources.get(bonusData.name),
          }));
        }
      }
    });
  },

  clear() {
    this.bonuses = [];
  },
};
