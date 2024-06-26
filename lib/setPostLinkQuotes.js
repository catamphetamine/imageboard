import { forEachFollowingQuote } from 'social-components/content'
import { generatePostQuote } from 'social-components/post'

import getPostLinkDefaultText from './getPostLinkDefaultText.js'

/**
 * Adds "in-reply-to" quotes.
 * Has some CPU usage.
 * @param {any} content — Comment `content`. Must be a root-level `content`.
 * @param {function} options.getCommentById — Retuns comment by id.
 * @param {object} [options.messages] — Localized labels. See the "Messages" section in the readme.
 * @param {boolean} [options.generateQuotes] — Is `true` by default, meaning that it will autogenerate quotes for all `post-link`s. If `false` is passed, then it won't autogenerate quotes for `post-link`s, and will either set `post-link`s' `content` to whatever human-written quotes immediately follow those `post-link`s, or mark them with `_block: true` if they're "block" ones (and not "inline" ones). How could this be used? See the comments on `generateQuotes: false` in `parseContent.js`.
 * @param {boolean} [options.generateBlockQuotes] — Is `true` by default. `generateBlockQuotes: false` can be used to achieve the same effect as `generateQuotes: false` but only for "block" quotes (and not for "inline" quotes). See the comments on `generateBlockQuotes: false` in `parseContent.js`.
 * @param {number} [options.generatedQuoteMaxLength] — Is `180` by default.
 * @param {number} [options.generatedInlineQuoteMaxLength] — Is `generatedQuoteMaxLength / 2` by default.
 * @param {number} [options.generatedQuoteMinFitFactor] — Provides some flexibility on generated quote `maxLength`. Sets the usual lower limit of content trimming length at `minFitFactor * maxLength`: if content surpasses `maxFitFactor * maxLength` limit, then it usually can be trimmed anywhere between `minFitFactor * maxLength` and `maxFitFactor * maxLength`. Is `1` by default, meaning "no effect".
 * @param {number} [options.generatedQuoteMaxFitFactor] — Provides some flexibility on generated quote `maxLength`. Sets the usual upper limit of content trimming length at `maxFitFactor * maxLength`: if content surpasses `maxFitFactor * maxLength` limit, then it usually can be trimmed anywhere between `minFitFactor * maxLength` and `maxFitFactor * maxLength`. Is `1` by default, meaning "no effect".
 * @param {function} [options.generatedQuoteGetCharactersCountPenaltyForLineBreak] — Returns characters count equivalent for a "line break" (`\n`) character. The idea is to "tax" multi-line texts when trimming by characters count. By default, having `\n` characters in text is not penalized in any way and those characters aren't counted. Returns something like `15` by default.
 * @param {object} contentParent — Shouldn't be passed. Is only passed internally when recursing. The parent block of `content` block.
 * @param {boolean} isLastInParagraph — If the `content` block is the last one in `contentParent`.
 * @return {boolean} [contentDidChange] — Returns `true` if `content` did change (either as a result of setting an in-reply-to quote or, for example, as a result of setting "deleted post" flag).
 */
