import getMimeType from '../../../utility/getMimeType.js'
import splitFilename from '../../../utility/splitFilename.js'

export default function parseAttachment(file, {
	attachmentUrl,
	attachmentThumbnailUrl
}) {
	const formatUrl = (parameters) => {
		return _formatUrl(attachmentUrl, parameters)
	}

	const formatThumbnailUrl = (parameters) => {
		return _formatUrl(attachmentThumbnailUrl, parameters)
	}

	const mimeType = file.mimetype

	const parseAttachment = () => {
		if (mimeType.indexOf('image/') === 0) {
			return parsePicture(file, { mimeType, formatUrl, formatThumbnailUrl })
		}
		if (mimeType.indexOf('video/') === 0) {
			return parseVideo(file, { mimeType, formatUrl, formatThumbnailUrl })
		}
		if (mimeType.indexOf('audio/') === 0) {
			return parseAudio(file, { mimeType, formatUrl, formatThumbnailUrl })
		}
		return parseFile(file, { mimeType, formatUrl, formatThumbnailUrl })
	}

	const attachment = parseAttachment()

	if (file.spoiler) {
		attachment.spoiler = true
	}

	return attachment
}

function parsePicture(file, { mimeType, formatUrl, formatThumbnailUrl }) {
	const attachment = {
		type: 'picture',
		picture: {
			type: mimeType,
			// Most of the times users would prefer not disclosing the actual file name.
			// title: file.originalFilename ? splitFilename(file.originalFilename)[0] : undefined,
			width: file.geometry.width,
			height: file.geometry.height,
			size: file.size, // in bytes
			url: formatUrl({ name: file.hash, ext: file.extension })
		}
	}

	if (file.hasThumb) {
		attachment.picture.sizes = [{
			type: getMimeType(file.thumbextension),
			width: file.geometry.thumbwidth,
			height: file.geometry.thumbheight,
			url: formatThumbnailUrl({ name: file.hash, ext: file.thumbextension })
		}]
	}

	return attachment
}

function parseVideo(file, { mimeType, formatUrl, formatThumbnailUrl }) {
	const attachment = {
		type: 'video',
		video: {
			type: mimeType,
			// Most of the times users would prefer not disclosing the actual file name.
			// title: file.originalFilename ? splitFilename(file.originalFilename)[0] : undefined,
			duration: file.duration,
			width: file.geometry.width,
			height: file.geometry.height,
			size: file.size, // in bytes
			url: formatUrl({ name: file.hash, ext: file.extension })
		}
	}

	if (file.hasThumb) {
		attachment.video.picture = {
			type: getMimeType(file.thumbextension),
			width: file.geometry.thumbwidth,
			height: file.geometry.thumbheight,
			url: formatThumbnailUrl({ name: file.hash, ext: file.thumbextension })
		}
	}

	return attachment
}

function parseAudio(file, { mimeType, formatUrl, formatThumbnailUrl }) {
	const attachment = {
		type: 'audio',
		audio: {
			type: mimeType,
			title: splitFilename(file.originalFilename || file.filename)[0],
			duration: file.duration,
			url: formatUrl({ name: file.hash, ext: file.extension })
		}
	}

	if (file.hasThumb) {
		attachment.audio.picture = {
			type: getMimeType(file.thumbextension),
			width: file.geometry.thumbwidth,
			height: file.geometry.thumbheight,
			url: formatThumbnailUrl({ name: file.hash, ext: file.thumbextension })
		}
	}

	return attachment
}

function parseFile(file, { mimeType, formatUrl, formatThumbnailUrl }) {
	const [name, ext] = splitFilename(file.originalFilename || file.filename)

	const attachment = {
		type: 'file',
		file: {
			type: mimeType,
			name,
			ext,
			size: file.size, // in bytes
			url: formatUrl({ name: file.hash, ext: file.extension })
		}
	}

	if (file.hasThumb) {
		attachment.file.picture = {
			type: getMimeType(file.thumbextension),
			width: file.geometry.thumbwidth,
			height: file.geometry.thumbheight,
			url: formatThumbnailUrl({ name: file.hash, ext: file.thumbextension })
		}
	}

	return attachment
}

function _formatUrl(urlTemplate, {
	name,
	ext
}) {
	return urlTemplate
		.replace('{name}', name)
		.replace('{ext}', ext)
}