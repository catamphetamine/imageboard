import fetch, { FormData } from 'node-fetch'
import imageboard, { getCommentText } from 'imageboard'

const IMAGEBOARD_ID = '4chan'

const fourChan = imageboard(IMAGEBOARD_ID, {
  // Sends an HTTP request.
  // Any HTTP request library can be used here.
  request: (method, url, { body, headers }) => {
    // If request "Content-Type" is set to be "multipart/form-data",
    // convert the `body` object to a `FormData` instance.
    if (headers['content-type'] === 'multipart/form-data') {
      body = createFormData(body)
      // Remove `Content-Type` header so that it autogenerates it from the `FormData`.
      // Example: "multipart/form-data; boundary=----WebKitFormBoundaryZEglkYA7NndbejbB".
      delete headers['content-type']
    }
    return fetch(url, {
      method,
      headers,
      body,
      // By default, `fetch()` follows any redirects in the process.
      // Many imageboards have API endpoints that set cookies and then redirect.
      // If `fetch()` was to follow those redirects, those `set-cookie` headers
      // from a `status: 302` response would be ignored, and the `imageboard` library
      // should be able to inspect those `set-cookie` headers in order to extract
      // their values. So `fetch()` is specifically configured to not follow redirects.
      redirect: 'manual'
    }).then((response) => {
      if (response.status < 400) {
        return response.text().then((responseText) => ({
          // If there were any redirects in the proces,
          // `response.url` is gonna be the final "redirected to" URL.
          url: response.url,
          status: response.status,
          headers: response.headers,
          responseText
        }))
      }
      return rejectWithErrorForResponse(response)
    })
  }
})

// Creates an error from a `fetch()` response.
// Returns a `Promise` and rejects it with the error.
function rejectWithErrorForResponse(response) {
  const error = new Error(response.statusText)
  // If there were any redirects in the proces,
  // `response.url` is gonna be the final "redirected to" URL.
  error.url = response.url
  error.status = response.status
  error.headers = response.headers
  return response.text().then(
    (responseText) => {
      error.responseText = responseText
      throw error
    },
    (error_) => {
      throw error
    }
  )
}

// Converts an object to a `FormData` instance.
function createFormData(body) {
  const formData = new FormData()
  if (body) {
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
  }
  return formData
}

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