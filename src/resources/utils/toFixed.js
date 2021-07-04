export default function toFixed(number, to = 2) {
  const multiplier = 10 ** to;
  return Math.round(number * multiplier) / multiplier;
}