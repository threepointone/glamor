import * as createPrefixer from 'inline-style-prefixer/static/createPrefixer';
import { Node } from './PluginSet';

const staticData = require('./prefixer-data').default;
const prefixAll = createPrefixer(staticData);

export function prefix(node: Node): Node {
  return {
    ...node,
    style: prefixAll(node.style)
  };
}
