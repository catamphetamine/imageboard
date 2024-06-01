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
			chan: '4chan'
		}).should.deep.equal([{
			id: 'a',
			title: 'Anime \u0026 Manga',
			"attachmentMaxSize": 4194304,
			"bumpLimit": 500,
			"category": "Japanese Culture",
			"commentContentMaxLength": 2000,
			"createCommentCooldown": 60,
			"createCommentWithAttachmentsCooldown": 60,
			"createThreadMinInterval": 600,
			"description": "\"/a/ - Anime & Manga\" is 4chan's imageboard dedicated to the discussion of Japanese animation and manga.",
			"features": {
			  "archive": true,
			  "spoilers": true
			},
			"spoilersCount": 1,
			"threadAttachmentsMaxCount": 300,
			"videoAttachmentMaxDuration": 120,
			"videoAttachmentMaxSize": 4194304
		}])
	})

	it('should parse boards response (8ch)', () => {
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
			chan: '8ch'
		}).should.deep.equal([{
			id: 'qresearch',
			title: ' Q Research',
			"commentsPerHour": 244,
			"description": "Research and discussion about Q's crumbs",
			"features": {
			  "threadTags": true
			},
			"language": "English",
			"threadTags": [
			  "private"
			]
		}])
	})
})