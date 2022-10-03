import generatePostPreview from 'social-components/utility/post/generatePostPreview.js'

/**
 * Generates a `.contentPreview` from `comment`'s `.content`.
 * @param {object} comment
 * @param {number} maxLength — Preview content (soft) limit (in "points": for text, one "point" is equal to one character, while any other non-text content has its own "points", including attachments and new line character).
 * @param {boolean} minimizeGeneratedPostLinkBlockQuotes — Set to `true` to indicate that post links with generated block quotes are initially minimized when rendered: this results in skipping counting those post links' content characters when generating post preview.
 */
export default function generatePreview(comment, {
	maxLength,
	minimizeGeneratedPostLinkBlockQuotes
}) {
	if (comment.content) {
		const preview = generatePostPreview(
			comment,
			{
				maxLength,
				minimizeGeneratedPostLinkBlockQuotes
			}
		)
		if (preview) {
			comment.contentPreview = preview
		}
	}
}