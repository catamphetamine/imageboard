import parseThreadsResponse from './parseThreadsResponse.js'

import Chan from '../../../Chan.js'

describe('parseThreadsResponse', () => {
	it('should parse threads response', () => {
		const twoCh = new Chan('2ch', {
			messages: {
				comment: {
					deleted: 'Deleted comment',
					external: 'Comment from another thread',
					default: 'Comment'
				}
			}
		})

		twoCh.parseThreads(INPUT, { boardId: 'a' }).should.deep.equal([{
			"attachmentsCount": 364,
			"board": {
			  "attachmentsMaxTotalSize": 40960,
			  "bumpLimit": 500,
			  "commentContentMaxLength": 15000,
			  "defaultAuthorName": "Аноним",
			  "features": {
			    "attachments": true,
			    "badges": false,
			    "commentTitle": true,
			    "countryFlags": false,
			    "threadTags": false,
			    "threadTitle": true,
			    "votes": false
			  },
			  "title": "Аниме"
			},
			"boardId": "a",
			"bumpLimitReached": false,
			"commentAttachmentsCount": 363,
			"comments": [
			  {
			    "attachments": [
			      {
			        "picture": {
			          "height": 2181,
			          "size": 545792,
			          "sizes": [
			            {
			              "height": 250,
			              "type": "image/jpeg",
			              "url": "/a/thumb/7633107/16920017665590s.jpg",
			              "width": 171
			            }
			          ],
			          "type": "image/jpeg",
			          "url": "/a/src/7633107/16920017665590.jpg",
			          "width": 1500
			        },
			        "type": "picture"
			      }
			    ],
			    "content": [
			      [
			        "Предыдущий тред ",
			        {
			          "boardId": "a",
			          "content": "Comment from another thread",
			          "postId": 7590882,
			          "postIsExternal": true,
			          "postIsRoot": true,
			          "threadId": 7590882,
			          "type": "post-link",
			          "url": "/a/7590882"
			        }
			      ],
			      [
			        "Небольшой гайд по посоветуй-треду"
			      ]
			    ],
			    "createdAt": new Date('2023-08-14T08:29:26.000Z'),
			    "id": 7633107,
			    "title": "Посоветуй аниме тред"
			  }
			],
			"commentsCount": 1788,
			"createdAt": new Date('2023-08-14T08:29:26.000Z'),
			"id": 7633107,
			"pinned": true,
			"pinnedOrder": 901,
			"title": "Посоветуй аниме тред",
			"updatedAt": new Date('2023-09-06T16:36:34.000Z')
		}])
	})
})

const INPUT = {
	"advert_bottom_image": "/banners/4gQaWQjM41r6dfy5.png",
	"advert_bottom_link": "/banners/4gQaWQjM41r6dfy5/",
	"advert_mobile_image": "/banners/RAswFRQKQQGKYy5c.png",
	"advert_mobile_link": "/banners/RAswFRQKQQGKYy5c/",
	"advert_top_image": "/banners/4gQaWQjM41r6dfy5.png",
	"advert_top_link": "/banners/4gQaWQjM41r6dfy5/",
	"board": {
		"bump_limit": 500,
		"category": "Японская культура",
		"default_name": "Аноним",
		"enable_dices": false,
		"enable_flags": false,
		"enable_icons": false,
		"enable_likes": false,
		"enable_names": true,
		"enable_oekaki": false,
		"enable_posting": true,
		"enable_sage": true,
		"enable_shield": false,
		"enable_subject": true,
		"enable_thread_tags": false,
		"enable_trips": true,
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
		"id": "a",
		"info": "Конференция доски в Телеграме - \u003ca href=\"https://telegram.me/anime2ch\"\u003e@anime2ch\u003c/a\u003e",
		"info_outer": "аниме, 2d, вайфу",
		"max_comment": 15000,
		"max_files_size": 40960,
		"max_pages": 25,
		"name": "Аниме",
		"threads_per_page": 15
	},
	"board_banner_image": "/ololo/mus_1.gif",
	"board_banner_link": "mus",
	"filter": "standart",
	"threads": [
		{
			"banned": 0,
			"board": "a",
			"closed": 0,
			"comment": "Предыдущий тред \u003ca href=\"/a/res/7590882.html#7590882\" class=\"post-reply-link\" data-thread=\"7590882\" data-num=\"7590882\"\u003e\u003e\u003e7590882 (OP)\u003c/a\u003e\u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eНебольшой гайд по посоветуй-треду",
			"date": "14/08/23 Пнд 11:29:26",
			"email": "",
			"endless": 0,
			"files": [
				{
					"displayname": ".jpg",
					"fullname": ".jpg",
					"height": 2181,
					"md5": "0c97c4c1635b10224017bc1a6ea07586",
					"name": "16920017665590.jpg",
					"path": "/a/src/7633107/16920017665590.jpg",
					"size": 533,
					"thumbnail": "/a/thumb/7633107/16920017665590s.jpg",
					"tn_height": 250,
					"tn_width": 171,
					"type": 1,
					"width": 1500
				}
			],
			"files_count": 364,
			"lasthit": 1694018194,
			"name": "Аноним",
			"num": 7633107,
			"op": 0,
			"parent": 0,
			"posts_count": 1788,
			"sticky": 99,
			"subject": "Посоветуй аниме тред",
			"tags": "",
			"timestamp": 1692001766,
			"trip": "",
			"views": 13136
		}
	]
}