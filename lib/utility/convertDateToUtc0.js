// Converts timezone to UTC+0 while preserving the same time.
export default function convertDateToUtc0(date) {
	// Doesn't account for leap seconds but I guess that's ok
	// given that javascript's own `Date()` doesn't either.
	// https://www.timeanddate.com/time/leap-seconds-background.html
	//
	// https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date/getTimezoneOffset
	//
	return new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000)
}