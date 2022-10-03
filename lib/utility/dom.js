/**
 * Stringifies a DOM node.
 * @param {Object} element - A DOM node.
 * @return {String} - A stringified node representation.
 */
export function stringifyElement(element) {
	const attributes = []
	for (var i = 0; i < element.attributes.length; i++) {
		const attribute = element.attributes[i]
		attributes.push(attribute.name + '="' + attribute.value + '"')
	}
	return `<${element.tagName} ${attributes.join(' ')}>...</${element.tagName}>`
}