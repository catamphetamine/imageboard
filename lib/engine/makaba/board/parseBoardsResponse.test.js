import parseBoardsResponse from './parseBoardsResponse.js'

describe('parseBoardsResponse', () => {
	it('should parse boards response', () => {
		parseBoardsResponse([
			{
				"bump_limit": 500,
				"category": "Разное",
				"default_name": "Аноним",
				"enable_dices": false,
				"enable_flags": false,
				"enable_icons": false,
				"enable_likes": false,
				"enable_names": false,
				"enable_oekaki": true,
				"enable_posting": true,
				"enable_sage": true,
				"enable_shield": false,
				"enable_subject": true,
				"enable_thread_tags": false,
				"enable_trips": false,
				"file_types": [
					"jpg",
					"png",
					"gif",
					"webm",
					"sticker",
					"mp4",
					"youtube",
					"webp",
					"webp",
					"webp",
					"webp",
					"webp"
				],
				"id": "b",
				"info": "",
				"info_outer": "бред",
				"max_comment": 15000,
				"max_files_size": 20480,
				"max_pages": 10,
				"name": "Бред",
				"threads_per_page": 21
			}
		], {
			"explicitContentBoardCategories": [
				"Взрослым"
			],
			"explicitContentBoards": [
				"b",
				"nf"
			]
		}).should.deep.equal([{
			id: 'b',
			title: 'Бред',
			category: "Разное",
			description: "бред",
			explicitContent: true,
			features: {
				bumpLimit: 500,
				commentRating: undefined,
				defaultAuthorName: 'Аноним'
			},
      "post": {
        "attachmentFileTypes": [
          "image/jpg",
          "image/png",
          "image/gif",
          "video/webm",
          "video/mp4",
          "image/webp"
        ],
        "attachmentsMaxCount": 4,
        "attachmentsMaxSize": 20480,
        "authorCountry": false,
        "authorEmailSage": true,
        "authorIcon": false,
        "authorName": false,
        "authorTripCode": false,
        "captchaRequired": true,
        "contentMaxLength": 15000,
        "thread": true,
        "threadAttachmentsRequired": true,
        "threadCaptchaRequired": true,
        "threadTags": false,
        "threadTitle": false
      }
		}])
	})
})