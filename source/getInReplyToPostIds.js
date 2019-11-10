import parsePostLinks from './parsePostLinks'
import visitPostParts from 'social-components/commonjs/utility/post/visitPostParts'

export default function getInReplyToPostIds(post, {
	boardId,
	threadId,
	commentUrlParser,
	parseContent
}) {
	if (post.content) {
		if (parseContent === false) {
			return getInReplyToPostIdsForRawContent(post.content, {
				boardId,
				threadId,
				commentUrlParser
			})
		} else {
			return getInReplyToPostIdsForParsedContent(post.content, {
				boardId,
				threadId
			})
		}
	}
}

function getInReplyToPostIdsForRawContent(rawContent, {
	boardId,
	threadId,
	commentUrlParser
}) {
	const links = parsePostLinks(rawContent, { commentUrlParser })
		.filter((link) => {
			return !link.boardId && !link.threadId ||
				(link.boardId === boardId) && (link.threadId === threadId)
		})
	if (links.length > 0) {
		const postIds = links.map(link => link.postId)
		// Exclude duplicates.
		// Sometimes users add multiple post links to the same post
		// in their comments content. For example:
		// ">>12345 >>12345 >>12345"
		return postIds.filter((postId, i) => postIds.indexOf(postId) === i)
	}
}

function getInReplyToPostIdsForParsedContent(content, {
	boardId,
	threadId
}) {
	let inReplyTo
	visitPostParts(
		'post-link',
		link => {
			if (link.boardId === boardId && link.threadId === threadId) {
				if (!inReplyTo) {
					inReplyTo = []
				}
				// Exclude duplicates.
				if (inReplyTo.indexOf(link.postId) < 0) {
					inReplyTo.push(link.postId)
				}
			}
		},
		content
	)
	return inReplyTo
}