import getMimeType, { getMimeTypeFileExtension } from '../../../utility/getMimeType.js'
import splitFilename from '../../../utility/splitFilename.js'

export default function parseAttachment(file, options) {
	options = {
		...options,
		formatUrl: (...args) => formatUrl.apply(this, args)
	}
	let name
	// `lynxchan` doesn't provide `file.originalName`
	// in `catalog.json` API response.
	if (file.originalName) {
		const [_name] = splitFilename(file.originalName)
		name = _name
	}
	const mimeType = file.mime
	if (mimeType && mimeType.indexOf('image/') === 0) {
		return parsePicture(file, mimeType, name, options)
	}
	if (mimeType && mimeType.indexOf('video/') === 0) {
		return parseVideo(file, mimeType, name, options)
	}
	// `kohlchan.net` may theoretically support attaching audio files.
	if (mimeType && mimeType.indexOf('audio/') === 0) {
		return parseAudio(file, mimeType, name, options)
	}
	return parseFile(file, mimeType, name, options)
}

function parsePicture(file, mimeType, name, {
	chan,
	boardId,
	attachmentUrl,
	attachmentThumbnailUrl,
	thumbnailSize,
	formatUrl
}) {
	const thumbnailExt = getThumbnailExt(file, 'picture', chan)
	const thumbnailDimensions = getThumbnailSize(file.width, file.height, thumbnailSize)

	const picture = {
		// Most of the times users would prefer not disclosing the actual file name.
		// title: name,
		type: mimeType,
		width: file.width,
		height: file.height,
		url: formatUrl(attachmentUrl, file.path),
		sizes: [{
			type: getMimeType(thumbnailExt),
			...thumbnailDimensions,
			url: formatUrl(attachmentThumbnailUrl, file.thumb)
		}]
	}
	// `lynxchan` doesn't provide thumbnail `size`
	// in a `/catalog.json` API respoinse.
	if (file.size !== undefined) {
		picture.size = file.size // in bytes
	}
	return {
		type: 'picture',
		picture
	}
}

function parseVideo(file, mimeType, name, {
	chan,
	boardId,
	attachmentUrl,
	attachmentThumbnailUrl,
	thumbnailSize,
	formatUrl
}) {
	const thumbnailExt = getThumbnailExt(file, 'video', chan)
	return {
		type: 'video',
		video: {
			type: mimeType,
			// Most of the times users would prefer not disclosing the actual file name.
			// title: name,
			width: file.width,
			height: file.height,
			size: file.size, // in bytes
			url: formatUrl(attachmentUrl, file.path),
			picture: {
				type: getMimeType(thumbnailExt),
				...getThumbnailSize(file.width, file.height, thumbnailSize),
				url: formatUrl(attachmentThumbnailUrl, file.thumb)
			}
		}
	}
}

function parseAudio(file, mimeType, name, {
	boardId,
	attachmentUrl,
	formatUrl
}) {
	return {
		type: 'audio',
		audio: {
			type: mimeType,
			title: name,
			url: formatUrl(attachmentUrl, file.path)
		}
	}
}

function parseFile(file, mimeType, name, {
	boardId,
	attachmentUrl,
	formatUrl
}) {
	const [_unused, ext] = splitFilename(file.path)
	return {
		type: 'file',
		file: {
			type: mimeType,
			name,
			ext,
			size: file.size, // in bytes
			url: formatUrl(attachmentUrl, file.path)
		}
	}
}

function formatUrl(urlTemplate, url) {
	// `kohlchan.net` doesn't have URL templates for attachments
	// but in reality it redirects to `kohlkanal.net`
	// so maybe in some future URL templates could be added.
	if (urlTemplate) {
		return urlTemplate.replace(/{url}/, url)
	}
	return url
}

// `lynxchan` doesn't provide `width` or `height` for image thumbnails, which is a bug.
// It only provides `width` an `height` for the original image.
// To work around that, thumbnail sizes are approximately calculated from the original image ones.
// The calculation is approximate because the client application can't speculate
// on how exactly does the server-side code round thumbnail `width` and `height` after the resize:
// is it `Math.floor()` or `Math.ceil()` or `Math.round()`, etc.
//
function getThumbnailSize(width, height, maxSize) {
	// `lynxchan` doesn't provide `width` or `height` for thread thumbnails on `/catalog` page.
	if (isNaN(width) || isNaN(height)) {
		return
	}
	// `maxSize` parameter should be configured in a specific imageboard's settings
	// as `thumbnailSize` parameter. When not provided, it should default to some
	// non-buggy (logically acceptable) behavior.
	if (isNaN(maxSize)) {
		console.error('`thumbnailSize` configuration parameter is missing')
		return {
			width,
			height
		}
	}
	if (width >= height) {
		return {
			width: maxSize,
			height: Math.round(maxSize * height / width)
		}
	} else {
		return {
			width: Math.round(maxSize * width / height),
			height: maxSize
		}
	}
}

const PNG_REG_EXP = /-imagepng$/
const GIF_REG_EXP = /-imagegif$/
const JPG_REG_EXP = /-imagejpeg$/

function getThumbnailExt(file, type, chan) {
	// Assume that all videos have ".jpg" thumbnails (makes sense).
	if (type === 'video') {
		return '.jpg'
	}
	// `kohlchan.net` always has ".png" extension for thumbnails.
	if (chan === 'kohlchan') {
		if (PNG_REG_EXP.test(file.thumb)) {
			return '.png'
		}
		if (GIF_REG_EXP.test(file.thumb)) {
			return '.png'
		}
		if (JPG_REG_EXP.test(file.thumb)) {
			return '.jpg'
		}
	}
	// Just a guess.
	return '.jpg'
}

export function getPictureTypeFromUrl(url) {
	if (PNG_REG_EXP.test(url)) {
		return 'image/png'
	}
	if (GIF_REG_EXP.test(url)) {
		return 'image/gif'
	}
	if (JPG_REG_EXP.test(url)) {
		return 'image/jpeg'
	}
	// Just a guess.
	return 'image/jpeg'
}

// `lynxchan` doesn't provide the original image URL
// in `/catalog.json` API response (which is a bug).
// http://lynxhub.com/lynxchan/res/722.html#q984
// This function returns the probable original image URL.
const THUMBNAIL_URL_REGEXP = /\/t_[0-9a-f]+-image([a-z]+)$/
export function guessFileUrlFromThumbnailUrl(thumbnailUrl, chan) {
	const match = thumbnailUrl.match(THUMBNAIL_URL_REGEXP)
	if (match) {
		return thumbnailUrl.replace('/t_', '/') + '.' + getMimeTypeFileExtension(`image/${match[1]}`)
	}
	// Images from `kohlchan.net` before moving to `lynxchan` in May 2019
	// have incorrect URLs: they don't have the extension part.
	// For example:
	// Exists: https://kohlchan.net/.media/82b9c3a866f6233f1c0253d3eb819ea5-imagepng
	// Not exists: https://kohlchan.net/.media/82b9c3a866f6233f1c0253d3eb819ea5-imagepng.png
	//
	// Could also be a video file URL: ignores such cases.
	//
	return thumbnailUrl
}