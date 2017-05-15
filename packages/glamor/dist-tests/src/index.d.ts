import { PluginSet } from './plugins/PluginSet';
import { StyleSheet } from './StyleSheet';
import { Rule, StyleAttribute, CSSProperties } from './css';
export declare const styleSheet: StyleSheet;
export declare const plugins: PluginSet;
export declare const keyframesPlugins: PluginSet;
export declare function speedy(bool: boolean): void;
declare function css(...rules: Array<Rule>): StyleAttribute;
declare namespace css {
    function insert(css: string): void;
    function global(selector: string, style: CSSProperties): void;
    function keyframes(kfs: {
        [key: string]: CSSProperties;
    }): string;
    function keyframes(name: string, kfs: {
        [key: string]: CSSProperties;
    }): string;
    function fontFace(font: CSSProperties): string;
}
export { css };
export declare function rehydrate(ids: Array<string>): void;
export declare function flush(): void;
