import createByIdIndex from './utility/createByIdIndex.js'
import getInReplyToPostIds from './getInReplyToPostIds.js'
import setReplies from './setReplies.js'
import generateThreadTitle from './generateThreadTitle.js'
import { generatePostLinksAndUpdatePreview, addParseContent } from './parseContent.js'

export default function Thread(thread, {
	boardId,
	messages,
	getPostLinkText,
	getPostLinkProperties,
	generatedQuoteMaxLength,
	generatedQuoteMinFitFactor,
	generatedQuoteMaxFitFactor,
	generatedQuoteNewLineCharacterLength,
	commentLengthLimit,
	latestCommentLengthLimit,
	minimizeGeneratedPostLinkBlockQuotes,
	commentUrlParser,
	expandReplies,
	parseContent,
	addParseContent: shouldAddParseContent,
	parseCommentContent,
	withLatestComments
}, { board }) {
	thread.boardId = boardId
	if (board) {
		thread.board = board
	}
	// Remove `false` properties.
	if (!thread.onTop) {
		delete thread.onTop
	}
	if (!thread.locked) {
		delete thread.locked
	}
	if (!thread.trimming) {
		delete thread.trimming
	}
	if (thread.tags === undefined) {
		delete thread.tags
	}

	if (board && board.bumpLimit && thread.commentsCount >= board.bumpLimit) {
		thread.bumpLimitReached = true
	}

	// On `8ch.net` "trimming" "sticky" threads are
	// also marked as `bumplimit: 1` when their
	// technical "bump limit" is technically "reached".
	// By definition, "trimming" and "sticky" threads don't expire.
	if (thread.onTop || thread.trimming) {
		if (thread.bumpLimitReached) {
			thread.bumpLimitReached = false
		}
	}

	// `Array.find()` is slow for doing it every time.
	// A "get post by id" index is much faster.
	const getCommentById = createByIdIndex(
		thread.latestComments
			? thread.comments.concat(thread.latestComments)
			: thread.comments
	)

	// Whether it should mark absent comments as "Deleted".
	// It should only do so if the list of comments is complete.
	// In other words, only mark absent comments as "Deleted"
	// when parsing "get thread comments" API response,
	// not the "get threads list with latest comments" API response.
	const markDeletedPosts = !withLatestComments

	// Set `.inReplyTo` array for each comment.
	// `.inReplyTo` array contains comment IDs.
	for (const comment of thread.comments) {
		let inReplyTo = getInReplyToPostIds(comment, {
			boardId,
			threadId: thread.id,
			commentUrlParser,
			parseContent
		})
		if (inReplyTo) {
			// Prevent circular references.
			// http://boards.4chan.org/gif/thread/15873661
			// One time there was a thread on `4chan` where a user
			// somehow managed to quote their own comment recursively:
			// A comment with id "15873666" had ">>15873666" in its content.
			// To prevent such cyclic links this expclicit "not a link to self"
			// filter is applied, even though such things can't normally happen.
			inReplyTo = inReplyTo.filter(commentId => commentId !== comment.id)
			// Some comments may have been removed by moderators.
			// Classify "in reply to" comments into existing and removed ones.
			const inReplyToComments = []
			const inReplyToRemovedCommentIds = []
			for (const commentId of inReplyTo) {
				const comment = getCommentById(commentId)
				if (comment) {
					inReplyToComments.push(comment)
				} else {
					inReplyToRemovedCommentIds.push(commentId)
				}
			}
			if (inReplyToComments.length > 0) {
				comment.inReplyTo = expandReplies ? inReplyToComments : inReplyToComments.map(_ => _.id)
			}
			if (inReplyToRemovedCommentIds.length > 0) {
				comment.inReplyToRemoved = inReplyToRemovedCommentIds
			}
		}
	}

	if (!withLatestComments) {
		// Set `.replies` array for each comment
		// based on the `.inReplyTo` array.
		// `.replies` array contains comment IDs.
		// Can only come after `.inReplyTo` arrays are set on comments.
		setReplies(thread.comments, { expandReplies })
	}

	// If `thread.title` is missing then copy it from
	// the first comment's `title`.
	if (!thread.title) {
		thread.title = thread.comments[0].title
	}

	// Add `.parseContent()` function to each `comment` (if required).
	const initContentParsing = (comment, mode) => {
		if (parseContent === false) {
			if (shouldAddParseContent) {
				// Create a "closure" here, otherwise it would reuse the
				// `comment` variable, and, for every comment, the `comment`
				// variable "captured" in `.parseContent()` functions
				// would end up referencing the last comment in this
				// `for ... of` loop. Weird javascript.
				// https://www.w3schools.com/js/js_function_closures.asp
				(function(comment) {
					addParseContent(comment, {
						boardId,
						threadId: thread.id,
						parseCommentContent,
						getCommentById,
						markDeletedPosts,
						messages,
						generatedQuoteMaxLength,
						generatedQuoteMinFitFactor,
						generatedQuoteMaxFitFactor,
						generatedQuoteNewLineCharacterLength,
						commentLengthLimit: mode === 'latest-comments' ? latestCommentLengthLimit : commentLengthLimit,
						minimizeGeneratedPostLinkBlockQuotes,
						expandReplies
					})
				}(comment))
				// If `thread.title` is missing then attempt to autogenerate
				// thread title from the first comment's `content`.
				// (after the first comment's `content` has been parsed)
				if (!thread.title) {
					if (comment.id === thread.id) {
						const parseContent = comment.parseContent
						comment.parseContent = (options) => {
							parseContent(options)
							generateThreadTitle(thread, {
								minFitFactor: generatedQuoteMinFitFactor,
								maxFitFactor: generatedQuoteMaxFitFactor,
								messages
							})
						}
					}
				}
			}
		}
		// If the comment has any content and `parseContent` is not `false`
		// (in which case `comment.content` has already been parsed)
		// then create autogenerated content (such as "in reply to" quotes) right now.
		// Otherwise, defer until `post.parseContent()` is called.
		else if (comment.content) {
			generatePostLinksAndUpdatePreview(comment, {
				threadId: thread.id,
				getCommentById,
				markDeletedPosts,
				messages,
				getPostLinkText,
				getPostLinkProperties,
				generatedQuoteMaxLength,
				generatedQuoteMinFitFactor,
				generatedQuoteMaxFitFactor,
				generatedQuoteNewLineCharacterLength,
				commentLengthLimit,
				minimizeGeneratedPostLinkBlockQuotes
			})
		}
	}

	// Add `.parseContent()` function to each `comment` (if required).
	for (const comment of thread.comments) {
		initContentParsing(comment, 'thread')
	}
	if (thread.latestComments) {
		for (const comment of thread.latestComments) {
			initContentParsing(comment, 'latest-comments')
		}
	}

	// The date on which the thread was created.
	// All chans except `lynxchan` have this.
	// `lynxchan` doesn't have it which is a bug
	// but seems like they don't want to fix it.
	if (thread.comments[0].createdAt) {
		thread.createdAt = thread.comments[0].createdAt
	}

	// If `thread.title` is missing then attempt to autogenerate
	// thread title from the first comment's `content`.
	if (!thread.title) {
		if (parseContent !== false) {
			generateThreadTitle(thread, {
				minFitFactor: generatedQuoteMinFitFactor,
				maxFitFactor: generatedQuoteMaxFitFactor,
				messages
			})
		}
	}

	return thread
}