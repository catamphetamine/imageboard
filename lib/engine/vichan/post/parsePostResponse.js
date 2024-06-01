/**
 * Performs a "post" API request and parses the response.
 * @param  {string} response — API response JSON.
 * @return {object} Returns an object having an `id` property: either new thread ID or new comment ID.
 */
export default function parsePostResponse(response) {
	if (!response) {
  	throw new Error('UNEXPECTED_RESPONSE')
	}

	const { id } = response

	return { id: Number(id) }
}