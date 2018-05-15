import getSizeDifference from './getSizeDifference';
import constants from '../constants';

export default function getSizeDifferenceStatus(entity1, entity2) {
  const difference = getSizeDifference(entity1, entity2);

  if (difference < 0.66) {
    return constants.sizeDifferenceStatuses.safe;
  } else if (difference < 2) {
    return constants.sizeDifferenceStatuses.warning;
  }

  return constants.sizeDifferenceStatuses.dangerous;
}