import { generatePostPreview } from 'social-components/post'

/**
 * Creates a preview for `comment`'s `.content`.
 * @param {object} comment
 * @param {number} maxLength — Preview content (soft) limit (in "points": for text, one "point" is equal to one character, while any other non-text content has its own "points", including attachments and new line character).
 * @param {boolean} minimizeGeneratedPostLinkBlockQuotes — One can pass `true` to indicate that auto-generated quotes are minimized by default until the user expands them manually. This would mean that auto-generated quotes shouldn't be accounted for when calculating the total length of a comment when creating a shorter "preview" for it in case it exceeds the maxum preferred length.
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