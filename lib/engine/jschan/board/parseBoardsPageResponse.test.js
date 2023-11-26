import parseBoardsPageResponse from './parseBoardsPageResponse.js'

describe('parseBoardsPageResponse', () => {
	it('should parse boards page response', () => {
		parseBoardsPageResponse(BOARDS_PAGE_RESPONSE, { status: 200 }).should.deep.equal({
			pageCount: 1,
			boards: [{
				id: 'pol',
				title: 'politics',
				uniquePostersPerDay: 2,
				commentsPerDay: 2,
				commentsPerHour: 0,
				description: 'Take the red pill, anon',
				features: {
					threadTags: true
				},
				notSafeForWork: true,
				threadTags: [
					'politics',
					'world news',
					'news',
					'international'
				]
			}]
		})
	})
})

const BOARDS_PAGE_RESPONSE = {
	"boards": [
		{
			"_id": "pol",
			"tags": [
				"politics",
				"world news",
				"news",
				"international"
			],
			"sequence_value": 6523,
			"pph": 0,
			"ppd": 2,
			"ips": 2,
			"lastPostTimestamp": {
				"text": "21 hours ago",
				"color": "#ccd900"
			},
			"webring": false,
			"settings": {
				"name": "politics",
				"description": "Take the red pill, anon",
				"sfw": false,
				"unlistedLocal": false
			}
		}
	],
	"page": 1,
	"maxPage": 1
}