import { StyleAttribute } from '../css/index';
export declare const isBrowser: boolean;
export declare const isDev: boolean;
export declare const isTest: boolean;
export declare const idRegex: RegExp;
export { hashify } from './hash';
export { clean } from './clean';
/**** labels ****/
export declare let hasLabels: boolean;
export declare function cssLabels(bool: boolean): void;
export declare function isLikeRule(rule: StyleAttribute): boolean;
export declare function idFor(rule: StyleAttribute): string;
export declare const nullRule: {
    'data-css-nil': string;
};
export declare function selector(id?: string, path?: string): string;
export declare function simple(str: string): string;
export declare function flatten<T>(inArr: Array<Array<T>> | Array<T>): Array<T>;
