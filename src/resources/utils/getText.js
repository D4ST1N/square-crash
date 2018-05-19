import getIfExists from './getIfExists';
import texts from '../texts/index';

export default function getText(key, locale = window.locale) {
  return getIfExists(texts[locale], key);
}