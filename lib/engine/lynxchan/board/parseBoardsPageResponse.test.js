import parseBoardsPageResponse from './parseBoardsPageResponse.js'

describe('parseBoardsPageResponse', () => {
	it('should parse boards page response', () => {
		parseBoardsPageResponse({
			"status": "ok",
			"data": {
				"pageCount": 1,
				"boards": [
					{
						"boardUri": "int",
						"boardName": "International",
						"boardDescription": ".",
						"lastPostId": 21668836,
						"postsPerHour": 489,
						"tags": [],
						"inactive": false
					},
					{
						"boardUri": "g",
						"boardName": "Geschichte",
						"boardDescription": ".",
						"tags": [],
						"lastPostId": 197,
						"postsPerHour": 0,
						"specialSettings": [
							"sfw"
						]
					},
					{
						"boardUri": "fefe",
						"boardName": "Fefe (dietchan)",
						"boardDescription": "nur ein Platzhalter",
						"tags": [
							"menu-2/n/allgemein-12"
						],
						"postsPerHour": 0,
						"specialSettings": [
							"locked"
						]
					}
				],
				"overboard": "alle",
				"sfwOverboard": "nvip"
			}
		}, {
			chan: 'kohlchan',
			boardCategoryTitleById: {
				"vip": "VIP",
				"allgemein": "Allgemein",
				"weltweit": "Weltweit",
				"sonstiges": "Sonstiges",
				"*": "Andere"
			}
		}).should.deep.equal({
			pageCount: 1,
			boards: [
				{
					"id": "fefe",
					"title": "Fefe (dietchan)",
					"category": "Allgemein",
					"commentsPerHour": 0,
					"description": "nur ein Platzhalter",
					"features": {
						"threadTags": true
					},
					"locked": true,
					"notSafeForWork": true,
					"threadTags": [
						"menu-2/n/allgemein-12"
					]
				},
				{
					id: 'int',
					title: 'International',
					"category": "Andere",
					"commentsPerHour": 489,
					"description": ".",
					"features": {
						"threadTags": false
					},
					"locked": false,
					"notSafeForWork": true,
					"threadTags": []
				},
				{
					id: 'g',
					title: 'Geschichte',
					"category": "Andere",
					"commentsPerHour": 0,
					"description": ".",
					"features": {
						"threadTags": false
					},
					"locked": false,
					"notSafeForWork": false,
					"threadTags": []
				}
			]
		})
	})
})