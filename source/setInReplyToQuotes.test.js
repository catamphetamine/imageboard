import expectToEqual from './utility/expectToEqual'

import setInReplyToQuotes from './setInReplyToQuotes'

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
						commentId: 123,
						threadId: 456,
						boardId: 'a',
						postIsExternal: true
					}
				]
			]
		}
		setInReplyToQuotes(
			post.content,
			id => id === 1 ? post : undefined,
			{ messages }
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
						commentId: 123,
						threadId: 456,
						boardId: 'a',
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
						commentId: 123,
						threadId: 456,
						boardId: 'a',
						postIsExternal: true
					}
				]
			]
		}
		setInReplyToQuotes(
			post.content,
			id => id === 1 ? post : undefined,
			{ messages }
		)
		expectToEqual(
			post.content,
			[
				[
					'Link: ',
					{
						type: 'post-link',
						content: 'Comment',
						commentId: 123,
						threadId: 456,
						boardId: 'a',
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
						commentId: 123,
						threadId: 456,
						boardId: 'a',
						postIsExternal: true
					},
					'.'
				]
			]
		}
		setInReplyToQuotes(
			post.content,
			id => id === 1 ? post : undefined,
			{ messages }
		)
		expectToEqual(
			post.content,
			[
				[
					{
						type: 'post-link',
						content: 'Comment',
						commentId: 123,
						threadId: 456,
						boardId: 'a',
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
						commentId: 123,
						threadId: 456,
						boardId: 'a',
						postIsExternal: true
					},
					'.'
				]
			]
		}
		setInReplyToQuotes(
			post.content,
			id => id === 1 ? post : undefined,
			{ messages }
		)
		expectToEqual(
			post.content,
			[
				[
					{
						type: 'post-link',
						content: '(comment)',
						commentId: 123,
						threadId: 456,
						boardId: 'a',
						postIsExternal: true
					},
					'.'
				]
			]
		)
	})
})