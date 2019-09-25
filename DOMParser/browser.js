// `DOMParser` is supported in web browsers.
module.exports = function parseDocument(html) {
	const document = new DOMParser().parseFromString(html, 'text/html')
	return document.body
}