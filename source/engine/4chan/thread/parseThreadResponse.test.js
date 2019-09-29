import expectToEqual from '../../../utility/expectToEqual'

import FourChan from '../../../chan/4chan'

import API_RESPONSE_1 from './parseThreadResponse.test.input.1'
import RESULT_1 from './parseThreadResponse.test.output.1'

describe('4chan.org', () => {
	it('should parse thread', () => {
		expectToEqual(
			new FourChan({
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