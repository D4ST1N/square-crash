import Entity from './entity';

export default class Bonus extends Entity {
  constructor({ pattern, name, ...options }) {
    super(options);
    this.pattern = pattern;
    this.name = name;
  }
}