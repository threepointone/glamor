import { nullRule } from '../utils/index';
import { isDev } from '../utils/index';
import { registered } from './index'

/**
 * Optimization: Cache the results of calling a function with multiple parameters, in order to prevent re-excuting the function when it has been called 
 * with the same parameters more than one time.
 * more explenation can be found here: 
 * https://github.com/threepointone/glamor/blob/master/docs/weakmaps.md
 *   
 * @param fn the dunction which we want to cache its results 
 * @param check : optional function that returns boolean, when it's not needed do not send anything
 * 
 * example: if we have a function fn(...args) which sum numbers and return the result
 * 1- calling fn(1,2,3): the function will be excuted normally and the result will be cached
 * 2- calling fn(1,3) : the function also will be excuted normally and the result will be cached.
 * 3- calling fn(1,2,3): the function will not be excuted because we called it one timebefore with the same parameters (in the same order!), 
 * a cached result will be returned in this case 
 */

// For future aspects and in order to write better typing, looking regularly at this link to implement it when it's finished
// https://github.com/Microsoft/TypeScript/issues/5453
export function multiIndexCache<Y extends Function>(fn :  Y , check = (spec:any)=> true ): Y{
  let inputCaches = typeof WeakMap !== 'undefined' ?
    [new WeakMap(), new WeakMap(), new WeakMap(), new WeakMap(), new WeakMap(), new WeakMap(), new WeakMap(), new WeakMap()] :
    [] ;
    

  let warnedWeakMapError = false;
  return ( function (...args: Array<any>) {

    if (inputCaches[args.length - 1]) {
      let coi = inputCaches[args.length - 1] ;
      let ctr = 0;
      while (ctr < args.length -1 ) {
        if (coi.has(args[ctr]) === false) {
          coi.set(args[ctr], new WeakMap());
        }
        coi = coi.get(args[ctr]);
        ctr++;
      }

      if (coi.has(args[args.length - 1])) {
        let ret = coi.get(args[ctr]);


        // This if statement is not really important if we want to reuse the MultiIndexCache somewhere else, 
        // But in our case we need some kind of checking, therefore we send this check function as parameter
        if (check(ret) ) {
            return ret 
        }
      }
    }

    let value = fn(args);
    if (inputCaches[args.length -1]) {
      let ctr = 0, coi = inputCaches[args.length -1];
      while (ctr < args.length -1 ) {
        coi = coi.get(args[ctr]);
        ctr++;
      }

      try {
        coi.set(args[ctr], value);
      } catch (err) {
        if (isDev && !warnedWeakMapError) {
          warnedWeakMapError = true;
          console.warn('failed setting the WeakMap cache for args:', ...args); // eslint-disable-line no-console
          console.warn('this should NOT happen, please file a bug on the github repo.'); // eslint-disable-line no-console
        }
      }
    }

    return value;
  }) as any as Y ; 
}