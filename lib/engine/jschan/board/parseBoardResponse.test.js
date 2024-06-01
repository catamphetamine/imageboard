import parseBoardResponse from './parseBoardResponse.js'

describe('parseBoardResponse', () => {
	it('should parse board response', () => {
		parseBoardResponse(BOARD_RESPONSE, { boardId: 'pol', status: 200 }).should.deep.equal({
			id: 'pol',
			attachmentTypes: [
				'imageAnimated',
				'image',
				'video',
				'audio',
				'file'
			],
			attachmentsMaxCount: 10,
			commentContentMaxLength: 20000,
			mainCommentContentMaxLength: 20000,
			mainCommentAttachmentRequired: true,
			defaultAuthorName: 'Anonymous',
			features: {
				authorEmail: false,
				badges: true
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
