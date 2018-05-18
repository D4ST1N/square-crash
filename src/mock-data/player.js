import getCanvas from '../resources/utils/getCanvas';

export default {
  playerData: {
    size:  30,
    speed: 5,
    color: 'rgba(33, 150, 243, 1)',
  },

  getData() {
    const field = getCanvas();

    return {
      pos:   {
        x: field.width / 2 - this.playerData.size / 2,
        y: field.height / 2 - this.playerData.size / 2,
      },
      level: 1,
      size:  this.playerData.size,
      speed: this.playerData.speed,
      color: this.playerData.color,
    };
  },
};
