import getSizeDifference     from './getSizeDifference';
import constants             from '../constants';
import getAchievementsStatus from './getAchievementsStatus';

export default function getSizeDifferenceStatus(entity1, entity2) {
  const difference = getSizeDifference(entity1, entity2);
  const achievementBonus = getAchievementsStatus('leeroy jenkins') ? 1.2 : 1;

  if (difference < 0.1) {
    return constants.sizeDifferenceStatuses.tiny;
  } else if (difference < 0.66 * achievementBonus) {
    return constants.sizeDifferenceStatuses.safe;
  } else if (difference < 2) {
    return constants.sizeDifferenceStatuses.warning;
  }

  return constants.sizeDifferenceStatuses.dangerous;
}