/**
 * Parses chan API response for a thread.
 * @param  {object} response — Chan API response for a thread
 * @param  {object} options
 * @return {object} See README.md for "Thread" object description.
 */
export default function parseThread({
	no,
	replies,
	images,
	// Attachment file extension.
	ext,
	// In case of more than a single attachment (8ch, vichan).
	extra_files,
	omitted_images,
	closed,
	locked,
	sticky,
	cyclical,
	unique_ips,
	last_modified,
	bumplocked,
	bumplimit,
	imagelimit,
	archived,
	archived_on,
	custom_spoiler,
	...rest
}, {
	last_replies
} = {}) {
	const thread = {
		// `no` is present in "get threads list" API response.
		id: no,
		onTop: sticky,
		//
		// `4chan.org` has `closed` property.
		// `8ch.net` has `locked` property.
		locked: closed || locked,
		//
		// `vichan` and `OpenIB` have `cyclical: "0" or "1"` property.
		// I guess it's for "trimming" threads.
		// Weird that it's a string rather than a number
		// like it is for `sticky` or `locked`.
		trimming: cyclical === '1',
		//
		commentsCount: getCommentsCount({ replies }),
		//
		attachmentsCount: getAttachmentsCount({
			images,
			omitted_images,
			ext,
			extra_files,
			cyclical
		})
	}
	// Is present only in "get thread comments" API response.
	if (unique_ips) {
		// Includes both comment posters and the thread poster.
		thread.uniquePostersCount = unique_ips
	}
	// Is present only in "get threads list" API response.
	if (last_modified) {
		thread.updatedAt = new Date(last_modified * 1000)
	}
	// `8ch.net` has a concept of "bumplocked" threads that are in "autosage" mode.
	// https://twitter.com/infinitechan/status/555013038839848961
	// In other words, "bumplocked" threads never get bumped,
	// even when someone leaves a comment.
	// I guess it can be set both at thread creation time or some time after.
	// Weird that it's a string rather than a number
	// like it is for `sticky` or `locked`.
	if (bumplocked === '1') {
		thread.bumpLimitReached = true
	}
	// On `8ch.net` threads are marked as `bumplimit: 1` when
	// their technical "bump limit" is technically "reached".
	if (bumplimit === 1) {
		thread.bumpLimitReached = true
	}
	if (imagelimit === 1) {
		thread.attachmentLimitReached = true
	}
	if (archived === 1) {
		thread.archived = true
		if (archived_on) {
			thread.archivedAt = new Date(archived_on * 1000)
		}
	}
	// At `4chan.org` each board can have a list of "custom spoilers" for attachments.
	// `custom_spoiler` is a number, and if it's `5`, for example, then it means that
	// the board has five custom spoilers defined: from `1` to `5`.
	// One can then choose any one of the available custom spoiler ids.
	// Custom spoiler URLs are: https://s.4cdn.org/image/spoiler-{boardId}{customSpoilerId}.png
	// Every time a new post is added to a thread the chosen custom spoiler id is rotated.
	// https://github.com/4chan/4chan-API
	if (custom_spoiler) {
		thread.customSpoilersCount = custom_spoiler
	}
	thread.comments = [{
		no,
		ext,
		extra_files,
		...rest
	}]
	if (last_replies) {
		thread.latestComments = last_replies
	}
	return thread
}

// `4chan`, `OpenIB` and `vichan` have `images` property.
//
// * `4chan`, `OpenIB` always return the `images` property.
//
// * `vichan` has `images` property
//   in "get threads list on a board" API response,
//   but not in "get thread comments" API response.
//
// If `images` property is present, use it to calculate `attachmentsCount`.
//
function getAttachmentsCount({
	images,
	omitted_images,
	ext,
	extra_files,
	cyclical
}) {
	// `vichan` and `OpenIB` have `cyclical: "0" or "1"` property.
	// `4chan` doesn't have a `cyclical` property.
	// Therefore, the `cyclical` property existence is used to detect
	// the imageboard engine: if `cyclical` is not present, then it's
	// treated as `4chan`, and `4chan` has a correct `images` property
	// for the attachments count, so return it.
	//
	if (!cyclical) {
		// The engine is assumed to be `4chan`. Return the `images` property.
		return images
	}

	// `8ch` (`OpenIB`) and `vichan` have incorrect `images` property.
	//
	// * `vichan` has `images` property in "/catalog.json" API response,
	//   which is incorrect, and doesn't have that property at all in
	//   "get thread comments" API response.
	//
	// * `OpenIB` has `images` property both in "/catalog.json" API response
	//   and in "get thread comments" API response, but that `images` property
	//   is also incorrect, so it should be ignored.
	//
	// All `4chan`-compatible engines have an `omitted_images` property.
	// The only case when it's not present is when querying a "-tail" API
	// on `4chan`. At this stage, the engine is known to be not `4chan`.
	//
	// There could be a hypothetical case of some unknown `4chan`-alike
	// imageboard engine that doesn't provide the `omitted_images` property.
	//
	// The `omitted_images` property doesn't include the attachments of the "root comment".
	// Therefore, the count of attachments of the "root comment" should be added to it.
	// On `4chan.org` (even if it's not `4chan`), there can only be a single attachment in a comment.
	// `vichan` and `OpenIB` engines support several attachments in a comment, so inpsect
	// the `extra_files` property.
	//
	if (omitted_images !== undefined) {
		return omitted_images + (ext ? 1 + (extra_files ? extra_files.length : 0) : 0)
	}

	// Fall back to the `images` property if it's some unknown `4chan`-alike engine.
	return images
}

function getCommentsCount({ replies }) {
	// * `4chan`, `OpenIB` and `vichan` have `replies` property.
	//
	// * `vichan` has `replies` property
	//   in "get threads list on a board" API response,
	//   but not in "get thread comments" API response.
	//
	// If `replies` property is present, use it to calculate `commentsCount`.
	//
	if (replies !== undefined) {
		return replies + 1
	}
}