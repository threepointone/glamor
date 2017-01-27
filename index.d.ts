import { CSSProperties as ReactCSSProperties } from 'react';

export interface CSSProperties extends ReactCSSProperties {
  // In dev mode, adding a `label` string prop will reflect its value in devtools. Useful
  // when debugging, and a good alternative to 'semantic' classnames.
  label?: string;
}

export interface StyleAttribute {
  // shape of { 'data-css-<id>': '' }.
  // This is used as element's attributes (not the same as element's style).
  // If this is used for `className`, This object will called `.toString()` in rendering process.
  [dataCssId: string]: '';
}

interface StyleRule extends CSSProperties {
  [selector: string]: any;
}

interface FontStyleRule extends StyleRule {
  fontFamily: string;
}

interface KeyFrameStyleRule extends StyleRule {
  [key: string]: any;
}

type FalsyValue = null | undefined | false;

type InsertCSS = (css: string) => void;
type InsertGlobal = (selector: string, rule: StyleRule) => void;
type InsertFontFace = (font: FontStyleRule) => string;
type InsertKeyframes = (name: string, keyFrame: KeyFrameStyleRule) => string;

interface CSSFunction {
  (...rules: CSSProperties[]): StyleAttribute;
  (...attrs: (CSSProperties | StyleAttribute | FalsyValue)[]): StyleAttribute;

  insert: InsertCSS;
  global: InsertGlobal;
  fontFace: InsertFontFace;
  keyframes: InsertKeyframes;
}

export const css: CSSFunction;

export const presets: {
  mobile: string;
  Mobile: string;
  phablet: string;
  Phablet: string;
  tablet: string;
  Tablet: string;
  desktop: string;
  Desktop: string;
  hd: string;
  Hd: string;
};

export function simulate(...pseudos: string[]): void;
export function speedy(isActive: boolean): void;
export function rehydrate(ids: any[]): void;
export function flush(): void;

export function media(query: string, ...rules: StyleRule[]): StyleAttribute;
export function pseudo(selector: string, ...rules: StyleRule[]): StyleAttribute;

// pseudo classes
export function active(rule: StyleRule): StyleAttribute;
export function any(rule: StyleRule): StyleAttribute;
export function checked(rule: StyleRule): StyleAttribute;
export function disabled(rule: StyleRule): StyleAttribute;
export function empty(rule: StyleRule): StyleAttribute;
export function enabled(rule: StyleRule): StyleAttribute;
export function _default(rule: StyleRule): StyleAttribute;
export function first(rule: StyleRule): StyleAttribute;
export function firstChild(rule: StyleRule): StyleAttribute;
export function firstOfType(rule: StyleRule): StyleAttribute;
export function fullscreen(rule: StyleRule): StyleAttribute;
export function focus(rule: StyleRule): StyleAttribute;
export function hover(rule: StyleRule): StyleAttribute;
export function indeterminate(rule: StyleRule): StyleAttribute;
export function inRange(rule: StyleRule): StyleAttribute;
export function invalid(rule: StyleRule): StyleAttribute;
export function lastChild(rule: StyleRule): StyleAttribute;
export function lastOfType(rule: StyleRule): StyleAttribute;
export function left(rule: StyleRule): StyleAttribute;
export function link(rule: StyleRule): StyleAttribute;
export function onlyChild(rule: StyleRule): StyleAttribute;
export function onlyOfType(rule: StyleRule): StyleAttribute;
export function optional(rule: StyleRule): StyleAttribute;
export function outOfRange(rule: StyleRule): StyleAttribute;
export function readOnly(rule: StyleRule): StyleAttribute;
export function readWrite(rule: StyleRule): StyleAttribute;
export function required(rule: StyleRule): StyleAttribute;
export function right(rule: StyleRule): StyleAttribute;
export function root(rule: StyleRule): StyleAttribute;
export function scope(rule: StyleRule): StyleAttribute;
export function target(rule: StyleRule): StyleAttribute;
export function valid(rule: StyleRule): StyleAttribute;
export function visited(rule: StyleRule): StyleAttribute;

// parameterized pseudo classes
export function dir(param: any, rule: StyleRule): StyleAttribute;
export function lang(param: any, rule: StyleRule): StyleAttribute;
export function not(param: any, rule: StyleRule): StyleAttribute;
export function nthChild(param: any, rule: StyleRule): StyleAttribute;
export function nthLastChild(param: any, rule: StyleRule): StyleAttribute;
export function nthLastOfType(param: any, rule: StyleRule): StyleAttribute;
export function nthOfType(param: any, rule: StyleRule): StyleAttribute;

// pseudo elements
export function after(rule: StyleRule): StyleAttribute;
export function before(rule: StyleRule): StyleAttribute;
export function firstLetter(rule: StyleRule): StyleAttribute;
export function firstLine(rule: StyleRule): StyleAttribute;
export function selection(rule: StyleRule): StyleAttribute;
export function backdrop(rule: StyleRule): StyleAttribute;
export function placeholder(rule: StyleRule): StyleAttribute;

// helper apis for web components
// https://github.com/threepointone/glamor/issues/16
export function cssFor(...rules: StyleRule[]): string;
export function attribsFor(...rules: StyleRule[]): string;

// deprecated aliases
export const style: CSSFunction;
export const merge: CSSFunction;
export const compose: CSSFunction;
export const insertRule: InsertCSS;
export const insertGlobal: InsertGlobal;
export const keyframes: InsertKeyframes;
export const fontFace: InsertFontFace;

// deprecated apis and there aliases

// An escape hatch to define styles for arbitrary CSS selectors. Your selector is appended
// directly to the css rule, letting you define 'whatever' you want. Use sparingly!
// (nb1: don't forget to add a leading space for 'child' selectors. eg - `$(' .item', {...}`).
// (nb2: `simulate()` does not work on these selectors yet.)
type Select = (selector: string, ...rules: StyleRule[]) => StyleAttribute;
export const select: Select;
export function parent(selector: string, ...rules: StyleRule[]): StyleAttribute;
export const $: Select;
