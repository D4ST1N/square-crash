export default {
  test: {
    rectRect(rect1, rect2, area = 0) {
      return rect1.pos.x - area / 2 < rect2.pos.x + rect2.size
             && rect1.pos.x + rect1.size + area / 2 > rect2.pos.x
             && rect1.pos.y - area / 2 < rect2.pos.y + rect2.size
             && rect1.size + rect1.pos.y + area / 2 > rect2.pos.y;
    },

    rectCircle(rect, circle) {
      const distX = Math.abs(circle.pos.x - rect.pos.x - rect.size / 2);
      const distY = Math.abs(circle.pos.y - rect.pos.y - rect.size / 2);

      if (distX > (rect.size / 2 + circle.size)
          || distY > (rect.size / 2 + circle.size)
      ) {
        return false;
      }

      if (distX <= (rect.size / 2) || distY <= (rect.size / 2)) {
        return true;
      }

      const dx = distX - rect.size / 2;
      const dy = distY - rect.size / 2;

      return (dx * dx + dy * dy <= (circle.size * circle.size));
    }
  }
}