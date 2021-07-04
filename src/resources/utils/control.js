let control = {
  keys: {},

  getDefaultSettings() {
    return {
      up:          'ArrowUp',
      down:        'ArrowDown',
      left:        'ArrowLeft',
      right:       'ArrowRight',
      rotateLeft:  'KeyQ',
      rotateRight: 'KeyE',
    };
  },

  settings: {},

  loadSettings() {
    const controlData = localStorage.getItem('control');

    if (controlData) {
      this.settings = JSON.parse(controlData);
    } else {
      this.settings = this.getDefaultSettings();
    }
  },

  changeSettings(settings) {
    this.settings = settings;
    localStorage.setItem('control', JSON.stringify(this.settings));
  }
};

export default control;