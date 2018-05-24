import randomInt from './randomInt';

export default function uglifyString(string) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  return string.split('')
               .map(
                 (char) => (char === ' '
                               ? char
                               : characters[randomInt(0, characters.length - 1)])
               )
               .join('');
}