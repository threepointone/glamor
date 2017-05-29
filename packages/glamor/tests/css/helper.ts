import { isSelector, joinMediaQueries, joinSupports } from '../../src/css/helper'
import * as expect from 'expect'


describe('css helpers functions', ()=>{

    it(`knows if an object's key is a css selector`, ()=>{
        const obj = {':hover':{'color':'red'},
                     '.myclass': {'font':'arial'},
                     '[data-css-asd233]': {'size':'15px'},
                     '>p':{'padding':'10px'}    
                    }
        const obj2 = {'key1':{'font-size':'12px'},
                      '.myclassName':{'color':'red'}
                     }
    Object.keys(obj).forEach((key)=>{
        expect(isSelector(key)).toBeTruthy()
    });
    expect(isSelector(Object.keys(obj2)[0])).toBeFalsy();
    expect(isSelector(Object.keys(obj2)[1])).toBeTruthy();

    })

    it('can merge multiple media queries in one single query', ()=>{
        const qu1 = '@media only print'
        const qu2 = '@media only screen and (max-device-width: 480px)'
        expect(joinMediaQueries(qu1, qu2)).toEqual('@media  only print and  only screen and (max-device-width: 480px)')
        expect(joinMediaQueries('', qu1)).toEqual(qu1)
        expect(joinMediaQueries('', qu2)).toEqual(qu2)

    })

    it('can merge multiple supprots queries in one single query', ()=>{
        const qu1 = '@supports (display: flex)';
        const qu2 = '@supports (-webkit-appearance: caret)';
        expect(joinSupports(qu1, qu2)).toEqual('@supports  (display: flex) and  (-webkit-appearance: caret)');
        expect(joinSupports('', qu1)).toBe(qu1);
        expect(joinSupports('', qu2)).toBe(qu2);

    })
})