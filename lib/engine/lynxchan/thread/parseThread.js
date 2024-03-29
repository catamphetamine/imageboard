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
		pinned: pinned,
		trimming: cyclic,
		commentsCount: getCommentsCount(postCount, posts, typeof omittedPosts === 'number' ? omittedPosts : ommitedPosts, mode, threadId),
		commentAttachmentsCount: getAttachmentsCountInComments(fileCount, posts, omittedFiles, mode),
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
	// 	thread.hidden = true
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
		if (mode === 'thread') {
			thread.comments = thread.comments.concat(posts)
		}
	}
	return thread
}

// On `kohlchan.net`:
// * `postCount`:
//   * is not `undefined` when `mode: "catalog"`.
//   * is `undefined` when `mode: "threads-pages"`.
// * `posts`:
//   * is `undefined` when `mode: "catalog"`.
//   * is not `undefined` when `mode: "threads-pages"`.
// * `omittedPosts`:
//   * seems to be `undefined` in any case on `kohlchan.net`.
function getCommentsCount(postCount, posts, omittedPosts, mode, threadId) {
	// `lynxchan` doesn't provide `postCount` in "get thread" API response.
	// In `/catalog.json` reponse `posts` property is always non-present,
	// while in "get thread" API response it seems to always be present:
	// even when there're no replies, `posts` is `[]`.
	if (mode === 'thread') {
		return posts.length + 1
	}
	// If `omittedPosts` property is present then it's a threads list page.
	if (mode === 'threads-page') {
		// Guess: when `omittedPosts` is `0`, the API response doesn't contain that property at all.
		// Another fact: as of Dec 2023, `kohlchan.net` doesn't return `omittedPosts` property at all.
		if (omittedPosts === undefined) {
			omittedPosts = 0
		}
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

function getAttachmentsCountInComments(fileCount, posts, omittedFiles, mode) {
	// `lynxchan` doesn't provide `fileCount` in "get thread" API response,
	// so count the attachments manually.
	//
	// The `posts` property is not present in `/catalog.json` reponse,
	// but is always present "get thread" API response.
	// Even when there're no replies, the `posts` property value is `[]`.
	//
	if (mode === 'thread') {
		return posts.reduce((sum, post) => sum + post.files.length, 0)
	}

	// `omittedFiles` property has been added in version `2.7.0`.
	// https://gitgud.io/LynxChan/LynxChan/-/issues/53
	// The property is present in "get threads list page" API response.
	if (mode === 'threads-page') {
		// Guess: when `omittedFiles` is `0`, the API response doesn't contain that property at all.
		// Another fact: as of Dec 2023, `kohlchan.net` doesn't return `omittedFiles` property at all.
		if (omittedFiles === undefined) {
			omittedFiles = 0
		}
		return omittedFiles + posts.reduce((sum, post) => sum + post.files.length, 0)
	}

	// Uses a workaround for a `lynxchan` bug:
	// `lynxchan` doesn't return `fileCount`
	// in `/catalog.json` API response
	// when there're no replies in a thread.
	//
	// There's no such bug on `kohlchan.net` though,
	// because they've patched those types of bugs themselves
	// on top of the original `lynxchan` code.
	//
	if (fileCount === undefined) {
		fileCount = 0
	}
	return fileCount
}

function getAttachmentsCountInOriginalPost(files, mode) {
	if (mode === 'thread') {
		return files.length
	}

	if (mode === 'threads-page') {
		return files.length
	}

	// There could be any number of attachments on the "opening comment":
	// `lynxchan` doesn't provide that info in "/catalog.json" API response.
	// The guess is `1`.
	//
	// On `kohlchan.net` they do provide the `files` array in `/catalog.json` API response.
	// That's because they've patched `lynxchan` themselves and fixed such types of bugs.
	//
	if (files) {
		return files.length
	}
	return 1
}

function getAttachmentsCount(fileCount, posts, files, omittedFiles, mode) {
	return getAttachmentsCountInOriginalPost(files, mode) + getAttachmentsCountInComments(fileCount, posts, omittedFiles, mode)
}