import throwErrorForErrorResponse from '../throwErrorForErrorResponse.js'

import getLanguageFromLocale from '../../../utility/getLanguageFromLocale.js'

// https://fatchan.gitgud.site/jschan-docs/#board-settings
export default function parseBoardResponse(response, { boardId, status }) {
	throwErrorForErrorResponse(response, { status })

	// https://gitgud.io/fatchan/jschan/-/blob/master/models/forms/changeboardsettings.js
	const board = {
		id: boardId,
		title: response.name,
		description: response.description,

		language: response.language && getLanguageFromLocale(response.language),
		explicitContent: response.sfw,

		post: {
			attachmentTypes: getAttachmentTypes(response.allowedFileTypes),
			attachmentsMaxCount: response.maxFiles,

			authorName: !response.forceAnon,

			authorEmail: !response.sageOnlyEmail,
			authorEmailSage: true,

			authorId: response.ids,
			authorCountry: response.geoFlags,

			// Where is a list of available icons?
			// authorIcons: response.customFlags ? [...] : undefined,

			mainCommentContentMinLength: response.minThreadMessageLength,
			mainCommentContentMaxLength: response.maxThreadMessageLength,

			contentMinLength: response.minReplyMessageLength,
			contentMaxLength: response.maxReplyMessageLength,

			mainCommentContentRequired: response.forceThreadMessage,
			mainCommentAttachmentRequired: response.forceThreadFile,

			contentRequired: response.forceReplyMessage,
			attachmentsRequired: response.forceReplyFile,

			threadTitleRequired: response.forceThreadSubject,

			attachmentSpoiler: response.userPostSpoiler

			// title: !respose.disableReplySubject,
			// threadTitle: true
		},

		features: {
			defaultAuthorName: response.defaultName
		}
	}

	return board
}

function getAttachmentTypes(allowedFileTypes) {
	const attachmentTypes = []

  if (allowedFileTypes.animatedImage) {
  	attachmentTypes.push('image:animated')
  }

  if (allowedFileTypes.image) {
  	attachmentTypes.push('image')
  }

  if (allowedFileTypes.video) {
  	attachmentTypes.push('video')
  }

  if (allowedFileTypes.audio) {
  	attachmentTypes.push('audio')
  }

  if (allowedFileTypes.other) {
  	attachmentTypes.push('file')
  }

  return attachmentTypes
}