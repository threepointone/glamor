import { createElement } from '../../src/react' // eslint-disable-line no-unused-vars
/** @jsx createElement */

import React from 'react'

import { insertRule, merge, media } from '../../src'
import '../../src/reset'

import { vars } from '../../src/react'

import { Tweet } from './tweet'
import data from './data.json'


@vars({
  accent: '#1da1f2',
  animation: '#e81c4f',
  border: '#e1e8ed',
  primary: '#292f33',
  secondary: '#8899a6'
})
export class App extends React.Component {
  styles = {
    throwaways: [ `html {
      color: ${this.props.vars.primary};
      font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
      font-size: 14px;
      line-height: 1.3125;
    }`,`a {
      text-decoration: none;
    }`, `svg {
      fill: currentColor;
      height: 1.25em;
    }`, `@media screen and (min-width: 360px) {
      html {
        font-size: 15px;
      }
    }`, `@media screen and (min-width: 600px) {
      html {
        font-size: 16px;
      }
    }` ].map(x => insertRule(x)),
    container:  merge({
      margin: '0 auto',
      width: '100%'
    }, media('screen and (min-width: 360px)', {
      maxWidth: '400px'
    }), media('screen and (min-width: 600px)', {
      maxWidth: '600px'
    }))
  }
  render() {
    return <div css={this.styles.container}>
      <Tweet data={data} />
    </div>  
  }
}
