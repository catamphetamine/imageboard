/**
 * Performs a "report" API request and parses the response.
 * @param  {object} response — API response JSON.
 * @return {void} Throws an error in case of an error.
 */
export default function parseReportResponse(response) {
	if (response.result === 1) {
		return;
	}
	if (response.error) {
		throw new Error(response.error.code + ': ' + response.error.message)
	}
	throw new Error('Unsupported response: ' + JSON.stringify(response))
}