import parseThreadsPageResponse from './parseThreadsPageResponse.js'

import KohlChan from '../../../chan/kohlchan/index.js'

describe('parseThreadsPageResponse', () => {
	it('should parse threads page response', () => {
		parseThreadsPageResponse(INPUT, { boardId: 'a' }).pageCount.should.equal(20)

		const kohlChan = KohlChan({
			messages: {
				comment: {
					deleted: 'Deleted comment',
					external: 'Comment from another thread',
					default: 'Comment'
				}
			}
		})

		kohlChan.parseThreadsPage(INPUT, { boardId: 'a' }).should.deep.equal([
			{
				id: 297,
				"attachmentsCount": 198,
				"board": {
				  "attachmentMaxSize": 104857600,
				  "attachmentsMaxCount": 4,
				  "commentContentMaxLength": 16384,
				  "features": {},
				  "title": "Animu"
				},
				"boardId": 'a',
				"commentAttachmentsCount": 197,
				"commentsCount": 240,
				"createdAt": new Date('2018-07-06T05:32:00.000Z'),
				"title": "Gemeinsames Animuschauen",
				comments: [
					{
						id: 297,
						"title": "Gemeinsames Animuschauen",
						"attachments": [
						  {
						    "picture": {
						      "height": 1080,
						      "size": 407997,
						      "sizes": [
						        {
						          "height": 130,
						          "type": "image/jpeg",
						          "url": "/.media/t_93e56de4d673f480e8f6bd8811e5050c9ef078f74a747faa79b4d1c06fc641d1",
						          "width": 200
						        }
						      ],
						      "type": "image/png",
						      "url": "/.media/93e56de4d673f480e8f6bd8811e5050c9ef078f74a747faa79b4d1c06fc641d1",
						      "width": 1663
						    },
						    "type": "picture"
						  }
						],
						"content": [
						  [
						    "Wir sind das WHQ!",
						    "\n",
						    "Die halbe N/a/tion",
						    "\n",
						    "kennt uns schon"
						  ]
						],
						"createdAt": new Date('2018-07-06T05:32:00.000Z')
					},
					{
						id: 5923,
						"createdAt": new Date('2022-07-02T18:32:12.396Z'),
						"content": [
						  [
						    "Die zweite Staffel \"Made in Abyss\" feiert ihre deutsche Free-TV-Premiere am 8. Juli 2022 auf ProSieben MAXX um 23:15 Uhr in der Anime Night. Jeden Freitag zeigen wir eine Folge im japanischen Original mit deutschen Untertiteln. Nach der Ausstrahlung könnt ihr die Episoden der Serie kostenlos online streamen."
						  ]
						]
					}
				]
			}
		])
	})
})

const INPUT = {
	"pageCount": 20,
	"boardName": "Animu",
	"boardDescription": ".",
	"settings": [
		"disableIds",
		"forceAnonymity",
		"requireThreadFile"
	],
	"threads": [
		{
			"name": "Bernd",
			"email": null,
			"boardUri": "a",
			"threadId": 297,
			"subject": "Gemeinsames Animuschauen",
			"markdown": "Wir sind das WHQ!<br/>Die halbe N/a/tion<br/>kennt uns schon",
			"message": "Wir sind das WHQ!\r\nDie halbe N/a/tion\r\nkennt uns schon",
			"creation": "2018-07-06T05:32:00.000Z",
			"locked": false,
			"archived": false,
			"pinned": false,
			"cyclic": false,
			"autoSage": false,
			"files": [
				{
					"originalName": "harroeri.png",
					"path": "/.media/93e56de4d673f480e8f6bd8811e5050c9ef078f74a747faa79b4d1c06fc641d1",
					"thumb": "/.media/t_93e56de4d673f480e8f6bd8811e5050c9ef078f74a747faa79b4d1c06fc641d1",
					"mime": "image/png",
					"size": 407997,
					"width": 1663,
					"height": 1080
				}
			],
			"posts": [
				{
					"name": "Bernd",
					"signedRole": null,
					"email": null,
					"id": null,
					"subject": null,
					"markdown": "Die zweite Staffel &quot;Made in Abyss&quot; feiert ihre deutsche Free-TV-Premiere am 8. Juli 2022 auf ProSieben MAXX um 23:15 Uhr in der Anime Night. Jeden Freitag zeigen wir eine Folge im japanischen Original mit deutschen Untertiteln. Nach der Ausstrahlung könnt ihr die Episoden der Serie kostenlos online streamen.",
					"postId": 5923,
					"creation": "2022-07-02T18:32:12.396Z",
					"files": []
				}
			],
			"omittedPosts": 238,
			"omittedFiles": 197
		}
	],
	"maxMessageLength": 16384,
	"captchaMode": 0,
	"reportCategories": [
		"Spam",
		"Illegal content",
		"Other"
	],
	"maxFileCount": 4,
	"maxFileSize": "100.00 MB"
}