import parseAttachment from './parseAttachment.js'

export default function parseAttachments(files, {
	attachmentUrl,
	attachmentThumbnailUrl
}) {
	if (files.length > 0) {
		return files.map((file) => {
			return parseAttachment(file, {
				attachmentUrl,
				attachmentThumbnailUrl
			})
		})
	}
}