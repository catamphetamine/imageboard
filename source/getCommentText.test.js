import getCommentText from './getCommentText'

import expectToEqual from './utility/expectToEqual'

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