export declare class StyleSheet {
    private isSpeedy;
    private sheet;
    private tags;
    private ruleCounter;
    private maxRules;
    private injected;
    constructor(speedy?: boolean, maxRules?: number);
    getSheet(): CSSStyleSheet;
    inject(): void;
    speedy(speedy: boolean): void;
    insert(rule: string): number;
    flush(): void;
    rules(): CSSRule[];
    private _insert(rule);
}
