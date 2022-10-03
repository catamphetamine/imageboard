import { DOMParser } from '@xmldom/xmldom'

export default function parseDocument(html) {
	// Web browsers seem to discard whitespace.
	html = html.trim()
	// Without the `<body/>` wrapper it would discard root-level text nodes.
	const document = new DOMParser().parseFromString('<body>' + html + '</body>', 'text/html')
	return document.childNodes[0]
}