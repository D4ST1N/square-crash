export default class Entity {
  constructor({ pos, size, color, speed }) {
    this.pos = pos;
    this.size = size;
    this.color = color;
    this.speed = speed;
  }

  scale(coefficient) {
    const difference = this.size / coefficient;
    this.size = difference;
    this.pos.x -= difference / 2;
    this.pos.y -= difference / 2;
  }
}