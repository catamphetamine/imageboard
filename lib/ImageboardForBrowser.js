import Imageboard from './Imageboard.js'
import createHttpRequestFunction from './createHttpRequestFunction.js'

export default function ImageboardForBrowser(idOrConfig, options) {
	return Imageboard(idOrConfig, {
		sendHttpRequest: createHttpRequestFunction({ fetch, FormData }),
		...options
	})
}