import { canSimulate } from '../Simulations';
import { StyleAttribute } from '../css/index';

export const isBrowser = typeof window !== 'undefined';
export const isDev = process.env.NODE_ENV !== 'production';
export const isTest = process.env.NODE_ENV === 'test';

export const idRegex = /data\-css\-([a-zA-Z0-9]+)/;

export { hashify } from './hash';
export { clean } from './clean';

/**** labels ****/
// toggle for debug labels.
// *shouldn't* have to mess with this manually
export let hasLabels = isDev;

export function cssLabels(bool: boolean) {
  hasLabels = !!bool;
}

/**
 * Check if the passed value is a css rule.
 * CSS rule object must contain the key 'data-css-<id>' 
 * @param rule 
 */
export function isLikeRule(rule: StyleAttribute) {
  let keys = Object.keys(rule).filter(x => x !== 'toString');
  if (keys.length !== 1) {
    return false;
  }
  return !!/data\-css\-([a-zA-Z0-9]+)/.exec(keys[0]);
}

// extracts id from a { 'data-css-<id>': ''} like object
/**
 * Get the id from a rule, the rule looks like { 'data-css-<id>': ''}
 * @param rule 
 */
export function idFor(rule: StyleAttribute) {
  let keys = Object.keys(rule).filter(x => x !== 'toString');

  if (keys.length !== 1) {
    throw new Error('not a rule');
  }

  let match = idRegex.exec(keys[0]);

  if (!match) {
    throw new Error('not a rule');
  }

  return match[1];
}

export const nullRule = {
  'data-css-nil': ''
};

Object.defineProperty(nullRule, 'toString', {
  enumerable: false, value() { return 'css-nil'; }
});

/**
 * Create a selector string. Selector string looks like '.css-1j2tyha,[data-css-1j2tyha]'
 * @param id 
 * @param path 
 */
export function selector(id?: string, path?: string) {
  if (id == null) {
    return path.replace(/\&/g, '');
  }
  if (path == null) {
    return `.css-${id},[data-css-${id}]`;
  }

  let x = path
    .split(',')
    .map(x => x.indexOf('&') >= 0 ?
      [x.replace(/\&/mg, `.css-${id}`), x.replace(/\&/mg, `[data-css-${id}]`)].join(',') // todo - make sure each sub selector has an &
      : `.css-${id}${x},[data-css-${id}]${x}`)
    .join(',');

  if (canSimulate && /^\&\:/.exec(path) && !/\s/.exec(path)) {
    x += `,.css-${id}[data-simulate-${simple(path)}],[data-css-${id}][data-simulate-${simple(path)}]`;
  }

  return x;
}

/**
 * Remove every charachter that is not a letter or a number and turn the capital-case to lowercase.
 * 
 * Ex: simple('abc$%#12 3abc') => return 'abc123abc'
 * @param str 
 */
export function simple(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

// flatten a nested array
/**
 * Flatten a nasted array, destructure an array of arrays into a single simple array
 * Example: input is arr1[arr2[val1, val2, val3], val4, val5 ,arr3[val6, val7] ] =>
 * Output is : arr [val1, val2, val3, val4, val5, val6, val7]
 * @param inArr 
 */
export function flatten<T>(inArr: Array<Array<T>> | Array<T>): Array<T> {
  let arr: Array<T> = [];

  for (let value of inArr) {
    if (Array.isArray(value)) {
      arr = arr.concat(flatten(value));
    } else {
      arr = arr.concat(value);
    }
  }

  return arr;
}
