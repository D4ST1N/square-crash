import Entity from './entity';

export default class Enemy extends Entity {
  constructor({ border, moveTo, ...options }) {
    super(options);
    this.border = border;
    this.moveTo = moveTo;
  }
}