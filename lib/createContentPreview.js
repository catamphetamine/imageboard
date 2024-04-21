import { generatePostPreview } from 'social-components/post'

/**
 * Creates a preview for `comment`'s `.content`.
 * @param {object} comment
 * @param {number} maxLength — Preview content (soft) limit (in "points": for text, one "point" is equal to one character, while any other non-text content has its own "points", including attachments and new line character).
 * @param {boolean} minimizeGeneratedPostLinkBlockQuotes — Set to `true` to indicate that post links with generated block quotes are initially minimized when rendered: this results in skipping counting those post links' content characters when generating post preview.
 * @return {Content} [contentPreview]
 */
export default function createContentPreview(comment, {
	maxLength,
	minimizeGeneratedPostLinkBlockQuotes
}) {
	if (comment.content) {
		return generatePostPreview(comment, {
			maxLength,
			minimizeGeneratedPostLinkBlockQuotes
		})
	}
}