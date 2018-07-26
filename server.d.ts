export type HTMLType = string | NodeJS.ReadableStream;

export interface ServerRule {
  cssText: string;
}

export interface ServerResult<T extends HTMLType> {
  html: T;
  css: string;
  ids: string[];
  rules: ServerRule[];
}

export function renderStatic<T extends HTMLType>(fn: () => T): ServerResult<T>;
export function renderStaticOptimized<T extends HTMLType>(
  fn: () => string
): ServerResult<T>;
