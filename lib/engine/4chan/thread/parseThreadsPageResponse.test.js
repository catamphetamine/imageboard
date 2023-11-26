import parseThreadsPageResponse from './parseThreadsPageResponse.js'

import FourChan from '../../../chan/4chan/index.js'

describe('parseThreadsPageResponse', () => {
	it('should parse threads page response', () => {
		const fourChan = FourChan({
			messages: {
				comment: {
					deleted: 'Deleted comment',
					external: 'Comment from another thread',
					default: 'Comment'
				}
			}
		})

		fourChan.parseThreadsPage({
			"threads": [
				{
					"posts": [
						{
							"no": 259100232,
							"now": "11/03/23(Fri)12:32:13",
							"name": "Anonymous",
							"sub": "ITT Good endings",
							"com": "let us forget atack on titan&#039;s abyssmal, disgraceful and vile ending.",
							"filename": "0047-026",
							"ext": ".jpg",
							"w": 1800,
							"h": 1291,
							"tn_w": 250,
							"tn_h": 179,
							"tim": 1699029133827809,
							"time": 1699029133,
							"md5": "DpJvK3ftFDS8Qav0HF10MA==",
							"fsize": 133619,
							"resto": 0,
							"bumplimit": 0,
							"imagelimit": 0,
							"semantic_url": "itt-good-endings",
							"custom_spoiler": 1,
							"replies": 286,
							"images": 113,
							"omitted_posts": 281,
							"omitted_images": 112,
							"tail_size": 50
						},
						{
							"no": 259154039,
							"now": "11/04/23(Sat)20:18:54",
							"name": "Anonymous",
							"com": "<a href=\"#p259100232\" class=\"quotelink\">&gt;&gt;259100232</a><br><span class=\"quote\">&gt;CTRL+F Detroit Metal City</span><br><span class=\"quote\">&gt;0 results</span><br>That&#039;s alot of rape...",
							"filename": "45645634534534",
							"ext": ".png",
							"w": 869,
							"h": 1260,
							"tn_w": 86,
							"tn_h": 125,
							"tim": 1699143534910901,
							"time": 1699143534,
							"md5": "4fxnMi+U86jDUeH+rZNBUA==",
							"fsize": 1300107,
							"resto": 259100232
						}
					]
				}
			]
		}, {
			boardId: 'a'
		}).should.deep.equal([
			{
				id: 259100232,
				"attachmentsCount": 114,
				"boardId": "a",
				"commentAttachmentsCount": 113,
				"commentsCount": 287,
				"createdAt": new Date('2023-11-03T16:32:13.000Z'),
				"customSpoilersCount": 1,
				"title": "ITT Good endings",
				comments: [
					{
						id: 259100232,
						"replies": [
						  259154039
						],
						"title": "ITT Good endings",
						"createdAt": new Date('2023-11-03T16:32:13.000Z'),
						"attachments": [
						  {
						    "picture": {
						      "height": 1291,
						      "size": 133619,
						      "sizes": [
						        {
						          "height": 179,
						          "type": "image/jpeg",
						          "url": "https://i.4cdn.org/a/1699029133827809s.jpg",
						          "width": 250
						        }
						      ],
						      "type": "image/jpeg",
						      "url": "https://i.4cdn.org/a/1699029133827809.jpg",
						      "width": 1800
						    },
						    "type": "picture"
						  }
						],
						"content": [
						  [
						    "let us forget atack on titan's abyssmal, disgraceful and vile ending."
						  ]
						]
					},
					{
						id: 259154039,
						"inReplyTo": [
						  259100232
						],
						"attachments": [
						  {
						    "picture": {
						      "height": 1260,
						      "size": 1300107,
						      "sizes": [
						        {
						          "height": 125,
						          "type": "image/jpeg",
						          "url": "https://i.4cdn.org/a/1699143534910901s.jpg",
						          "width": 86
						        }
						      ],
						      "type": "image/png",
						      "url": "https://i.4cdn.org/a/1699143534910901.png",
						      "width": 869
						    },
						    "type": "picture"
						  }
						],
						"content": [
						  [
						    {
						      "boardId": "a",
						      "content": [
						        {
						          "block": true,
						          "content": "CTRL+F Detroit Metal City",
						          "type": "quote"
						        },
						        "\n",
						        {
						          "block": true,
						          "content": "0 results",
						          "type": "quote"
						        }
						      ],
						      "postId": 259100232,
						      "threadId": 259100232,
						      "type": "post-link",
						      "url": "/a/259100232"
						    },
						    "\n",
						    "That's alot of rape..."
						  ]
						],
						"createdAt": new Date('2023-11-05T00:18:54.000Z')
					}
				]
			}
		])
	})
})