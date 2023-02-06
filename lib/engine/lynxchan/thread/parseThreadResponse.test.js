import expectToEqual from '../../../utility/expectToEqual.js'

import KohlChan from '../../../chan/kohlchan/index.js'

import API_RESPONSE_1 from './parseThreadResponse.test.input.1.js'
import RESULT_1 from './parseThreadResponse.test.output.1.js'

describe('kohlchan.net', () => {
	it('should parse thread', () => {
		expectToEqual(
			KohlChan({
				messages: {
					comment: {
						deleted: 'Deleted comment',
						external: 'Comment from another thread',
						default: 'Comment'
					}
				}
			}).parseThread(API_RESPONSE_1, {
				boardId: 'a'
			}),
			RESULT_1
		)
	})
})