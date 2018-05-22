export default {
  list: [
    {
      name: 'lucky',
      description: 'ACHIEVEMENTS.LUCKY.DESCRIPTION',
      label: 'ACHIEVEMENTS.LUCKY.NAME',
      reward: 'ACHIEVEMENTS.LUCKY.REWARD',
      isSecret: true,
    },
    {
      name: 'leeroy jenkins',
      description: 'ACHIEVEMENTS.LEEROY_JENKINS.DESCRIPTION',
      label: 'ACHIEVEMENTS.LEEROY_JENKINS.NAME',
      reward: 'ACHIEVEMENTS.LEEROY_JENKINS.REWARD',
      isSecret: false,
    },
    {
      name: 'thanos',
      description: 'ACHIEVEMENTS.THANOS.DESCRIPTION',
      label: 'ACHIEVEMENTS.THANOS.NAME',
      reward: 'ACHIEVEMENTS.THANOS.REWARD',
      isSecret: true,
    },
    {
      name: 'devils dozen',
      description: 'ACHIEVEMENTS.DEVILS_DOZEN.DESCRIPTION',
      label: 'ACHIEVEMENTS.DEVILS_DOZEN.NAME',
      reward: 'ACHIEVEMENTS.DEVILS_DOZEN.REWARD',
      isSecret: false,
    },
    {
      name: 'in ten',
      description: 'ACHIEVEMENTS.IN_TEN.DESCRIPTION',
      label: 'ACHIEVEMENTS.IN_TEN.NAME',
      reward: 'ACHIEVEMENTS.IN_TEN.REWARD',
      isSecret: false,
    },
    {
      name: 'jason',
      description: 'ACHIEVEMENTS.JASON.DESCRIPTION',
      label: 'ACHIEVEMENTS.JASON.NAME',
      reward: 'ACHIEVEMENTS.JASON.REWARD',
      isSecret: false,
    },
    {
      name: 'gandhi',
      description: 'ACHIEVEMENTS.GANDHI.DESCRIPTION',
      label: 'ACHIEVEMENTS.GANDHI.NAME',
      reward: 'ACHIEVEMENTS.GANDHI.REWARD',
      isSecret: true,
    },
    {
      name: 'euclid',
      description: 'ACHIEVEMENTS.EUCLID.DESCRIPTION',
      label: 'ACHIEVEMENTS.EUCLID.NAME',
      reward: 'ACHIEVEMENTS.EUCLID.REWARD',
      isSecret: true,
    },
  ],
  get(name) {
    return this.list.filter(item => item.name === name)[0];
  }
};
