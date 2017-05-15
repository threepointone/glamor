export declare type Plugin = (style: Node) => Node;
export declare type PluginArray = Array<Plugin>;
export declare type Style = {
    [key: string]: number | string | Array<number | string>;
};
export declare type Node = {
    style: Style;
    selector: string;
};
export declare class PluginSet {
    private fns;
    constructor(initial?: PluginArray);
    add(...fns: PluginArray): void;
    remove(fn: Plugin): void;
    clear(): void;
    transform(o: Node): Node;
}
