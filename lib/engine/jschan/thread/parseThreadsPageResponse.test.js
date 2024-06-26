import parseThreadsPageResponse from './parseThreadsPageResponse.js'

import NinetyFourChan from '../../../chans/94chan/index.js'

import THREADS_INPUT from './parseThreadsPageResponse.test.input.js'
import THREADS_OUTPUT from './parseThreadsPageResponse.test.output.js'

describe('parseThreadsPageResponse', () => {
	it('should parse threads page response', () => {
		NinetyFourChan({
			messages: {
				comment: {
					deleted: 'Deleted comment',
					external: 'Comment from another thread',
					default: 'Comment'
				}
			}
		}).parseThreadsPage(THREADS_INPUT, {
			boardId: 'b',
			status: 200,
			withLatestComments: true
		}).threads.should.deep.equal(THREADS_OUTPUT)
	})
})