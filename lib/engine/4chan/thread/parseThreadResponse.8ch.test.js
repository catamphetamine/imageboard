import expectToEqual from '../../../utility/expectToEqual.js'

import EightChan from '../../../chan/8ch/index.js'

const API_RESPONSE = {
  "posts": [
    {
      "no": 2942,
      "sub": "META THREAD",
      "com": "<p class=\"body-line ltr \">Any meta issues posted on /pnd/ to be entered in this thread</p><p class=\"body-line empty \"><\/p><p class=\"body-line ltr \">Current Rules for /pnd/:</p><p class=\"body-line ltr \">1. Follow the Global Rule.</p><p class=\"body-line ltr \">2. No spamming. Doing so will result in a  ban.</p><p class=\"body-line ltr \">3. Duplicate threads will be deleted. Check the Catalog.</p><p class=\"body-line ltr \">4. Non-politics related threads are frowned upon and may result in ban and deletion. Bans will be up to the Board Owner or Board Volunteer's discretion.</p><p class=\"body-line ltr \">If you don't get what /pnd/ is about, lurk more. That includes newfags.</p>",
      "name": "Anonymous",
      "time": 1575738714,
      "omitted_posts": 0,
      "omitted_images": 0,
      "sticky": 1,
      "locked": 0,
      "cyclical": "1",
      "bumplocked": "0",
      "last_modified": 1578298674,
      "id": "97e711",
      "tn_h": 132,
      "tn_w": 255,
      "h": 829,
      "w": 1600,
      "fsize": 89429,
      "filename": "1424519901724",
      "ext": ".png",
      "tim": "a4112168213cecee29edb4fc964138c74698ae91ab8014ad40bb10117680d4c3",
      "fpath": 1,
      "spoiler": 0,
      "md5": "lFpON7vUdQt0Z3Q83DeNNg==",
      "resto": 0
    },
    {
      "no": 6537,
      "resto": 2942,
      "com": "<p class=\"body-line ltr \"><a onclick=\"highlightReply('6536', event);\" href=\"/pnd/res/2942.html#6536\">&gt;&gt;6536</a></p><p class=\"body-line ltr \">Hey &hellip; who knows. Maybe the white nationalist wants all kinds of crazy posts just to juice the numbers. Also</p><p class=\"body-line ltr quote\">&gt;paid shills</p><p class=\"body-line ltr \">Literally nobody in the history of anybody has ever been paid to post here.</p>",
      "name": "Anonymous",
      "time": 1576364157,
      "sticky": 0,
      "locked": 0,
      "cyclical": "0",
      "bumplocked": "0",
      "last_modified": 1576364157,
      "id": "1e453c"
    },
    {
      "no": 6539,
      "resto": 2942,
      "com": "<p class=\"body-line ltr \"><a onclick=\"highlightReply('6537', event);\" href=\"/pnd/res/2942.html#6537\">&gt;&gt;6537</a></p><p class=\"body-line ltr quote\">&gt;Literally nobody in the history of anybody has ever been paid to post here.</p><p class=\"body-line ltr \">Congrats on thinking anyone will believe that, admitted paid shill. We have court documents submitted by the fucking FBI itself that prove you wrong.</p>",
      "name": "Anonymous",
      "time": 1576365059,
      "sticky": 0,
      "locked": 0,
      "cyclical": "0",
      "bumplocked": "0",
      "last_modified": 1576365059,
      "id": "58b8db"
    }
  ]
}

const RESULT = {
  "id": 2942,
  "onTop": 1,
  "trimming": true,
  "commentsCount": 3,
  "attachmentsCount": 0,
  "updatedAt": new Date("2020-01-06T08:17:54.000Z"),
  "boardId": "pnd",
  "createdAt": new Date("2019-12-07T17:11:54.000Z"),
  "title": "META THREAD",
  "comments": [
    {
      "id": 2942,
      "createdAt": new Date("2019-12-07T17:11:54.000Z"),
      "title": "META THREAD",
      "content": [
        [
          "Any meta issues posted on /pnd/ to be entered in this thread"
        ],
        [
          "Current Rules for /pnd/:",
          "\n",
          "1. Follow the Global Rule.",
          "\n",
          "2. No spamming. Doing so will result in a  ban.",
          "\n",
          "3. Duplicate threads will be deleted. Check the Catalog.",
          "\n",
          "4. Non-politics related threads are frowned upon and may result in ban and deletion. Bans will be up to the Board Owner or Board Volunteer's discretion.",
          "\n",
          "If you don't get what /pnd/ is about, lurk more. That includes newfags."
        ]
      ],
      "authorId": "97e711",
      "attachments": [
        {
          "type": "picture",
          "picture": {
            "type": "image/png",
            "width": 1600,
            "height": 829,
            "size": 89429,
            "url": "https://media.128ducks.com/file_store/a4112168213cecee29edb4fc964138c74698ae91ab8014ad40bb10117680d4c3.png",
            "sizes": [
              {
                "type": "image/png",
                "width": 255,
                "height": 132,
                "url": "https://media.128ducks.com/file_store/thumb/a4112168213cecee29edb4fc964138c74698ae91ab8014ad40bb10117680d4c3.png"
              }
            ]
          }
        }
      ],
      "authorIdColor": "#30067a"
    },
    {
      "id": 6537,
      "createdAt": new Date("2019-12-14T22:55:57.000Z"),
      "content": [
        [
          {
            "type": "post-link",
            "boardId": "pnd",
            "threadId": 2942,
            "postId": 6536,
            "content": [
              {
                "type": "quote",
                "generated": true,
                "block": true,
                "content": "Deleted comment"
              }
            ],
            "url": "/pnd/2942#6536",
            "postWasDeleted": true
          },
          "\n",
          "Hey … who knows. Maybe the white nationalist wants all kinds of crazy posts just to juice the numbers. Also",
          "\n",
          {
            "type": "quote",
            "block": true,
            "content": "paid shills"
          },
          '\n',
          "Literally nobody in the history of anybody has ever been paid to post here."
        ]
      ],
      "authorId": "1e453c",
      "authorIdColor": "#252d45",
      "inReplyToRemoved": [
        6536
      ],
      "replies": [
        6539
      ]
    },
    {
      "id": 6539,
      "createdAt": new Date("2019-12-14T23:10:59.000Z"),
      "content": [
        [
          {
            "type": "post-link",
            "boardId": "pnd",
            "threadId": 2942,
            "postId": 6537,
            "content": [
            	{
            		type: 'quote',
                block: true,
            		content: 'Literally nobody in the history of anybody has ever been paid to post here.'
            	}
            ],
            "url": "/pnd/2942#6537"
          },
          '\n',
          "Congrats on thinking anyone will believe that, admitted paid shill. We have court documents submitted by the fucking FBI itself that prove you wrong."
        ]
      ],
      "authorId": "58b8db",
      "authorIdColor": "#3768b3",
      "inReplyTo": [
        6537
      ]
    }
  ]
}

describe('8ch.net', () => {
	it('should parse thread', () => {
		expectToEqual(
			EightChan({
				messages: {
					comment: {
						deleted: 'Deleted comment',
						external: 'Comment from another thread',
						default: 'Comment'
					}
				},
				boardId: 'pnd',
				threadId: 2942
			}).parseThread(API_RESPONSE),
			RESULT
		)
	})
})