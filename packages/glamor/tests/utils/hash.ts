import { doHash } from '../../src/utils/hash'
import * as expect from 'expect'


describe('hash', ()=>{
    it('can hash a normal sentance with seed', ()=>{
        const str = 'this is a string that I want to hash it'
        expect(doHash(str, 11)).toBe('zeim4p')
    })

    it('can hash a normal sentance without seed', ()=>{
        const str = 'this is a string that I want to hash it'
        expect(doHash(str)).toBe('3rkhwi')
    })

    it('can hash a css style object written as a string without seed',()=>{
        const strObject = `{
            background-color: red,
            font-size: 15px,
            width:1.5rm
        }`
        
        expect(doHash(strObject)).toBe('7c1o51')
    })

    it('can hash a css style object written as a string with seed',()=>{
        const strObject = `{
            background-color: red,
            font-size: 15px,
            width:1.5rm
        }`
        expect(doHash(strObject,100)).toBe('ujxrc6')
    })

    it('can hash a stringified objetc',()=>{
        let x = {
            x:3,
            y:'some value', 
            b: {a:'hello', b:5}
        }
        expect(doHash(JSON.stringify(x))).toBe('1ysasfp')
    })

    // To Do 
    // Try to import css function apply it and then try to hash the returnd value
})