import supportsFeature from './supportsFeature.js'

describe('supportsFeature', () => {
	it('should tell if an imageboard supports a feature (by imageboard id)', () => {
		supportsFeature('4chan', 'getThreads.sortByRatingDesc').should.equal(false)
		supportsFeature('2ch', 'getThreads.sortByRatingDesc').should.equal(true)
	})

	it('should tell if an imageboard supports a feature (by imageboard config object)', () => {
		supportsFeature({
			id: 'lainchan',
			domain: 'lainchan.org',
			engine: 'lainchan'
		}, 'getThreads.sortByRatingDesc').should.equal(false)
	})
})