export default function addUrlQueryParametersToUrl(url, parameters) {
	return url +
		(url.indexOf('?') < 0 ? '?' : '&') +
		Object.keys(parameters).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(String(parameters[key]))}`).join('&')
}