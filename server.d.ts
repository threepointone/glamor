export interface ServerRule {
    cssText: string;
}

export interface ServerResult {
    html: string;
    css: string;
    ids: string[];
    rules: ServerRule[];
}

export function renderStatic(fn: () => string): ServerResult;
export function renderStaticOptimized(fn: () => string): ServerResult;
