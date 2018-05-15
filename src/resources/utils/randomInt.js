import randomNumber from './randomNumber';

export default function randomInt(...args) {
  return Math.round(randomNumber(...args));
}