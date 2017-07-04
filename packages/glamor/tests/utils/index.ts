import { isLikeRule, simple, idFor, selector, flatten } from '../../src/utils/index'
import * as expect from 'expect'

describe('utiles/index', ()=>{
    it('can detect a well-written rule', ()=>{
        const rule = {'data-css-123dasd': 'hello world'}
        expect(isLikeRule(rule)).toBeTruthy()
    })

    it('can detect a non well-written rule', ()=>{
        const rule = {'color':'red', 'background-color': 'yellow'}
        expect(isLikeRule(rule)).toBeFalsy()
    })

    it('can return an ID from a rule', ()=>{
        const rule = {'toString':'' ,'data-css-12xba2':''}
        expect(idFor(rule)).toBe('12xba2')
    })

    it('can not find an id for a non well-written rule', ()=>{
        const rule = {'toString':'', 'color':'red'}
        expect(function(){ idFor(rule)}).toThrow(/not a rule/)
    })

    it('can simplify a string', ()=>{
        const str = 'helLOWorLD !!123 @#$';
        expect(simple(str)).toEqual('helloworld123')
    })

    it('can turn a nasted array of strings into a simple array of strings', ()=>{
        const arr = ['hello', 'world',['second', 'array', ['another', 'nasted', 'array',['forth', 'array'] ] ] ]
        expect(flatten(arr)).toEqual(['hello', 'world', 'second', 'array', 'another', 'nasted', 'array', 'forth', 'array' ])
    })
})