import { createElement } from '../../src/react' // eslint-disable-line no-unused-vars
/** @jsx createElement */

import React, { PropTypes } from 'react' //eslint-disable-line no-unused-vars
import { merge, select } from '../../src'
import { vars } from '../../src/react'


@vars()
export class Content extends React.Component {
  static propTypes = {
    media: PropTypes.object,
    text: PropTypes.string
  }
  styles = {
    text: merge({ 
      fontSize: '1.25rem',
      fontWeight: 300,
      lineHeight: '1.5em',
      margin: 0,
      padding: '.65625rem 0 .98438rem'
    }, select(' a', {
      color: this.props.vars.accent
    })),
    media: {
      borderRadius: '.35rem',
      border: `1px solid ${this.props.vars.border}`,
      display: 'block',
      margin: '.65625rem 0 1.3125rem'
    },
    image: {
      display: 'block',
      maxWidth: '100%'
    }
  }
  render() {
    let { media, text } = this.props
    let styles = this.styles 
    return <div>
      <p css={styles.text} dangerouslySetInnerHTML={{ __html: text }} />
      <a css={styles.media} href={media.expanded_url}>
        <img css={styles.image} src={media.media_url_https} alt="" />
      </a>
    </div>
  }
}

