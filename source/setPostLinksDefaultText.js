import visitPostParts from 'social-components/commonjs/utility/post/visitPostParts'

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
				const newContent = getPostLinkText(postLink, messages.comment)
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

/**
 * Returns an appropriate text of a `post-link`.
 * @param  {object} postLink
 * @param  {object} messages
 * @return {string} [text]
 */
function getPostLinkText(postLink, messages) {
	// If it's a post link for a post from another thread.
	if (postLink.postIsExternal) {
		return messages.external
	}
	// If the quoted post has been deleted.
	else if (postLink.postWasDeleted) {
		return messages.deleted
	}
	// If the quoted post is hidden.
	else if (postLink.postIsHidden) {
		if (messages.hidden) {
			if (postLink.postIsHiddenRule) {
				return `${messages.hidden} (${postLink.postIsHiddenRule})`
			}
		}
		return messages.hidden
	}
	else {
		return messages.default
	}
}