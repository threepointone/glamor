import { Spec } from './Css';
import { StyleAttribute } from './index';
export declare class InsertCache {
    private inserted;
    add(key: any): void;
    has(key: any): boolean;
    flush(): void;
}
export declare class RegisteredCache {
    private inserted;
    add(key: any, val: any): void;
    has(key: any): boolean;
    get(key: any): Spec;
    flush(): void;
}
export declare class RuleCache {
    private inserted;
    add(key: any, val: any): void;
    has(key: any): boolean;
    get(key: any): StyleAttribute;
    flush(): void;
}
export declare let registered: RegisteredCache;
export declare let ruleCache: RuleCache;
export declare const inserted: InsertCache;
export declare function register(spec: any): void;
export declare function getRegistered(rule: any): any;
