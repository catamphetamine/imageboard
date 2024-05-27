import parseCreateThreadResponse from './parseCreateThreadResponse.js'

describe('parseCreateThreadResponse', () => {
	it('should parse create thread response', () => {
		// It's unknown what the API response is in case of "create thread" API call.
		// A current guess is that `tid` is `0` and `pid` is the thread id.
		parseCreateThreadResponse({ tid: 0, pid: 123 }).should.deep.equal({ id: 123 })
	})

	it('should parse create thread response (error: spam)', () => {
		expect(() => {
			parseCreateThreadResponse({ error: 'Error: Our system thinks your post is spam. Please reformat and try again.' })
		}).to.throw('SPAM_PROTECTION')
	})
})