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

// of shape { 'data-css-<id>': '' }
export function isLikeRule(rule: StyleAttribute) {
  let keys = Object.keys(rule).filter(x => x !== 'toString');
  if (keys.length !== 1) {
    return false;
  }
  return !!/data\-css\-([a-zA-Z0-9]+)/.exec(keys[0]);
}

// extracts id from a { 'data-css-<id>': ''} like object
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


export function simple(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

// flatten a nested array
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
