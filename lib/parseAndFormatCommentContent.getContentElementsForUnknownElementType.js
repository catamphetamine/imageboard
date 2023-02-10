const ADD_LINE_BREAKS_AROUND_TAGS = [
	'div',
	'section',
	'blockquote'
]

const ADD_DOUBLE_LINE_BREAKS_AROUND_TAGS = [
	'p',
	'h1',
	'h2',
	'h3',
	'h4',
	'h5',
	'h6'
]

const LINE_BREAK_ELEMENT = '\n'

// Wraps certain unsupported tags with "\n"s.
//
// Example:
// * element: `<p>some <b>text</b> inside</p>`
// * returns: `["\n", "\n", "some ", <b>text</b>, " inside", "\n", "\n"]`
//
// This way, for example, even if `<p/>` tag is not supported,
// it will still render kinda like a `<p/>` should.
//
export default function getContentElementsForUnknownElementType({ element, getContentElements }) {
	const tag = element.tagName.toLowerCase()
	if (ADD_LINE_BREAKS_AROUND_TAGS.includes(tag)) {
		return [
			LINE_BREAK_ELEMENT,
			...getContentElements(),
			LINE_BREAK_ELEMENT
		]
	} else if (ADD_DOUBLE_LINE_BREAKS_AROUND_TAGS.includes(tag)) {
		return [
			LINE_BREAK_ELEMENT,
			LINE_BREAK_ELEMENT,
			...getContentElements(),
			LINE_BREAK_ELEMENT,
			LINE_BREAK_ELEMENT
		]
	}
	return getContentElements()
}
