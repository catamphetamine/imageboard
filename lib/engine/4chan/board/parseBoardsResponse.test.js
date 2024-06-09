import parseBoardsResponse from './parseBoardsResponse.js'

describe('parseBoardsResponse', () => {
	it('should parse boards response', () => {
		parseBoardsResponse({
			"boards": [
				{
					"board": "a",
					"title": "Anime \u0026 Manga",
					"ws_board": 1,
					"per_page": 15,
					"pages": 10,
					"max_filesize": 4194304,
					"max_webm_filesize": 4194304,
					"max_comment_chars": 2000,
					"max_webm_duration": 120,
					"bump_limit": 500,
					"image_limit": 300,
					"cooldowns": {
						"threads": 600,
						"replies": 60,
						"images": 60
					},
					"meta_description": "\u0026quot;\/a\/ - Anime \u0026amp; Manga\u0026quot; is 4chan's imageboard dedicated to the discussion of Japanese animation and manga.",
					"spoilers": 1,
					"custom_spoilers": 1,
					"is_archived": 1
				}
			]
		}, {
			chan: '4chan',
			"boardCategories": {
				"Japanese Culture": ["a", "c", "w", "m", "cgl", "cm", "f", "n", "jp"],
				"Video Games": ["v", "vg", "vp", "vr"],
				"Interests": ["co", "g", "tv", "k", "o", "an", "tg", "sp", "asp", "sci", "his", "int", "out", "toy"],
				"Creative": ["i", "po", "p", "ck", "ic", "wg", "lit", "mu", "fa", "3", "gd", "diy", "wsg", "qst"],
				"Miscellaneous": ["b", "r9k", "pol", "bant", "soc", "s4s"],
				"Adult": ["s", "hc", "hm", "h", "e", "u", "d", "y", "t", "hr", "gif", "aco", "r"],
				"Other": ["*"]
			}
		}).should.deep.equal([{
			id: 'a',
			title: 'Anime \u0026 Manga',
			"description": "\"/a/ - Anime & Manga\" is 4chan's imageboard dedicated to the discussion of Japanese animation and manga.",
			"category": "Japanese Culture",
			explicitContent: false,
			post: {
				commentContent: {
					tex: false,
					code: false
				},
				authorCountry: false,
				authorEmailSage: true,
				authorIcons: undefined,
				authorId: false,
				authorName: true,
				attachments: true,
				attachmentsMaxCount: 1,
				"attachmentMaxSize": 4194304,
				"contentMaxLength": 2000,
				"commentMinInterval": 60,
				"commentWithAttachmentsMinInterval": 60,
				"threadMinInterval": 600,
			  "attachmentSpoiler": true,
				"threadTitleRequired": false,
				"threadAttachmentsMaxCount": 300,
				"videoAttachmentMaxDuration": 120,
				"videoAttachmentMaxSize": 4194304
			},
			features: {
				"bumpLimit": 500,
			  "archive": {}
			}
		}])
	})
})