import setInReplyToQuotes from './setInReplyToQuotes'
import setPostLinksContent from './setPostLinksContent'

/**
 * Sets "Deleted message" `content` for links to deleted comments.
 * Sets "Hidden message" `content` for links to hidden comments.
 * Autogenerates "in reply to" quotes for links to all other comments.
 * @param  {any} content — Comment content.
 * @param  {function} getCommentById — Returns a `comment` by its `id`.
 * @param  {object} options — `{ threadId, messages }`.
 * @return {boolean} [contentDidChange] — Returns `true` if `content` has been changed as a result.
 */
export default function generateQuotes(content, {
	// (required) Is used to access `comment.attachments`
	// for generating comment preview if it's too long.
	comment,
	// (required) Returns a `comment` by its `id`.
	getCommentById,
	// (required) Comment thread id.
	// Historically comments on imageboards can reference comments from other threads.
	// For example: `"Previous thread: >>12345"`.
	// For such other-thread comments the quotes can't be generated because
	// there's no content data for them. Therefore, `threadId` is used to filter
	// only links to current thread comments.
	threadId,
	// (optional) "Messages" ("strings", "labels") used when generating comment `content` text.
	messages,
	// Is this function being called for the first time for this comment.
	isFirstRun,
	// `isParentCommentUpdate` is `true` in cases when this comment's update
	// was triggered by a "parent" comment update.
	isParentCommentUpdate
}) {
	let contentDidChange = true
	if (isParentCommentUpdate) {
		contentDidChange = false
	}
	if (isFirstRun || isParentCommentUpdate) {
		// Autogenerate "in reply to" quotes.
		if (setInReplyToQuotes(content, getCommentById, { threadId, messages })) {
			contentDidChange = true
		}
	}
	if (isFirstRun) {
		// Set "Deleted message" `content` for links to deleted comments.
		// Set "Hidden message" `content` for links to hidden comments.
		// Autogenerate "in reply to" quotes for links to all other comments.
		if (messages) {
			if (setPostLinksContent(content, { messages })) {
				contentDidChange = true
			}
		}
	}
	return contentDidChange
}