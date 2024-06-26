import expectToEqual from './utility/expectToEqual.js'

import setPostLinkQuotes, { endsWithNewLineAndOptionalWhiteSpace } from './setPostLinkQuotes.js'

const messages = {
	comment: {
		external: 'Comment from another thread',
		deleted: 'Deleted comment',
		default: 'Comment'
	},
	thread: {
		default: 'Thread'
	}
}

describe('setPostLinkQuotes', () => {
	it('should set "quote" from "content" if the comment is from another thread', () => {
		const post = {
			id: 111,
			content: [
				[
					{
						type: 'post-link',
						content: 'Comment',
						meta: {
							commentId: 123,
							isAnotherThread: true
						}
					}
				]
			]
		}
		setPostLinkQuotes(
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
							block: true,
							contentGenerated: true,
							content: 'Comment'
						}],
						meta: {
							commentId: 123,
							isAnotherThread: true
						}
					}
				]
			]
		)
	})

	it('shouldn\'t set "quote" from "content" if the comment is not taking the whole line (has pre text)', () => {
		const post = {
			id: 111,
			content: [
				[
					'Link: ',
					{
						type: 'post-link',
						content: 'Comment',
						meta: {
							commentId: 123
						}
					}
				]
			]
		}
		setPostLinkQuotes(
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
						content: 'Comment',
						meta: {
							commentId: 123
						}
					}
				]
			]
		)
	})

	it('shouldn\'t set "quote" from "content" if the comment is not taking the whole line (has post text)', () => {
		const post = {
			id: 111,
			content: [
				[
					{
						type: 'post-link',
						content: 'Comment',
						meta: {
							commentId: 123
						}
					},
					'.'
				]
			]
		}
		setPostLinkQuotes(
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
						content: 'Comment',
						meta: {
							commentId: 123
						}
					},
					'.'
				]
			]
		)
	})

	it('should set `content` to `messages.comment.default` if there\'s the message', () => {
		const post = {
			id: 111,
			content: [
				[
					{
						type: 'post-link',
						content: 'Comment',
						meta: {
							commentId: 123
						}
					},
					'.'
				]
			]
		}
		setPostLinkQuotes(
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
						content: 'Comment',
						meta: {
							commentId: 123
						}
					},
					'.'
				]
			]
		)
	})

	it('should set `content` to generated quote text (if there\'s one)', () => {
		const quotedPost = {
			id: 100,
			content: [
				[
					{
						type: 'text',
						style: 'bold',
						content: 'Some'
					},
					' ',
					{
						type: 'quote',
						content: 'text'
					}
				]
			]
		}
		const post = {
			id: 111,
			content: [
				[
					{
						type: 'post-link',
						content: 'Comment',
						meta: {
							commentId: 100
						}
					},
					'.'
				]
			]
		}
		setPostLinkQuotes(
			post.content,
			{
				getCommentById: id => id === quotedPost.id ? quotedPost : undefined,
				messages
			}
		)
		expectToEqual(
			post.content,
			[
				[
					{
						type: 'post-link',
						meta: {
							commentId: 100
						},
						content: [{
							type: 'quote',
							contentGenerated: true,
							content: 'Some «text»'
						}]
					},
					'.'
				]
			]
		)
	})

	it('shouldn\'t set `content` to generated quote text (if there\'s no such text)', () => {
		const quotedPost = {
			id: 100,
			content: ''
		}
		const post = {
			id: 111,
			content: [
				[
					{
						type: 'post-link',
						content: 'Comment',
						meta: {
							commentId: 100
						}
					},
					'.'
				]
			]
		}
		setPostLinkQuotes(
			post.content,
			{
				getCommentById: id => id === quotedPost.id ? quotedPost : undefined,
				messages
			}
		)
		expectToEqual(
			post.content,
			[
				[
					{
						type: 'post-link',
						content: 'Comment',
						meta: {
							commentId: 100
						}
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
						meta: {
							commentId: 123
						}
					},
					'\n',
					{
						type: 'post-link',
						content: 'Comment',
						meta: {
							commentId: 124
						}
					},
					'\n',
					'Text'
				]
			]
		}
		setPostLinkQuotes(
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
							block: true,
							contentGenerated: true,
							content: 'A'
						}],
						meta: {
							commentId: 123
						}
					},
					'\n',
					{
						type: 'post-link',
						content: [{
							type: 'quote',
							block: true,
							contentGenerated: true,
							content: 'B'
						}],
						meta: {
							commentId: 124
						}
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