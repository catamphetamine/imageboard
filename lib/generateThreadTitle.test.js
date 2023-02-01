import generateThreadTitle from './generateThreadTitle.js'

import expectToEqual from './utility/expectToEqual.js'

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
			undefined
		)
		expectToEqual(
			thread.autogeneratedTitle,
			'Picture'
		)
	})
})