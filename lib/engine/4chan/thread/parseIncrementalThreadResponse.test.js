import parseIncrementalThreadResponse from './parseIncrementalThreadResponse.js'

import FourChan from '../../../chan/4chan/index.js'

describe('parseIncrementalThreadResponse', () => {
	it('should parse incremental thread response', () => {
		const fourChan = FourChan({
			messages: {
				comment: {
					deleted: 'Deleted comment',
					external: 'Comment from another thread',
					default: 'Comment'
				}
			},

		})

		fourChan.createThreadObject(
			parseIncrementalThreadResponse(INPUT, {
				// `afterCommentId` is equal to `tail_id: 259154526`.
				afterCommentId: 259154526
			}).thread,
			{ boardId: 'a' }
		).should.deep.equal(OUTPUT)

		fourChan.createThreadObject(
			parseIncrementalThreadResponse(INPUT, {
			// `afterCommentId` is after to `tail_id: 259154526`.
				afterCommentId: 259154561
			}).thread,
			{ boardId: 'a' }
		).should.deep.equal(OUTPUT)

		expect(
			parseIncrementalThreadResponse(INPUT, {
				// `afterCommentId` is before `tail_id: 259154526`.
				afterCommentId: 259144982
			})
		).to.be.undefined
	})
})

const INPUT = {
	"posts": [
		{
			"no": 259144982,
			"bumplimit": 0,
			"imagelimit": 0,
			"replies": 132,
			"images": 37,
			"unique_ips": 52,
			"custom_spoiler": 1,
			"tail_size": 50,
			"tail_id": 259154526
		},
		{
			"no": 259154561,
			"now": "11/04/23(Sat)20:34:49",
			"name": "Anonymous",
			"com": "not to get political but I think slavery and genocide for fun is good",
			"time": 1699144489,
			"resto": 259144982
		}
	]
}

const OUTPUT = {
	id: 259144982,
	"afterCommentId": 259154526,
	"boardId": 'a',
	"commentsCount": 133,
	"commentAttachmentsCount": 37,
	"customSpoilersCount": 1,
	"uniquePostersCount": 52,
	"createdAt": new Date('1970-01-01T00:00:00.000Z'),
	comments: [
		{
			id: 259144982,
			"createdAt": new Date('1970-01-01T00:00:00.000Z'),
		},
		{
			id: 259154561,
			"content": [
			  [
			    "not to get political but I think slavery and genocide for fun is good"
			  ]
			],
			"createdAt": new Date('2023-11-05T00:34:49.000Z')
		}
	]
}