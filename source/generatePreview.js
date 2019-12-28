import generatePostPreview from 'social-components/commonjs/utility/post/generatePostPreview'

/**
 * Generates a `.contentPreview` from `comment`'s `.content`.
 * @param {object} comment
 * @param {number} commentLengthLimit
 */
export default function generatePreview(comment, commentLengthLimit) {
	const preview = generatePostPreview(
		comment.content,
		comment.attachments,
		{ limit: commentLengthLimit }
	)
	if (preview) {
		comment.contentPreview = preview
	}
}