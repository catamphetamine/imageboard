import getCookie from './getCookie.js'

export default function getCookieValue(...args) {
	const cookie = getCookie(...args)
	if (cookie) {
		return cookie.value
	}
}