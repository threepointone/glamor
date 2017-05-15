export declare const isBrowser: boolean;
export declare const isDev: boolean;
export declare const isTest: boolean;
export declare const idRegex: RegExp;
/**** labels ****/
export declare let hasLabels: boolean;
export declare function cssLabels(bool: any): void;
export declare function isLikeRule(rule: any): boolean;
export declare function idFor(rule: any): string;
export declare const nullRule: {
    'data-css-nil': string;
};
export declare function selector(id?: string, path?: string): string;
export declare function simple(str: any): any;
export declare function flatten<T>(inArr: Array<Array<T>> | Array<T>): Array<T>;
