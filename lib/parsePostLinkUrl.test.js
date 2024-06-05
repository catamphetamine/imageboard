import parsePostLinkUrl from './parsePostLinkUrl.js'

import expectToEqual from './utility/expectToEqual.js'

import FourChannel from './chans/4chan/index.js'
import EightChannel from './chans/8ch/index.js'
import TwoChannel from './chans/2ch/index.js'

describe('parsePostLinkUrl', () => {
	it('should parse anchor post links', () => {
		expectToEqual(
			parsePostLinkUrl('#p12345', {}),
			{
				commentId: 12345
			}
		)
	})

	it('should parse relative post links (4chan.org)', () => {
		const fourChannel = FourChannel()
		expectToEqual(
			parsePostLinkUrl('/a/thread/184064641#p184154285', { commentUrlParser: fourChannel.options.commentUrlParser }),
			{
				boardId: 'a',
				threadId: 184064641,
				commentId: 184154285
			}
		)
	})

	it('should parse relative post links (8ch.net)', () => {
		const eightChannel = EightChannel()
		expectToEqual(
			parsePostLinkUrl('/newsplus/res/238546.html#238584', { commentUrlParser: eightChannel.options.commentUrlParser }),
			{
				boardId: 'newsplus',
				threadId: 238546,
				commentId: 238584
			}
		)
	})

	it('should parse relative post links (2ch.hk)', () => {
		const twoChannel = TwoChannel()
		expectToEqual(
			parsePostLinkUrl('/b/res/197765456.html#197791215', { commentUrlParser: twoChannel.options.commentUrlParser }),
			{
				boardId: 'b',
				threadId: 197765456,
				commentId: 197791215
			}
		)
	})
})

