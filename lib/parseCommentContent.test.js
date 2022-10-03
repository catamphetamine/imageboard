import expectToEqual from './utility/expectToEqual.js'

import parseCommentContent from './parseCommentContent.js'

function parseCommentTest(comment, expected, expectedWarnings = []) {
	const consoleWarn = console.warn
	const warnings = []
	console.warn = (text) => warnings.push(text)

	const result = parseCommentContent(comment, {
		plugins: [
			{
				tag: 'strong',
				createBlock(content) {
					return {
						type: 'text',
						style: 'bold',
						content
					}
				}
			}
		]
	})

	console.warn = consoleWarn

	expectToEqual(warnings, expectedWarnings)
	expectToEqual(result, expected)
}

describe('parseCommentContent', () => {
	it('should parse empty comments', () => {
		parseCommentTest(
			' ',
			undefined
		)
	})

	it('should skip unknown tags', () => {
		parseCommentTest(
			'<div>' +
				'<h1>Heading</h1>' +
				'<p>Text <strong>bold</strong> regular</p>' +
			'</div>' +
			'<br>' +
			'Rest text',
			[
				[
					'\n',
					'\n',
					'\n',
					'Heading',
					'\n',
					'\n',
					'\n',
					'\n',
					'Text ',
					{
						type: 'text',
						style: 'bold',
						content: 'bold'
					},
					' regular',
					'\n',
					'\n',
					'\n',
					'\n',
					'Rest text'
				]
			],
			[
				"[imageboard] Unsupported markup found:",
				"[imageboard] Unsupported markup found:",
				"[imageboard] Unsupported markup found:"
			]
		)
	})

	it('should match attributes', () => {
		expectToEqual(
			parseCommentContent(
				'<div class="a">b</div>',
				{
					plugins: [
						{
							tag: 'div',
							attributes: [{
								name: 'class',
								value: 'a'
							}],
							createBlock(content) {
								return {
									type: 'text',
									style: 'a',
									content
								}
							}
						}
					]
				}
			),
			[
				[
					{
						type: 'text',
						style: 'a',
						content: 'b'
					}
				]
			]
		)
	})

	it('should match regular expression attributes', () => {
		expectToEqual(
			parseCommentContent(
				'<div class="a a1 a2">b</div>',
				{
					plugins: [
						{
							tag: 'div',
							attributes: [{
								name: 'class',
								value: /^a\s?/
							}],
							createBlock(content) {
								return {
									type: 'text',
									style: 'a',
									content
								}
							}
						}
					]
				}
			),
			[
				[
					{
						type: 'text',
						style: 'a',
						content: 'b'
					}
				]
			]
		)
	})
})