export default function setPostLinkQuotes(
	content,
	options,
	contentParent,
	isFirstInParagraph = true,
	isLastInParagraph = true
) {
	const {
		getCommentById,
		notAllCommentsAreAvailable,
		generateQuotes: shouldGenerateQuotes,
		generateBlockQuotes: shouldGenerateBlockQuotes
	} = options
	if (Array.isArray(content)) {
		let i = 0
		let contentDidChange = false
		while (i < content.length) {
			const part = content[i]
			const partsCount = content.length
			if (setPostLinkQuotes(
				part,
				options,
				content,
				contentParent ? (isFirstInParagraph ? i === 0 : false) : true,
				contentParent ? (isLastInParagraph && i === content.length - 1) : true
			)) {
				contentDidChange = true
			}
			// Check if some elements have been removed
			// (or maybe hypothetically added)
			// in which case adjust the cycle index.
			if (content.length !== partsCount) {
				i += content.length - partsCount
			}
			i++
		}
		return contentDidChange
	}
	// Post content can be empty.
	// Or maybe even post part's content.
	// Like `{ type: 'attachment', attachmentId: 1 }`.
	if (!content) {
		return
	}
	if (typeof content === 'string') {
		return
	}
	// Only set quotes for "standalone" `post-link`s.
	// (`post-link`s being the only content on its line)
	const index = contentParent.indexOf(content)
	const isTheOnlyOneOnLine =
		(isFirstInParagraph || endsWithNewLineAndOptionalWhiteSpace(contentParent, index, false)) &&
		(isLastInParagraph || endsWithNewLineAndOptionalWhiteSpace(contentParent, index, true))
	if (!isTheOnlyOneOnLine) {
		if (content.type === 'post-link') {
			if (shouldGenerateQuotes === false) {
				return
			} else {
				const postLink = content
				let quoteText
				const quotedPost = getCommentById(postLink.meta.commentId)
				if (quotedPost) {
					quoteText = generatePostQuote(quotedPost, getGeneratePostQuoteOptions({
						...options,
						generatedQuoteMaxLength: getGeneratedInlineQuoteMaxLength(options),
						// This is an inline `post-link` quote, so don't go past the first line.
						stopOnNewLine: true
					}))
				}
				// `setPostLinkQuotes()` can be called multiple times
				// for the same comment (for example, when its parent
				// comment's `content` is updated).
				const prevContent = postLink.content
				if (quoteText) {
					postLink.content = [{
						type: 'quote',
						contentGenerated: true,
						content: quoteText
					}]
				} else if (options.messages) {
					// Set "Deleted comment" `content` for links to deleted comments.
					// Set "External comment" `content` for links from other threads.
					// Keep "Comment" `content` for links to other comments.
					// (there seem to be no "other" cases)
					const defaultText = getPostLinkDefaultText(postLink, options.messages)
					if (defaultText) {
						postLink.content = defaultText
					}
				}
				// Returns `true` if the `post-link` quote text changed.
				return postLink.content !== prevContent
			}
		}
		return
	}
	if (content.type === 'post-link') {
		const postLink = content
		// Autogenerated parent post quotes are updated after YouTube videos have been loaded.
		// If non-autogenerated post quote for this post link has already been set, then skip it.
		if (Array.isArray(postLink.content) && postLink.content[0].type === 'quote') {
			if (!postLink.content[0].contentGenerated) {
				return
			}
		}
		// If custom text content was set on the post link.
		if (postLink.meta.isDeleted || postLink.meta.isAnotherThread) {
			// If it's the first run then transform the text content to a quote.
			// If it's a subsequent run then it's already a quote and no need to change it.
			if (Array.isArray(postLink.content) && postLink.content[0].type === 'quote') {
				// Skip it.
				return
			}
			postLink.content = [{
				type: 'quote',
				block: true,
				contentGenerated: true,
				content: postLink.content
			}]
			// Content did change.
			return true
		}
		// Get the post being quoted.
		// `Array.find()` is slow for doing it every time.
		// A "postsById" index is much faster.
		const quotedPost = getCommentById(postLink.meta.commentId)
		// This shouldn't happen because `setPostInfoOnPostLinks()`
		// is supposed to be run before this function
		// setting `isDeleted: true` flag for missing posts.
		if (!quotedPost) {
			if (!notAllCommentsAreAvailable) {
				console.error(`Post #${postLink.meta.commentId} not found`)
			}
			return
		}
		const quotes = []
		// If the quoted post link is the last content element in the post then
		// don't perform further checks and generate the quote for the quoted post.
		if (!isLastInParagraph) {
			// See if there's already an existing post quote for this post link.
			// (composed manually by post author)
			const startFromIndex = index + 2
			const quotesCount = forEachFollowingQuote(contentParent, startFromIndex, (quote, i) => {
				// A post link quote is rendered as a hyperlink
				// and having nested hyperlinks will result in invalid HTML markup.
				// To prevent that, strip links from the quote.
				stripLinks(quote.content)
				// Separate quotes with new lines.
				if (quotes.length > 0) {
					quotes.push('\n')
				}
				quotes.push(quote)
			})
		}
		if (quotes.length > 0) {
			// Remove the combined quotes and "\n"s before them from post content.
			// Don't remove the "\n" after the last quote.
			contentParent.splice(index + 1, 1 + quotes.length)
			// `quotes` contains the quotes themselves punctuated by "\n"s.
			postLink.content = quotes
			// Content did change.
			return true
		}
		// Autogenerate `post-link` quote.
		const generateBlockQuotes = shouldGenerateQuotes === false || shouldGenerateBlockQuotes === false ? false : true
		if (generateBlockQuotes) {
			let attachment
			const text = generatePostQuote(quotedPost, {
				...getGeneratePostQuoteOptions(options),
				onUntitledAttachment: _ => attachment = _
			})
			if (text) {
				// Set `content` quote to the quoted post text abstract.
				postLink.content = [{
					type: 'quote',
					block: true,
					content: text,
					contentGenerated: true
				}]
				// If the `text` was generated from an untitled attachment,
				// then also set the attachment itself, so that it could be
				// displayed instead of a generic "Picture"/"Video" placeholder.
				if (attachment) {
					postLink.attachments = quotedPost.attachments
				}
				// Content did change.
				return true
			}
		} else {
			// This flag is currently only checked in `parseContent()`.
			// `postLink.content[0].block` can't be used there
			// because `postLink.content` is not yet generated.
			postLink._block = true
		}
	}
	// Recurse into post parts.
	return setPostLinkQuotes(
		content.content,
		options,
		content,
		isFirstInParagraph,
		isLastInParagraph
	)
}

