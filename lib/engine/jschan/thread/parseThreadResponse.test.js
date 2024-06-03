import expectToEqual from '../../../utility/expectToEqual.js'

import NinetyFourChan from '../../../chans/94chan/index.js'

import THREAD_INPUT from './parseThreadResponse.test.input.js'
import THREAD_OUTPUT from './parseThreadResponse.test.output.js'

describe('parseThreadResponse', () => {
	it('should parse thread response', () => {
		NinetyFourChan({
			messages: {
				comment: {
					deleted: 'Deleted comment',
					external: 'Comment from another thread',
					default: 'Comment'
				}
			}
		}).parseThread(THREAD_INPUT, { boardId: 'pol', status: 200 }).thread.should.deep.equal(THREAD_OUTPUT)
	})
})