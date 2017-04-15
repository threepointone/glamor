export interface CSSProperties {
  /**
   * In dev mode, adding a `label` string prop will reflect its value in devtools. Useful
   * when debugging, and a good alternative to 'semantic' classnames.
   */
  label?: string;
  // for now just allow everything
  [propertyName: string]: any;
}

export interface StyleAttribute {
  [attributeName: string]: '';
}

type FalsyValues = null | undefined | false;
type Rule = StyleAttribute | CSSProperties | FalsyValues;

/**
 * In glamor, css rules are treated as values. The css function lets you define these values.
 */
export function css(...rules: Array<Rule>): StyleAttribute;

export namespace css {
  export function insert(css: string): void;
  export function global(selector: string, style: CSSProperties): void;
}

/**
 * In development, lets you trigger any pseudoclass on an element.
 */
export function simulate(...pseudoclasses: Array<string>): StyleAttribute;

export interface FontProperties {
  [propertyName: string]: any;
}

/**
 * Loads the given font-face at most once into the document, returns the font family name.
 */
export function fontFace(font: FontProperties): string;

export interface TimeLine {
  [timelineValue: string]: CSSProperties;
}

/**
 * Adds animation keyframes into the document, with an optional name.
 */
export function keyframes(timeline: TimeLine): string;
/**
 * Adds animation keyframes into the document, with an optional name.
 */
export function keyframes(name: string, timeline: TimeLine): string;

/**
 * Append a raw css rule at most once to the stylesheet. The ultimate escape hatch.
 */
export function insertRule(css: string): void;

/**
 * Append a css rule as a key-value object at most once to the stylesheet. The ultimate escape hatch.
 */
export function insertGlobal(selector: string, style: CSSProperties): void;

/**
 * A helper to extract the css for given rules. useful for debugging, and webcomponents.
 */
export function cssFor(...rules: Array<StyleAttribute>): string;

/**
 * Another helper for webcomponents, this generates the attributes to be included when
 * constructing an element's html.
 */
export function attribsFor(...rules: Array<StyleAttribute>): string;

/**
 * Rehydrate
 */
export function rehydrate(ids: any): void
