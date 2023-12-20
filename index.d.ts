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
  [attributeName: string]: "";
}

type FalsyValues = null | undefined | false;
type Rule = StyleAttribute | CSSProperties | FalsyValues;

/**
 * Adds animation keyframes into the document, with an optional name.
 */
export function keyframes(timeline: TimeLine): string;
/**
 * Adds animation keyframes into the document, with an optional name.
 */
export function keyframes(name: string, timeline: TimeLine): string;

/**
 * In glamor, css rules are treated as values. The css function lets you define these values.
 */
export function css(...rules: Array<Rule>): StyleAttribute;

export namespace css {
  export function global(selector: string, style: CSSProperties): void;
}

/**
 * Define plugins
 */
type PluginProperties = {
  selector: string;
  style: CSSProperties;
};

type PluginFn = (arg: PluginProperties) => PluginProperties;

export interface PluginSet {
  fns: PluginFn[];
  add(...fns: PluginFn[]): void;
  remove(fn: PluginFn): void;
  clear(): void;
  transform(arg: PluginProperties): PluginProperties;
}

export namespace plugins {
  export const keyframes: PluginSet;
  export const fontFace: PluginSet;
  export const media: PluginSet;

  export const fns: PluginFn[];
  export function add(...fns: PluginFn[]): void;
  export function remove(fn: PluginFn): void;
  export function clear(): void;
  export function transform(arg: PluginProperties): PluginProperties;
}

export interface TimeLine {
  [timelineValue: string]: CSSProperties;
}
