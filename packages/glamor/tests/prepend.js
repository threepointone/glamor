import { StyleSheet } from '../src/sheet';
import expect from 'expect'

describe('StyleSheet prepend', () => {
  it('can initialize in prepend mode', () => {
    // insert a style tag that isn't glamor (cssmodules or something)
    let tag = document.createElement('style');
    tag.type = 'text/css';
    tag.setAttribute('data-is-css-modules', '')
    tag.appendChild(document.createTextNode(''));
    (document.head || document.getElementsByTagName('head')[0]).appendChild(tag);

    let sheet = new StyleSheet();
    sheet.inject({ prepend: true });
    expect([ ...document.styleSheets ].filter(s => s.ownerNode === sheet.tags[0]).length).toEqual(1);
    expect([ ...document.styleSheets ].findIndex(s => s.ownerNode === sheet.tags[0])).toEqual(0);
      expect(sheet.tags[0].hasAttribute('data-glamor')).toEqual(true)
    sheet.flush();
  })
})
