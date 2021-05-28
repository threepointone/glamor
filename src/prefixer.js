// custom facade for inline-style-prefixer

import staticData from 'inline-style-prefixer/lib/data'

import prefixProperty from 'inline-style-prefixer/lib/utils/prefixProperty'
import prefixValue from 'inline-style-prefixer/lib/utils/prefixValue'


import cursor from 'inline-style-prefixer/lib/plugins/cursor'
import crossFade from 'inline-style-prefixer/lib/plugins/crossFade'
import filter from 'inline-style-prefixer/lib/plugins/filter'
import flex from 'inline-style-prefixer/lib/plugins/flex'
import flexboxOld from 'inline-style-prefixer/lib/plugins/flexboxOld'
import gradient from 'inline-style-prefixer/lib/plugins/gradient'
import imageSet from 'inline-style-prefixer/lib/plugins/imageSet'
import position from 'inline-style-prefixer/lib/plugins/position'
import sizing from 'inline-style-prefixer/lib/plugins/sizing'
import transition from 'inline-style-prefixer/lib/plugins/transition'

const plugins = [
  crossFade,
  cursor,
  filter,
  flexboxOld,
  gradient,
  imageSet,
  position,
  sizing,
  transition,
  flex
]

const prefixMap = staticData.prefixMap

export default function prefixer(style){
  for (const property in style) {
    const value = style[property]

    const processedValue = prefixValue(plugins, property, value, style, prefixMap)

    // only modify the value if it was touched
    // by any plugin to prevent unnecessary mutations
    if (processedValue) {
      style[property] = processedValue
    }

    prefixProperty(prefixMap, property, style)
  }
  return style
  
}
