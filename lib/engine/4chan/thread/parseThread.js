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
		commentAttachmentsCount: getAttachmentsCountInComments({
			images,
			omitted_images,
			cyclical,
			last_replies
		}),
		//
		attachmentsCount: getAttachmentsCount({
			images,
			omitted_images,
			cyclical,
			last_replies,
			ext,
			extra_files
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

function getAttachmentsCountInComments({
	images,
	omitted_images,
	cyclical,
	last_replies
}) {
	// `vichan` and `OpenIB` have `cyclical: "0" or "1"` property.
	// `4chan` doesn't have a `cyclical` property.
	// Therefore, the `cyclical` property existence is used to detect
	// the imageboard engine: if `cyclical` is not present, then the engine
	// is known to be `4chan`.
	//
	if (!cyclical) {
		// The engine was detected to be `4chan`. Return the `images` property value.
		return images
	}

	// `8ch` (`OpenIB`) and `vichan` have incorrect `images` property.
	//
	// * `vichan` has `images` property in "/catalog.json" API response
	//   (which may be not guaranteed to be correctly calculated: https://github.com/vichan-devel/vichan/issues/327)
	//   and doesn't have that property at all in "get thread comments" API response.
	//
	// * `OpenIB` has `images` property both in "/catalog.json" API response
	//   and in "get thread comments" API response. So it could be used,
	//   but the `images` property is not guaranteed to be correct in some cases:
	//   https://github.com/OpenIB/OpenIB/issues/295
	//
	// All `4chan`-compatible engines have an `omitted_images` property.
	// The only case when it's not present is when querying a "-tail" API on `4chan`.
	// But at this stage, the engine is known to be not `4chan` because the `if` block
	// above this code has already handled the `4chan` case.
	//
	// `omitted_images` doesn't include the images from `last_replies`.
	//
	if (omitted_images !== undefined) {
		return omitted_images + (last_replies
			? last_replies.map(getAttachmentsCountInComment).reduce((sum, count) => sum + count, 0)
			: 0
		)
	}

	// Fall back to the `images` property if `4chan` decides to implement
	// `cyclical` property in some hypothetical future, or if it's some other
	// unknown `4chan`-alike engine.
	return images
}

function getAttachmentsCountInComment({ ext, extra_files }) {
	if (ext) {
		// On `4chan.org`, there can only be a single attachment in a comment.
		// `vichan` and `OpenIB` engines support several attachments in a comment,
		// so inpsect the `extra_files` property.
		if (extra_files) {
			return 1 + extra_files.length
		}
		return 1
	}
	return 0
}

function getAttachmentsCount({
	images,
	omitted_images,
	cyclical,
	last_replies,
	ext,
	extra_files
}) {
	return getAttachmentsCountInComment({ ext, extra_files }) +
		getAttachmentsCountInComments({
			images,
			omitted_images,
			cyclical,
			last_replies
		})
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