import { createElement } from '../../src/react' // eslint-disable-line no-unused-vars
/** @jsx createElement */

import PropTypes from 'prop-types'
import React from 'react' // eslint-disable-line no-unused-vars

import { Header } from './header'
import { Content } from './content'
import { Footer } from './footer'

const transform = data => {
  let text = data.text

  data.entities.user_mentions.forEach(userMention => {
    text = text.replace(
      `@${userMention.screen_name}`,
      `<a href="https://twitter.com/${userMention.screen_name}">@${userMention.screen_name}</a>`
    )
  })

  data.entities.urls.forEach(url => {
    text = text.replace(
      url.url,
      `<a href="${url.url}">${url.display_url}</a>`
    )
  })

  data.entities.media.forEach(media => {
    text = text.replace(
      media.url,
      ''
    )
  })

  return text.trim()
}


const styles = {
  container: {
    padding: '0 .6rem'
  }
}

export const Tweet = ({ data }) => (
  <div css={styles.container}>
    <Header
      name={data.user.name}
      profileImageUrl={data.user.profile_image_url_https}
      screenName={data.user.screen_name}
      url={data.user.url}
    />
    <Content
      media={data.entities.media[0]}
      text={transform(data)}
    />
    <Footer
      createdAt={data.created_at}
      favoriteCount={data.favorite_count}
      retweetCount={data.retweet_count}
    />
  </div>
)

Tweet.propTypes = {
  data: PropTypes.object
}

// export default Tweet
