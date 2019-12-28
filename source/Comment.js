import stringToColor from 'social-components/commonjs/utility/stringToColor'

export default function Comment({
	boardId,
	threadId,
	...comment
}, {
	parseContent,
	parseCommentContent
}) {
	// Nullify empty comments.
	// For example, `2ch.hk` returns empty strings
	// instead of `undefined` for `comment`.
	if (comment.content === '')  {
		comment.content = undefined
	}
	if (parseContent === false) {
		// Don't parse `.content`.
	} else {
		// Parse comment content.
		if (comment.content) {
			parseCommentContent(comment, {
				boardId,
				threadId
			})
		}
	}
	// Detect "sage" in author's email.
	// https://knowyourmeme.com/memes/sage
	// Some users write "Sage" instead of "sage".
	// I guess those are mobile users with `<input type="text"/>` autocapitalization.
	if (comment.authorEmail === 'sage' || comment.authorEmail === 'Sage') {
		comment.isSage = true
		delete comment.authorEmail
	}
	// Generate `authorIdColor` from `authorId` IP subnet address hash.
	if (comment.authorId) {
		if (!comment.authorIdColor) {
			comment.authorIdColor = stringToColor(comment.authorId)
		}
	}
	// Remove all `undefined` properties.
	// That's for cleaner testing so that the tests
	// don't have to specify all `undefined` properties.
	// `lynxchan` sometimes sets a property to `null`
	// instead of not including it in the API response.
	for (const key of Object.keys(comment)) {
		if (comment[key] === undefined || comment[key] === null) {
			delete comment[key]
		}
	}
	return comment
}