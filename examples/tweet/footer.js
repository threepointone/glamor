import {createElement} from '../../src/react' // eslint-disable-line
/** @jsx createElement */

import React, { Component, PropTypes } from 'react'

import { reply, retweet, like, more } from './svgs'
// import  from 'assets/retweet.svg'
// import LikeIcon from 'assets/like.svg'
// import MoreIcon from 'assets/more.svg'

import { keyframes } from '../../src'
import { vars } from '../../src/react'

// import styles from './footer.css'

let liked = keyframes({
  '50%': {
    transform: 'scale(1.2)'
  },
  '100%': {
    transform: 'scale(1)'
  }
})

// const 

// styles.button = merge(styles.icon, styles.button)

@vars()
export class Footer extends Component {
  static propTypes = {
    createdAt: PropTypes.string,
    favoriteCount: PropTypes.number,
    retweetCount: PropTypes.number
  }
  state = { liked: false }
  styles = {
    date: {
      paddingBottom: '.98438rem',
      color: this.props.vars.secondary
    },
    counters: {
      borderTop: '1px solid border',
      padding: '.98438rem 0',
      textTransform: 'uppercase'
    },
    value: {
      fontWeight: 700
    },
    label: {
      color: this.props.vars.secondary,
      fontSize: '.85rem'
    },
    favorite: {
      display: 'inline-block',
      marginLeft: '1.96875rem'
    },
    actions: {
      alignItems: 'center',
      borderBottom: '1px solid border',
      borderTop: '1px solid border',
      color: this.props.vars.secondary,
      display: 'flex',
      fontSize: '1.5rem',
      height: '3.28125rem',
      width: '100%'
    },
    icon: {
      display: 'flex',
      flexGrow: 1,
      justifyContent: 'center',
      textAlign: 'center'
    },
    button: {
      display: 'flex',
      flexGrow: 1,
      justifyContent: 'center',
      textAlign: 'center',
      background: 'none',
      border: 'none',
      color: 'inherit',
      cursor: 'pointer',
      fontSize: 'inherit',
      outline: 'none'
    },
    liked: {
      animation: `$${liked} .25s`,
      color: this.props.vars.animation
    }
  }
  
  handleClick = () => {
    this.setState({
      liked: !this.state.liked
    })
  }

  render() {
    const { createdAt, favoriteCount, retweetCount } = this.props
    const { liked } = this.state
    let { styles } = this 

    return (
      <div>
        <div css={styles.date}>{createdAt}</div>
        <div css={styles.counters}>
          <span>
            <span css={styles.value}>{retweetCount}</span>
            <span css={styles.label}> Retweets</span>
          </span>
          <span css={styles.favorite}>
            <span css={styles.value}>
              {liked ? favoriteCount + 1 : favoriteCount}
            </span>
            <span css={styles.label}> Likes</span>
          </span>
        </div>
        <div css={styles.actions}>
          <div css={styles.icon}>
            {reply()}
          </div>
          <div css={styles.icon}>
            {retweet()}
          </div>
          <button css={styles.button} onClick={this.handleClick}>
            {like(liked && styles.liked)}          
          </button>
          <div css={styles.icon}>
            {more()}
          </div>
        </div>
      </div>
    )
  }
}
