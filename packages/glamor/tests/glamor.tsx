import * as React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import * as expect from 'expect';
import * as expectJSX from 'expect-jsx';
import { css, styleSheet, flush } from '../src/index';
import { idFor, cssLabels } from '../src/utils';
import { simulations, simulate } from '../src/Simulations';
import { inserted } from '../src/cache';
import { cssFor, attribsFor } from '../src/css';

expect.extend(expectJSX);

let isPhantom = navigator.userAgent.match(/Phantom/);

function childStyle(node, p = null) {
  return window.getComputedStyle(node.childNodes[0], p);
}

function getDataAttributes(node) {
  let d = {}, re_dataAttr = /^data\-(.+)$/;
  Array.from<any>(node.attributes).forEach(attr => {
    if (re_dataAttr.test(attr.nodeName)) {
      let key = attr.nodeName.match(re_dataAttr)[1];
      d[key] = attr.nodeValue;
    }
  });
  return d;
}

describe('glamor', () => {
  let node;
  beforeEach(() => {
    node = document.createElement('div');
    document.body.appendChild(node);
  });

  afterEach(() => {
    unmountComponentAtNode(node);
    document.body.removeChild(node);
    flush();
  });

  it('applies the style to a given node', () => {
    render(<div {...css({ backgroundColor: 'red' }) } />, node, () => {
      expect(childStyle(node).backgroundColor).toEqual('rgb(255, 0, 0)');
    });
  });

  it('accepts nested media queries', () => {
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
      }
    });

    expect(styleSheet.rules().map(x => x.cssText).join('\n')).toEqual(
      `.css-1j2tyha, [data-css-1j2tyha] { color: red; }\n.css-1j2tyha:hover, [data-css-1j2tyha]:hover { color: blue; }\n@media (min-width: 300px) { \n  .css-1j2tyha, [data-css-1j2tyha] { color: green; }\n  .css-1j2tyha:hover, [data-css-1j2tyha]:hover { color: yellow; }\n  .a .css-1j2tyha .c, .a [data-css-1j2tyha] .c { color: rgb(245, 222, 179); }\n  .css-1j2tyha.css-1j2tyha, [data-css-1j2tyha][data-css-1j2tyha] { color: rgb(255, 255, 240); }\n}`
    );
  });

  it('only adds a data attribute to the node', () => {
    let el = <div {...css({ backgroundColor: '#0f0' }) } />;

    render(el, node, () => {
      expect(childStyle(node).backgroundColor).toEqual('rgb(0, 255, 0)');
      (expect(el) as any).toEqualJSX(<div data-css-1xre5mc="" />);
    });
  });

  it('becomes a classname when treated as a string', () => {
    let el = <div className={css({ backgroundColor: '#0f0' }) + ' wellnow'} />;

    render(el, node, () => {
      expect(childStyle(node).backgroundColor).toEqual('rgb(0, 255, 0)');
      (expect(el) as any).toEqualJSX(<div className="css-1xre5mc wellnow" />);
    });
  });

  it('correctly handles display:flex', () => {
    let d = document.documentElement.style;
    if (('flexWrap' in d) || ('WebkitFlexWrap' in d) || ('msFlexWrap' in d)) {
      render(<div {...css({ display: 'flex' }) } />, node, () => {
        expect(childStyle(node).display).toMatch(/flex/);
      });
    }
  });

  it('multiple styles can be combined', () => {
    // 2 methods

    // 1. when you don't expect key clashes and don't worry about precedence
    render(<div {...css({ width: 100 }) } {...css({ height: 100 }) } {...css({ ':hover': { height: 200 } }) } />, node, () => {
      expect(childStyle(node).height).toEqual('100px');
    });
    // 2. when you need fine grained control over which keys get prcedence,
    // manually merge your styles together
    render(<div {...css({ ...{ width: 100 }, ...{ height: 100 } }) } />, node, () => {
      expect(childStyle(node).height).toEqual('100px');
    });
  });

  it('shorthand styles can be combined with long form', () => {
    let rule = css({
      border: '10px solid black'
    }, {
      borderLeftWidth: 50
    });

    render(<div {...rule} />, node, () => {
      expect(childStyle(node).borderLeftWidth).toEqual('50px');
      expect(childStyle(node).borderRightWidth).toEqual('10px');
    });
  });

  it('accepts nested objects', () => {
    simulations(true);
    render(<div {...css({
      color: '#ccc',
      ':hover': { color: 'blue' },
      '> .x': { color: 'yellow' },
      '.a & .c': { color: 'green' }
    }) } {...simulate('hover') } ><span className="x" /></div>, node, () => {
      simulations(false);
      expect(childStyle(node).color).toEqual('rgb(0, 0, 255)');
      expect(childStyle(node.childNodes[0]).color).toEqual('rgb(255, 255, 0)');
    });
  });

  it('nested objects can compose with `composes`', () => {
    let rule1 = css({ color: 'red' });
    let rule2 = css({ color: 'blue' });
    // let rule3 =css({ color: 'green' })
    let rule4 = css({
      composes: [rule1, rule2],
      fontWeight: 'bold'
    });

    render(<div {...rule4} />, node, () => {
      expect(childStyle(node).color).toEqual('rgb(0, 0, 255)');
    });
  });

  it(':not() selector works for multiple selectors');
  it('can use a parent selector to target itself', () => {
    let x = css({ '.foo &': { color: 'red' } });
    render(<div>
      <div className="foo">
        <span {...x}>target</span>
      </div>
      <div className="bar">
        <span {...x}>target</span>
      </div>
    </div>, node, () => {
      let els = node.querySelectorAll(`[${Object.keys(x)[0]}]`);
      expect(window.getComputedStyle(els[0]).color).toEqual('rgb(255, 0, 0)');
      expect(window.getComputedStyle(els[1]).color).toEqual('rgb(0, 0, 0)');
    });
  });

  it('reuses common styles', () => {
    render(<div>
      <div {...css({ backgroundColor: 'blue' }) }></div>
      <div {...css({ backgroundColor: 'red' }) }></div>
      <div {...css({ backgroundColor: 'blue' }) }></div>
    </div>, node, () => {

      // only 2 rules get added to the stylesheet
      expect(
        styleSheet.rules().map(x => x.cssText).filter(x => !!x.trim()).length
      ).toEqual(2);

      let [id0, id1, id2] = [0, 1, 2].map(i => getDataAttributes(node.childNodes[0].childNodes[i]));
      expect(id0).toEqual(id2); // first and third elements have the same hash
      expect(id0).toNotEqual(id1);   // not the second
    });
  });

  it('doesn\'t touch style/className', () => {
    render(<div {...css({ color: 'red' }) } className="whatever" style={{ color: 'blue' }} />, node, () => {
      expect(childStyle(node).color).toEqual('rgb(0, 0, 255)');
      expect(node.childNodes[0].className).toEqual('whatever');
    });
  });

  it('can style pseudo classes', () => {
    render(<div {...css({ ':hover': { color: 'red' } }) } />, node, () => {
      // console.log(childStyle(node, ':hover').getPropertyValue('color'))
      // ^ this doesn't work as I want
      expect(inserted.has('vnqrqn')).toBeTruthy();
      // any ideas on a better test for this?
    });
  });

  it('can simulate pseudo classes', () => {
    // start simulation mode
    simulations(true);
    render(<div {...css({ ':hover': { backgroundColor: 'red' } }) } {...simulate('hover') } />, node, () => {
      simulations(false);
      expect(childStyle(node).backgroundColor).toEqual('rgb(255, 0, 0)');
      // turn it off
    });
  });

  it('can style parameterized pseudo classes', () => {
    let rule = css({ ':nth-child(2)': { color: 'red ' } });
    render(<div>
      <div {...rule} />
      <div {...rule} />
      <div {...rule} />
      <div {...rule} />
    </div>, node, () => {
      expect([0, 1, 2, 3].map(i =>
        parseInt(window.getComputedStyle(node.childNodes[0].childNodes[i]).color.slice(4), 10)))
        .toEqual([0, 255, 0, 0]);
    });
  });

  it('can simulate parameterized pseudo classes', () => {
    simulations(true);
    render(<div
      {...css({ ':nth-child(2)': { backgroundColor: 'blue' } }) }
      {...simulate(':nth-child(2)') }
    />, node, () => {
      simulations(false);
      expect(childStyle(node).backgroundColor).toEqual('rgb(0, 0, 255)');

    });
    // you can use nthChild2 nth-child(2) :nth-child(2), whatever.
    // only if there exists a similar existing rule to match really would it work anyway
  });

  it('css.global should handle falsy values', () => {
    css.global('a', {});
    expect(styleSheet.rules()[0].cssText).toEqual('a { }');

    const backgroundColor = null;
    css.global('a', { backgroundColor });
    // should not add a another empty rule for a
    expect(styleSheet.rules().length).toEqual(1);
  });

  it('can style pseudo elements', () => {
    render(<div {...css({ '::first-letter': { color: 'red' } }) } />, node, () => {
      expect(styleSheet.rules()[0].cssText)
        .toEqual('.css-dde0vi::first-letter, [data-css-dde0vi]::first-letter { color: red; }');
    });
  });

  it('can style media queries', () => {
    // we assume phantomjs/chrome/whatever has a width > 300px
    function last(arr) {
      return arr[arr.length - 1];
    }
    render(<div {...css({ '@media (min-width: 300px)': { color: 'red' } }) } />, node, () => {
      expect(childStyle(node).color).toEqual('rgb(255, 0, 0)');
      expect(last(styleSheet.rules()).cssText.replace(/\s/g, '').replace('alland', '')) // ie quirk
        .toEqual('@media(min-width:300px){.css-1qc7hkg,[data-css-1qc7hkg]{color:red;}}'.replace(/\s/g, ''));
      // ugh
    });
  });

  it('can target pseudo classes/elements inside media queries', () => {
    simulations(true);
    render(<div
      {...css({
        '@media (min-width: 300px)': css({
          ':hover': {
            color: 'red'
          }
        })
      }) }
      {...simulate('hover') }
    />, node, () => {
      expect(childStyle(node).color).toEqual('rgb(255, 0, 0)');
      expect(inserted.has('sxm4ry')).toBeTruthy();
      expect(inserted.has('vnqrqn')).toBeTruthy();
      simulations(false);
    });
  });

  it('can merge rules', () => {
    simulations(true);
    let blue = css({ backgroundColor: 'blue' }),
      red = css({ backgroundColor: 'red', color: 'yellow' }),
      hoverGn = css({ ':hover': { color: 'green' } });

    render(<div {...css(red, blue, hoverGn) } />, node, () => {
      expect(childStyle(node).backgroundColor).toEqual('rgb(0, 0, 255)');
    });
    let sheetLength = styleSheet.rules().length;

    render(<div {...css(red, blue, hoverGn) } {...simulate('hover') } />, node, () => {
      expect(childStyle(node).color).toEqual('rgb(0, 128, 0)');
      expect(styleSheet.rules().length).toEqual(sheetLength);
    });
    simulations(false);
  });

  it('has an escape hatch', () => {
    render(<div {...css({ ' .item': { color: 'red' } }) }>
      <span>this is fine</span>
      <span className="item">this is red</span>
    </div>, node, () => {
      let top = node.childNodes[0];
      let first = top.childNodes[0];
      let second = top.childNodes[1];
      expect(window.getComputedStyle(first).color).toEqual('rgb(0, 0, 0)');
      expect(window.getComputedStyle(second).color).toEqual('rgb(255, 0, 0)');
    });
    // todo - test classnames, operators combos
  });

  it('css() accepts contextual selectors', () => {
    render(<div className="up">
      <div {...css({ '.up & .down': { color: 'red' } }) }>
        <div className="down">hello world</div>
        <div className="notdown">hello world</div>
      </div>
    </div>, node, () => {
      expect(window.getComputedStyle(node.querySelector('.down')).color).toEqual('rgb(255, 0, 0)');
      expect(window.getComputedStyle(node.querySelector('.notdown')).color).toEqual('rgb(0, 0, 0)');
      expect(styleSheet.rules().map(x => x.cssText).join('').replace(/\s/g, '')).toEqual('.up.css-1sk4o1x.down,.up[data-css-1sk4o1x].down{color:red;}');
    });
  });

  it('generates debug labels', () => {
    cssLabels(true);
    let red = css({ label: 'red', color: 'red' }),
      hoverBlue = css({ ':hover': { label: 'blue', color: 'blue' } }),
      text = css(red, hoverBlue),
      container = css(text, css({ ':visited': { fontWeight: 'bold' } }),
        { color: 'gray' }),
      mq = css({ '@media (min-width: 500px)': text });

    let el = <div {...container}>
      <ul {...css({ label: 'mylist' }) }>
        <li {...css({ ':hover': { color: 'green' } }) }>one</li>
        <li >two</li>
        <li {...mq}>three</li>
      </ul>
    </div>;

    (expect(el) as any).toEqualJSX(<div data-css-1kmgssg="red.blue">
      <ul data-css-2n5rz6="mylist">
        <li data-css-165e3g5="">one</li>
        <li>two</li>
        <li data-css-1tjidk0="red.blue">three</li>
      </ul>
    </div>);
    cssLabels(false);

  });


  // plain rules
  // merged rules
  // media query wrap / override?
  it('uses WeakMaps to cache input objects');

  if (isPhantom) {
    it('adds vendor prefixes', () => {
      render(<div {...css({ color: 'red', transition: 'width 2s' }) } />, node, () => {
        expect(styleSheet.rules()[0].cssText)
          .toEqual('.css-19hf94w, [data-css-19hf94w] { color: red; -webkit-transition: width 2s; transition: width 2s; }');
      });
    });


    // it('should be able to add fonts', () => {
    //   // todo - doesn't look like unicode-range works
    //   const latin = {
    //     fontFamily: 'Open Sans',
    //     fontStyle: 'normal',
    //     fontWeight: 400,
    //     src: 'local(\'Open Sans\'), local(\'OpenSans\'), url(https://fonts.gstatic.com/s/opensans/v13/cJZKeOuBrn4kERxqtaUH3ZBw1xU1rKptJj_0jans920.woff2) format(\'woff2\')'
    //   };

    //   let f = css.fontFace(latin);
    //   expect(styleSheet.rules()[0].cssText.replace(/\s/g, ''))
    //     .toEqual('@font-face { font-family: \'Open Sans\'; font-style: normal; font-weight: 400; src: local(Open Sans), local(OpenSans), url(https://fonts.gstatic.com/s/opensans/v13/cJZKeOuBrn4kERxqtaUH3ZBw1xU1rKptJj_0jans920.woff2) format(woff2); }'.replace(/\s/g, ''));
    //   expect(f).toEqual('Open Sans');

    // });

    // it('can add animation keyframes', () => {
    //   let animate = css.keyframes('bounce', {
    //     '0%': {
    //       transform: 'scale(0.1)',
    //       opacity: 0
    //     },
    //     '60%': {
    //       transform: 'scale(1.2)',
    //       opacity: 1
    //     },
    //     '100%': {
    //       transform: 'scale(1)'
    //     }
    //   });
    //   expect(styleSheet.rules()[0].cssText.replace(/\s/g, ''))
    //     .toEqual('@-webkit-keyframesbounce_zhy6v5{0%{-webkit-transform:scale(0.1);opacity:0;}60%{-webkit-transform:scale(1.2);opacity:1;}100%{-webkit-transform:scale(1);}}');
    //   expect(animate).toEqual('bounce_zhy6v5');

    // });
  }

  // it('can generate css from rules', () => {
  //   let red = css({ color: 'red' }),
  //     blue = css({ ':hover': { color: 'blue' } }),
  //     merged = css(red, blue);

  //   expect(cssFor(red, merged))
  //     .toEqual('.css-1ezp9xe,[data-css-1ezp9xe]{color:red;}.css-11t3bx0,[data-css-11t3bx0]{color:red;}.css-11t3bx0:hover,[data-css-11t3bx0]:hover{color:blue;}');
  // });

  // it('can generate html attributes from rules', () => {
  //   cssLabels(false);
  //   let red = css({ color: 'red' }),
  //     blue = css({ ':hover': { color: 'blue' } }),
  //     merged = css(red, blue);

  //   expect(attribsFor(red, merged)).toEqual('data-css-1ezp9xe="" data-css-11t3bx0=""');
  //   cssLabels(true);
  // });

  // it('can extract an id from a rule', () => {
  //   let red = css({ color: 'red' });

  //   expect(idFor(red)).toEqual('1ezp9xe');
  // });

  it('checks for a cache miss', () => {
    const myObscureStyle = { 'data-css-obscureclass': '"*"' };

    expect(() => css(myObscureStyle)).toThrow('[glamor] an unexpected rule cache miss occurred. This is probably a sign of multiple glamor instances in your app. See https://github.com/threepointone/glamor/issues/79');
  });
});
