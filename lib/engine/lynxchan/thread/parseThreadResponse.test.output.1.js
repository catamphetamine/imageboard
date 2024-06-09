export default {
  board: {
    "id": "a",
    "title": "Animu",
    description: undefined,
    post: {
      "attachmentsMaxCount": 4,
      "attachmentMaxSize": 134217728,
      "contentMaxLength": 16384,
      authorName: false,
      attachments: true,
      authorIcons: undefined,
      captchaRequired: undefined
    },
    stats: {
      commentsPerHour: undefined,
      uniquePostersPerDay: undefined
    },
    features: {}
  },
  thread: {
    id: 1534,
    boardId: "a",
    title: "Was ist dieses Anime",
    createdAt: new Date("2019-06-01T16:10:01.564Z"),
    comments: [
      {
        id: 1534,
        createdAt: new Date("2019-06-01T16:10:01.564Z"),
        title: "Was ist dieses Anime",
        content: [
          [
            'Hallo Bernd, kennst du diese Animes?'
          ],
          [
            'Danke Bernd'
          ],
          [
            'Dein Bernd'
          ]
        ],
        attachments: [{
          type: 'picture',
          picture: {
            type: 'image/jpeg',
            url: "/.media/5f1d59337225ab646b3251d1cb2ccfaa-imagejpeg.jpg",
            width: 768,
            height: 443,
            size: 58589,
            sizes: [{
              type: 'image/jpeg',
              url: "/.media/t_5f1d59337225ab646b3251d1cb2ccfaa-imagejpeg",
              width: 200,
              height: Math.round(200 * (443 / 768))
            }]
          }
        }]
      },
      {
        id: 1535,
        content: [
          [
            '1. Strike Witches (Erika Hartman)',
            '\n',
            '2. Girl und Panzer (Matsumoto Riko)'
          ]
        ],
        createdAt: new Date("2019-06-01T17:03:10.169Z")
      },
      {
        id: 1542,
        content: [
          [
            "Bernde, die diese Anime mochten, hatten auch an folgenden Titeln ihre Freude"
          ]
        ],
        createdAt: new Date("2019-06-02T17:18:07.591Z"),
        attachments: [
          {
            type: 'picture',
            picture: {
              type: 'image/jpeg',
              url: "/.media/9eb5f926cc9f3a9489f3ba9f693dfbc4-imagejpeg.jpg",
              width: 800,
              height: 450,
              size: 191181,
              sizes: [{
                type: 'image/jpeg',
                url: "/.media/t_9eb5f926cc9f3a9489f3ba9f693dfbc4-imagejpeg",
                width: 200,
                height: Math.round(200 * (450 / 800))
              }]
            }
          },
          {
            type: 'picture',
            picture: {
              type: 'image/jpeg',
              url: "/.media/bd91d1becebd847b67eb2b439da16557-imagejpeg.jpg",
              width: 800,
              height: 450,
              size: 190141,
              sizes: [{
                type: 'image/jpeg',
                url: "/.media/t_bd91d1becebd847b67eb2b439da16557-imagejpeg",
                width: 200,
                height: Math.round(200 * (450 / 800))
              }]
            }
          }
        ]
      }
    ],
    commentsCount: 3,
    attachmentsCount: 3,
    commentAttachmentsCount: 2
  }
}