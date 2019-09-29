import getPostText from 'social-components/commonjs/utility/post/getPostText'

/**
 * Generates a textual representation of comment's `content`.
 * This is just a `getPostText()` function re-exported from
 * `social-components` for convenience.
 * @param  {object} comment
 * @param  {object} [options] — See `options` description in `social-components/source/utility/post/getPostText`.
 * @return {string} [text]
 */
export default function getCommentText(comment, options = {}) {
	const { messages, ...rest } = options
	return getPostText(comment, {
		...rest,
		messages: messages && messages.contentType
	})
}