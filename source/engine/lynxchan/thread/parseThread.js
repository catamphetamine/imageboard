/**
 * Parses chan API response for a thread.
 * @param  {object} response — Chan API response for a thread
 * @param  {object} options
 * @return {object} See README.md for "Thread" object description.
 */
export default function parseThread({
	threadId,
	subject,
	locked,
	pinned,
	cyclic,
	autoSage,
	lastBump,
	forceAnonymity,
	maxFileCount,
	maxMessageLength,
	postCount,
	fileCount,
	posts,
	files
}) {
	const thread = {
		id: threadId,
		title: subject,
		isLocked: locked,
		isSticky: pinned,
		isRolling: cyclic,
		commentsCount: getCommentsCount(postCount, posts),
		attachmentsCount: getAttachmentsCount(fileCount, posts, files)
	}
	// `autoSage: true` can be set on a "sticky" thread for example.
	if (autoSage) {
		thread.isBumpLimitReached = true
	}
	// `lastBump` is only present in `/catalog.json` API response.
	if (lastBump) {
		thread.updatedAt = new Date(lastBump)
	}
	// Only for "get thread" API response.
	if (forceAnonymity) {
		// `forceAnonymity: true` disables author names in a thread:
		// forces empty/default `name` on all posts of a thread.
		thread.forceAnonymity = true
	}
	return thread
}

function getCommentsCount(postCount, posts) {
	// `lynxchan` doesn't provide `postCount` in "get thread" API response.
	// In `/catalog.json` reponse `posts` property is always non-present,
	// while in "get thread" API response it seems to always be present:
	// even when there're no replies, `posts` is `[]`.
	// so `if (posts)` means `if ("get thread" API response)`.
	if (posts) {
		return posts.length
	}
	// Uses a workaround for a `lynxchan` bug:
	// `lynxchan` doesn't return `postCount`
	// in `/catalog.json` API response
	// if there're no replies in a thread.
	return postCount || 0
}

function getAttachmentsCount(fileCount, posts, files) {
	// `lynxchan` doesn't provide `fileCount` in "get thread" API response.
	// In `/catalog.json` reponse `posts` property is always non-present,
	// while in "get thread" API response it seems to always be present:
	// even when there're no replies, `posts` is `[]`.
	// so `if (posts)` means `if ("get thread" API response)`.
	if (posts) {
		return files.length + posts.reduce((sum, post) => sum + post.files.length, 0)
	}
	//
	// Uses a workaround for a `lynxchan` bug:
	// `lynxchan` doesn't return `fileCount`
	// in `/catalog.json` API response
	// if there're no attachments in thread's replies.
	//
	// `fileCount` doesn't include the "opening comment"'s attachments.
	// There could be any number of attachments on the "opening comment":
	// `lynxchan` doesn't provide that info in "get threads" API response.
	// The guess is `1`.
	//
	return (fileCount || 0) + 1
}