import Entity                from './entity';
import sizeStatus            from '../resources/utils/getSizeDifferenceStatus';
import constants             from '../resources/constants';
import bonusesData           from '../mock-data/bonuses';
import $event                from '../resources/utils/events';
import toFixed               from '../resources/utils/toFixed';
import getAchievementsStatus from '../resources/utils/getAchievementsStatus';
import resources             from '../resources/utils/resources';
import achievements          from '../resources/achievements';

export default class Player extends Entity {
  constructor({ level, border, ...options }) {
    super(options);
    this.initialPosition = Object.assign({}, options.pos);
    this.level = level;
    this.border = border;
    this.angle = 0;
    this.experience = 0;
    this.scoreMultipler = 1;
    this.dashed = true;
    this.playerImmune = false;
    this.freezeEnemies = false;
    this.magnetEnabled = false;
    this.magnetAreaColor = 'rgba(38, 166, 154, .2)';
    this.laserEnabled = false;
    this.offset = {
      x: 0,
      y: 0,
    };
    this.playerExperienceTable = [
      0,     // 1
      25,    // 2
      50,    // 3
      80,    // 4
      130,   // 5
      200,   // 6
      300,   // 7
      450,   // 8
      640,   // 9
      860,   // 10
      1100,  // 11
      1400,  // 12
      1800,  // 13
      2300,  // 14
      3000,  // 15
    ];
    $event.$on('imageLoaded', (name) => {
      if (name === 'deadpool') {
        this.playerReady = true;
        this.pattern = resources.get('deadpool');
      }
    });
  }

  loadSkin(name = 'deadpool') {
    if (resources.get(name) === null) {
      $event.$on('imageLoaded', (resourceName) => {
        if (resourceName === name) {
          this.pattern = resources.get(name);
        }
      });
    } else {
      this.pattern = resources.get(name);
    }
  }

  magnetArea() {
    const bonusAreaMultiplier = getAchievementsStatus('run') ? 1.25 : 1;
    return this.size * 4 * bonusAreaMultiplier;
  }

  getLaserCoordinates() {
    const from = {
      x: this.pos.x + this.size / 2,
      y: this.pos.y + this.size / 2,
    };
    const laserLength = 500;

    return {
      from,
      to: {
        x: from.x + laserLength * Math.cos(Math.PI * (this.angle - 90) / 180),
        y: from.y + laserLength * Math.sin(Math.PI * (this.angle - 90) / 180),
      },
      color: 'rgba(244,81,30 ,.5)',
    }
  }

  checkMoving(control) {
    if (Math.abs(this.initialPosition.x - this.pos.x) > 10000
      || Math.abs(this.initialPosition.y - this.pos.y) > 10000
    ) {
      $event.$emit('achievementUnlocked', achievements.get('road'));
    }

    if (control.keys[control.settings.left]) {
      this.moveLeft();
    }

    if (control.keys[control.settings.right]) {
      this.moveRight();
    }

    if (control.keys[control.settings.up]) {
      this.moveUp();
    }

    if (control.keys[control.settings.down]) {
      this.moveDown();
    }

    if (control.keys[control.settings.rotateLeft]) {
      this.angle -= 3;
    }

    if (control.keys[control.settings.rotateRight]) {
      this.angle += 3;
    }
  }

  collideWithBonus(bonus) {
    if (bonus.isPicked) {
      return;
    }

    const bonusData = bonusesData.getBonusData(bonus.name);
    $event.$emit('bonusPicked', bonus.name);

    if (bonusData.action) {
      bonusData.action(this, bonus);
    }

    bonus.isPicked = true;
  }

  collideWithEnemy(enemy) {
    if (enemy.isKilled) {
      return;
    }

    const difference = sizeStatus(this, enemy);

    if (this.playerImmune) {
      this.getExp(enemy, 1 , difference === constants.sizeDifferenceStatuses.safe);

      return;
    }


    if (difference === constants.sizeDifferenceStatuses.safe) {
      this.getExp(enemy);
    } else if (difference === constants.sizeDifferenceStatuses.dangerous) {
      this.death();
    } else {
      const bonusMultiplier = getAchievementsStatus('kraken') ? 0.66 : 1;
      this.size -= Math.round(enemy.size / 8);
      enemy.size -= Math.round(this.size / (4 * bonusMultiplier));
    }
  }

  getExp(enemy, modifier = 1, isSafe) {
    if (enemy.size / this.size > 5) {
      $event.$emit('achievementUnlocked', achievements.get('kraken'));
    }

    const bonusExpMultiplier = getAchievementsStatus('in ten') ? 1.15 : 1;
    const exp = Number(toFixed(Math.max(enemy.size / 8, 1) * modifier * bonusExpMultiplier));
    this.growUp(exp);
    $event.$emit(
      'scoreGained',
      exp * this.level * this.scoreMultipler,
      Object.assign({}, enemy.pos),
    );
    $event.$emit('enemyKill', enemy, isSafe);
    enemy.isKilled = true;
  }

  growUp(exp, isStatic = false) {
    if (!isStatic) {
      const sizeChange = Math.round(exp);
      this.size += sizeChange;
      this.pos.x -= sizeChange / 2;
      this.pos.y -= sizeChange / 2;
    }

    this.experience += exp;
    $event.$emit('expChanged', this.experience);
    this.checkExperience();
  }

  checkExperience() {
    const expToLevelUp = this.playerExperienceTable[this.level];

    if (this.experience >= expToLevelUp) {
      this.level += 1;
      $event.$emit('levelUp', this.level);
      this.experience -= expToLevelUp;
      $event.$emit('expChanged', this.experience);
      this.checkExperience();
    }
  }

  death() {
    this.size = 0;
    $event.$emit('playerDeath', this);
  }

  getOffset() {
    return this.offset;
  }

  moveLeft() {
    $event.$emit('playerMove', 'left');
    this.offset.x -= this.speed;
    this.pos.x -= this.speed;
  }

  moveRight() {
    $event.$emit('playerMove', 'right');
    this.offset.x += this.speed;
    this.pos.x += this.speed;
  }

  moveUp() {
    $event.$emit('playerMove', 'up');
    this.offset.y -= this.speed;
    this.pos.y -= this.speed;
  }

  moveDown() {
    $event.$emit('playerMove', 'down');
    this.offset.y += this.speed;
    this.pos.y += this.speed;
  }
}