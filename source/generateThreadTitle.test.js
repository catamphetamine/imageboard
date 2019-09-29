import generateThreadTitle from './generateThreadTitle'

import expectToEqual from './utility/expectToEqual'

describe('generateThreadTitle', () => {
	it('should generate thread title if the only content is an attachment', () => {
		const thread = {
			comments: [{
				attachments: [{
					type: 'picture',
					picture: {}
				}]
			}]
		}
		generateThreadTitle(thread, {
			messages: {
				contentType: {
					picture: 'Picture'
				}
			}
		})
		expectToEqual(
			thread.title,
			'Picture'
		)
	})
})