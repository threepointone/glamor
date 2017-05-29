import { CSSProperties } from '../css/index';

export type Node = { id?: string; name?: string; style: CSSProperties, selector?: string };
export type Plugin = (style: Node) => Node;

export class PluginSet {
  private fns: Array<Plugin>;

  constructor(initial: Array<Plugin> = []) {
    this.fns = initial;
  }

  /**
     * Takes a list of functions(plugins) as an input parameters and add them to the plugin set if they do not exist.
     * 
     * Can be called like: add(func1, func2, ...)
     * @param functionsList an array of different functions to add it to 
     */
  add(...fns: Array<Plugin>) {
    fns.forEach(fn => {
      if (this.fns.indexOf(fn) >= 0) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn('adding the same plugin again, ignoring');
        }
      } else {
        this.fns = [fn].concat(this.fns);
      }
    });
  }

  remove(fn: Plugin) {
    this.fns = this.fns.filter(x => x !== fn);
  }

  clear() {
    this.fns = [];
  }

  transform(o: Node) {
    return this.fns.reduce((o, fn) => fn(o), o);
  }
}
