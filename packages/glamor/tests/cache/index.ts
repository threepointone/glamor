import { registered, ruleCache, inserted } from '../../src/cache';
import * as expect  from 'expect';
import { idFor } from '../../src/utils';
import { css, flush } from '../../src';
import { multiIndexCache } from '../../src/cache/MultiIndexCache'
import { generateCss, StyleAttribute } from '../../src/css'

describe('cahce.ts', ()=>{
    afterEach(()=>{
        flush();
    });

    it('caches the styles with the rigth ID ',()=>{
        let x = css({':hover':{color:'red'}})
        expect(registered.has(idFor(x))).toBeTruthy();
        expect(ruleCache.has(idFor(x))).toBeTruthy();
        expect(inserted.has(idFor(x))).toBeTruthy();

    });

    it('resgistered the right values in the cache', ()=>{
        let x = css({':hover':{color:'red'}});

        const y = {
                    id:idFor(x),
                    style:{label:[], '&:hover':{color:'red'}},
                    label:'',
                    type:'css'}

        expect(registered.get(idFor(x))).toEqual(y);
    });

    it('caches the right rule', ()=>{
        const x = css({':hover':{color:'red'}});
        const y = {'data-css-vnqrqn' : ''}

        expect(ruleCache.get(idFor(x))).toEqual(y)

    });

    it('flushes the caches', ()=>{
            css({':hover':{color:'red'}});
            expect(ruleCache.counts()).toBe(1);
            expect(registered.counts()).toBe(1);
            expect(inserted.counts()).toBe(1);
            flush();
            expect(ruleCache.counts()).toBe(0);
            expect(registered.counts()).toBe(0);
            expect(inserted.counts()).toBe(0);
    });

    it('does not add the same style twice', ()=>{
        css({backgrounedColor:'red', ':hover':{color:'blue'}})
        css({backgrounedColor:'red', ':hover':{color:'blue'}})

        expect(inserted.counts()).toEqual(1);
        expect(ruleCache.counts()).toEqual(1);
        expect(registered.counts()).toEqual(1);
        expect(document.getElementsByTagName('STYLE')[0].innerHTML).toEqual('.css-mbxlkd,[data-css-mbxlkd]{backgrouned-color:red;}.css-mbxlkd:hover,[data-css-mbxlkd]:hover{color:blue;}');
    });

    it('Multi Index Cache works well with generateCss', ()=>{
        let spy = expect.createSpy((...args)=> generateCss(args) ).andCallThrough();
        let myfn = multiIndexCache(spy, (spec : StyleAttribute)=>  registered.has(spec.toString().substring(4) ));
        let x = {color:'red'};
        let y = { backgrounedColor: 'white'};
        myfn(x, y);
        myfn(x, y);
        expect(spy.calls.length).toEqual(1);
    });

    it('Multi Index Cache works well with anynomys function', ()=>{
        let spy = expect.createSpy((...args)=> 'Hello World!' ).andCallThrough()  ;
        let myfn = multiIndexCache(spy);
        let x = {color:'red'};
        let y = { backgrounedColor: 'white'};
        myfn(x, y);
        myfn(x, y);
        expect(spy.calls.length).toEqual(1);
    });

    it('Multi Index Cache does not work if the order of parameters has been changed', ()=>{
        let spy = expect.createSpy((...args)=> 'Hello World!' ).andCallThrough();
        let myfn = multiIndexCache(spy);
        let x = {color:'red'};
        let y = { backgrounedColor: 'white'};
        myfn(x, y);
        myfn( y,x);
        expect(spy.calls.length).toEqual(2);
    });


});