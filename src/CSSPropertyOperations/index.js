/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule CSSPropertyOperations
 */

import dangerousStyleValue from "./dangerousStyleValue";

const cache = new Map();
export function processStyleName(styleName) {
  let hyphenated = cache.get(styleName);
  if (hyphenated === undefined) {
    hyphenated = styleName.replace(/([A-Z])/g, "-$1").toLowerCase();
    cache.set(styleName, hyphenated);
  }
  return hyphenated;
}

/**
 * Serializes a mapping of style properties for use as inline styles:
 *
 *   > createMarkupForStyles({width: '200px', height: 0})
 *   "width:200px;height:0;"
 *
 * Undefined values are ignored so that declarative programming is easier.
 * The result should be HTML-escaped before insertion into the DOM.
 *
 * @param {object} styles
 * @param {ReactDOMComponent} component
 * @return {?string}
 */

export function createMarkupForStyles(styles, component) {
  let serialized = "";
  for (let styleName in styles) {
    const isCustomProp = styleName.indexOf("--") === 0;
    if (!styles.hasOwnProperty(styleName)) {
      continue;
    }
    if (styleName === "label") {
      continue;
    }
    let styleValue = styles[styleName];
    if (styleValue != null) {
      if (isCustomProp) {
        serialized += `${styleName}:${styleValue};`;
      } else {
        serialized += processStyleName(styleName) + ":";
        serialized +=
          dangerousStyleValue(styleName, styleValue, component) + ";";
      }
    }
  }
  return serialized || null;
}
