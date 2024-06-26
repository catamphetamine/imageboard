import expectToEqual from '../../../utility/expectToEqual.js'

import KohlChan from '../../../chans/kohlchan/index.js'

import { fixNewLineCharacters } from './parseComment.js'

function parseCommentTest(comment, options, expected, expectedWarnings = []) {
	const consoleWarn = console.warn
	const warnings = []
	console.warn = (text) => warnings.push(text)

	const attachmentsAreBeingTested = comment.files !== undefined

	comment = KohlChan({
		messages: {
			comment: {
				deleted: 'Deleted comment',
				external: 'Comment from another thread',
				default: 'Comment'
			}
		}
	}).parseComment(
		{
			files: [],
			...comment
		},
		options,
		{
			thread: {
				id: comment.postId
			}
		}
	)

	if (!attachmentsAreBeingTested) {
		delete comment.attachments
	}

	console.warn = consoleWarn

	expectToEqual(warnings, expectedWarnings)
	expectToEqual(comment, expected)
}

describe('parseComment', () => {
	it('should detect banned posts', () => {
		const date = new Date()
		parseCommentTest(
			{
				postId: 456,
				creation: date.toISOString(),
				markdown: 'Text',
				banMessage: '(USER WAS BANNED FOR THIS POST)'
			},
			{
				boardId: 'b',
				threadId: 123
			},
			{
				id: 456,
				createdAt: date,
				authorBan: {
					reason: '(USER WAS BANNED FOR THIS POST)'
				},
				content: [
					[
						'Text'
					]
				]
			}
		)
	})

	it('should detect "administrator" role', () => {
		const date = new Date()
		parseCommentTest(
			{
				postId: 456,
				creation: date.toISOString(),
				markdown: 'Text',
				signedRole: 'Root'
			},
			{
				boardId: 'b',
				threadId: 123,
				capcodes: {
					"Administrator": {
						"role": "administrator"
					},
					"Global Moderator": {
						"role": "moderator"
					}
				}
			},
			{
				id: 456,
				createdAt: date,
				authorRole: 'administrator',
				content: [
					[
						'Text'
					]
				]
			}
		)
	})

	it('should detect "moderator" role', () => {
		const date = new Date()
		parseCommentTest(
			{
				postId: 456,
				creation: date.toISOString(),
				markdown: 'Text',
				signedRole: 'Global volunteer'
			},
			{
				boardId: 'b',
				threadId: 123,
				capcodes: {
					"Administrator": {
						"role": "administrator"
					},
					"Global Moderator": {
						"role": "moderator"
					}
				}
			},
			{
				id: 456,
				createdAt: date,
				authorRole: 'moderator',
				content: [
					[
						'Text'
					]
				]
			}
		)
	})

	it('should parse kohlchan.net custom flags', () => {
		const date = new Date()
		parseCommentTest(
			{
				postId: 456,
				creation: date.toISOString(),
				markdown: 'Text',
				flag: "/.static/flags/onion.png",
				flagCode: null,
				flagName: "Onion"
			},
			{
				boardId: 'b',
				threadId: 123
			},
			{
				id: 456,
				createdAt: date,
				// authorIconId: 'onion',
				authorIconUrl: '/.static/flags/onion.png',
				authorIconName: 'Onion',
				content: [
					[
						'Text'
					]
				]
			}
		)
	})

	it('should parse kohlchan.net custom flags ("/vsa" subdirectory)', () => {
		const date = new Date()
		parseCommentTest(
			{
				postId: 456,
				creation: date.toISOString(),
				markdown: 'Text',
				flag: "/.static/flags/vsa/ca.png",
				flagCode: null,
				flagName: "California"
			},
			{
				boardId: 'b',
				threadId: 123
			},
			{
				id: 456,
				createdAt: date,
				// authorIconId: 'vsa/ca',
				authorIconUrl: '/.static/flags/vsa/ca.png',
				authorIconName: 'California',
				content: [
					[
						'Text'
					]
				]
			}
		)
	})

	it('should parse kohlchan.net country flags', () => {
		const date = new Date()
		parseCommentTest(
			{
				postId: 456,
				creation: date.toISOString(),
				markdown: 'Text',
				flag: "/.static/flags/de.png",
				flagCode: '-br',
				flagName: "Deutschland"
			},
			{
				boardId: 'b',
				threadId: 123
			},
			{
				id: 456,
				createdAt: date,
				authorCountry: 'DE',
				content: [
					[
						'Text'
					]
				]
			}
		)
	})
})

describe('fixNewLineCharacters', () => {
	it('should fix carriage returns and replace new line characters with line break tags', () => {
		fixNewLineCharacters('<span class="redText">testing\u000d\u000atesting</span>\u000d\u000a<code>code line 0\u000d\u000acode line 1\u000d\u000acode line 2</code>\u000d\u000a\u000d\u000a<span class="aa">aa line 0\u000d\u000aaa line 1\u000d\u000aaa line 2</span>').should.equal('<span class="redText">testing<br>testing</span><br><code>code line 0\ncode line 1\ncode line 2</code><br><br><span class="aa">aa line 0\naa line 1\naa line 2</span>')
	})
})