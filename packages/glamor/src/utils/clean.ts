// Returns true for null, false, undefined and {}
function isFalsy(value: any) {
  return value === null ||
    value === undefined ||
    value === false ||
    (typeof value === 'object' && Object.keys(value).length === 0);
}

function cleanObject<T extends {[key: string]: any}>(object: T): T | null {
  if (isFalsy(object)) {
    return null;
  }

  if (typeof object !== 'object') {
    return object;
  }

  let acc: any = {}, keys = Object.keys(object), hasFalsy = false;

  for (let key of keys) {
    let value = object[key];
    const filteredValue = clean(value);
    if (filteredValue === null || filteredValue !== value) {
      hasFalsy = true;
    }
    if (filteredValue !== null) {
      acc[key] = filteredValue;
    }
  }

  return Object.keys(acc).length === 0 ? null : hasFalsy ? acc : object;
}

function cleanArray<T>(rules: Array<T>): Array<T> {
  let hasFalsy = false;
  const filtered: Array<T> = [];
  rules.forEach(rule => {
    const filteredRule = clean(rule) as T;
    if (filteredRule === null || filteredRule !== rule) {
      hasFalsy = true;
    }
    if (filteredRule !== null) {
      filtered.push(filteredRule);
    }
  });
  return filtered.length === 0 ? null :
    hasFalsy ? filtered : rules;
}

// Takes style array or object provided by user and clears all the falsy data
// If there is no styles left after filtration returns null
export function clean<T>(input: T | Array<T>): T | Array<T> {
  return Array.isArray(input) ? cleanArray(input) : cleanObject(input);
}
