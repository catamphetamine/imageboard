// In `/{threadId}.json` and in `/{boardId}/{n}.json` API responses,
// `enable_xxx` flags are `true`/`false`.
//
// In `/{boardId}/catalog.json` API response,
// `enable_xxx` flags are `1`/`0`.
//
export default function getBoardFlagValue(value) {
	if (value === undefined) {
		// Value is missing.
		console.warn('Board flag not found')
		return undefined
	} else if (typeof value === 'boolean') {
		return value
	} else if (typeof value === 'number') {
		return value === 1
	} else {
		console.warn(`Unsupported board flag value "${value}" of type: ${value === null ? 'null' : typeof value}`)
		return undefined
	}
}