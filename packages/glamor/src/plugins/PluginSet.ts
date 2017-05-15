import { CSSProperties } from '../css/index';

export type Node = { id?: string; name?: string; style: CSSProperties, selector?: string };
export type Plugin = (style: Node) => Node;

export class PluginSet {
  private fns: Array<Plugin>;

  constructor(initial: Array<Plugin> = []) {
    this.fns = initial;
  }

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
