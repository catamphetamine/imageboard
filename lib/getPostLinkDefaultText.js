/**
 * Returns an appropriate text of a `post-link`.
 * If a linked post was deleted then it's "Deleted comment".
 * If the message is hidden then it's "Hidden comment".
 * Otherwise, it's just "Comment".
 * Doesn't do `.toLowerCase()` because, for example, in German
 * all nouns are supposed to start with a capital letter.
 * @param  {object} postLink
 * @param  {object} messages
 * @return {string} [text]
 */
export default function getPostLinkDefaultText(postLink, messages) {
	let commentTypeMessages
	if (messages.comment) {
		commentTypeMessages = messages.comment
	}

	// If it's a post link for a post from another thread.
	if (postLink.postIsExternal) {
		if (postLink.postIsRoot && messages.thread && messages.thread.default) {
			return messages.thread.default
		}
		if (commentTypeMessages && commentTypeMessages.external) {
			return commentTypeMessages.external
		}
	}
	// If the quoted post has been deleted.
	else if (postLink.postWasDeleted) {
		if (commentTypeMessages && commentTypeMessages.deleted) {
			return commentTypeMessages.deleted
		}
	}
	// If the quoted post is hidden.
	else if (postLink.postIsHidden) {
		if (commentTypeMessages && commentTypeMessages.hidden) {
			if (postLink.postIsHiddenRule) {
				return `${commentTypeMessages.hidden} (${postLink.postIsHiddenRule})`
			}
			return commentTypeMessages.hidden
		}
	}

	if (commentTypeMessages) {
		return commentTypeMessages.default
	}
}