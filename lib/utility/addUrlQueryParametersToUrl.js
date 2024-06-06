export default function addUrlQueryParametersToUrl(url, parameters) {
	// Split the `url` into the parts before and after the "#" character.
	const hashIndex = url.indexOf('#')
	let urlBeforeHash = url
	let urlStartingFromHash = ''
	if (hashIndex >= 0) {
		urlBeforeHash = url.slice(0, hashIndex)
		urlStartingFromHash = url.slice(hashIndex)
	}

	return urlBeforeHash +
		(urlBeforeHash.indexOf('?') < 0 ? '?' : '&') +
		// Some external APIs might be using their own in-house "standard" for encoding array values in URL query parameters.
		// For example, `jschan` engine uses `/?items=item1&items=item2` notation when passing an `items: ['item1', 'item2']` parameter.
		// There seems to be no standard way of passing arrays in URL query parameters:
		// https://medium.com/raml-api/arrays-in-query-params-33189628fa68
		// As a result, this URL query parameter stringifier doesn't use any of those methods.
		Object.keys(parameters).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(String(parameters[key]))}`).join('&') +
		urlStartingFromHash
}