import parseThreadsResponse from './parseThreadsResponse.js'

import NinetyFourChan from '../../../chans/94chan/index.js'

import THREADS_INPUT from './parseThreadsResponse.test.input.js'
import THREADS_OUTPUT from './parseThreadsResponse.test.output.js'

describe('parseThreadsResponse', () => {
	it('should parse threads response', () => {
		NinetyFourChan({
			messages: {
				comment: {
					deleted: 'Deleted comment',
					external: 'Comment from another thread',
					default: 'Comment'
				}
			}
		}).parseThreads(THREADS_INPUT, { boardId: 'x', status: 200 }).threads.should.deep.equal(THREADS_OUTPUT)
	})
})