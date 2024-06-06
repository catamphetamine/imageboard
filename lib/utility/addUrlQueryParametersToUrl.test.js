import addUrlQueryParametersToUrl from './addUrlQueryParametersToUrl.js'

describe('utility/addUrlQueryParametersToUrl', () => {
	it('should add URL query parameters', () => {
		addUrlQueryParametersToUrl('/some/path?a=b', { c: 'd' }).should.equal('/some/path?a=b&c=d')
		addUrlQueryParametersToUrl('https://example.com/some/path?a=b', { c: 'd' }).should.equal('https://example.com/some/path?a=b&c=d')
		addUrlQueryParametersToUrl('https://example.com/some/path', { c: 'd' }).should.equal('https://example.com/some/path?c=d')
		addUrlQueryParametersToUrl('https://example.com/some/path?a=b#hash', { c: 'd' }).should.equal('https://example.com/some/path?a=b&c=d#hash')
		addUrlQueryParametersToUrl('https://example.com/some/path#hash', { c: 'd' }).should.equal('https://example.com/some/path?c=d#hash')
	})
})