export class GenericCache<T> {
  private inserted: { [key: string]: T } = {};
  
  add(key: string, val: T) {
    if (!this.has(key)) {
      this.inserted[key] = val;
    }
  }

  has(key: string) {
    return this.inserted[key] != null;
  }

  get(key: string) {
    return this.inserted[key];
  }

  flush() {
    this.inserted = {};
  }

  counts(){
    return Object.keys(this.inserted).length
  }
}
