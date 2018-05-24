import Entity                from './entity';
import sizeStatus            from '../resources/utils/getSizeDifferenceStatus';
import constants             from '../resources/constants';
import bonusesData           from '../mock-data/bonuses';
import $event                from '../resources/utils/events';
import toFixed               from '../resources/utils/toFixed';
import getAchievementsStatus from '../resources/utils/getAchievementsStatus';

export default class Player extends Entity {
  constructor({ level, ...options }) {
    super(options);
    this.initialSize = options.size;
    this.level = level;
    this.experience = 0;
    this.scoreMultipler = 1;
    this.playerImmune = false;
    this.freezeEnemies = false;
    this.magnetEnabled = false;
    this.magnetAreaColor = 'rgba(38, 166, 154, .2)';
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
  }

  magnetArea() {
    const bonusAreaMultiplier = getAchievementsStatus('run') ? 1.25 : 1;
    return this.size * 4 * bonusAreaMultiplier;
  }

  checkMoving(keys) {
    if (keys.ArrowLeft.pressed) {
      this.moveLeft();
    }

    if (keys.ArrowRight.pressed) {
      this.moveRight();
    }
    if (keys.ArrowUp.pressed) {
      this.moveUp();
    }

    if (keys.ArrowDown.pressed) {
      this.moveDown();
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
      this.size -= Math.round(enemy.size / 8);
      enemy.size -= Math.round(this.size / 4);
    }
  }

  getExp(enemy, modifier = 1, isSafe) {
    const bonusExpMultiplier = getAchievementsStatus('in ten') ? 1.15 : 1;
    const exp = Number(toFixed(Math.max(enemy.size / 8, 1) * modifier * bonusExpMultiplier));
    const sizeChange = Math.round(exp);
    this.size += sizeChange;
    this.pos.x -= sizeChange / 2;
    this.pos.y -= sizeChange / 2;
    this.experience += exp;
    $event.$emit('expChanged', this.experience);
    this.checkExperience();
    $event.$emit(
      'scoreGained',
      exp * this.level * this.scoreMultipler,
      Object.assign({}, enemy.pos),
    );
    $event.$emit('enemyKill', enemy, isSafe);
    enemy.isKilled = true;
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
    this.offset.x -= this.speed;
    this.pos.x -= this.speed;
  }

  moveRight() {
    this.offset.x += this.speed;
    this.pos.x += this.speed;
  }

  moveUp() {
    this.offset.y -= this.speed;
    this.pos.y -= this.speed;
  }

  moveDown() {
    this.offset.y += this.speed;
    this.pos.y += this.speed;
  }
}