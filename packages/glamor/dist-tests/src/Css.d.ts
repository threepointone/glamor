import { Style } from './plugins/PluginSet';
export declare function isSelector(key: string): boolean;
export declare function joinSelectors(a: string, b: string): string;
export declare function joinMediaQueries(a: string | null, b: string): string;
export declare function isMediaQuery(key: string): boolean;
export declare function isSupports(key: string): boolean;
export declare function joinSupports(a: string | null, b: string): string;
export interface DeconstrucedStyles {
    plain?: Style;
    selects?: {
        [key: string]: Style;
    };
    medias?: {
        [key: string]: Style;
    };
    supports?: {
        [key: string]: Style;
    };
}
export interface CSSProperties {
    /**
     * In dev mode, adding a `label` string prop will reflect its value in devtools. Useful
     * when debugging, and a good alternative to 'semantic' classnames.
     */
    label?: string;
    [propertyName: string]: any;
}
export interface StyleAttribute {
    [attributeName: string]: string;
}
export declare type FalsyValues = null | undefined | false;
export declare type Rule = StyleAttribute | CSSProperties | FalsyValues;
export declare type CleanRule = StyleAttribute | CSSProperties;
export declare function deconstruct(style: CSSProperties): DeconstrucedStyles;
export declare function deconstructedStyleToCSS(id: string, style: DeconstrucedStyles): string[];
export declare function build(dest: CSSProperties, {selector, mq, supp, src}: {
    selector?: string;
    mq?: string;
    supp?: string;
    src?: Array<CSSProperties> | CSSProperties;
}): void;
export declare type CSSSpec = {
    id: string;
    style: CSSProperties;
    label: string;
    type: 'css';
};
export declare type RawSpec = {
    id: string;
    css: string;
    type: 'raw';
};
export declare function _css(rules: Array<CleanRule>): StyleAttribute;
