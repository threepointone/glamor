import { GenericCache } from './GenericCache';
import { StyleAttribute, Spec } from '../css';
export declare const registered: GenericCache<Spec>;
export declare const ruleCache: GenericCache<StyleAttribute>;
export declare const inserted: GenericCache<boolean>;
export declare function getRegistered(rule: any): Spec;
