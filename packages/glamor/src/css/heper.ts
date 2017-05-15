const possibles = [':', '.', '[', '>', ' '];

export function isSelector(key: string) {
  const ch = key.charAt(0);
  let found = false;

  for (let possible of possibles) {
    if (ch === possible) {
      found = true;
      break;
    }
  }

  return found || (key.indexOf('&') >= 0);
}

export function joinSelectors(a: string, b: string) {
  let as = a.split(',').map(a => !(a.indexOf('&') >= 0) ? '&' + a : a);
  let bs = b.split(',').map(b => !(b.indexOf('&') >= 0) ? '&' + b : b);

  return bs.reduce((arr, b) => arr.concat(as.map(a => b.replace(/\&/g, a))), []).join(',');
}

export function joinMediaQueries(a: string | null, b: string) {
  return a ? `@media ${a.substring(6)} and ${b.substring(6)}` : b;
}

export function isMediaQuery(key: string) {
  return key.indexOf('@media') === 0;
}

export function isSupports(key: string) {
  return key.indexOf('@supports') === 0;
}

export function joinSupports(a: string | null, b: string) {
  return a ? `@supports ${a.substring(9)} and ${b.substring(9)}` : b;
}
