export interface DeconstrucedStyles {
    plain?: CSSProperties;
    selects?: {
        [key: string]: CSSProperties;
    };
    medias?: {
        [key: string]: CSSProperties;
    };
    supports?: {
        [key: string]: CSSProperties;
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
export declare function toCSS({selector, style}: {
    selector: string;
    style: CSSProperties;
}): string;
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
export declare type KeyframesSpec = {
    id: string;
    type: 'keyframes';
    name: string;
    keyframes: {
        [key: string]: CSSProperties;
    };
};
export declare type FontFaceSpec = {
    id: string;
    type: 'font-face';
    font: CSSProperties;
};
export declare type Spec = CSSSpec | RawSpec | KeyframesSpec | FontFaceSpec;
export declare function generateCss(rules: Array<CleanRule>): StyleAttribute;
export declare function cssFor(...rules: Array<CSSProperties | Rule>): string;
export declare function attribsFor(...rules: Array<CSSProperties | Rule>): string;
export declare function insertKeyframe(spec: KeyframesSpec): void;
export declare function insertFontFace(spec: FontFaceSpec): void;
