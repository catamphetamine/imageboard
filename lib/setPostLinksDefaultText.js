import visitPostParts from 'social-components/utility/post/visitPostParts.js'

import getPostLinkDefaultText from './getPostLinkDefaultText.js'

/**
 * Sets `post-link`s `content`:
 * if a linked post was deleted then `content` is set to
 * "Deleted comment" and if the message is hidden then `content`
 * is set to "Hidden comment", otherwise it's set to "Comment".
 * @param {any} content — Post `content`
 * @param {object} options.messages
 * @return {boolean} [contentDidChange] — Returns `true` if any `post-link`'s `content` was changed.
 */
export default function setPostLinksDefaultText(content, { messages }) {
	if (messages.comment) {
		const results = visitPostParts(
			'post-link',
			(postLink) => {
				const newContent = getPostLinkDefaultText(postLink, messages)
				if (newContent) {
					postLink.content = newContent
					return true
				}
			},
			content
		)
		return results.filter(_ => _).length > 0
	}
}