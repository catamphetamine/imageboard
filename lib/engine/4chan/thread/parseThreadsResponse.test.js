import expectToEqual from '../../../utility/expectToEqual.js'

import Imageboard from '../../../Imageboard.js'

import API_RESPONSE from './parseThreadsResponse.test.input.1.js'
import THREADS from './parseThreadsResponse.test.output.1.js'

describe('4chan.org', () => {
	it('should parse threads', () => {
		expectToEqual(
			Imageboard('4chan', {
				messages: {
					comment: {
						deleted: 'Deleted comment',
						external: 'Comment from another thread',
						default: 'Comment'
					}
				}
			}).parseThreads(API_RESPONSE, { boardId: 'a' }).threads,
			THREADS
		)
	})
})