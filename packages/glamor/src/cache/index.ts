import { nullRule, isDev, isLikeRule, idFor } from '../utils';
import { GenericCache } from './GenericCache';
import { StyleAttribute, Spec } from '../css';

export const registered = new GenericCache<Spec>();
export const ruleCache = new GenericCache<StyleAttribute>();
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
