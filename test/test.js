require('regenerator-runtime/runtime')
var fetch = require('node-fetch')
var imageboard = require('..')
var getCommentText = require('..').getCommentText

var fourChan = imageboard('4chan', {
  // Sends an HTTP request.
  // Any HTTP request library can be used here.
  // Must return a `Promise` resolving to response text.
  request: (method, url, { body, headers }) => {
    return fetch(url, { method, headers, body }).then((response) => {
      if (response.ok) {
        return response.text()
      }
      throw new Error(response.status)
    })
  }
})

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
})

// Prints the first five threads on `/a/` board.
fourChan.getThreads({
  boardId: 'a'
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
})