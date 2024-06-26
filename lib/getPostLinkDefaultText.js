/**
 * Returns an appropriate text of a `post-link`.
 * If a linked post was deleted then it's "Deleted comment".
 * Otherwise, it's just "Comment".
 * Doesn't do `.toLowerCase()` because, for example, in German
 * all nouns are supposed to start with a capital letter.
 * @param  {object} postLink
 * @param  {object} messages — Localized labels. See the "Messages" section in the readme.
 * @return {string} [text]
 */
export default function getPostLinkDefaultText(postLink, messages) {
	let commentTypeMessages
	if (messages.comment) {
		commentTypeMessages = messages.comment
	}

	// If it's a post link for a post from another thread.
	if (postLink.meta.isAnotherThread) {
		if (postLink.meta.commentId === postLink.meta.threadId) {
			if (messages.thread && messages.thread.default) {
				return messages.thread.default
			}
		}
		if (commentTypeMessages && commentTypeMessages.external) {
			return commentTypeMessages.external
		}
	}
	// If the quoted post has been deleted.
	else if (postLink.meta.isDeleted) {
		if (commentTypeMessages && commentTypeMessages.deleted) {
			return commentTypeMessages.deleted
		}
	}

	if (commentTypeMessages) {
		return commentTypeMessages.default
	}
}