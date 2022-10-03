import expectToEqual from '../../../utility/expectToEqual.js'

import Chan from '../../../Chan.js'

import API_RESPONSE from './parseThreadsResponse.test.input.1.js'
import THREADS from './parseThreadsResponse.test.output.1.js'

describe('4chan.org', () => {
	it('should parse threads', () => {
		expectToEqual(
			new Chan('4chan', {
				messages: {
					comment: {
						deleted: 'Deleted comment',
						hidden: 'Hidden comment',
						external: 'Comment from another thread',
						default: 'Comment'
					}
				}
			}).parseThreads(API_RESPONSE, {
				boardId: 'a'
			}),
			THREADS
		)
	})
})