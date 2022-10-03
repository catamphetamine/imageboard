/**
 * Parses chan API response for a thread.
 * @param  {object} response — Chan API response for a thread
 * @param  {object} options
 * @return {object} See README.md for "Thread" object description.
 */
export default function parseThread({
	threadId,
	locked,
	pinned,
	cyclic,
	archived,
	autoSage,
	lastBump,
	maxFileCount,
	maxMessageLength,
	postCount,
	fileCount,
	posts,
	files,
	trash,
	uniquePosters,
	// `omittedPosts` was incorrectly named `ommitedPosts` before version `2.7.0`.
	ommitedPosts,
	omittedPosts,
	// `omittedFiles` has been added in version `2.7.0`.
	omittedFiles,
	...rest
}, {
	mode
}) {
	const thread = {
		id: threadId,
		locked: locked,
		onTop: pinned,
		trimming: cyclic,
		commentsCount: getCommentsCount(postCount, posts, omittedPosts || ommitedPosts, mode),
		attachmentsCount: getAttachmentsCount(fileCount, posts, files, omittedFiles, mode)
	}
	// LynxChan allows manually archiving a thread by an admin or a moderator.
	if (archived) {
		thread.archived = true
		// LynxChan doesn't provide an `archivedAt` date.
	}
	// `uniquePosters` property was added in LynxChan 2.8
	// in "get thread" API response.
	// For some reason, it's still `0` on `kohlchan.net`.
	if (uniquePosters) {
		thread.uniquePostersCount = uniquePosters
	}
  // A thread could be moved to a "trash bin" in LynxChan >= 2.8:
  // "Trash post only hides the post from the public and can be restored
  //  later by staff. Delete post permanently deletes it."
  // I assume, that means that threads from the "trash bin"
  // are only visible to the staff and not to the public.
	// if (trash) {
	// 	thread.isHidden = true
	// }
	// `autoSage: true` can be set on a "sticky" thread for example.
	if (autoSage) {
		thread.bumpLimitReached = true
	}
	// `lastBump` is only present in `/catalog.json` API response.
	if (lastBump) {
		thread.updatedAt = new Date(lastBump)
	}
	thread.comments = [{
		postId: threadId,
		files,
		...rest
	}]
	if (posts) {
		thread.comments = thread.comments.concat(posts)
	}
	return thread
}

function getCommentsCount(postCount, posts, omittedPosts, mode) {
	// `lynxchan` doesn't provide `postCount` in "get thread" API response.
	// In `/catalog.json` reponse `posts` property is always non-present,
	// while in "get thread" API response it seems to always be present:
	// even when there're no replies, `posts` is `[]`.
	if (mode === 'thread') {
		return posts.length + 1
	}
	// If `omittedPosts` property is present then it's a threads list page.
	if (mode === 'threads-page') {
		return omittedPosts + 1 + posts.length
	}
	// Uses a workaround for a `lynxchan` bug:
	// `lynxchan` doesn't return `postCount`
	// in `/catalog.json` API response
	// when there're no replies in a thread.
	//
	// There's no such bug on `kohlchan.net` though,
	// because they patch those types of bugs themselves
	// on top of the original `lynxchan` code.
	//
	return (postCount || 0) + 1
}

function getAttachmentsCount(fileCount, posts, files, omittedFiles, mode) {
	// `lynxchan` doesn't provide `fileCount` in "get thread" API response.
	// In `/catalog.json` reponse `posts` property is always non-present,
	// while in "get thread" API response it seems to always be present:
	// even when there're no replies, `posts` is `[]`.
	if (mode === 'thread') {
		return files.length + posts.reduce((sum, post) => sum + post.files.length, 0)
	}

	// `omittedFiles` property has been added in version `2.7.0`.
	// https://gitgud.io/LynxChan/LynxChan/-/issues/53
	// They're present in "get threads list page" API response.
	if (mode === 'threads-page') {
		if (omittedFiles === undefined) {
			omittedFiles = 0
		}
		return omittedFiles + files.length + posts.reduce((sum, post) => sum + post.files.length, 0)
	}

	// There could be any number of attachments on the "opening comment":
	// `lynxchan` doesn't provide that info in "/catalog.json" API response.
	// The guess is `1`.
	//
	// On `kohlchan.net` they do provide the `files` array
	// in `/catalog.json` API response.
	// That's because they've patched `lynxchan` themselves
	// and fixed such types of bugs.
	//
	const mainCommentAttachmentsCount = files ? files.length : 1

	// Uses a workaround for a `lynxchan` bug:
	// `lynxchan` doesn't return `fileCount`
	// in `/catalog.json` API response
	// when there're no replies in a thread.
	//
	// There's no such bug on `kohlchan.net` though,
	// because they've patched those types of bugs themselves
	// on top of the original `lynxchan` code.
	//
	// `fileCount` doesn't include the "main comment"'s attachments,
	// so add the "main comment" attachments count to it.
	//
	return (fileCount || 0) + mainCommentAttachmentsCount
}