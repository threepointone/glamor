import * as expect from 'expect';
import { css } from '../../src/index'
import { cssLabels } from '../../src/utils';
import { toCSS, cssFor, attribsFor } from '../../src/css/index';

describe('css/index', ()=>{
    it('can create a css rule from a selector and style rule', ()=>{
        const selector = '.css-1j2tyha:hover,[data-css-1j2tyha]:hover';
        const style = {'color':'red'}
        expect(toCSS({selector,style})).toEqual('.css-1j2tyha:hover,[data-css-1j2tyha]:hover{color:red;}')
    });

    it('can generate css from rules', () => {
    let red = css({ color: 'red' }),
      blue = css({ ':hover': { color: 'blue' } }),
      merged = css(red, blue); 
      console.log("red: ", red)
      console.log("blue: ", blue)
      console.log('merged: ', merged)

    expect(cssFor(red, merged))
      .toEqual('.css-1ezp9xe,[data-css-1ezp9xe]{color:red;}.css-11t3bx0,[data-css-11t3bx0]{color:red;}.css-11t3bx0:hover,[data-css-11t3bx0]:hover{color:blue;}');
  });

  it('can generate html attributes from rules', () => {
    cssLabels(false);
    let red = css({ color: 'red' }),
      blue = css({ ':hover': { color: 'blue' } }),
      merged = css(red, blue);

    expect(attribsFor(red, merged)).toEqual('data-css-1ezp9xe="" data-css-11t3bx0=""');
    cssLabels(true);
  });


})