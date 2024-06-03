import fetch, { FormData } from 'node-fetch'

import Imageboard from './Imageboard.js'
import createHttpRequestFunction from './createHttpRequestFunction.js'

export default function ImageboardForNode(idOrConfig, options) {
	return Imageboard(idOrConfig, {
		sendHttpRequest: createHttpRequestFunction({ fetch, FormData }),
		...options
	})
}