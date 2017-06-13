import { createElement } from 'glamor-react' // eslint-disable-line no-unused-vars
/** @jsx createElement */


// @value primary, secondary from 'styles/colors.css';
import React, { PropTypes } from 'react'
import { css } from 'glamor'
import { vars } from 'glamor-react'

@vars()
export class Header extends React.Component {
    static propTypes = {
        name: PropTypes.string,
        profileImageUrl: PropTypes.string,
        screenName: PropTypes.string,
        url: PropTypes.string
    }
    styles = {
        header: {
            display: 'flex',
            padding: '1rem 0 .65625rem'
        },

        profile: {
            flex: '1 0 0',
            margin: '0 .3rem'
        },

        image: {
            borderRadius: '.35rem',
            display: 'block',
            width: '100%'
        },

        user: {
            flex: '7 0 0',
            margin: '0 .3rem'
        },

        url: css({
            display: 'inline-block',
            marginTop: '-.15rem',
            ':hover .name': {
                textDecoration: 'underline'
            },
            ' .name': {
                color: this.props.vars.primary,
                fontWeight: 700
            }
        }),

        screenName: css({
            color: this.props.vars.secondary,
            ':before': {
                content: '"\\a"',
                whiteSpace: 'pre'
            }
        })

    }
    render() {
        let styles = this.styles
        let { url, profileImageUrl, screenName, name } = this.props
        return <div css={styles.header}>
            <div css={styles.profile}>
                <a href={url}>
                    <img css={styles.image} src={profileImageUrl} alt={name} />
                </a>
            </div>
            <div css={styles.user}>
                <a css={styles.url} href={url}>
                    <span className="name">{name}</span>
                    <span css={styles.screenName}>@{screenName}</span>
                </a>
            </div>
        </div>
    }
}

