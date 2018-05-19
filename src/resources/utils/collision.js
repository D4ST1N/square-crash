export default {
  test: {
    squareSquare(square1, square2, area = 0) {
      return square1.pos.x - area / 2 < square2.pos.x + square2.size
             && square1.pos.x + square1.size + area / 2 > square2.pos.x
             && square1.pos.y - area / 2 < square2.pos.y + square2.size
             && square1.size + square1.pos.y + area / 2 > square2.pos.y;
    },

    rectRect(rect1, rect2) {
      return rect1.pos.x < rect2.pos.x + rect2.size.width
        && rect1.pos.x + rect1.size.width > rect2.pos.x
        && rect1.pos.y < rect2.pos.y + rect2.size.height
        && rect1.size.height + rect1.pos.y > rect2.pos.y;
    },

    rectCircle(rect, circle) {
      const distX = Math.abs(circle.pos.x - rect.pos.x - rect.size / 2);
      const distY = Math.abs(circle.pos.y - rect.pos.y - rect.size / 2);

      if (distX > (rect.size / 2 + circle.size) || distY > (rect.size / 2 + circle.size)) {
        return false;
      }

      if (distX <= (rect.size / 2) || distY <= (rect.size / 2)) {
        return true;
      }

      const dx = distX - rect.size / 2;
      const dy = distY - rect.size / 2;

      return (dx * dx + dy * dy <= (circle.size * circle.size));
    },
  },
}