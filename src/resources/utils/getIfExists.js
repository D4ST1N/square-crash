export default function getIfExists(object, search, defaultValue) {
  if (typeof object !== 'object') {
    throw new SyntaxError('Not object given');
  }

  if (typeof search !== 'string') {
    throw new SyntaxError('Search is not string');
  }

  const parsedSearch = search.split('.');
  let pointer = object;

  for (let i = 0; i < parsedSearch.length; i += 1) {
    const property = parsedSearch[i];

    if (Object.prototype.hasOwnProperty.call(pointer, property)) {
      pointer = pointer[property];
    } else {
      return defaultValue;
    }
  }

  return pointer;
}