import generatePostPreview from 'social-components/commonjs/utility/post/generatePostPreview'

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