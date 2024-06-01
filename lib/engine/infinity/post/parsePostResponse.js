export default function parsePostResponse(response) {
	const id = Number(response.id)
	if (!isNaN(id)) {
		return {
			id: Number(response.id)
		}
	}

	throw new Error('Unsupported response: ' + JSON.stringify(response))
}