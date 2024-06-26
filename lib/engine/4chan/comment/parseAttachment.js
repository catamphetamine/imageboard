import getMimeType from '../../../utility/getMimeType.js'
import splitFilename from '../../../utility/splitFilename.js'

export default function parseAttachment(file, options) {
	const { chan, engine } = options
	if (chan === '8ch') {
		if (file.fpath) {
			options = {
				...options,
				// `8ch.net` has `fpath: 0/1` parameter for attachments:
				// "fpath" attachments are hosted at the global board-agnostic
				// "fpath" URLs (not having `boardId` as part of their URL)
				// and all other attachments are hosted at board-specific URLs.
				attachmentUrl: options.attachmentUrlFpath,
				attachmentThumbnailUrl: options.attachmentThumbnailUrlFpath
			}
		}
	}
	options = {
		...options,
		formatUrl: (...args) => formatUrl.apply(this, args)
	}
	// Just in case there's some new file type without a `filename`.
	let name
	if (file.filename) {
		name = splitFilename(file.filename)[0]
	}

	const mimeType = getMimeType(file.ext)
	if (mimeType && mimeType.indexOf('image/') === 0) {
		return parsePicture(file, mimeType, name, options)
	}
	if (mimeType && mimeType.indexOf('video/') === 0) {
		return parseVideo(file, mimeType, name, options)
	}
	// `kohlchan.net` supports attaching audio files.
	if (mimeType && mimeType.indexOf('audio/') === 0) {
		return parseAudio(file, mimeType, name, options)
	}
	return parseFile(file, mimeType, name, options)
}

function parsePicture(file, mimeType, name, {
	chan,
	engine,
	boardId,
	attachmentUrl,
	attachmentThumbnailUrl,
	formatUrl
}) {
	const thumbnailExt = getThumbnailExt(file, 'picture', chan, engine)
	const thumbnailType = getMimeType(thumbnailExt)

	const sizes = [{
		type: thumbnailType,
		width: file.tn_w,
		height: file.tn_h,
		url: formatUrl(
			attachmentThumbnailUrl,
			boardId,
			file.tim,
			thumbnailExt,
			file.filename,
			{ chan, thumbnail: true }
		)
	}]

	// `4chan.org` generates smaller copies of images (limited to 1024x1024)
	// for images having both width and height greater than 1024px.
	// These images are in the same location as usual but the filename ends with "m".
	// `m_img` parameter indicates that this smaller image is available.
	// https://github.com/4chan/4chan-API/issues/63
	if (chan === '4chan' && file.m_img) {
		const aspectRatio = file.w / file.h
		sizes.push({
			type: thumbnailType,
			width: aspectRatio >= 1 ? 1024 : Math.round(1024 * aspectRatio),
			height: aspectRatio >= 1 ? Math.round(1024 / aspectRatio) : 1024,
			url: formatUrl(
				attachmentUrl,
				boardId,
				file.tim + 'm',
				thumbnailExt,
				file.filename,
				{ chan, thumbnail: true }
			)
		})
	}

	// On `lainchan.org`, it is possible to attach `*.svg` images
	// but `width` and `height` for those are `undefined`.
	// `width` and `height` are required on a `Picture` object
	// in order to be able to calculate its aspect ratio.
	// As a workaround, `width` and `height` could be derived from the dimensions of a raster thumbnail.
	let { w: width, h: height } = file
	if (width === undefined && height === undefined) {
		const thumbnailSize = sizes[sizes.length - 1]
		if (!isNaN(thumbnailSize.width)) {
			width = thumbnailSize.width
			height = thumbnailSize.height
		}
	}

	const attachment = {
		type: 'picture',
		picture: {
			type: mimeType,
			// Most of the times users would prefer not disclosing the actual file name.
			// title: name,
			width,
			height,
			size: file.fsize, // in bytes
			url: formatUrl(
				attachmentUrl,
				boardId,
				file.tim,
				file.ext,
				file.filename,
				{ chan }
			),
			sizes
		}
	}

	// `8ch.net` and `4chan.org` have `spoiler: 0/1` on attachments.
	if (file.spoiler) {
		attachment.spoiler = true
	}

	return attachment
}

