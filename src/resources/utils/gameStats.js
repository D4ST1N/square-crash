export default {
  initialStats: {
    totalEnemyKilled: 0,
    totalBonusesPicked: 0,
    playerMaxLevel: 1,
    coinTotal: 0,
    freezeTotal: 0,
    bombTotal: 0,
    x3Total: 0,
    shieldTotal: 0,
    magnetTotal: 0,
    knowledgeTotal: 0,
    timePlayed: 0,
  },

  stats: {},

  set(name, value, rewrite = false) {
    rewrite ? this.stats[name] = value : this.stats[name] += value;
  },

  get(name) {
    return this.stats[name];
  },

  load() {
    const statsData = localStorage.getItem('stats');

    if (statsData) {
      this.stats = JSON.parse(statsData);
    } else {
      this.stats = this.initialStats;
    }
  },

  save() {
    localStorage.setItem('stats', JSON.stringify(this.stats));
  },

  init() {
    this.load();
    setInterval(this.save.bind(this), 1000);
  },
}