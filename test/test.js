import Imageboard from 'imageboard/node'
import { getCommentText, createHttpRequestFunction } from 'imageboard'

// Usage examples:
// * `npm run test-chan` — uses `4chan`
// * `npm run test-chan kohlchan` — uses `kohlchan`
// * etc
const IMAGEBOARD_ID = process.argv[2] || '4chan'

const imageboard = Imageboard(IMAGEBOARD_ID)

// // Test `2ch.hk` really old archived thread.
// return imageboard.getThread({
//   boardId: 'b',
//   threadId: 119034529
// }).then((thread) => {
//   console.log(JSON.stringify(thread, null, 2))
// });

// Prints the first 10 boards.
imageboard.getBoards().then(({ boards }) => {
  const boardsList = boards.slice(0, 10).map(({
    id,
    title,
    category,
    description
  }) => {
    return `* ${category ? '[' + category + '] ' : ''}/${id}/ — ${title}${description ? ' — ' + description : ''}`
  })
  console.log(boardsList.join('\n'))

  console.log()
  console.log('===============================================')
  console.log('=                 Board threads               =')
  console.log('===============================================')
  console.log()

  // Prints the first five threads on `/a/` board.
  return imageboard.getThreads({
    boardId: boards[0].id
  }).then(({ threads }) => {
    const threadsList = threads.slice(0, 5).map(({
      id,
      title,
      createdAt,
      commentsCount,
      attachmentsCount,
      comments
    }) => {
      return [
        `#${id}`,
        createdAt,
        title,
        getCommentText(comments[0]) || '(empty)',
        `${commentsCount} comments, ${attachmentsCount} attachments`
      ].join('\n\n')
    })
    console.log(threadsList.join('\n\n~~~~~~~~~~~~~~~~~~~~~~~~~\n\n'))

    console.log()
    console.log('===============================================')
    console.log('=                 First thread                =')
    console.log('===============================================')
    console.log()

    // Prints the first five comments of thread #193605320 on `/a/` board.
    return imageboard.getThread({
      boardId: boards[0].id,
      threadId: threads[0].id
    }).then(({ thread }) => {
      const commentsList = thread.comments.slice(0, 5).map((comment) => {
        const {
          id,
          title,
          createdAt,
          replies,
          attachments
        } = comment
        const parts = []
        parts.push(`#${id}`)
        parts.push(createdAt)
        if (title) {
          parts.push(title)
        }
        parts.push(getCommentText(comment) || '(empty)')
        if (attachments) {
          parts.push(`${attachments.length} attachments`)
        }
        if (replies) {
          parts.push(`${replies.length} replies`)
        }
        return parts.join('\n\n')
      })
      console.log(commentsList.join('\n\n~~~~~~~~~~~~~~~~~~~~~~~~~\n\n'))
    })
  })
})