const possibles = [':', '.', '[', '>', ' '];

/**
 * Check if the key is a css selector like (:, ., [, >, ' ' )
 * @param key 
 */
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

/**
 * Compine two @media quieries with "and" operator, and return one @media query
 * 
 * ex. a: @media only print  
 * b:@media only screen and (max-device-width: 480px)
 * => result: @media only print and only screen and (max-device-width: 480px)
 * @param a 
 * @param b 
 */
export function joinMediaQueries(a: string | null, b: string) {
  return a ? `@media ${a.substring(6)} and ${b.substring(6)}` : b;
}

/**
 * Check if the key representing a media query 
 * Media query start with "@media"
 * @param key 
 */
export function isMediaQuery(key: string) {
  return key.indexOf('@media') === 0;
}

/**
 * Check if the key represents a support query
 * Support query starts with "@supports"
 * ex: @support (conditions){ some css magic! }
 * @param key 
 */
export function isSupports(key: string) {
  return key.indexOf('@supports') === 0;
}


/**
 * Compine two @support quieries with "and" operator, and return one @support query
 * @param a 
 * @param b 
 * ex a = @supports (display: flex)'
 *    b = '@supports (-webkit-appearance: caret)
 *    result :'@supports  (display: flex) and  (-webkit-appearance: caret)'
 */
export function joinSupports(a: string | null, b: string) {
  return a ? `@supports ${a.substring(9)} and ${b.substring(9)}` : b;
}
