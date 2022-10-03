import getCommentText from './getCommentText.js'

import expectToEqual from './utility/expectToEqual.js'

describe('getCommentText', () => {
	it('should get comment text', () => {
		expectToEqual(
			getCommentText({
				content: [
					[
						'Someone said: ',
						{
							type: 'quote',
							content: 'Text'
						}
					]
				]
			}),
			'Someone said: «Text»'
		)
	})
})