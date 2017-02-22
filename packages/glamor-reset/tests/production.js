import 'babel-polyfill';
import { render, unmountComponentAtNode } from 'react-dom'
import { speedy, flush, presets, styleSheet } from 'glamor';
speedy(true);
import React from 'react';
import expect from 'expect'
require('../src');

const expectedRulesCount = `html { font-family: sans-serif; line-height: 1.15; }
body { margin: 0px; }
article, aside, footer, header, nav, section { display: block; }
h1 { font-size: 2em; margin: 0.67em 0px; }
figcaption, figure, main { display: block; }
figure { margin: 1em 40px; }
hr { box-sizing: content-box; height: 0px; overflow: visible; }
pre { font-family: monospace, monospace; font-size: 1em; }
a { background-color: transparent; }
a:active, a:hover { outline-width: 0px; }
abbr[title] { border-bottom-style: none; text-decoration: underline; }
b, strong { font-weight: inherit; }
b, strong { font-weight: bolder; }
code, kbd, samp { font-family: monospace, monospace; font-size: 1em; }
dfn { font-style: italic; }
mark { background-color: rgb(255, 255, 0); color: rgb(0, 0, 0); }
small { font-size: 80%; }
sub, sup { font-size: 75%; line-height: 0; position: relative; vertical-align: baseline; }
sub { bottom: -0.25em; }
sup { top: -0.5em; }
audio, video { display: inline-block; }
audio:not([controls]) { display: none; height: 0px; }
img { border-style: none; }
svg:not(:root) { overflow: hidden; }
button, input, optgroup, select, textarea { font-family: sans-serif; font-size: 100%; line-height: 1.15; margin: 0px; }
button, input { overflow: visible; }
button, select { text-transform: none; }
button, html [type="button"], [type="reset"], [type="submit"] { -webkit-appearance: button; }
fieldset { border: 1px solid rgb(192, 192, 192); margin: 0px 2px; padding: 0.35em 0.625em 0.75em; }
legend { box-sizing: border-box; color: inherit; display: table; max-width: 100%; padding: 0px; white-space: normal; }
progress { display: inline-block; vertical-align: baseline; }
textarea { overflow: auto; }
[type="checkbox"], [type="radio"] { box-sizing: border-box; padding: 0px; }
[type="number"]::-webkit-inner-spin-button, [type="number"]::-webkit-outer-spin-button { height: auto; }
[type="search"] { -webkit-appearance: textfield; outline-offset: -2px; }
[type="search"]::-webkit-search-cancel-button, [type="search"]::-webkit-search-decoration { -webkit-appearance: none; }
*::-webkit-file-upload-button { -webkit-appearance: button; font-family: inherit; font-size: inherit; font-style: inherit; font-variant: inherit; font-weight: inherit; line-height: inherit; }
details, menu { display: block; }
summary { display: list-item; }
canvas { display: inline-block; }
template { display: none; }
[hidden] { display: none; }`.split('\n').length;

describe('glamor-reset:production', () => {

  it('inserts an appropriate number of normalize styles', () => {
    expect(styleSheet.rules().length).toEqual(expectedRulesCount)
    })
})
