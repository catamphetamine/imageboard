import visitPostParts from 'social-components/utility/post/visitPostParts.js'

import getPostLinkDefaultText from './getPostLinkDefaultText.js'

/**
 * Sets `post-link`s `content`:
 * if a linked post was deleted then `content` is set to
 * "Deleted comment", otherwise it's set to "Comment".
 * @param {any} content — Post `content`
 * @param {object} [options.messages] — Localized labels. See the "Messages" section in the readme.
 * @param {function} [options.getPostLinkText] — An optional function that might return a text for a `post-link` or `undefined`. Receives a `post-link` as an argument.
 * @return {boolean} [contentDidChange] — Returns `true` if any `post-link`'s `content` was changed.
 */
export default function setPostLinksText(content, { messages, getPostLinkText }) {
	const results = visitPostParts(
		'post-link',
		(postLink) => {
			let newContent
			if (getPostLinkText) {
				newContent = getPostLinkText(postLink)
			}
			if (!newContent) {
				if (messages) {
					newContent = getPostLinkDefaultText(postLink, messages)
				}
			}
			if (newContent) {
				postLink.content = newContent
				// postLink.contentWasSet = true
				return true
			}
		},
		content
	)
	return results.filter(_ => _).length > 0
}