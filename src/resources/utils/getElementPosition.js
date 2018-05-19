export default function getElementPosition(element) {
  const rect = element.getBoundingClientRect();
  const { left, right, top, bottom } = rect;

  return { left, right, top, bottom };
}