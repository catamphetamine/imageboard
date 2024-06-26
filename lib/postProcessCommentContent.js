import { expandStandaloneAttachmentLinks } from 'social-components/content'
// import { combineQuotes } from 'social-components/content'

import setPostLinkUrls from './setPostLinkUrls.js'
import parseLinksInText from './parseLinksInText.js'

export default function postProcessCommentContent(content, {
	// `comment` is only used by `expandStandaloneAttachmentLinks()`.
	comment,
	boardId,
	threadId,
	commentUrl,
	threadUrl
}) {
	// Finds all plain-text URLs in post `content`
	// and converts them to `{ type: 'link' }` objects.
	parseLinksInText(content)
	// It looks better without combining consequtive quote lines.
	// // Combine `{ type: 'quote' }` objects on consequtive lines
	// // into a single `{ type: 'quote' }` object with "\n"s inside.
	// combineQuotes(content)
	// Set `url`, `threadId` and `boardId` of `{ type: 'post-link' }` objects.
	setPostLinkUrls(content, { boardId, threadId, commentUrl, threadUrl })
	// Expand attachment links (objects of shape `{ type: 'link', attachment: ... }`)
	// into standalone attachments (block-level attachments: `{ type: 'attachment' }`).
	// In such case attachments are moved from `{ type: 'link' }` objects to `post.attachments`.
	expandStandaloneAttachmentLinks(comment.content)
}