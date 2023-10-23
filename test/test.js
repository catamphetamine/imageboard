import fetch, { FormData } from 'node-fetch'
import imageboard, { getCommentText } from 'imageboard'

const IMAGEBOARD_ID = '4chan'

const fourChan = imageboard(IMAGEBOARD_ID, {
  // Sends an HTTP request.
  // Any HTTP request library can be used here.
  // Must return a `Promise` resolving to response text.
  request: (method, url, { body, headers }) => {
    if (headers['Content-Type'] === 'multipart/form-data') {
      const formData = new FormData()
      for (const key of Object.keys(body)) {
        if (body[key] !== undefined && body[key] !== null) {
          if (Array.isArray(body[key])) {
            for (const element of body[key]) {
              formData.append(key + '[]', element)
            }
          } else {
            formData.append(key, body[key])
          }
        }
      }
      body = formData
      // Remove `Content-Type` header so that it autogenerates it from the `FormData`.
      // Example: "multipart/form-data; boundary=----WebKitFormBoundaryZEglkYA7NndbejbB".
      delete headers['Content-Type']
    }
    return fetch(url, { method, headers, body }).then((response) => {
      if (response.ok) {
        return response.text().then((responseText) => ({
          url: response.url,
          response: responseText
        }))
      }
      const error = new Error(response.statusText)
      // Set HTTP Response status code on the error.
      error.status = response.status
      throw error
    })
  }
})

// // Test `2ch.hk` really old archived thread.
// return fourChan.getThread({
//   boardId: 'b',
//   threadId: 119034529
// }).then((thread) => {
//   console.log(JSON.stringify(thread, null, 2))
// });

// Prints the first 10 boards.
fourChan.getBoards().then((boards) => {
  const boardsList = boards.slice(0, 10).map(({
    id,
    title,
    category,
    description
  }) => {
    return `* [${category}] /${id}/ — ${title} — ${description}`
  })
  console.log(boardsList.join('\n'))

  console.log()
  console.log('===============================================')
  console.log('=                 Board threads               =')
  console.log('===============================================')
  console.log()

  // Prints the first five threads on `/a/` board.
  return fourChan.getThreads({
    boardId: boards[0].id
  }).then((threads) => {
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
    return fourChan.getThread({
      boardId: boards[0].id,
      threadId: threads[0].id
    }).then((thread) => {
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