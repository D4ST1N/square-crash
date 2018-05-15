import Entity     from './entity';
import sizeStatus from '../resources/utils/getSizeDifferenceStatus';
import constants  from '../resources/constants';
import $event     from '../resources/utils/events';

export default class Player extends Entity {
  constructor({ level, ...options }) {
    super(options);
    this.initialSize = options.size;
    this.level = level;
    this.experience = 0;
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

  collideWithEnemy(enemy) {
    if (enemy.isKilled) {
      return;
    }

    const difference = sizeStatus(this, enemy);

    if (difference === constants.sizeDifferenceStatuses.safe) {
      this.getExp(enemy);
    } else if (difference === constants.sizeDifferenceStatuses.dangerous) {
      this.getExp(enemy);
    } else {
      this.size -= Math.round(enemy.size / 8);
      enemy.size -= Math.round(this.size / 4);
    }
  }

  getExp(enemy) {
    const exp = (Math.round(enemy.size / 8) || 1);
    this.size += exp;
    this.pos.x -= exp / 2;
    this.pos.y -= exp / 2;
    this.experience += exp;
    this.checkExperience();
    $event.$emit('scoreGained', exp * this.level);
    enemy.isKilled = true;
  }

  checkExperience() {
    if (this.experience >= 100) {
      this.level += 1;
      this.experience = 0;
      this.size = this.initialSize;
    }
  }

  moveLeft() {
    this.pos.x -= this.speed;
  }

  moveRight() {
    this.pos.x += this.speed;
  }

  moveUp() {
    this.pos.y -= this.speed;
  }

  moveDown() {
    this.pos.y += this.speed;
  }
}