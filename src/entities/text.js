import Entity from './entity';

export default class Text extends Entity {
  constructor({ text, time = 1000, ...options }) {
    super(options);
    this.text = text;
    this.font = `${options.size}px cursive`;
    this.time = time;
  }

  moveUp() {
    this.pos.y -= this.speed;
  }
}