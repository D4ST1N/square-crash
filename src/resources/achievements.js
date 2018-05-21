export default {
  list: [
    {
      name: 'lucky',
      description: 'ACHIEVEMENTS.LUCKY.DESCRIPTION',
      label: 'ACHIEVEMENTS.LUCKY.NAME',
    },
    {
      name: 'leeroy Jenkins',
      description: 'ACHIEVEMENTS.LEEROY_JENKINS.DESCRIPTION',
      label: 'ACHIEVEMENTS.LEEROY_JENKINS.NAME',
    },
    {
      name: 'thanos',
      description: 'ACHIEVEMENTS.THANOS.DESCRIPTION',
      label: 'ACHIEVEMENTS.THANOS.NAME',
    },
    {
      name: 'devils dozen',
      description: 'ACHIEVEMENTS.DEVILS_DOZEN.DESCRIPTION',
      label: 'ACHIEVEMENTS.DEVILS_DOZEN.NAME',
    },
    {
      name: 'in ten',
      description: 'ACHIEVEMENTS.IN_TEN.DESCRIPTION',
      label: 'ACHIEVEMENTS.IN_TEN.NAME',
    },
    {
      name: 'van helsing',
      description: 'ACHIEVEMENTS.VAN_HELSING.DESCRIPTION',
      label: 'ACHIEVEMENTS.VAN_HELSING.NAME',
    },
    {
      name: 'gandhi',
      description: 'ACHIEVEMENTS.GANDHI.DESCRIPTION',
      label: 'ACHIEVEMENTS.GANDHI.NAME',
    },
    {
      name: 'euclid',
      description: 'ACHIEVEMENTS.EUCLID.DESCRIPTION',
      label: 'ACHIEVEMENTS.EUCLID.NAME',
    },
  ],
  get(name) {
    return this.list.filter(item => item.name === name)[0];
  }
};
