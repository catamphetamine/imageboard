import { parseHtmlContent } from 'social-components-parser'
import postProcessCommentContent from './postProcessCommentContent.js'
import trimContent from 'social-components/utility/post/trimContent.js'

import getContentElementsForUnknownElementType from './parseAndFormatCommentContent.getContentElementsForUnknownElementType.js'

export default function parseAndFormatCommentContent(rawComment, {
	commentUrlParser,
	parseCommentContentPlugins,
	// These're used by `postProcessCommentContent`
	comment,
	boardId,
	threadId,
	messages,
	commentUrl,
	threadUrl,
	emojiUrl,
	toAbsoluteUrl
}) {
	let content = parseHtmlContent(rawComment, {
		syntax: parseCommentContentPlugins,
		context: {
			commentUrlParser,
			emojiUrl,
			toAbsoluteUrl
		},
		getContentElementsForUnknownElementType
	})
	// Content will be manipulated, so convert it to an array of content blocks.
	if (typeof content === 'string') {
		content = [[content]]
	}
	if (content) {
		// Trim whitespace around paragraphs.
		content = trimContent(content)
	}
	if (content) {
		postProcessCommentContent(content, {
			// `comment` is only used by `expandStandaloneAttachmentLinks()`.
			comment,
			boardId,
			threadId,
			messages,
			commentUrl,
			threadUrl
		})
	}
	return content
}