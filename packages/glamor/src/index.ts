import { PluginSet } from './plugins/PluginSet';
import { prefix } from './plugins/prefix';
import { fallbacks } from './plugins/fallbacks';
import { StyleSheet } from './StyleSheet';
import { clean, isLikeRule, hashify, nullRule, cssLabels } from './utils';
import { generateCss, CSSSpec, RawSpec, Rule, StyleAttribute, CleanRule, toCSS, CSSProperties, KeyframesSpec, insertKeyframe, FontFaceSpec, insertFontFace, cssFor } from './css';
import { registered, ruleCache, inserted, GenericCache } from './cache';
import { multiIndexCache } from './cache/MultiIndexCache';

let cachedCss = (typeof WeakMap !== 'undefined') ? multiIndexCache(generateCss, (spec: StyleAttribute) => registered.has(spec.toString().substring(4))) : generateCss

export const styleSheet = new StyleSheet();
styleSheet.inject();

export const plugins = new PluginSet([prefix, fallbacks]);
export const keyframesPlugins = new PluginSet([prefix]);

export function speedy(bool: boolean) {
    return styleSheet.speedy(bool);
}

function css(...rules: Array<Rule>): StyleAttribute {
    // if (rules[0] && rules[0].length && rules[0].raw) {
    //   throw new Error('you forgot to include glamor/babel in your babel plugins.')
    // }

    const cleanedRules = clean(rules) as Array<CleanRule>;

    if (!cleanedRules) {
        return nullRule;
    }

    return cachedCss(cleanedRules);
}

namespace css {
    export function insert(css: string) {
        let spec: RawSpec = {
            id: hashify(css),
            css,
            type: 'raw'
        };

        registered.add(spec.id, spec);

        if (!inserted.has(spec.id)) {
            styleSheet.insert(spec.css);
            inserted.add(spec.id, true);
        }
    }

    export function global(selector: string, style: CSSProperties) {
        return css.insert(toCSS({ selector, style }));
    }

    export function keyframes(kfs: { [key: string]: CSSProperties }): string;
    export function keyframes(
        name: string,
        kfs: { [key: string]: CSSProperties }
    ): string;
    export function keyframes(
        arg1: any,
        arg2?: { [key: string]: CSSProperties }
    ): string {
        let name = 'animation';
        let kfs: { [key: string]: CSSProperties };

        if (arg2 != null) {
            name = arg1;
            kfs = arg2;
        } else {
            kfs = arg1;
        }

        // do not ignore empty keyframe definitions for now.
        kfs = (clean(kfs) as { [key: string]: CSSProperties }) || {};
        let spec: KeyframesSpec = {
            id: hashify(name, kfs),
            type: 'keyframes',
            name,
            keyframes: kfs
        };

        registered.add(spec.id, spec);
        insertKeyframe(spec);

        return name + '_' + spec.id;
    }

    export function fontFace(font: CSSProperties): string {
        font = clean(font);

        let spec: FontFaceSpec = {
            id: hashify(font),
            type: 'font-face',
            font
        };

        registered.add(spec.id, spec);
        insertFontFace(spec);

        return font.fontFamily;
    }
}

export { css, Rule, CSSProperties, StyleAttribute };

const {
  insert: insertRule,
  global: insertGlobal,
  keyframes,
  fontFace
} = css;

export { insertRule, insertGlobal, keyframes, fontFace };

// rehydrate the insertion cache with ids sent from
// renderStatic / renderStaticOptimized
export function rehydrate(ids: Array<string>) {
    for (let id of ids) {
        inserted.add(id, true);
    }
}

export function flush() {
    inserted.flush();
    registered.flush();
    ruleCache.flush();
    styleSheet.flush();
    styleSheet.inject();
}

export { simulate, simulations } from './Simulations';
export { isLikeRule, cssLabels, cssFor };
export const caches = {
    inserted,
    registered
};