function parseVideo(file, mimeType, name, {
	chan,
	engine,
	boardId,
	attachmentUrl,
	attachmentThumbnailUrl,
	formatUrl
}) {
	const thumbnailExt = getThumbnailExt(file, 'video', chan, engine)
	const attachment = {
		type: 'video',
		video: {
			type: mimeType,
			// Most of the times users would prefer not disclosing the actual file name.
			// title: name,
			width: file.w,
			height: file.h,
			size: file.fsize, // in bytes
			url: formatUrl(
				attachmentUrl,
				boardId,
				file.tim,
				file.ext,
				file.filename,
				{ chan }
			),
			picture: {
				type: getMimeType(thumbnailExt),
				width: file.tn_w,
				height: file.tn_h,
				url: formatUrl(
					attachmentThumbnailUrl,
					boardId,
					file.tim,
					thumbnailExt,
					file.filename,
					{ chan, thumbnail: true }
				)
			}
		}
	}
	// `8ch.net` and `4chan.org` have `spoiler: 0/1` on attachments.
	if (file.spoiler) {
		attachment.spoiler = true
	}
	return attachment
}

function parseAudio(file, mimeType, name, {
	chan,
	boardId,
	fileAttachmentUrl,
	attachmentUrl,
	formatUrl
}) {
	return {
		type: 'audio',
		audio: {
			type: mimeType,
			title: name,
			url: formatUrl(
				fileAttachmentUrl || attachmentUrl,
				boardId,
				file.tim,
				file.ext,
				file.filename,
				{ chan }
			)
		}
	}
}

function parseFile(file, mimeType, name, {
	chan,
	engine,
	boardId,
	attachmentUrl,
	fileAttachmentUrl,
	attachmentThumbnailUrl,
	formatUrl
}) {
	const attachment = {
		type: 'file',
		file: {
			type: mimeType,
			name,
			ext: file.ext,
			size: file.fsize, // in bytes
			url: formatUrl(
				fileAttachmentUrl || attachmentUrl,
				boardId,
				file.tim,
				file.ext,
				file.filename,
				{ chan }
			)
		}
	}
	// 4chan.org `/f/` board attachments (Flash files) have `width` and `height`.
	if (file.w !== undefined) {
		attachment.file.width = file.w
		attachment.file.height = file.h
	}
	// On `lainchan.org` PDFs have thumbnails.
	if (file.tim) {
		const thumbnailExt = getThumbnailExt(file, 'file', chan, engine)
		const thumbnailType = getMimeType(thumbnailExt)
		attachment.file.picture = {
			type: thumbnailType,
			width: file.tn_w,
			height: file.tn_h,
			url: formatUrl(
				attachmentThumbnailUrl,
				boardId,
				file.tim,
				thumbnailExt,
				null,
				{ chan, thumbnail: true }
			)
		}
	}
	return attachment
}

function getThumbnailExt(file, type, chan, engine) {
	// Assume that all videos have ".jpg" thumbnails (makes sense).
	if (type === 'video') {
		return '.jpg'
	}
	// `4chan.org` always has ".jpg" extension for thumbnails.
	if (chan === '4chan') {
		return '.jpg'
	}
	// `8ch.net` has same file extension for thumbnails (even for GIFs).
	if (chan === '8ch') {
		return file.ext
	}
	// // `lainchan.org` has thumbnails on PDFs.
	// if (chan === 'lainchan' && file.ext === '.pdf') {
	// 	return '.png'
	// }
	// `lainchan.org` always has ".png" extension for thumbnails.
	if (engine === 'vichan' || engine === 'lainchan') {
		// On `tahta.ch`, for some weird reason, image thumbnail extension
		// is always the same as the original image extension.
		if (chan === 'tahtach') {
			// Skip.
		} else {
			return '.png'
		}
	}
	return file.ext
}

function formatUrl(
	urlTemplate,
	boardId,
	name,
	ext,
	originalName,
	{ chan, thumbnail }
) {
	if (thumbnail && chan === 'vecchiochan') {
		name = name.replace('/src/', '/thumb/')
	}
	return urlTemplate
		.replace('{boardId}', boardId)
		.replace('{name}', name)
		.replace('{ext}', ext)
		.replace('{originalName}', originalName)
}