import getIfExists from './getIfExists';
import texts from '../texts/index';

export default function getText(
  key,
  locale = localStorage.getItem('locale') || window.locale || 'ua',
) {
  return getIfExists(texts[locale], key, key);
}