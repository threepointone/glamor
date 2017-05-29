import  * as expect from 'expect';
import { css, styleSheet, flush } from '../../src/index'
import * as React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { registered, ruleCache, inserted } from '../../src/cache';


describe('stylesheet', ()=>{

    afterEach(()=>{
        flush();
    });
   
    it('can add nasted styles', ()=>{
        //styleSheet.speedy(true);
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
                '.a & .c': { color: 'wheat' },
                '&&': { color: 'ivory' }
            },
            '@media(max-width: 600px)': {
                color: 'green',
                ':hover': {
                color: 'yellow'
                },
                '.a & .c': { color: 'wheat' },
                '&&': { color: 'gray' }
            }
        },{'backgroundColor':'gray',':checked':{color:'white'}
                });
        
       expect(styleSheet.rules().map(x => x.cssText).join('\n')).toEqual(
      `.css-18vhb03, [data-css-18vhb03] { color: red; background-color: gray; }\n.css-18vhb03:hover, [data-css-18vhb03]:hover { color: blue; }\n.css-18vhb03:checked, [data-css-18vhb03]:checked { color: white; }\n@media (min-width: 300px) { \n  .css-18vhb03, [data-css-18vhb03] { color: green; }\n  .css-18vhb03:hover, [data-css-18vhb03]:hover { color: yellow; }\n  .a .css-18vhb03 .c, .a [data-css-18vhb03] .c { color: rgb(245, 222, 179); }\n  .css-18vhb03.css-18vhb03, [data-css-18vhb03][data-css-18vhb03] { color: rgb(255, 255, 240); }\n}\n@media (max-width: 600px) { \n  .css-18vhb03, [data-css-18vhb03] { color: green; }\n  .css-18vhb03:hover, [data-css-18vhb03]:hover { color: yellow; }\n  .a .css-18vhb03 .c, .a [data-css-18vhb03] .c { color: rgb(245, 222, 179); }\n  .css-18vhb03.css-18vhb03, [data-css-18vhb03][data-css-18vhb03] { color: gray; }\n}`
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

    it('flushes the caches', ()=>{
        css({':hover':{color:'red'}});
        expect(ruleCache.isEmpty).toBeFalsy;
        expect(registered.isEmpty).toBeFalsy;
        expect(inserted.isEmpty).toBeFalsy;
        flush();
        expect(ruleCache.isEmpty).toBeTruthy;
        expect(registered.isEmpty).toBeTruthy;
        expect(inserted.isEmpty).toBeTruthy;
    });

    it('does not allow to change speedy mode after adding a style', ()=>{
        css({':hover':{color:'red'}});
        expect((function(){ styleSheet.speedy(true)})).toThrow(/cannot change speedy mode */)
    });

    it('does not add the same style twice', ()=>{
        css({backgrounedColor:'red', ':hover':{color:'blue'}})
        css({backgrounedColor:'red', ':hover':{color:'blue'}})

        expect(inserted.counts()).toEqual(1);
        expect(ruleCache.counts()).toEqual(1);
        expect(registered.counts()).toEqual(1);
        expect(document.getElementsByTagName('STYLE')[0].innerHTML).toEqual('.css-mbxlkd,[data-css-mbxlkd]{backgrouned-color:red;}.css-mbxlkd:hover,[data-css-mbxlkd]:hover{color:blue;}');
    });
    
    
});