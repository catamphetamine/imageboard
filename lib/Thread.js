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
	generatedQuoteGetCharactersCountPenaltyForLineBreak,
	commentLengthLimit,
	commentLengthLimitForWithLatestComments,
	minimizeGeneratedPostLinkBlockQuotes,
	commentUrlParser,
	expandReplies,
	parseContent,
	addParseContent: shouldAddParseContent,
	parseCommentContent,
	withLatestComments
}, { board }) {
	thread.boardId = boardId
	// if (board) {
	// 	thread.board = board
	// }
	// Remove `false` properties.
	if (!thread.pinned) {
		delete thread.pinned
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

	if (board && board.features && board.features.bumpLimit) {
		if (thread.commentsCount >= board.features.bumpLimit) {
			thread.bumpLimitReached = true
		}
	}

	// On `8ch.net` "trimming" "sticky" threads are
	// also marked as `bumplimit: 1` when their
	// technical "bump limit" is technically "reached".
	// By definition, "trimming" and "sticky" threads don't expire.
	if (thread.pinned || thread.trimming) {
		if (thread.bumpLimitReached) {
			thread.bumpLimitReached = false
		}
	}

	// `Array.find()` is slow for doing it every time.
	// A "get post by id" index is much faster.
	const getCommentById = createByIdIndex(thread.comments)

	// Whether it should mark absent comments as "Deleted".
	// It should only do so if the list of comments is complete.
	// In other words, only mark absent comments as "Deleted"
	// when parsing "get thread comments" API response,
	// not the "get threads list with latest comments" API response.
	const markDeletedPosts = !withLatestComments

	// Set `.inReplyToIds` array for each comment.
	// `.inReplyToIds` array contains comment IDs.
	for (const comment of thread.comments) {
		let inReplyToIds = getInReplyToPostIds(comment, {
			boardId,
			threadId: thread.id,
			commentUrlParser,
			parseContent
		})
		if (inReplyToIds) {
			// Prevent circular references.
			// http://boards.4chan.org/gif/thread/15873661
			// One time there was a thread on `4chan` where a user
			// somehow managed to quote their own comment recursively:
			// A comment with id "15873666" had ">>15873666" in its content.
			// To prevent such cyclic links this expclicit "not a link to self"
			// filter is applied, even though such things can't normally happen.
			inReplyToIds = inReplyToIds.filter(_ => _ !== comment.id)
			// Some comments may have been removed by moderators.
			// Classify "in reply to" comments into existing and removed ones.
			const inReplyToComments = []
			const inReplyToRemovedCommentIds = []
			for (const commentId of inReplyToIds) {
				const comment = getCommentById(commentId)
				if (comment) {
					inReplyToComments.push(comment)
				} else {
					inReplyToRemovedCommentIds.push(commentId)
				}
			}
			if (inReplyToComments.length > 0) {
				comment.inReplyToIds = inReplyToComments.map(_ => _.id)
				if (expandReplies) {
					comment.inReplyTo = inReplyToComments
				}
			}
			// Not necessarily "removed" in case of `withLatestComments`.
			// But that seems to be irrelevant and not an issue.
			if (inReplyToRemovedCommentIds.length > 0) {
				comment.inReplyToIdsRemoved = inReplyToRemovedCommentIds
			}
		}
	}

	if (!withLatestComments) {
		// Set `.replies` / `.replyIds` arrays for each comment based on the `.inReplyToIds` array.
		// This code can only be called after `.inReplyToIds` arrays have been set on the comments.
		setReplies(thread.comments, { expandReplies })
	}

	// When the thread was fetched with "latest comments", all comments
	// except the first one should be moved from `.comments` to `.latestComments`.
	// That has to be done at this stage rather than earlier because if it was done earlier,
	// `inReplyTo[]`/`replies[]` arrays of the comments wouldn't be set correctly
	// in cases when some of the "latest comments" are replies to the main comment:
	// in those cases, the code would process `thread.comments` and `thread.latestComments`
	// separately and wouldn't link them to one another, resulting in the "main" comment references
	// inside "latest comments" being "not found" which would be a bug.
	if (withLatestComments) {
		// If there's only one `comment` in the `thread`, its `latestComments` are gonna be `undefined`.
		// That might be the case when:
		// * There's only one comment in the thread, i.e. no one has posted a comment there yet.
		// * The engine doesn't support returning `latestComments` for threads, so those have to be
		//   loaded using "pagination" workaround which doesn't set `latestComments` for all threads.
		if (thread.comments.length > 1) {
			thread.latestComments = thread.comments.slice(1)
			thread.comments = thread.comments.slice(0, 1)
		}
	}

	// If `thread.title` is missing then copy it from
	// the first comment's `title`.
	if (!thread.title) {
		// Don't assign `title: undefined` property
		// just so it looks a bit cleaner in tests when comparing
		// expected and actual thread object.
		if (thread.comments[0].title !== undefined) {
			thread.title = thread.comments[0].title
		}
	}

	// When `thread.latestComments` property is present, it means that
	// only the "original comment" of the thread is present, along with
	// a few of the latest comments.
	const notAllCommentsAreAvailable = withLatestComments

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
						notAllCommentsAreAvailable,
						markDeletedPosts,
						messages,
						getPostLinkText,
						getPostLinkProperties,
						generatedQuoteMaxLength,
						generatedQuoteMinFitFactor,
						generatedQuoteMaxFitFactor,
						generatedQuoteGetCharactersCountPenaltyForLineBreak,
						commentLengthLimit: mode === 'latest-comments' ? commentLengthLimitForWithLatestComments : commentLengthLimit,
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
				notAllCommentsAreAvailable,
				markDeletedPosts,
				messages,
				getPostLinkText,
				getPostLinkProperties,
				generatedQuoteMaxLength,
				generatedQuoteMinFitFactor,
				generatedQuoteMaxFitFactor,
				generatedQuoteGetCharactersCountPenaltyForLineBreak,
				commentLengthLimit,
				minimizeGeneratedPostLinkBlockQuotes
			})
		}
	}

	const clearDefaultAuthorName = (comment) => {
		if (board && board.features && board.features.defaultAuthorName) {
			if (comment.authorName === board.features.defaultAuthorName) {
				delete comment.authorName
			}
		}
	}

	// Add `.parseContent()` function to each `comment` (if required).
	for (const comment of thread.comments) {
		initContentParsing(comment, 'thread')
		clearDefaultAuthorName(comment)
	}
	if (thread.latestComments) {
		for (const comment of thread.latestComments) {
			initContentParsing(comment, 'latest-comments')
			clearDefaultAuthorName(comment)
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