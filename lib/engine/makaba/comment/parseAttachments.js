import parseAttachment from './parseAttachment.js'

export default function parseAttachments(post, { transformAttachmentUrl, toAbsoluteUrl }) {
	// `post.files` is gonna be `null` when there're no attachments.
	if (post.files === null) {
		return
	}
	if (post.files.length > 0) {
		return post.files.map((file) => {
			return parseAttachment(file, { transformAttachmentUrl, toAbsoluteUrl })
		})
	}
}