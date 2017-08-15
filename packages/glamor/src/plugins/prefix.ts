import createPrefixer from 'inline-style-prefixer/static/createPrefixer';
import { Node } from './PluginSet';
import staticData from './prefixer-data';

const prefixAll = createPrefixer(staticData);

export function prefix(node: Node): Node {
  return {
    ...node,
    style: prefixAll(node.style)
  };
}
