import expectToEqual from '../../../utility/expectToEqual'

import Chan from '../../../Chan'
import KohlChanConfig from '../../../chan/kohlchan/index.json'

import API_RESPONSE from './parseThreadsResponse.test.input.1'
import THREADS from './parseThreadsResponse.test.output.1'

describe('kohlchan.net', () => {
	it('should parse threads', () => {
		const threads = new Chan(KohlChanConfig, {
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
		})

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