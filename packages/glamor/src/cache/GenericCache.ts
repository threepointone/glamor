export class GenericCache<T> {
  private cache: { [key: string]: T } = {};

  add(key: string, val: T) {
    if (!this.has(key)) {
      this.cache[key] = val;
    }
  }

  has(key: string) {
    return this.cache[key] != null;
  }

  get(key: string) {
    return this.cache[key];
  }

  flush() {
    this.cache = {};
  }

  counts() {
    return Object.keys(this.cache).length
  }

  keys() {
    return Object.keys(this.cache);
  }
}
