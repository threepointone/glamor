export declare class GenericCache<T> {
    private inserted;
    add(key: string, val: T): void;
    has(key: string): boolean;
    get(key: string): T;
    flush(): void;
}
