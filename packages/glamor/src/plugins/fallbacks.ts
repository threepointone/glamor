import { Node } from './PluginSet';
import * as hyphenateStyleName from 'fbjs/lib/hyphenateStyleName';
import * as memoizeStringOnly from 'fbjs/lib/memoizeStringOnly';

const processStyleName = memoizeStringOnly(hyphenateStyleName);

export function fallbacks(node: Node) {
  const hasArray = Object.keys(node.style).map(x => Array.isArray(node.style[x])).indexOf(true) >= 0;

  if (hasArray) {
    const { style } = node;
    const flattened = Object.keys(style).reduce((o, key) => ({
      ...o,
      [key]: Array.isArray(style[key]) ? (style[key] as Array<any>).join(`; ${processStyleName(key)}: `) : style[key]
    }), {});

    return {
      ...node,
      style: flattened
    };
  }

  return node;
}
