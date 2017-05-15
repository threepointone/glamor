import { CSSProperties } from '../css/index';
export declare type Node = {
    id?: string;
    name?: string;
    style: CSSProperties;
    selector?: string;
};
export declare type Plugin = (style: Node) => Node;
export declare class PluginSet {
    private fns;
    constructor(initial?: Array<Plugin>);
    add(...fns: Array<Plugin>): void;
    remove(fn: Plugin): void;
    clear(): void;
    transform(o: Node): Node;
}
