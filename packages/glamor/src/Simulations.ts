import { isDev, isTest, simple } from './utils';
import { clean } from './utils/clean';

// a flag to enable simulation meta tags on dom nodes
// defaults to true in dev mode. recommend *not* to
// toggle often.
export let canSimulate = isDev;

// we use these flags for issuing warnings when simulate is called
// in prod / in incorrect order
let warned1 = false, warned2 = false;

// toggles simulation activity. shouldn't be needed in most cases
export function simulations(bool = true) {
  canSimulate = !!bool;
}

// use this on dom nodes to 'simulate' pseudoclasses
// <div {...hover({ color: 'red' })} {...simulate('hover', 'visited')}>...</div>
// you can even send in some weird ones, as long as it's in simple format
// and matches an existing rule on the element
// eg simulate('nthChild2', ':hover:active') etc
export function simulate(...pseudos: Array<string>): {[key: string]: string} {
  pseudos = clean(pseudos) as Array<string>;
  if (!pseudos) {
    return {};
  }

  if (!canSimulate) {
    if (!warned1) {
      console.warn('can\'t simulate without once calling simulations(true)'); // eslint-disable-line no-console
      warned1 = true;
    }
    if (!isDev && !isTest && !warned2) {
      console.warn('don\'t use simulation outside dev'); // eslint-disable-line no-console
      warned2 = true;
    }
    return {};
  }

  return pseudos.reduce<{[key: string]: string}>((o, p) => (o[`data-simulate-${simple(p)}`] = '', o), {});
}
