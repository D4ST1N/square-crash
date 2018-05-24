export default {
  list: [
    {
      name: 'lucky',
      description: 'ACHIEVEMENTS.LUCKY.DESCRIPTION',
      label: 'ACHIEVEMENTS.LUCKY.NAME',
      reward: 'ACHIEVEMENTS.LUCKY.REWARD',
      isSecret: true,
      isAvailable: true,
    },
    {
      name: 'leeroy jenkins',
      description: 'ACHIEVEMENTS.LEEROY_JENKINS.DESCRIPTION',
      label: 'ACHIEVEMENTS.LEEROY_JENKINS.NAME',
      reward: 'ACHIEVEMENTS.LEEROY_JENKINS.REWARD',
      isSecret: false,
      isAvailable: true,
    },
    {
      name: 'thanos',
      description: 'ACHIEVEMENTS.THANOS.DESCRIPTION',
      label: 'ACHIEVEMENTS.THANOS.NAME',
      reward: 'ACHIEVEMENTS.THANOS.REWARD',
      isSecret: true,
      isAvailable: true,
    },
    {
      name: 'devils dozen',
      description: 'ACHIEVEMENTS.DEVILS_DOZEN.DESCRIPTION',
      label: 'ACHIEVEMENTS.DEVILS_DOZEN.NAME',
      reward: 'ACHIEVEMENTS.DEVILS_DOZEN.REWARD',
      isSecret: false,
      isAvailable: true,
    },
    {
      name: 'in ten',
      description: 'ACHIEVEMENTS.IN_TEN.DESCRIPTION',
      label: 'ACHIEVEMENTS.IN_TEN.NAME',
      reward: 'ACHIEVEMENTS.IN_TEN.REWARD',
      isSecret: false,
      isAvailable: true,
    },
    {
      name: 'jason',
      description: 'ACHIEVEMENTS.JASON.DESCRIPTION',
      label: 'ACHIEVEMENTS.JASON.NAME',
      reward: 'ACHIEVEMENTS.JASON.REWARD',
      isSecret: false,
      isAvailable: true,
    },
    {
      name: 'gandhi',
      description: 'ACHIEVEMENTS.GANDHI.DESCRIPTION',
      label: 'ACHIEVEMENTS.GANDHI.NAME',
      reward: 'ACHIEVEMENTS.GANDHI.REWARD',
      isSecret: true,
      isAvailable: true,
    },
    {
      name: 'euclid',
      description: 'ACHIEVEMENTS.EUCLID.DESCRIPTION',
      label: 'ACHIEVEMENTS.EUCLID.NAME',
      reward: 'ACHIEVEMENTS.EUCLID.REWARD',
      isSecret: true,
      isAvailable: false,
    },
    {
      name: 'run',
      description: 'ACHIEVEMENTS.RUN.DESCRIPTION',
      label: 'ACHIEVEMENTS.RUN.NAME',
      reward: 'ACHIEVEMENTS.RUN.REWARD',
      isSecret: false,
      isAvailable: true,
    },
  ],
  get(name) {
    return this.list.filter(item => item.name === name && item.isAvailable)[0];
  }
};
