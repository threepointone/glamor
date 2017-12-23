import { css } from './index';
import React from 'react';

const Box = ({ css: cssProp, component, ...props }) => {
  const Component = component || 'div';
  return <Component {...css(cssProp)} {...props} />;
};

export default Box;
