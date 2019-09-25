import {
	default as Chan,
	getConfig,
	compileWordPatterns,
	generateQuotes,
	generatePreview,
	generateThreadTitle
} from '../index'

describe('exports', () => {
	it('should export ES6', () => {
		Chan.should.be.a('function')
		getConfig.should.be.a('function')
		compileWordPatterns.should.be.a('function')
		generateQuotes.should.be.a('function')
		generatePreview.should.be.a('function')
		generateThreadTitle.should.be.a('function')
	})

	it('should export CommonJS', () => {
		const Library = require('../index.commonjs')
		Library.should.be.a('function')
		Library.default.should.be.a('function')
		Library.getConfig.should.be.a('function')
		Library.compileWordPatterns.should.be.a('function')
		Library.generateQuotes.should.be.a('function')
		Library.generatePreview.should.be.a('function')
		Library.generateThreadTitle.should.be.a('function')
	})
})