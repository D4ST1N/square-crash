import Entity      from './entity';
import sizeStatus  from '../resources/utils/getSizeDifferenceStatus';
import constants   from '../resources/constants';
import bonusesData from '../mock-data/bonuses';
import $event      from '../resources/utils/events';

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
      0,
      25,
      50,
      80,
      130,
      200,
      300,
      450,
      640,
      860,
      1100,
      1400,
      1800,
      2300,
      3000,
    ];
  }

  magnetArea() {
    return this.size * 4;
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

    if (bonusData.action) {
      bonusData.action(this, bonus);
    }

    bonus.isPicked = true;
  }

  collideWithEnemy(enemy) {
    if (enemy.isKilled) {
      return;
    }

    if (this.playerImmune) {
      this.getExp(enemy);
    } else {
      const difference = sizeStatus(this, enemy);

      if (difference === constants.sizeDifferenceStatuses.safe) {
        this.getExp(enemy);
      } else if (difference === constants.sizeDifferenceStatuses.dangerous) {
        this.death();
      } else {
        this.size -= Math.round(enemy.size / 8);
        enemy.size -= Math.round(this.size / 4);
      }
    }
  }

  getExp(enemy, modifier = 1) {
    const exp = (Math.round(enemy.size / 8) || 1) * modifier;
    this.size += exp;
    this.pos.x -= exp / 2;
    this.pos.y -= exp / 2;
    this.experience += exp;
    $event.$emit('expChanged', this.experience);
    this.checkExperience();
    $event.$emit(
      'scoreGained',
      exp * this.level * this.scoreMultipler,
      Object.assign({}, enemy.pos),
    );
    $event.$emit('enemyKill', enemy);
    enemy.isKilled = true;
  }

  checkExperience() {
    const expToLevelUp = this.playerExperienceTable[this.level];

    if (this.experience >= expToLevelUp) {
      this.level += 1;
      this.experience -= expToLevelUp;
      $event.$emit('expChanged', this.experience);
      this.size = this.initialSize;
    }
  }

  death() {
    this.size = 0;
    $event.$emit('playerDeath', this);
  }

  getOffset() {
    return this.offset;
  }

  scale(coefficient) {
    this.size = this.size / coefficient;
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