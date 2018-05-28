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

    circleCircle(circle1, circle2) {
      return (circle2.pos.x - circle1.pos.x) ** 2
        + (circle1.pos.y - circle2.pos.y) ** 2
        <= (circle1.size + circle2.size) ** 2;
    },

    lineRect(line, rect) {
      const left   = this.lineLine(
        line,
        {
          from: {
            x: rect.pos.x,
            y: rect.pos.y,
          },
          to:   {
            x: rect.pos.x,
            y: rect.pos.y + rect.size,
          },
        },
      );
      const right  = this.lineLine(
        line,
        {
          from: {
            x: rect.pos.x + rect.size,
            y: rect.pos.y,
          },
          to:   {
            x: rect.pos.x + rect.size,
            y: rect.pos.y + rect.size,
          },
        },
      );
      const top    = this.lineLine(
        line,
        {
          from: {
            x: rect.pos.x,
            y: rect.pos.y,
          },
          to:   {
            x: rect.pos.x + rect.size,
            y: rect.pos.y,
          },
        },
      );
      const bottom = this.lineLine(
        line,
        {
          from: {
            x: rect.pos.x,
            y: rect.pos.y + rect.size,
          },
          to:   {
            x: rect.pos.x + rect.size,
            y: rect.pos.y + rect.size,
          },
        },
      );

      return !!(left || right || top || bottom);

    },

    lineLine(line1, line2) {
      const denominator = (line1.to.x - line1.from.x) * (line2.to.y - line2.from.y)
                        - (line1.to.y - line1.from.y) * (line2.to.x - line2.from.x);
      const numerator1 = (line1.from.y - line2.from.y) * (line2.to.x - line2.from.x)
                       - (line1.from.x - line2.from.x) * (line2.to.y - line2.from.y);
      const numerator2 = (line1.from.y - line2.from.y) * (line1.to.x - line1.from.x)
                       - (line1.from.x - line2.from.x) * (line1.to.y - line1.from.y);

      if (denominator === 0) {
        return numerator1 === 0 && numerator2 === 0;
      }

      const r = numerator1 / denominator;
      const s = numerator2 / denominator;

      return (r >= 0 && r <= 1) && (s >= 0 && s <= 1);
    }
  },
}