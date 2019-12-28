import expectToEqual from './utility/expectToEqual'

import setInReplyToQuotes, { endsWithNewLineAndOptionalWhiteSpace } from './setInReplyToQuotes'

describe('setInReplyToQuotes', () => {
	it('should set "quote" from "content" if the comment is from another thread', () => {
		const messages = {}
		const post = {
			id: 111,
			content: [
				[
					{
						type: 'post-link',
						content: 'Comment',
						postId: 123,
						postIsExternal: true
					}
				]
			]
		}
		setInReplyToQuotes(
			post.content,
			{
				getCommentById: id => undefined,
				messages
			}
		)
		expectToEqual(
			post.content,
			[
				[
					{
						type: 'post-link',
						content: [{
							type: 'quote',
							generated: true,
							content: 'Comment'
						}],
						postId: 123,
						postIsExternal: true
					}
				]
			]
		)
	})

	it('shouldn\'t set "quote" from "content" if the comment is not taking the whole line (has pre text)', () => {
		const messages = {}
		const post = {
			id: 111,
			content: [
				[
					'Link: ',
					{
						type: 'post-link',
						content: 'Comment',
						postId: 123,
						postIsExternal: true
					}
				]
			]
		}
		setInReplyToQuotes(
			post.content,
			{
				getCommentById: id => undefined,
				messages
			}
		)
		expectToEqual(
			post.content,
			[
				[
					'Link: ',
					{
						type: 'post-link',
						content: '[comment]',
						postId: 123,
						postIsExternal: true
					}
				]
			]
		)
	})

	it('shouldn\'t set "quote" from "content" if the comment is not taking the whole line (has post text)', () => {
		const messages = {}
		const post = {
			id: 111,
			content: [
				[
					{
						type: 'post-link',
						content: 'Comment',
						postId: 123,
						postIsExternal: true
					},
					'.'
				]
			]
		}
		setInReplyToQuotes(
			post.content,
			{
				getCommentById: id => undefined,
				messages
			}
		)
		expectToEqual(
			post.content,
			[
				[
					{
						type: 'post-link',
						content: '[comment]',
						postId: 123,
						postIsExternal: true
					},
					'.'
				]
			]
		)
	})

	it('should set `content` to `messages.comment.default` if there\'s the message', () => {
		const messages = {
			comment: {
				default: 'Comment'
			}
		}
		const post = {
			id: 111,
			content: [
				[
					{
						type: 'post-link',
						content: 'Comment',
						postId: 123,
						postIsExternal: true
					},
					'.'
				]
			]
		}
		setInReplyToQuotes(
			post.content,
			{
				getCommentById: id => undefined,
				messages
			}
		)
		expectToEqual(
			post.content,
			[
				[
					{
						type: 'post-link',
						content: '[comment]',
						postId: 123,
						postIsExternal: true
					},
					'.'
				]
			]
		)
	})

	it('should set quotes for two consequtive `post-link`s on consequtive lines', () => {
		const messages = {
			comment: {
				default: 'Comment'
			}
		}
		const post = {
			id: 111,
			content: [
				[
					{
						type: 'post-link',
						content: 'Comment',
						postId: 123
					},
					'\n',
					{
						type: 'post-link',
						content: 'Comment',
						postId: 124
					},
					'\n',
					'Text'
				]
			]
		}
		setInReplyToQuotes(
			post.content,
			{
				getCommentById: (id) => {
					switch (id) {
						case 111:
							return post
						case 123:
							return { content: [['A']] }
						case 124:
							return { content: [['B']] }
					}
				},
				messages
			}
		)
		expectToEqual(
			post.content,
			[
				[
					{
						type: 'post-link',
						content: [{
							type: 'quote',
							generated: true,
							content: 'A'
						}],
						postId: 123
					},
					'\n',
					{
						type: 'post-link',
						content: [{
							type: 'quote',
							generated: true,
							content: 'B'
						}],
						postId: 124
					},
					'\n',
					'Text'
				]
			]
		)
	})
})

describe('endsWithNewLineAndOptionalWhiteSpace', () => {
	it('should work', () => {
		expectToEqual(
			endsWithNewLineAndOptionalWhiteSpace(
				['text'],
				0,
				true
			),
			true
		)
		expectToEqual(
			endsWithNewLineAndOptionalWhiteSpace(
				['text'],
				0,
				false
			),
			true
		)
		expectToEqual(
			endsWithNewLineAndOptionalWhiteSpace(
				['text', '\n'],
				0,
				true
			),
			true
		)
		expectToEqual(
			endsWithNewLineAndOptionalWhiteSpace(
				['text', '\n', {}],
				0,
				true
			),
			true
		)
		expectToEqual(
			endsWithNewLineAndOptionalWhiteSpace(
				['text', {}, '\n'],
				0,
				true
			),
			false
		)
		expectToEqual(
			endsWithNewLineAndOptionalWhiteSpace(
				[{}, 'text', '\n'],
				1,
				true
			),
			true
		)
		expectToEqual(
			endsWithNewLineAndOptionalWhiteSpace(
				['\n', 'text'],
				1,
				false
			),
			true
		)
		expectToEqual(
			endsWithNewLineAndOptionalWhiteSpace(
				['\n', {}, 'text'],
				2,
				false
			),
			false
		)
		expectToEqual(
			endsWithNewLineAndOptionalWhiteSpace(
				[{}, '\n', 'text'],
				2,
				false
			),
			true
		)
	})
})