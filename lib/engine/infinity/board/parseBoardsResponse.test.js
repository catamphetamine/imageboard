import parseBoardsResponse from '../../4chan/board/parseBoardsResponse.js'

describe('engine/infinity/parseBoardsResponse', () => {
	it('should parse boards response', () => {
		parseBoardsResponse([
			{
				"uri": "qresearch",
				"title": " Q Research",
				"subtitle": "Research and discussion about Q's crumbs",
				"indexed": 1,
				"sfw": 0,
				"posts_total": 19862753,
				"time": "2018-01-09",
				"weight": 0,
				"locale": "English",
				"tags": [
					"private"
				],
				"max": 19862753,
				"active": 1724,
				"pph": 418,
				"ppd": 5583,
				"pph_average": 244
			}
		], {
			engine: 'OpenIB'
		}).should.deep.equal([{
			id: 'qresearch',
			title: ' Q Research',
			description: 'Research and discussion about Q\'s crumbs',
			explicitContent: false,
			language: 'en',
			stats: {
				commentsPerHour: 244
			},
			features: {
			  threadTags: [
			  	'private'
			  ]
			},
			post: {
				threadTags: true
			}
		}])
	})
})