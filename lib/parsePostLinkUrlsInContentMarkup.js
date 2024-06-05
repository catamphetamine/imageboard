import isEqual from 'lodash/isEqual.js'

import parsePostLinkUrl from './parsePostLinkUrl.js'

export default function parsePostLinkUrlUrlsInContentMarkup(rawContent, { commentUrlParser }) {
	const regExp = / href="(.+?)"/g
	const postLinkMetas = []
	let hrefMatch
	while ((hrefMatch = regExp.exec(rawContent)) !== null) {
		const href = hrefMatch[1]
		const postLinkMeta = parsePostLinkUrl(href, { commentUrlParser })
		if (postLinkMeta) {
			// Exclude duplicates.
			if (!postLinkMetas.find((meta) => isEqual(meta, postLinkMeta))) {
				postLinkMetas.push(postLinkMeta)
			}
		}
	}
	return postLinkMetas
}