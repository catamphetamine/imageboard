import parseAttachment, { getPictureTypeFromUrl, guessFileUrlFromThumbnailUrl } from './parseAttachment.js'

export default function parseAttachments(post, {
	chan,
	boardId,
	attachmentUrl,
	attachmentThumbnailUrl,
	thumbnailSize,
	toAbsoluteUrl
}) {
	let files = post.files
	let isLynxChanCatalogAttachmentsBug

	// In `lynxchan` engine, in `/catalog.json` API response, there're no `files` array.
	// There're only two properties — `thumb` and `mime` — and no `width` or `height`, which is a bug.
	// https://gitlab.com/catamphetamine/imageboard/-/blob/master/docs/engines/lynxchan-issues.md#no-thread-thumbnail-size-in-catalog-api-response
	//
	// The bug is not present on `kohlchan.net` (as of 2022) because they're using their own fork of `lynxchan`.
	// The bug could be observed at the offical `lynxchan` demo site by looking at the JSON API response:
	// https://<website>/<board>/catalog.json.
	//
	// This function marks such buggy attachments with a `isLynxChanCatalogAttachmentsBug` flag.
	// It also creates a dummy `files` array (containing just the thumbnail), with a dummy width and height.
	//
	if (!files) {
		if (post.thumb) {
			isLynxChanCatalogAttachmentsBug = true
			// A stub for the absent `files` bug in `/catalog.json` API response.
			files = [{
				// `mime`-type of `thumb` has been added in `catalog.json` response
				// in LynxChan `2.5.0` on about `24 Aug, 2020`.
				// https://gitgud.io/LynxChan/LynxChan/-/blob/3fe64b5db082a80732435492020dad84db2fe8f8/doc/Json.txt
				mime: post.mime || getPictureTypeFromUrl(post.thumb, chan),
				// `lynxchan` doesn't provide `width` and `height`
				// neither for the picture not for the thumbnail
				// in `/catalog.json` API response (which is a bug).
				// http://lynxhub.com/lynxchan/res/722.html#q984
				// `width` and `height` are set later when the image is loaded.
				width: thumbnailSize,
				height: thumbnailSize,
				// Even if `path` URL would be derived from `thumb` URL
				// the `width` and `height` would still be unspecified.
				// path: post.thumb,
				path: guessFileUrlFromThumbnailUrl(post.thumb, chan),
				thumb: post.thumb,
				originalName: '[stub]'
			}]
		} else {
			files = []
		}
	}

	if (files.length > 0) {
		files = files.map((file) => parseAttachment(file, {
			chan,
			boardId,
			attachmentUrl,
			attachmentThumbnailUrl,
			thumbnailSize,
			toAbsoluteUrl
		}))
		if (isLynxChanCatalogAttachmentsBug) {
			files[0].isLynxChanCatalogAttachmentsBug = true
		}
		return files
	}
}