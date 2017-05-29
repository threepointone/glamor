import { nullRule, isDev, isLikeRule, idFor } from '../utils';
import { GenericCache } from './GenericCache';
import { StyleAttribute, Spec } from '../css';

/**
 * This variable will be used to store each created style object using the hash value of this object (id) as a key
 */
export const registered = new GenericCache<Spec>();
/**
 * This vaiable will be used to store each created rule using the hash value of Spec object(id) as a key.
 * 
 * A cached rule looks like: {data-css-<id>: ''} 
 */
export const ruleCache = new GenericCache<StyleAttribute>();

/**
 * Store if a rule is successfully inserted in the StyleSheet (in <style> tag) using the id as a key 
 */
export const inserted = new GenericCache<boolean>();

export function getRegistered(rule: any): Spec {
  if (isLikeRule(rule)) {
    let ret = registered.get(idFor(rule));

    if (ret == null) {
      throw new Error('[glamor] an unexpected rule cache miss occurred. This is probably a sign of multiple glamor instances in your app. See https://github.com/threepointone/glamor/issues/79');
    }

    return ret;
  }

  return rule;
}
