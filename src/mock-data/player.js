import randomInt from '../resources/utils/randomInt';

export default {
  playerData: {
    size:  30,
    speed: 5,
    color: 'rgba(33, 150, 243, 1)',
  },

  getData() {
    return {
      pos:   {
        x: randomInt(),
        y: randomInt(),
      },
      level: 1,
      size:  this.playerData.size,
      speed: this.playerData.speed,
      color: this.playerData.color,
    };
  },
};
