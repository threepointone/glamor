export const transform = data => {
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
