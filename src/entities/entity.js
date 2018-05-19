export default class Entity {
  constructor({ pos, size, color, speed }) {
    this.pos = pos;
    this.size = size;
    this.color = color;
    this.speed = speed;
  }

  scale(coefficient) {
    const newSize = this.size * coefficient;
    this.pos.x += (this.size - newSize) / 2;
    this.pos.y += (this.size - newSize) / 2;
    this.size = newSize;
  }
}