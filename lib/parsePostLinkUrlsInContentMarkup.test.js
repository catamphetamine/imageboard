import parsePostLinkUrlsInContentMarkup from './parsePostLinkUrlsInContentMarkup.js'

import expectToEqual from './utility/expectToEqual.js'

import FourChannel from './chans/4chan/index.js'
import EightChannel from './chans/8ch/index.js'
import TwoChannel from './chans/2ch/index.js'

describe('parsePostLinkUrlsInContentMarkup', () => {
	it('should parse anchor post links', () => {
		expectToEqual(
			parsePostLinkUrlsInContentMarkup(
				`
					<a key="value" href="#p184154285">&gt;&gt;184154285</a>
					text
					<a key="value" href="#p123456">&gt;&gt;123456</a>
				`,
				{}
			),
			[
				{
					commentId: 184154285,
				},
				{
					commentId: 123456
				}
			]
		)
	})

	it('should parse relative post links (4chan.org)', () => {
		const fourChannel = FourChannel()
		expectToEqual(
			parsePostLinkUrlsInContentMarkup(
				`
					<a key="value" href="/a/thread/184064641#p184154285">&gt;&gt;184154285</a>
					text
					<a key="value" href="/a/thread/184064641#p123456">&gt;&gt;123456</a>
				`,
				{ commentUrlParser: fourChannel.options.commentUrlParser }
			),
			[
				{
					boardId: 'a',
					threadId: 184064641,
					commentId: 184154285
				},
				{
					boardId: 'a',
					threadId: 184064641,
					commentId: 123456
				}
			]
		)
	})

	it('should parse relative post links (8ch.net)', () => {
		const eightChannel = EightChannel()
		expectToEqual(
			parsePostLinkUrlsInContentMarkup(
				`
					<a key="value" href="/newsplus/res/238546.html#238584">&gt;&gt;238584</a>
					text
					<a key="value" href="/newsplus/res/238546.html#123456">&gt;&gt;123456</a>
				`,
				{ commentUrlParser: eightChannel.options.commentUrlParser }
			),
			[
				{
					boardId: 'newsplus',
					threadId: 238546,
					commentId: 238584
				},
				{
					boardId: 'newsplus',
					threadId: 238546,
					commentId: 123456
				}
			]
		)
	})

	it('should parse relative post links (2ch.hk)', () => {
		const twoChannel = TwoChannel()
		expectToEqual(
			parsePostLinkUrlsInContentMarkup(
				`
					<a href="/b/res/197765456.html#197791215" class="post-reply-link" data-thread="197765456" data-num="197791215">&gt;&gt;197791215</a>
					text
					<a href="/b/res/197765456.html#123456" class="post-reply-link" data-thread="197765456" data-num="123456">&gt;&gt;123456</a>
				`,
				{ commentUrlParser: twoChannel.options.commentUrlParser }
			),
			[
				{
					boardId: 'b',
					threadId: 197765456,
					commentId: 197791215
				},
				{
					boardId: 'b',
					threadId: 197765456,
					commentId: 123456
				}
			]
		)
	})
})

