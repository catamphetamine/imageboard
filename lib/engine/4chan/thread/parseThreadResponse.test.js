import expectToEqual from '../../../utility/expectToEqual.js'

import FourChan from '../../../chan/4chan/index.js'

import API_RESPONSE_1 from './parseThreadResponse.test.input.1.js'
import RESULT_1 from './parseThreadResponse.test.output.1.js'

describe('4chan.org', () => {
	it('should parse thread', () => {
		expectToEqual(
			FourChan({
				messages: {
					comment: {
						deleted: 'Deleted comment',
						hidden: 'Hidden comment',
						external: 'Comment from another thread',
						default: 'Comment'
					}
				},
				boardId: 'v',
				threadId: 456354102
			}).parseThread(API_RESPONSE_1),
			RESULT_1
		)
	})
})