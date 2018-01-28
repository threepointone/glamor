import { css } from './index';
import React from 'react';

const Box = ({ css: cssProp, component, innerRef, ...props }) => {
  const Component = component || 'div';
  return <Component ref={innerRef} {...css(cssProp)} {...props} />;
};

export default Box;
