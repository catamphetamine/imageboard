import generatePostPreview from 'social-components/commonjs/utility/post/generatePostPreview'

/**
 * Generates a `.contentPreview` from `comment`'s `.content`.
 * @param {object} comment
 * @param {number} commentLengthLimit
 */
export default function generatePreview(comment, commentLengthLimit) {
	if (comment.content) {
		const preview = generatePostPreview(
			comment,
			{ maxLength: commentLengthLimit }
		)
		if (preview) {
			comment.contentPreview = preview
		}
	}
}