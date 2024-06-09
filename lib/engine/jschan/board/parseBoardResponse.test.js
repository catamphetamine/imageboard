import parseBoardResponse from './parseBoardResponse.js'

describe('parseBoardResponse', () => {
	it('should parse board response', () => {
		parseBoardResponse(BOARD_RESPONSE, { boardId: 'pol', status: 200 }).should.deep.equal({
			id: 'pol',
			title: undefined,
			description: undefined,
			language: 'en',
			explicitContent: undefined,
			features: {
				defaultAuthorName: 'Anonymous'
			},
			post: {
				authorEmail: false,
				authorEmailSage: true,
				authorId: undefined,
				authorCountry: undefined,
				authorName: true,
				// authorIcons: ...
				attachmentsMaxCount: 10,
				contentMinLength: 0,
				contentMaxLength: 20000,
				contentRequired: undefined,
				attachmentsRequired: undefined,
				attachmentSpoiler: undefined,
				mainCommentContentMinLength: 0,
				mainCommentContentMaxLength: 20000,
				mainCommentAttachmentRequired: true,
				mainCommentContentRequired: false,
				threadTitleRequired: false,
				attachmentTypes: [
					'image:animated',
					'image',
					'video',
					'audio',
					'file'
				]
			}
		})
	})
})

const BOARD_RESPONSE = {
	"customPages": [],
	"announcement": {
		"raw": "",
		"markdown": ""
	},
	"allowedFileTypes": {
		"animatedImage": true,
		"image": true,
		"video": true,
		"audio": true,
		"other": true
	},
	"maxFiles": 10,
	"captchaMode": 1,
	"forceAnon": false,
	"sageOnlyEmail": true,
	"customFlags": true,
	"forceThreadMessage": false,
	"forceThreadFile": true,
	"forceThreadSubject": false,
	"disableReplySubject": false,
	"minThreadMessageLength": 0,
	"minReplyMessageLength": 0,
	"maxThreadMessageLength": 20000,
	"maxReplyMessageLength": 20000,
	"defaultName": "Anonymous",
	"language": "en-GB"
}
