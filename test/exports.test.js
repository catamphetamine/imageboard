import {
	default as Chan,
	getConfig,
	getCommentText,
	sortThreadsWithPinnedOnTop,
	// generateQuotes,
	// generatePreview,
	// generateThreadTitle,
	// setPostLinkQuotes
} from '../index.js'

describe('exports', () => {
	it('should export functions', () => {
		Chan.should.be.a('function')
		getConfig.should.be.a('function')
		getConfig('4chan').id.should.equal('4chan')
		// Tests the merge result of `94chan/index.json` and `jschan/settings.json`.
		getConfig('94chan').accessTokenCookieName.should.equal('connect.sid')
		getCommentText.should.be.a('function')
		sortThreadsWithPinnedOnTop.should.be.a('function')
		// generateQuotes.should.be.a('function')
		// generatePreview.should.be.a('function')
		// generateThreadTitle.should.be.a('function')
		// setPostLinkQuotes.should.be.a('function')
	})
})