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
export default function getPostLinkDefaultText(postLink, _messages) {
	let messages
	if (_messages.comment) {
		messages = _messages.comment
	}
	// If it's a post link for a post from another thread.
	if (postLink.postIsExternal) {
		if (postLink.postIsRoot && _messages.thread) {
			return _messages.thread
		}
		if (messages && messages.external) {
			return messages.external
		}
	}
	// If the quoted post has been deleted.
	else if (postLink.postWasDeleted) {
		if (messages && messages.deleted) {
			return messages.deleted
		}
	}
	// If the quoted post is hidden.
	else if (postLink.postIsHidden) {
		if (messages && messages.hidden) {
			if (postLink.postIsHiddenRule) {
				return `${messages.hidden} (${postLink.postIsHiddenRule})`
			}
			return messages.hidden
		}
	}
	return messages && messages.default
}