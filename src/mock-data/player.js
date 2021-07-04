import getCanvas from '../resources/utils/getCanvas';
import resources from '../resources/utils/resources';

export default {
  playerData: {
    size:  30,
    speed: 5,
    color: 'transparent',
    border: 'rgba(33, 150, 243, .5)',
  },

  getData() {
    const field = getCanvas();

    return {
      pos:   {
        x: field.width / 2,
        y: field.height / 2,
      },
      level: 1,
      size:  this.playerData.size,
      speed: this.playerData.speed,
      color: this.playerData.color,
      border: this.playerData.border,
    };
  },

  playerSkins: [
    {
      name: 'deadpool',
      url: 'img/skins/player/deadpool.png',
    },
  ],

  loadSkins() {
    this.playerSkins.forEach((texture) => {
      resources.load(texture);
    });
  }
};
