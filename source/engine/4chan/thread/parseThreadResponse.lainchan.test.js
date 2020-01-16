import expectToEqual from '../../../utility/expectToEqual'

import LainChan from '../../../chan/lainchan'

const API_RESPONSE = {
  "posts": [
    {
      "no": 14298,
      "com": "Hey Lainchan, long time no post. <br/><br/>I'm going to be working through \"Learn You a Haskell for Great Good\", with the intent of writing some (yet to be decided) project at the end. I estimate it'll take me around a month or so, but honestly I've no idea.<br/><br/>You can find the book here:<br/><br/><a href=\"http://learnyouahaskell.com/\" rel=\"nofollow\" target=\"_blank\">http://learnyouahaskell.com/</a><br/><br/>If anyone is interested in working through it together, I've made a Volafile room - come and say hi or something:<br/><br/><a href=\"https://volafile.org/r/z7b3gqwg\" rel=\"nofollow\" target=\"_blank\">https://volafile.org/r/z7b3gqwg</a>",
      "name": "Gitgood",
      "trip": "!MY2dR21qWo",
      "time": 1563642417,
      "omitted_posts": 0,
      "omitted_images": 0,
      "sticky": 0,
      "locked": 0,
      "cyclical": "0",
      "last_modified": 1578949337,
      "tn_h": 200,
      "tn_w": 200,
      "h": 200,
      "w": 200,
      "fsize": 747013,
      "filename": "learn-you",
      "ext": ".pdf",
      "tim": "1563642402862-0",
      "md5": "+m3jA2myLp957vKZCreXLg==",
      "extra_files": [
        {
          "tn_h": 300,
          "tn_w": 227,
          "h": 499,
          "w": 378,
          "fsize": 26130,
          "filename": "great-good",
          "ext": ".jpg",
          "tim": "1563642402862-1",
          "md5": "QbRqg8Y+FSGWGJwiddezPQ=="
        }
      ],
      "resto": 0
    }
  ]
}

const RESULT = {
  "id": 14298,
  "commentsCount": 0,
  "attachmentsCount": 0,
  "updatedAt": new Date("2020-01-13T21:02:17.000Z"),
  "boardId": "λ",
  "createdAt": new Date("2019-07-20T17:06:57.000Z"),
  "title": "Hey Lainchan, long time no post.",
  "comments": [
    {
      "id": 14298,
      "createdAt": new Date("2019-07-20T17:06:57.000Z"),
      "authorName": "Gitgood",
      "authorTripCode": "!MY2dR21qWo",
      "content": [
        [
          "Hey Lainchan, long time no post."
        ],
        [
          "I'm going to be working through \"Learn You a Haskell for Great Good\", with the intent of writing some (yet to be decided) project at the end. I estimate it'll take me around a month or so, but honestly I've no idea."
        ],
        [
          "You can find the book here:"
        ],
        [
          {
            "content": "learnyouahaskell.com",
            "contentGenerated": true,
            "type": "link",
            "url": "http://learnyouahaskell.com/"
          }
        ],
        [
          "If anyone is interested in working through it together, I've made a Volafile room - come and say hi or something:"
        ],
        [
          {
            "content": "volafile.org/r/z7b3gqwg",
            "contentGenerated": true,
            "type": "link",
            "url": "https://volafile.org/r/z7b3gqwg"
          }
        ]
      ],
      "attachments": [
        {
          "type": "file",
          "file": {
            "type": "application/pdf",
            "ext": ".pdf",
            "name": "learn-yo",
            "size": 747013,
            "width": 200,
            "height": 200,
            "url": "https://lainchan.org/λ/src/1563642402862-0.pdf",
            "picture": {
              "width": 200,
              "height": 200,
              "type": "image/png",
              "url": "https://lainchan.org/λ/thumb/1563642402862-0.png"
            }
          }
        },
        {
          "type": "picture",
          "picture": {
            "type": "image/jpeg",
            "width": 378,
            "height": 499,
            "size": 26130,
            "url": "https://lainchan.org/λ/src/1563642402862-1.jpg",
            "sizes": [ {
              "type": "image/png",
              "width": 227,
              "height": 300,
              "url": "https://lainchan.org/λ/thumb/1563642402862-1.png"
            }]
          }
        }
      ]
    }
  ]
}

describe('lainchan.org', () => {
	it('should parse thread', () => {
		expectToEqual(
			new LainChan({
				messages: {
					comment: {
						deleted: 'Deleted comment',
						hidden: 'Hidden comment',
						external: 'Comment from another thread',
						default: 'Comment'
					}
				},
				boardId: 'λ',
				threadId: 14298
			}).parseThread(API_RESPONSE),
			RESULT
		)
	})
})