import expectToEqual from '../../../utility/expectToEqual.js'

import Imageboard from '../../../Imageboard.js'

import API_RESPONSE from './parseThreadsResponse.test.input.1.js'
import THREADS from './parseThreadsResponse.test.output.1.js'

describe('kohlchan.net', () => {
	it('should parse threads', () => {
		const threads = Imageboard('kohlchan', {
			messages: {
				comment: {
					deleted: 'Deleted comment',
					external: 'Comment from another thread',
					default: 'Comment'
				}
			}
		}).parseThreads(API_RESPONSE, {
			boardId: 'a'
		}).threads

		// Remove the `isLynxChanCatalogAttachmentsBug` flag.
		for (const thread of threads) {
			delete thread.comments[0].attachments[0].isLynxChanCatalogAttachmentsBug
		}

		expectToEqual(
			threads,
			THREADS
		)
	})
})