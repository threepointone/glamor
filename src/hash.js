import sha1 from 'js-sha1'

function calcHash(config) {
  const hash__ = sha1.create()
  Object.keys(config)
    .sort()
    .forEach(k => {
      hash__.update(k)
      if (~['string', 'number', 'boolean'].indexOf(typeof config[k])) { 
        hash__.update(''+config[k])
      } else {
        hash__.update(calcHash(config[k]))
      }
    });
  return hash__.hex()
}

const hashCache = (typeof WeakMap === 'function') ? new WeakMap() : {
  has: () => false,
  set: () => {
  }
}

export default function hash(...objs) {
  objs.map(config => {
    if (hashCache.has(config)) {
      return hashCache.get(config)
    }
    const hash = calcHash(config)
    hashCache.set(config, hash)
    return hash
  })
    .sort()
    .join('')
}
