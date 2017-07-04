import { hasLabels, selector, flatten, isLikeRule, clean, idFor } from '../utils/index';
import { plugins, styleSheet, keyframesPlugins } from '../index';
import { createMarkupForStyles } from 'react-css-property-operations';
import { inserted, registered, ruleCache, getRegistered } from '../cache';
import { hashify } from '../utils/hash';
import { isSelector, joinSelectors, isMediaQuery, joinMediaQueries, joinSupports, isSupports } from './helper';

export interface DeconstrucedStyles {
  plain?: CSSProperties;
  selects?: { [key: string]: DeconstrucedStyles };
  medias?: { [key: string]: DeconstrucedStyles };
  supports?: { [key: string]: DeconstrucedStyles };
}

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
  [attributeName: string]: string;
}

export type FalsyValues = null | undefined | false;
export type Rule = StyleAttribute | CSSProperties | FalsyValues;
export type CleanRule = StyleAttribute | CSSProperties;


/**
 * A Style object will be destructured into new object style with four main keys { plain:, selects:, medias:, supports:}
 * 
 * 1- 'plain' contains the plain css styles like (color: red)
 * 
 * 2- 'selects' contains all css styles that depend on selectors like (. , & , : , > ) ex: &:hover { }
 * 
 * 3- 'medias' contains all css styles that depend on @media selectors 
 * 
 * 4- 'supports' contains all css styles that depend on @support selectors 
 * @param style 
 * 
 * example:
 * input {label: [], color: 'red', 
 *        &:hover: {color: 'blue'}, 
 *        @media(min-width: 300px): {color: 'green', &:hover: {color: ...}, .a & .c:{color: ...}}}
 * 
 * output {plain: {color: 'red'},
 *          selects: {&:hover: {color: 'blue'}},
 *          medias: {@media(min-width: 300px): {plain: {color: ...}, selects: {&:hover: ..., .a & .c: ...}, medias: null, supports: null}},
 *          supports: null}
 *
 * Notice the deep destructuring in the medias object
 *
 */
function deconstruct(style: CSSProperties): DeconstrucedStyles {
  // we can be sure it's not infinitely nested here
  let plain: {[key: string]: keyof CSSProperties } | null = null;
  let selects: {[key: string]: DeconstrucedStyles } | null = null;
  let medias: {[key: string]: DeconstrucedStyles } | null = null;
  let supports: {[key: string]: DeconstrucedStyles } | null = null;

  Object.keys(style).forEach(key => {
    if (key.indexOf('&') >= 0) {
      selects = selects || {};
      selects[key] = style[key];
    } else if (key.indexOf('@media') === 0) {
      medias = medias || {};
      medias[key] = deconstruct(style[key]);
    } else if (key.indexOf('@supports') === 0) {
      supports = supports || {};
      supports[key] = deconstruct(style[key]);
    } else if (key === 'label') {
      if (style.label.length > 0) {
        plain = plain || {};
        plain.label = hasLabels ? (style.label as any as Array<string>).join('.') : '';
      }
    } else {
      plain = plain || {};
      plain[key] = style[key];
    }
  });
  return { plain, selects, medias, supports };
}

/**
 * create an array of strings which contains the different styles with its selectors.
 * 
 * The result could look like:
 * 
 *  ['.css-1j2tyha,[data-css-1j2tyha]{color:green;}', '.css-1j2tyha:hover,[ data-css-1j2tyha]:hover{color:yellow;}']
 * @param id the hash value of the style.
 * @param style 
 */
function deconstructedStyleToCSS(id: string, style: DeconstrucedStyles) {
  let css: Array<string> = [];
  // plugins here
  let { plain, selects, medias, supports } = style;
  if (plain) {
    css.push(toCSS({ style: plain, selector: selector(id) }));
  }

  if (selects) {
    Object.keys(selects).forEach(key =>
      css.push(toCSS({ style: selects[key], selector: selector(id, key) })));
  }

  if (medias) {
    Object.keys(medias).forEach(key =>
      css.push(`${key}{${deconstructedStyleToCSS(id, medias[key]).join('')}}`));
  }

  if (supports) {
    Object.keys(supports).forEach(key =>
      css.push(`${key}{${deconstructedStyleToCSS(id, supports[key]).join('')}}`));
  }
  return css;
}

/**
 * 
 * @param param0
 * 
 * example 
 * selector: .css-1j2tyha:hover,[data-css-1j2tyha]:hover'
 * style: {color: 'blue'}
 * result:'.css-1j2tyha:hover,[data-css-1j2tyha]:hover{color:blue;}'
 */
export function toCSS({ selector, style }: { selector: string; style: CSSProperties }) {
  let result = plugins.transform({ selector, style });
  return `${result.selector}{${createMarkupForStyles(result.style)}}`;
}

/**
 * Insert the style rule into the StyleSheet (in other words: insert the rule into the <style> tag)
 * @param spec 
 */
function insert(spec: CSSSpec) {
  if (!inserted.has(spec.id)) {
    inserted.add(spec.id, true);
    let deconstructed = deconstruct(spec.style);
    deconstructedStyleToCSS(spec.id, deconstructed).map(cssRule => styleSheet.insert(cssRule));
  }
}

// mutable! modifies dest.
/**
 * build a simplified style object by combining between corrospending @media and @support queries
 * at the end we will get an object that is ready to be destructured   
 * @param dest 
 * @param param1 
 */
