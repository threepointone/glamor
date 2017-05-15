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

export class StyleSheet {
  private isSpeedy: boolean;
  private sheet: any = null;
  private tags: Array<HTMLStyleElement> = [];
  private ruleCounter = 0;
  private maxRules: number;
  private injected = false;

  constructor(speedy = !isDev, maxRules = (isBrowser && oldIE) ? 4000 : 65000) {
    this.isSpeedy = speedy;
    this.maxRules = maxRules;
  }

  getSheet() {
    return sheetForTag(last(this.tags));
  }

  inject() {
    if (this.injected) {
      throw new Error('already injected stylesheet!');
    }

    if (isBrowser) {
      this.tags[0] = makeStyleTag();
    } else {
      // server side 'polyfill'. just enough behavior to be useful.
      this.sheet = {
        cssRules: [],
        insertRule: (rule: string) => {
          // enough 'spec compliance' to be able to extract the rules later
          // in other words, just the cssText field
          this.sheet.cssRules.push({ cssText: rule });
        }
      };
    }

    this.injected = true;
  }

  speedy(speedy: boolean) {
    if (this.ruleCounter !== 0) {
      throw new Error(`cannot change speedy mode after inserting any rule to sheet. Either call speedy(${speedy}) earlier in your app, or call flush() before speedy(${speedy})`);
    }

    this.isSpeedy = !!speedy;
  }

  insert(rule: string) {
    if (isBrowser) {
      // this is the ultrafast version, works across browsers
      if (this.isSpeedy && this.getSheet().insertRule) {
        this._insert(rule);
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
      this.sheet.insertRule(rule, rule.indexOf('@import') !== -1 ? 0 : this.sheet.cssRules.length);
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
      this.sheet.cssRules = [];
    }
  }

  rules() {
    if (!isBrowser) {
      return this.sheet.cssRules as Array<CSSRule>;
    }

    let arr: Array<CSSRule> = [];

    this.tags.forEach(tag => arr.splice(arr.length, 0, ...Array.from(
      sheetForTag(tag).cssRules
    )));

    return arr;
  }

  private _insert(rule: string) {
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
