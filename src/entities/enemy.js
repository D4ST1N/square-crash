import Entity from './entity';

export default class Enemy extends Entity {
  constructor({ border, ...options }) {
    super(options);
    this.border = border;
  }
}