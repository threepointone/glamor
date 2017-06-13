/*
high performance StyleSheet for css-in-js systems

- uses multiple style tags behind the scenes for millions of rules
- uses `insertRule` for appending in production for *much* faster performance
- 'polyfills' on server side


// usage

import StyleSheet from 'glamor/lib/sheet'
let styleSheet = new StyleSheet()

styleSheet.inject()
- 'injects' the stylesheet into the page (or into memory if on server)

styleSheet.insert('#box { border: 1px solid red; }')
- appends a css rule into the stylesheet

styleSheet.flush()
- empties the stylesheet of all its contents


*/

import { isBrowser, isDev, isTest } from './utils';

const oldIE = (() => {
    if (isBrowser) {
        let div = document.createElement('div');
        div.innerHTML = '<!--[if lt IE 10]><i></i><![endif]-->';
        return div.getElementsByTagName('i').length === 1;
    }
})();

class ServerSheet {
    private cssRules: Array<CSSRule> //{cssText:string}[]
    constructor() {
        this.cssRules = [];
    }

    public insertRule(rule: string, isImportRule: boolean = false) {
        if (isImportRule) {
            this.cssRules.unshift({ cssText: rule } as CSSRule);
        } else {
            this.cssRules.push({ cssText: rule } as CSSRule);
        }
    }

    public getCSSRules() {
        return this.cssRules
    }

    public emptyCssRules() {
        this.cssRules = []
    }
}

export class StyleSheet {
    private isSpeedy: boolean
    private sheet: ServerSheet // for non-browser environment we add just a list of css rules in our object
    private tags: Array<HTMLStyleElement> = [] // all the <style> tags inside our dom
    private maxRules: number //maximum number of rules inside a <style> tag
    private ruleCounter: number // counter to count the number of rules inside one <style> tag
    private injected: boolean = false; // determine if the <Style> tags are already injected inside the head of the do

    constructor(speedy = !isDev, maxRules = (isBrowser && oldIE) ? 4000 : 65000) {
        this.isSpeedy = speedy // the big drawback here is that the css won't be editable in devtools
        this.sheet = undefined;
        this.tags = [];
        this.maxRules = maxRules;
        this.ruleCounter = 0;
    }

    getSheet() {
        return sheetForTag(last(this.tags));
    }

    /**
     * create <style> tag and inject it in the dom if it's browser einvironment 
     * otherwise it will create an array of cssRules within the StyleSheet object  
     */
    inject() {
        if (this.injected) {
            throw new Error('already injected stylesheet!');
        }

        if (isBrowser) {
            this.tags[0] = makeStyleTag();
        } else {
            // server side 'polyfill'. just enough behavior to be useful.
            this.sheet = new ServerSheet()
        }

        this.injected = true;
    }

    speedy(speedy: boolean) {
        if (this.ruleCounter !== 0) {
            throw new Error(`cannot change speedy mode after inserting any rule to sheet. Either call speedy(${speedy}) earlier in your app, or call flush() before speedy(${speedy})`);
        }

        this.isSpeedy = !!speedy;
    }

    /**
     * Insert a new css rule into the <style> tag when it's in the browser environment 
     * @param rule 
     */
    insert(rule: string) {
        if (isBrowser) {
            // this is the ultrafast version, works across browsers
            if (this.isSpeedy && this.getSheet().insertRule) {
                this.browInsert(rule);
            } else {
                if (rule.indexOf('@import') !== -1) {
                    const tag = last(this.tags);
                    tag.insertBefore(document.createTextNode(rule), tag.firstChild);
                } else {
                    last(this.tags).appendChild(document.createTextNode(rule));
                }
            }
        } else {
            // server side is pretty simple
            this.sheet.insertRule(rule, rule.indexOf('@import') !== -1);
        }

        this.ruleCounter++;
        if (isBrowser && this.ruleCounter % this.maxRules === 0) {
            this.tags.push(makeStyleTag());
        }

        return this.ruleCounter - 1;
    }

    // delete(index) {
    //  // we insert a blank rule when 'deleting' so previously returned indexes remain stable
    //   return this.replace(index, '');
    // }

    flush() {
        this.injected = false;

        if (isBrowser) {
            this.tags.forEach(tag => tag.parentNode.removeChild(tag));
            this.tags = [];
            this.sheet = null;
            this.ruleCounter = 0;
            // todo - look for remnants in document.styleSheets
        } else {
            // simpler on server
            //this.sheet.emptyCssRules();
            this.sheet.emptyCssRules();
        }
    }

    rules() {
        if (!isBrowser) {
            return this.sheet.getCSSRules();
        }

        let arr: Array<CSSRule> = [];

        this.tags.forEach(tag => arr.splice(arr.length, 0, ...Array.from(sheetForTag(tag).cssRules)));

        return arr;
    }

    /**
     * Insert a new css rule into the <style> tag when it's in the browser environment 
     * @param rule 
     */
    private browInsert(rule: string) {
        // this weirdness for perf, and chrome's weird bug
        // https://stackoverflow.com/questions/20007992/chrome-suddenly-stopped-accepting-insertrule
        try {
            let sheet = this.getSheet();
            sheet.insertRule(rule, rule.indexOf('@import') !== -1 ? 0 : sheet.cssRules.length);
        } catch (e) {
            if (isDev) {
                // might need beter dx for this
                console.warn('whoops, illegal rule inserted', rule); // eslint-disable-line no-console
            }
        }
    }
}

function makeStyleTag() {
    let tag = document.createElement('style');
    tag.type = 'text/css';
    tag.setAttribute('data-glamor', '');
    tag.appendChild(document.createTextNode(''));
    (document.head || document.getElementsByTagName('head')[0]).appendChild(tag);
    return tag;
}

function last<T>(arr: Array<T>): T {
    return arr[arr.length - 1];
}

function sheetForTag(tag: HTMLStyleElement) {
    if (tag.sheet) {
        return tag.sheet as CSSStyleSheet;
    }

    // this weirdness brought to you by firefox
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < document.styleSheets.length; i++) {
        if (document.styleSheets[i].ownerNode === tag) {
            return document.styleSheets[i] as CSSStyleSheet;
        }
    }
}
