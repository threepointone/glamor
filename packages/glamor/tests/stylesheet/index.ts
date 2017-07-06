import  * as expect from 'expect';
import { css, styleSheet, flush } from '../../src/index'
import * as React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { registered, ruleCache, inserted } from '../../src/cache';
import { normalizeCssText } from '../helper';

describe('stylesheet', ()=>{

    afterEach(()=>{
        flush();
    });

    it('can add nasted styles', ()=>{
        css({
            color: 'red',
            ':hover': {
                color: 'blue'
            },
            '@media(min-width: 300px)': {
                color: 'green',
                ':hover': {
                color: 'yellow'
                },
                '.a & .c': { color: 'rgb(245, 222, 179)' },
                '&&': { color: 'rgb(255, 255, 240)' }
            },
            '@media(max-width: 600px)': {
                color: 'green',
                ':hover': {
                color: 'yellow'
                },
                '.a & .c': { color: 'rgb(245, 222, 179)' },
                '&&': { color: 'gray' }
            }
        },{'backgroundColor':'gray',':checked':{color:'white'}
                });

       expect(normalizeCssText(styleSheet.rules().map(x => x.cssText).join('\n'))).toEqual(
      `.css-1ezp9xe, [data-css-1ezp9xe] { color: red; }\n.css-o6qtyr:hover, [data-css-o6qtyr]:hover { color: blue; }\n.css-11t3bx0, [data-css-11t3bx0] { color: red; }\n.css-11t3bx0:hover, [data-css-11t3bx0]:hover { color: blue; }\n.css-4t5i7w, [data-css-4t5i7w] { color: red; background-color: gray; }\n.css-4t5i7w:hover, [data-css-4t5i7w]:hover { color: blue; }\n.css-4t5i7w:checked, [data-css-4t5i7w]:checked { color: white; }\n@media (min-width: 300px) {\n  .css-4t5i7w, [data-css-4t5i7w] { color: green; }\n  .css-4t5i7w:hover, [data-css-4t5i7w]:hover { color: yellow; }\n  .a .css-4t5i7w .c, .a [data-css-4t5i7w] .c { color: rgb(245, 222, 179); }\n  .css-4t5i7w.css-4t5i7w, [data-css-4t5i7w][data-css-4t5i7w] { color: rgb(255, 255, 240); }\n}\n@media (max-width: 600px) {\n  .css-4t5i7w, [data-css-4t5i7w] { color: green; }\n  .css-4t5i7w:hover, [data-css-4t5i7w]:hover { color: yellow; }\n  .a .css-4t5i7w .c, .a [data-css-4t5i7w] .c { color: rgb(245, 222, 179); }\n  .css-4t5i7w.css-4t5i7w, [data-css-4t5i7w][data-css-4t5i7w] { color: gray; }\n}`
        );
    });

    it('deletes the rules from sheet', ()=>{
        css({
            color: 'red',
            ':hover': {
                color: 'blue'
            }
        })
        styleSheet.flush();
        expect(styleSheet.rules().length).toEqual(0)
    });

    it('adds the <style> tag with corrospending styles to the page', ()=>{
        css({
            color: 'blue',
            ':hover': {
                color: 'blue'
            }
        })
        expect(document.getElementsByTagName('STYLE')[0].innerHTML).toEqual('.css-bax4bi,[data-css-bax4bi]{color:blue;}.css-bax4bi:hover,[data-css-bax4bi]:hover{color:blue;}')
        expect(document.getElementsByTagName('STYLE').length).toEqual(1);
    });

    it('removes the <style> tag from the page', ()=>{
        css({
            color: 'green',
            ':hover': {
                color: 'blue'
            }
        })
        styleSheet.flush();
        expect(document.getElementsByTagName('STYLE').length).toEqual(0);
    });


    it('does not allow to change speedy mode after adding a style', ()=>{
        css({':hover':{color:'red'}});
        expect((function(){ styleSheet.speedy(true)})).toThrow(/cannot change speedy mode */)
    });


});