function build(dest: CSSProperties, { selector = '', mq = '', supp = '', src = {} }: { selector?: string; mq?: string; supp?: string; src?: Array<CSSProperties> | CSSProperties }) {
  let source: Array<CSSProperties>;

  if (!Array.isArray(src)) {
    source = [src];
  } else {
    source = src;
  }
  source = flatten(source);

  source.forEach(_src => {
    if (isLikeRule(_src)) {
      let reg = getRegistered(_src);
      if (reg.type !== 'css') { throw new Error('cannot merge this rule'); }
      _src = reg.style;
    }

    _src = clean(_src);

    if (_src && _src.composes) {
      build(dest, { selector, mq, supp, src: _src.composes });
    }
    Object.keys(_src || {}).forEach(key => {
      if (isSelector(key)) {

        if (key === '::placeholder') {
          build(dest, { selector: joinSelectors(selector, '::-webkit-input-placeholder'), mq, supp, src: _src[key] });
          build(dest, { selector: joinSelectors(selector, '::-moz-placeholder'), mq, supp, src: _src[key] });
          build(dest, { selector: joinSelectors(selector, '::-ms-input-placeholder'), mq, supp, src: _src[key] });
        }

        build(dest, { selector: joinSelectors(selector, key), mq, supp, src: _src[key] });
      } else if (isMediaQuery(key)) {
        build(dest, { selector, mq: joinMediaQueries(mq, key), supp, src: _src[key] });
      } else if (isSupports(key)) {
        build(dest, { selector, mq, supp: joinSupports(supp, key), src: _src[key] });
      } else if (key === 'composes') {
        // ignore, we already dealth with it
      } else {
        let _dest = dest;
        if (supp) {
          _dest[supp] = _dest[supp] || {};
          _dest = _dest[supp];
        }
        if (mq) {
          _dest[mq] = _dest[mq] || {};
          _dest = _dest[mq];
        }
        if (selector) {
          _dest[selector] = _dest[selector] || {};
          _dest = _dest[selector];
        }

        if (key === 'label') {
          if (hasLabels) {
            dest.label = dest.label.concat(_src.label);
          }

        } else {
          _dest[key] = _src[key];
        }

      }
    });
  });
}

export type CSSSpec = { id: string; style: CSSProperties; label: string; type: 'css'; };
export type RawSpec = { id: string; css: string; type: 'raw'; };
export type KeyframesSpec = { id: string; type: 'keyframes'; name: string; keyframes: { [key: string]: CSSProperties } };
export type FontFaceSpec =  { id: string; type: 'font-face', font: CSSProperties; };
export type Spec = CSSSpec | RawSpec | KeyframesSpec | FontFaceSpec;

// let cachedCss = (typeof WeakMap !== 'undefined') ? multiIndexCache(_css) : _css;
export function generateCss(rules: Array<CleanRule>): StyleAttribute {
  // hard to type because before build() label is a string, after
  let style: any = { label: [] };
  build(style, { src: rules }); // mutative! but worth it.
  let spec: CSSSpec = {
    id: hashify(style),
    style,
    label: hasLabels ? (style.label as any as Array<string>).join('.') : '',
    type: 'css'
  };

  return toRule(spec);
}
/**
 * get the actual output for the css function, the result will look similer to: 
 * {data-css-1j2tyha: ''}
 * @param spec 
 */
function toRule(spec: CSSSpec): StyleAttribute {
  registered.add(spec.id, spec);
  insert(spec);

  if (ruleCache.has(spec.id)) {
    return ruleCache.get(spec.id);
  }

  let ret = { [`data-css-${spec.id}`]: hasLabels ? spec.label || '' : '' };
  Object.defineProperty(ret, 'toString', {
    enumerable: false, value() { return 'css-' + spec.id; }
  });

  ruleCache.add(spec.id, ret);
  return ret;
}

export function cssFor(...rules: Array<CSSProperties | Rule>) {
  const r = clean(rules) as Array<CleanRule>;

  return r ? r.map(r => {
    let style: any = { label: [] };
    build(style, { src: r }); // mutative! but worth it.
    return deconstructedStyleToCSS(hashify(style), deconstruct(style)).join('');
  }).join('') : '';
}

export function attribsFor(...rules: Array<CSSProperties | Rule>) {
  const r = clean(rules) as Array<CleanRule>;

  let htmlAttributes = r ? r.map(rule => {
    idFor(rule); // throwaway check for rule
    let key = Object.keys(rule)[0], value = rule[key];
    return `${key}="${value || ''}"`;
  }).join(' ') : '';

  return htmlAttributes;
}

export function insertKeyframe(spec: KeyframesSpec) {
  if (!inserted.has(spec.id)) {
    let inner = Object.keys(spec.keyframes).map(kf => {
      let result = keyframesPlugins.transform({ id: spec.id, name: kf, style: spec.keyframes[kf] });
      return `${result.name}{${createMarkupForStyles(result.style)}}`;
    }).join('');

    ['-webkit-', '-moz-', '-o-', ''].forEach(prefix =>
      styleSheet.insert(`@${prefix}keyframes ${spec.name + '_' + spec.id}{${inner}}`));

    inserted.add(spec.id, true);
  }
}

export function insertFontFace(spec: FontFaceSpec) {
  if (!inserted.has(spec.id)) {
    styleSheet.insert(`@font-face{${createMarkupForStyles(spec.font)}}`);
    inserted.add(spec.id, true);
  }
}