// Inline quotes can contain hyperlinks too. For example,
// `2ch.hk` autoparses links in comment text when it's submitted
// and if there's a quoted link then it will autoparse that link.
// Such nested links would result in a React warning:
// "validateDOMNesting(...): <a> cannot appear as a descendant of <a>.".
function stripLinks(content) {
	if (Array.isArray(content)) {
		let i = 0
		while (i < content.length) {
			if (typeof content[i] === 'object') {
				// Handling just a simple case here
				// and not recursing into nested arrays.
				if ((content[i].type === 'link' || content[i].type === 'post-link') &&
					typeof content[i].content === 'string') {
					content[i] = content[i].content
				}
			}
			i++
		}
	}
}

const DEFAULT_GENERATED_QUOTE_MAX_LENGTH = 180

export function getGeneratePostQuoteOptions({
	messages,
	generatedQuoteMaxLength,
	generatedQuoteMinFitFactor,
	generatedQuoteMaxFitFactor,
	generatedQuoteGetCharactersCountPenaltyForLineBreak
}) {
	return {
		messages: messages && {
			textContent: messages.textContent
		},
		maxLength: generatedQuoteMaxLength || DEFAULT_GENERATED_QUOTE_MAX_LENGTH,
		minFitFactor: generatedQuoteMinFitFactor,
		maxFitFactor: generatedQuoteMaxFitFactor,
		getCharactersCountPenaltyForLineBreak: generatedQuoteGetCharactersCountPenaltyForLineBreak
	}
}

// Generated inline quote `maxLength` should be no larger than
// generated block quote `maxLength`: `parseContent.js` assumes that
// when calling `canGeneratePostQuoteIgnoringNestedPostQuotes()`.
// Also, generated inline quote `fitFactor` should be the same
// as generated block quote `fitFactor`: `parseContent.js` assumes that too.
export function getGeneratedInlineQuoteMaxLength(options) {
	return options.generatedInlineQuoteMaxLength || ((options.generatedQuoteMaxLength || DEFAULT_GENERATED_QUOTE_MAX_LENGTH) / 2)
}

export function endsWithNewLineAndOptionalWhiteSpace(content, index, forward) {
	let nextIndex = index
	if (forward) {
		nextIndex++
		if (nextIndex === content.length) {
			return true
		}
	} else {
		nextIndex--
		if (nextIndex === -1) {
			return true
		}
	}
	if (content[nextIndex] === '\n') {
		return true
	}
	if (typeof content[nextIndex] === 'string') {
		if (WHITESPACE_REGEXP.test(content[nextIndex])) {
			return endsWithNewLineAndOptionalWhiteSpace(content, nextIndex, forward)
		}
	}
	return false
}

const WHITESPACE_REGEXP = /^\s$/
