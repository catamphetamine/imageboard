import parsePostLink from './parsePostLink'

import expectToEqual from './utility/expectToEqual'

import FourChannel from './chan/4chan'
import EightChannel from './chan/8ch'
import TwoChannel from './chan/2ch'

describe('parsePostLink', () => {
	it('should parse anchor post links', () => {
		expectToEqual(
			parsePostLink('#p12345', {}),
			{
				postId: 12345
			}
		)
	})

	it('should parse relative post links (4chan.org)', () => {
		const fourChannel = FourChannel()
		expectToEqual(
			parsePostLink('/a/thread/184064641#p184154285', { commentUrlParser: fourChannel.options.commentUrlParser }),
			{
				boardId: 'a',
				threadId: 184064641,
				postId: 184154285
			}
		)
	})

	it('should parse relative post links (8ch.net)', () => {
		const eightChannel = EightChannel()
		expectToEqual(
			parsePostLink('/newsplus/res/238546.html#238584', { commentUrlParser: eightChannel.options.commentUrlParser }),
			{
				boardId: 'newsplus',
				threadId: 238546,
				postId: 238584
			}
		)
	})

	it('should parse relative post links (2ch.hk)', () => {
		const twoChannel = TwoChannel()
		expectToEqual(
			parsePostLink('/b/res/197765456.html#197791215', { commentUrlParser: twoChannel.options.commentUrlParser }),
			{
				boardId: 'b',
				threadId: 197765456,
				postId: 197791215
			}
		)
	})
})

