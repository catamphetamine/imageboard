import throwErrorForErrorResponse from '../throwErrorForErrorResponse.js'

// https://fatchan.gitgud.site/jschan-docs/#board-settings
export default function parseBoardResponse(response, { boardId, status }) {
	throwErrorForErrorResponse(response, { status })

	const board = {
		id: boardId,
		features: {}
	}

  board.attachmentTypes = []

  if (response.allowedFileTypes.animatedImage) {
  	board.attachmentTypes.push('imageAnimated')
  }

  if (response.allowedFileTypes.image) {
  	board.attachmentTypes.push('image')
  }

  if (response.allowedFileTypes.video) {
  	board.attachmentTypes.push('video')
  }

  if (response.allowedFileTypes.audio) {
  	board.attachmentTypes.push('audio')
  }

  if (response.allowedFileTypes.other) {
  	board.attachmentTypes.push('file')
  }

	board.attachmentsMaxCount = response.maxFiles

	if (response.forceAnon) {
		board.features.authorName = false
	}

	if (response.sageOnlyEmail) {
		board.features.authorEmail = false
	}

	if (response.customFlags) {
		board.features.badges = true
	}

	if (response.forceThreadMessage) {
		board.mainCommentContentRequired = true
	}

	if (response.forceThreadFile) {
		board.mainCommentAttachmentRequired = true
	}

	if (response.forceThreadSubject) {
		board.threadTitleRequired = true
	}

	if (response.disableReplySubject) {
		board.features.commentTitle = false
		// If thread title is disabled, set `board.features.threadTitle = false`.
	}

	if (response.minThreadMessageLength > 0) {
		board.mainCommentContentMinLength = response.minThreadMessageLength
	}

	if (response.minReplyMessageLength > 0) {
		board.commentContentMinLength = response.minReplyMessageLength
	}

	board.mainCommentContentMaxLength = response.maxThreadMessageLength
	board.commentContentMaxLength = response.maxReplyMessageLength

	board.defaultAuthorName = response.defaultName

	return board
}