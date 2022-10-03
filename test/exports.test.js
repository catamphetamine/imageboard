import {
	default as Chan,
	getConfig,
	getCommentText,
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
		getCommentText.should.be.a('function')
		// generateQuotes.should.be.a('function')
		// generatePreview.should.be.a('function')
		// generateThreadTitle.should.be.a('function')
		// setPostLinkQuotes.should.be.a('function')
	})
})