import expectToEqual from '../../../utility/expectToEqual'

import KohlChan from '../../../chan/kohlchan'

import API_RESPONSE_1 from './parseThreadResponse.test.input.1'
import RESULT_1 from './parseThreadResponse.test.output.1'

describe('kohlchan.net', () => {
	it('should parse thread', () => {
		expectToEqual(
			new KohlChan({
				messages: {
					comment: {
						deleted: 'Deleted comment',
						hidden: 'Hidden comment',
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